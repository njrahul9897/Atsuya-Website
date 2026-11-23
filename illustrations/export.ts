// Draws a modelled scene (see ./model) as isometric vector art.
//
// How it works:
//   1. Every solid becomes a "node": the visible faces to draw, plus flat convex "proxies" that
//      stand in for it when working out what hides what.
//   2. Nodes are ordered back to front. For each pair whose proxies overlap on screen, the one
//      nearer the viewer at the overlap is drawn later. That is exact for solids that do not
//      intersect, whatever their rotation, so no depth buffer is needed.
//   3. Faces are shaded with three flat tones (top, left, right). Curved surfaces get a gradient
//      through the same tones.
//   4. The parts the page animates (devices, data lines, the engineer) are kept apart from the
//      rest. The result is a stack of layers: static ones saved as SVG images, animated ones
//      returned as inline SVG, in the order they must be painted.

import * as THREE from "three";
import { SKY, type Style } from "./model/kit";

type V2 = [number, number];
type V3 = THREE.Vector3;
type Box = [number, number, number, number];
const v3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

const U = 40; // pixels per metre along each axis
const COS = Math.cos(Math.PI / 6);
const ORTHO = Math.sqrt(1.5); // a length facing the viewer draws this much longer than U
const VIEW = v3(1, 1, 1).normalize(); // toward the viewer
const LIGHT = v3(-0.5, 0.8, 0.33).normalize(); // toward the light: top lit, left half lit, right in shade
const SHADOW: V2 = [0.5, -0.24]; // where a point's shadow lands on the ground, per metre of height (x, z)

// --- Geometry helpers ---------------------------------------------------------------------------
const project = (p: V3): V2 => [(p.x - p.z) * COS * U, (p.x + p.z) * 0.5 * U - p.y * U];
const sub = (a: V2, b: V2): V2 => [a[0] - b[0], a[1] - b[1]];
const lerp = (a: V2, b: V2, t: number): V2 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const cross = (a: V2, b: V2) => a[0] * b[1] - a[1] * b[0];
const dot = (a: V2, b: V2) => a[0] * b[0] + a[1] * b[1];

const f = (n: number) => {
  const r = Math.round(n * 10) / 10;
  return r === 0 ? "0" : String(r);
};
const f2 = (n: number) => String(Math.round(n * 100) / 100);
const f3 = (n: number) => String(Math.round(n * 1000) / 1000);
const pt = (p: V2) => `${f(p[0])} ${f(p[1])}`;
const polygon = (points: V2[]) => "M" + points.map(pt).join("L") + "Z";
const escapeXml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function signedArea(p: V2[]): number {
  let sum = 0;
  for (let i = 0; i < p.length; i++) sum += cross(p[i], p[(i + 1) % p.length]);
  return sum / 2;
}
function boxOf(p: V2[]): Box {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of p) {
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  return [x0, y0, x1, y1];
}
const boxesMeet = (a: Box, b: Box) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
const union = (a: Box, b: Box): Box => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])];

// Sutherland–Hodgman: the part of `subject` inside the convex `clipper`. Both wind the same way.
function clip(subject: V2[], clipper: V2[]): V2[] {
  let out = subject;
  for (let i = 0; i < clipper.length && out.length; i++) {
    const a = clipper[i];
    const edge = sub(clipper[(i + 1) % clipper.length], a);
    const input = out;
    out = [];
    for (let j = 0; j < input.length; j++) {
      const p = input[j];
      const q = input[(j + 1) % input.length];
      const sp = cross(edge, sub(p, a));
      const sq = cross(edge, sub(q, a));
      if (sp >= 0) out.push(p);
      if ((sp > 0 && sq < 0) || (sp < 0 && sq > 0)) out.push(lerp(p, q, sp / (sp - sq)));
    }
  }
  return out;
}
function centroid(p: V2[]): V2 {
  let x = 0, y = 0, area = 0;
  for (let i = 0; i < p.length; i++) {
    const a = p[i];
    const b = p[(i + 1) % p.length];
    const c = cross(a, b);
    area += c;
    x += (a[0] + b[0]) * c;
    y += (a[1] + b[1]) * c;
  }
  if (Math.abs(area) < 1e-9) return [p.reduce((s, q) => s + q[0], 0) / p.length, p.reduce((s, q) => s + q[1], 0) / p.length];
  return [x / (3 * area), y / (3 * area)];
}
function convexHull(points: V2[]): V2[] {
  const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const build = (list: V2[]) => {
    const hull: V2[] = [];
    for (const q of list) {
      while (hull.length >= 2 && cross(sub(hull[hull.length - 1], hull[hull.length - 2]), sub(q, hull[hull.length - 1])) <= 0) hull.pop();
      hull.push(q);
    }
    hull.pop();
    return hull;
  };
  return [...build(p), ...build(p.reverse())];
}

// An ellipse given as the image of the unit circle (or sphere) under the columns of a 2×n matrix.
type Ellipse = { rx: number; ry: number; rot: number };
function ellipseOf(columns: V2[]): Ellipse {
  let a = 0, b = 0, c = 0;
  for (const [x, y] of columns) {
    a += x * x;
    b += x * y;
    c += y * y;
  }
  const mean = (a + c) / 2;
  const spread = Math.hypot((a - c) / 2, b);
  return { rx: Math.sqrt(mean + spread), ry: Math.sqrt(Math.max(0, mean - spread)), rot: (0.5 * Math.atan2(2 * b, a - c) * 180) / Math.PI };
}
// An arc of the ellipse from where the pen is, through `via`, to `to` (two pieces, so each is under 180°).
function arcVia(e: Ellipse, from: V2, via: V2, to: V2): string {
  if (e.rx < 0.08) return "L" + pt(to);
  const sweep = cross(sub(via, from), sub(to, via)) > 0 ? 1 : 0;
  const head = `A${f2(e.rx)} ${f2(e.ry)} ${f(e.rot)} 0 ${sweep} `;
  return head + pt(via) + head + pt(to);
}
const ellipsePath = (e: Ellipse, a: V2, b: V2) => `M${pt(a)}A${f2(e.rx)} ${f2(e.ry)} ${f(e.rot)} 1 1 ${pt(b)}A${f2(e.rx)} ${f2(e.ry)} ${f(e.rot)} 1 1 ${pt(a)}Z`;

// --- Colour ---------------------------------------------------------------------------------------
const rgb = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const hex = (v: number[]) => "#" + v.map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0")).join("");
const mix = (a: string, b: string, t: number) => (t <= 0 ? a : t >= 1 ? b : hex(rgb(a).map((n, i) => n + (rgb(b)[i] - n) * t)));
const step = (t: number) => Math.round(t * 8) / 8;

// The tone a surface facing `n` takes. Faces square to the axes get exactly their flat tone.
function shade(style: Style, n: V3): string {
  if (style.emissive) return style.emissive;
  const [top, left, right] = style.tones;
  const s = n.dot(LIGHT);
  if (s >= LIGHT.y - 1e-3) return top;
  if (s >= LIGHT.z) return mix(left, top, step((s - LIGHT.z) / (LIGHT.y - LIGHT.z)));
  if (s >= LIGHT.x) return mix(right, left, step((s - LIGHT.x) / (LIGHT.z - LIGHT.x)));
  return mix(right, "#000000", step((LIGHT.x - s) / (1 + LIGHT.x)) * 0.3);
}

