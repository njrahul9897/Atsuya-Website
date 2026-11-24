"use client";

import { getImageProps } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button, ArrowLink } from "@/components/ui/Button";
import { LiveTicker } from "@/components/ui/LiveTicker";
import { Accent } from "@/components/ui/rich";
import { cn } from "@/lib/cn";
import { ArrowRight, Pause, Play } from "@/components/ui/icons";

type Cta = { label: string; href: string };

export type HeroVideoProps = {
  src: string; // 1080p MP4. A VP9 WebM with the same name is expected beside it.
  srcMobile: string; // 720p MP4, served under 768px
  poster: string;
  posterMobile?: string; // a 9:16 crop, served under 768px so the poster is not upscaled to cover
  // "statement": the headline alone, large, at the foot of the footage, with the call to action
  // set beneath it as a line of type and a round arrow button (the homepage).
  variant?: "default" | "statement";
  eyebrow?: string;
  headline: string;
  sub?: string;
  primaryCta: Cta;
  secondaryCta?: Cta & { direction?: "right" | "down" };
  ticker?: string[];
  breadcrumb?: ReactNode;
  next?: "paper" | "paper-2" | "dark"; // the surface that follows: light ones rise over the footage as a rounded sheet
  children?: ReactNode; // extra content in the bottom-left block, e.g. the industry's hero stat
};

