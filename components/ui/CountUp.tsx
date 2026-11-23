"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { formatStat, isCountable, parseStat } from "@/lib/format";
import { rich } from "./rich";

// A figure that counts up once when it scrolls into view. Screen readers, reduced-motion visitors
// and no-JS readers get the final value. A hidden copy holds the final width, so the count never
// shifts the layout. `className` styles the visible figure (e.g. "stat-grad").
export function CountUp({ value, className, nowrap = true }: { value: string; className?: string; nowrap?: boolean }) {
  const live = useRef<HTMLSpanElement>(null);
  const countable = isCountable(value);

  useEffect(() => {
    const node = live.current;
    if (!node || !countable || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const parts = parseStat(value);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const run = (now: number) => {
          const t = Math.min(1, (now - start) / 1300);
          node.textContent = t < 1 ? formatStat(parts, 1 - Math.pow(1 - t, 3)) : value;
          if (t < 1) frame = requestAnimationFrame(run);
        };
        frame = requestAnimationFrame(run);
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = value;
    };
  }, [value, countable]);

  return (
    <>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className={cn("relative inline-block", nowrap && "whitespace-nowrap")}>
        <span className="invisible">{rich(value)}</span>
        <span ref={live} className={cn("absolute inset-0", className)}>
          {rich(value)}
        </span>
      </span>
    </>
  );
}
