"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { lockScroll } from "@/lib/scroll";
import { ArrowRight, Close, Search } from "@/components/ui/icons";
import type { SearchEntry } from "@/app/search-index.json/route";

// Pages offered before anything is typed.
const SUGGESTED = ["/industries", "/platform", "/customers", "/resources/savings-estimator", "/book-assessment"];

// Lower case, without accents or apostrophes, so "dominos" finds "Domino’s".
const fold = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ'’]/g, "");

// Every word typed must appear; matches in the title count for more than matches in the summary.
function rank(entries: SearchEntry[], query: string): SearchEntry[] {
  const terms = fold(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of entries) {
    const title = fold(entry.title);
    const rest = fold(`${entry.section} ${entry.description}`);
    let score = 0;
    for (const term of terms) {
      if (title.startsWith(term)) score += 6;
      else if (title.includes(` ${term}`)) score += 4;
      else if (title.includes(term)) score += 3;
      else if (rest.includes(term)) score += 1;
      else {
        score = -1;
        break;
      }
    }
    if (score > 0) scored.push({ entry, score });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ entry }) => entry);
}

// The search button in the header and the dialog it opens. The dialog is a native <dialog>, so
// focus is trapped while it is open, Escape closes it and focus returns to the button.
export function SiteSearch({ onDark }: { onDark: boolean }) {
  const id = useId();
  const router = useRouter();
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => setMounted(true), []);

  const open = useCallback(() => {
    const node = dialog.current;
    if (!node || node.open) return;
    node.showModal();
    lockScroll(true);
    if (entries) return;
    fetch("/search-index.json")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data: SearchEntry[]) => setEntries(data))
      .catch(() => setFailed(true));
  }, [entries]);

  const close = useCallback(() => dialog.current?.close(), []);

  // Ctrl/⌘ + K opens search from anywhere.
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => close(), [pathname, close]);

  const results = useMemo(() => (entries ? rank(entries, query) : []), [entries, query]);
  const typed = query.trim().length > 0;
  const shown = typed ? results : (entries ?? []).filter((entry) => SUGGESTED.includes(entry.path)).sort((a, b) => SUGGESTED.indexOf(a.path) - SUGGESTED.indexOf(b.path));
  const status = failed ? "Search is unavailable right now." : !entries ? "Loading" : !typed ? "" : results.length === 0 ? `No pages match “${query.trim()}”.` : `${results.length} ${results.length === 1 ? "result" : "results"}`;

  // Arrow keys move between the field and the results.
  const onArrow = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const links = Array.from(list.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    if (!links.length) return;
    event.preventDefault();
    const at = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = event.key === "ArrowDown" ? at + 1 : at - 1;
    if (next < 0) input.current?.focus();
    else links[Math.min(next, links.length - 1)].focus();
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Search"
        aria-haspopup="dialog"
        className={cn("flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200", onDark ? "hover:bg-white/12" : "hover:bg-paper-2")}
      >
        <Search size={20} />
      </button>

      {mounted
        ? createPortal(
            <dialog
              ref={dialog}
              aria-label="Search the site"
              onClose={() => {
                lockScroll(false);
                setQuery("");
              }}
              onClick={(event) => {
                if (event.target === event.currentTarget) close();
              }}
              className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 text-ink backdrop:bg-night/70 backdrop:backdrop-blur-sm"
            >
              <div className="mx-auto mt-[calc(var(--header-h)-24px)] w-[min(44rem,calc(100%-1.5rem))] overflow-hidden rounded-2xl border border-line bg-paper shadow-hover sm:mt-[12vh]">
                <form
                  role="search"
                  className="flex items-center gap-3 border-b border-line pr-2.5 pl-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!shown.length) return;
                    router.push(shown[0].path);
                    close();
                  }}
                >
                  <Search size={20} className="shrink-0 text-ink-3" />
                  <label htmlFor={id} className="sr-only">
                    Search the site
                  </label>
                  <input
                    ref={input}
                    id={id}
                    type="text"
                    inputMode="search"
                    enterKeyHint="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={onArrow}
                    placeholder="Search industries, solutions and customers"
                    autoComplete="off"
                    spellCheck={false}
                    autoFocus
                    className="h-16 min-w-0 flex-1 bg-transparent text-[1.125rem] text-ink outline-none placeholder:text-ink-3"
                  />
                  <button type="button" onClick={close} aria-label="Close search" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors duration-200 hover:bg-paper-2 hover:text-ink">
                    <Close size={18} />
                  </button>
                </form>

                <div data-lenis-prevent className="max-h-[min(60vh,30rem)] overflow-y-auto p-2">
                  {shown.length ? (
                    <>
                      {!typed ? <p className="t-label px-3 pt-3 pb-2 text-ink-3">Popular</p> : null}
                      <ul ref={list}>
                        {shown.map((entry) => (
                          <li key={entry.path}>
                            <Link href={entry.path} onClick={close} onKeyDown={onArrow} className="group/result flex items-center gap-4 rounded-xl px-3 py-3 transition-colors duration-150 hover:bg-paper-2 focus-visible:bg-paper-2">
                              <span className="min-w-0 flex-1">
                                <span className="flex flex-wrap items-baseline gap-x-3">
                                  <span className="text-[1.0625rem] leading-6 font-medium text-ink">{entry.title}</span>
                                  {entry.section ? <span className="t-label text-ink-3">{entry.section}</span> : null}
                                </span>
                                <span className="mt-0.5 line-clamp-1 text-[0.9375rem] leading-6 text-ink-2">{entry.description}</span>
                              </span>
                              <ArrowRight className="shrink-0 text-ink-3 transition-transform duration-200 group-hover/result:translate-x-0.5 group-hover/result:text-brand-ink" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="px-3 py-6 text-[1rem] text-ink-2">{status || "Type to search."}</p>
                  )}
                </div>
                <p role="status" className="sr-only">
                  {shown.length && typed ? status : ""}
                </p>
              </div>
            </dialog>,
            document.body,
          )
        : null}
    </>
  );
}
