// Equipment models for the illustrations, built from the kit. Each returns a group whose origin
// is the model's minimum corner on the floor (people, trees and round tanks: their centre).
// Detail goes on the +x and +z faces and on top, which are the faces the drawing shows.
//
// Two rules keep the drawing order sound (the exporter has no depth buffer):
//   1. No part sits inside another. Trim that wraps a body is built as separate face strips,
//      or as an open sleeve, never as a larger box around it.
//   2. Anything rotated or made of interlocking parts is wrapped in unit().

import { THREE, M, SKY, box, rbox, cyl, hcyl, sphere, ring, pipe, group, plane, halo, fan, unit, label, ui, fins, hazard } from "./kit";

type Group = THREE.Group;
type Mat = THREE.Material;

// A wheel seen from its +z side: tyre, rim and hub.
const wheel = (x: number, z: number, r: number, width: number, rim: Mat = M.steel) => [
  hcyl(r, width, M.rubber, x, r, z, "z"),
  hcyl(r * 0.56, 0.02, rim, x, r, z + width / 2 + 0.01, "z"),
  hcyl(r * 0.2, 0.02, M.steelDark, x, r, z + width / 2 + 0.03, "z"),
];

// --- Cold room ----------------------------------------------------------------------------------
export function coldRoom(w = 4.8, d = 3.8, h = 3.0): Group {
  const g = new THREE.Group();
  g.add(box(w + 0.06, 0.14, d + 0.06, M.steel, -0.03, 0, -0.03)); // stainless kerb
  g.add(rbox(w, h - 0.14, d, 0.03, M.panel, 0, 0.14, 0)); // insulated body
  g.add(box(w + 0.1, 0.07, d + 0.1, M.seam, -0.05, h, -0.05)); // roof cap
  for (let x = 1.2; x < w - 0.1; x += 1.2) g.add(box(0.025, h - 0.3, 0.012, M.seam, x, 0.2, d)); // panel joints
  for (let z = 1.2; z < d - 0.1; z += 1.2) g.add(box(0.012, h - 0.3, 0.025, M.seam, w, 0.2, z));
  for (let x = 1.2; x < w - 0.1; x += 1.2) g.add(box(0.025, 0.004, d + 0.1, M.seam, x, h + 0.07, -0.05)); // roof panel joints

  // Door, on the front
  const dx = 0.7;
  const dw = 1.25;
  const dh = 2.25;
  g.add(box(dw + 0.16, dh + 0.1, 0.03, M.steel, dx - 0.08, 0.14, d));
  g.add(rbox(dw, dh, 0.08, 0.025, M.white, dx, 0.16, d + 0.03));
  g.add(box(dw, 0.32, 0.012, M.steel, dx, 0.16, d + 0.11)); // kick plate
  g.add(box(0.36, 0.46, 0.012, M.glassDark, dx + dw / 2 - 0.18, 1.45, d + 0.11)); // vision panel
  for (const y of [0.5, 1.25, 2.0]) g.add(box(0.07, 0.2, 0.03, M.steelDark, dx - 0.07, y, d + 0.03)); // hinges
  g.add(box(0.05, 0.62, 0.05, M.steelDark, dx + dw - 0.2, 0.95, d + 0.11)); // pull handle

  // Sign and temperature display over the door
  g.add(plane(1.5, 0.2, label("COLD ROOM 2", { fg: "#102648", bg: "#bccde1" }), dx + dw + 1.25, dh + 0.5, d + 0.012));
  g.add(rbox(0.8, 0.32, 0.05, 0.02, M.graphite, dx + 0.22, dh + 0.32, d));
  g.add(plane(0.7, 0.22, label("3.8°C"), dx + 0.62, dh + 0.48, d + 0.06));

  // Condensing unit on the roof, with refrigerant lines down the side wall
  const ux = w - 2.3;
  g.add(box(1.7, 0.08, 0.86, M.steelDark, ux + 0.1, h + 0.07, 0.57), rbox(1.9, 0.7, 1.0, 0.04, M.paint, ux, h + 0.15, 0.5));
  g.add(plane(1.6, 0.46, fins(), ux + 0.95, h + 0.5, 1.505));
  g.add(fan(0.36, ux + 0.5, h + 0.85, 1.0), fan(0.36, ux + 1.4, h + 0.85, 1.0));
  g.add(pipe([[w + 0.1, h + 0.3, 0.9], [w + 0.1, 0.7, 0.9]], 0.035, M.copper), pipe([[w + 0.1, h + 0.3, 0.7], [w + 0.1, 0.5, 0.7]], 0.05, M.graphite));
  g.add(box(0.14, 0.1, 0.5, M.steelDark, w, h - 0.2, 0.55)); // pipe clip
  // Access ladder on the side
  for (const z of [2.5, 2.95]) g.add(box(0.04, h + 0.3, 0.04, M.steelDark, w + 0.05, 0, z));
  for (let y = 0.35; y < h + 0.2; y += 0.32) g.add(box(0.03, 0.03, 0.45, M.steelDark, w + 0.055, y, 2.52));
  return g;
}

