// Placeholder 2.5D scenes, one per industry, built from simple blocks on the shared grid.
// Zone ids match `zones[].id` in content/industries.ts; each zone becomes <g id="zone-{id}">.
// Coordinates are local to a 6×6 pad: (0,0) is the far corner, x runs down-right, y down-left.
// Final art will come from an illustrator: replace the items, keep the ids.

import { box, cyl, sen, cam, feed, line, person, zone, zoneTall, type Item, type SceneArt, type ZoneArt } from "./kit";

type Parts = (Item | Item[])[];
const flat = (parts: Parts): Item[] => parts.flat();
const z = (id: string, c: number, r: number, parts: Parts): ZoneArt => zone(id, c, r, flat(parts));
const zt = (id: string, c: number, parts: Parts): ZoneArt => zoneTall(id, c, flat(parts));

// --- Reusable props --------------------------------------------------------------------------
const pallet = (x: number, y: number, h: number): Item[] => [box(x, y, 1.4, 1.4, 0.15, "mid"), box(x + 0.1, y + 0.1, 1.2, 1.2, h, "light", 0.15)];
const camPost = (x: number, y: number, h: number, tx: number, ty: number, tz = 0): Item[] => [box(x - 0.07, y - 0.07, 0.14, 0.14, h, "mid"), cam(x, y, h + 0.12, tx, ty, tz)];
// An inspection gantry over a conveyor running along x: two posts, a beam and a camera.
const gantry = (x: number, y: number, span: number, h: number, tz: number): Item[] => [
  box(x, y, 0.18, 0.18, h, "mid"),
  box(x, y + span - 0.18, 0.18, 0.18, h, "mid"),
  box(x, y, 0.18, span, 0.18, "mid", h),
  cam(x + 0.18, y + span / 2, h, x + 0.3, y + span / 2, tz),
];
const coldRoom = (x: number, y: number, w: number, d: number, h: number): Item[] => [box(x, y, w, d, h), box(x + w / 2 - 0.55, y + d, 1.1, 0.12, h * 0.74, "mid")];
const chiller = (x: number, y: number): Item[] => [box(x, y, 2.6, 1.3, 1.4), cyl(x + 0.7, y + 0.65, 0.4, 0.15, "mid", 1.4), cyl(x + 1.9, y + 0.65, 0.4, 0.15, "mid", 1.4)];
const tower = (x: number, y: number, w: number, d: number, floors: number, bandTone: "light" | "mid", slabTone: "light" | "mid"): Item[] =>
  Array.from({ length: floors }, (_, i) => [box(x, y, w, d, 0.72, bandTone, i * 0.92), box(x - 0.1, y - 0.1, w + 0.2, d + 0.2, 0.2, slabTone, i * 0.92 + 0.72)]).flat();
const doorway = (x: number, y: number, w: number): Item[] => [box(x, y, 1.5, 0.3, 2.4), box(x + w - 1.5, y, 1.5, 0.3, 2.4), box(x, y, w, 0.3, 0.3, "mid", 2.4)];

