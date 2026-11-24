import type { ReactNode } from "react";
import { withoutTbd } from "@/lib/tbd";
import { ArrowRight } from "./icons";

// Renders content strings: "→" becomes the site arrow. "[TBD: …]" markers are content gaps and
// are never shown (see lib/tbd.ts); a string that is only a gap renders nothing.
export function rich(text: string): ReactNode {
  const clean = withoutTbd(text);
  if (!clean) return null;
  const parts = clean.split(/(→)/g).filter(Boolean);
  if (parts.length === 1 && parts[0] !== "→") return clean;
  return parts.map((part, index) =>
    part === "→" ? <ArrowRight key={index} size={16} className="mx-[0.12em] inline-block h-[0.62em] w-[0.62em] align-[0.02em]" /> : part,
  );
}

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
