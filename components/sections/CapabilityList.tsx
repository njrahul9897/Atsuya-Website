"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { cn } from "@/lib/cn";
import type { Layer } from "@/content/platform";
import type { ZoneArt } from "@/components/iso/kit";
import { LayerMock, MockTbd } from "@/components/mockups/Mock";
import { rich } from "@/components/ui/rich";

// What a layer does: its capabilities on the left, the product UI for the chosen one on the right.
export function CapabilityList({ layer, capabilities, art }: { layer: Layer["key"]; capabilities: Layer["capabilities"]; art?: ZoneArt }) {
  const [active, setActive] = useState(0);
  const current = capabilities[active];

  return (
    <div className="grid-12 items-start gap-y-10">
      <ol className="col-span-12 lg:col-span-5">
        {capabilities.map((capability, index) => {
          const on = index === active;
          return (
            <li key={capability.title} className={cn("border-l-2 transition-colors duration-300", on ? "border-brand" : "border-line")}>
              <button type="button" aria-expanded={on} onClick={() => setActive(index)} className="flex w-full items-baseline gap-4 py-3 pl-5 text-left">
                <span className={cn("t-label w-6 shrink-0", on ? "text-brand-ink" : "text-ink-3")}>0{index + 1}</span>
                <span className={cn("text-[1.25rem] leading-7 font-semibold tracking-[-0.01em] transition-colors duration-300", on ? "text-ink" : "text-ink-3 hover:text-ink")}>{capability.title}</span>
              </button>
              <div className={cn("grid transition-[grid-template-rows,opacity] duration-500 ease-soft", on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                <ul className="overflow-hidden pl-[3.75rem] text-[1.0625rem] leading-7 text-ink-2" aria-hidden={!on}>
                  {capability.points.map((point) => (
                    <li key={point} className="last:pb-4">
                      {rich(point)}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="col-span-12 lg:sticky lg:top-28 lg:col-span-6 lg:col-start-7">
        <AnimatePresence mode="wait" initial={false}>
          <m.div key={current.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}>
            <LayerMock layer={layer} title={current.mock.title} rows={current.mock.rows} art={art} />
          </m.div>
        </AnimatePresence>
        <MockTbd />
      </div>
    </div>
  );
}
