import type { CSSProperties } from "react";
import type { CaseStudy } from "@/content/caseStudies";
import { caseStudies } from "@/content/caseStudies";
import { industryBySlug } from "@/content/industries";
import { solutionBySlug } from "@/content/solutions";
import { layerByKey } from "@/content/platform";
import { articleJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/hero/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProofStat } from "@/components/ui/ProofStat";
import { CaseStudyCard } from "@/components/ui/CaseStudyCard";
import { Chip, ArrowLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { CTABand } from "@/components/ui/CTABand";
import { ImpactBand } from "./ImpactBand";

const delay = (index: number) => ({ "--reveal-delay": `${index * 60}ms` }) as CSSProperties;

// Related studies: the same industry first, then any that share a solution.
function related(study: CaseStudy): CaseStudy[] {
  const others = caseStudies.filter((other) => other.slug !== study.slug);
  const sameIndustry = others.filter((other) => other.industry === study.industry);
  const sameSolution = others.filter((other) => other.industry !== study.industry && other.solutions.some((solution) => study.solutions.includes(solution)));
  return [...sameIndustry, ...sameSolution].slice(0, 3);
}

// Challenge → solution → impact in three columns, a key-outcomes band, the source citation
// where one exists, then related studies.
export function CaseStudyLayout({ study }: { study: CaseStudy }) {
  const path = `/customers/${study.slug}`;
  const industry = industryBySlug(study.industry)!;
  const columns = [
    { title: "The challenge", items: study.challenge },
    { title: "The AOne solution", items: study.solution },
    { title: "Impact", items: study.impact },
  ];

  return (
    <article>
      <JsonLd data={articleJsonLd(path, `${study.customer}: ${study.title}`, industry.name)} />

      <PageHero
        path={path}
        eyebrow={`Case study · ${study.sector}`}
        title={study.customer}
        sub={study.title}
        aside={
          <div className="rounded-[1.5rem] border border-line bg-white/[0.05] p-8 shadow-glow lg:ml-auto lg:max-w-[26rem] lg:p-10">
            <ProofStat value={study.headline.value} label={study.headline.label} source={study.source ? study.source.replace(/\.$/, "") : `${study.customer} · ${industry.name}`} size="xl" />
          </div>
        }
      >
        <ul className="flex flex-wrap gap-2">
          <li>
            <Chip href={`/industries/${industry.slug}`}>{industry.name}</Chip>
          </li>
          {study.layers.map((key) => {
            const layer = layerByKey(key);
            return (
              <li key={key}>
                <Chip href={`/platform/${layer.slug}`}>{layer.name}</Chip>
              </li>
            );
          })}
          {study.solutions.map((slug) => {
            const solution = solutionBySlug(slug);
            return solution ? (
              <li key={slug}>
                <Chip href={`/solutions/${slug}`}>{solution.name}</Chip>
              </li>
            ) : null;
          })}
        </ul>
      </PageHero>

      {/* Challenge → solution → impact */}
      <Section spacing="none" className="pt-12 pb-16 lg:pt-20 lg:pb-26">
        <div className="container-x grid grid-cols-1 gap-5 lg:grid-cols-3">
          {columns.map((column, index) => (
            <section key={column.title} aria-labelledby={`column-${index}`} className="card p-6 lg:p-8" data-reveal="" style={delay(index)}>
              <p className="t-label text-brand-ink">0{index + 1}</p>
              <h2 id={`column-${index}`} className="t-h3 mt-2">
                {column.title}
              </h2>
              <ul className="mt-6">
                {column.items.map((item) => (
                  <li key={item} className="border-t border-line py-4 text-[1.0625rem] leading-7 text-ink-2">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>

      {/* Key outcomes */}
      <Section tone="brand" labelledBy="outcomes-title">
        <div className="container-x">
          <SectionHeading id="outcomes-title" title="Key outcomes." />
          <ImpactBand items={study.keyOutcomes} className="mt-12 lg:mt-16" />
          {study.source ? (
            <p className="t-label mt-12 border-t border-line pt-6 text-ink-2" data-reveal="">
              Source · {study.source}
            </p>
          ) : null}
          {!study.named ? (
            <p className="t-label mt-12 border-t border-line pt-6 text-ink-2" data-reveal="">
              Customer name withheld
            </p>
          ) : null}
        </div>
      </Section>

      {/* Related studies */}
      <Section tone="paper-2" labelledBy="related-title">
        <div className="container-x">
          <SectionHeading id="related-title" title="Related stories." />
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {related(study).map((other, index) => (
              <li key={other.slug} data-reveal="" style={delay(index)}>
                <CaseStudyCard study={other} />
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <ArrowLink href="/customers">All customer stories</ArrowLink>
          </div>
        </div>
      </Section>

      <CTABand headline={`Find the savings already sitting in your ${industry.siteNoun}.`} button={{ label: industry.cta, href: `/book-assessment?industry=${industry.slug}` }} line="A 30-minute call with an AOne engineer. No slideware." />
    </article>
  );
}
