// The homepage site: one generic plant, modelled in full. A cold room, a machining line, the
// utilities, a dispatch dock, a kitchen block and a power yard, with the AOne layer on top:
// sensors, cameras, a gateway and the data lines between them.
//
// The plan is 22 × 15 m. Row one sits behind the road (z < 6.2), row two in front of it.

import { THREE, M, box, rbox, cyl, pipe, halo, unit } from "./kit";
import * as P from "./props";

type Point = [number, number, number];

export const SITE = { x: 22, z: 15 };
const GATEWAY: [number, number] = [0.75, 5.75];
const TRUNK_BACK = 6.05; // data lines from row one gather here
const TRUNK_FRONT = 8.38; // and from row two here

export function buildSite(): THREE.Group {
  const root = new THREE.Group();
  const place = <T extends THREE.Object3D>(object: T, x: number, z: number, rotation = 0, y = 0): T => {
    object.position.set(x, y, z);
    object.rotation.y = rotation;
    root.add(object);
    return object;
  };

  // --- Ground ------------------------------------------------------------------------------------
  const glow = halo("#1f77bd", 36, SITE.x / 2, -0.6, SITE.z / 2);
  glow.userData.backdrop = true;
  root.add(glow);
  root.add(box(24.4, 0.3, 17.4, M.plinth, -1.2, -0.8, -1.2));
  root.add(rbox(23.2, 0.5, 16.2, 0.14, M.ground, -0.6, -0.5, -0.6));
  root.add(box(23.2, 0.05, 0.02, M.ledSky, -0.6, -0.44, 15.6), box(0.02, 0.05, 16.2, M.ledSky, 22.6, -0.44, -0.6));
  for (let x = 2.75; x < 22; x += 2.75) root.add(box(0.035, 0.004, 15.8, M.joint, x, 0, -0.4));
  for (let z = 2.5; z < 15; z += 2.5) root.add(box(22.8, 0.004, 0.035, M.joint, -0.4, 0, z));

  // The road between the two rows
  root.add(box(23.2, 0.01, 2.0, M.asphalt, -0.6, 0, 6.2));
  root.add(box(23.2, 0.012, 0.07, M.marking, -0.6, 0, 6.2), box(23.2, 0.012, 0.07, M.marking, -0.6, 0, 8.13));
  for (let x = -0.2; x < 22.2; x += 1.4) if (x < 6.3 || x > 7.9) root.add(box(0.7, 0.012, 0.06, M.markingWhite, x, 0, 7.17));
  for (let i = 0; i < 5; i++) root.add(box(1.1, 0.012, 0.2, M.markingWhite, 6.75, 0, 6.42 + i * 0.37));

  // Bays
  root.add(box(7.4, 0.02, 5.0, M.pad, 7.0, 0, 0.6)); // production
  root.add(box(6.8, 0.02, 5.0, M.pad, 15.1, 0, 0.6)); // utilities
  root.add(box(7.0, 0.02, 5.6, M.pad, 0.7, 0, 8.5)); // dispatch
  root.add(box(6.9, 0.02, 5.3, M.pad, 14.95, 0, 8.55)); // power yard
  for (const z of [8.55, 13.73]) root.add(box(6.9, 0.024, 0.12, M.marking, 14.95, 0, z));
  for (const x of [14.95, 21.73]) root.add(box(0.12, 0.024, 5.3, M.marking, x, 0, 8.55));
  // Loading-bay lines
  for (const z of [11.35, 13.85]) root.add(box(6.4, 0.024, 0.06, M.markingWhite, 0.9, 0, z));

  // --- Row one: cold room, machining line, utilities ----------------------------------------------
  place(P.coldRoom(), 1.0, 1.2);
  place(P.pallet(3, 2, 2), 4.3, 5.15).scale.setScalar(0.9);
  place(P.worker(), 1.75, 5.6, 0.5);

  place(P.cncMachine(2.3, 1.9, 2.1, "LINE 1"), 7.6, 1.0);
  place(P.cncMachine(2.4, 1.9, 2.35, "LINE 2"), 10.6, 1.0);
  place(P.conveyor(6.4).group, 7.4, 4.0);
  place(P.gantry(1.2, 1.75), 9.6, 3.87);
  place(P.robotArm(2.75), 14.4, 4.9);
  place(P.worker(M.hivis, M.white), 8.75, 3.4, Math.PI);

  place(P.chiller(), 15.6, 0.9);
  place(P.switchboard(3), 19.5, 0.75);
  place(P.compressor(), 15.7, 3.6);
  place(P.airReceiver(), 18.75, 4.2);
  root.add(pipe([[17.6, 1.15, 4.2], [18.2, 1.15, 4.2]], 0.06, M.paintBlue));

  // Compressed air main and a cable tray, on a rack along the back
  root.add(pipe([[18.75, 2.56, 4.2], [18.75, 3.0, 4.2], [18.75, 3.0, 0.58], [8.6, 3.0, 0.58], [8.6, 3.0, 1.4], [8.6, 2.32, 1.4]], 0.06, M.paintBlue));
  root.add(pipe([[11.8, 3.0, 0.58], [11.8, 3.0, 1.4], [11.8, 2.57, 1.4]], 0.06, M.paintBlue));
  root.add(box(11.9, 0.04, 0.24, M.steelDark, 7.2, 2.94, 0.2), box(11.9, 0.07, 0.02, M.steel, 7.2, 2.98, 0.44));
  for (const x of [7.4, 10.3, 13.9, 17.2, 18.95]) root.add(box(0.1, 2.86, 0.1, M.steelDark, x, 0, 0.1), box(0.1, 0.08, 0.62, M.steelDark, x, 2.86, 0.1), box(0.22, 0.02, 0.22, M.graphite, x - 0.06, 0, 0.04));

  place(P.tree(2.3), 21.9, 4.1);
  place(P.tree(1.9), 21.85, 5.55);

  // --- Row two: dispatch, kitchen, power yard -----------------------------------------------------
  place(P.rack(2, 2), 1.0, 8.6);
  place(P.pallet(3, 2, 3), 1.4, 10.0);
  place(P.pallet(3, 2, 2), 2.9, 10.05);
  place(P.truck(), 0.9, 11.6);
  place(P.forklift(), 4.6, 9.9, 0.2);
  place(P.worker(), 5.7, 11.15, 1.0);
  place(P.trafficCone(), 7.0, 11.9);
  place(P.trafficCone(), 7.0, 12.9);
  for (const z of [9.3, 11.3, 13.3]) place(P.bollard(), 8.35, z);
  root.add(cyl(0.05, 3.1, M.steelDark, 7.45, 0, 14.0), cyl(0.11, 0.05, M.graphite, 7.45, 0, 14.0)); // camera pole

  place(P.building(), 9.2, 8.8);
  place(P.lpgStore(), 9.35, 12.55);
  place(P.planter(2.4), 11.2, 12.75);
  place(P.worker(M.white, M.white), 14.3, 10.5, 0.9);

  place(P.dgSet(), 15.4, 8.9);
  place(P.fuelTank(), 19.0, 8.9);
  place(P.transformer(), 15.5, 11.3);
  place(P.drum(), 19.4, 11.7);
  place(P.drum(M.yellow), 20.05, 11.8);
  place(P.drum(), 19.7, 12.4);
  place(P.trafficCone(), 20.8, 12.7);
  for (const x of [15.3, 16.9, 18.5, 20.1, 21.5]) place(P.bollard(), x, 14.05);

  place(P.lampPost(), 14.45, 8.5);
  place(P.lampPost(), 0.15, 14.6);
  place(P.planter(2.4), 8.9, 14.5);
  place(P.planter(2.4), 11.7, 14.5);
  place(P.tree(2.2), 14.75, 14.75);
  place(P.tree(2.4), 21.75, 14.85);
  place(P.worker(), 5.75, 7.3, -1.1);

  // --- The AOne layer -----------------------------------------------------------------------------
  let index = 0;
  const device = <T extends THREE.Object3D>(object: T, x: number, y: number, z: number, hot = false): T => {
    object.position.set(x, y, z);
    unit(object, { cls: "drop", index: index++, shadow: false, hot });
    root.add(object);
    return object;
  };
  // A data line: from the device down to the floor (the given points), to its row's trunk, and
  // along it to the gateway. Lines stand a little off the walls they run down.
  const feed = (trunk: number, ...path: Point[]) => {
    const last = path[path.length - 1];
    const line = pipe([...path, [last[0], 0.05, last[2]], [last[0], 0.05, trunk], [GATEWAY[0], 0.05, trunk], [GATEWAY[0], 0.05, GATEWAY[1] + 0.16]], 0.04, M.feed);
    line.userData.index = index;
    root.add(line);
  };

  device(P.gateway(), GATEWAY[0], 0, GATEWAY[1]);

  // Row one
  feed(TRUNK_BACK, [3.5, 1.5, 5.04]);
  device(P.sensor("z"), 3.5, 1.5, 5.005); // cold room

  feed(TRUNK_BACK, [5.4, 2.3, 5.04]);
  device(P.camera([-2.7, -2.45, 1.1], 3.75, 0.8), 5.4, 2.45, 5.22); // cold-room door

  feed(TRUNK_BACK, [9.94, 1.3, 2.7]);
  device(P.sensor("x"), 9.905, 1.3, 2.7); // machine 1

  feed(TRUNK_BACK, [9.64, 1.6, 5.15]);
  device(P.camera([0.1, -1, 0], 0.62, 1.2), 9.8, 1.45, 4.45); // over the line

  feed(TRUNK_BACK, [13.04, 1.45, 2.7]);
  device(P.sensor("x"), 13.005, 1.45, 2.7); // machine 2

  feed(TRUNK_BACK, [16.25, 0.8, 4.81]);
  device(P.sensor("z"), 16.25, 0.8, 4.775, true); // the compressor: the one that alerts

  feed(TRUNK_BACK, [18.95, 0.75, 2.05], [18.95, 0.05, 2.05], [18.95, 0.05, 2.9], [19.8, 0.05, 2.9]);
  device(P.sensor("x"), 18.915, 0.75, 2.05); // chiller

  feed(TRUNK_BACK, [20.4, 1.92, 1.29]);
  device(P.sensor("z"), 20.4, 1.92, 1.255); // switchboard

  // Row two
  feed(TRUNK_FRONT, [2.4, 2.3, 13.655]);
  device(P.sensor("z"), 2.4, 2.3, 13.62); // truck

  feed(TRUNK_FRONT, [7.45, 0.4, 14.09]);
  device(P.camera([-2.9, -2.85, -3.2], 5.1, 0.8), 7.45, 3.14, 14.0); // dock

  feed(TRUNK_FRONT, [13.62, 2.25, 12.24]);
  device(P.sensor("z"), 13.62, 2.25, 12.205); // kitchen block

  feed(TRUNK_FRONT, [16.9, 0.5, 10.25]);
  device(P.sensor("z"), 16.9, 0.5, 10.215); // generator

  // The gateway's uplink, toward the dashboard
  // (it rises, then runs level toward the top-left corner, where the page lays the dashboard card)
  const uplink = pipe([[GATEWAY[0], 2.4, GATEWAY[1]], [GATEWAY[0], 4.4, GATEWAY[1]], [GATEWAY[0] - 2.2, 4.4, GATEWAY[1] + 2.2]], 0.04, M.feed);
  uplink.userData.index = index;
  root.add(uplink);

  // The alert on the compressor, and the BluSquad engineer who clears it
  const alarm = halo("#ff4a3d", 4.6, 16.25, 0.9, 4.95);
  Object.assign(alarm.userData, { cls: "alarm", overlay: true });
  root.add(alarm);
  const engineer = P.worker(M.aone, M.white, true);
  engineer.position.set(17.65, 0, 5.4);
  engineer.rotation.y = 0.55;
  unit(engineer, { cls: "engineer", shadow: false });
  root.add(engineer);

  return root;
}
