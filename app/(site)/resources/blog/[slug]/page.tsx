import { notFound } from "next/navigation";
import { posts, postBySlug } from "@/content/company";
import { home } from "@/content/home";
import { articleJsonLd, pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { ArrowLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { CTABand } from "@/components/ui/CTABand";
import { rich } from "@/components/ui/rich";

export const dynamicParams = false;
export const generateStaticParams = () => posts.map((post) => ({ slug: post.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Placeholder posts stay out of search results until they have real content.
  return { ...pageMeta(`/resources/blog/${slug}`), robots: { index: false } };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();
  const path = `/resources/blog/${post.slug}`;
  return (
    <article>
      <JsonLd data={articleJsonLd(path, post.title, "Operational intelligence")} />
      <PageHero path={path} eyebrow={post.date} title={post.title} sub={post.summary} size="h1" />
      <Section spacing="none" className="pt-12 pb-16 lg:pt-20 lg:pb-26">
        <div className="container-x">
          <div className="prose-plain max-w-[44rem] border-t border-line pt-10">
            {post.body.map((paragraph) => (
              <p key={paragraph}>{rich(paragraph)}</p>
            ))}
          </div>
          <div className="mt-12">
            <ArrowLink href="/resources/blog">All posts</ArrowLink>
          </div>
        </div>
      </Section>
      <CTABand headline={home.cta.headline} button={home.cta.button} line={home.cta.line} />
    </article>
  );
}
