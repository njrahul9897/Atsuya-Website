"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Check, Moon } from "@/components/ui/icons";

type NightCopy = {
  shift: string;
  dashboard: string;
  live: string;
  asset: string;
  normal: string;
  warning: string;
  alert: { time: string; text: string };
  notified: string;
  idle: string;
  others: string[];
};

// The night shift, told in one 12-second loop (styles: `.night-scene` in globals.css):
//   calm      the sensor on Compressor 2 glows green; one operator, far away
//   fault     a warm glow builds at the compressor as its bearing heats
//   caught    the sensor turns amber, then red, and its alarm pulses
//   sent      a packet runs down the data line; the gateway pulses its signal
//   alerted   the dashboard flags Compressor 2, then the on-call engineer is alerted
// The dashboard card sits in the empty corner at the bottom left, beside the gateway that feeds it.
// The loop runs only while the panel is on screen. Without scripts, or with reduced motion, the
// panel shows the alerted state, still.
export function NightShift({ copy, art, className }: { copy: NightCopy; art: ReactNode; className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setPlay(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frame} data-play={play ? "on" : "off"} className={cn("night-scene dark-vars @container relative overflow-hidden rounded-[1.5rem] bg-navy-950 p-4 sm:p-5", className)}>
      <p className="t-label relative z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-white/90 @[34rem]:absolute @[34rem]:top-5 @[34rem]:left-5">
        <Moon size={14} />
        {copy.shift}
      </p>

      <div className="mt-3 @[34rem]:mt-6">{art}</div>

      {/* The dashboard the alert reaches. Described in the illustration's label, so hidden from
          assistive tech. */}
      <div aria-hidden="true" className="night-card relative z-10 mt-4 w-full rounded-card border border-white/15 bg-navy-900/90 p-4 shadow-glow backdrop-blur-sm @[34rem]:absolute @[34rem]:bottom-5 @[34rem]:left-5 @[34rem]:mt-0 @[34rem]:w-[17rem]">
        <p className="t-label flex items-center justify-between gap-2 whitespace-nowrap text-white/70">
          <span className="flex items-center gap-2">
            <span className="live-dot" />
            {copy.dashboard}
          </span>
          {copy.live}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
          <span className="text-[0.9375rem] leading-5 font-medium whitespace-nowrap text-white">{copy.asset}</span>
          <span className="t-label grid text-right whitespace-nowrap">
            <span className="night-status-ok col-start-1 row-start-1 inline-flex items-center justify-end gap-1.5 text-white/85">
              <i className="h-1.5 w-1.5 rounded-full bg-ok" />
              {copy.normal}
            </span>
            <span className="night-status-warn col-start-1 row-start-1 inline-flex items-center justify-end gap-1.5 text-white">
              <i className="h-1.5 w-1.5 rounded-full bg-[#ff4a3d]" />
              {copy.warning}
            </span>
          </span>
        </div>
        {/* Calm: the rest of the floor, idle. Alerted: the alert and who it reached. Same space. */}
        <div className="mt-3 grid">
          <ul className="night-calm-rows col-start-1 row-start-1 space-y-2.5">
            {copy.others.map((name) => (
              <li key={name} className="flex items-center justify-between gap-3 text-[0.875rem] leading-5 text-white/80">
                {name}
                <span className="t-label inline-flex items-center gap-1.5 text-white/70">
                  <i className="h-1.5 w-1.5 rounded-full bg-white/40" />
                  {copy.idle}
                </span>
              </li>
            ))}
          </ul>
          <div className="col-start-1 row-start-1">
            <p className="night-row-alert flex gap-2.5 rounded-lg bg-[#ff4a3d]/15 p-2.5 text-[0.875rem] leading-5 text-white">
              <span className="t-label mt-px shrink-0 text-[#ffa39b]">{copy.alert.time}</span>
              {copy.alert.text}
            </p>
            <p className="night-row-notify mt-2.5 flex items-center gap-2 text-[0.875rem] leading-5 text-white/90">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <Check size={12} />
              </span>
              {copy.notified}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
