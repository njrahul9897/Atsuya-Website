// The plant at night, for the homepage problem section: one bay after hours, with a zone for
// each of the five problems AOne listens for. The page plays one story at a time.
//
//   energy  the office block, its lights and AC left on with nobody in; an AOne energy sensor
//   break   Compressor 2 and its air receiver; a sensor on the compressor; a technician to come
//   cold    Cold Room 2; a sensor on it; its door can stand open and its readout climb
//   defect  a packing line with a Vision AI camera on a gantry, a reject pusher and a reject bin
//   audit   the things an audit checks: fire extinguisher, electrical panel, cold-room log, first aid
//
// Every device has a data line to one gateway. Parts the page animates carry classes (see
// `.ops-scene` in app/globals.css); named anchors let it pin labels to machines.
//
// Drawn in daylight tones like the other scenes; the build script shades it for night (every
// colour darkened and cooled, light sources left bright). The plan is 14 × 10 m.

import { THREE, M, SKY, box, rbox, cyl, plane, pipe, halo, fan, unit, label } from "./kit";
import * as P from "./props";

export const NIGHT = { x: 14, z: 10 };
const GATEWAY: [number, number] = [6.8, 6.6];
export const NIGHT_LIGHTS = ["#cfe4ff", "#ffb020", "#ff4a3d", "#3df08a", "#1f77bd", "#ffb155"]; // glow colours kept bright at night
export const PROBLEMS = ["energy", "break", "cold", "defect", "audit"] as const;
const CLOCK: Record<(typeof PROBLEMS)[number], string> = { energy: "22:40", break: "02:51", cold: "01:12", defect: "03:30", audit: "06:00" };