// --- CNC machining centre -----------------------------------------------------------------------
export function cncMachine(w = 2.3, d = 1.9, h = 2.1, name = "LINE 1"): Group {
  const g = new THREE.Group();
  g.add(box(w, 0.16, d, M.graphite, 0, 0, 0));
  g.add(rbox(w, h - 0.16, d, 0.07, M.paint, 0, 0.16, 0));
  g.add(box(w, 0.16, 0.012, M.paintBlue, 0, h - 0.34, d), box(0.012, 0.16, d, M.paintBlue, w, h - 0.34, 0)); // colour band, front and side

  // Sliding door and window
  const ww = w * 0.52;
  const wh = h * 0.42;
  g.add(rbox(ww + 0.14, wh + 0.14, 0.04, 0.02, M.graphite, w * 0.1 - 0.07, h * 0.3 - 0.07, d));
  g.add(box(ww, wh, 0.012, M.glassDark, w * 0.1, h * 0.3, d + 0.04));
  g.add(box(0.04, wh * 0.6, 0.04, M.steel, w * 0.1 + ww + 0.1, h * 0.36, d));
  g.add(box(ww + 0.5, 0.03, 0.02, M.steelDark, w * 0.06, h * 0.3 - 0.13, d)); // door track

  // Control pendant
  const px = w * 0.74;
  const py = h * 0.32;
  g.add(rbox(0.46, 0.72, 0.1, 0.03, M.graphite, px, py, d));
  g.add(plane(0.36, 0.26, ui(), px + 0.23, py + 0.5, d + 0.11));
  g.add(plane(0.07, 0.07, M.ledGreen, px + 0.11, py + 0.2, d + 0.11), plane(0.07, 0.07, M.ledAmber, px + 0.23, py + 0.2, d + 0.11), plane(0.07, 0.07, M.ledRed, px + 0.35, py + 0.2, d + 0.11));

  // Stack light
  const lx = w - 0.25;
  g.add(cyl(0.025, 0.22, M.steel, lx, h, 0.3), cyl(0.06, 0.1, M.ledGreen, lx, h + 0.22, 0.3), cyl(0.06, 0.1, M.off, lx, h + 0.32, 0.3), cyl(0.06, 0.1, M.off, lx, h + 0.42, 0.3), cyl(0.065, 0.02, M.graphite, lx, h + 0.52, 0.3));
  g.add(halo("#3df08a", 0.7, lx, h + 0.27, 0.3));

  // Top services, the chip conveyor at the side, and the name plate
  g.add(rbox(w * 0.42, 0.22, d * 0.5, 0.03, M.steelDark, w * 0.12, h, d * 0.22), cyl(0.1, 0.3, M.steelDark, w * 0.7, h, d * 0.3));
  g.add(box(0.5, 0.5, d * 0.5, M.steelDark, w, 0, d * 0.3), box(0.42, 0.05, d * 0.44, M.steel, w + 0.04, 0.5, d * 0.33));
  g.add(plane(0.62, 0.13, label(name, { fg: "#ffffff", bg: "#3f88c9" }), w * 0.36, h - 0.26, d + 0.02));
  for (let z = 0.25; z < d - 0.3; z += 0.14) g.add(box(0.012, 0.42, 0.06, M.seam, w, 0.5, z)); // side vents
  return g;
}

// --- Six-axis robot -----------------------------------------------------------------------------
export function robotArm(turn = -Math.PI / 2 + 0.25): Group {
  const g = new THREE.Group();
  g.add(cyl(0.36, 0.1, M.graphite, 0, 0, 0), cyl(0.3, 0.06, M.steelDark, 0, 0.1, 0));
  const turret = group(0, 0.16, 0, cyl(0.25, 0.42, M.orange, 0, 0, 0));
  const shoulder = group(0, 0.52, 0);
  shoulder.add(hcyl(0.21, 0.5, M.orange, 0, 0, 0, "z"), hcyl(0.12, 0.03, M.graphite, 0, 0, 0.265, "z"));
  shoulder.add(rbox(0.24, 1.3, 0.28, 0.09, M.orange, -0.12, 0, -0.14));
  const elbow = group(0, 1.3, 0);
  elbow.add(hcyl(0.18, 0.44, M.orange, 0, 0, 0, "z"), hcyl(0.1, 0.03, M.graphite, 0, 0, 0.235, "z"));
  elbow.add(rbox(1.1, 0.2, 0.22, 0.07, M.orange, 0, -0.1, -0.11));
  const wrist = group(1.1, 0, 0, hcyl(0.11, 0.26, M.graphite, 0.13, 0, 0, "x"), box(0.07, 0.3, 0.3, M.steelDark, 0.26, -0.15, -0.15), box(0.24, 0.05, 0.07, M.steel, 0.33, -0.14, -0.035), box(0.24, 0.05, 0.07, M.steel, 0.33, 0.09, -0.035));
  elbow.add(wrist);
  shoulder.add(elbow);
  turret.add(shoulder);
  g.add(turret);
  turret.rotation.y = turn;
  shoulder.rotation.z = -0.3;
  elbow.rotation.z = -0.6;
  return unit(g);
}

// --- Belt conveyor with cartons -----------------------------------------------------------------
export function carton(w = 0.46, h = 0.32, d = 0.4): Group {
  return unit(group(0, 0, 0, rbox(w, h, d, 0.015, M.cardboard, -w / 2, 0, -d / 2), box(w, 0.006, 0.07, M.tape, -w / 2, h, -0.035), box(0.07, h * 0.6, 0.006, M.tape, -0.035, h * 0.4, d / 2), plane(0.12, 0.08, label("▮▮▯", { fg: "#3b2c16", bg: "#f5e5c6" }), 0.12, h * 0.4, d / 2 + 0.008)));
}