// --- Manufacturing: factory ------------------------------------------------------------------
const manufacturing: ZoneArt[] = [
  z("raw-material", 0, 0, [
    cyl(1.5, 1.6, 1.0, 4.0),
    cyl(3.9, 1.6, 1.0, 3.1),
    box(0.7, 3.8, 4.6, 1.5, 0.2, "mid"), // weighbridge
    box(1.2, 4.05, 2.3, 1.0, 1.1, "light", 0.2),
    box(3.6, 4.05, 0.9, 1.0, 0.8, "mid", 0.2),
    sen(2.2, 2.3, 2.4),
    sen(4.6, 2.3, 1.8),
    sen(5.3, 5.3, 0.2),
    feed(2.2, 2.7),
  ]),
  z("processing", 1, 0, [
    box(0.8, 0.9, 1.8, 1.6, 1.5, "mid"),
    box(1.2, 1.2, 1.0, 1.0, 0.6, "light", 1.5),
    box(3.4, 0.9, 1.8, 1.6, 1.9, "mid"),
    cyl(4.3, 1.7, 0.3, 0.8, "light", 1.9),
    box(0.8, 3.6, 4.6, 1.0, 0.5), // conveyor
    box(1.3, 3.85, 0.5, 0.5, 0.3, "mid", 0.5),
    box(2.7, 3.85, 0.5, 0.5, 0.3, "mid", 0.5),
    box(4.1, 3.85, 0.5, 0.5, 0.3, "mid", 0.5),
    sen(2.6, 2.5, 1.0),
    sen(5.2, 2.5, 1.3),
    feed(2.6, 2.9),
  ]),
  z("quality", 2, 0, [
    box(0.8, 0.8, 1.5, 0.9, 1.0), // control desk
    box(0.6, 2.6, 4.8, 1.0, 0.5), // conveyor
    box(1.2, 2.85, 0.5, 0.5, 0.3, "mid", 0.5),
    box(3.5, 2.85, 0.5, 0.5, 0.3, "mid", 0.5),
    box(4.5, 2.85, 0.5, 0.5, 0.3, "mid", 0.5),
    gantry(2.5, 2.3, 1.6, 2.0, 0.5),
    box(4.3, 4.3, 1.0, 1.0, 0.7, "mid"), // reject bin
    line([2.9, 3.6], [2.9, 5.55], [5.55, 5.55]),
  ]),
  z("packaging", 0, 1, [
    box(0.6, 0.9, 3.4, 0.9, 0.5), // conveyor
    box(1.0, 1.1, 0.6, 0.5, 0.45, "mid", 0.5),
    box(2.4, 1.1, 0.6, 0.5, 0.45, "mid", 0.5),
    pallet(0.8, 2.9, 1.0),
    pallet(2.6, 2.9, 1.5),
    box(4.6, 2.0, 1.0, 2.4, 1.5), // truck
    box(4.6, 1.2, 1.0, 0.8, 1.1, "mid"),
    camPost(4.3, 0.75, 1.7, 3.2, 1.35, 0.5),
    sen(4.0, 4.3, 1.0),
    feed(4.0, 4.7),
  ]),
  z("utilities", 1, 1, [
    box(0.8, 0.9, 1.8, 1.2, 1.2, "mid"), // compressor
    cyl(3.5, 1.5, 0.6, 2.2), // air receiver
    chiller(0.8, 3.2),
    box(4.2, 3.3, 1.2, 1.2, 1.3, "mid"), // transformer
    sen(2.6, 2.1, 0.8),
    sen(3.92, 1.92, 1.3),
    sen(3.4, 4.5, 0.9),
    sen(5.4, 4.5, 0.9),
    feed(2.6, 2.5),
  ]),
  z("esg", 2, 1, [
    box(0.8, 0.9, 0.35, 2.4, 2.0, "mid"), // meter board
    cyl(4.3, 1.6, 0.9, 1.6), // water tank
    box(1.7, 3.3, 3.6, 0.8, 0.2, "dark"), // solar
    box(1.7, 4.5, 3.6, 0.8, 0.2, "dark"),
    sen(1.15, 2.2, 1.4),
    sen(4.94, 2.24, 1.0),
    feed(1.15, 2.8),
  ]),
];

