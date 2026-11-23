import { cn } from "@/lib/cn";
import { Pad, ZoneItems, box, cyl, sen, cam, line, person, project, U, type Item } from "./kit";

// Three plates, exploded: the platform's layers from the edge (bottom) to people (top).
// Drawn in the exploded state; ThreeLayers animates the plates in from a closed stack.

const SIZE = 6.4;
export const PLATE_GAP = 5; // grid units between plates when exploded
const THICK = 0.3;

const plate = (z: number): Item => box(0, 0, SIZE, SIZE, THICK, "light", z);
const lift = (items: Item[], z: number): Item[] =>
  items.map((item) => {
    if (item.k === "line") return { ...item, pts: item.pts.map(([x, y, pz]) => [x, y, pz + z] as [number, number, number]) };
    if (item.k === "cam") return { ...item, z: item.z + z, tz: item.tz + z };
    return { ...item, z: item.z + z };
  });

// AOne IoT: sensors on machines and utilities
const iot: Item[] = [
  box(0.7, 0.7, 1.6, 1.3, 1.1, "mid"),
  cyl(3.6, 1.4, 0.65, 1.6),
  box(4.6, 0.8, 1.2, 1.0, 0.8),
  box(0.8, 3.9, 2.2, 1.2, 1.1),
  box(4.0, 3.8, 1.5, 1.4, 1.2, "mid"),
  sen(2.3, 2.0, 0.7),
  sen(4.06, 1.86, 1.0),
  sen(5.8, 1.8, 0.5),
  sen(3.0, 5.1, 0.7),
  sen(5.5, 5.2, 0.8),
  line([2.3, 2.4], [2.3, 3.1], [5.9, 3.1]),
  line([3.0, 5.5], [3.0, 5.9], [5.9, 5.9], [5.9, 3.1]),
];

// Vision AI: cameras over a line and a doorway
const vision: Item[] = [
  box(0.6, 2.6, 4.8, 0.9, 0.45),
  box(1.0, 2.8, 0.5, 0.5, 0.3, "mid", 0.45),
  box(2.2, 2.8, 0.5, 0.5, 0.3, "mid", 0.45),
  box(4.4, 2.8, 0.5, 0.5, 0.3, "mid", 0.45),
  box(3.2, 2.3, 0.16, 0.16, 1.8, "mid"),
  box(3.2, 3.64, 0.16, 0.16, 1.8, "mid"),
  box(3.2, 2.3, 0.16, 1.5, 0.16, "mid", 1.8),
  cam(3.36, 3.05, 1.8, 3.5, 3.05, 0.45),
  box(0.83, 4.63, 0.14, 0.14, 2.0, "mid"),
  cam(0.9, 4.7, 2.1, 2.4, 5.0),
  person(2.5, 5.0),
  box(4.6, 4.6, 1.1, 1.0, 0.9),
];

// BluSquad: people
const people: Item[] = [box(0.8, 0.9, 2.6, 1.0, 0.9), box(1.2, 1.1, 0.8, 0.1, 0.55, "mid", 0.9), person(1.8, 2.6, "blue"), person(4.3, 2.0, "blue"), person(4.7, 4.6, "blue"), person(2.4, 4.9, "blue"), box(3.3, 4.5, 0.9, 0.8, 0.6, "mid")];

const stack = [
  { key: "iot", items: iot },
  { key: "vision", items: vision },
  { key: "blusquad", items: people },
];

const top = PLATE_GAP * 2 + 2.6;
const left = project(0, SIZE)[0] - 12;
const right = project(SIZE, 0)[0] + 26;
const viewBox = `${left} ${-top * U} ${right - left} ${top * U + project(SIZE, SIZE)[1] + 14}`;

export function LayerStack({ className, active }: { className?: string; active?: string | null }) {
  return (
    <svg viewBox={viewBox} className={cn("iso", className)} role="img" aria-label="Three stacked plates: AOne IoT sensors at the bottom, Vision AI cameras in the middle and BluSquad people on top.">
      {stack.map((layer, index) => {
        const z = index * PLATE_GAP;
        return (
          <g key={layer.key} data-plate={index} className={cn("zone is-live", active && active !== layer.key && "is-dim")}>
            {index === 0 ? <Pad pad={[-0.5, -0.5, SIZE + 1, SIZE + 1]} className="shadow" /> : null}
            <ZoneItems items={[plate(z)]} />
            <ZoneItems items={lift(layer.items, z + THICK)} />
          </g>
        );
      })}
    </svg>
  );
}
