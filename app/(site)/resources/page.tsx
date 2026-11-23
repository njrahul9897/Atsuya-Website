import Link from "next/link";
import type { CSSProperties } from "react";
import { resources, posts } from "@/content/company";
import { home } from "@/content/home";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/hero/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ArrowLink, Button } from "@/components/ui/Button";
import { CTABand } from "@/components/ui/CTABand";
import { rich } from "@/components/ui/rich";

export const metadata = pageMeta("/resources");

const delay = (index: number) => ({ "--reveal-delay": `${index * 60}ms` }) as CSSProperties;

export default function ResourcesPage() {
  return (
    <>
      <PageHero path="/resources" title="Resources" sub={resources.sub} />

      {/* The estimator, the one working tool here */}
      <Section spacing="none" className="pt-10 pb-16 lg:pt-16 lg:pb-26">
        <div className="container-x">
          <div className="surface-brand grid-12 items-end gap-y-8 overflow-hidden rounded-[2rem] p-8 lg:p-14" data-reveal="">
            <div className="col-span-12 lg:col-span-8">
              <h2 className="t-h2 max-w-[34rem]">A typical savings range for your sites, in three inputs.</h2>
              <p className="mt-4 max-w-[34rem] text-[1.0625rem] leading-7 text-ink-2">Industry, number of sites and monthly electricity bill. The range comes from typical AOne deployments in your industry.</p>
            </div>
            <div className="col-span-12 lg:col-span-4 lg:justify-self-end">
              <Button href="/resources/savings-estimator" size="lg">
                Open the estimator
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Guides and reports */}
      <Section tone="paper-2" labelledBy="guides-title">
        <div className="container-x">
          <SectionHeading id="guides-title" title="Guides and reports." />
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16">
            {resources.guides.map((guide, index) => (
              <li key={guide.kind} className="card flex flex-col p-6 lg:p-8" data-reveal="" style={delay(index)}>
                <p className="t-label text-ink-3">{guide.kind}</p>
                <h3 className="t-h3 mt-6">{rich(guide.title)}</h3>
                <p className="mt-3 text-[1.0625rem] leading-7 text-ink-2">{rich(guide.body)}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Blog */}
      <Section labelledBy="blog-title">
        <div className="container-x">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading id="blog-title" title="From the blog." />
            <ArrowLink href="/resources/blog" className="hidden shrink-0 sm:inline-flex">
              All posts
            </ArrowLink>
          </div>
          <ul className="mt-12 lg:mt-16">
            {posts.map((post, index) => (
              <li key={post.slug} className="border-t border-line last:border-b" data-reveal="" style={delay(index)}>
                <Link href={`/resources/blog/${post.slug}`} className="group grid-12 items-baseline gap-y-2 py-6 lg:py-8">
                  <span className="t-label col-span-12 text-ink-3 lg:col-span-2">{rich(post.date)}</span>
                  <span className="t-h3 col-span-12 lg:col-span-5">{rich(post.title)}</span>
                  <span className="col-span-12 text-[1.0625rem] leading-7 text-ink-2 lg:col-span-5">{rich(post.summary)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CTABand headline={home.cta.headline} button={home.cta.button} line={home.cta.line} />
    </>
  );
}