// --- Nodes ----------------------------------------------------------------------------------------
type Proxy = { poly: V2[]; n: V3; k: number; box: Box; top: number };
type Prim = { fill: string; d: string; opacity?: number; cls?: string } | { raw: string };
type Dynamic = { cls: string; index?: number; hot?: boolean };
type Node = {
  proxies: Proxy[];
  box: Box;
  key: number; // how near the viewer its middle is
  top: number; // its highest point
  centre: V3;
  order: number; // the order it was declared in: ties go to the later one
  dynamic?: Dynamic;
  overlay?: boolean;
  backdrop?: boolean;
  shadow?: V3[];
  draw: (ctx: Ctx) => Prim[];
};
type Env = { shadow: boolean; dynamic: boolean };

function makeProxy(points: V3[], normal?: V3): Proxy | null {
  let poly = points.map(project);
  const area = signedArea(poly);
  if (Math.abs(area) < 0.05) return null;
  if (area < 0) poly = poly.slice().reverse();
  const n = normal ? normal.clone() : points[1].clone().sub(points[0]).cross(points[2].clone().sub(points[0])).normalize();
  if (n.dot(VIEW) < 0) n.negate();
  if (n.dot(VIEW) < 1e-4) return null;
  return { poly, n, k: n.dot(points[0]), box: boxOf(poly), top: Math.max(...points.map((p) => p.y)) };
}
// How far along the line of sight a proxy's plane is at a point on screen (larger is nearer).
function depthAt(p: Proxy, s: V2): number {
  const a = s[0] / (COS * U);
  const q = s[1] / U / 1.5;
  const x = (q + a) / 2;
  const z = (q - a) / 2;
  return (p.k - (p.n.x * x - p.n.y * q + p.n.z * z)) / (p.n.x + p.n.y + p.n.z);
}

let counter = 0;
function makeNode(proxies: (Proxy | null)[], centre: V3, draw: Node["draw"], extra: Partial<Node> = {}): Node | null {
  const kept = proxies.filter((p): p is Proxy => p !== null);
  if (!kept.length) return null;
  return { proxies: kept, box: kept.map((p) => p.box).reduce(union), centre, key: centre.x + centre.y + centre.z, top: Math.max(...kept.map((p) => p.top)), order: counter++, draw, ...extra };
}

// Gradients and other shared definitions for one layer.
class Ctx {
  defs: string[] = [];
  classes = new Map<string, string>();
  hot = false;
  private ids = new Map<string, string>();
  private n = 0;
  constructor(readonly inline: boolean, readonly prefix: string) {}
  private next() {
    return this.prefix + (this.n++).toString(36);
  }
  private shared(key: string, make: (id: string) => string): string {
    let id = this.ids.get(key);
    if (!id) {
      id = this.next();
      this.ids.set(key, id);
      this.defs.push(make(id));
    }
    return id;
  }
  private stops(tag: string, stops: [number, string, number?][]): string {
    const body = stops.map(([offset, color, opacity]) => `<stop offset="${f3(offset)}" stop-color="${color}"${opacity === undefined ? "" : ` stop-opacity="${opacity}"`}/>`).join("");
    return this.shared(tag + body, (id) => `<${tag} id="${id}" gradientUnits="userSpaceOnUse">${body}</${tag}>`);
  }
  linear(stops: [number, string, number?][], a: V2, b: V2): string {
    const id = this.next();
    this.defs.push(`<linearGradient id="${id}" href="#${this.stops("linearGradient", stops)}" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>`);
    return `url(#${id})`;
  }
  radial(stops: [number, string, number?][], c: V2, r: number): string {
    const id = this.next();
    this.defs.push(`<radialGradient id="${id}" href="#${this.stops("radialGradient", stops)}" cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}"/>`);
    return `url(#${id})`;
  }
  // A soft glow, sized by the shape it fills.
  glow(color: string, strength = 0.5): string {
    return `url(#${this.shared(`glow${color}${strength}`, (id) => `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${strength}"/><stop offset=".35" stop-color="${color}" stop-opacity="${f2(strength * 0.36)}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`)})`;
  }
  className(fill: string): string {
    let name = this.classes.get(fill);
    if (!name) {
      name = (this.inline ? this.prefix : "") + "c" + this.classes.size.toString(36);
      this.classes.set(fill, name);
    }
    return name;
  }
}

// Turns drawing primitives into markup, joining neighbours that share a fill into one path.
function render(prims: Prim[], ctx: Ctx): string {
  let out = "";
  let run: { key: string; attrs: string; d: string } | null = null;
  const flush = () => {
    if (run) out += `<path ${run.attrs} d="${run.d}"/>`;
    run = null;
  };
  for (const prim of prims) {
    if ("raw" in prim) {
      flush();
      out += prim.raw;
      continue;
    }
    const key = `${prim.cls ?? ""}|${prim.fill}|${prim.opacity ?? 1}`;
    if (run && run.key === key) {
      run.d += prim.d;
      continue;
    }
    flush();
    let attrs: string;
    if (prim.cls) attrs = `class="${prim.cls}"`;
    else if (prim.fill.startsWith("url(")) attrs = `fill="${prim.fill}"`;
    else if (prim.opacity !== undefined) attrs = `fill="${prim.fill}" fill-opacity="${prim.opacity}"`;
    else attrs = `class="${ctx.className(prim.fill)}"`;
    run = { key, attrs, d: prim.d };
  }
  flush();
  return out;
}

// --- Solids ---------------------------------------------------------------------------------------
const BOX_FACES: number[][] = [
  [1, 3, 7, 5], // +x
  [0, 4, 6, 2], // −x
  [2, 6, 7, 3], // +y
  [0, 1, 5, 4], // −y
  [4, 5, 7, 6], // +z
  [0, 2, 3, 1], // −z
];