// Full-bleed hero video: autoplay, muted, looping, inline.
// - The poster is a priority next/image and is the LCP element. The <video> reuses the exact file
//   the browser chose for that image as its own `poster`, so nothing is fetched twice and the
//   video's first frame never replaces the poster as the LCP element.
// - The video mounts only once the poster has painted and the page is idle, so it never competes
//   with the first render. It then fades in over the poster when it can play.
// - With prefers-reduced-motion, or Save-Data, the video is never mounted: poster only.
// - It pauses when scrolled off screen, and has a visible pause/play control (WCAG 2.2.2).
// - Height is 100svh at every width. The brief asks for 88svh on phones, but with the specified
//   type scale the hero copy is already taller than that on a phone, and a hero that hovers around
//   the viewport height lets the late-starting video replace the poster as the LCP element.
export function HeroVideo({ src, srcMobile, poster, posterMobile, variant = "default", eyebrow, headline, sub, primaryCta, secondaryCta, ticker, breadcrumb, next = "paper", children }: HeroVideoProps) {
  const statement = variant === "statement";
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const posterImage = useRef<HTMLImageElement>(null);
  const [allowed, setAllowed] = useState(false); // motion OK and no Save-Data
  const [posterSrc, setPosterSrc] = useState<string | null>(null); // the optimised poster the browser picked
  const [mounted, setMounted] = useState(false); // allowed, poster painted, page idle
  const [ready, setReady] = useState(false); // first frame decoded
  const [userPaused, setUserPaused] = useState(false); // the visitor's choice
  const [playing, setPlaying] = useState(false); // what the element is actually doing
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    const apply = () => setAllowed(!media.matches && !saveData);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  // The poster usually finishes loading before hydration, when onLoad can no longer fire.
  useEffect(() => {
    const node = posterImage.current;
    if (node?.complete && node.currentSrc) setPosterSrc(node.currentSrc);
  }, []);

  // Bring the video in after the poster has painted and the browser has a quiet moment.
  useEffect(() => {
    if (!allowed) {
      setMounted(false);
      return;
    }
    if (!posterSrc) return;
    let idle = 0;
    let timer = 0;
    // A beat after the poster, then the next idle period: the video request must not start
    // until the poster has painted, or it competes with (and is counted against) the LCP.
    const start = () => {
      timer = window.setTimeout(() => {
        if ("requestIdleCallback" in window) idle = window.requestIdleCallback(() => setMounted(true), { timeout: 1500 });
        else setMounted(true);
      }, 900);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (idle) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, [allowed, posterSrc]);

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = video.current;
    if (!node || !mounted) return;
    if (inView && !userPaused) {
      node.muted = true; // React does not reliably set the muted attribute; autoplay needs it
      // If autoplay is refused (data saver, low power), the poster stays and the control offers Play.
      node.play().catch(() => {});
    } else {
      node.pause();
    }
  }, [mounted, inView, userPaused]);

  const toggle = () => {
    if (playing) {
      setUserPaused(true);
      return;
    }
    setUserPaused(false);
    video.current?.play().catch(() => {});
  };

  const webm = src.replace(/\.mp4$/, ".webm");
  // One <picture>: the landscape poster, and the portrait crop for phones.
  const image = { alt: "", fill: true, priority: true, quality: 70, sizes: "100vw" } as const;
  const { props: wide } = getImageProps({ ...image, src: poster });
  const tall = posterMobile ? getImageProps({ ...image, src: posterMobile }).props : null;

  return (
    <section ref={section} className="on-dark relative isolate flex min-h-[100svh] items-end overflow-hidden bg-night text-white">
      <picture>
        {tall ? <source media="(max-width: 767px)" srcSet={tall.srcSet} sizes="100vw" /> : null}
        {/* A plain <img> carrying next/image's props (getImageProps), which is how next/image does art direction. */}
        <img {...wide} alt="" ref={posterImage} fetchPriority="high" loading="eager" className="-z-20 object-cover" onLoad={(event) => setPosterSrc(event.currentTarget.currentSrc || poster)} />
      </picture>
      {mounted ? (
        <video
          ref={video}
          className="absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: ready ? 1 : 0 }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc ?? undefined}
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          onCanPlay={() => setReady(true)}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={srcMobile} type="video/mp4" media="(max-width: 767px)" />
          <source src={webm} type="video/webm" />
          <source src={src} type="video/mp4" />
        </video>
      ) : null}

      {/* Legibility layers (see .hero-scrim in globals.css): a flat --night veil plus the scrims. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night/25" />
      <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />

      {breadcrumb ? <div className="container-x absolute inset-x-0 top-[calc(var(--header-h)+20px)]">{breadcrumb}</div> : null}

      {statement ? (
        <>
          {/* A wash of brand blue rising from the corner the headline sits in */}
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(110%_80%_at_0%_100%,rgba(31,119,189,0.42),transparent_62%)]" />
          <div className="container-x w-full pt-40 pb-16 lg:pb-[4.5rem]">
            <h1 className="t-statement max-w-[13ch]">
              <Accent text={headline} />
            </h1>
            <Link href={primaryCta.href} className="t-statement-cta group/cta mt-4 inline-flex items-center gap-[0.45em] text-white/80 transition-colors duration-300 hover:text-white lg:mt-5">
              {primaryCta.label}
              <span aria-hidden="true" className="flex h-[1.5em] w-[1.5em] shrink-0 items-center justify-center rounded-full bg-white/25 backdrop-blur-md transition-[background-color,transform] duration-300 ease-soft group-hover/cta:translate-x-1 group-hover/cta:bg-white/40">
                <ArrowRight className="h-[0.55em] w-[0.55em]" />
              </span>
            </Link>
          </div>
          <div aria-hidden="true" className="absolute inset-x-[var(--pad)] bottom-6 h-px bg-white/25" />
        </>
      ) : (
        <div className={cn("container-x pt-44", next === "dark" ? "pb-12 lg:pb-16" : "pb-20 lg:pb-28")}>
          <div className="max-w-[640px]">
            {eyebrow ? <p className="eyebrow glass !text-white">{eyebrow}</p> : null}
            <h1 className="t-display mt-6">
              <Accent text={headline} />
            </h1>
            {sub ? <p className="t-lead mt-6 max-w-[34rem] text-white/85">{sub}</p> : null}
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button href={primaryCta.href} size="lg">
                {primaryCta.label}
              </Button>
              {secondaryCta ? (
                <ArrowLink href={secondaryCta.href} tone="light" direction={secondaryCta.direction ?? "right"}>
                  {secondaryCta.label}
                </ArrowLink>
              ) : null}
            </div>
            {ticker ? <LiveTicker items={ticker} className="mt-10" /> : null}
            {children ? <div className="mt-10">{children}</div> : null}
          </div>
        </div>
      )}

      {mounted ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause background video" : "Play background video"}
          className={cn("glass absolute right-[var(--pad)] flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors duration-200 hover:border-white/60", statement ? "bottom-[13.5rem] sm:bottom-12" : next === "dark" ? "bottom-12 lg:bottom-16" : "bottom-20 lg:bottom-28")}
        >
          {playing ? <Pause /> : <Play />}
        </button>
      ) : null}

      {/* Into the next surface: a rounded light sheet, or a fade into the dark section below */}
      {next === "dark" ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 bg-[linear-gradient(to_top,var(--navy-900),transparent)]" />
      ) : (
        <div aria-hidden="true" className={cn("absolute inset-x-0 bottom-0 h-8 rounded-t-[2rem] lg:h-10 lg:rounded-t-[2.5rem]", next === "paper-2" ? "bg-paper-2" : "bg-paper")} />
      )}
    </section>
  );
}