export function conveyor(length = 5.6, w = 0.9, h = 0.78, count = 5): { group: Group; items: Group; travel: number } {
  const g = new THREE.Group();
  g.add(box(length, 0.14, 0.06, M.steel, 0, h - 0.1, 0), box(length, 0.14, 0.06, M.steel, 0, h - 0.1, w - 0.06));
  g.add(box(length - 0.16, 0.03, w - 0.16, M.belt, 0.08, h - 0.02, 0.08));
  g.add(hcyl(0.07, w - 0.14, M.steelDark, length - 0.08, h - 0.07, w / 2, "z"));
  for (let x = 0.35; x < length; x += 1.3) {
    g.add(box(0.06, h - 0.1, 0.06, M.steelDark, x, 0, 0.02), box(0.06, h - 0.1, 0.06, M.steelDark, x, 0, w - 0.08));
    g.add(box(0.04, 0.04, w - 0.2, M.steelDark, x + 0.01, 0.24, 0.1), box(0.16, 0.02, 0.16, M.graphite, x - 0.05, 0, w - 0.13));
  }
  for (let x = 0.6; x < length - 0.3; x += 0.5) g.add(box(0.03, 0.03, 0.012, M.steelDark, x, h - 0.08, w)); // rail fixings
  g.add(rbox(0.36, 0.3, 0.32, 0.04, M.paintBlue, length - 0.62, h - 0.5, w), hcyl(0.1, 0.26, M.steelDark, length - 0.44, h - 0.35, w + 0.45, "z"));
  // Cartons ride in their own group so the page can move them along the belt.
  const items = new THREE.Group();
  items.userData = { shadow: false };
  const travel = length - 0.7;
  for (let i = 0; i < count; i++) {
    const item = carton();
    item.userData = {};
    item.position.set(0.35 + (i * travel) / count, h + 0.012, w / 2);
    items.add(item);
  }
  g.add(items);
  return { group: g, items, travel };
}

// The inspection frame over the line: two posts, a beam and light bars.
export function gantry(span = 1.5, h = 1.75): Group {
  const g = new THREE.Group();
  g.add(box(0.08, h, 0.08, M.steelDark, 0, 0, -0.04), box(0.08, h, 0.08, M.steelDark, 0, 0, span - 0.04), box(0.1, 0.1, span + 0.08, M.steelDark, -0.01, h, -0.04));
  g.add(box(0.2, 0.02, 0.2, M.graphite, -0.06, 0, span - 0.1));
  g.add(box(0.5, 0.035, 0.07, M.ledWhite, 0.12, h - 0.12, span * 0.3));
  return g;
}

// --- Compressed air: screw compressor and receiver ------------------------------------------------
export function compressor(): Group {
  const g = new THREE.Group();
  g.add(box(1.94, 0.1, 1.19, M.graphite, -0.02, 0, -0.02));
  g.add(rbox(1.9, 1.4, 1.15, 0.06, M.paint, 0, 0.1, 0));
  g.add(rbox(0.95, 1.3, 0.02, 0.02, M.paintBlue, 0.08, 0.15, 1.15)); // service door
  g.add(box(0.04, 0.22, 0.03, M.steel, 0.9, 0.75, 1.17));
  for (let y = 0.34; y < 1.25; y += 0.11) g.add(box(0.012, 0.05, 0.82, M.steelDark, 1.9, y, 0.16)); // louvres
  g.add(rbox(0.52, 0.38, 0.03, 0.02, M.graphite, 1.2, 0.93, 1.15), plane(0.42, 0.24, ui(), 1.46, 1.15, 1.19));
  g.add(plane(0.09, 0.09, M.ledRed, 1.3, 0.8, 1.16), plane(0.5, 0.11, label("COMP 2", { fg: "#ffffff", bg: "#2b69a6" }), 0.55, 1.28, 1.18));
  g.add(box(0.9, 0.05, 0.8, M.steelDark, 0.25, 1.5, 0.18));
  for (let x = 0.3; x < 1.1; x += 0.12) g.add(box(0.03, 0.03, 0.76, M.graphite, x, 1.55, 0.2));
  return g;
}

export function airReceiver(r = 0.55, total = 2.6): Group {
  const g = new THREE.Group();
  const s = 0.45;
  const leg = 0.45;
  const length = total - leg - 2 * r * s;
  const y0 = leg + r * s;
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2 + 0.5;
    g.add(box(0.09, leg, 0.09, M.steelDark, Math.cos(angle) * r * 0.75 - 0.045, 0, Math.sin(angle) * r * 0.75 - 0.045));
  }
  g.add(sphere(r, M.steel, 0, y0, 0, "bottom", s), cyl(r, length, M.steel, 0, y0, 0), sphere(r, M.steel, 0, y0 + length, 0, "top", s));
  for (const y of [y0 + 0.03, y0 + length / 2, y0 + length - 0.03]) g.add(ring(r + 0.004, 0.012, M.seam, 0, y, 0, "xz", true));
  // Gauge, safety valve and nameplate
  g.add(hcyl(0.11, 0.03, M.steelDark, 0, y0 + length * 0.7, r + 0.015, "z"), hcyl(0.085, 0.02, M.white, 0, y0 + length * 0.7, r + 0.04, "z"));
  g.add(cyl(0.035, 0.16, M.copper, 0.28, y0 + length + r * s * 0.82, 0.1), cyl(0.05, 0.07, M.red, 0.28, y0 + length + r * s * 0.82 + 0.16, 0.1));
  g.add(plane(0.3, 0.2, label("10 BAR", { fg: "#102648", bg: "#c8d8e8" }), 0.05, y0 + length * 0.32, r + 0.01));
  return unit(g);
}

// --- Air-cooled chiller -----------------------------------------------------------------------
export function chiller(): Group {
  const g = new THREE.Group();
  const w = 3.3;
  const d = 1.4;
  g.add(box(w, 0.12, 0.1, M.graphite, 0, 0, d - 0.22), box(0.1, 0.12, d, M.graphite, w - 0.2, 0, 0));
  g.add(rbox(w, 1.3, d, 0.04, M.paint, 0, 0.12, 0));
  g.add(plane(2.25, 1.0, fins(), 1.22, 0.8, d + 0.004)); // condenser coil
  g.add(box(2.35, 0.04, 0.02, M.steelDark, 0.05, 1.32, d), box(2.35, 0.04, 0.02, M.steelDark, 0.05, 0.26, d));
  // Electrical end
  g.add(rbox(0.74, 1.06, 0.02, 0.01, M.white, 2.49, 0.24, d), plane(0.3, 0.2, ui(), 2.86, 1.05, d + 0.025), box(0.04, 0.2, 0.03, M.steelDark, 2.55, 0.7, d + 0.02));
  g.add(plane(0.22, 0.22, hazard(), 2.86, 0.6, d + 0.025));
  for (let z = 0.2; z < d - 0.2; z += 0.14) g.add(box(0.012, 0.9, 0.06, M.seam, w, 0.3, z)); // end vents
  g.add(fan(0.5, 0.62, 1.42, d / 2), fan(0.5, 1.75, 1.42, d / 2));
  g.add(pipe([[w + 0.25, 0.55, 0.4], [w + 0.25, 0.1, 0.4]], 0.07, M.steel), pipe([[w + 0.25, 0.9, 0.8], [w + 0.25, 0.1, 0.8]], 0.07, M.paintBlue));
  g.add(box(0.25, 0.14, 0.14, M.steel, w, 0.48, 0.33), box(0.25, 0.14, 0.14, M.paintBlue, w, 0.83, 0.73));
  return g;
}

