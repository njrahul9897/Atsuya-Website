import type { CSSProperties } from "react";

// A challenge: title and two or three short lines. As the card scrolls in, its status chip flips
// from "Unmonitored" (grey) to "Monitored by AOne" (blue). The flip is CSS, keyed off the reveal
// observer; without JS or with reduced motion the chip simply shows the end state.
export function ChallengeCard({ title, points, index }: { title: string; points: string[]; index: number }) {
  const delay = (index % 3) * 60;
  return (
    <li className="challenge card card-hover flex flex-col p-6 lg:p-7" data-reveal="" style={{ "--reveal-delay": `${delay}ms`, "--flip-delay": `${delay + 700}ms` } as CSSProperties}>
      <div className="flex items-start justify-between gap-3">
        <span className="status-chip">
          <span className="status-off" aria-hidden="true">
            <i />
            Unmonitored
          </span>
          <span className="status-on">
            <i />
            Monitored by AOne
          </span>
        </span>
        <span aria-hidden="true" className="t-label text-ink-3">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="t-h3 mt-8">{title}</h3>
      <ul className="mt-3 space-y-1 text-[1.0625rem] leading-7 text-ink-2">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </li>
  );
}
