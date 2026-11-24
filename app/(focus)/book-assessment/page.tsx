import { assessment } from "@/content/company";
import { industries } from "@/content/industries";
import { siteCounts, site } from "@/content/site";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { ProofStat } from "@/components/ui/ProofStat";
import { AssessmentForm } from "@/components/forms/AssessmentForm";
import { Accent } from "@/components/ui/rich";

export const metadata = pageMeta("/book-assessment");

export default function BookAssessmentPage() {
  return (
    <div className="container-x grid-12 gap-y-14 py-14 lg:py-24">
      <JsonLd data={breadcrumbJsonLd("/book-assessment")} />
      <div className="col-span-12 lg:col-span-5">
        <h1 className="t-h1">
          <Accent text={assessment.headline} />
        </h1>
        <p className="t-lead mt-6 max-w-[30rem] text-ink-2">{assessment.sub}</p>

        <h2 className="t-label mt-14 text-ink-3">What happens next</h2>
        <ol className="mt-4">
          {assessment.next.map((step, index) => (
            <li key={step.title} className="flex gap-5 border-t border-line py-5 last:border-b">
              <span className="t-label mt-1 text-brand-ink">0{index + 1}</span>
              <div>
                <h3 className="text-[1.0625rem] leading-7 font-semibold">{step.title}</h3>
                <p className="text-[1.0625rem] leading-7 text-ink-2">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <ProofStat value={assessment.proof.value} label={assessment.proof.label} source={assessment.proof.source} size="lg" />
        </div>
      </div>

      <div className="col-span-12 lg:col-span-6 lg:col-start-7">
        <div className="rounded-card border border-line p-6 lg:p-10">
          <AssessmentForm industries={industries.map((industry) => ({ value: industry.slug, label: industry.name }))} siteCounts={siteCounts} success={assessment.success} source="book-assessment" />
        </div>
        <p className="mt-6 text-[0.875rem] leading-5 text-ink-2">© 2026 {site.legalName}</p>
      </div>
    </div>
  );
}