// --- Pallets, cartons and racking ---------------------------------------------------------------
let seed = 7;
const rand = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

export function pallet(cols = 3, rows = 2, layers = 3): Group {
  const g = new THREE.Group();
  for (let i = 0; i < 3; i++) g.add(box(0.1, 0.11, 1.0, M.wood, i * 0.55, 0, 0));
  g.add(box(1.2, 0.03, 1.0, M.wood, 0, 0.11, 0));
  for (let i = 0; i < 4; i++) g.add(box(1.2, 0.004, 0.02, M.ceramic, 0, 0.14, 0.2 + i * 0.2)); // deck gaps
  const cw = 1.16 / cols;
  const cd = 0.96 / rows;
  const ch = 0.32;
  for (let layer = 0; layer < layers; layer++) {
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if (layer === layers - 1 && rand() < 0.2) continue; // an incomplete top layer
        const x = 0.02 + c * cw;
        const z = 0.02 + r * cd;
        const y = 0.144 + layer * ch;
        g.add(box(cw - 0.03, ch - 0.02, cd - 0.03, M.cardboard, x, y, z));
        g.add(box(cw - 0.03, 0.004, 0.06, M.tape, x, y + ch - 0.02, z + cd / 2 - 0.045), box(0.06, ch * 0.5, 0.004, M.tape, x + cw / 2 - 0.045, y + ch * 0.45, z + cd - 0.03));
      }
    }
  }
  return unit(g);
}

// Selective pallet racking: blue uprights, orange beams, loads on each level.
export function rack(bays = 2, levels = 3): Group {
  const g = new THREE.Group();
  const bay = 1.5;
  const depth = 1.0;
  const height = levels * 1.25 + 0.3;
  for (let i = 0; i <= bays; i++) {
    g.add(box(0.08, height, 0.08, M.paintBlue, i * bay, 0, 0), box(0.08, height, 0.08, M.paintBlue, i * bay, 0, depth - 0.08));
    for (let y = 0.4; y < height - 0.2; y += 0.7) g.add(box(0.04, 0.04, depth - 0.16, M.paintBlue, i * bay + 0.02, y, 0.08));
  }
  for (let level = 0; level < levels; level++) {
    const y = level * 1.25 + (level === 0 ? 0.05 : 0.1);
    if (level > 0) g.add(box(bays * bay - 0.08, 0.1, 0.05, M.orange, 0.08, y - 0.1, 0.02), box(bays * bay + 0.08, 0.1, 0.05, M.orange, 0, y - 0.1, depth));
    for (let i = 0; i < bays; i++) {
      if (level === levels - 1 && i === bays - 1) continue; // one empty position
      const load = new THREE.Group();
      load.position.set(i * bay + 0.19, y, 0.1);
      load.add(box(1.2, 0.1, 0.8, M.wood, 0, 0, 0));
      const tall = 0.55 + rand() * 0.35;
      load.add(box(1.14, tall, 0.76, M.cardboard, 0.03, 0.1, 0.02), box(1.14, 0.004, 0.07, M.tape, 0.03, 0.1 + tall, 0.36), box(0.07, tall * 0.5, 0.004, M.tape, 0.56, 0.1 + tall * 0.45, 0.78));
      g.add(load);
    }
  }
  return unit(g);
}

// --- Box truck (cab toward +x) --------------------------------------------------------------------
export function truck(): Group {
  const g = new THREE.Group();
  g.add(box(5.4, 0.16, 0.9, M.graphite, 0.1, 0.5, 0.55));
  // Cargo body
  g.add(box(3.94, 0.08, 2.04, M.steelDark, -0.02, 0.85, -0.02), rbox(3.9, 2.03, 2.0, 0.05, M.white, 0, 0.93, 0));
  for (let x = 0.65; x < 3.8; x += 0.65) g.add(box(0.025, 1.9, 0.012, M.seam, x, 0.99, 2.0));
  g.add(box(3.9, 0.3, 0.012, M.paintBlue, 0, 1.25, 2.0), box(0.012, 0.3, 2.0, M.paintBlue, 3.9, 1.25, 0)); // livery band
  g.add(box(3.9, 0.05, 0.02, M.steelDark, 0, 0.94, 2.0), box(3.9, 0.06, 0.02, M.seam, 0, 2.9, 2.0));
  for (const z of [0.3, 1.0, 1.7]) g.add(box(0.03, 0.04, 0.1, M.ledAmber, 3.9, 2.88, z));
  // Cab
  g.add(box(1.5, 0.24, 1.48, M.graphite, 4.0, 0.64, 0.05), rbox(1.5, 1.34, 1.9, 0.14, M.navy, 4.0, 0.88, 0.05), rbox(1.1, 0.4, 1.7, 0.1, M.navy, 4.05, 2.22, 0.15));
  g.add(box(0.012, 0.62, 1.6, M.glassDark, 5.5, 1.4, 0.2), box(0.72, 0.52, 0.012, M.glassDark, 4.62, 1.46, 1.95));
  g.add(box(0.02, 0.98, 0.012, M.graphite, 4.5, 0.9, 1.95), box(0.14, 0.035, 0.03, M.steel, 4.42, 1.3, 1.95));
  g.add(box(0.012, 0.36, 1.2, M.graphite, 5.5, 0.92, 0.4), rbox(0.14, 0.22, 1.98, 0.05, M.steelDark, 5.5, 0.46, 0.01));
  for (let z = 0.5; z < 1.55; z += 0.16) g.add(box(0.012, 0.3, 0.05, M.steelDark, 5.512, 0.95, z)); // grille bars
  g.add(box(0.03, 0.16, 0.3, M.ledWhite, 5.5, 0.92, 0.08), box(0.03, 0.16, 0.3, M.ledWhite, 5.5, 0.92, 1.62), halo("#cfe4ff", 1.3, 5.6, 1.0, 1.77), halo("#cfe4ff", 1.3, 5.6, 1.0, 0.23));
  g.add(box(0.06, 0.34, 0.14, M.graphite, 5.25, 1.5, 1.96), box(0.03, 0.14, 0.14, M.red, -0.03, 1.0, 1.84)); // mirror, tail light
  // Running gear (near side)
  g.add(...wheel(4.75, 1.76, 0.42, 0.34), ...wheel(1.2, 1.7, 0.42, 0.52), ...wheel(2.15, 1.7, 0.42, 0.52));
  g.add(hcyl(0.2, 0.9, M.steel, 3.05, 0.44, 1.76, "x"));
  return g;
}

