// The modelling kit behind the detailed 2.5D illustrations.
//
// Scenes are modelled as real solids (three.js is used only as a scene graph, at build time) and
// then drawn as isometric vector art by ../export.ts. Nothing here touches the DOM or WebGL.
//
// Units are metres at model scale, Y is up. Builders place a part by its minimum corner (x, z)
// and its base height (y), so a layout reads like a floor plan. The illustration is seen from
// +x/+z, so the +z face is the "left" face on screen and the +x face the "right" one.

import * as THREE from "three";

// The three flat tones a surface takes: top, left (+z) and right (+x). Light comes from the
// upper left, so tones run light → dark in that order.
export type Tones = [top: string, left: string, right: string];

export type Style = {
  tones: Tones;
  emissive?: string; // a light source: drawn in this colour whatever its facing
  glow?: string; // halo colour for light sources
  opacity?: number;
  glass?: boolean; // gets reflection streaks
  kind?: "label" | "ui" | "fins" | "hazard" | "feed"; // surface artwork, drawn by the exporter
  text?: string;
  fg?: string;
  bg?: string;
};

const material = (style: Style): THREE.MeshBasicMaterial => {
  const m = new THREE.MeshBasicMaterial();
  m.userData = style;
  return m;
};
const tone = (top: string, left: string, right: string, extra: Partial<Style> = {}) => material({ tones: [top, left, right], ...extra });
const lamp = (color: string, glow = color) => material({ tones: [color, color, color], emissive: color, glow });

export const SKY = "#7cc4ff";

// A dark-mode illustration palette: navy ground, light equipment, a few warm accents, and the
// AOne layer in brand blue with a glow.
export const M = {
  ground: tone("#1f3d69", "#15294b", "#0f1f3b"),
  pad: tone("#2b4d7e", "#1d3861", "#142949"),
  asphalt: tone("#132849", "#0e1f3a", "#0a172d"),
  plinth: tone("#0d1d38", "#0a1730", "#071226"),
  panel: tone("#f7fafd", "#d7e4f2", "#adc3dd"), // insulated wall panel
  seam: tone("#bccde1", "#a0b5cf", "#8098b7"),
  wall: tone("#eff4fa", "#d0deee", "#a7bdd7"),
  roof: tone("#dce7f3", "#bacce1", "#95acc8"),
  steel: tone("#f3f8fc", "#c8d8e8", "#8fa7c3"),
  steelDark: tone("#7289a9", "#4f678a", "#374b6c"),
  paint: tone("#e7eff8", "#c5d4e6", "#98afcc"), // machine enamel
  paintBlue: tone("#63abe8", "#3f88c9", "#2b69a6"),
  paintGreen: tone("#5ea08c", "#448270", "#306556"),
  graphite: tone("#3c506f", "#2a3b56", "#1c2b43"),
  rubber: tone("#22324d", "#17253c", "#0f1a2c"),
  belt: tone("#2c3e5b", "#1f2e48", "#162238"),
  orange: tone("#ff9d57", "#f47a26", "#c95a12"),
  yellow: tone("#ffd65f", "#f6b70a", "#c48f00"),
  red: tone("#ff7064", "#e0443a", "#b02d25"),
  white: tone("#ffffff", "#e0eaf5", "#b7cae0"),
  navy: tone("#44699f", "#2d4d7c", "#1d355a"),
  cardboard: tone("#ebc897", "#d0a873", "#aa8553"),
  tape: tone("#f5e5c6", "#e2cea7", "#c4ae86"),
  wood: tone("#d5ad77", "#b88d58", "#916c3f"),
  ceramic: tone("#a86c4e", "#87533c", "#673c2c"),
  skin: tone("#f2c39d", "#dda880", "#bb8862"),
  hivis: tone("#eaf562", "#cbdc2c", "#a1b016"),
  copper: tone("#e4a474", "#c38150", "#995c30"),
  foliage: tone("#6fd09f", "#43a676", "#2e8059"),
  foliageDark: tone("#55b888", "#369066", "#266e4c"),
  marking: tone("#f4b400", "#f4b400", "#f4b400"),
  markingWhite: tone("#b9cce4", "#b9cce4", "#b9cce4"),
  joint: tone("#27487a", "#27487a", "#27487a"), // slab joints
  glassDark: tone("#16305a", "#102648", "#0b1b36", { glass: true }),
  glass: tone("#a8d0f2", "#8fbfea", "#72a8dc", { opacity: 0.4, glass: true }),
  // AOne hardware
  aone: tone("#5aaeef", "#1f77bd", "#15548a"),
  aoneDark: tone("#2f8ad2", "#165f9c", "#0f446f"),
  // Light sources
  windowWarm: lamp("#ffd391", "#ffb155"),
  screen: lamp("#7cc4ff"),
  ledGreen: lamp("#3df08a"),
  ledAmber: lamp("#ffb020"),
  ledRed: lamp("#ff4a3d"),
  ledWhite: lamp("#f4f9ff", "#cfe4ff"),
  ledSky: lamp(SKY),
  off: tone("#3a4d6b", "#2c3c57", "#1f2c43"),
  feed: material({ tones: [SKY, SKY, SKY], kind: "feed" }),
};

