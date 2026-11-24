"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToY } from "@/lib/scroll";
import { useNearViewport } from "@/lib/hooks";
import { scenePercent, type SceneArt } from "@/components/iso/kit";
import { SceneSvg, zoneAnchor } from "@/components/iso/SceneSvg";
import { HomeDashboard } from "@/components/iso/HomeScene";
import { Accent } from "@/components/ui/rich";
import { plain } from "@/lib/accent";

export type SceneStep = { id: string; name: string; body: string[] };

type IsoSceneProps = {
  id?: string;
  headline: string;
  steps: SceneStep[];
  // "zones": an industry scene whose zones are the steps. "home": the four-step generic site,
  // whose illustration is rendered on the server and passed in.
  scene: { kind: "zones"; art: SceneArt; title: string } | { kind: "home"; art: ReactNode };
  tone?: "paper" | "paper-2" | "dark";
};

const PINNED = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const pad = (n: number) => String(n + 1).padStart(2, "0");

// The pinned scroll scene: 2.5D SVG on the left (60%), step panel on the right (40%).
// - Desktop: the section pins (CSS sticky) and ScrollTrigger maps scroll progress to the active
//   step, highlighting its zone and swapping the panel text.
// - Mobile: a vertical stack with the scene on top and a swipeable step list.
// - Reduced motion: nothing pins or scrubs. The scene shows its end state and the steps are
//   plain buttons.
// Hotspots and steps are real buttons, so the scene works from the keyboard in every mode.
export function IsoScene({ id, headline, steps, scene, tone = "dark" }: IsoSceneProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null); // null: no step chosen yet
  const [pinned, setPinned] = useState(false);
  const [entered, setEntered] = useState(false);
  const count = steps.length;
  const near = useNearViewport(wrap);

  useEffect(() => {
    const media = window.matchMedia(PINNED);
    const apply = () => setPinned(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  // Start the story when the scene is actually on screen.
  useEffect(() => {
    const node = wrap.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setEntered(true), { rootMargin: "0px 0px -35% 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!pinned || !near || !wrap.current) return;
      const trigger = ScrollTrigger.create({
        trigger: wrap.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => setActive(Math.min(count - 1, Math.floor(self.progress * count))),
        onRefresh: (self) => setActive(Math.min(count - 1, Math.floor(self.progress * count))),
      });
      return () => trigger.kill();
    },
    { dependencies: [pinned, near, count] },
  );

  // Mobile: the visible card in the swipe list is the active step.
  const onRailScroll = () => {
    const node = rail.current;
    if (!node || pinned) return;
    const card = node.firstElementChild as HTMLElement | null;
    if (!card) return;
    const index = Math.round(node.scrollLeft / (card.offsetWidth + 12));
    setActive(Math.max(0, Math.min(count - 1, index)));
  };

  const go = (index: number) => {
    if (pinned && wrap.current) {
      // Scroll to the middle of that step's stretch so scroll position and state stay in step.
      const top = wrap.current.getBoundingClientRect().top + window.scrollY;
      const distance = wrap.current.offsetHeight - window.innerHeight;
      scrollToY(top + ((index + 0.5) / count) * distance);
      return;
    }
    setActive(index);
    const node = rail.current;
    const card = node?.children[index] as HTMLElement | undefined;
    if (node && card && node.offsetParent) node.scrollTo({ left: card.offsetLeft - node.offsetLeft, behavior: "smooth" });
  };

  // What the drawing shows. Without a chosen step: zones scenes show everything live; the home
  // scene shows the "before" state until it scrolls in, then its end state.
  const homeStep = active ?? (entered ? (pinned ? 0 : count - 1) : -1);
  const activeId = active === null ? null : steps[active].id;
  const expandAll = active === null;

  return (
    <section id={id} className={tone === "dark" ? "dark-vars surface-dark glow-left" : tone === "paper-2" ? "bg-paper-2" : "bg-paper"} aria-labelledby={`${id ?? "scene"}-title`}>
      <div ref={wrap} className="iso-scene-wrap" style={{ "--steps": count } as CSSProperties}>
        <div className="iso-scene-pin">
          <div className="container-x">
            <div className="grid-12 items-center gap-y-10">
              {/* Scene: 60% */}
              <div className="order-2 col-span-12 lg:order-1 lg:col-span-7">
                <div className={cn("relative mx-auto", scene.kind === "home" ? "max-w-[46rem] lg:-ml-[9%] lg:w-[120%] lg:max-w-none" : "max-w-[46rem]")}>
                  {scene.kind === "zones" ? (
                    <SceneSvg art={scene.art} title={scene.title} activeId={activeId} live="all" onZoneClick={(zoneId) => go(steps.findIndex((step) => step.id === zoneId))} onPaper2={tone === "paper-2"} />
                  ) : (
                    <div className="home-scene @container relative" data-step={homeStep}>
                      {/* The dashboard sits over the empty corner of the frame, scaled with it; when the
                          frame is too narrow for that, it stacks above. */}
                      <div className="mb-2 @[34rem]:pointer-events-none @[34rem]:absolute @[34rem]:-top-[3%] @[34rem]:left-[1%] @[34rem]:z-10 @[34rem]:mb-0 @[34rem]:origin-top-left @[34rem]:scale-[0.75] @[42rem]:scale-[0.85] @[52rem]:scale-100">
                        <HomeDashboard step={homeStep} />
                      </div>
                      <div className="-mx-[var(--pad)] sm:mx-0">{scene.art}</div>
                    </div>
                  )}

                  {scene.kind === "zones"
                    ? scene.art.zones.map((zone) => {
                        const index = steps.findIndex((step) => step.id === zone.id);
                        if (index < 0) return null;
                        const [x, y] = zoneAnchor(zone);
                        const on = active === index;
                        return (
                          <button
                            key={zone.id}
                            type="button"
                            onClick={() => go(index)}
                            aria-label={`${index + 1}. ${steps[index].name}: show use cases`}
                            aria-pressed={on}
                            style={scenePercent(x, y)}
                            className={cn(
                              "t-label absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-colors duration-300 before:absolute before:-inset-2 before:content-['']",
                              on ? "border-brand bg-brand text-white" : "border-line bg-paper text-ink-2 hover:border-brand hover:text-brand-ink",
                            )}
                          >
                            {index + 1}
                          </button>
                        );
                      })
                    : null}
                </div>
              </div>

              {/* Panel: 40% */}
              <div className="order-1 col-span-12 lg:order-2 lg:col-span-5 lg:pl-6">
                <h2 id={`${id ?? "scene"}-title`} className="t-h2">
                  <Accent text={headline} />
                </h2>

                {/* Desktop: the step index. One step open at a time while pinned. */}
                <ol className="mt-10 hidden lg:block">
                  {steps.map((step, index) => {
                    const on = active === index;
                    const openStep = on || expandAll;
                    return (
                      <li key={step.id} className={cn("border-l-2 transition-colors duration-300", on ? "border-accent" : "border-line")}>
                        <button type="button" onClick={() => go(index)} aria-current={on ? "step" : undefined} className="flex w-full items-baseline gap-4 py-2.5 pl-5 text-left">
                          <span className={cn("t-label w-6 shrink-0 transition-colors duration-300", on ? "text-brand-ink" : "text-ink-3")}>{pad(index)}</span>
                          <span className={cn("text-[1.25rem] leading-7 font-semibold tracking-[-0.01em] transition-colors duration-300", on || expandAll ? "text-ink" : "text-ink-3")}>{step.name}</span>
                        </button>
                        <div className={cn("grid transition-[grid-template-rows,opacity] duration-500 ease-soft", openStep ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                          <ul className="overflow-hidden pl-[3.75rem] text-[1.0625rem] leading-7 text-ink-2">
                            {step.body.map((entry) => (
                              <li key={entry} className="last:pb-4">
                                {entry}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Mobile: a swipeable step list under the scene. */}
              <div className="order-3 col-span-12 lg:hidden">
                <div ref={rail} onScroll={onRailScroll} className="no-scrollbar -mx-[var(--pad)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--pad)]" role="group" aria-label={`${plain(headline)} Steps`} tabIndex={0}>
                  {steps.map((step, index) => {
                    const on = active === index || (active === null && index === 0);
                    return (
                      <div key={step.id} className={cn("w-[78%] shrink-0 snap-start rounded-card border bg-paper p-5 transition-colors duration-300 sm:w-[46%]", on ? "border-accent" : "border-line")}>
                        <p className={cn("t-label", on ? "text-brand-ink" : "text-ink-3")}>
                          {pad(index)} / {pad(count - 1)}
                        </p>
                        <h3 className="mt-2 text-[1.25rem] leading-7 font-semibold tracking-[-0.01em]">{step.name}</h3>
                        <ul className="mt-2 text-[1rem] leading-6 text-ink-2">
                          {step.body.map((entry) => (
                            <li key={entry}>{entry}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
