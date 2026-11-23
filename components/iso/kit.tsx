// The 2.5D kit. True isometric (30°), one unit, one line weight, one light from the top-left:
// tops are lightest, left faces mid, right faces darkest, and every shadow falls to the right.
// Every scene on the site is drawn with these primitives so they read as one world.
// These are placeholder blocks; the final art will come from an illustrator and can replace the
// scene data in scenes.ts without touching the components that use it.

import type { ReactNode } from "react";

export const U = 20; // px per grid unit
const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;
const CIRCLE_RX = Math.SQRT2 * COS; // a ground circle projects to an ellipse: rx = 1.2247 r
const CIRCLE_RY = Math.SQRT2 * SIN; // ry = 0.7071 r

export type Pt = [number, number];
const round = (value: number) => Math.round(value * 100) / 100;
export const project = (x: number, y: number, z = 0): Pt => [round((x - y) * COS * U), round((x + y) * SIN * U - z * U)];
const poly = (points: Pt[]) => points.map((point) => point.join(",")).join(" ");

export type Tone = "light" | "mid" | "dark" | "blue";

export type Item =
  | { k: "box"; x: number; y: number; z: number; w: number; d: number; h: number; tone: Tone }
  | { k: "cyl"; x: number; y: number; z: number; r: number; h: number; tone: Tone }
  | { k: "person"; x: number; y: number; z: number; tone: Tone }
  | { k: "sensor"; x: number; y: number; z: number }
  | { k: "cam"; x: number; y: number; z: number; tx: number; ty: number; tz: number }
  | { k: "line"; pts: [number, number, number][] };

export type ZoneArt = { id: string; pad: [number, number, number, number]; items: Item[] };
export type SceneArt = { zones: ZoneArt[]; icon: ZoneArt };

// --- Constructors (coordinates local to a zone's pad) ----------------------------------------
export const box = (x: number, y: number, w: number, d: number, h: number, tone: Tone = "light", z = 0): Item => ({ k: "box", x, y, z, w, d, h, tone });
export const cyl = (x: number, y: number, r: number, h: number, tone: Tone = "light", z = 0): Item => ({ k: "cyl", x, y, z, r, h, tone });
export const person = (x: number, y: number, tone: Tone = "mid", z = 0): Item => ({ k: "person", x, y, z, tone });
export const sen = (x: number, y: number, z = 0): Item => ({ k: "sensor", x, y, z });
export const cam = (x: number, y: number, z: number, tx: number, ty: number, tz = 0): Item => ({ k: "cam", x, y, z, tx, ty, tz });
export const line = (...pts: ([number, number] | [number, number, number])[]): Item => ({ k: "line", pts: pts.map(([x, y, z = 0]) => [x, y, z]) });
// A data path along the floor from a point to the pad's front corner.
export const feed = (x: number, y: number, size = 6): Item => line([x, y], [x, size - 0.45], [size - 0.45, size - 0.45]);

const shift = (item: Item, dx: number, dy: number): Item => {
  if (item.k === "line") return { ...item, pts: item.pts.map(([x, y, z]) => [x + dx, y + dy, z]) };
  if (item.k === "cam") return { ...item, x: item.x + dx, y: item.y + dy, tx: item.tx + dx, ty: item.ty + dy };
  return { ...item, x: item.x + dx, y: item.y + dy };
};

export const CELL = 7; // 6-unit pads on a 7-unit pitch
export const WORLD = { x: 20, y: 13 };

// A 6×6 pad at column c (0–2), row r (0–1).
export const zone = (id: string, c: number, r: number, items: Item[]): ZoneArt => ({
  id,
  pad: [c * CELL, r * CELL, 6, 6],
  items: items.map((item) => shift(item, c * CELL, r * CELL)),
});
// A 6×13 pad spanning both rows at column c.
export const zoneTall = (id: string, c: number, items: Item[]): ZoneArt => ({
  id,
  pad: [c * CELL, 0, 6, 13],
  items: items.map((item) => shift(item, c * CELL, 0)),
});

// --- Depth sorting ---------------------------------------------------------------------------
type Solid = Extract<Item, { k: "box" | "cyl" | "person" }>;
type Bounds = { x0: number; x1: number; y0: number; y1: number; z0: number; z1: number };

const bounds = (item: Solid): Bounds => {
  if (item.k === "box") return { x0: item.x, x1: item.x + item.w, y0: item.y, y1: item.y + item.d, z0: item.z, z1: item.z + item.h };
  if (item.k === "cyl") return { x0: item.x - item.r, x1: item.x + item.r, y0: item.y - item.r, y1: item.y + item.r, z0: item.z, z1: item.z + item.h };
  return { x0: item.x - 0.25, x1: item.x + 0.25, y0: item.y - 0.25, y1: item.y + 0.25, z0: item.z, z1: item.z + 1.3 };
};

