import { Fragment, type ReactNode } from "react";
import { withoutTbd } from "@/lib/tbd";
import { ACCENT_MARK } from "@/lib/accent";
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

// A headline with its accent in brand blue. Every headline has one:
//   1. the words marked with asterisks: "Make the world run *autonomous*" (see lib/accent.ts)
//   2. otherwise its last sentence or clause, as splitAccent finds it
//   3. otherwise its last word
export function Accent({ text }: { text: string }) {
  if (ACCENT_MARK.test(text)) {
    return (
      <>
        {text.split(/(\*[^*]+\*)/g).map((part, index) =>
          part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
            <span key={index} className="accent">
              {rich(part.slice(1, -1))}
            </span>
          ) : (
            // rich() trims, so the spaces either side of an accent are put back
            <Fragment key={index}>
              {/^\s/.test(part) ? " " : null}
              {rich(part)}
              {/\s$/.test(part) ? " " : null}
            </Fragment>
          ),
        )}
      </>
    );
  }
  const [head, tail] = splitAccent(text);
  if (tail) {
    return (
      <>
        {head} <span className="accent">{tail}</span>
      </>
    );
  }
  const last = text.match(/^(.*\s)?(\S+)$/);
  if (!last) return <>{rich(text)}</>;
  return (
    <>
      {last[1] ?? ""}
      <span className="accent">{last[2]}</span>
    </>
  );
}
