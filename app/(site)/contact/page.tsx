import { site, siteCounts } from "@/content/site";
import { industries } from "@/content/industries";
import { assessment } from "@/content/company";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { AssessmentForm } from "@/components/forms/AssessmentForm";
import { rich } from "@/components/ui/rich";

export const metadata = pageMeta("/contact");

export default function ContactPage() {
  const { contact } = site;
  return (
    <>
      <PageHero path="/contact" title="Talk to an AOne engineer." sub="Tell us about your sites. An Atsuya engineer will reply within one working day." />
      <Section spacing="none" className="pt-12 pb-16 lg:pt-20 lg:pb-26">
        <div className="container-x grid-12 gap-y-16">
          {/* Left: the form */}
          <div className="card col-span-12 p-6 lg:col-span-6 lg:p-10">
            <AssessmentForm industries={industries.map((industry) => ({ value: industry.slug, label: industry.name }))} siteCounts={siteCounts} success={assessment.success} source="contact" submitLabel="Send" />
          </div>

          {/* Right: contact details */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <dl>
              {[
                { label: "Email", value: contact.email },
                { label: "Phone", value: contact.phone },
                { label: "Office", value: contact.address },
              ].map((row) => (
                <div key={row.label} className="flex items-baseline gap-6 border-t border-line py-5">
                  <dt className="t-label w-20 shrink-0 text-ink-3">{row.label}</dt>
                  <dd className="text-[1.0625rem] leading-7">{rich(row.value)}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex aspect-[16/10] items-center justify-center rounded-card bg-paper-2">
              <span className="tbd">[TBD: map embed for the office address]</span>
            </div>
            <dl className="mt-8">
              {contact.lines.map((line) => (
                <div key={line.label} className="flex items-baseline gap-6 border-t border-line py-4 last:border-b">
                  <dt className="t-label w-20 shrink-0 text-ink-3">{line.label}</dt>
                  <dd className="text-[1.0625rem] leading-7">{rich(line.value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>
    </>
  );
}
