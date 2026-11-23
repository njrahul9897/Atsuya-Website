import { cn } from "@/lib/cn";

// The dashboard card laid over the homepage site illustration (see SiteVector). Its rows follow
// the four steps of "How AOne works":
//   0 Sense   sensors and cameras drop into place
//   1 See     data lines flow to the AOne gateway and this dashboard
//   2 Decide  one reading is flagged
//   3 Act     a BluSquad engineer arrives and the alert turns green
// step −1 is the state before the scene scrolls in (nothing installed yet).

type Row = { label: string; value: string; status: "ok" | "alert" | "live" };

// The one dashboard the data flows to. Readings are illustrative.
export function HomeDashboard({ step, className }: { step: number; className?: string }) {
  const compressor: Row = step === 2 ? { label: "Comp 2", value: "Anomaly", status: "alert" } : step >= 3 ? { label: "Comp 2", value: "Resolved", status: "ok" } : { label: "Comp 2", value: "Normal", status: "ok" };
  const rows: Row[] = [{ label: "Cold room 2", value: "3.8°C", status: "ok" }, { label: "Line 1", value: "Running", status: "ok" }, compressor];
  return (
    <div className={cn("home-dashboard w-full rounded-card border border-line bg-paper p-4 shadow-glow @[34rem]:w-[13rem]", className)} data-step={step} aria-hidden="true">
      <p className="t-label flex items-center gap-2 text-ink-3">
        <span className="live-dot" />
        AOne · Live
      </p>
      <ul className="mt-3 space-y-1.5">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-3">
            <span className="t-label text-ink-2">{row.label}</span>
            <span className="t-label flex items-center gap-1.5 text-ink">
              <i className={cn("h-1.5 w-1.5 rounded-full", row.status === "alert" ? "bg-alert" : "bg-ok")} />
              {row.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
