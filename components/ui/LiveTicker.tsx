import { cn } from "@/lib/cn";

// Live figures under the hero copy, as glass chips. The dot pulses in brand blue.
export function LiveTicker({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      <li className="t-label inline-flex h-8 items-center gap-2 pr-2 text-white">
        <span className="live-dot" aria-hidden="true" />
        Live
      </li>
      {items.map((item) => (
        <li key={item} className="glass t-label inline-flex h-8 items-center rounded-full px-3.5 text-white">
          {item}
        </li>
      ))}
    </ul>
  );
}