// --- Quick commerce: dark store --------------------------------------------------------------
const quickCommerce: ZoneArt[] = [
  z("cold-room", 0, 0, [coldRoom(0.8, 0.8, 3.8, 3.2, 2.6), box(4.9, 1.0, 0.7, 1.2, 1.0, "mid"), sen(4.6, 4.0, 2.0), sen(5.6, 2.2, 0.6), feed(4.6, 4.4)]),
  z("freezers", 1, 0, [
    box(0.8, 0.9, 1.3, 1.1, 2.1),
    box(2.3, 0.9, 1.3, 1.1, 2.1),
    box(3.8, 0.9, 1.3, 1.1, 2.1),
    box(0.8, 3.4, 2.6, 1.1, 0.9), // chest freezer
    box(0.95, 3.55, 2.3, 0.8, 0.08, "mid", 0.9),
    box(4.0, 3.4, 1.1, 1.1, 0.8, "mid"), // compressor
    sen(2.1, 2.0, 1.5),
    sen(3.6, 2.0, 1.5),
    sen(5.1, 2.0, 1.5),
    sen(5.1, 4.5, 0.5),
    feed(5.1, 4.9),
  ]),
  z("picking-aisles", 2, 0, [
    box(0.7, 0.7, 4.4, 0.7, 2.2),
    box(0.7, 2.5, 4.4, 0.7, 2.2),
    box(0.7, 4.3, 4.4, 0.7, 2.2),
    person(2.4, 3.75),
    box(3.2, 3.5, 0.6, 0.5, 0.4, "mid"),
    camPost(5.5, 3.75, 2.3, 3.4, 3.75),
    line([5.5, 4.1], [5.5, 5.55], [5.55, 5.55]),
  ]),
  z("entry", 0, 1, [
    doorway(0.6, 2.4, 4.8),
    box(1.0, 4.0, 1.0, 0.8, 0.6, "mid"),
    box(1.1, 4.1, 0.8, 0.6, 0.45, "light", 0.6),
    person(3.0, 3.9),
    cam(3.0, 2.7, 2.4, 3.0, 4.1),
    feed(3.0, 4.6),
  ]),
  z("store-floor", 1, 1, [
    box(1.0, 1.2, 3.2, 1.3, 0.9), // packing table
    box(1.3, 1.5, 0.7, 0.6, 0.4, "mid", 0.9),
    box(2.7, 1.5, 0.7, 0.6, 0.4, "mid", 0.9),
    box(4.7, 1.0, 0.8, 0.8, 1.0, "mid"), // handwash
    person(2.0, 3.3),
    person(3.6, 3.5),
    camPost(0.8, 4.9, 2.3, 2.7, 3.4),
    line([0.8, 5.2], [0.8, 5.55], [5.55, 5.55]),
  ]),
  z("electrical-panel", 2, 1, [
    box(0.9, 0.9, 0.5, 2.6, 2.3, "mid"), // panel board
    box(2.6, 1.0, 1.6, 1.2, 1.2),
    box(2.6, 3.2, 2.0, 1.2, 1.0, "mid"),
    sen(1.4, 2.2, 1.5),
    sen(4.2, 2.2, 0.8),
    sen(4.6, 4.4, 0.7),
    feed(1.4, 3.8),
  ]),
];

