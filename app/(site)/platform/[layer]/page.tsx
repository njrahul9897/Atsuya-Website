import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { layers, layerBySlug } from "@/content/platform";
import { industries } from "@/content/industries";
import { caseStudiesBySlugs } from "@/content/caseStudies";
import { home } from "@/content/home";
import { pageMeta } from "@/lib/seo";
import { scenes } from "@/components/iso/scenes";
import { LayerStack } from "@/components/iso/LayerStack";
import { PageHero } from "@/components/hero/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button, ArrowLink, Chip } from "@/components/ui/Button";
import { CaseStudyCard } from "@/components/ui/CaseStudyCard";
import { CTABand } from "@/components/ui/CTABand";
import { CapabilityList } from "@/components/sections/CapabilityList";
import { isGap } from "@/lib/tbd";

export const dynamicParams = false;
export const generateStaticParams = () => layers.map((layer) => ({ layer: layer.slug }));

export async function generateMetadata({ params }: { params: Promise<{ layer: string }> }) {
  const { layer } = await params;
  return pageMeta(`/platform/${layer}`);
}

const delay = (index: number) => ({ "--reveal-delay": `${index * 60}ms` }) as CSSProperties;

export default async function LayerPage({ params }: { params: Promise<{ layer: string }> }) {
  const { layer: slug } = await params;
  const layer = layerBySlug(slug);
  if (!layer) notFound();

  const studies = caseStudiesBySlugs(layer.caseStudies);
  const usedIn = industries.filter((industry) => industry.useCases[layer.key].length > 0);

  return (
    <>
      <PageHero path={`/platform/${layer.slug}`} next="paper-2" eyebrow={layer.aka ? `${layer.name} · ${layer.aka}` : layer.name} title={layer.hero.headline} sub={layer.hero.sub} aside={<LayerStack active={layer.key} className="mx-auto max-w-[20rem] lg:max-w-[22rem]" />}>
        <Button href="/book-assessment" size="lg">
          Book a site assessment
        </Button>
        <ArrowLink href="#capabilities" direction="down">
          What it does
        </ArrowLink>
      </PageHero>

      {/* What it does */}
      <Section id="capabilities" tone="paper-2" labelledBy="capabilities-title">
        <div className="container-x">
          <SectionHeading id="capabilities-title" title="What it *does.*" />
          <div className="mt-12 lg:mt-16">
            <CapabilityList layer={layer.key} capabilities={layer.capabilities.map((capability) => ({ ...capability, points: capability.points.filter((point) => !isGap(point)) }))} art={scenes.manufacturing.icon} />
          </div>
        </div>
      </Section>

      {/* Layer-specific notes: edge AI, patents */}
      {layer.notes ? (
        <Section labelledBy="notes-title">
          <div className="container-x">
            <h2 id="notes-title" className="sr-only">
              Edge AI and patented inspection
            </h2>
            <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {layer.notes.map((note, index) => (
                <li key={note.title} className="dark-vars surface-dark flex flex-col overflow-hidden rounded-[1.5rem] p-8 lg:p-12" data-reveal="" style={delay(index)}>
                  <p className="t-label text-brand-ink">{note.label}</p>
                  <h3 className="t-h2 mt-6 max-w-[24rem]">{note.title}</h3>
                  <p className="mt-4 max-w-[30rem] text-[1.0625rem] leading-7 text-ink-2">{note.body}</p>
                  {note.href ? (
                    <div className="mt-auto pt-8">
                      <ArrowLink href={note.href}>Read the story</ArrowLink>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      {/* Where it is used */}
      <Section spacing="band" tone={layer.notes ? "paper-2" : "paper"} labelledBy="used-title">
        <div className="container-x grid-12 items-center gap-y-6">
          <h2 id="used-title" className="t-h3 col-span-12 lg:col-span-4">
            Where it’s used
          </h2>
          <ul className="col-span-12 flex flex-wrap gap-2 lg:col-span-8">
            {usedIn.map((industry) => (
              <li key={industry.slug}>
                <Chip href={`/industries/${industry.slug}`} className="!h-10 bg-paper !px-4 !text-[0.9375rem]">
                  {industry.name}
                </Chip>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Proof */}
      <Section tone={layer.notes ? "paper" : "paper-2"} labelledBy="proof-title">
        <div className="container-x">
          <SectionHeading id="proof-title" title={`*${layer.name}* in the field.`} />
          {studies.length ? (
            <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
              {studies.map((study, index) => (
                <li key={study.slug} data-reveal="" style={delay(index)}>
                  <CaseStudyCard study={study} />
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-10">
            <ArrowLink href="/customers">All customer stories</ArrowLink>
          </div>
        </div>
      </Section>

      {/* The other layers */}
      <Section spacing="band" tone={layer.notes ? "paper-2" : "paper"}>
        <div className="container-x flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-label text-ink-3">The other layers</p>
          <ul className="flex flex-wrap gap-x-10 gap-y-3">
            {layers
              .filter((other) => other.slug !== layer.slug)
              .map((other) => (
                <li key={other.slug}>
                  <ArrowLink href={`/platform/${other.slug}`}>{other.name}</ArrowLink>
                </li>
              ))}
            <li>
              <Link href="/platform" className="link font-medium">
                How AOne works
              </Link>
            </li>
          </ul>
        </div>
      </Section>

      <CTABand headline={home.cta.headline} button={home.cta.button} line={home.cta.line} />
    </>
  );
}