// --- Forklift (forks toward +x) carrying a pallet -------------------------------------------------
export function forklift(): Group {
  const g = new THREE.Group();
  g.add(rbox(1.0, 0.6, 0.95, 0.1, M.yellow, 0.45, 0.22, 0), rbox(0.5, 0.86, 0.95, 0.14, M.graphite, -0.08, 0.2, 0));
  g.add(rbox(0.5, 0.12, 0.5, 0.04, M.graphite, 0.5, 0.82, 0.22), rbox(0.12, 0.5, 0.5, 0.04, M.graphite, 0.42, 0.94, 0.22));
  g.add(ring(0.14, 0.02, M.graphite, 1.02, 1.28, 0.47, "xz"), box(0.04, 0.42, 0.04, M.graphite, 1.06, 0.82, 0.45));
  for (const [x, z] of [[0.3, 0.02], [0.3, 0.87], [1.32, 0.02], [1.32, 0.87]]) g.add(box(0.06, 1.28, 0.06, M.graphite, x, 0.82, z));
  g.add(box(1.14, 0.05, 0.93, M.graphite, 0.24, 2.1, 0.01), cyl(0.06, 0.09, M.ledAmber, 0.4, 2.15, 0.47), halo("#ffb020", 0.8, 0.4, 2.2, 0.47));
  // Mast, carriage and forks
  g.add(box(0.08, 2.3, 0.1, M.steelDark, 1.5, 0.1, 0.12), box(0.08, 2.3, 0.1, M.steelDark, 1.5, 0.1, 0.73), box(0.06, 0.08, 0.5, M.steelDark, 1.51, 2.32, 0.22), box(0.06, 0.08, 0.5, M.steelDark, 1.51, 1.2, 0.22));
  g.add(box(0.06, 0.5, 0.8, M.graphite, 1.6, 0.3, 0.07));
  g.add(box(1.05, 0.045, 0.12, M.steel, 1.66, 0.27, 0.2), box(1.05, 0.045, 0.12, M.steel, 1.66, 0.27, 0.63));
  g.add(...wheel(1.22, 0.84, 0.3, 0.22, M.yellow), ...wheel(0.22, 0.86, 0.24, 0.2, M.yellow));
  const load = pallet(2, 2, 2);
  load.userData = {};
  load.position.set(1.7, 0.32, -0.03);
  load.scale.setScalar(0.86);
  g.add(load);
  return unit(g);
}

// --- Kitchen and office block -------------------------------------------------------------------
export function building(w = 4.6, d = 3.4, h = 2.6): Group {
  const g = new THREE.Group();
  g.add(box(w + 0.1, 0.12, d + 0.1, M.pad, -0.05, 0, -0.05), rbox(w, h, d, 0.02, M.wall, 0, 0.12, 0));
  g.add(box(w, 0.5, 0.012, M.roof, 0, 0.12, d), box(0.012, 0.5, d, M.roof, w, 0.12, 0)); // plinth course
  const top = h + 0.12;
  g.add(box(w + 0.3, 0.12, d + 0.3, M.roof, -0.15, top, -0.15));
  g.add(box(w + 0.3, 0.22, 0.1, M.wall, -0.15, top + 0.12, d + 0.05), box(0.1, 0.22, d + 0.1, M.wall, w + 0.05, top + 0.12, -0.05));
  g.add(box(w + 0.1, 0.22, 0.1, M.wall, -0.15, top + 0.12, -0.15), box(0.1, 0.22, d + 0.1, M.wall, -0.15, top + 0.12, -0.05));
  // Lit windows, front
  for (let i = 0; i < 3; i++) {
    const x = 0.45 + i * 1.38;
    g.add(box(1.04, 1.0, 0.03, M.steelDark, x, 1.0, d), box(0.94, 0.9, 0.012, M.windowWarm, x + 0.05, 1.05, d + 0.03));
    g.add(box(0.035, 0.9, 0.012, M.steelDark, x + 0.5, 1.05, d + 0.042), box(0.94, 0.035, 0.012, M.steelDark, x + 0.05, 1.5, d + 0.042), box(1.12, 0.05, 0.08, M.roof, x - 0.04, 0.95, d));
  }
  g.add(plane(1.5, 0.22, label("KITCHEN", { fg: "#102648", bg: "#bacce1" }), w / 2, 2.3, d + 0.012));
  // Door, side window and canopy on the +x face
  g.add(box(0.03, 2.05, 0.98, M.navy, w, 0.12, 0.45), box(0.012, 0.75, 0.6, M.windowWarm, w + 0.03, 1.2, 0.64), box(0.04, 0.2, 0.04, M.steel, w + 0.03, 1.0, 1.3));
  g.add(box(0.03, 1.0, 1.04, M.steelDark, w, 1.0, 1.9), box(0.012, 0.9, 0.94, M.windowWarm, w + 0.03, 1.05, 1.95), box(0.012, 0.9, 0.035, M.steelDark, w + 0.042, 1.05, 2.4));
  g.add(box(0.75, 0.06, 1.3, M.graphite, w, 2.3, 0.3), halo("#ffb155", 1.6, w + 0.4, 1.9, 0.95));
  // Roof plant: packaged unit, the kitchen exhaust, a duct run
  g.add(box(1.2, 0.06, 0.8, M.steelDark, 0.55, top + 0.12, 0.65), rbox(1.3, 0.6, 0.9, 0.04, M.paint, 0.5, top + 0.18, 0.6), plane(1.1, 0.36, fins(), 1.15, top + 0.5, 1.505));
  g.add(fan(0.34, 1.15, top + 0.78, 1.05));
  const ex = w - 1.0;
  const ez = d - 1.0;
  g.add(rbox(0.5, 0.2, 0.5, 0.03, M.steelDark, ex - 0.25, top + 0.12, ez - 0.25), cyl(0.16, 0.9, M.steel, ex, top + 0.32, ez), cyl(0.27, 0.06, M.steelDark, ex, top + 1.3, ez), cyl(0.03, 0.08, M.steelDark, ex, top + 1.22, ez));
  g.add(box(0.3, 0.26, 1.5, M.steel, 2.2, top + 0.12, 0.5));
  return g;
}

