"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowRight, Check } from "@/components/ui/icons";

type Problem = {
  key: string;
  title: string;
  story: string;
  time: string;
  asset: string;
  status: { before: string; problem: string; fixed: string };
  alert?: string;
  action: string;
  pin?: { problem: string; fixed: string };
  checks?: string[];
};
type Scene = { description: string; dashboard: string; calm: string };
type Point = { x: number; y: number };

const STORY_MS = 9000; // one story; matches --ops-loop in globals.css
const AUDIT_POINTS = ["audit-ext", "audit-panel", "audit-cold", "audit-aid"];
// How far the view zooms in on each story's zone. The audit spans the plant, so it stays wide.
const ZOOM: Record<string, number> = { energy: 1.7, break: 1.9, cold: 1.6, defect: 2.1, audit: 1 };

// The five problems as tabs, and beside them one illustration of a plant that tells the selected
// problem's story: the view zooms in on its zone, the problem starts, AOne catches it, the alert
// reaches the dashboard, and it is dealt with (styles: `.ops` in globals.css). The stories advance on their own while the
// panel is on screen, until a visitor picks one. With reduced motion they do not advance, and each
// shows its resolved state.
export function ProblemExplorer({ intro, tabsLabel, problems, scene, art, anchors }: { intro: ReactNode; tabsLabel: string; problems: Problem[]; scene: Scene; art: ReactNode; anchors: Record<string, Point> }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [play, setPlay] = useState(false);
  const [reduced, setReduced] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = panel.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setPlay(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!play || !auto || reduced) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % problems.length), STORY_MS);
    return () => window.clearTimeout(timer);
  }, [play, auto, reduced, active, problems.length]);

  const choose = (index: number) => {
    setActive(index);
    setAuto(false);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    const next = event.key === "Home" ? 0 : event.key === "End" ? problems.length - 1 : step === undefined ? null : (active + step + problems.length) % problems.length;
    if (next === null) return;
    event.preventDefault();
    choose(next);
    tabs.current[next]?.focus();
  };

  const problem = problems[active];
  const zone = anchors[`zone-${problem.key}`] ?? { x: 50, y: 50 };
  const pin = problem.pin && anchors[`pin-${problem.key}`];
  const view = { "--zx": `${zone.x}%`, "--zy": `${zone.y}%`, "--zs": ZOOM[problem.key] ?? 1 } as CSSProperties;
  const at = (point: Point) => ({ "--px": `${point.x}%`, "--py": `${point.y}%` }) as CSSProperties;

  return (
    <div className="ops container-x grid-12 items-center gap-y-10" data-problem={problem.key} data-play={play && !reduced ? "on" : "off"}>
      <div className="col-span-12 lg:col-span-5">
        {intro}
        <div role="tablist" aria-label={tabsLabel} aria-orientation="vertical" className="mt-10 space-y-1.5" onKeyDown={onKeyDown}>
          {problems.map((item, index) => {
            const on = index === active;
            return (
              <button
                key={item.key}
                ref={(button) => {
                  tabs.current[index] = button;
                }}
                type="button"
                role="tab"
                id={`problem-tab-${item.key}`}
                aria-selected={on}
                aria-controls="problem-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => choose(index)}
                className={cn("group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl px-4 py-3.5 text-left transition-colors duration-300 sm:px-5", on ? "bg-paper-2 text-ink" : "text-ink-2 hover:bg-paper-2/60 hover:text-ink")}
              >
                <span className={cn("t-label flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300", on ? "border-transparent bg-brand text-white" : "border-line bg-paper text-ink-3 group-hover:text-ink")}>0{index + 1}</span>
                <span className={cn("text-[1.0625rem] leading-6", on ? "font-semibold" : "font-medium")}>{item.title}</span>
                <ArrowRight className={cn("ml-auto shrink-0 transition-opacity duration-300", on ? "text-brand-ink opacity-100" : "opacity-0 group-hover:opacity-50")} />
                {on && auto && !reduced ? <span key={`${item.key}-${play}`} aria-hidden="true" className="ops-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-brand" /> : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-7">
        <div ref={panel} id="problem-panel" role="tabpanel" aria-labelledby={`problem-tab-${problem.key}`} className="ops-scene dark-vars @container relative overflow-hidden rounded-[1.5rem] bg-navy-950">
          <p className="sr-only">{problem.story}</p>

          <div className="ops-view relative overflow-hidden" style={view}>
            <div className="ops-zoom">{art}</div>
            {/* Labels pinned to the machine telling the story. They sit outside the zoom, placed by the
                same arithmetic, so they keep their size. */}
            <div aria-hidden="true" key={problem.key} className="pointer-events-none absolute inset-0 hidden @[30rem]:block">
              {pin && problem.pin ? (
                <span className="ops-pin ops-at absolute grid" style={at(pin)}>
                  <Pin className="ops-pin-problem" tone="alert">
                    {problem.pin.problem}
                  </Pin>
                  <Pin className="ops-pin-fixed" tone="ok">
                    {problem.pin.fixed}
                  </Pin>
                </span>
              ) : null}
              {problem.checks
                ? AUDIT_POINTS.map((name, n) => {
                    const point = anchors[name];
                    return point ? (
                      <span key={name} className={`ops-pin ops-at ops-check-${n} absolute grid`} style={at(point)}>
                        <Pin tone="ok">{problem.checks?.[n]}</Pin>
                      </span>
                    ) : null;
                  })
                : null}
            </div>
          </div>

          {/* The dashboard the alert reaches. The story is told to assistive tech above, so the
              card is hidden from it. */}
          <div key={problem.key} aria-hidden="true" className="ops-card relative z-10 m-4 mt-0 rounded-card border border-white/15 bg-navy-900/90 p-4 shadow-glow backdrop-blur-sm @[34rem]:absolute @[34rem]:bottom-5 @[34rem]:left-5 @[34rem]:m-0 @[34rem]:w-[20rem]">
            <p className="t-label flex items-center justify-between gap-2 whitespace-nowrap text-white/70">
              <span className="flex items-center gap-2">
                <span className="live-dot" />
                {scene.dashboard}
              </span>
              {problem.time}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
              <span className="text-[0.9375rem] leading-5 font-medium whitespace-nowrap text-white">{problem.asset}</span>
              <span className="t-label grid text-right whitespace-nowrap">
                <Status className="ops-status-before" dot="bg-white/50">
                  {problem.status.before}
                </Status>
                <Status className="ops-status-problem" dot="bg-[#ff4a3d]">
                  {problem.status.problem}
                </Status>
                <Status className="ops-status-fixed" dot="bg-ok">
                  {problem.status.fixed}
                </Status>
              </span>
            </div>

            {problem.checks ? (
              <div className="mt-3">
                <ul className="space-y-2">
                  {problem.checks.map((check, n) => (
                    <li key={check} className="flex items-center gap-2.5 text-[0.875rem] leading-5 text-white/90">
                      <span className="grid h-5 w-5 shrink-0">
                        <span className={`ops-pending-${n} col-start-1 row-start-1 h-5 w-5 rounded-full border border-white/30`} />
                        <span className={`ops-tick-${n} col-start-1 row-start-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white`}>
                          <Check size={12} />
                        </span>
                      </span>
                      {check}
                    </li>
                  ))}
                </ul>
                <Action className="mt-3">{problem.action}</Action>
              </div>
            ) : (
              <div className="mt-3 grid">
                <p className="ops-calm col-start-1 row-start-1 flex items-center gap-2 text-[0.875rem] leading-5 text-white/75">
                  <i className="h-1.5 w-1.5 rounded-full bg-ok" />
                  {scene.calm}
                </p>
                <div className="col-start-1 row-start-1">
                  <p className="ops-row-alert flex gap-2.5 rounded-lg bg-[#ff4a3d]/15 p-2.5 text-[0.875rem] leading-5 text-white">
                    <span className="t-label mt-px shrink-0 text-[#ffa39b]">{problem.time}</span>
                    {problem.alert}
                  </p>
                  <Action className="mt-2.5">{problem.action}</Action>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Status({ className, dot, children }: { className: string; dot: string; children: ReactNode }) {
  return (
    <span className={cn("col-start-1 row-start-1 inline-flex items-center justify-end gap-1.5 text-white", className)}>
      <i className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      {children}
    </span>
  );
}

function Action({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <p className={cn("ops-row-action flex items-center gap-2 text-[0.875rem] leading-5 text-white/90", className)}>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
        <Check size={12} />
      </span>
      {children}
    </p>
  );
}

// A label pinned above a point on the drawing.
function Pin({ className, tone, children }: { className?: string; tone: "alert" | "ok"; children: ReactNode }) {
  return (
    <span className={cn("col-start-1 row-start-1 mb-2 inline-flex items-center gap-1.5 justify-self-center rounded-full border px-2.5 py-1 text-[0.75rem] leading-4 font-medium whitespace-nowrap text-white shadow-glow backdrop-blur-sm", tone === "alert" ? "border-[#ff4a3d]/50 bg-[#3a0f12]/90" : "border-white/20 bg-navy-900/90", className)}>
      {tone === "alert" ? <i className="h-1.5 w-1.5 rounded-full bg-[#ff4a3d]" /> : <Check size={11} className="text-ok" />}
      {children}
    </span>
  );
}