function boxNode(mesh: THREE.Mesh, style: Style, env: Env): Node | null {
  const { width, height, depth } = (mesh.geometry as THREE.BoxGeometry).parameters;
  const corners = Array.from({ length: 8 }, (_, i) => v3((i & 1 ? 0.5 : -0.5) * width, (i & 2 ? 0.5 : -0.5) * height, (i & 4 ? 0.5 : -0.5) * depth).applyMatrix4(mesh.matrixWorld));
  const centre = corners.reduce((sum, c) => sum.add(c), v3()).multiplyScalar(1 / 8);
  const screen = corners.map(project);
  const faces: { idx: number[]; n: V3 }[] = [];
  for (const idx of BOX_FACES) {
    const n = corners[idx[1]].clone().sub(corners[idx[0]]).cross(corners[idx[3]].clone().sub(corners[idx[0]])).normalize();
    if (n.dot(corners[idx[0]].clone().sub(centre)) < 0) n.negate();
    if (n.dot(VIEW) > 1e-4) faces.push({ idx, n });
  }
  const round = mesh.userData.round as number | undefined;

  // A face outline. With `round`, corners on the silhouette are eased: a corner one face owns is
  // rounded whole; a corner two faces share is rounded half each, meeting on their common edge.
  const outline = (face: { idx: number[] }): string => {
    if (!round) return polygon(face.idx.map((i) => screen[i]));
    let d = "";
    for (let k = 0; k < 4; k++) {
      const v = face.idx[k];
      const prev = face.idx[(k + 3) % 4];
      const next = face.idx[(k + 1) % 4];
      const owners = faces.filter((other) => other.idx.includes(v));
      const cut = (to: number) => lerp(screen[v], screen[to], Math.min(0.45, round / Math.max(1e-6, corners[v].distanceTo(corners[to]))));
      if (owners.length >= 3) d += "L" + pt(screen[v]);
      else if (owners.length === 1) d += `L${pt(cut(prev))}Q${pt(screen[v])} ${pt(cut(next))}`;
      else {
        const other = owners.find((o) => o !== face)!;
        const prevShared = other.idx.includes(prev);
        const at = other.idx.indexOf(v);
        const outer = [other.idx[(at + 1) % 4], other.idx[(at + 3) % 4]].find((c) => !face.idx.includes(c))!;
        const p1 = cut(prevShared ? next : prev);
        const p2 = cut(outer);
        const mid: V2 = [(p1[0] + 2 * screen[v][0] + p2[0]) / 4, (p1[1] + 2 * screen[v][1] + p2[1]) / 4];
        const control = lerp(p1, screen[v], 0.5);
        d += prevShared ? `L${pt(mid)}Q${pt(control)} ${pt(p1)}` : `L${pt(p1)}Q${pt(control)} ${pt(mid)}`;
      }
    }
    return "M" + d.slice(1) + "Z";
  };

  return makeNode(
    faces.map((face) => makeProxy(face.idx.map((i) => corners[i]), face.n)),
    centre,
    () => {
      const prims: Prim[] = [];
      for (const face of faces) {
        const quad = face.idx.map((i) => screen[i]);
        const area = Math.abs(signedArea(quad));
        if (area < 0.4) continue;
        prims.push({ fill: shade(style, face.n), d: outline(face), opacity: style.opacity });
        if (style.glass && area > 50) {
          // Two slanted reflections across the pane
          const at = (u: number, t: number) => lerp(lerp(quad[0], quad[1], u), lerp(quad[3], quad[2], u), t);
          for (const [u0, u1] of [[0.1, 0.26], [0.34, 0.4]]) prims.push({ fill: "#ffffff", opacity: 0.1, d: polygon([at(u0, 0.04), at(u1, 0.04), at(u1 + 0.34, 0.96), at(u0 + 0.34, 0.96)]) });
        }
      }
      return prims;
    },
    { shadow: env.shadow ? corners : undefined },
  );
}

function cylinderNode(mesh: THREE.Mesh, style: Style, env: Env): Node | null {
  const { radiusTop, radiusBottom, height, openEnded } = (mesh.geometry as THREE.CylinderGeometry).parameters;
  const m = mesh.matrixWorld;
  const lin = new THREE.Matrix3().setFromMatrix4(m);
  const nm = new THREE.Matrix3().getNormalMatrix(m);
  const ex = v3(1, 0, 0).applyMatrix3(lin);
  const ez = v3(0, 0, 1).applyMatrix3(lin);
  const ends = [v3(0, -height / 2, 0).applyMatrix4(m), v3(0, height / 2, 0).applyMatrix4(m)];
  const radii = [radiusBottom, radiusTop];
  const at = (end: number, t: number) => ends[end].clone().addScaledVector(ex, radii[end] * Math.cos(t)).addScaledVector(ez, radii[end] * Math.sin(t));
  const slope = (radiusBottom - radiusTop) / height;
  const normalAt = (t: number) => v3(Math.cos(t), slope, Math.sin(t)).applyMatrix3(nm).normalize();
  const axisNormal = v3(0, 1, 0).applyMatrix3(nm).normalize();

  // The side faces the viewer where cos(t − facing) > limit.
  const a = v3(1, 0, 0).applyMatrix3(nm).dot(VIEW);
  const b = v3(0, 0, 1).applyMatrix3(nm).dot(VIEW);
  const c = v3(0, 1, 0).applyMatrix3(nm).dot(VIEW) * slope;
  const reach = Math.hypot(a, b);
  const facing = Math.atan2(b, a);
  const half = reach < 1e-6 ? (c > 0 ? Math.PI : 0) : Math.acos(Math.max(-1, Math.min(1, -c / reach)));
  const side = half > 0.02;
  const all = half > Math.PI - 0.02;
  const from = facing - half;
  const to = facing + half;
  const cap = openEnded ? -1 : axisNormal.dot(VIEW) > 1e-4 ? 1 : axisNormal.dot(VIEW) < -1e-4 ? 0 : -1;
  const capShown = cap >= 0 && radii[cap] > 1e-4;

  const proxies: (Proxy | null)[] = [];
  if (side) {
    const facets = all ? 8 : 4;
    for (let i = 0; i < facets; i++) {
      const t0 = from + ((to - from) * i) / facets;
      const t1 = from + ((to - from) * (i + 1)) / facets;
      proxies.push(makeProxy([at(0, t0), at(0, t1), at(1, t1), at(1, t0)], normalAt((t0 + t1) / 2)));
    }
  }
  if (capShown) proxies.push(makeProxy(Array.from({ length: 12 }, (_, i) => at(cap, (i / 12) * Math.PI * 2)), cap ? axisNormal : axisNormal.clone().negate()));

  const shape = (end: number) => ellipseOf([project(ex.clone().multiplyScalar(radii[end])), project(ez.clone().multiplyScalar(radii[end]))]);
  const p = (end: number, t: number) => project(at(end, t));

  return makeNode(
    proxies,
    ends[0].clone().add(ends[1]).multiplyScalar(0.5),
    (ctx) => {
      const prims: Prim[] = [];
      if (side) {
        const wide = radii[0] >= radii[1] ? 0 : 1;
        const d = all
          ? ellipsePath(shape(wide), p(wide, 0), p(wide, Math.PI))
          : `M${pt(p(0, from))}${arcVia(shape(0), p(0, from), p(0, facing), p(0, to))}L${pt(p(1, to))}${arcVia(shape(1), p(1, to), p(1, facing), p(1, from))}Z`;
        // Shade across the width: five tones from one edge to the other.
        const mids = [0, 1, 2, 3, 4].map((i) => from + ((to - from) * i) / 4).map((t) => ({ t, q: lerp(p(0, t), p(1, t), 0.5) }));
        const span = sub(mids[4].q, mids[0].q);
        const width = Math.hypot(span[0], span[1]);
        let fill = style.emissive ?? shade(style, normalAt(facing + half * 0.35));
        if (!style.emissive && !all && width > 3.2) {
          fill = ctx.linear(
            mids.map(({ t, q }) => [Math.max(0, Math.min(1, dot(sub(q, mids[0].q), span) / (width * width))), shade(style, normalAt(t))]),
            mids[0].q,
            mids[4].q,
          );
        }
        prims.push({ fill, d, opacity: style.opacity, cls: ctx.hot && style.emissive === SKY ? "led" : undefined });
      }
      if (capShown) prims.push({ fill: shade(style, cap ? axisNormal : axisNormal.clone().negate()), d: ellipsePath(shape(cap), p(cap, 0), p(cap, Math.PI)), opacity: style.opacity, cls: ctx.hot && style.emissive === SKY ? "led" : undefined });
      return prims;
    },
    { shadow: env.shadow ? [0, 1].flatMap((end) => Array.from({ length: 8 }, (_, i) => at(end, (i / 8) * Math.PI * 2))) : undefined },
  );
}