// A caged store of LPG cylinders, beside the kitchen.
export function lpgStore(): Group {
  const g = new THREE.Group();
  g.add(box(1.5, 0.06, 0.8, M.pad, 0, 0, 0));
  for (let i = 0; i < 4; i++) {
    const x = 0.22 + i * 0.35;
    g.add(cyl(0.15, 0.62, M.red, x, 0.06, 0.4), sphere(0.15, M.red, x, 0.68, 0.4, "top", 0.6), cyl(0.07, 0.1, M.steelDark, x, 0.76, 0.4), ring(0.153, 0.012, M.yellow, x, 0.5, 0.4, "xz", true));
  }
  for (const x of [0, 1.46]) g.add(box(0.04, 1.2, 0.04, M.steelDark, x, 0.06, 0.76), box(0.04, 1.2, 0.04, M.steelDark, x, 0.06, 0));
  g.add(box(1.5, 0.04, 0.04, M.steelDark, 0, 1.22, 0.76), box(1.5, 0.04, 0.04, M.steelDark, 0, 0.66, 0.76), box(0.04, 0.04, 0.8, M.steelDark, 1.46, 1.22, 0), box(0.04, 0.04, 0.8, M.steelDark, 1.46, 0.66, 0));
  g.add(plane(0.26, 0.26, hazard(), 0.75, 0.95, 0.81));
  return unit(g);
}

// --- Power yard: generator, fuel, transformer, switchboard ----------------------------------------
export function dgSet(): Group {
  const g = new THREE.Group();
  g.add(box(3.1, 0.14, 1.36, M.graphite, -0.05, 0, -0.03), rbox(3.0, 1.5, 1.3, 0.06, M.paintGreen, 0, 0.14, 0));
  for (const px of [0.2, 1.8]) {
    g.add(box(1.0, 0.92, 0.012, M.graphite, px, 0.46, 1.3));
    for (let y = 0.52; y < 1.32; y += 0.09) g.add(box(0.94, 0.04, 0.012, M.steelDark, px + 0.03, y, 1.312));
  }
  g.add(box(0.03, 0.2, 0.03, M.steel, 1.36, 0.8, 1.3), box(0.03, 0.2, 0.03, M.steel, 1.6, 0.8, 1.3));
  g.add(rbox(0.36, 0.26, 0.02, 0.02, M.graphite, 1.32, 1.3, 1.3), plane(0.28, 0.18, ui(), 1.5, 1.43, 1.33), plane(0.24, 0.24, hazard(), 2.3, 1.5, 1.33));
  g.add(plane(0.7, 0.14, label("DG 250 kVA", { fg: "#ffffff", bg: "#306556" }), 0.7, 1.52, 1.32));
  g.add(box(0.012, 1.1, 1.0, M.graphite, 3.0, 0.36, 0.15));
  for (let z = 0.2; z < 1.12; z += 0.1) g.add(box(0.012, 1.04, 0.04, M.steelDark, 3.012, 0.39, z));
  g.add(cyl(0.09, 0.95, M.steelDark, 0.5, 1.64, 0.65), cyl(0.16, 0.04, M.steelDark, 0.5, 2.62, 0.65));
  return g;
}

export function fuelTank(): Group {
  const g = new THREE.Group();
  g.add(box(2.4, 0.16, 1.3, M.graphite, 0, 0, 0));
  g.add(box(0.14, 0.42, 0.8, M.steelDark, 0.6, 0.16, 0.25), box(0.14, 0.42, 0.8, M.steelDark, 1.66, 0.16, 0.25));
  g.add(hcyl(0.45, 1.9, M.white, 1.2, 1.0, 0.65, "x"), hcyl(0.456, 0.3, M.yellow, 1.2, 1.0, 0.65, "x", true));
  g.add(cyl(0.06, 0.12, M.steelDark, 0.8, 1.45, 0.65), cyl(0.03, 0.4, M.steelDark, 1.7, 1.45, 0.65), plane(0.3, 0.3, hazard(), 0.72, 1.0, 1.105), plane(0.5, 0.14, label("DIESEL", { fg: "#102648", bg: "#e0eaf5" }), 1.72, 1.0, 1.105));
  return unit(g);
}

