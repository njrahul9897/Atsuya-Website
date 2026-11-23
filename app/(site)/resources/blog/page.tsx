import Link from "next/link";
import type { CSSProperties } from "react";
import { posts } from "@/content/company";
import { home } from "@/content/home";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { CTABand } from "@/components/ui/CTABand";
import { ArrowRight } from "@/components/ui/icons";
import { rich } from "@/components/ui/rich";

export const metadata = pageMeta("/resources/blog");

export default function BlogPage() {
  return (
    <>
      <PageHero path="/resources/blog" title="Notes from the field." sub="What Atsuya’s engineers learn from machines, cold rooms, kitchens and buildings." />
      <Section spacing="none" className="pt-8 pb-16 lg:pt-12 lg:pb-26">
        <ul className="container-x">
          {posts.map((post, index) => (
            <li key={post.slug} className="border-t border-line last:border-b" data-reveal="" style={{ "--reveal-delay": `${index * 60}ms` } as CSSProperties}>
              <Link href={`/resources/blog/${post.slug}`} className="group grid-12 items-baseline gap-y-2 py-8 lg:py-10">
                <span className="t-label col-span-12 text-ink-3 lg:col-span-2">{rich(post.date)}</span>
                <span className="t-h2 col-span-12 lg:col-span-5">{rich(post.title)}</span>
                <span className="col-span-11 text-[1.0625rem] leading-7 text-ink-2 lg:col-span-4">{rich(post.summary)}</span>
                <ArrowRight className="col-span-1 justify-self-end text-brand-ink transition-transform duration-300 ease-soft group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <CTABand headline={home.cta.headline} button={home.cta.button} line={home.cta.line} />
    </>
  );
}