// --- QSR: outlet -----------------------------------------------------------------------------
const qsr: ZoneArt[] = [
  z("cold-storage", 0, 0, [coldRoom(0.8, 0.8, 3.0, 2.8, 2.5), box(4.3, 0.9, 1.0, 1.0, 2.0), sen(3.8, 3.6, 1.9), sen(5.3, 1.9, 1.4), feed(3.8, 4.0)]),
  z("makeline", 1, 0, [
    box(0.8, 1.6, 4.4, 1.2, 0.9),
    box(1.0, 1.8, 0.8, 0.8, 0.1, "mid", 0.9),
    box(2.0, 1.8, 0.8, 0.8, 0.1, "mid", 0.9),
    box(3.0, 1.8, 0.8, 0.8, 0.1, "mid", 0.9),
    box(4.0, 1.8, 0.8, 0.8, 0.1, "mid", 0.9),
    box(0.8, 3.9, 1.4, 1.2, 1.6, "mid"), // hot holding
    person(3.6, 3.7),
    sen(5.2, 2.8, 0.6),
    sen(2.2, 5.1, 1.1),
    line([2.2, 5.3], [2.2, 5.55], [5.55, 5.55]),
  ]),
  z("fryers-ovens", 2, 0, [
    box(0.8, 1.0, 1.1, 1.2, 1.0, "mid"),
    box(0.95, 1.15, 0.8, 0.9, 0.08, "dark", 1.0),
    box(2.1, 1.0, 1.1, 1.2, 1.0, "mid"),
    box(2.25, 1.15, 0.8, 0.9, 0.08, "dark", 1.0),
    box(3.8, 1.0, 1.5, 1.3, 1.0),
    box(3.8, 1.0, 1.5, 1.3, 0.9, "mid", 1.0),
    sen(1.9, 2.2, 0.6),
    sen(3.2, 2.2, 0.6),
    sen(5.3, 2.3, 1.4),
    feed(1.9, 2.6),
  ]),
  z("handwash-prep", 0, 1, [
    box(0.8, 1.0, 1.2, 1.0, 0.9, "mid"), // sink
    box(0.95, 1.15, 0.9, 0.7, 0.08, "dark", 0.9),
    box(2.6, 1.0, 2.8, 1.1, 0.9), // prep table
    box(3.0, 1.2, 0.7, 0.6, 0.25, "mid", 0.9),
    person(1.4, 2.8),
    person(4.0, 2.9),
    camPost(5.3, 4.9, 2.3, 2.8, 3.0),
    line([5.3, 5.2], [5.3, 5.55], [5.55, 5.55]),
  ]),
  z("dining-hvac", 1, 1, [
    box(4.7, 0.7, 0.7, 0.7, 1.9, "mid"), // tower AC
    cyl(1.5, 1.6, 0.55, 0.75),
    cyl(3.3, 1.6, 0.55, 0.75),
    cyl(1.5, 3.8, 0.55, 0.75),
    cyl(3.3, 3.8, 0.55, 0.75),
    person(2.4, 2.7),
    person(4.4, 3.6),
    sen(5.4, 1.4, 1.4),
    feed(5.4, 1.9),
  ]),
  z("exhaust-dg", 2, 1, [
    box(0.85, 0.9, 2.5, 1.25, 0.9, "mid"), // cook line
    box(0.6, 0.6, 0.12, 0.12, 2.0, "mid"), // hood posts
    box(3.48, 0.6, 0.12, 0.12, 2.0, "mid"),
    box(0.6, 2.28, 0.12, 0.12, 2.0, "mid"),
    box(3.48, 2.28, 0.12, 0.12, 2.0, "mid"),
    box(0.6, 0.6, 3.0, 1.8, 0.45, "light", 2.0), // hood
    box(1.7, 1.1, 0.8, 0.8, 0.7, "light", 2.45), // duct
    box(3.9, 3.4, 1.6, 1.1, 1.1, "mid"), // DG set
    cyl(4.3, 3.95, 0.18, 0.7, "mid", 1.1),
    sen(3.6, 2.4, 2.2),
    sen(5.5, 4.5, 0.7),
    feed(5.5, 4.9),
  ]),
];

// --- Smart buildings: building ---------------------------------------------------------------
const smartBuildings: ZoneArt[] = [
  z("chiller-plant", 0, 0, [
    chiller(0.8, 0.9),
    cyl(4.6, 1.6, 0.9, 2.0), // cooling tower
    cyl(4.6, 1.6, 0.55, 0.2, "mid", 2.0),
    box(0.8, 3.5, 1.8, 1.4, 1.5, "mid"), // AHU
    box(2.6, 3.9, 2.6, 0.5, 0.5), // duct
    sen(3.4, 2.2, 0.9),
    sen(2.6, 4.9, 1.0),
    feed(3.4, 2.6),
  ]),
  z("office-floors", 1, 0, [tower(1.0, 1.0, 4.0, 4.0, 4, "mid", "light"), sen(5.0, 5.0, 0.4), sen(5.0, 5.0, 1.32), sen(5.0, 5.0, 2.24), sen(5.0, 5.0, 3.16), feed(5.3, 5.2)]),
  z("lifts-pumps", 2, 0, [
    box(0.9, 0.9, 1.6, 1.6, 4.0), // lift shaft
    box(1.2, 2.5, 1.0, 0.1, 1.6, "mid"),
    cyl(3.6, 1.6, 0.5, 0.9, "mid"),
    cyl(4.9, 1.6, 0.5, 0.9, "mid"),
    box(3.2, 2.5, 2.2, 0.35, 0.35),
    sen(2.5, 2.5, 2.6),
    sen(3.95, 1.95, 0.6),
    sen(5.25, 1.95, 0.6),
    feed(2.5, 3.0),
  ]),
  z("dg-set", 0, 1, [
    box(0.9, 1.2, 3.0, 1.5, 1.4, "mid"),
    cyl(1.6, 1.95, 0.2, 0.9, "mid", 1.4),
    cyl(4.9, 1.9, 0.7, 1.5), // day tank
    sen(3.9, 2.7, 0.9),
    sen(5.4, 2.4, 0.9),
    feed(3.9, 3.1),
  ]),
  z("lobby-security", 1, 1, [
    box(0.9, 1.0, 2.6, 0.9, 1.0), // reception
    box(4.2, 1.2, 0.25, 0.9, 0.9, "mid"),
    box(4.9, 1.2, 0.25, 0.9, 0.9, "mid"),
    person(2.0, 2.8),
    person(3.4, 3.6),
    person(4.55, 2.9),
    camPost(0.8, 4.8, 2.3, 3.0, 3.3),
    line([0.8, 5.1], [0.8, 5.55], [5.55, 5.55]),
  ]),
  z("rooftop-meters", 2, 1, [
    box(0.8, 0.8, 4.4, 3.0, 0.5), // roof slab
    box(1.2, 1.1, 1.2, 1.0, 0.7, "mid", 0.5),
    box(2.9, 1.1, 1.2, 1.0, 0.7, "mid", 0.5),
    box(1.2, 2.6, 3.4, 0.9, 0.1, "dark", 0.5), // solar
    box(0.9, 4.4, 1.8, 0.35, 1.4, "mid"), // meter panel
    sen(4.1, 2.1, 1.0),
    sen(2.7, 4.75, 1.0),
    feed(2.7, 5.1),
  ]),
];