function sphereNode(mesh: THREE.Mesh, style: Style, env: Env): Node | null {
  const { radius, thetaStart, thetaLength } = (mesh.geometry as THREE.SphereGeometry).parameters;
  const half = thetaLength > 2 ? 0 : thetaStart < 0.1 ? 1 : -1; // 0 whole, 1 upper half, −1 lower half
  const m = mesh.matrixWorld;
  const lin = new THREE.Matrix3().setFromMatrix4(m);
  const centre = v3().applyMatrix4(m);
  const world = (u: V3) => centre.clone().add(u.clone().multiplyScalar(radius).applyMatrix3(lin));
  const sight = VIEW.clone().applyMatrix3(lin.clone().invert()).normalize(); // the line of sight, in the sphere's own space
  const up = v3(0, 1, 0);
  let e = up.clone().cross(sight);
  const whole = half === 0 || e.length() < 1e-3;
  e = e.length() < 1e-3 ? v3(1, 0, 0).cross(sight).normalize() : e.normalize();
  const g = e.clone().cross(sight).normalize();
  if (half && g.y * half < 0) g.negate();
  const columns = [v3(1, 0, 0), v3(0, 1, 0), v3(0, 0, 1)].map((axis) => project(axis.multiplyScalar(radius).applyMatrix3(lin)));
  const silhouette = ellipseOf(columns);
  const pc = project(centre);
  const pe = project(world(e));
  const pe2 = project(world(e.clone().negate()));
  const pg = project(world(g));

  // The rim of a half sphere: the half of it on the far side of the e axis from the dome.
  let rimPoint: V3 | null = null;
  if (!whole) {
    const candidate = up.clone().cross(e).normalize();
    rimPoint = Math.sign(cross(sub(pe, pc), sub(project(world(candidate)), pc))) === Math.sign(cross(sub(pe, pc), sub(pg, pc))) ? candidate.negate() : candidate;
  }
  const rim = ellipseOf([columns[0], columns[2]]);
  const outline3: V3[] = [];
  for (let i = 0; i < (whole ? 12 : 7); i++) {
    const t = (i / (whole ? 12 : 6)) * (whole ? Math.PI * 2 : Math.PI);
    outline3.push(world(e.clone().multiplyScalar(Math.cos(t)).addScaledVector(g, Math.sin(t))));
  }
  if (rimPoint) for (let i = 1; i < 6; i++) outline3.push(world(e.clone().multiplyScalar(-Math.cos((i / 6) * Math.PI)).addScaledVector(rimPoint, Math.sin((i / 6) * Math.PI))));
  const plane = makeProxy(outline3, VIEW);
  if (plane) plane.k = VIEW.dot(centre) + 0.01;

  return makeNode(
    [plane],
    centre,
    (ctx) => {
      const d = whole || !rimPoint ? ellipsePath(silhouette, pe, pe2) : `M${pt(pe)}${arcVia(silhouette, pe, pg, pe2)}${arcVia(rim, pe2, project(world(rimPoint)), pe)}Z`;
      let fill = style.emissive ?? style.tones[1];
      if (!style.emissive && silhouette.rx > 2.4) {
        const lit = LIGHT.clone().applyMatrix3(lin.clone().transpose()).normalize(); // the point facing the light
        const [top, left, right] = style.tones;
        fill = ctx.radial([[0, top], [0.42, left], [0.86, right], [1, mix(right, "#000000", 0.12)]], lerp(pc, project(world(lit)), 0.7), silhouette.rx * 1.75);
      }
      return [{ fill, d, opacity: style.opacity }];
    },
    { shadow: env.shadow ? outline3 : undefined },
  );
}

// A ring is drawn as a stroke along its centre line.
function torusNode(mesh: THREE.Mesh, style: Style): Node | null {
  const { radius, tube } = (mesh.geometry as THREE.TorusGeometry).parameters;
  const m = mesh.matrixWorld;
  const lin = new THREE.Matrix3().setFromMatrix4(m);
  const centre = v3().applyMatrix4(m);
  const ex = v3(1, 0, 0).applyMatrix3(lin);
  const ey = v3(0, 1, 0).applyMatrix3(lin);
  const axis = v3(0, 0, 1).applyMatrix3(lin).normalize();
  const scale = Math.cbrt(Math.abs(lin.determinant()));
  const wrap = mesh.userData.wrap === true;
  const at = (t: number, r = radius) => centre.clone().addScaledVector(ex, r * Math.cos(t)).addScaledVector(ey, r * Math.sin(t));
  const near = Math.atan2(ey.dot(VIEW), ex.dot(VIEW));
  const proxies: (Proxy | null)[] = [];
  if (wrap) {
    for (let i = 0; i < 4; i++) {
      const t0 = near - 1.5 + (3 * i) / 4;
      const t1 = t0 + 0.75;
      const lift = axis.clone().multiplyScalar(tube * scale);
      proxies.push(makeProxy([at(t0, radius + tube).sub(lift), at(t1, radius + tube).sub(lift), at(t1, radius + tube).add(lift), at(t0, radius + tube).add(lift)]));
    }
  } else proxies.push(makeProxy(Array.from({ length: 12 }, (_, i) => at((i / 12) * Math.PI * 2, radius + tube)), axis));
  return makeNode(proxies, centre, (ctx) => {
    const e = ellipseOf([project(ex.clone().multiplyScalar(radius)), project(ey.clone().multiplyScalar(radius))]);
    const p = (t: number) => project(at(t));
    const d = wrap ? `M${pt(p(near - 1.5))}${arcVia(e, p(near - 1.5), p(near), p(near + 1.5))}` : ellipsePath(e, p(0), p(Math.PI));
    const led = ctx.hot && style.emissive === SKY;
    return [{ raw: `<path d="${d}" fill="none" ${led ? 'class="led-s"' : `stroke="${style.emissive ?? style.tones[1]}"`} stroke-width="${f2(2 * tube * scale * ORTHO * U)}"/>` }];
  });
}

