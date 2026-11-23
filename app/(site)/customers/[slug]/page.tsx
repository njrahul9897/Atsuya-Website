import { notFound } from "next/navigation";
import { caseStudies, caseStudyBySlug } from "@/content/caseStudies";
import { pageMeta } from "@/lib/seo";
import { CaseStudyLayout } from "@/components/sections/CaseStudyLayout";

export const dynamicParams = false;
export const generateStaticParams = () => caseStudies.map((study) => ({ slug: study.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return pageMeta(`/customers/${slug}`);
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);
  if (!study) notFound();
  return <CaseStudyLayout study={study} />;
}
