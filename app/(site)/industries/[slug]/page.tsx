import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { industries, industryBySlug } from "@/content/industries";
import { caseStudiesBySlugs } from "@/content/caseStudies";
import { layers } from "@/content/platform";
import { solutionBySlug } from "@/content/solutions";
import type { MockRow } from "@/content/platform";
import { pageMeta } from "@/lib/seo";
import { scenes } from "@/components/iso/scenes";
import { HeroVideo } from "@/components/hero/HeroVideo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProofStat } from "@/components/ui/ProofStat";
import { ChallengeCard } from "@/components/ui/ChallengeCard";
import { CaseStudyCard } from "@/components/ui/CaseStudyCard";
import { CTABand } from "@/components/ui/CTABand";
import { ArrowLink, Chip } from "@/components/ui/Button";
import { IsoScene } from "@/components/sections/IsoScene";
import { LayerTabs, type LayerTab } from "@/components/sections/LayerTabs";
import { ImpactBand } from "@/components/sections/ImpactBand";

export const dynamicParams = false;
export const generateStaticParams = () => industries.map((industry) => ({ slug: industry.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return pageMeta(`/industries/${slug}`);
}

const delay = (index: number) => ({ "--reveal-delay": `${index * 60}ms` }) as CSSProperties;

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = industryBySlug(slug);
  if (!industry) notFound();

  const path = `/industries/${industry.slug}`;
  const studies = caseStudiesBySlugs(industry.caseStudies);
  const [featured, ...rest] = studies;
  const standard = rest.slice(0, 2);
  const related = industry.solutions.map((entry) => solutionBySlug(entry)).filter((entry) => entry !== undefined);

  // Illustrative mock-up rows, labelled with this industry's own zones and use cases.
  const mockRows: Record<LayerTab["key"], MockRow[]> = {
    iot: industry.zones.slice(0, 4).map((zone, index) => ({ label: zone.name, value: index === 1 ? "Check" : "Normal", status: index === 1 ? "warn" : "ok" })),
    vision: industry.useCases.vision.slice(0, 3).map((useCase, index) => ({ label: useCase, value: index === 1 ? "Flagged" : "OK", status: index === 1 ? "alert" : "ok" })),
    blusquad: [
      { label: "Alert picked up", value: industry.zones[0].name, status: "ok" },
      { label: "BluSquad engineer assigned", status: "ok" },
      { label: "Resolved and logged", status: "live" },
    ],
  };
  const tabs: LayerTab[] = layers.map((layer) => ({
    key: layer.key,
    name: layer.name,
    line: layer.line,
    href: `/platform/${layer.slug}`,
    bullets: industry.useCases[layer.key],
    mock: { title: `${industry.name} · ${layer.key === "blusquad" ? "Alert timeline" : "Live"}`, rows: mockRows[layer.key] },
  }));

  return (
    <>
      {/* 1. Hero video */}
      <HeroVideo
        {...industry.video}
        eyebrow={industry.name}
        headline={industry.promise}
        sub={industry.sub}
        primaryCta={{ label: industry.cta, href: `/book-assessment?industry=${industry.slug}` }}
        secondaryCta={{ label: `See AOne across your ${industry.siteNoun}`, href: "#operation-map", direction: "down" }}
        breadcrumb={<Breadcrumbs path={path} tone="dark" />}
        next="paper-2"
      >
        <div className="inline-block max-w-full rounded-[1.25rem] bg-paper px-6 py-5 text-ink shadow-hover">
          <ProofStat value={industry.heroStat.value} label={industry.heroStat.label} source={industry.heroStat.source} size="lg" />
        </div>
      </HeroVideo>

      {/* 2. Challenges */}
      <Section tone="paper-2" spacing="none" className="pt-14 pb-16 lg:pt-24 lg:pb-26" labelledBy="challenges-title">
        <div className="container-x">
          <SectionHeading id="challenges-title" title="What gets *in the way.*" />
          <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {industry.challenges.map((challenge, index) => (
              <ChallengeCard key={challenge.title} title={challenge.title} points={challenge.points} index={index} />
            ))}
          </ul>
        </div>
      </Section>

      {/* 3. The operation map */}
      <IsoScene
        id="operation-map"
        headline={`AOne across your *${industry.siteNoun}.*`}
        steps={industry.zones.map((zone) => ({ id: zone.id, name: zone.name, body: zone.useCases }))}
        scene={{ kind: "zones", art: scenes[industry.slug], title: `Isometric map of a ${industry.siteNoun} with ${industry.zones.length} monitored zones: ${industry.zones.map((zone) => zone.name).join(", ")}.` }}
      />

      {/* 4. Use cases by layer */}
      <Section sheet labelledBy="layers-title">
        <div className="container-x">
          <SectionHeading id="layers-title" title="Use cases by *layer.*" />
          <div className="mt-10 lg:mt-12">
            <LayerTabs tabs={tabs} art={scenes[industry.slug].icon} />
          </div>
        </div>
      </Section>

      {/* 5. Measurable impact */}
      <Section tone="brand" labelledBy="impact-title">
        <div className="container-x">
          <SectionHeading id="impact-title" title="Measurable *impact.*" lead="Typical results across deployments." />
          <ImpactBand items={industry.impact} className="mt-12 lg:mt-16" />
        </div>
      </Section>

      {/* 6. Customer stories */}
      <Section id="stories" labelledBy="stories-title">
        <div className="container-x">
          <SectionHeading id="stories-title" title={studies.length ? "Customer *stories.*" : "Proven *results.*"} />
          {featured ? (
            <ul className="mt-12 grid grid-cols-1 gap-5 lg:mt-16 lg:grid-cols-3">
              <li className={standard.length ? "lg:col-span-2 lg:row-span-2" : "lg:col-span-3"} data-reveal="">
                <CaseStudyCard study={featured} size="featured" />
              </li>
              {standard.map((study, index) => (
                <li key={study.slug} data-reveal="" style={delay(index + 1)}>
                  <CaseStudyCard study={study} />
                </li>
              ))}
            </ul>
          ) : null}
          {industry.proofPoints ? (
            <ul className={featured ? "mt-10" : "mt-12 lg:mt-16"}>
              {industry.proofPoints.map((point, index) => (
                <li key={point} className="t-label mb-3 flex gap-4 rounded-card bg-paper-2 px-5 py-4 text-ink" data-reveal="" style={delay(index)}>
                  <span className="text-brand-ink">0{index + 1}</span>
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-10">
            <ArrowLink href="/customers">All customer stories</ArrowLink>
          </div>
        </div>
      </Section>

      {/* 7. Sub-sectors (manufacturing only) */}
      {industry.subSectors ? (
        <Section id="sub-sectors" tone="paper-2" labelledBy="sub-sectors-title">
          <div className="container-x">
            <SectionHeading id="sub-sectors-title" title={`${industry.subSectors.length} sub-sectors, one stack.`} />
            <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
              {industry.subSectors.map((sector, index) => (
                <li key={sector.id} id={sector.id} className="card card-hover flex scroll-mt-28 flex-col p-6 lg:p-8" data-reveal="" style={delay(index % 3)}>
                  <h3 className="t-h3">{sector.name}</h3>
                  <ul className="mt-4 space-y-1 text-[1.0625rem] leading-7 text-ink-2">
                    {sector.focus.map((focus) => (
                      <li key={focus}>{focus}</li>
                    ))}
                  </ul>
                  <p className="t-label mt-auto border-t border-line pt-5 text-brand-ink [margin-block-start:2rem]">{sector.proof}</p>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      {/* 8. Related solutions */}
      <Section spacing="band" tone={industry.subSectors ? "paper" : "paper-2"} labelledBy="solutions-title">
        <div className="container-x flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <h2 id="solutions-title" className="t-h3">
            Related solutions
          </h2>
          <ul className="flex flex-wrap gap-2">
            {related.map((solution) => (
              <li key={solution.slug}>
                <Chip href={`/solutions/${solution.slug}`} className="!h-10 !px-4 !text-[0.9375rem] bg-paper">
                  {solution.name}
                </Chip>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 9. Closing CTA */}
      <CTABand headline={`Find the *savings* already sitting in your ${industry.siteNoun}.`} button={{ label: industry.cta, href: `/book-assessment?industry=${industry.slug}` }} line="A 30-minute call with an AOne engineer. No slideware." />
    </>
  );
}