// A flat panel: a plain or lit face, or a piece of surface artwork drawn in the panel's own plane.
function planeNode(mesh: THREE.Mesh, style: Style): Node | null {
  const { width, height } = (mesh.geometry as THREE.PlaneGeometry).parameters;
  const m = mesh.matrixWorld;
  const lin = new THREE.Matrix3().setFromMatrix4(m);
  const n = v3(0, 0, 1).applyMatrix3(new THREE.Matrix3().getNormalMatrix(m)).normalize();
  if (n.dot(VIEW) < 1e-4) return null;
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, y]) => v3((x * width) / 2, (y * height) / 2, 0).applyMatrix4(m));
  const centre = v3().applyMatrix4(m);
  return makeNode([makeProxy(corners, n)], centre, (ctx) => {
    if (!style.kind || style.kind === "feed") return [{ fill: shade(style, n), d: polygon(corners.map(project)), cls: ctx.hot && style.emissive === SKY ? "led" : undefined }];
    const ax = project(v3(1, 0, 0).applyMatrix3(lin));
    const ay = project(v3(0, -1, 0).applyMatrix3(lin));
    const o = project(centre);
    const W = width * U;
    const H = height * U;
    let art = "";
    if (style.kind === "label") {
      const text = style.text ?? "";
      const size = Math.min(H * 0.72, (W * 0.9) / (0.66 * Math.max(1, text.length)));
      art = `<rect x="${f(-W / 2)}" y="${f(-H / 2)}" width="${f(W)}" height="${f(H)}" rx="${f2(H * 0.14)}" fill="${style.bg}"/><text y="${f2(size * 0.36)}" font-size="${f2(size)}" text-anchor="middle" fill="${style.fg}" font-family="Arial,Helvetica,sans-serif" font-weight="700">${escapeXml(text)}</text>`;
    } else if (style.kind === "ui") {
      const line = [[-0.38, 0.12], [-0.22, -0.04], [-0.08, 0.06], [0.08, -0.2], [0.22, -0.1], [0.38, -0.3]].map(([x, y]) => `${f2(x * W)} ${f2(y * H)}`).join("L");
      art = `<rect x="${f(-W / 2)}" y="${f(-H / 2)}" width="${f(W)}" height="${f(H)}" rx="${f2(Math.min(W, H) * 0.1)}" fill="#06101d"/><path d="M${line}" fill="none" stroke="${SKY}" stroke-width="${f2(Math.max(0.5, H * 0.08))}" stroke-linejoin="round"/><path d="M${f2(-0.38 * W)} ${f2(0.3 * H)}h${f2(0.34 * W)}M${f2(0.06 * W)} ${f2(0.3 * H)}h${f2(0.2 * W)}" stroke="#3f88c9" stroke-width="${f2(Math.max(0.5, H * 0.09))}"/>`;
    } else if (style.kind === "fins") {
      let lines = "";
      for (let x = -W / 2 + 1.1; x < W / 2 - 0.5; x += 2.2) lines += `M${f(x)} ${f(-H / 2)}v${f(H)}`;
      art = `<rect x="${f(-W / 2)}" y="${f(-H / 2)}" width="${f(W)}" height="${f(H)}" fill="#3b527a"/><path d="${lines}" stroke="#1d2c47" stroke-width=".8"/><path d="M${f(-W / 2)} ${f(-H / 6)}h${f(W)}M${f(-W / 2)} ${f(H / 6)}h${f(W)}" stroke="#7289a9" stroke-width=".6"/>`;
    } else if (style.kind === "hazard") {
      art = `<path d="M0 ${f2(-H / 2)}L${f2(W / 2)} ${f2(H / 2)}H${f2(-W / 2)}Z" fill="#f4b400" stroke="#1c2b43" stroke-width=".5" stroke-linejoin="round"/><path d="M0 ${f2(-H * 0.18)}V${f2(H * 0.2)}" stroke="#1c2b43" stroke-width="${f2(W * 0.1)}" stroke-linecap="round"/><circle cy="${f2(H * 0.36)}" r="${f2(W * 0.06)}" fill="#1c2b43"/>`;
    }
    return [{ raw: `<g transform="matrix(${f3(ax[0] / U)} ${f3(ax[1] / U)} ${f3(ay[0] / U)} ${f3(ay[1] / U)} ${f(o[0])} ${f(o[1])})">${art}</g>` }];
  });
}

// Pipes are strokes: a dark body, a mid band and a highlight toward the light. A data line is one
// node for its whole length so the page can draw it in; a real pipe sorts segment by segment.
function pipeNodes(mesh: THREE.Mesh, style: Style, env: Env): Node[] {
  const points = (mesh.userData.points as [number, number, number][]).map(([x, y, z]) => v3(x, y, z).applyMatrix4(mesh.matrixWorld));
  const radius = style.kind === "feed" ? 0.02 : (mesh.userData.radius as number);
  const segmentProxy = (a: V3, b: V3) => {
    const along = b.clone().sub(a).normalize();
    const n = VIEW.clone().addScaledVector(along, -VIEW.dot(along));
    if (n.length() < 0.05) return null;
    n.normalize();
    const across = n.clone().cross(along).multiplyScalar(radius);
    return makeProxy([a.clone().sub(across), b.clone().sub(across), b.clone().add(across), a.clone().add(across)], n);
  };
  const middle = (a: V3, b: V3) => a.clone().add(b).multiplyScalar(0.5);

  if (style.kind === "feed") {
    // The stretch along the floor is one node: nothing standing on the floor can be behind it, so
    // it always sits just above the ground. Each rise up a wall or post sorts on its own.
    const runs: { floor: boolean; points: V3[] }[] = [];
    points.slice(1).forEach((b, i) => {
      const floor = points[i].y < 0.1 && b.y < 0.1;
      const last = runs[runs.length - 1];
      if (floor && last?.floor) last.points.push(b);
      else runs.push({ floor, points: [points[i], b] });
    });
    const nodes: Node[] = [];
    for (const run of runs) {
      const d = "M" + run.points.map((p) => pt(project(p))).join("L");
      const node = makeNode(
        run.points.slice(1).map((b, i) => segmentProxy(run.points[i], b)),
        middle(run.points[0], run.points[run.points.length - 1]),
        () => [
          {
            raw: `<g fill="none" stroke="${SKY}" stroke-linejoin="round" stroke-linecap="round"><path class="flow-glow" d="${d}" stroke-width="8" stroke-opacity=".2"/><path class="flow-line" pathLength="1" d="${d}" stroke-width="2.2"/>${run.floor ? `<path class="flow-dot" pathLength="1" d="${d}" stroke="#fff" stroke-width="4.6" stroke-dasharray="0 1"/>` : ""}</g>`,
          },
        ],
      );
      if (!node) continue;
      node.dynamic = { cls: run.floor ? "flow" : "flow riser", index: mesh.userData.index as number | undefined };
      nodes.push(node);
    }
    return nodes;
  }

  const width = 2 * radius * ORTHO * U;
  const nodes: Node[] = [];
  points.slice(1).forEach((b, i) => {
    const a = points[i];
    const node = makeNode(
      [segmentProxy(a, b)],
      middle(a, b),
      () => {
        const sa = project(a);
        const sb = project(b);
        const along = sub(sb, sa);
        const length = Math.hypot(along[0], along[1]) || 1;
        let normal: V2 = [-along[1] / length, along[0] / length];
        if (dot(normal, [-0.5, -0.86]) < 0) normal = [-normal[0], -normal[1]];
        const line = (shift: number) => `M${pt([sa[0] + normal[0] * shift, sa[1] + normal[1] * shift])}L${pt([sb[0] + normal[0] * shift, sb[1] + normal[1] * shift])}`;
        if (width < 2.4) return [{ raw: `<path d="${line(0)}" stroke="${style.tones[1]}" stroke-width="${f2(width)}" stroke-linecap="round"/>` }];
        return [
          {
            raw: `<g stroke-linecap="round"><path d="${line(0)}" stroke="${style.tones[2]}" stroke-width="${f2(width)}"/><path d="${line(width * 0.14)}" stroke="${style.tones[1]}" stroke-width="${f2(width * 0.66)}"/><path d="${line(width * 0.24)}" stroke="${style.tones[0]}" stroke-width="${f2(width * 0.2)}"/></g>`,
          },
        ];
      },
      { shadow: env.shadow ? [a, b] : undefined },
    );
    if (node) nodes.push(node);
  });
  return nodes;
}

