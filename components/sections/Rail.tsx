"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";

// A horizontal scroll-snap rail on desktop with previous/next buttons; a two-column grid on
// mobile. The items are server-rendered and passed in.
export function Rail({ children, label, header }: { children: ReactNode; label: string; header: ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = () => {
    const node = track.current;
    if (!node) return;
    setEdges({ start: node.scrollLeft < 8, end: node.scrollLeft + node.clientWidth > node.scrollWidth - 8 });
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const move = (direction: 1 | -1) => {
    const node = track.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollBy({ left: direction * node.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  const button = "flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors duration-200 hover:border-ink disabled:pointer-events-none disabled:opacity-35";

  return (
    <>
      <div className="container-x flex items-end justify-between gap-8">
        {header}
        <div className="hidden shrink-0 gap-2 lg:flex">
          <button type="button" className={button} onClick={() => move(-1)} disabled={edges.start} aria-label={`Previous ${label}`}>
            <ArrowLeft />
          </button>
          <button type="button" className={button} onClick={() => move(1)} disabled={edges.end} aria-label={`Next ${label}`}>
            <ArrowRight />
          </button>
        </div>
      </div>
      <ul
        ref={track}
        onScroll={measure}
        className={cn(
          "container-x mt-12 grid grid-cols-2 gap-3 lg:mt-16",
          "lg:no-scrollbar lg:flex lg:max-w-none lg:snap-x lg:snap-mandatory lg:gap-6 lg:overflow-x-auto lg:scroll-px-[max(var(--pad),calc((100vw-1280px)/2))] lg:px-[max(var(--pad),calc((100vw-1280px)/2))] lg:pb-8",
        )}
      >
        {children}
      </ul>
    </>
  );
}