// --- Retail: store ---------------------------------------------------------------------------
const retail: ZoneArt[] = [
  z("cold-zone", 0, 0, [
    box(0.7, 0.7, 4.6, 0.9, 2.1), // wall chillers
    box(0.7, 1.6, 4.6, 0.3, 0.5, "mid"),
    box(0.9, 3.4, 3.0, 1.2, 0.9), // island freezer
    box(1.05, 3.55, 2.7, 0.9, 0.08, "mid", 0.9),
    sen(5.3, 1.6, 1.5),
    sen(3.9, 4.6, 0.6),
    feed(3.9, 5.0),
  ]),
  z("aisles-shelves", 1, 0, [
    box(0.7, 0.8, 4.4, 0.8, 1.8),
    box(0.7, 2.6, 4.4, 0.8, 1.8),
    box(0.7, 4.4, 4.4, 0.8, 1.8),
    camPost(5.5, 2.0, 2.3, 3.4, 2.0),
    line([5.5, 2.4], [5.5, 5.55], [5.55, 5.55]),
  ]),
  z("high-value", 2, 0, [
    box(0.9, 0.9, 1.6, 1.0, 1.0),
    box(1.0, 1.0, 1.4, 0.8, 0.45, "mid", 1.0),
    box(3.2, 0.9, 1.6, 1.0, 1.0),
    box(3.3, 1.0, 1.4, 0.8, 0.45, "mid", 1.0),
    box(0.9, 3.2, 1.0, 1.0, 1.7),
    person(3.4, 3.2),
    camPost(5.3, 4.8, 2.3, 3.2, 2.9),
    line([5.3, 5.1], [5.3, 5.55], [5.55, 5.55]),
  ]),
  z("entrance", 0, 1, [
    doorway(0.6, 1.0, 4.8),
    box(1.9, 2.6, 0.2, 0.2, 1.1, "mid"), // gate posts
    box(3.9, 2.6, 0.2, 0.2, 1.1, "mid"),
    person(2.9, 3.4),
    person(3.5, 4.6),
    person(1.6, 4.4),
    cam(3.0, 1.3, 2.4, 3.0, 3.4),
    feed(3.0, 5.0),
  ]),
  z("back-store", 1, 1, [
    pallet(0.8, 0.9, 1.4),
    pallet(2.5, 0.9, 0.9),
    pallet(0.8, 2.8, 0.6),
    box(4.4, 0.8, 1.0, 2.6, 2.0), // dock door
    box(2.9, 3.4, 1.2, 0.8, 0.5, "mid"),
    sen(2.2, 2.3, 0.9),
    sen(5.4, 3.4, 1.3),
    feed(5.4, 3.8),
  ]),
  z("electrical-panel", 2, 1, [
    box(0.9, 0.9, 2.6, 0.5, 2.2, "mid"), // panel board
    box(1.0, 2.6, 1.4, 1.2, 1.0),
    box(3.4, 2.8, 1.6, 1.2, 1.2, "mid"),
    sen(2.2, 1.4, 1.5),
    sen(2.4, 3.8, 0.7),
    sen(5.0, 4.0, 0.8),
    feed(2.4, 4.2),
  ]),
];