// A billboard facing the viewer, for glows.
const disc = (centre: V3, radius: number, bias = 0.05) => {
  const e1 = v3(1, 0, -1).normalize();
  const e2 = v3(-1, 2, -1).normalize();
  const proxy = makeProxy(Array.from({ length: 10 }, (_, i) => centre.clone().addScaledVector(e1, radius * Math.cos((i / 10) * Math.PI * 2)).addScaledVector(e2, radius * Math.sin((i / 10) * Math.PI * 2))), VIEW);
  if (proxy) proxy.k = VIEW.dot(centre) + bias;
  return proxy;
};

function haloNode(object: THREE.Object3D, env: Env): Node | null {
  const centre = object.getWorldPosition(v3());
  const { color, size, backdrop } = object.userData as { color: string; size: number; backdrop?: boolean };
  const c = project(centre);
  const r = size * U * 0.5;
  if (backdrop) {
    const node = makeNode([disc(centre, 0.5)], centre, (ctx) => [{ raw: `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(r)}" ry="${f(r * 0.6)}" fill="${ctx.glow(color, 0.5)}"/>` }], { backdrop: true });
    if (node) node.box = [c[0] - r, c[1] - r * 0.6, c[0] + r, c[1] + r * 0.6];
    return node;
  }
  // Inside an animated group the glow must not widen the group's footprint.
  // It also sits a little toward the viewer, so a lamp's glow lies over the lamp itself.
  return makeNode([disc(centre, env.dynamic ? 0.04 : size * 0.28, size * 0.16)], centre, (ctx) => {
    const circle = (fill: string, cls?: string, scale = 1) => `<circle${cls ? ` class="${cls}"` : ""} cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r * scale)}" fill="${fill}"/>`;
    if (ctx.hot) return [{ raw: circle(ctx.glow(color, 0.6), "halo-live") + circle(ctx.glow("#ff4a3d", 0.8), "halo-alert", 1.3) + circle(ctx.glow("#3df08a", 0.7), "halo-ok", 1.15) }];
    return [{ raw: circle(ctx.glow(color, env.dynamic ? 0.6 : 0.5)) }];
  });
}

// The top of a fan, drawn in its own plane: disc, blades, hub and guard.
function fanNode(object: THREE.Object3D): Node | null {
  const m = object.matrixWorld;
  const lin = new THREE.Matrix3().setFromMatrix4(m);
  const centre = v3().applyMatrix4(m);
  const radius = object.userData.radius as number;
  const ex = v3(radius, 0, 0).applyMatrix3(lin);
  const ez = v3(0, 0, radius).applyMatrix3(lin);
  const at = (t: number) => centre.clone().addScaledVector(ex, Math.cos(t)).addScaledVector(ez, Math.sin(t));
  return makeNode([makeProxy(Array.from({ length: 12 }, (_, i) => at((i / 12) * Math.PI * 2)))], centre, () => {
    const a = project(ex);
    const b = project(ez);
    const o = project(centre);
    let blades = "";
    for (let i = 0; i < 5; i++) blades += `<path d="M.16 -.07L.88 -.3A.93 .93 0 0 1 .8 .44Z" transform="rotate(${i * 72})"/>`;
    return [
      {
        raw: `<g transform="matrix(${f3(a[0])} ${f3(a[1])} ${f3(b[0])} ${f3(b[1])} ${f(o[0])} ${f(o[1])})"><circle r="1" fill="#0d1a30"/><g fill="#33496e">${blades}</g><circle r=".2" fill="#9fb4cd"/><g fill="none" stroke="#7d93b2" stroke-width=".05"><circle r=".97"/><circle r=".62"/><path d="M-1 0H1M0 -1V1"/></g></g>`,
      },
    ];
  });
}

// A camera's field of view: a soft wedge from the lens to the patch of floor it watches.
function coneNode(object: THREE.Object3D): Node | null {
  const apex = object.getWorldPosition(v3());
  const { direction, reach, spread } = object.userData as { direction: [number, number, number]; reach: number; spread: number };
  const aim = v3(...direction).transformDirection(object.matrixWorld);
  const target = apex.clone().addScaledVector(aim, reach);
  const radius = 0.42 * reach * spread;
  const ring = Array.from({ length: 24 }, (_, i) => project(v3(target.x + radius * Math.cos((i / 24) * Math.PI * 2), target.y, target.z + radius * Math.sin((i / 24) * Math.PI * 2))));
  const a = project(apex);
  const c = project(target);
  const axis = sub(c, a);
  const angles = ring.map((p) => Math.atan2(cross(axis, sub(p, a)), dot(axis, sub(p, a))));
  const left = ring[angles.indexOf(Math.min(...angles))];
  const right = ring[angles.indexOf(Math.max(...angles))];
  const e = ellipseOf([[radius * COS * U, radius * 0.5 * U], [-radius * COS * U, radius * 0.5 * U]]);
  const node = makeNode([disc(target, radius)], target, (ctx) => [
    {
      raw: `<g class="cone"><path d="M${pt(a)}L${pt(left)}L${pt(right)}Z" fill="${ctx.linear([[0, SKY, 0.5], [1, SKY, 0.06]], a, c)}"/><path d="${ellipsePath(e, ring[0], ring[12])}" fill="${SKY}" fill-opacity=".13" stroke="${SKY}" stroke-opacity=".75" stroke-width="1" stroke-dasharray="3 3"/></g>`,
    },
  ]);
  if (node) {
    node.overlay = true;
    node.box = union(boxOf(ring), [a[0], a[1], a[0], a[1]]);
  }
  return node;
}

