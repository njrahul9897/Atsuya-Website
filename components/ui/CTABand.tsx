import Image from "next/image";
import type { CSSProperties } from "react";
import { home } from "@/content/home";
import { Button } from "./Button";
import { Accent } from "./rich";

// The closing call to action: a full-width dark band over real footage, running edge to edge into
// the footer. One headline, one button, one short line. Once per page, at the end.
export function CTABand({ headline, button, line, image = home.hero.video.poster }: { headline: string; button: { label: string; href: string }; line?: string; image?: string }) {
  return (
    <section className="on-dark dark-vars surface-dark glow-left" aria-labelledby="cta-band-title">
      <Image src={image} alt="" fill sizes="100vw" quality={70} className="-z-20 object-cover opacity-30" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(8,21,39,0.96)_20%,rgba(8,21,39,0.55)_100%)]" />
      <div className="container-x section-y">
        <div className="grid-12 items-end gap-y-10">
          <h2 id="cta-band-title" className="t-display col-span-12 lg:col-span-8" data-reveal="">
            <Accent text={headline} />
          </h2>
          <div className="col-span-12 lg:col-span-4 lg:justify-self-end lg:text-right" data-reveal="" style={{ "--reveal-delay": "60ms" } as CSSProperties}>
            <Button href={button.href} size="lg">
              {button.label}
            </Button>
            {line ? <p className="t-small mt-5 text-ink-2">{line}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
