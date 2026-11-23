"use client";

import { useRef, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";
import { useNearViewport } from "@/lib/hooks";
import { Check } from "@/components/ui/icons";
import { home } from "@/content/home";

type Moment = (typeof home.problem.moments)[number];
const statusDot = { alert: "bg-alert", warn: "bg-warn", ok: "bg-ok" } as const;

// The paper version of a moment: a log sheet, a clipboard, an alarm panel.
function Paper({ moment }: { moment: Moment }) {
  const { paper, id } = moment;
  if (id === "alarm") {
    const [, time, note] = paper.rows[0];
    return (
      <div className="w-full max-w-[21rem] rounded-lg border border-[#c7ccd7] bg-[#dfe2e9] p-4">
        <p className="t-label text-ink-2">{paper.title}</p>
        <div className="mt-3 flex items-center gap-3 rounded-md bg-ink px-3 py-2.5">
          <i className="h-2.5 w-2.5 rounded-full bg-alert" />
          <span className="t-label text-white">Alarm · {time}</span>
        </div>
        <p className="t-label mt-3 text-ink-2">{note}</p>
      </div>
    );
  }
  const clipboard = id === "audit";
  return (
    <div className={cn("relative w-full max-w-[21rem] border border-line bg-paper px-5 pt-5 pb-4", clipboard ? "rounded-lg pt-7" : "rounded-sm", id === "log" ? "-rotate-1" : "rotate-[0.6deg]")}>
      {clipboard ? <span aria-hidden="true" className="absolute -top-2 left-1/2 h-4 w-20 -translate-x-1/2 rounded-sm bg-[#8a92a3]" /> : null}
      <p className="t-label text-ink-2">{paper.title}</p>
      <ul className="mt-3">
        {paper.rows.map(([a, b, note]) => (
          <li key={a} className="flex items-center justify-between gap-3 border-t border-line py-1.5 font-mono text-[0.8125rem] leading-5 text-ink-2">
            <span>{a}</span>
            <span className="flex items-center gap-2">
              {note && note !== "ok" ? <span className="text-ink-3">{note}</span> : null}
              {clipboard ? (
                <span className="flex h-4 w-4 items-center justify-center border border-ink-3 text-ink">{b ? <Check size={12} /> : null}</span>
              ) : (
                <span className="w-12 text-right text-ink">{b}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The same moment in AOne: one clean alert.
function Alert({ moment }: { moment: Moment }) {
  const { aone } = moment;
  return (
    <div className="w-full max-w-[24rem] rounded-card border border-line bg-paper p-5 shadow-glow">
      <p className="t-label flex items-center justify-between text-ink-3">
        <span className="flex items-center gap-2">
          <i className={cn("h-2 w-2 rounded-full", statusDot[aone.status as keyof typeof statusDot])} />
          {aone.status === "ok" ? "Resolved" : "Alert"}
        </span>
        <span>{aone.time}</span>
      </p>
      <p className="mt-3 text-[1.0625rem] leading-6 font-semibold text-ink">{aone.title}</p>
      <p className="t-label mt-1.5 text-ink-2">{aone.detail}</p>
      <p className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-[0.9375rem] leading-[1.375rem] text-brand-ink">
        <Check />
        {aone.action}
      </p>
    </div>
  );
}

// Split screen: paper on the left, the same moments in AOne on the right. Scrolling scrubs a wipe
// from left to right that turns each paper moment into a clean alert. Without motion the section
// simply shows both sides.
export function ProblemWipe() {
  const frame = useRef<HTMLDivElement>(null);
  const { moments, before, after } = home.problem;
  const near = useNearViewport(frame);

  useGSAP(
    () => {
      if (!near) return;
      const media = gsap.matchMedia();
      media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(frame.current, { "--wipe": 0 }, { "--wipe": 1, ease: "none", scrollTrigger: { trigger: frame.current, start: "top 78%", end: "top 12%", scrub: 0.5 } });
      });
      return () => media.revert();
    },
    { scope: frame, dependencies: [near] },
  );

  return (
    <div ref={frame} className="problem-wipe relative overflow-hidden rounded-[1.5rem] border border-line shadow-card" style={{ "--wipe": 1 } as CSSProperties}>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <p className="t-label hidden border-b border-line bg-paper-2 px-10 py-4 text-ink-3 lg:block">{before}</p>
        <p className="dark-vars t-label hidden items-center gap-2 border-b border-line bg-navy-900 px-10 py-4 text-brand-ink lg:flex">
          <span className="live-dot" aria-hidden="true" />
          {after}
        </p>
        {moments.map((moment) => (
          <div key={moment.id} className="contents lg:[&:last-of-type>div]:border-b-0">
            <div className="problem-paper flex items-center justify-center border-b border-line bg-paper-2 px-6 py-8 lg:px-10 lg:py-7">
              <div className="w-full max-w-[21rem]">
                <p className="t-label mb-3 text-ink-3 lg:hidden">{before}</p>
                <Paper moment={moment} />
              </div>
            </div>
            <div className="problem-aone dark-vars flex items-center justify-center border-b border-line bg-navy-900 px-6 py-8 lg:px-10 lg:py-7">
              <div className="w-full max-w-[24rem]">
                <p className="t-label mb-3 text-brand-ink lg:hidden">{after}</p>
                <Alert moment={moment} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <span aria-hidden="true" className="problem-edge" />
    </div>
  );
}
