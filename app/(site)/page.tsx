import type { CSSProperties } from "react";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { industries, industryBySlug } from "@/content/industries";
import { caseStudiesBySlugs, caseStudyBySlug } from "@/content/caseStudies";
import { layers } from "@/content/platform";
import { pageMeta } from "@/lib/seo";
import { HeroVideo } from "@/components/hero/HeroVideo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProofStat } from "@/components/ui/ProofStat";
import { LogoWall } from "@/components/ui/LogoWall";
import { IndustryTile } from "@/components/ui/IndustryTile";
import { CaseStudyCard } from "@/components/ui/CaseStudyCard";
import { CTABand } from "@/components/ui/CTABand";
import { ArrowLink } from "@/components/ui/Button";
import { IsoScene } from "@/components/sections/IsoScene";
import { SiteVector } from "@/components/iso/SiteVector";
import { FilterGrid, type FilterItem } from "@/components/sections/FilterGrid";
import { NightShift } from "@/components/sections/home/NightShift";
import { NightVector } from "@/components/iso/NightVector";
import { ThreeLayers } from "@/components/sections/home/ThreeLayers";
import { Impact } from "@/components/sections/home/Impact";

export const metadata = pageMeta("/");

const delay = (index: number) => ({ "--reveal-delay": `${index * 60}ms` }) as CSSProperties;

export default function HomePage() {
  const { hero, proof, problem, how, stories, cta } = home;

  const featured = caseStudyBySlug(stories.featured)!;
  const standard = caseStudiesBySlugs(stories.standard);
  const storyItems: FilterItem[] = [
    { id: featured.slug, tags: { industry: [featured.industry] }, className: "md:col-span-2 lg:row-span-2", node: <CaseStudyCard study={featured} size="featured" /> },
    ...standard.map((study) => ({ id: study.slug, tags: { industry: [study.industry] }, node: <CaseStudyCard study={study} /> })),
  ];
  const storyIndustries = [...new Set([featured, ...standard].map((study) => study.industry))].map((slug) => ({ value: slug, label: industryBySlug(slug)!.name }));

  return (
    <>
      {/* 1. Hero */}
      <HeroVideo {...hero.video} variant="statement" headline={hero.headline} primaryCta={site.cta} next="dark" />

      {/* 2. Proof band and 3. logo wall, on the dark surface the hero fades into */}
      <Section tone="dark" spacing="none" className="glow-none pt-6 pb-20 lg:pb-28">
        <div className="container-x">
          <h2 className="sr-only">AOne in numbers</h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {proof.map((stat, index) => (
              <li key={stat.label} className="rounded-[1.25rem] border border-line bg-white/[0.04] p-6 backdrop-blur-sm lg:p-7" data-reveal="" style={delay(index)}>
                <ProofStat value={stat.value} label={stat.label} source={stat.source} size="xl" />
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-16 lg:mt-20">
          <h2 className="sr-only">Customers</h2>
          <LogoWall label={home.logoWall.label} />
        </div>
      </Section>

      {/* 4. Industry selector: all eight in two rows of four (two columns on phones) */}
      <Section id="industries" tone="paper-2" sheet labelledBy="industries-title">
        <div className="container-x">
          <SectionHeading id="industries-title" title={home.industries.headline} />
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-12 lg:grid-cols-4 lg:gap-5">
            {industries.map((industry, index) => (
              <li key={industry.slug} data-reveal="" style={delay(index % 4)}>
                <IndustryTile industry={industry} />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 5. The problem: what goes unheard (left), and a night shift that AOne watches (right) */}
      <Section labelledBy="problem-title">
        <div className="container-x grid-12 items-center gap-y-12">
          <div className="col-span-12 lg:col-span-5" data-reveal="">
            <h2 id="problem-title" className="t-h2">
              {problem.headline} <span className="accent block">{problem.answer}</span>
            </h2>
            <p className="t-lead mt-6 text-ink-2">{problem.lead}</p>
            <ol className="mt-8 border-b border-line">
              {problem.losses.map((loss, index) => (
                <li key={loss} className="flex items-baseline gap-4 border-t border-line py-3.5 text-[1.0625rem] leading-6 font-medium text-ink">
                  <span className="t-label w-6 shrink-0 text-brand-ink">0{index + 1}</span>
                  {loss}
                </li>
              ))}
            </ol>
          </div>
          <div className="col-span-12 lg:col-span-7" data-reveal="" style={delay(1)}>
            <NightShift copy={problem.night} art={<NightVector label={problem.night.description} />} />
          </div>
        </div>
      </Section>

      {/* 6. How AOne works */}
      <IsoScene id="how-aone-works" headline={how.headline} steps={how.steps} scene={{ kind: "home", art: <SiteVector /> }} />

      {/* 7. Three layers, one platform */}
      <Section sheet labelledBy="layers-title">
        <div className="container-x">
          <SectionHeading id="layers-title" title={home.layers.headline} />
          <div className="mt-12 lg:mt-16">
            <ThreeLayers layers={layers.map((layer) => ({ key: layer.key, name: layer.name, line: layer.line, href: `/platform/${layer.slug}` }))} />
          </div>
        </div>
      </Section>

      {/* 8. Proof */}
      <Section tone="paper-2" labelledBy="stories-title">
        <div className="container-x">
          <SectionHeading id="stories-title" title={stories.headline} lead={stories.lead} />
          <div className="mt-10 lg:mt-12">
            <FilterGrid groups={[{ key: "industry", label: "Industry", options: storyIndustries }]} items={storyItems} gridClassName="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" />
          </div>
          <div className="mt-12">
            <ArrowLink href={stories.link.href}>{stories.link.label}</ArrowLink>
          </div>
        </div>
      </Section>

      {/* 9. Our impact */}
      <Impact {...home.impact} />

      {/* 10. Closing CTA */}
      <CTABand headline={cta.headline} button={cta.button} line={cta.line} />
    </>
  );
}