// --- Collecting the scene -------------------------------------------------------------------------
function meshNodes(mesh: THREE.Mesh, env: Env): (Node | null)[] {
  const style = (mesh.material as THREE.Material).userData as Style;
  if (mesh.userData.kind === "pipe") return pipeNodes(mesh, style, env);
  switch (mesh.geometry.type) {
    case "BoxGeometry":
      return [boxNode(mesh, style, env)];
    case "CylinderGeometry":
      return [cylinderNode(mesh, style, env)];
    case "SphereGeometry":
      return [sphereNode(mesh, style, env)];
    case "TorusGeometry":
      return [torusNode(mesh, style)];
    case "PlaneGeometry":
      return [planeNode(mesh, style)];
    default:
      throw new Error(`No drawing rule for ${mesh.geometry.type}`);
  }
}

function visit(object: THREE.Object3D, into: Node[], env: Env): void {
  const data = object.userData;
  if (data.unit && data.cls) {
    // An animated group: one node, drawn together inside its own <g>.
    const parts: Node[] = [];
    for (const child of object.children) visit(child, parts, { shadow: false, dynamic: true });
    const dynamic: Dynamic = { cls: data.cls + (data.hot ? " hot" : ""), index: data.index, hot: data.hot === true };
    const body = parts.filter((part) => !part.overlay);
    const centre = object.getWorldPosition(v3());
    const whole = makeNode(
      body.flatMap((part) => part.proxies),
      centre,
      (ctx) => {
        ctx.hot = dynamic.hot === true;
        const prims = sortNodes(body).sorted.flatMap((part) => part.draw(ctx));
        const markup = render(prims, ctx);
        ctx.hot = false;
        return [{ raw: markup }];
      },
      { dynamic },
    );
    if (whole) into.push(whole);
    for (const part of parts) {
      if (!part.overlay) continue;
      part.dynamic = { cls: dynamic.cls, index: dynamic.index };
      into.push(part);
    }
    return;
  }
  const inner = data.shadow === false ? { ...env, shadow: false } : env;
  const found: (Node | null)[] = [];
  if ((object as THREE.Mesh).isMesh) found.push(...meshNodes(object as THREE.Mesh, inner));
  else if (data.kind === "halo") found.push(haloNode(object, inner));
  else if (data.kind === "fan") found.push(fanNode(object));
  else if (data.kind === "cone") found.push(coneNode(object));
  for (const node of found) {
    if (!node) continue;
    if (data.cls && !node.dynamic) node.dynamic = { cls: data.cls, index: data.index };
    if (data.overlay) node.overlay = true;
    into.push(node);
  }
  for (const child of object.children) visit(child, into, inner);
}

// --- Ordering -------------------------------------------------------------------------------------
// > 0: a is in front of b. < 0: b is in front. 0: they never overlap.
function compare(a: Node, b: Node): number {
  let weight = 0;
  for (const pa of a.proxies) {
    if (!boxesMeet(pa.box, b.box)) continue;
    for (const pb of b.proxies) {
      if (!boxesMeet(pa.box, pb.box)) continue;
      const shared = clip(pa.poly, pb.poly);
      if (shared.length < 3) continue;
      const area = Math.abs(signedArea(shared));
      if (area < 0.25) continue;
      const at = centroid(shared);
      const gap = depthAt(pa, at) - depthAt(pb, at);
      weight += Math.abs(gap) < 1e-4 ? Math.sign(a.order - b.order) * area * 1e-3 : Math.sign(gap) * area;
    }
  }
  return weight;
}

// Back-to-front order. With `layered`, static and animated nodes are kept in as few runs as the
// overlaps allow, so the picture splits into few layers.
function sortNodes(nodes: Node[], layered = false): { sorted: Node[]; cycles: number } {
  const count = nodes.length;
  const after: number[][] = nodes.map(() => []);
  const waiting = new Int32Array(count);
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      if (!boxesMeet(nodes[i].box, nodes[j].box)) continue;
      const w = compare(nodes[i], nodes[j]);
      if (w > 0) {
        after[j].push(i);
        waiting[i]++;
      } else if (w < 0) {
        after[i].push(j);
        waiting[j]++;
      }
      if (layered && process.env.DEBUG_LAYERS && w !== 0) {
        const [back, front] = w > 0 ? [nodes[j], nodes[i]] : [nodes[i], nodes[j]];
        const where = (node: Node) => `${node.dynamic ? node.dynamic.cls + "#" + node.dynamic.index : "static"}(${f(node.centre.x)},${f(node.centre.y)},${f(node.centre.z)})`;
        if (back.dynamic && !front.dynamic) console.log("  over", where(back), "<", where(front), f(Math.abs(w)));
      }
    }
  }
  const done = new Uint8Array(count);
  const sorted: Node[] = [];
  let cycles = 0;
  let mode = false; // false: static, true: animated
  while (sorted.length < count) {
    let pick = -1;
    let other = -1;
    for (let i = 0; i < count; i++) {
      if (done[i] || waiting[i]) continue;
      if (!layered || !!nodes[i].dynamic === mode) {
        if (pick < 0 || nodes[i].key < nodes[pick].key) pick = i;
      } else if (other < 0 || nodes[i].key < nodes[other].key) other = i;
    }
    if (pick < 0 && layered) {
      // Nothing of this kind is free. If some of it is held up only by its own kind, that is a
      // cycle to break here; switching kinds for it would split the picture into more layers.
      const held = new Uint8Array(count);
      const queue: number[] = [];
      for (let i = 0; i < count; i++) if (!done[i] && !!nodes[i].dynamic !== mode) queue.push(i);
      for (let at = 0; at < queue.length; at++) {
        for (const next of after[queue[at]]) {
          if (held[next] || done[next]) continue;
          held[next] = 1;
          queue.push(next);
        }
      }
      for (let i = 0; i < count; i++) {
        if (done[i] || held[i] || !!nodes[i].dynamic !== mode) continue;
        if (pick < 0 || waiting[i] < waiting[pick] || (waiting[i] === waiting[pick] && nodes[i].key < nodes[pick].key)) pick = i;
      }
      if (pick >= 0) cycles++;
      else if (other >= 0) {
        pick = other;
        mode = !mode;
      }
    }
    if (pick < 0) {
      // A cycle (intersecting solids): release whichever is least held back, farthest first.
      cycles++;
      for (let i = 0; i < count; i++) {
        if (done[i]) continue;
        if (pick < 0 || waiting[i] < waiting[pick] || (waiting[i] === waiting[pick] && nodes[i].key < nodes[pick].key)) pick = i;
      }
      if (layered) mode = !!nodes[pick].dynamic;
    }
    if (process.env.DEBUG_LAYERS && waiting[pick]) console.log("  cycle broken at", `(${f(nodes[pick].centre.x)},${f(nodes[pick].centre.y)},${f(nodes[pick].centre.z)})`);
    done[pick] = 1;
    waiting[pick] = 0;
    sorted.push(nodes[pick]);
    for (const next of after[pick]) if (waiting[next] > 0) waiting[next]--;
  }
  return { sorted, cycles };
}

// --- Shadows --------------------------------------------------------------------------------------
type Ground = { x0: number; z0: number; x1: number; z1: number };

