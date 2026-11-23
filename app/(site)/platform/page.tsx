import Link from "next/link";
import type { CSSProperties } from "react";
import { layers, platform } from "@/content/platform";
import { solutions } from "@/content/solutions";
import { home } from "@/content/home";
import { pageMeta } from "@/lib/seo";
import { scenes } from "@/components/iso/scenes";
import { ArchitectureSvg, architecturePercent, architectureZones } from "@/components/iso/Architecture";
import { PageHero } from "@/components/hero/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button, ArrowLink } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/icons";
import { CTABand } from "@/components/ui/CTABand";
import { IotMock, SquadMock, VisionMock, MockTbd } from "@/components/mockups/Mock";

export const metadata = pageMeta("/platform");

const delay = (index: number) => ({ "--reveal-delay": `${index * 60}ms` }) as CSSProperties;

// The hero: a static collage of the three product surfaces. Not a video.
function Collage() {
  const [iot, vision, squad] = layers;
  return (
    <div>
      <div className="grid grid-cols-12 items-start gap-4">
        <IotMock title={iot.capabilities[2].mock.title} rows={iot.capabilities[2].mock.rows} className="col-span-12 sm:col-span-7" />
        <div className="col-span-12 space-y-4 sm:col-span-5 sm:pt-12">
          <VisionMock title={vision.capabilities[1].mock.title} rows={vision.capabilities[1].mock.rows.slice(0, 2)} art={scenes.manufacturing.icon} />
          <SquadMock title={squad.capabilities[0].mock.title} rows={squad.capabilities[0].mock.rows.slice(0, 3)} />
        </div>
      </div>
      <MockTbd />
    </div>
  );
}

export default function PlatformPage() {
  const { hero, architecture, deployment, integrations } = platform;
  return (
    <>
      <PageHero path="/platform" next="paper-2" eyebrow={hero.eyebrow} title={hero.headline} sub={hero.sub} aside={<Collage />}>
        <Button href="/book-assessment" size="lg">
          Book a site assessment
        </Button>
        <ArrowLink href="#architecture" direction="down">
          See how it fits together
        </ArrowLink>
      </PageHero>

      {/* Architecture */}
      <Section id="architecture" tone="paper-2" labelledBy="architecture-title">
        <div className="container-x">
          <SectionHeading id="architecture-title" eyebrow="Architecture" title={architecture.headline} />
          <div className="grid-12 mt-12 items-center gap-y-10 lg:mt-16">
            <div className="relative col-span-12 lg:col-span-8">
              <ArchitectureSvg onPaper2 />
              {architectureZones.map((zone, index) => (
                <span key={zone.id} aria-hidden="true" className="t-label absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand bg-brand text-white" style={architecturePercent(zone.pad[0] + 5.55, zone.pad[1] + 5.55)}>
                  {index + 1}
                </span>
              ))}
            </div>
            <ol className="col-span-12 lg:col-span-4">
              {architecture.tiers.map((tier, index) => (
                <li key={tier.id} className="flex gap-5 border-t border-line py-6 last:border-b" data-reveal="" style={delay(index)}>
                  <span className="t-label mt-1 text-brand-ink">0{index + 1}</span>
                  <div>
                    <h3 className="t-h3">{tier.name}</h3>
                    <ul className="mt-2 text-[1.0625rem] leading-7 text-ink-2">
                      {tier.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* Three layers */}
      <Section labelledBy="layers-title">
        <div className="container-x">
          <SectionHeading id="layers-title" title={home.layers.headline} />
          <ul className="mt-12 lg:mt-16">
            {layers.map((layer, index) => (
              <li key={layer.slug} className="border-t border-line last:border-b" data-reveal="" style={delay(index)}>
                <Link href={`/platform/${layer.slug}`} className="group grid-12 items-baseline gap-y-3 py-8 transition-colors duration-200 hover:bg-paper-2 lg:px-4 lg:py-10">
                  <span className="t-label col-span-12 text-ink-3 lg:col-span-1">0{index + 1}</span>
                  <span className="t-h2 col-span-12 lg:col-span-4">{layer.name}</span>
                  <span className="col-span-11 text-[1.0625rem] leading-7 text-ink-2 lg:col-span-6">
                    {layer.line}
                    <span className="t-label mt-3 block text-ink-3">{layer.capabilities.map((capability) => capability.title).join(" · ")}</span>
                  </span>
                  <ArrowRight className="col-span-1 justify-self-end text-brand-ink transition-transform duration-300 ease-soft group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Six solutions */}
      <Section id="solutions" tone="paper-2" labelledBy="solutions-title">
        <div className="container-x">
          <SectionHeading id="solutions-title" eyebrow="Solutions" title="Six solutions, across every industry." />
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {solutions.map((solution, index) => (
              <li key={solution.slug} data-reveal="" style={delay(index % 3)}>
                <Link href={`/solutions/${solution.slug}`} className="card group flex h-full flex-col p-6 lg:p-8">
                  <span className="t-label text-brand-ink">0{index + 1}</span>
                  <span className="t-h3 mt-6">{solution.name}</span>
                  <span className="mt-2 text-[1.0625rem] leading-7 text-ink-2">{solution.line}</span>
                  <span className="mt-auto pt-8">
                    <ArrowRight className="text-brand-ink transition-transform duration-300 ease-soft group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Deployment */}
      <Section labelledBy="deployment-title">
        <div className="container-x">
          <SectionHeading id="deployment-title" eyebrow="Deployment" title={deployment.headline} />
          <ol className="mt-12 grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {deployment.steps.map((step, index) => (
              <li key={step.title} className="relative border-t border-line pt-6 pb-10" data-reveal="" style={delay(index)}>
                <span aria-hidden="true" className="absolute -top-[5px] left-0 h-[9px] w-[9px] rounded-full bg-brand" />
                <span className="t-label text-ink-3">Step {index + 1}</span>
                <h3 className="t-h3 mt-3">{step.title}</h3>
                <p className="mt-2 max-w-[18rem] text-[1.0625rem] leading-7 text-ink-2">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Integrations */}
      <Section spacing="band" tone="paper-2" labelledBy="integrations-title">
        <div className="container-x grid-12 items-center gap-y-6">
          <h2 id="integrations-title" className="t-h3 col-span-12 lg:col-span-5">
            {integrations.headline}
          </h2>
          <div className="col-span-12 lg:col-span-7">
            <ul className="flex flex-wrap gap-2">
              {integrations.items.map((item) => (
                <li key={item} className="inline-flex h-10 items-center rounded-full border border-line bg-paper px-4 text-[0.9375rem] font-medium text-ink">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              <span className="tbd">{integrations.tbd}</span>
            </p>
          </div>
        </div>
      </Section>

      <CTABand headline={home.cta.headline} button={home.cta.button} line={home.cta.line} />
    </>
  );
}
