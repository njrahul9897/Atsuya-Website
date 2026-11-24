import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { solutions, solutionBySlug, industriesForSolution, matchingUseCases, impactFor } from "@/content/solutions";
import { caseStudies } from "@/content/caseStudies";
import { home } from "@/content/home";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/hero/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button, ArrowLink } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/icons";
import { CaseStudyCard } from "@/components/ui/CaseStudyCard";
import { ProofStat } from "@/components/ui/ProofStat";
import { CTABand } from "@/components/ui/CTABand";
import { Accent } from "@/components/ui/rich";

export const dynamicParams = false;
export const generateStaticParams = () => solutions.map((solution) => ({ slug: solution.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return pageMeta(`/solutions/${slug}`);
}

const delay = (index: number) => ({ "--reveal-delay": `${index * 60}ms` }) as CSSProperties;

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = solutionBySlug(slug);
  if (!solution) notFound();

  const applies = industriesForSolution(solution.slug);
  const impact = impactFor(solution);
  const studies = caseStudies.filter((study) => study.solutions.includes(solution.slug)).slice(0, 3);

  return (
    <>
      <PageHero path={`/solutions/${solution.slug}`} next="paper-2" eyebrow={`Solution · ${solution.name}`} title={solution.headline} sub={solution.line}>
        <Button href="/book-assessment" size="lg">
          Book a site assessment
        </Button>
        <ArrowLink href="#how" direction="down">
          How AOne solves it
        </ArrowLink>
      </PageHero>

      {/* The problem */}
      <Section tone="paper-2" labelledBy="problem-title">
        <div className="container-x grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-6" data-reveal="">
            <h2 id="problem-title" className="t-h2 max-w-[30rem]">
              <Accent text={solution.problem.headline} />
            </h2>
          </div>
          <ul className="col-span-12 lg:col-span-5 lg:col-start-8">
            {solution.problem.points.map((point, index) => (
              <li key={point} className="flex gap-5 border-t border-line py-4 text-[1.0625rem] leading-7 text-ink last:border-b" data-reveal="" style={delay(index)}>
                <span className="t-label mt-1 text-ink-3">0{index + 1}</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* How AOne solves it */}
      <Section id="how" labelledBy="how-title">
        <div className="container-x">
          <SectionHeading id="how-title" title="How AOne *solves it.*" />
          <ul className="mt-12 grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {solution.how.map((block, index) => (
              <li key={block.title} className="border-t border-line pt-6 pb-10" data-reveal="" style={delay(index % 3)}>
                <h3 className="t-h3 flex items-center gap-3">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand" />
                  {block.title}
                </h3>
                <ul className="mt-3 space-y-1 text-[1.0625rem] leading-7 text-ink-2">
                  {block.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Industries it applies to */}
      <Section tone="paper-2" labelledBy="industries-title">
        <div className="container-x">
          <SectionHeading id="industries-title" title="Where it *applies.*" />
          <ul className="mt-12 lg:mt-16">
            {applies.map((industry, index) => {
              const useCases = matchingUseCases(solution, industry).slice(0, 5);
              return (
                <li key={industry.slug} className="border-t border-line last:border-b" data-reveal="" style={delay(index % 4)}>
                  <Link href={`/industries/${industry.slug}`} className="group grid-12 items-baseline gap-y-2 py-6 lg:py-7">
                    <span className="t-h3 col-span-11 lg:col-span-4">{industry.name}</span>
                    <ul className="col-span-12 text-[1.0625rem] leading-7 text-ink-2 lg:col-span-7">
                      {useCases.map((useCase) => (
                        <li key={useCase}>{useCase}</li>
                      ))}
                    </ul>
                    <ArrowRight className="col-span-1 col-start-12 row-start-1 justify-self-end text-brand-ink transition-transform duration-300 ease-soft group-hover:translate-x-1" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* Aggregated impact */}
      {impact.length ? (
        <Section tone="brand" labelledBy="impact-title">
          <div className="container-x">
            <SectionHeading id="impact-title" title="Measured *impact.*" lead="Typical results across deployments." />
            <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:mt-16 lg:grid-cols-4">
              {impact.slice(0, 8).map((item, index) => (
                <li key={`${item.industry}-${item.label}`} className="border-t border-line pt-6" data-reveal="" style={delay(index % 4)}>
                  <ProofStat value={item.value} label={item.label} source={`${item.industry} · typical`} size="lg" />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      {/* Related case studies */}
      {studies.length ? (
        <Section tone="paper" labelledBy="stories-title">
          <div className="container-x">
            <SectionHeading id="stories-title" title="Named *results.*" />
            <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
              {studies.map((study, index) => (
                <li key={study.slug} data-reveal="" style={delay(index)}>
                  <CaseStudyCard study={study} />
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <ArrowLink href="/customers">All customer stories</ArrowLink>
            </div>
          </div>
        </Section>
      ) : null}

      <CTABand headline={home.cta.headline} button={home.cta.button} line={home.cta.line} />
    </>
  );
}