// --- Oil & gas: value chain (three zones, each spanning both rows) ----------------------------
const oilAndGas: ZoneArt[] = [
  zt("upstream", 0, [
    box(1.6, 1.6, 2.0, 2.0, 0.4, "mid"), // derrick
    box(2.0, 2.0, 1.2, 1.2, 1.6, "light", 0.4),
    box(2.25, 2.25, 0.7, 0.7, 1.6, "light", 2.0),
    box(2.45, 2.45, 0.3, 0.3, 1.2, "mid", 3.6),
    cyl(1.6, 6.2, 0.45, 0.9, "mid"), // wellhead
    box(2.6, 5.8, 2.2, 0.8, 0.5),
    cyl(1.7, 9.6, 0.9, 1.6), // separators
    cyl(4.0, 9.6, 0.9, 1.6),
    sen(3.2, 3.2, 1.2),
    sen(1.92, 6.52, 0.6),
    sen(2.34, 10.24, 1.0),
    sen(4.64, 10.24, 1.0),
    line([1.92, 6.9], [1.92, 12.55], [5.55, 12.55]),
  ]),
  zt("midstream", 1, [
    box(2.6, 0.6, 0.5, 11.8, 0.5), // pipeline
    box(0.7, 2.0, 1.5, 2.0, 1.4, "mid"), // compressor station
    box(3.6, 6.0, 1.8, 1.6, 1.3, "mid"),
    cyl(4.5, 6.8, 0.3, 1.0, "light", 1.3),
    cyl(2.85, 4.6, 0.38, 0.35, "mid", 0.5), // valves
    cyl(2.85, 9.4, 0.38, 0.35, "mid", 0.5),
    sen(3.1, 4.6, 0.75),
    sen(3.1, 9.4, 0.75),
    sen(5.4, 7.6, 0.8),
    sen(2.2, 4.0, 0.9),
    line([3.4, 9.8], [3.4, 12.55], [5.55, 12.55]),
  ]),
  zt("downstream", 2, [
    cyl(1.9, 2.0, 1.3, 2.2), // storage tanks
    cyl(4.5, 2.7, 0.9, 1.6),
    box(0.7, 7.2, 4.6, 0.9, 0.45), // bottling line
    cyl(1.3, 7.65, 0.28, 0.7, "mid", 0.45),
    cyl(2.2, 7.65, 0.28, 0.7, "mid", 0.45),
    cyl(3.6, 7.65, 0.28, 0.7, "mid", 0.45),
    cyl(4.5, 7.65, 0.28, 0.7, "mid", 0.45),
    gantry(2.7, 6.9, 1.5, 2.1, 0.45),
    box(1.0, 10.2, 2.6, 1.3, 1.2), // delivery truck
    box(3.7, 10.2, 0.9, 1.3, 0.9, "mid"),
    sen(2.82, 2.92, 1.4),
    sen(5.14, 3.34, 1.0),
    line([3.1, 8.3], [3.1, 12.55], [5.55, 12.55]),
  ]),
];

