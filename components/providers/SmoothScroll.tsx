"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getLenis, setLenis } from "@/lib/scroll";

// Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger scenes stay in step.
// - Not started when the visitor prefers reduced motion.
// - Not started on touch-first devices: native touch scrolling is already smooth, and the
//   per-frame loop would only cost battery and main-thread time.
// - Both libraries are loaded when the browser is idle, never on the critical path.
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

    let cancelled = false;
    let dispose = () => {};

    const start = async () => {
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([import("lenis"), import("@/lib/gsap")]);
      if (cancelled) return;
      const lenis = new Lenis({ lerp: 0.11, anchors: true });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      dispose = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        setLenis(null);
      };
    };

    const idle = "requestIdleCallback" in window ? window.requestIdleCallback(start, { timeout: 2000 }) : (setTimeout(start, 300) as unknown as number);

    return () => {
      cancelled = true;
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
      dispose();
    };
  }, []);

  // New page: drop any scroll still in flight. Scroll scenes re-measure themselves.
  useEffect(() => {
    const lenis = getLenis();
    if (lenis && !window.location.hash) lenis.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
