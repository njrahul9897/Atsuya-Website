// Number helpers for proof stats and the savings estimator.

export type StatPart = { kind: "text"; text: string } | { kind: "number"; value: number; decimals: number; locale: "en-IN" | "en-US" | null };

// Stats that should not count up: comparisons ("8% → 2%"), ratios ("24x7"), years ("FY23") and
// anything without a leading figure ("Patented", "Edge AI").
export function isCountable(value: string): boolean {
  return /^[~<>]?\s?₹?\d/.test(value) && !/→|x\d|FY\d/.test(value);
}

// Split "~₹1 Cr", "1,40,000" or "20–30%" into text and number parts so each number can count up.
export function parseStat(value: string): StatPart[] {
  const parts: StatPart[] = [];
  const pattern = /\d[\d,]*(?:\.\d+)?/g;
  let last = 0;
  for (const match of value.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ kind: "text", text: value.slice(last, index) });
    const raw = match[0];
    const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
    const locale = !raw.includes(",") ? null : /\d,\d{2},\d{3}/.test(raw) ? "en-IN" : "en-US";
    parts.push({ kind: "number", value: Number(raw.replace(/,/g, "")), decimals, locale });
    last = index + raw.length;
  }
  if (last < value.length) parts.push({ kind: "text", text: value.slice(last) });
  return parts;
}

export function formatStat(parts: StatPart[], progress: number): string {
  return parts
    .map((part) => {
      if (part.kind === "text") return part.text;
      const current = part.value * progress;
      if (part.locale) return current.toLocaleString(part.locale, { minimumFractionDigits: part.decimals, maximumFractionDigits: part.decimals });
      return current.toFixed(part.decimals);
    })
    .join("");
}

// ₹ amounts the way they are written in India: lakh and crore above ₹1,00,000.
export function formatINR(amount: number): string {
  if (!Number.isFinite(amount)) return "₹0";
  const round = (value: number) => (value >= 100 ? Math.round(value).toString() : value >= 10 ? value.toFixed(1).replace(/\.0$/, "") : value.toFixed(2).replace(/\.?0+$/, ""));
  if (amount >= 1e7) return `₹${round(amount / 1e7)} Cr`;
  if (amount >= 1e5) return `₹${round(amount / 1e5)} lakh`;
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}