// --- Dairy: dairy chain ----------------------------------------------------------------------
const dairy: ZoneArt[] = [
  z("collection-centre", 0, 0, [
    box(0.8, 0.8, 2.4, 2.0, 1.8),
    box(0.7, 0.7, 2.6, 2.2, 0.15, "mid", 1.8),
    box(3.8, 1.2, 1.6, 1.0, 1.0, "mid"), // bulk milk chiller
    cyl(4.6, 1.7, 0.25, 0.12, "light", 1.0),
    cyl(1.3, 3.9, 0.3, 0.6, "mid"), // milk cans
    cyl(2.1, 3.9, 0.3, 0.6, "mid"),
    cyl(1.7, 4.7, 0.3, 0.6, "mid"),
    sen(5.4, 2.2, 0.7),
    feed(5.4, 2.6),
  ]),
  z("tanker", 1, 0, [
    box(0.8, 2.2, 3.4, 1.4, 0.35, "mid"),
    box(0.9, 2.3, 3.2, 1.2, 1.2, "light", 0.35),
    box(4.3, 2.2, 1.0, 1.4, 1.3, "mid"), // cab
    cyl(1.6, 2.9, 0.25, 0.12, "mid", 1.55),
    cyl(3.0, 2.9, 0.25, 0.12, "mid", 1.55),
    sen(4.1, 3.5, 1.1),
    sen(0.9, 3.5, 1.1),
    line([0.5, 4.6], [5.55, 4.6], [5.55, 5.55]),
  ]),
  z("processing", 2, 0, [
    box(0.8, 0.9, 1.4, 1.6, 1.6, "mid"), // pasteuriser
    box(2.6, 0.9, 1.2, 1.2, 1.1), // homogeniser
    box(2.8, 1.1, 0.8, 0.8, 0.5, "mid", 1.1),
    cyl(4.7, 1.6, 0.75, 2.4), // boiler
    cyl(4.7, 1.6, 0.25, 0.9, "mid", 2.4),
    box(0.8, 3.6, 3.6, 0.35, 0.35), // header
    sen(2.2, 2.5, 1.0),
    sen(3.8, 2.1, 0.7),
    sen(5.23, 2.13, 1.4),
    feed(2.2, 2.9),
  ]),
  z("cold-storage", 0, 1, [coldRoom(0.8, 0.8, 4.0, 3.2, 2.6), box(1.0, 4.6, 0.9, 0.7, 0.6, "mid"), sen(4.8, 4.0, 2.0), feed(4.8, 4.4)]),
  z("packaging", 1, 1, [
    box(0.6, 1.6, 4.8, 1.0, 0.5),
    box(1.0, 1.85, 0.5, 0.5, 0.6, "mid", 0.5),
    box(1.9, 1.85, 0.5, 0.5, 0.6, "mid", 0.5),
    box(4.2, 1.85, 0.5, 0.5, 0.6, "mid", 0.5),
    gantry(2.9, 1.3, 1.6, 2.0, 0.5),
    pallet(1.0, 3.6, 1.0),
    sen(5.4, 2.6, 0.3),
    line([3.3, 2.6], [3.3, 5.55], [5.55, 5.55]),
  ]),
  z("water-etp", 2, 1, [
    cyl(1.8, 1.8, 1.2, 0.6),
    cyl(1.8, 1.8, 0.95, 0.06, "mid", 0.6),
    cyl(4.4, 1.6, 0.8, 1.4),
    box(0.9, 3.8, 1.2, 1.0, 0.8, "mid"), // pump skid
    box(2.1, 4.1, 3.2, 0.3, 0.3),
    sen(2.65, 2.65, 0.35),
    sen(4.97, 2.17, 0.9),
    sen(2.1, 4.8, 0.5),
    feed(2.65, 3.1),
  ]),
];

