// The night shift: one bay of a plant after hours. Two machine lines stand idle, a lone operator
// works at the far end, and a compressor near the front starts to fail. The AOne sensor on it
// catches the fault as it starts and sends it, through the gateway, to the dashboard.
//
// Drawn in daylight tones like the other scenes; the build script shades it for night (every
// colour darkened and cooled, light sources left bright). The plan is 12 × 9 m.

import { THREE, M, SKY, box, rbox, plane, pipe, halo, unit, label } from "./kit";
import * as P from "./props";

export const NIGHT = { x: 12, z: 9 };
const GATEWAY: [number, number] = [5.3, 6.55];
export const NIGHT_LIGHTS = ["#cfe4ff", "#ffb020", "#ff4a3d", "#3df08a", "#1f77bd"]; // glow colours kept bright at night

export function buildNight(): THREE.Group {
  const root = new THREE.Group();
  const place = <T extends THREE.Object3D>(object: T, x: number, z: number, rotation = 0, y = 0): T => {
    object.position.set(x, y, z);
    object.rotation.y = rotation;
    root.add(object);
    return object;
  };

  // --- Floor ---------------------------------------------------------------------------------
  const glow = halo("#1f77bd", 22, NIGHT.x / 2, -0.6, NIGHT.z / 2);
  glow.userData.backdrop = true;
  root.add(glow);
  root.add(box(13.4, 0.3, 10.4, M.plinth, -0.7, -0.8, -0.7));
  root.add(rbox(12.8, 0.5, 9.8, 0.14, M.ground, -0.4, -0.5, -0.4));
  root.add(box(12.8, 0.05, 0.02, M.ledSky, -0.4, -0.44, 9.4), box(0.02, 0.05, 9.8, M.ledSky, 12.4, -0.44, -0.4));
  for (let x = 2.4; x < 12; x += 2.4) root.add(box(0.035, 0.004, 9.4, M.joint, x, 0, -0.15));
  for (let z = 2.4; z < 9; z += 2.4) root.add(box(12.55, 0.004, 0.035, M.joint, -0.15, 0, z));

  // Walkway along the front, and the hatched zone round the compressor
  for (const z of [7.35, 8.65]) root.add(box(12.2, 0.012, 0.07, M.marking, -0.1, 0, z));
  root.add(box(3.3, 0.014, 0.06, M.marking, 6.9, 0, 3.0), box(3.3, 0.014, 0.06, M.marking, 6.9, 0, 5.3));
  root.add(box(0.06, 0.014, 2.36, M.marking, 6.9, 0, 3.0), box(0.06, 0.014, 2.36, M.marking, 10.14, 0, 3.0));

  // --- Walls: the back of the bay, with high windows, wall lights and a clock -----------------
  const H = 3.4;
  root.add(box(12.8, H, 0.25, M.wall, -0.4, 0, -0.4)); // back wall (faces +z)
  root.add(box(0.25, H, 9.55, M.wall, -0.4, 0, -0.15)); // side wall (faces +x)
  root.add(box(12.8, 0.6, 0.012, M.seam, -0.4, 0, -0.15), box(0.012, 0.6, 9.55, M.seam, -0.15, 0, -0.15)); // dado
  for (let x = 0.4; x < 12; x += 2.4) root.add(box(1.9, 0.7, 0.012, M.glassDark, x, 2.5, -0.14)); // windows: the night outside
  for (let z = 0.6; z < 7.5; z += 2.4) root.add(box(0.012, 0.7, 1.9, M.glassDark, -0.14, 2.5, z));
  const lamp = (x: number, y: number, z: number, along: "x" | "z") => {
    if (along === "x") root.add(rbox(0.5, 0.12, 0.16, 0.03, M.graphite, x - 0.25, y, z), box(0.44, 0.02, 0.12, M.ledWhite, x - 0.22, y - 0.02, z + 0.02));
    else root.add(rbox(0.16, 0.12, 0.5, 0.03, M.graphite, x, y, z - 0.25), box(0.12, 0.02, 0.44, M.ledWhite, x + 0.02, y - 0.02, z - 0.22));
    root.add(halo("#cfe4ff", 3.4, along === "x" ? x : x + 0.5, y - 0.4, along === "x" ? z + 0.5 : z));
  };
  lamp(2.6, 3.24, -0.15, "x"); // above the windows
  lamp(9.6, 3.24, -0.15, "x");
  lamp(-0.15, 3.24, 5.0, "z");
  root.add(rbox(1.2, 0.5, 0.08, 0.04, M.graphite, 6.2, 1.65, -0.15), plane(1.04, 0.36, label("02:51", { fg: SKY, bg: "#06101d" }), 6.8, 1.9, -0.06)); // the clock

  // --- Equipment ----------------------------------------------------------------------------------
  place(P.cncMachine(2.2, 1.8, 2.0, "LINE 1"), 0.5, 0.35);
  place(P.cncMachine(2.2, 1.8, 2.0, "LINE 2"), 3.3, 0.35);
  place(P.conveyor(5.4).group, 0.5, 2.9);
  place(P.switchboard(3), 9.3, 0.1);
  place(P.compressor(), 7.4, 3.4);
  place(P.airReceiver(), 11.0, 4.1);
  root.add(pipe([[9.3, 1.15, 4.1], [10.45, 1.15, 4.1]], 0.06, M.paintBlue));
  root.add(pipe([[11.0, 2.56, 4.1], [11.0, 3.0, 4.1], [11.0, 3.0, 0.75], [5.0, 3.0, 0.75], [5.0, 3.0, 1.2], [5.0, 2.0, 1.2]], 0.06, M.paintBlue)); // air main, into line 2
  place(P.drum(), 11.3, 6.0);
  place(P.drum(M.yellow), 11.75, 6.5);
  place(P.pallet(3, 2, 2), 0.2, 4.6).scale.setScalar(0.9);
  place(P.forklift(), 2.4, 5.4, 0.35);

  // The one person on the floor tonight, at the far end, facing away from the compressor
  place(P.worker(M.hivis, M.white, true), 1.3, 8.0, -2.4);

  // --- The AOne layer -----------------------------------------------------------------------------
  // The sensor on the compressor's service door. `hot` gives it the three light states the page
  // animates (normal, warning, alert).
  const sensor = place(P.sensor("z"), 7.95, 4.575, 0, 0.8);
  unit(sensor, { cls: "sensor", shadow: false, hot: true });

  // Data line: down the door and along the floor to the gateway, which sends the alert on (the
  // page pulses its signal and lights the dashboard card).
  const feed = pipe([[7.95, 0.8, 4.61], [7.95, 0.05, 4.61], [7.95, 0.05, 6.9], [GATEWAY[0], 0.05, 6.9], [GATEWAY[0], 0.05, GATEWAY[1] + 0.16]], 0.04, M.feed);
  feed.userData.index = 0;
  root.add(feed);
  place(P.gateway(), GATEWAY[0], GATEWAY[1]);
  const signal = halo(SKY, 3.4, GATEWAY[0], 2.2, GATEWAY[1] + 0.1);
  Object.assign(signal.userData, { cls: "signal", overlay: true });
  root.add(signal);

  // The fault: a warm glow as the bearing heats, then the alarm
  const warn = halo("#ffb020", 4.2, 8.35, 1.0, 4.7);
  Object.assign(warn.userData, { cls: "warn", overlay: true });
  root.add(warn);
  const alarm = halo("#ff4a3d", 4.4, 8.35, 1.0, 4.7);
  Object.assign(alarm.userData, { cls: "alarm", overlay: true });
  root.add(alarm);

  return root;
}