export function buildNight(): THREE.Group {
  const root = new THREE.Group();
  const place = <T extends THREE.Object3D>(object: T, x: number, z: number, rotation = 0, y = 0): T => {
    object.position.set(x, y, z);
    object.rotation.y = rotation;
    root.add(object);
    return object;
  };
  const anchor = (name: string, x: number, y: number, z: number) => {
    const point = new THREE.Object3D();
    point.position.set(x, y, z);
    point.userData.anchor = name;
    root.add(point);
  };
  const tagged = <T extends THREE.Object3D>(object: T, cls: string, overlay = false): T => {
    Object.assign(object.userData, { cls, ...(overlay ? { overlay: true } : {}) });
    root.add(object);
    return object;
  };
  // A data line from a device to the gateway, tagged so the page can pulse it.
  let lines = 0;
  const line = (tag: string, points: [number, number, number][]) => {
    const run = pipe(points, 0.04, M.feed);
    Object.assign(run.userData, { index: lines++, tag });
    root.add(run);
  };
  // An AOne sensor whose light the page drives (green, amber, red).
  const sensor = (cls: string, facing: "z" | "x", x: number, y: number, z: number) => unit(place(P.sensor(facing), x, z, 0, y), { cls: `dev ${cls}`, hot: true, shadow: false });

  // --- Floor ---------------------------------------------------------------------------------
  const glow = halo("#1f77bd", 24, NIGHT.x / 2, -0.6, NIGHT.z / 2);
  glow.userData.backdrop = true;
  root.add(glow);
  root.add(box(15.4, 0.3, 11.4, M.plinth, -0.7, -0.8, -0.7));
  root.add(rbox(14.8, 0.5, 10.8, 0.14, M.ground, -0.4, -0.5, -0.4));
  root.add(box(14.8, 0.05, 0.02, M.ledSky, -0.4, -0.44, 10.4), box(0.02, 0.05, 10.8, M.ledSky, 14.4, -0.44, -0.4));
  for (let x = 2.4; x < 14; x += 2.4) root.add(box(0.035, 0.004, 10.4, M.joint, x, 0, -0.15));
  for (let z = 2.4; z < 10; z += 2.4) root.add(box(14.55, 0.004, 0.035, M.joint, -0.15, 0, z));
  // Walkway along the front, and the hatched zone round the compressor
  for (const z of [9.75, 10.25]) root.add(box(9.0, 0.012, 0.06, M.marking, 5.2, 0, z));
  root.add(box(3.4, 0.014, 0.06, M.marking, 9.9, 0, 3.9), box(3.4, 0.014, 0.06, M.marking, 9.9, 0, 6.0));
  root.add(box(0.06, 0.014, 2.16, M.marking, 9.9, 0, 3.9), box(0.06, 0.014, 2.16, M.marking, 13.24, 0, 3.9));

  // --- Walls: high windows on the night outside, wall lights above them ---------------------------
  const H = 3.4;
  root.add(box(14.8, H, 0.25, M.wall, -0.4, 0, -0.4)); // back wall (faces +z)
  root.add(box(0.25, H, 10.55, M.wall, -0.4, 0, -0.15)); // side wall (faces +x)
  root.add(box(14.8, 0.6, 0.012, M.seam, -0.4, 0, -0.15), box(0.012, 0.6, 10.55, M.seam, -0.15, 0, -0.15)); // dado
  for (let x = 5.4; x < 12.2; x += 2.4) root.add(box(1.9, 0.7, 0.012, M.glassDark, x, 2.5, -0.14));
  for (let z = 3.6; z < 8.2; z += 2.4) root.add(box(0.012, 0.7, 1.9, M.glassDark, -0.14, 2.5, z));
  const lamp = (x: number, z: number, along: "x" | "z") => {
    if (along === "x") root.add(rbox(0.5, 0.12, 0.16, 0.03, M.graphite, x - 0.25, 3.24, z), box(0.44, 0.02, 0.12, M.ledWhite, x - 0.22, 3.22, z + 0.02));
    else root.add(rbox(0.16, 0.12, 0.5, 0.03, M.graphite, x, 3.24, z - 0.25), box(0.12, 0.02, 0.44, M.ledWhite, x + 0.02, 3.22, z - 0.22));
    root.add(halo("#cfe4ff", 3.4, along === "x" ? x : x + 0.5, 2.84, along === "x" ? z + 0.5 : z));
  };
  lamp(6.6, -0.15, "x");
  lamp(11.4, -0.15, "x");
  lamp(-0.15, 5.0, "z");

  // The clock, one face per story
  root.add(rbox(1.2, 0.5, 0.08, 0.04, M.graphite, 5.4, 1.75, -0.15));
  for (const problem of PROBLEMS) tagged(plane(1.04, 0.36, label(CLOCK[problem], { fg: SKY, bg: "#06101d" }), 6.0, 2.0, -0.06), `clk clk-${problem}`);

  // --- cold: Cold Room 2 -----------------------------------------------------------------------
  place(P.coldRoom(4.2, 3.0, 3.0), 0.3, 0.3);
  // The door left open (a dark doorway, cold air spilling out) and the readout climbing
  tagged(box(1.25, 2.25, 0.012, M.glassDark, 1.0, 0.16, 3.47), "c-door");
  tagged(halo("#cfe4ff", 2.6, 1.62, 0.5, 3.9), "c-door", true);
  tagged(plane(0.7, 0.22, label("6.4°C", { fg: "#ff4a3d", bg: "#06101d" }), 1.62, 2.73, 3.375), "c-temp-hi");
  sensor("dev-cold", "z", 3.5, 1.6, 3.315);
  line("line-cold", [[3.5, 1.6, 3.35], [3.5, 0.05, 3.35], [3.5, 0.05, 6.0], [GATEWAY[0], 0.05, 6.0], [GATEWAY[0], 0.05, GATEWAY[1] - 0.16]]);

  // First-aid box on the side wall (an audit check)
  root.add(rbox(0.12, 0.5, 0.6, 0.02, M.white, -0.15, 1.5, 4.3), plane(0.4, 0.3, label("+", { fg: "#ffffff", bg: "#2f9e6e" }), -0.025, 1.75, 4.6, "x"));

  // --- defect: the packing line and its Vision AI camera -----------------------------------------
  place(P.conveyor(5.0, 0.9, 0.78, 0).group, 5.2, 1.4);
  for (const x of [5.8, 6.7, 7.6, 9.6]) place(P.carton(), x, 1.85, 0, 0.792);
  place(P.gantry(1.2, 1.75), 8.4, 1.27);
  const camera = place(P.camera([0.1, -1, 0], 0.62, 1.2), 8.6, 1.85, 0, 1.45);
  unit(camera, { cls: "dev-cam", shadow: false });
  // The pusher behind the belt, its rod (out when it rejects), and the reject bin in front
  root.add(rbox(0.4, 0.24, 0.45, 0.03, M.paintBlue, 8.35, 0.78, 0.75), box(0.3, 0.78, 0.06, M.steelDark, 8.4, 0, 0.82));
  tagged(box(0.06, 0.06, 0.42, M.steel, 8.52, 0.88, 1.21), "d-push");
  const bad = place(P.carton(), 8.55, 1.85, 0, 0.792);
  bad.add(box(0.47, 0.06, 0.012, M.red, -0.235, 0.12, 0.21)); // the misprinted label strip
  unit(bad, { cls: "d-bad", shadow: false });
  tagged(halo("#ff4a3d", 2.2, 8.55, 1.0, 2.05), "d-flag", true);
  root.add(box(0.9, 0.05, 0.7, M.graphite, 8.2, 0, 2.6));
  root.add(box(0.9, 0.25, 0.04, M.red, 8.2, 0.05, 2.6), box(0.9, 0.25, 0.04, M.red, 8.2, 0.05, 3.26), box(0.04, 0.25, 0.62, M.red, 8.2, 0.05, 2.64), box(0.04, 0.25, 0.62, M.red, 9.06, 0.05, 2.64));
  root.add(plane(0.5, 0.12, label("REJECT", { fg: "#ffffff", bg: "#b02d25" }), 8.65, 0.17, 3.305));
  unit(place(P.carton(), 8.65, 2.95, 0, 0.05), { cls: "d-binned", shadow: false });
  line("line-cam", [[8.44, 1.6, 2.55], [8.44, 0.05, 2.55], [9.4, 0.05, 2.55], [9.4, 0.05, 6.0], [GATEWAY[0], 0.05, 6.0], [GATEWAY[0], 0.05, GATEWAY[1] - 0.16]]);

  // --- audit: the electrical panel and the fire extinguisher on the back wall ----------------------
  place(P.switchboard(3), 10.6, 0.1);
  root.add(box(0.2, 0.06, 0.02, M.steelDark, 13.45, 1.0, -0.15), cyl(0.11, 0.55, M.red, 13.55, 0.6, -0.02), cyl(0.04, 0.1, M.graphite, 13.55, 1.15, -0.02));
  root.add(plane(0.36, 0.22, label("FIRE", { fg: "#ffffff", bg: "#b02d25" }), 13.55, 1.55, -0.135));

  // --- break: Compressor 2 and its air receiver -------------------------------------------------------
  place(P.compressor(), 10.4, 4.3);
  place(P.airReceiver(), 13.2, 4.9);
  root.add(pipe([[12.3, 1.15, 4.9], [12.65, 1.15, 4.9]], 0.06, M.paintBlue));
  root.add(pipe([[13.2, 2.56, 4.9], [13.2, 3.0, 4.9], [13.2, 3.0, -0.1]], 0.06, M.paintBlue));
  sensor("dev-break", "z", 10.95, 0.8, 5.475);
  line("line-break", [[10.95, 0.8, 5.51], [10.95, 0.05, 5.51], [10.95, 0.05, 7.0], [GATEWAY[0], 0.05, 7.0], [GATEWAY[0], 0.05, GATEWAY[1] + 0.16]]);
  tagged(halo("#ffb020", 4.2, 11.35, 1.0, 5.6), "b-warn", true);
  tagged(halo("#ff4a3d", 4.4, 11.35, 1.0, 5.6), "b-alarm", true);
  const technician = place(P.worker(M.aone, M.white, true), 11.3, 6.45, Math.PI);
  unit(technician, { cls: "b-tech", shadow: false });

  // --- energy: the office block ------------------------------------------------------------------
  const ox = 0.3;
  const oz = 6.6;
  const ow = 4.0;
  const od = 3.0;
  const oh = 2.4;
  const top = oh + 0.12;
  root.add(box(ow + 0.1, 0.12, od + 0.1, M.pad, ox - 0.05, 0, oz - 0.05), rbox(ow, oh, od, 0.02, M.wall, ox, 0.12, oz));
  root.add(box(ow + 0.3, 0.12, od + 0.3, M.roof, ox - 0.15, top, oz - 0.15));
  root.add(plane(1.3, 0.22, label("OFFICE", { fg: "#102648", bg: "#bacce1" }), ox + 2.0, 2.25, oz + od + 0.012));
  const lit = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const x = ox + 0.35 + i * 1.2;
    root.add(box(0.95, 0.95, 0.03, M.steelDark, x, 0.95, oz + od), box(0.85, 0.85, 0.012, M.glassDark, x + 0.05, 1.0, oz + od + 0.03));
    lit.add(box(0.85, 0.85, 0.012, M.windowWarm, x + 0.05, 1.0, oz + od + 0.043), halo("#ffb155", 1.5, x + 0.48, 1.4, oz + od + 0.35));
  }
  for (const z of [0.3, 1.45]) {
    root.add(box(0.03, 0.95, 0.95, M.steelDark, ox + ow, 0.95, oz + z), box(0.012, 0.85, 0.85, M.glassDark, ox + ow + 0.03, 1.0, oz + z + 0.05));
    lit.add(box(0.012, 0.85, 0.85, M.windowWarm, ox + ow + 0.043, 1.0, oz + z + 0.05), halo("#ffb155", 1.5, ox + ow + 0.35, 1.4, oz + z + 0.48));
  }
  root.add(unit(lit, { cls: "e-lights", shadow: false }));
  // Roof AC: the fan spins while it runs
  root.add(box(1.2, 0.06, 0.8, M.steelDark, ox + 0.55, top + 0.12, oz + 0.65), rbox(1.3, 0.6, 0.9, 0.04, M.paint, ox + 0.5, top + 0.18, oz + 0.6));
  const ac = fan(0.32, ox + 1.15, top + 0.78, oz + 1.05);
  ac.children[1].userData.cls = "e-fan";
  root.add(ac);
  sensor("dev-energy", "x", ox + ow + 0.005, 1.3, oz + 2.75);
  line("line-energy", [[ox + ow + 0.04, 1.3, oz + 2.75], [ox + ow + 0.04, 0.05, oz + 2.75], [6.0, 0.05, oz + 2.75], [6.0, 0.05, GATEWAY[1]], [GATEWAY[0] - 0.16, 0.05, GATEWAY[1]]]);

  // --- The floor tonight: one operator, a parked forklift, stock and drums ---------------------------
  place(P.worker(M.hivis, M.white, true), 5.4, 9.3, 2.4);
  place(P.forklift(), 9.0, 8.3, 0.4);
  place(P.pallet(3, 2, 2), 11.8, 8.4).scale.setScalar(0.9);
  place(P.drum(), 13.4, 7.0);
  place(P.drum(M.yellow), 13.85, 7.5);

  // --- The gateway, and its signal as it sends an alert on ---------------------------------------------
  place(P.gateway(), GATEWAY[0], GATEWAY[1]);
  tagged(halo(SKY, 3.4, GATEWAY[0], 2.2, GATEWAY[1] + 0.1), "signal", true);

  // --- Anchors: where the page centres its spotlight and pins its labels ---------------------------------
  anchor("zone-energy", ox + 2.2, 1.2, oz + 1.6);
  anchor("zone-break", 11.6, 1.0, 5.0);
  anchor("zone-cold", 2.0, 1.4, 2.4);
  anchor("zone-defect", 8.6, 1.0, 2.2);
  anchor("zone-audit", 7.0, 1.2, 3.4);
  anchor("pin-energy", ox + 2.2, top + 1.1, oz + 1.6);
  anchor("pin-break", 11.4, 2.3, 4.9);
  anchor("pin-cold", 1.6, 4.0, 3.2);
  anchor("pin-defect", 8.5, 2.2, 1.9);
  anchor("audit-ext", 13.55, 1.5, 0.0);
  anchor("audit-panel", 11.8, 2.7, 0.35);
  anchor("audit-cold", 2.6, 4.1, 3.36); // above the cold room roof
  anchor("audit-aid", -0.1, 1.45, 4.6); // on the first-aid box itself, clear of the cold room label

  return root;
}
