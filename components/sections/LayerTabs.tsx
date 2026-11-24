"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { cn } from "@/lib/cn";
import type { MockRow } from "@/content/platform";
import type { ZoneArt } from "@/components/iso/kit";
import { LayerMock } from "@/components/mockups/Mock";
import { ArrowLink } from "@/components/ui/Button";

export type LayerTab = {
  key: "iot" | "vision" | "blusquad";
  name: string;
  line: string;
  href: string;
  bullets: string[];
  mock: { title: string; rows: MockRow[] };
};

// Three tabs (AOne IoT / Vision AI / BluSquad). Each shows a product UI mock-up and its bullets.
// Standard tabs pattern: arrow keys move between tabs, Home and End jump to the ends.
export function LayerTabs({ tabs, art }: { tabs: LayerTab[]; art?: ZoneArt }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = tabs[active];

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = tabs.length - 1;
    const next = event.key === "ArrowRight" ? (active === last ? 0 : active + 1) : event.key === "ArrowLeft" ? (active === 0 ? last : active - 1) : event.key === "Home" ? 0 : event.key === "End" ? last : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    buttons.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="AOne layers" onKeyDown={onKeyDown} className="no-scrollbar -mx-[var(--pad)] flex gap-1 overflow-x-auto border-b border-line px-[var(--pad)] lg:mx-0 lg:px-0">
        {tabs.map((entry, index) => {
          const on = index === active;
          return (
            <button
              key={entry.key}
              ref={(node) => {
                buttons.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${entry.key}`}
              aria-selected={on}
              aria-controls={`${id}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(index)}
              className={cn("relative -mb-px h-14 shrink-0 px-5 text-[1.0625rem] font-semibold whitespace-nowrap transition-colors duration-200 first:pl-0", on ? "text-ink" : "text-ink-3 hover:text-ink")}
            >
              {entry.name}
              <span aria-hidden="true" className={cn("absolute right-5 bottom-0 left-5 h-0.5 bg-brand transition-opacity duration-200", index === 0 && "left-0", on ? "opacity-100" : "opacity-0")} />
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${tab.key}`} tabIndex={0} className="pt-10 lg:pt-14">
        <AnimatePresence mode="wait" initial={false}>
          <m.div key={tab.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }} className="grid-12 items-start gap-y-10">
            <div className="col-span-12 lg:col-span-5">
              <p className="t-lead max-w-[28rem] text-ink">{tab.line}</p>
              <ul className="mt-8">
                {tab.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-4 border-t border-line py-4 text-[1.0625rem] leading-7 text-ink-2 last:border-b">
                    <span aria-hidden="true" className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <ArrowLink href={tab.href}>More about {tab.name}</ArrowLink>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-7">
              <LayerMock layer={tab.key} title={tab.mock.title} rows={tab.mock.rows} art={art} />
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
