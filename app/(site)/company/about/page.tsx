import type { CSSProperties } from "react";
import { about } from "@/content/company";
import { industries } from "@/content/industries";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/hero/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProofStat } from "@/components/ui/ProofStat";
import { Chip } from "@/components/ui/Button";
import { CTABand } from "@/components/ui/CTABand";
import { isGap } from "@/lib/tbd";

export const metadata = pageMeta("/company/about");

const delay = (index: number) => ({ "--reveal-delay": `${index * 60}ms` }) as CSSProperties;

export default function AboutPage() {
  return (
    <>
      {/* 1. Headline */}
      <PageHero path="/company/about" next="paper-2" eyebrow="About Atsuya" title={about.headline} sub={about.sub} />

      {/* 2. The story (shown once it is written: content/company.ts → about.story) */}
      {isGap(about.story) ? null : (
        <Section tone="paper-2" labelledBy="story-title">
          <div className="container-x grid-12 gap-y-8">
            <h2 id="story-title" className="t-h2 col-span-12 lg:col-span-4" data-reveal="">
              The story
            </h2>
            <div className="col-span-12 lg:col-span-7 lg:col-start-6" data-reveal="">
              <p className="t-lead text-ink-2">{about.story}</p>
            </div>
          </div>
        </Section>
      )}

      {/* 3. What Atsuya believes */}
      <Section labelledBy="beliefs-title">
        <div className="container-x">
          <SectionHeading id="beliefs-title" title="What Atsuya believes." />
          <ol className="mt-12 lg:mt-16">
            {about.principles.map((principle, index) => (
              <li key={principle.title} className="grid-12 items-baseline gap-y-3 border-t border-line py-8 last:border-b lg:py-10" data-reveal="" style={delay(index)}>
                <span className="t-label col-span-12 text-ink-3 lg:col-span-1">0{index + 1}</span>
                <h3 className="t-h2 col-span-12 lg:col-span-6">{principle.title}</h3>
                <p className="col-span-12 text-[1.0625rem] leading-7 text-ink-2 lg:col-span-5">{principle.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 4. Footprint */}
      <Section tone="paper-2" labelledBy="footprint-title">
        <div className="container-x grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-5">
            <h2 id="footprint-title" className="t-h2" data-reveal="">
              Footprint
            </h2>
            <ProofStat value={about.footprint.value} label={about.footprint.label} size="xl" className="mt-10" />
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7" data-reveal="">
            <p className="t-label text-ink-3">Eight industries, one stack</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {industries.map((industry) => (
                <li key={industry.slug}>
                  <Chip href={`/industries/${industry.slug}`} className="!h-10 bg-paper !px-4 !text-[0.9375rem]">
                    {industry.name}
                  </Chip>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 5. Leadership: added once names, roles and photographs are in (content/company.ts → leadershipTbd). */}

      <CTABand headline="Help make physical operations visible." button={{ label: "See careers", href: "/company/careers" }} />
    </>
  );
}
