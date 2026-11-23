import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { ProofStat } from "@/components/ui/ProofStat";

const columns: Record<number, string> = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-6" };

// A row of 4–6 ProofStats. Ranges are typical results; named results carry their source.
export function ImpactBand({ items, className }: { items: { value: string; label: string; source?: string }[]; className?: string }) {
  const count = Math.min(6, Math.max(2, items.length));
  const longest = Math.max(...items.map((item) => item.value.length));
  const size = count > 4 ? (longest > 8 ? "md" : "lg") : longest > 9 ? "lg" : "xl";
  return (
    <ul className={cn("grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3", columns[count], className)}>
      {items.map((item, index) => (
        <li key={`${item.value}-${item.label}`} className="border-t border-line pt-6" data-reveal="" style={{ "--reveal-delay": `${index * 60}ms` } as CSSProperties}>
          <ProofStat value={item.value} label={item.label} source={item.source} size={size} fit={false} />
        </li>
      ))}
    </ul>
  );
}
