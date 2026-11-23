import Link from "next/link";
import { cn } from "@/lib/cn";
import type { CaseStudy } from "@/content/caseStudies";
import { industryBySlug } from "@/content/industries";
import { ArrowRight } from "./icons";
import { rich } from "./rich";

const ReadTheStory = () => (
  <span className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-brand-ink">
    <span className="underline decoration-transparent underline-offset-4 transition-colors duration-200 group-hover:decoration-current">Read the story</span>
    <ArrowRight className="transition-transform duration-300 ease-soft group-hover:translate-x-1" />
  </span>
);

const IndustryChip = ({ slug }: { slug: string }) => (
  <span className="inline-flex h-7 items-center rounded-full border border-line px-3 text-[0.8125rem] font-medium text-ink-2">{industryBySlug(slug)?.name}</span>
);

// Number first, then the customer, the industry chip and the link. Two sizes: the featured card
// is a dark, lit panel; standard cards are white with depth and a brand edge on hover.
export function CaseStudyCard({ study, size = "standard", className }: { study: CaseStudy; size?: "featured" | "standard"; className?: string }) {
  const href = `/customers/${study.slug}`;

  if (size === "featured") {
    const outcomes = study.keyOutcomes.filter((outcome) => outcome.value !== study.headline.value).slice(0, 4);
    return (
      <Link href={href} className={cn("dark-vars surface-dark card group flex h-full flex-col overflow-hidden !rounded-[1.5rem] p-8 lg:p-12", className)}>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <IndustryChip slug={study.industry} />
          {study.source ? <span className="t-label text-ink-3 sm:text-right">{study.customer} · {study.source.replace(/^Disclosed in .*?’s /, "").replace(/\.$/, "")}</span> : null}
        </div>
        <p className="t-stat-xl stat-grad mt-12 w-fit lg:mt-16 lg:!text-[5.5rem]">{rich(study.headline.value)}</p>
        <p className="t-h3 mt-3 text-ink">{study.headline.label}</p>
        <h3 className="mt-10 text-[1.0625rem] font-semibold text-ink">{study.customer}</h3>
        <p className="mt-2 max-w-[34rem] text-[1.0625rem] leading-7 text-ink-2">{study.title}</p>
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-8 sm:grid-cols-4">
          {outcomes.map((outcome) => (
            <div key={outcome.label}>
              <dt className="sr-only">{outcome.label}</dt>
              <dd>
                <span className="block text-[1.375rem] leading-7 font-semibold tracking-[-0.02em] text-ink">{rich(outcome.value)}</span>
                <span className="mt-1 block text-[0.875rem] leading-5 text-ink-2">{outcome.label}</span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto pt-10">
          <ReadTheStory />
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className={cn("card group relative flex h-full flex-col overflow-hidden p-6 lg:p-8", className)}>
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-soft group-hover:scale-x-100" />
      <p className="t-stat-lg stat-grad w-fit">{rich(study.headline.value)}</p>
      <p className="mt-2 text-[1.0625rem] leading-6 text-ink">{study.headline.label}</p>
      <div className="mt-auto pt-10">
        <h3 className="text-[1.0625rem] leading-6 font-semibold text-ink">{study.customer}</h3>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <IndustryChip slug={study.industry} />
          <ReadTheStory />
        </div>
      </div>
    </Link>
  );
}
