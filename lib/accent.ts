// Every headline carries an accent in brand blue. The words are marked in the text with
// asterisks, "Make the world run *autonomous*"; <Accent> (components/ui/rich.tsx) colours them.
// Anywhere a headline is used as plain text (tab titles, link previews, search, OG images), the
// markers come off with plain().
export const ACCENT_MARK = /\*([^*]+)\*/;

export const plain = (text: string) => text.replace(/\*([^*]+)\*/g, "$1");
