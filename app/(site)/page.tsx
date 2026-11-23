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
import { Rail } from "@/components/sections/Rail";
import { IsoScene } from "@/components/sections/IsoScene";
import { SiteVector } from "@/components/iso/SiteVector";
import { FilterGrid, type FilterItem } from "@/components/sections/FilterGrid";
import { ProblemWipe } from "@/components/sections/home/ProblemWipe";
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
      <Section tone="dark" spacing="none" className="glow-none pt-6 pb-28 lg:pb-36">
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

      {/* 4. Industry selector */}
      <Section id="industries" tone="paper-2" sheet labelledBy="industries-title">
        <Rail label="industries" header={<SectionHeading id="industries-title" eyebrow="Eight industries" title={home.industries.headline} />}>
          {industries.map((industry) => (
            <li key={industry.slug} className="lg:w-[21.5rem] lg:shrink-0 lg:snap-start">
              <IndustryTile industry={industry} />
            </li>
          ))}
        </Rail>
      </Section>

      {/* 5. The problem */}
      <Section labelledBy="problem-title">
        <div className="container-x">
          <SectionHeading id="problem-title" eyebrow="The problem" title={problem.headline} />
          <div className="mt-12 lg:mt-16">
            <ProblemWipe />
          </div>
          <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-5">
            {problem.losses.map((loss, index) => (
              <li key={loss} className="rounded-card bg-paper-2 p-5" data-reveal="" style={delay(index)}>
                <span className="t-label text-brand-ink">0{index + 1}</span>
                <p className="mt-6 text-[1.0625rem] leading-6 font-medium text-ink">{loss}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 6. How AOne works */}
      <IsoScene id="how-aone-works" eyebrow="How AOne works" headline={how.headline} steps={how.steps} scene={{ kind: "home", art: <SiteVector /> }} />

      {/* 7. Three layers, one platform */}
      <Section sheet labelledBy="layers-title">
        <div className="container-x">
          <SectionHeading id="layers-title" eyebrow="The platform" title={home.layers.headline} />
          <div className="mt-12 lg:mt-16">
            <ThreeLayers layers={layers.map((layer) => ({ key: layer.key, name: layer.name, line: layer.line, href: `/platform/${layer.slug}` }))} />
          </div>
        </div>
      </Section>

      {/* 8. Proof */}
      <Section tone="paper-2" labelledBy="stories-title">
        <div className="container-x">
          <SectionHeading id="stories-title" eyebrow="Customer stories" title={stories.headline} lead={stories.lead} />
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
