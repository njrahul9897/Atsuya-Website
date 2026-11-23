import { cn } from "@/lib/cn";
import { Pad, ZoneItems, sceneViewBox, zoneViewBox, project, type SceneArt, type ZoneArt } from "./kit";

// Zones are drawn back to front, by the far corner of each pad.
const backToFront = (zones: ZoneArt[]) => [...zones].sort((a, b) => a.pad[0] + a.pad[1] - (b.pad[0] + b.pad[1]));

type SceneSvgProps = {
  art: SceneArt;
  title: string;
  // With an active zone, that zone is highlighted and live, and the others dim.
  activeId?: string | null;
  // With no active zone: "all" keeps every zone live (reduced motion, static uses), "hover" animates
  // the live elements while a parent .iso-host is hovered or focused.
  live?: "all" | "hover" | "none";
  onZoneClick?: (id: string) => void;
  className?: string;
  onPaper2?: boolean;
};

// A full industry scene on the shared frame. Each zone is its own <g id="zone-…">.
export function SceneSvg({ art, title, activeId, live = "none", onZoneClick, className, onPaper2 }: SceneSvgProps) {
  return (
    <svg viewBox={sceneViewBox} {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true, focusable: false })} className={cn("iso", onPaper2 && "iso-on-paper-2", live === "hover" && "iso-hover", className)}>
      {backToFront(art.zones).map((zone) => {
        const active = activeId === zone.id;
        return (
          <g
            key={zone.id}
            id={`zone-${zone.id}`}
            className={cn("zone", active && "is-active is-live", activeId && !active && "is-dim", !activeId && live === "all" && "is-live")}
            data-clickable={onZoneClick ? "" : undefined}
            onClick={onZoneClick ? () => onZoneClick(zone.id) : undefined}
          >
            <Pad pad={zone.pad} />
            <ZoneItems items={zone.items} />
          </g>
        );
      })}
    </svg>
  );
}

// One zone on a tight frame, for industry tiles and mega-menu icons. `liveScale` keeps the live
// dots legible when the drawing is small.
export function MiniScene({ art, className, liveScale = 1.6, onPaper2 }: { art: ZoneArt; className?: string; liveScale?: number; onPaper2?: boolean }) {
  return (
    <svg viewBox={zoneViewBox(art)} preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false" className={cn("iso iso-hover", onPaper2 && "iso-on-paper-2", className)}>
      <g className="zone">
        <Pad pad={art.pad} />
        <ZoneItems items={art.items} liveScale={liveScale} />
      </g>
    </svg>
  );
}

// Where a zone's numbered hotspot sits: just inside the pad's front corner.
export function zoneAnchor(zone: ZoneArt): [number, number] {
  const [x, y, w, d] = zone.pad;
  return [x + w - 0.45, y + d - 0.45];
}

export { project };
