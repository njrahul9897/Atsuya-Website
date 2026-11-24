import type { CSSProperties } from "react";
import { technology } from "@/content/company";
import { home } from "@/content/home";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/hero/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ArrowLink } from "@/components/ui/Button";
import { ProofStat } from "@/components/ui/ProofStat";
import { CTABand } from "@/components/ui/CTABand";
import { isGap } from "@/lib/tbd";
import { Accent } from "@/components/ui/rich";

export const metadata = pageMeta("/company/technology");

const delay = (index: number) => ({ "--reveal-delay": `${index * 60}ms` }) as CSSProperties;

export default function TechnologyPage() {
  const { patents, hardware, edge, security } = technology;
  return (
    <>
      <PageHero path="/company/technology" next="paper-2" eyebrow="Patents and technology" title={technology.headline} sub={technology.sub} size="h1" />

      {/* Patents */}
      <Section tone="paper-2" labelledBy="patents-title">
        <div className="container-x">
          <SectionHeading id="patents-title" title="*Patents.*" />
          <ul className="mt-12 lg:mt-16">
            {patents.map((patent) => (
              <li key={patent.number} className="dark-vars surface-dark grid-12 items-center gap-y-8 overflow-hidden rounded-[2rem] p-8 lg:p-14" data-reveal="">
                <div className="col-span-12 lg:col-span-7">
                  <p className="t-label text-brand-ink">{patent.number}</p>
                  <h3 className="t-h2 mt-5">{patent.title}</h3>
                  <p className="mt-4 max-w-[34rem] text-[1.0625rem] leading-7 text-ink-2">{patent.body}</p>
                  <div className="mt-8">
                    <ArrowLink href={patent.href}>Read the IndianOil story</ArrowLink>
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-4 lg:col-start-9">
                  <ProofStat value="2,400/hr" label="LPG cylinders profiled" source="IndianOil" size="xl" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Hardware */}
      <Section labelledBy="hardware-title">
        <div className="container-x">
          <SectionHeading id="hardware-title" title="The hardware *range.*" lead={hardware.intro} />
          <ul className="mt-12 grid grid-cols-1 gap-x-6 lg:mt-16 lg:grid-cols-3">
            {hardware.items.map((item, index) => (
              <li key={item.name} className="border-t border-line pt-6 pb-10" data-reveal="" style={delay(index)}>
                <h3 className="t-h3">{item.name}</h3>
                <p className="mt-3 text-[1.0625rem] leading-7 text-ink-2">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Edge AI and security */}
      <Section tone="paper-2" labelledBy="edge-title">
        <div className={`container-x grid grid-cols-1 gap-6 ${isGap(security.body) ? "" : "lg:grid-cols-2"}`}>
          <div className="card flex flex-col p-8 lg:p-12" data-reveal="">
            <p className="t-label text-brand-ink">Edge AI</p>
            <h2 id="edge-title" className="t-h2 mt-5">
              <Accent text={edge.title} />
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-7 text-ink-2">{edge.body}</p>
            <div className="mt-auto pt-8">
              <ArrowLink href={edge.href}>Read the story</ArrowLink>
            </div>
          </div>
          {isGap(security.body) ? null : (
            <div className="card flex flex-col p-8 lg:p-12" data-reveal="" style={delay(1)}>
              <p className="t-label text-ink-3">Security</p>
              <h2 className="t-h2 mt-5">{security.title}</h2>
              <p className="mt-4 text-[1.0625rem] leading-7 text-ink-2">{security.body}</p>
            </div>
          )}
        </div>
      </Section>

      <CTABand headline={home.cta.headline} button={home.cta.button} line={home.cta.line} />
    </>
  );
}
