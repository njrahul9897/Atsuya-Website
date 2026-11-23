import { CountUp } from "./CountUp";

type ProofStatProps = {
  value: string;
  label: string;
  source?: string;
  size?: "xl" | "lg" | "md";
  tone?: "brand" | "plain"; // brand: the blue gradient numeral (adapts on dark surfaces)
  fit?: boolean; // step long values down a size (default); off when a row sets one size for all
  className?: string;
};

const sizes = { xl: "t-stat-xl", lg: "t-stat-lg", md: "t-stat-md" };
const stepDown = { xl: "lg", lg: "md", md: "md" } as const;

// A big gradient number in brand blue, a one-line label and a mono source line. Numeric values
// count up once when they scroll into view (see CountUp).
export function ProofStat({ value, label, source, size = "lg", tone = "brand", fit = true, className }: ProofStatProps) {
  // Long, wordy values ("Over-cooling", "FY23 → FY25") step down a size so they hold one line.
  const fitted = fit && value.length > 9 ? stepDown[size] : size;
  return (
    <div className={className}>
      <p className={sizes[fitted]}>
        <CountUp value={value} nowrap={fit} className={tone === "plain" ? "text-ink" : "stat-grad"} />
      </p>
      <p className="mt-3 text-[1.0625rem] leading-6 text-ink">{label}</p>
      {source ? <p className="t-label mt-3 text-ink-3">{source}</p> : null}
    </div>
  );
}
