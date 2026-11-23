import type Lenis from "lenis";

// The one Lenis instance (absent when the visitor prefers reduced motion).
let lenis: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};
export const getLenis = () => lenis;

// Lock page scroll while a menu or dialog is open.
export function lockScroll(locked: boolean) {
  if (typeof document === "undefined") return;
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 0.9 });
  else window.scrollTo({ top: y });
}
