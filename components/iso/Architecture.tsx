import { cn } from "@/lib/cn";
import { Pad, ZoneItems, box, cyl, sen, cam, line, person, project, U, zone, type ZoneArt } from "./kit";

// The platform architecture as three pads on the shared grid:
// edge devices → the AOne cloud (AI models, dashboard, alerts) → BluSquad people.

export const architectureZones: ZoneArt[] = [
  zone("edge", 0, 0, [
    box(0.8, 0.9, 1.8, 1.4, 1.2, "mid"), // a machine with a sensor
    cyl(4.2, 1.6, 0.7, 1.8), // a tank with a sensor
    box(0.83, 3.83, 0.14, 0.14, 2.1, "mid"), // existing CCTV on a post
    cam(0.9, 3.9, 2.2, 2.2, 4.6),
    box(4.4, 4.3, 0.7, 0.7, 1.0, "blue"), // 4G gateway
    sen(2.6, 2.3, 0.8),
    sen(4.7, 2.1, 1.1),
    line([2.6, 2.7], [2.6, 4.65], [4.4, 4.65]),
    line([4.7, 2.5], [4.7, 4.3]),
    line([0.9, 4.3], [0.9, 5.3], [4.75, 5.3], [4.75, 5.0]),
    line([5.1, 4.65], [7.6, 4.65]),
  ]),
  zone("cloud", 1, 0, [
    box(0.8, 0.9, 1.5, 1.5, 0.5, "mid"), // AI models: stacked plates
    box(0.8, 0.9, 1.5, 1.5, 0.5, "light", 0.7),
    box(0.8, 0.9, 1.5, 1.5, 0.5, "mid", 1.4),
    box(3.4, 0.9, 1.5, 1.5, 0.5, "mid"),
    box(3.4, 0.9, 1.5, 1.5, 0.5, "light", 0.7),
    box(1.2, 3.6, 3.4, 0.25, 2.0), // dashboard
    box(1.5, 3.85, 0.3, 0.02, 0.9, "blue", 0.6),
    box(2.1, 3.85, 0.3, 0.02, 1.3, "blue", 0.6),
    box(2.7, 3.85, 0.3, 0.02, 0.7, "blue", 0.6),
    sen(4.0, 3.85, 1.6), // an alert on the dashboard
    line([0.6, 4.65], [2.9, 4.65], [2.9, 3.9]),
    line([4.6, 4.2], [4.6, 4.65], [7.6, 4.65]),
  ]),
  zone("people", 2, 0, [
    box(1.0, 1.0, 3.2, 1.1, 0.9), // desk
    box(1.5, 1.2, 0.9, 0.1, 0.6, "mid", 0.9),
    box(2.9, 1.2, 0.9, 0.1, 0.6, "mid", 0.9),
    person(1.9, 2.8, "blue"),
    person(3.4, 2.8, "blue"),
    person(4.6, 4.4, "blue"),
    box(3.2, 4.6, 0.9, 0.7, 0.5, "mid"), // toolkit
    line([0.6, 4.65], [2.4, 4.65], [2.4, 3.3]),
  ]),
];

const left = project(0, 6)[0] - 10;
const right = project(20, 0)[0] + 24;
const top = -3.2 * U;
const bottom = project(20, 6)[1] + 10;
export const architectureBox = { x: left, y: top, w: right - left, h: bottom - top };

export function architecturePercent(x: number, y: number) {
  const [sx, sy] = project(x, y);
  return { left: `${((sx - left) / (right - left)) * 100}%`, top: `${((sy - top) / (bottom - top)) * 100}%` };
}

export function ArchitectureSvg({ className, onPaper2 }: { className?: string; onPaper2?: boolean }) {
  return (
    <svg viewBox={`${left} ${top} ${right - left} ${bottom - top}`} role="img" aria-label="Edge devices (sensors, 4G gateways and existing CCTV) send data to the AOne cloud, where AI models, the dashboard and alerts run; BluSquad people act on the alerts." className={cn("iso", onPaper2 && "iso-on-paper-2", className)}>
      {architectureZones.map((entry) => (
        <g key={entry.id} id={`zone-${entry.id}`} className="zone is-live">
          <Pad pad={entry.pad} />
          <ZoneItems items={entry.items} />
        </g>
      ))}
    </svg>
  );
}
