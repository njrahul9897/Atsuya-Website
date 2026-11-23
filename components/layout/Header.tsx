"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import { cn } from "@/lib/cn";
import { lockScroll } from "@/lib/scroll";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { SiteSearch } from "@/components/layout/SiteSearch";
import { ChevronDown, Close, Menu } from "@/components/ui/icons";

export type MenuKey = "industries" | "platform" | "resources" | "company";
type MobileLink = { label: string; href: string };

type HeaderProps = {
  panels: Record<MenuKey, ReactNode>; // server-rendered mega menus
  mobile: { title: string; links: MobileLink[] }[];
  cta: { label: string; href: string }; // shown in the mobile menu; on desktop the call to action lives in the page
  solid?: boolean; // never sit transparent (e.g. the 404 page, whatever its URL)
};

const items: ({ label: string; active: RegExp } & ({ menu: MenuKey } | { href: string }))[] = [
  { label: "Industries", menu: "industries", active: /^\/industries/ },
  { label: "Platform", menu: "platform", active: /^\/(platform|solutions)/ },
  { label: "Resources", menu: "resources", active: /^\/resources/ },
  { label: "Company", menu: "company", active: /^\/(company|contact)/ },
];

export function Header({ panels, mobile, cta, solid = false }: HeaderProps) {
  const pathname = usePathname();
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const triggers = useRef<Partial<Record<MenuKey, HTMLButtonElement | null>>>({});
  const closeTimer = useRef<number>(0);
  const lastY = useRef(0);
  const openedAt = useRef(0);

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Solid after 80px; hides on scroll down, returns on scroll up.
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 80);
      if (y < 160) setHidden(false);
      else if (y > lastY.current + 6) setHidden(true);
      else if (y < lastY.current - 6) setHidden(false);
      lastY.current = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Close everything on navigation.
  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    lockScroll(mobileOpen);
    return () => lockScroll(false);
  }, [mobileOpen]);

  const close = useCallback((returnFocus = false) => {
    setOpen((current) => {
      if (current && returnFocus) triggers.current[current]?.focus();
      return null;
    });
  }, []);

  useEffect(() => {
    if (!open && !mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close(true);
      setMobileOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (open && root.current && !root.current.contains(event.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, mobileOpen, close]);

  const toggle = (key: MenuKey, viaKeyboard: boolean) => {
    // A mouse click lands just after hover has opened the menu: that click must not close it.
    const justOpened = performance.now() - openedAt.current < 400;
    const next = open === key && !justOpened ? null : key;
    if (next && next !== open) openedAt.current = performance.now();
    setOpen(next);
    // Opened from the keyboard: move focus into the panel so Tab continues there.
    if (next && viaKeyboard) window.setTimeout(() => panel.current?.querySelector<HTMLElement>("a, button")?.focus(), 60);
  };

  const hoverOpen = (key: MenuKey, pointerType: string) => {
    if (pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    if (open !== key) openedAt.current = performance.now();
    setOpen(key);
  };
  const hoverLeave = (pointerType: string) => {
    if (pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 180);
  };

  // Every page opens on a dark hero, so the header starts clear over it (logo, links and search in
  // white, nothing behind them) and becomes a white floating bar once the page scrolls.
  const transparent = !solid && !scrolled && !open && !mobileOpen;
  const visible = !hidden || Boolean(open) || mobileOpen;

  return (
    <header
      ref={root}
      onPointerLeave={(event) => hoverLeave(event.pointerType)}
      onPointerEnter={() => window.clearTimeout(closeTimer.current)}
      onFocus={() => setHidden(false)}
      onBlur={(event) => {
        if (open && !event.currentTarget.contains(event.relatedTarget as Node | null)) close();
      }}
      className={cn("pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-300 ease-soft lg:px-5 lg:pt-4", visible ? "translate-y-0" : "-translate-y-[120%]")}
    >
      {/* Clear over the hero, a white floating bar once the page scrolls */}
      <div
        className={cn(
          "pointer-events-auto mx-auto flex h-[60px] max-w-[1376px] items-center gap-6 rounded-2xl border pr-2 pl-4 transition-[background-color,color,border-color,box-shadow] duration-300 ease-soft lg:h-16 lg:pr-2.5 lg:pl-6",
          transparent ? "on-dark border-transparent text-white" : "border-line bg-white/95 text-ink shadow-card backdrop-blur-xl",
        )}
      >
        <Link href="/" aria-label="Atsuya Technologies, home" className="shrink-0">
          <Logo mono={transparent} className="h-7 w-auto lg:h-8" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:ml-6 lg:block xl:ml-12">
          <ul className="flex items-center gap-1 xl:gap-4">
            {items.map((item) => {
              const active = item.active.test(pathname);
              const label = (
                <span className="relative py-1">
                  {item.label}
                  <span aria-hidden="true" className={cn("absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-brand transition-transform duration-300 ease-soft", active ? "scale-x-100" : "scale-x-0")} />
                </span>
              );
              const base = "inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[0.9375rem] font-medium transition-colors duration-200";
              const tone = transparent ? "hover:bg-white/12" : "hover:bg-paper-2";
              return (
                <li key={item.label}>
                  {"menu" in item ? (
                    <button
                      type="button"
                      ref={(node) => {
                        triggers.current[item.menu] = node;
                      }}
                      aria-expanded={open === item.menu}
                      aria-controls="mega-panel"
                      onClick={(event) => toggle(item.menu, event.detail === 0)}
                      onPointerEnter={(event) => hoverOpen(item.menu, event.pointerType)}
                      className={cn(base, tone, open === item.menu && !transparent && "bg-paper-2")}
                    >
                      {label}
                      <ChevronDown size={14} className={cn("transition-transform duration-300 ease-soft", open === item.menu && "rotate-180")} />
                    </button>
                  ) : (
                    <Link href={item.href} aria-current={active ? "page" : undefined} onPointerEnter={() => setOpen(null)} className={cn(base, tone)}>
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <SiteSearch onDark={transparent} />
          <button
            type="button"
            className={cn("flex h-11 w-11 items-center justify-center rounded-full lg:hidden", transparent ? "hover:bg-white/10" : "hover:bg-paper-2")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <Close size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Desktop mega menu */}
      <AnimatePresence>
        {open ? (
          <m.div
            key="panel"
            id="mega-panel"
            ref={panel}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
            className="pointer-events-auto absolute inset-x-5 top-full hidden pt-2 text-ink lg:block"
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("a")) setOpen(null);
            }}
          >
            <div className="mx-auto max-w-[1376px] overflow-hidden rounded-2xl border border-line bg-paper shadow-hover">{panels[open]}</div>
          </m.div>
        ) : null}
      </AnimatePresence>

      {/* Mobile menu */}
      {mobileOpen ? (
        <div id="mobile-nav" data-lenis-prevent className="pointer-events-auto absolute inset-x-3 top-full mt-2 max-h-[calc(100dvh-var(--header-h))] overflow-y-auto rounded-2xl border border-line bg-paper text-ink shadow-hover lg:hidden">
          <nav aria-label="Primary" className="container-x pt-2 pb-10">
            {mobile.map((group) =>
              group.links.length === 1 ? (
                <Link key={group.title} href={group.links[0].href} className="flex h-16 items-center border-b border-line text-[1.25rem] font-semibold">
                  {group.title}
                </Link>
              ) : (
                <details key={group.title} className="group border-b border-line">
                  <summary className="flex h-16 cursor-pointer list-none items-center justify-between text-[1.25rem] font-semibold [&::-webkit-details-marker]:hidden">
                    {group.title}
                    <ChevronDown className="transition-transform duration-300 ease-soft group-open:rotate-180" />
                  </summary>
                  <ul className="pb-5">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="flex min-h-11 items-center text-[1.0625rem] text-ink-2">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ),
            )}
            <Button href={cta.href} size="lg" className="mt-8 w-full">
              {cta.label}
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
