import type { ReactNode } from "react";
import { ArrowRight } from "./icons";

// Renders content strings: "→" becomes the site arrow, and "[TBD: …]" becomes a visible
// placeholder chip so gaps are obvious in review.
export function rich(text: string): ReactNode {
  const parts = text.split(/(\[TBD[^\]]*\]|→)/g).filter(Boolean);
  if (parts.length === 1 && parts[0] !== "→" && !parts[0].startsWith("[TBD")) return text;
  return parts.map((part, index) => {
    if (part === "→") return <ArrowRight key={index} size={16} className="mx-[0.12em] inline-block h-[0.62em] w-[0.62em] align-[0.02em]" />;
    if (part.startsWith("[TBD")) return <span key={index} className="tbd">{part}</span>;
    return part;
  });
}

export const hasTbd = (text: string) => text.includes("[TBD");

// Splits a headline so its last phrase can carry the accent colour:
// "Sense. See. Decide. Act." → "Sense. See. Decide." + "Act."
export function splitAccent(text: string): [string, string | null] {
  const sentence = text.match(/^(.*[.?])\s+([^.?]+[.?]?)$/);
  if (sentence) return [sentence[1], sentence[2]];
  const clause = text.match(/^(.*,)\s+([^,]+)$/);
  if (clause) return [clause[1], clause[2]];
  return [text, null];
}

export function Accent({ text }: { text: string }) {
  const [head, tail] = splitAccent(text);
  if (!tail) return <>{rich(text)}</>;
  return (
    <>
      {head} <span className="accent">{tail}</span>
    </>
  );
}