function shadowNode(nodes: Node[], ground: Ground): Node | null {
  const bounds: V2[] = [[ground.x0, ground.z0], [ground.x1, ground.z0], [ground.x1, ground.z1], [ground.x0, ground.z1]];
  let hulls: V2[][] = [];
  for (const node of nodes) {
    if (!node.shadow || node.dynamic) continue;
    if (Math.max(...node.shadow.map((p) => p.y)) < 0.1) continue;
    let hull = convexHull(node.shadow.map((p) => [p.x + Math.max(0, p.y) * SHADOW[0], p.z + Math.max(0, p.y) * SHADOW[1]] as V2));
    if (hull.length < 3) continue;
    if (signedArea(hull) < 0) hull.reverse();
    hull = clip(hull, bounds);
    if (hull.length >= 3 && Math.abs(signedArea(hull)) > 0.004) hulls.push(hull);
  }
  // A shadow wholly inside another adds nothing.
  hulls.sort((a, b) => Math.abs(signedArea(b)) - Math.abs(signedArea(a)));
  const inside = (hull: V2[], p: V2) => hull.every((a, i) => cross(sub(hull[(i + 1) % hull.length], a), sub(p, a)) >= -1e-6);
  const kept: V2[][] = [];
  for (const hull of hulls) if (!kept.some((big) => hull.every((p) => inside(big, p)))) kept.push(hull);
  hulls = kept;
  if (!hulls.length) return null;
  const d = hulls.map((hull) => polygon(hull.map(([x, z]) => project(v3(x, 0.03, z))))).join("");
  const plane = makeProxy(bounds.map(([x, z]) => v3(x, 0.03, z)), v3(0, 1, 0));
  return makeNode([plane], v3((ground.x0 + ground.x1) / 2, 0, (ground.z0 + ground.z1) / 2), () => [{ raw: `<path d="${d}" fill="#020916" fill-opacity=".4"/>` }]);
}

// --- Export ---------------------------------------------------------------------------------------
export type Layer = { kind: "image"; svg: string } | { kind: "inline"; markup: string };
export type Exported = {
  viewBox: [number, number, number, number];
  layers: Layer[];
  flat: string; // everything in one image, in its finished state
  stats: { nodes: number; cycles: number; layers: number };
};

const group = (node: Node, markup: string) => (node.dynamic ? `<g class="${node.dynamic.cls}"${node.dynamic.index === undefined ? "" : ` style="--i:${node.dynamic.index}"`}>${markup}</g>` : markup);

export function exportScene(root: THREE.Object3D, options: { id: string; ground: Ground; margin?: number }): Exported {
  root.updateMatrixWorld(true);
  counter = 0;
  const all: Node[] = [];
  visit(root, all, { shadow: true, dynamic: false });
  const shadow = shadowNode(all, options.ground);
  const backdrops = all.filter((node) => node.backdrop);
  const overlays = all.filter((node) => node.overlay && !node.backdrop);
  const solids = all.filter((node) => !node.overlay && !node.backdrop);
  if (shadow) solids.push(shadow);

  // Three passes. The ground comes first: whatever overlaps it on screen is in front of it. The
  // data lines along the floor come next, for the same reason. Everything else is then ordered
  // by what hides what.
  const isGround = (node: Node) => !node.dynamic && node.top <= 0.06;
  const isFloorLine = (node: Node) => node.dynamic?.cls === "flow";
  const ground = sortNodes(solids.filter(isGround));
  const rest = sortNodes(solids.filter((node) => !isGround(node) && !isFloorLine(node)), true);
  const sorted = [...ground.sorted, ...solids.filter(isFloorLine), ...rest.sorted];
  const cycles = ground.cycles + rest.cycles;
  const runs: { dynamic: boolean; nodes: Node[] }[] = [{ dynamic: false, nodes: [...backdrops] }];
  for (const node of sorted) {
    const dynamic = !!node.dynamic;
    if (runs[runs.length - 1].dynamic !== dynamic) runs.push({ dynamic, nodes: [] });
    runs[runs.length - 1].nodes.push(node);
  }
  if (overlays.length) {
    if (!runs[runs.length - 1].dynamic) runs.push({ dynamic: true, nodes: [] });
    runs[runs.length - 1].nodes.push(...overlays);
  }

  if (process.env.DEBUG_LAYERS) {
    runs.forEach((run, i) => {
      const where = (node: Node) => `${node.dynamic ? node.dynamic.cls + "#" + node.dynamic.index : ""}(${f(node.centre.x)},${f(node.centre.y)},${f(node.centre.z)})`;
      console.log(i, run.dynamic ? "dynamic" : "static", run.nodes.length, run.nodes.length < 90 || run.dynamic ? run.nodes.map(where).join(" ") : "");
    });
  }
  const margin = options.margin ?? 20;
  const bounds = [...sorted, ...overlays, ...backdrops].map((node) => node.box).reduce(union);
  const viewBox: [number, number, number, number] = [Math.floor(bounds[0] - margin), Math.floor(bounds[1] - margin), Math.ceil(bounds[2] - bounds[0] + margin * 2), Math.ceil(bounds[3] - bounds[1] + margin * 2)];

  const image = (nodes: Node[], prefix: string): string => {
    const ctx = new Ctx(false, prefix);
    let body = "";
    let pending: Prim[] = [];
    const flush = () => {
      body += render(pending, ctx);
      pending = [];
    };
    for (const node of nodes) {
      if (node.dynamic) {
        flush();
        body += group(node, render(node.draw(ctx), ctx));
      } else pending.push(...node.draw(ctx));
    }
    flush();
    const css = "path{stroke-width:.4;stroke-linejoin:round}.led{fill:#7cc4ff}.led-s{stroke:#7cc4ff}.halo-alert,.halo-ok,.alarm,.flow-dot{display:none}" + [...ctx.classes].map(([fill, name]) => `.${name}{fill:${fill};stroke:${fill}}`).join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox.join(" ")}" width="${viewBox[2]}" height="${viewBox[3]}"><style>${css}</style><defs>${ctx.defs.join("")}</defs>${body}</svg>`;
  };

  const layers: Layer[] = runs
    .filter((run) => run.nodes.length)
    .map((run, i) => {
      if (!run.dynamic) return { kind: "image", svg: image(run.nodes, "g") };
      const ctx = new Ctx(true, `${options.id}${i}`);
      const body = run.nodes.map((node) => group(node, render(node.draw(ctx), ctx))).join("");
      // Inline layers share the page's stylesheet scope, so their class names carry the layer's prefix.
      const css = [...ctx.classes].map(([fill, name]) => `.${name}{fill:${fill};stroke:${fill};stroke-width:.4px}`).join("");
      return { kind: "inline", markup: `${css ? `<style>${css}</style>` : ""}${ctx.defs.length ? `<defs>${ctx.defs.join("")}</defs>` : ""}${body}` };
    });

  return { viewBox, layers, flat: image(runs.flatMap((run) => run.nodes), "g"), stats: { nodes: solids.length + overlays.length, cycles, layers: layers.length } };
}