export function transformer(): Group {
  const g = new THREE.Group();
  g.add(box(2.5, 0.05, 2.1, M.asphalt, 0, 0, 0), box(1.7, 0.18, 1.3, M.pad, 0.4, 0.05, 0.4));
  g.add(rbox(1.3, 1.25, 0.9, 0.05, M.steelDark, 0.6, 0.23, 0.6), box(1.42, 0.06, 1.02, M.steelDark, 0.54, 1.48, 0.54));
  for (let i = 0; i < 9; i++) g.add(box(0.035, 0.95, 0.4, M.seam, 0.68 + i * 0.14, 0.4, 1.56));
  g.add(hcyl(0.04, 1.2, M.steelDark, 1.25, 1.3, 2.0, "x"));
  // HV and LV bushings
  for (const z of [0.78, 1.05, 1.32]) {
    g.add(cyl(0.05, 0.5, M.ceramic, 0.95, 1.54, z));
    for (let k = 0; k < 4; k++) g.add(cyl(0.1 - k * 0.012, 0.025, M.ceramic, 0.95, 1.6 + k * 0.1, z));
    g.add(cyl(0.02, 0.1, M.copper, 0.95, 2.04, z));
  }
  for (const z of [0.8, 1.0, 1.2, 1.4]) g.add(cyl(0.035, 0.2, M.ceramic, 1.6, 1.54, z), cyl(0.015, 0.06, M.copper, 1.6, 1.74, z));
  // Conservator
  g.add(box(0.05, 0.42, 0.05, M.steelDark, 1.2, 1.54, 0.6), hcyl(0.2, 0.9, M.steelDark, 1.22, 2.16, 1.05, "z"));
  g.add(plane(0.36, 0.2, label("11 kV", { fg: "#102648", bg: "#c8d8e8" }), 1.91, 0.9, 1.05, "x"), plane(0.24, 0.24, hazard(), 1.91, 1.25, 1.05, "x"));
  return unit(g);
}

export function switchboard(count = 3): Group {
  const g = new THREE.Group();
  g.add(box(count * 0.8, 0.1, 0.5, M.graphite, 0, 0, 0));
  for (let i = 0; i < count; i++) {
    const x = i * 0.8;
    g.add(rbox(0.8, 2.0, 0.5, 0.02, M.paint, x, 0.1, 0), box(0.02, 1.9, 0.012, M.seam, x + 0.78, 0.15, 0.5), box(0.03, 0.2, 0.03, M.steelDark, x + 0.66, 1.0, 0.5));
    g.add(rbox(0.3, 0.24, 0.02, 0.01, M.graphite, x + 0.25, 1.5, 0.5), plane(0.24, 0.17, ui(), x + 0.4, 1.62, 0.525));
    g.add(plane(0.07, 0.07, M.ledRed, x + 0.29, 1.36, 0.505), plane(0.07, 0.07, M.ledAmber, x + 0.4, 1.36, 0.505), plane(0.07, 0.07, M.ledSky, x + 0.51, 1.36, 0.505));
    for (let y = 0.3; y < 0.7; y += 0.08) g.add(box(0.4, 0.025, 0.012, M.steelDark, x + 0.2, y, 0.5));
  }
  g.add(box(count * 0.8, 0.07, 0.3, M.steelDark, 0, 2.35, 0.1));
  for (let i = 0; i < count; i++) g.add(box(0.2, 0.25, 0.2, M.steelDark, i * 0.8 + 0.3, 2.1, 0.15));
  return g;
}

// --- People and site furniture ----------------------------------------------------------------
export function worker(vest: Mat = M.hivis, helmet: Mat = M.yellow, holding = false): Group {
  const g = new THREE.Group();
  g.add(cyl(0.075, 0.82, M.navy, -0.095, 0, 0, 0.07), cyl(0.075, 0.82, M.navy, 0.095, 0, 0, 0.07));
  g.add(rbox(0.16, 0.08, 0.28, 0.03, M.graphite, -0.175, 0, -0.1), rbox(0.16, 0.08, 0.28, 0.03, M.graphite, 0.015, 0, -0.1));
  g.add(rbox(0.42, 0.6, 0.25, 0.1, vest, -0.21, 0.8, -0.125), box(0.425, 0.05, 0.255, M.white, -0.2125, 1.02, -0.1275));
  for (const side of [-1, 1]) {
    const pivot = group(side * 0.27, 1.36, 0, cyl(0.058, 0.55, vest === M.aone ? M.aoneDark : M.navy, 0, -0.55, 0, 0.052), sphere(0.06, M.skin, 0, -0.58, 0));
    pivot.rotation.z = side * 0.14;
    if (holding) pivot.rotation.x = -1.0;
    g.add(pivot);
  }
  g.add(cyl(0.05, 0.08, M.skin, 0, 1.38, 0), sphere(0.13, M.skin, 0, 1.57, 0));
  g.add(sphere(0.145, helmet, 0, 1.6, 0, "top"), cyl(0.17, 0.02, helmet, 0, 1.59, 0.03));
  if (holding) g.add(rbox(0.28, 0.02, 0.2, 0.008, M.graphite, -0.14, 1.03, 0.26), plane(0.24, 0.16, ui(), 0, 1.055, 0.36, "y"));
  return unit(g);
}

export function bollard(): Group {
  return unit(group(0, 0, 0, cyl(0.07, 0.9, M.yellow, 0, 0, 0), cyl(0.074, 0.1, M.graphite, 0, 0.55, 0, 0.074, true), cyl(0.074, 0.1, M.graphite, 0, 0.25, 0, 0.074, true), sphere(0.07, M.yellow, 0, 0.9, 0, "top")));
}