// Surface artwork
export const label = (text: string, options: { fg?: string; bg?: string } = {}) => material({ tones: ["#06101d", "#06101d", "#06101d"], kind: "label", text, fg: options.fg ?? SKY, bg: options.bg ?? "#06101d" });
export const ui = () => material({ tones: ["#06101d", "#06101d", "#06101d"], kind: "ui" });
export const fins = () => material({ tones: ["#2f4263", "#2f4263", "#263753"], kind: "fins" });
export const hazard = () => material({ tones: ["#f4b400", "#f4b400", "#f4b400"], kind: "hazard" });

type Mesh = THREE.Mesh;

export function box(w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0): Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x + w / 2, y + h / 2, z + d / 2);
  return mesh;
}

// A box whose silhouette corners are eased.
export function rbox(w: number, h: number, d: number, radius: number, mat: THREE.Material, x = 0, y = 0, z = 0): Mesh {
  const mesh = box(w, h, d, mat, x, y, z);
  mesh.userData.round = radius;
  return mesh;
}

// A vertical cylinder standing on (cx, y, cz). `open` leaves the ends off (bands and sleeves).
export function cyl(radius: number, height: number, mat: THREE.Material, cx = 0, y = 0, cz = 0, radiusTop = radius, open = false): Mesh {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radius, height, 24, 1, open), mat);
  mesh.position.set(cx, y + height / 2, cz);
  return mesh;
}

// A horizontal cylinder centred on (cx, cy, cz), lying along x or z.
export function hcyl(radius: number, length: number, mat: THREE.Material, cx = 0, cy = 0, cz = 0, axis: "x" | "z" = "x", open = false): Mesh {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 24, 1, open), mat);
  if (axis === "x") mesh.rotation.z = -Math.PI / 2;
  else mesh.rotation.x = Math.PI / 2;
  mesh.position.set(cx, cy, cz);
  return mesh;
}

// A sphere, or the upper/lower half of one (domes, helmets).
export function sphere(radius: number, mat: THREE.Material, cx = 0, cy = 0, cz = 0, half: "full" | "top" | "bottom" = "full", squash = 1): Mesh {
  const start = half === "bottom" ? Math.PI / 2 : 0;
  const length = half === "full" ? Math.PI : Math.PI / 2;
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, half === "full" ? 12 : 6, 0, Math.PI * 2, start, length), mat);
  mesh.scale.y = squash;
  mesh.position.set(cx, cy, cz);
  return mesh;
}

// A ring. `wrap` marks one that goes round a solid, so only its near half is drawn.
export function ring(radius: number, tube: number, mat: THREE.Material, cx = 0, cy = 0, cz = 0, plane: "xy" | "xz" | "yz" = "xz", wrap = false): Mesh {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 36), mat);
  if (plane === "xz") mesh.rotation.x = Math.PI / 2;
  if (plane === "yz") mesh.rotation.y = Math.PI / 2;
  mesh.position.set(cx, cy, cz);
  mesh.userData.wrap = wrap;
  return mesh;
}

// A run of pipe through the given points. Drawn segment by segment so each sorts on its own.
export function pipe(points: [number, number, number][], radius: number, mat: THREE.Material): Mesh {
  const mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat);
  mesh.userData = { kind: "pipe", points, radius };
  return mesh;
}

// A flat panel carrying artwork (a screen, a label), centred on (cx, cy, cz).
export function plane(w: number, h: number, mat: THREE.Material, cx: number, cy: number, cz: number, facing: "z" | "x" | "y" = "z"): Mesh {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  mesh.position.set(cx, cy, cz);
  if (facing === "x") mesh.rotation.y = Math.PI / 2;
  if (facing === "y") mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

// A soft halo of light at a point.
export function halo(color: string, size: number, x = 0, y = 0, z = 0): THREE.Object3D {
  const object = new THREE.Object3D();
  object.position.set(x, y, z);
  object.userData = { kind: "halo", color, size };
  return object;
}

// The top of a fan: a dark disc, blades and guard rings, drawn flat in the horizontal plane.
// Its blades are grouped so the page can spin them.
export function fanTop(radius: number, x = 0, y = 0, z = 0): THREE.Object3D {
  const object = new THREE.Object3D();
  object.position.set(x, y, z);
  object.userData = { kind: "fan", radius };
  return object;
}

export function group(x = 0, y = 0, z = 0, ...children: THREE.Object3D[]): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  if (children.length) g.add(...children);
  return g;
}

// Marks a group as one sorting unit: its parts stay together in the drawing order. Use it for
// anything rotated or made of interlocking parts (people, vehicles at an angle, robot arms).
export function unit<T extends THREE.Object3D>(object: T, options: { cls?: string; index?: number; shadow?: boolean; hot?: boolean } = {}): T {
  Object.assign(object.userData, { unit: true, ...options });
  return object;
}

// A fan in a shroud, standing on (x, y, z).
export function fan(radius: number, x = 0, y = 0, z = 0): THREE.Group {
  return group(x, y, z, cyl(radius, 0.1, M.steelDark, 0, 0, 0), fanTop(radius * 0.92, 0, 0.1, 0));
}

export { THREE };