// True when `a` must be drawn after `b` (a is nearer the viewer or sits on top of b).
const inFront = (a: Bounds, b: Bounds) => {
  const e = 1e-6;
  if (a.x0 >= b.x1 - e) return true;
  if (b.x0 >= a.x1 - e) return false;
  if (a.y0 >= b.y1 - e) return true;
  if (b.y0 >= a.y1 - e) return false;
  return a.z0 >= b.z1 - e;
};

function sortSolids(solids: Solid[]): Solid[] {
  const items = solids.map((item) => ({ item, b: bounds(item) }));
  const out: Solid[] = [];
  const remaining = [...items];
  while (remaining.length) {
    // Draw next whichever solid has nothing left behind it.
    let index = remaining.findIndex((candidate) => remaining.every((other) => other === candidate || !inFront(candidate.b, other.b)));
    if (index < 0) index = 0;
    out.push(remaining.splice(index, 1)[0].item);
  }
  return out;
}

// --- Shapes ----------------------------------------------------------------------------------
const shadowReach = (h: number) => Math.min(h * 0.45, 1.1) * 2 * COS * U; // px, straight to the right

function BoxShadow({ item }: { item: Extract<Item, { k: "box" }> }) {
  if (item.z > 0) return null;
  const dx = shadowReach(item.h);
  const a = project(item.x, item.y);
  const b = project(item.x + item.w, item.y);
  const c = project(item.x + item.w, item.y + item.d);
  const d = project(item.x, item.y + item.d);
  const move = ([x, y]: Pt): Pt => [round(x + dx), y];
  return <polygon className="shadow" points={poly([d, a, move(a), move(b), move(c), c])} />;
}

function CylShadow({ item }: { item: Extract<Item, { k: "cyl" }> }) {
  if (item.z > 0) return null;
  const dx = shadowReach(item.h);
  const [cx, cy] = project(item.x, item.y);
  const rx = round(item.r * U * CIRCLE_RX);
  const ry = round(item.r * U * CIRCLE_RY);
  return <path className="shadow" d={`M${cx},${cy - ry} L${cx + dx},${cy - ry} A${rx},${ry} 0 0 1 ${cx + dx},${cy + ry} L${cx},${cy + ry} A${rx},${ry} 0 0 1 ${cx},${cy - ry} Z`} />;
}

function Box({ item }: { item: Extract<Item, { k: "box" }> }) {
  const { x, y, z, w, d, h } = item;
  const top = [project(x, y, z + h), project(x + w, y, z + h), project(x + w, y + d, z + h), project(x, y + d, z + h)];
  const left = [project(x, y + d, z + h), project(x + w, y + d, z + h), project(x + w, y + d, z), project(x, y + d, z)];
  const right = [project(x + w, y, z + h), project(x + w, y + d, z + h), project(x + w, y + d, z), project(x + w, y, z)];
  return (
    <g className={`t-${item.tone}`}>
      <polygon className="f f-left" points={poly(left)} />
      <polygon className="f f-right" points={poly(right)} />
      <polygon className="f f-top" points={poly(top)} />
    </g>
  );
}

function Cyl({ item }: { item: Extract<Item, { k: "cyl" }> }) {
  const [cx, topY] = project(item.x, item.y, item.z + item.h);
  const [, botY] = project(item.x, item.y, item.z);
  const rx = round(item.r * U * CIRCLE_RX);
  const ry = round(item.r * U * CIRCLE_RY);
  const arc = `A${rx},${ry} 0 0`;
  return (
    <g className={`t-${item.tone}`}>
      <path className="f-left" d={`M${cx - rx},${topY} L${cx - rx},${botY} ${arc} 0 ${cx},${botY + ry} L${cx},${topY + ry} ${arc} 1 ${cx - rx},${topY} Z`} />
      <path className="f-right" d={`M${cx},${topY + ry} L${cx},${botY + ry} ${arc} 0 ${cx + rx},${botY} L${cx + rx},${topY} ${arc} 1 ${cx},${topY + ry} Z`} />
      <path className="f" fill="none" d={`M${cx - rx},${topY} L${cx - rx},${botY} ${arc} 0 ${cx + rx},${botY} L${cx + rx},${topY}`} />
      <ellipse className="f f-top" cx={cx} cy={topY} rx={rx} ry={ry} />
    </g>
  );
}

function Person({ item }: { item: Extract<Item, { k: "person" }> }) {
  const [hx, hy] = project(item.x, item.y, item.z + 1.12);
  return (
    <g className={`t-${item.tone}`}>
      <Cyl item={{ k: "cyl", x: item.x, y: item.y, z: item.z, r: 0.2, h: 0.82, tone: item.tone }} />
      <circle className="f f-top" cx={hx} cy={hy} r={U * 0.19} />
    </g>
  );
}

