import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { MockRow } from "@/content/platform";
import type { ZoneArt } from "@/components/iso/kit";
import { MiniScene } from "@/components/iso/SceneSvg";
import { Check } from "@/components/ui/icons";

// Product UI mock-ups, built in HTML so they stay sharp and on-token. Readings are illustrative.
// [TBD: replace the UI mock-ups with real AOne product screenshots]

const dot = { ok: "bg-ok", warn: "bg-warn", alert: "bg-alert", live: "bg-brand" };

export function StatusDot({ status, className }: { status: MockRow["status"]; className?: string }) {
  if (status === "live") return <span className={cn("live-dot", className)} aria-hidden="true" />;
  return <i aria-hidden="true" className={cn("h-2 w-2 shrink-0 rounded-full", dot[status], className)} />;
}

export function MockFrame({ title, children, className, tag = "AOne" }: { title: string; children: ReactNode; className?: string; tag?: string }) {
  return (
    <div className={cn("dark-vars overflow-hidden rounded-[1.25rem] border border-navy-700 bg-navy-850 shadow-glow", className)}>
      <div className="flex items-center justify-between gap-4 border-b border-line bg-navy-900 px-5 py-3">
        <p className="t-label flex min-w-0 items-center gap-3 text-ink-2">
          <span aria-hidden="true" className="flex gap-1.5">
            <i className="h-2 w-2 rounded-full bg-white/20" />
            <i className="h-2 w-2 rounded-full bg-white/20" />
            <i className="h-2 w-2 rounded-full bg-white/20" />
          </span>
          <span className="truncate">{title}</span>
        </p>
        <p className="t-label flex shrink-0 items-center gap-2 text-ink-3">
          <span className="live-dot" aria-hidden="true" />
          {tag}
        </p>
      </div>
      {children}
    </div>
  );
}

export function MockRows({ rows }: { rows: MockRow[] }) {
  return (
    <ul>
      {rows.map((row) => (
        <li key={row.label} className={cn("flex items-center justify-between gap-4 border-b border-line px-5 py-3.5 last:border-b-0", row.status === "alert" && "bg-alert/10")}>
          <span className="flex min-w-0 items-center gap-3">
            <StatusDot status={row.status} />
            <span className="truncate text-[0.9375rem] leading-[1.375rem] text-ink">{row.label}</span>
          </span>
          {row.value ? <span className="t-label shrink-0 text-ink-2">{row.value}</span> : null}
        </li>
      ))}
    </ul>
  );
}

// A trend line with a soft area fill; the live end is picked out in the accent (or alert) colour.
export function Sparkline({ className, alert = false }: { className?: string; alert?: boolean }) {
  const history = "M0 44 L24 41 L48 45 L72 38 L96 42 L120 36 L144 40 L168 33 L192 37 L216 30 L240 34";
  const live = alert ? "L264 24 L288 14 L312 9" : "L264 31 L288 33 L312 28";
  const id = alert ? "spark-alert" : "spark-ok";
  return (
    <svg viewBox="0 0 320 64" className={cn("block w-full", className)} aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={alert ? "var(--alert)" : "var(--sky)"} stopOpacity="0.28" />
          <stop offset="1" stopColor={alert ? "var(--alert)" : "var(--sky)"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${history} ${live} L312 64 L0 64 Z`} fill={`url(#${id})`} />
      <line x1="0" y1="20" x2="320" y2="20" stroke="var(--line)" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
      <path d={history} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <path d={`M240 34 ${live}`} fill="none" stroke={alert ? "var(--alert)" : "var(--sky)"} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// AOne IoT: a live readout list with one trend.
export function IotMock({ title, rows, className }: { title: string; rows: MockRow[]; className?: string }) {
  const alert = rows.some((row) => row.status === "alert");
  return (
    <MockFrame title={title} className={className}>
      <div className="border-b border-line px-5 pt-5 pb-4">
        <div className="flex items-end justify-between">
          <p className="t-label text-ink-3">Last 24 hours</p>
          <p className="t-label text-ink-3">{alert ? "Threshold crossed" : "Within range"}</p>
        </div>
        <Sparkline className="mt-3 h-16" alert={alert} />
      </div>
      <MockRows rows={rows} />
    </MockFrame>
  );
}

// Vision AI: a camera frame with detections drawn over it.
export function VisionMock({ title, rows, art, className }: { title: string; rows: MockRow[]; art?: ZoneArt; className?: string }) {
  const flagged = rows.find((row) => row.status === "alert" || row.status === "warn");
  const passed = rows.find((row) => row.status === "ok");
  return (
    <MockFrame title={title} className={className} tag="Vision AI">
      <div className="relative border-b border-line bg-navy-900 px-8 pt-8 pb-6">
        {/* Viewfinder corners */}
        {["top-3 left-3 border-t border-l", "top-3 right-3 border-t border-r", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((corner) => (
          <span key={corner} aria-hidden="true" className={cn("absolute h-4 w-4 border-ink-3", corner)} />
        ))}
        <div className="relative mx-auto h-44 max-w-[19rem]">
          {art ? <MiniScene art={art} liveScale={0} className="!h-full" /> : null}
          {passed ? (
            <span className="absolute top-[30%] left-[10%] flex h-[50%] w-[38%] items-start border-[1.5px] border-sky">
              <span className="t-label -mt-px -ml-px bg-sky px-1.5 whitespace-nowrap text-navy-950">{passed.value ?? passed.label}</span>
            </span>
          ) : null}
          {flagged ? (
            <span className="absolute top-[12%] left-[52%] flex h-[58%] w-[36%] items-start border-[1.5px] border-alert-ink">
              <span className="t-label -mt-px -ml-px bg-alert-ink px-1.5 whitespace-nowrap text-white">{flagged.value ?? flagged.label}</span>
            </span>
          ) : null}
        </div>
      </div>
      <MockRows rows={rows} />
    </MockFrame>
  );
}

// BluSquad: who is on what, and where it stands.
export function SquadMock({ title, rows, className }: { title: string; rows: MockRow[]; className?: string }) {
  return (
    <MockFrame title={title} className={className} tag="BluSquad">
      <ol className="px-5 py-2">
        {rows.map((row, index) => (
          <li key={row.label} className="relative flex gap-4 py-3.5">
            <span className="relative flex w-5 shrink-0 justify-center">
              {index < rows.length - 1 ? <span aria-hidden="true" className="absolute top-6 -bottom-3.5 w-px bg-line" /> : null}
              <span className={cn("relative mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border", row.status === "ok" ? "border-sky bg-sky text-navy-950" : "border-line bg-navy-800 text-ink-3")}>
                {row.status === "ok" ? <Check size={12} /> : <StatusDot status={row.status} className="!h-1.5 !w-1.5" />}
              </span>
            </span>
            <span className="min-w-0">
              <span className="block text-[0.9375rem] leading-[1.375rem] text-ink">{row.label}</span>
              {row.value ? <span className="t-label mt-0.5 block text-ink-2">{row.value}</span> : null}
            </span>
          </li>
        ))}
      </ol>
    </MockFrame>
  );
}

export function LayerMock({ layer, title, rows, art, className }: { layer: "iot" | "vision" | "blusquad"; title: string; rows: MockRow[]; art?: ZoneArt; className?: string }) {
  if (layer === "vision") return <VisionMock title={title} rows={rows} art={art} className={className} />;
  if (layer === "blusquad") return <SquadMock title={title} rows={rows} className={className} />;
  return <IotMock title={title} rows={rows} className={className} />;
}

export const MockTbd = () => <span className="tbd mt-4">[TBD: replace UI mock-ups with real AOne product screenshots]</span>;