export function trafficCone(): Group {
  return unit(group(0, 0, 0, box(0.32, 0.03, 0.32, M.orange, -0.16, 0, -0.16), cyl(0.12, 0.42, M.orange, 0, 0.03, 0, 0.03), cyl(0.092, 0.08, M.white, 0, 0.18, 0, 0.075, true)));
}

export function drum(mat: Mat = M.paintBlue): Group {
  return unit(group(0, 0, 0, cyl(0.29, 0.88, mat, 0, 0, 0), ring(0.295, 0.014, M.steelDark, 0, 0.3, 0, "xz", true), ring(0.295, 0.014, M.steelDark, 0, 0.6, 0, "xz", true), cyl(0.05, 0.03, M.steelDark, 0.12, 0.88, 0.05)));
}

// A length of yellow safety rail along x.
export function railing(length: number): Group {
  const g = new THREE.Group();
  for (let x = 0; x <= length + 0.01; x += length / Math.max(1, Math.round(length / 1.5))) g.add(box(0.07, 1.0, 0.07, M.yellow, x - 0.035, 0, 0));
  g.add(box(length, 0.06, 0.05, M.yellow, 0, 0.94, 0.01), box(length, 0.06, 0.05, M.yellow, 0, 0.5, 0.01));
  return g;
}

export function tree(height = 2.2): Group {
  const s = height / 2.2;
  return unit(group(0, 0, 0, cyl(0.09 * s, 0.75 * s, M.wood, 0, 0, 0, 0.06 * s), sphere(0.62 * s, M.foliageDark, 0, 1.15 * s, 0), sphere(0.46 * s, M.foliage, 0.12 * s, 1.72 * s, 0.1 * s), sphere(0.34 * s, M.foliage, -0.3 * s, 1.45 * s, 0.25 * s)));
}

// A planter with low shrubs.
export function planter(length = 2.4): Group {
  const g = new THREE.Group();
  g.add(box(length, 0.35, 0.6, M.pad, 0, 0, 0), box(length - 0.12, 0.03, 0.48, M.wood, 0.06, 0.35, 0.06));
  for (let x = 0.35; x < length - 0.2; x += 0.55) g.add(sphere(0.3, x % 1.1 < 0.5 ? M.foliage : M.foliageDark, x, 0.38, 0.3, "top", 0.9));
  return unit(g);
}

export function lampPost(): Group {
  const g = new THREE.Group();
  g.add(cyl(0.1, 0.12, M.graphite, 0, 0, 0), cyl(0.045, 3.38, M.steelDark, 0, 0.12, 0, 0.035));
  g.add(box(0.7, 0.05, 0.06, M.steelDark, -0.02, 3.5, -0.03), rbox(0.42, 0.08, 0.2, 0.03, M.graphite, 0.4, 3.42, -0.1), box(0.36, 0.02, 0.16, M.ledWhite, 0.43, 3.4, -0.08));
  g.add(halo("#cfe4ff", 1.8, 0.61, 3.36, 0));
  return unit(g);
}

// --- AOne hardware ------------------------------------------------------------------------------
// A wireless sensor: a small blue puck with a light ring, on a bracket. Faces +z by default.
export function sensor(facing: "z" | "x" = "z"): Group {
  const body = new THREE.Group();
  body.add(rbox(0.32, 0.07, 0.03, 0.015, M.steelDark, -0.16, -0.035, 0), rbox(0.27, 0.27, 0.09, 0.035, M.aone, -0.135, -0.135, 0.03));
  body.add(ring(0.078, 0.02, M.ledSky, 0, 0, 0.125, "xy"), hcyl(0.03, 0.01, M.ledSky, 0, 0, 0.125, "z"), halo(SKY, 1.6, 0, 0, 0.14));
  if (facing === "x") body.rotation.y = Math.PI / 2;
  const g = new THREE.Group();
  g.add(body);
  return unit(g, { cls: "drop", shadow: false });
}

// A bullet camera with its view cone, looking from its origin toward `target` (local coordinates).
export function camera(target: [number, number, number], reach: number, spread = 0.9): Group {
  const g = new THREE.Group();
  const head = new THREE.Group();
  head.add(rbox(0.36, 0.16, 0.16, 0.05, M.white, -0.36, -0.08, -0.08), box(0.42, 0.02, 0.2, M.white, -0.4, 0.08, -0.1));
  head.add(hcyl(0.078, 0.03, M.aone, 0.015, 0, 0, "x"), hcyl(0.05, 0.012, M.glassDark, 0.036, 0, 0, "x"));
  const direction = new THREE.Vector3(...target).normalize();
  head.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction);
  const cone = new THREE.Object3D();
  cone.userData = { kind: "cone", direction: direction.toArray(), reach, spread };
  g.add(head, cone, sphere(0.06, M.steelDark, -0.02, 0.02, 0));
  return unit(g, { cls: "drop", shadow: false });
}

// The gateway: collects every sensor on site and sends it on over 4G.
export function gateway(): Group {
  const g = new THREE.Group();
  g.add(box(0.3, 0.03, 0.3, M.graphite, -0.15, 0, -0.15), cyl(0.05, 1.2, M.steelDark, 0, 0.03, 0));
  g.add(rbox(0.56, 0.76, 0.18, 0.04, M.aone, -0.28, 1.15, -0.09), rbox(0.48, 0.5, 0.012, 0.02, M.aoneDark, -0.24, 1.2, 0.09));
  g.add(plane(0.42, 0.15, label("AOne", { fg: "#ffffff", bg: "#165f9c" }), 0, 1.8, 0.105));
  for (let i = 0; i < 3; i++) g.add(plane(0.07, 0.07, M.ledSky, -0.12 + i * 0.12, 1.3, 0.105));
  g.add(cyl(0.016, 0.42, M.graphite, -0.2, 1.91, 0, 0.01), cyl(0.016, 0.42, M.graphite, 0.2, 1.91, 0, 0.01), halo(SKY, 2.2, 0, 1.6, 0.12));
  return unit(g, { shadow: false });
}