function Sensor({ item, scale }: { item: Extract<Item, { k: "sensor" }>; scale: number }) {
  const [cx, cy] = project(item.x, item.y, item.z);
  const r = 3.4 * scale;
  return (
    <g className="live">
      <circle className="live-ping" cx={cx} cy={cy} r={r} />
      <circle className="live-dot-core" cx={cx} cy={cy} r={r} />
    </g>
  );
}

function CamCone({ item }: { item: Extract<Item, { k: "cam" }> }) {
  const [cx, cy] = project(item.x, item.y, item.z);
  const [tx, ty] = project(item.tx, item.ty, item.tz);
  const rx = round(0.85 * U * CIRCLE_RX);
  const ry = round(0.85 * U * CIRCLE_RY);
  return <path className="cam-cone" d={`M${cx},${cy} L${tx - rx},${ty} A${rx},${ry} 0 0 0 ${tx + rx},${ty} Z`} />;
}

function CamBody({ item, scale }: { item: Extract<Item, { k: "cam" }>; scale: number }) {
  const [cx, cy] = project(item.x, item.y, item.z);
  const s = 3.6 * scale;
  return (
    <g className="live">
      <rect className="live-ping" x={cx - s} y={cy - s} width={s * 2} height={s * 2} rx={s * 0.4} />
      <rect className="live-dot-core" x={cx - s} y={cy - s} width={s * 2} height={s * 2} rx={s * 0.4} />
    </g>
  );
}

function Line({ item }: { item: Extract<Item, { k: "line" }> }) {
  return <polyline className="live-line" points={poly(item.pts.map(([x, y, z]) => project(x, y, z)))} />;
}

export function Pad({ pad, className = "pad" }: { pad: [number, number, number, number]; className?: string }) {
  const [x, y, w, d] = pad;
  return <polygon className={className} points={poly([project(x, y), project(x + w, y), project(x + w, y + d), project(x, y + d)])} />;
}

// Everything inside one zone, in painter's order: shadows, floor lines and camera cones, solids
// (depth-sorted), then the live markers on top.
export function ZoneItems({ items, liveScale = 1 }: { items: Item[]; liveScale?: number }): ReactNode {
  const solids = sortSolids(items.filter((item): item is Solid => item.k === "box" || item.k === "cyl" || item.k === "person"));
  return (
    <>
      {items.map((item, index) => (item.k === "box" ? <BoxShadow key={`s${index}`} item={item} /> : item.k === "cyl" ? <CylShadow key={`s${index}`} item={item} /> : null))}
      {items.map((item, index) => (item.k === "line" ? <Line key={`l${index}`} item={item} /> : item.k === "cam" ? <CamCone key={`l${index}`} item={item} /> : null))}
      {solids.map((item, index) => (item.k === "box" ? <Box key={index} item={item} /> : item.k === "cyl" ? <Cyl key={index} item={item} /> : <Person key={index} item={item} />))}
      {items.map((item, index) => (item.k === "sensor" ? <Sensor key={`d${index}`} item={item} scale={liveScale} /> : item.k === "cam" ? <CamBody key={`d${index}`} item={item} scale={liveScale} /> : null))}
    </>
  );
}

// --- View boxes ------------------------------------------------------------------------------
// One frame for every full scene, so all eight industries share scale and position.
const MARGIN = 18;
const HEADROOM = 3.7 * U;
export const SCENE_BOX = (() => {
  const left = project(0, WORLD.y)[0] - MARGIN;
  const right = project(WORLD.x, 0)[0] + MARGIN + 22; // room for shadows
  const top = -HEADROOM;
  const bottom = project(WORLD.x, WORLD.y)[1] + MARGIN;
  return { x: round(left), y: round(top), w: round(right - left), h: round(bottom - top) };
})();
export const sceneViewBox = `${SCENE_BOX.x} ${SCENE_BOX.y} ${SCENE_BOX.w} ${SCENE_BOX.h}`;

// A point in the scene as a percentage of the frame, for HTML hotspots laid over the SVG.
export function scenePercent(x: number, y: number, z = 0): { left: string; top: string } {
  const [sx, sy] = project(x, y, z);
  return { left: `${round(((sx - SCENE_BOX.x) / SCENE_BOX.w) * 100)}%`, top: `${round(((sy - SCENE_BOX.y) / SCENE_BOX.h) * 100)}%` };
}

// One frame for every single-zone drawing (tiles, menu icons), so they share scale and baseline.
const MINI_HEADROOM = 4.1;
export function zoneViewBox(art: ZoneArt): string {
  const [x, y, w, d] = art.pad;
  const left = project(x, y + d)[0] - 6;
  const right = project(x + w, y)[0] + 14;
  const top = project(x, y)[1] - MINI_HEADROOM * U;
  const bottom = project(x + w, y + d)[1] + 6;
  return `${round(left)} ${round(top)} ${round(right - left)} ${round(bottom - top)}`;
}