// --- HoReCa: property ------------------------------------------------------------------------
const horeca: ZoneArt[] = [
  z("kitchen-cold-room", 0, 0, [
    coldRoom(0.8, 0.8, 2.4, 2.4, 2.4),
    box(3.6, 0.9, 1.9, 1.1, 0.9, "mid"), // range
    box(3.75, 1.05, 0.6, 0.8, 0.08, "dark", 0.9),
    box(4.65, 1.05, 0.6, 0.8, 0.08, "dark", 0.9),
    cyl(4.0, 3.2, 0.3, 0.9, "mid"), // LPG cylinders
    cyl(4.8, 3.2, 0.3, 0.9, "mid"),
    sen(3.2, 3.2, 1.8),
    sen(5.02, 3.42, 0.6),
    feed(3.2, 3.6),
  ]),
  z("guest-rooms", 1, 0, [tower(0.9, 1.2, 4.2, 2.6, 4, "light", "mid"), sen(5.1, 3.8, 0.4), sen(5.1, 3.8, 1.32), sen(5.1, 3.8, 2.24), sen(5.1, 3.8, 3.16), feed(5.3, 4.2)]),
  z("laundry", 2, 0, [
    box(0.8, 0.9, 1.2, 1.2, 1.3, "mid"),
    box(2.2, 0.9, 1.2, 1.2, 1.3, "mid"),
    box(3.6, 0.9, 1.2, 1.2, 1.3, "mid"),
    box(0.9, 3.4, 2.4, 1.2, 0.8),
    box(1.1, 3.6, 0.9, 0.8, 0.3, "mid", 0.8),
    cyl(4.6, 3.8, 0.6, 1.2),
    sen(2.0, 2.1, 0.8),
    sen(3.4, 2.1, 0.8),
    sen(4.8, 2.1, 0.8),
    sen(5.02, 4.22, 0.8),
    feed(2.0, 2.5),
  ]),
  z("lobby-entries", 0, 1, [
    doorway(0.6, 0.9, 4.8),
    box(1.0, 2.6, 2.2, 0.8, 1.0), // desk
    person(3.9, 2.9),
    person(3.0, 4.2),
    cam(3.0, 1.2, 2.4, 3.2, 3.4),
    feed(4.6, 3.4),
  ]),
  z("plant-room", 1, 1, [
    chiller(0.8, 0.9),
    cyl(4.6, 1.7, 0.8, 2.0), // boiler
    cyl(4.6, 1.7, 0.25, 0.8, "mid", 2.0),
    box(0.9, 3.5, 3.0, 0.35, 0.35),
    cyl(4.7, 4.0, 0.45, 0.8, "mid"),
    sen(3.4, 2.2, 0.9),
    sen(5.17, 2.27, 1.2),
    feed(3.4, 2.6),
  ]),
  z("restaurant", 2, 1, [
    cyl(1.5, 1.5, 0.55, 0.75),
    cyl(3.5, 1.5, 0.55, 0.75),
    cyl(1.5, 3.5, 0.55, 0.75),
    box(3.0, 3.2, 2.2, 0.9, 0.9, "mid"), // hot-holding counter
    box(3.15, 3.35, 0.8, 0.6, 0.15, "light", 0.9),
    box(4.2, 3.35, 0.8, 0.6, 0.15, "light", 0.9),
    person(2.5, 2.5),
    sen(5.2, 4.1, 0.6),
    feed(5.2, 4.5),
  ]),
];

const zoneOf = (zones: ZoneArt[], id: string) => zones.find((entry) => entry.id === id)!;

// A compact icon for oil & gas: its zones are too tall to stand in as a tile.
const oilAndGasIcon: ZoneArt = z("icon", 0, 0, [
  cyl(1.8, 1.8, 1.2, 2.4),
  cyl(4.3, 1.5, 0.7, 1.5),
  box(0.8, 3.9, 4.4, 0.9, 0.45),
  cyl(1.4, 4.35, 0.28, 0.7, "mid", 0.45),
  cyl(2.4, 4.35, 0.28, 0.7, "mid", 0.45),
  cyl(3.4, 4.35, 0.28, 0.7, "mid", 0.45),
  cyl(4.4, 4.35, 0.28, 0.7, "mid", 0.45),
  sen(2.65, 2.65, 1.5),
  feed(2.65, 3.2),
]);

export const scenes: Record<string, SceneArt> = {
  manufacturing: { zones: manufacturing, icon: zoneOf(manufacturing, "processing") },
  "quick-commerce": { zones: quickCommerce, icon: zoneOf(quickCommerce, "freezers") },
  qsr: { zones: qsr, icon: zoneOf(qsr, "makeline") },
  "smart-buildings": { zones: smartBuildings, icon: zoneOf(smartBuildings, "office-floors") },
  retail: { zones: retail, icon: zoneOf(retail, "cold-zone") },
  "oil-and-gas": { zones: oilAndGas, icon: oilAndGasIcon },
  dairy: { zones: dairy, icon: zoneOf(dairy, "tanker") },
  horeca: { zones: horeca, icon: zoneOf(horeca, "guest-rooms") },
};
