// Gaps in the content are marked "[TBD: …]" in the content files, so `npm run tbd` can list them.
// The site never shows a marker: `withoutTbd` drops the markers from a string, and `isGap` tells
// a value that is nothing but a gap, so the block that would hold it can be left out.
const MARKER = /\[TBD[^\]]*\]/g;

export const hasTbd = (text: string) => text.includes("[TBD");

export function withoutTbd(text: string): string {
  return text
    .replace(MARKER, " ")
    .replace(/\s+([.,;:?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export const isGap = (text: string | null | undefined) => !text || withoutTbd(text) === "";
