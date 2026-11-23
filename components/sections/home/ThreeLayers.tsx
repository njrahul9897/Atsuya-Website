"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";
import { useNearViewport } from "@/lib/hooks";
import { LayerStack, PLATE_GAP } from "@/components/iso/LayerStack";
import { U } from "@/components/iso/kit";
import { ArrowRight } from "@/components/ui/icons";

type LayerCard = { key: string; name: string; line: string; href: string };

// Three stacked plates that separate on scroll like an exploded diagram, each beside the card
// for its layer. Bottom to top: AOne IoT, Vision AI, BluSquad.
export function ThreeLayers({ layers }: { layers: LayerCard[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const near = useNearViewport(root);

  useGSAP(
    () => {
      if (!near) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        // The drawing is the exploded state; start from a closed stack and open with scroll.
        const closed = (PLATE_GAP - 1.5) * U;
        const plates = gsap.utils.toArray<SVGGElement>("[data-plate]", root.current);
        gsap.fromTo(plates, { y: (index) => index * closed }, { y: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top 78%", end: "center 52%", scrub: 0.6 } });
      });
      return () => media.revert();
    },
    { scope: root, dependencies: [near] },
  );

  return (
    <div ref={root} className="grid-12 items-center gap-y-12">
      <div className="col-span-12 lg:col-span-6">
        <div className="dark-vars surface-dark glow-left overflow-hidden rounded-[2rem] px-6 py-10 lg:px-10 lg:py-14">
          <LayerStack className="mx-auto max-w-[20rem] lg:max-w-[23rem]" active={hover} />
        </div>
      </div>
      <ol className="col-span-12 flex flex-col gap-3 lg:col-span-5 lg:col-start-8 lg:flex-col-reverse lg:gap-4">
        {layers.map((layer, index) => (
          <li key={layer.key} data-reveal="" style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}>
            <Link
              href={layer.href}
              onPointerEnter={() => setHover(layer.key)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(layer.key)}
              onBlur={() => setHover(null)}
              className={cn("card group flex items-start gap-5 p-6 lg:p-7")}
            >
              <span className="t-label mt-1.5 text-ink-3">0{index + 1}</span>
              <span className="flex-1">
                <span className="t-h3 block">{layer.name}</span>
                <span className="mt-2 block text-[1.0625rem] leading-7 text-ink-2">{layer.line}</span>
              </span>
              <ArrowRight className="mt-2 text-brand-ink transition-transform duration-300 ease-soft group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
