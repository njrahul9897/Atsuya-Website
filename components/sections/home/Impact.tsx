import type { CSSProperties } from "react";
import { Section } from "@/components/ui/Section";
import { CountUp } from "@/components/ui/CountUp";
import { Accent, rich } from "@/components/ui/rich";

type ImpactProps = {
  headline: string;
  reach: string; // one sentence; **…** marks the figures
  outcomes: { value: string; unit: string; label: string }[];
  note: string;
};

const emphasise = (text: string) =>
  text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
    index % 2 ? (
      <strong key={index} className="font-semibold whitespace-nowrap text-white">
        {part}
      </strong>
    ) : (
      part
    ),
  );

// "Our impact": reach as one sentence, then the outcomes as large figures, one to a row, each under
// a rule with a short accent. Rows rather than tiles, so this reads differently from the proof band
// under the hero and long figures ("73 million+") keep their size.
export function Impact({ headline, reach, outcomes, note }: ImpactProps) {
  return (
    <Section tone="brand" labelledBy="impact-title">
      <div className="container-x">
        <div className="grid-12 items-end gap-y-6">
          <h2 id="impact-title" className="t-h1 col-span-12 lg:col-span-5" data-reveal="">
            <Accent text={headline} />
          </h2>
          <p className="t-lead col-span-12 text-white/85 lg:col-span-6 lg:col-start-7" data-reveal="" style={{ "--reveal-delay": "60ms" } as CSSProperties}>
            {emphasise(reach)}
          </p>
        </div>

        <ul className="mt-14 lg:mt-20">
          {outcomes.map((outcome, index) => (
            <li
              key={outcome.label}
              className="grid-12 relative gap-y-3 border-t border-white/30 pt-8 pb-10 before:absolute before:-top-px before:left-0 before:h-0.5 before:w-16 before:bg-white lg:items-baseline lg:pt-10 lg:pb-12"
              data-reveal=""
              style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
            >
              <p className="t-impact col-span-12 lg:col-span-8">
                <CountUp value={outcome.value} />
                <span className="t-impact-unit ml-[0.3em] text-white/80">{outcome.unit}</span>
              </p>
              <p className="col-span-12 text-[1.25rem] leading-7 text-white/85 lg:col-span-4">{outcome.label}</p>
            </li>
          ))}
        </ul>

        <p className="t-label border-t border-white/30 pt-6 text-white/85">{rich(note)}</p>
      </div>
    </Section>
  );
}
