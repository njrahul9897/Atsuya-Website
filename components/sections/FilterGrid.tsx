"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import { cn } from "@/lib/cn";

export type FilterGroup = { key: string; label: string; options: { value: string; label: string }[] };
export type FilterItem = { id: string; tags: Record<string, string[]>; node: ReactNode; className?: string };

// Filter chips over a grid of server-rendered cards. One choice per group; "All" clears it.
export function FilterGrid({ groups, items, gridClassName, empty = "No stories match those filters yet." }: { groups: FilterGroup[]; items: FilterItem[]; gridClassName: string; empty?: string }) {
  const [chosen, setChosen] = useState<Record<string, string>>({});

  const visible = useMemo(() => items.filter((item) => groups.every((group) => !chosen[group.key] || item.tags[group.key]?.includes(chosen[group.key]))), [items, groups, chosen]);
  const filtering = Object.values(chosen).some(Boolean);

  const chip = (on: boolean) =>
    cn("inline-flex h-10 items-center rounded-full border px-4 text-[0.9375rem] font-medium whitespace-nowrap transition-colors duration-200", on ? "border-brand bg-brand text-white" : "border-line bg-paper text-ink-2 hover:border-ink hover:text-ink");

  return (
    <div>
      <div className="space-y-3">
        {groups.map((group) => (
          <div key={group.key} className="flex items-center gap-4">
            {groups.length > 1 ? <p className="t-label w-20 shrink-0 text-ink-3">{group.label}</p> : null}
            <div role="group" aria-label={`Filter by ${group.label.toLowerCase()}`} className="no-scrollbar -mx-[var(--pad)] flex gap-2 overflow-x-auto px-[var(--pad)] py-1 lg:mx-0 lg:flex-wrap lg:px-0">
              <button type="button" aria-pressed={!chosen[group.key]} className={chip(!chosen[group.key])} onClick={() => setChosen((state) => ({ ...state, [group.key]: "" }))}>
                All
              </button>
              {group.options.map((option) => (
                <button key={option.value} type="button" aria-pressed={chosen[group.key] === option.value} className={chip(chosen[group.key] === option.value)} onClick={() => setChosen((state) => ({ ...state, [group.key]: state[group.key] === option.value ? "" : option.value }))}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {visible.length} of {items.length} stories shown
      </p>

      <ul className={cn("mt-10", gridClassName, filtering && "is-filtered")}>
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item) => (
            <m.li key={item.id} className={cn(item.className, "min-w-0")} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}>
              {item.node}
            </m.li>
          ))}
        </AnimatePresence>
      </ul>
      {visible.length === 0 ? <p className="py-10 text-ink-2">{empty}</p> : null}
    </div>
  );
}
