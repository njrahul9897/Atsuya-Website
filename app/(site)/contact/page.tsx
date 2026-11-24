import { site, siteCounts } from "@/content/site";
import { industries } from "@/content/industries";
import { assessment } from "@/content/company";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { AssessmentForm } from "@/components/forms/AssessmentForm";
import { rich } from "@/components/ui/rich";
import { isGap } from "@/lib/tbd";

export const metadata = pageMeta("/contact");

export default function ContactPage() {
  const { contact } = site;
  // Contact details still to come ([TBD] in content/site.ts) are left out, not shown as gaps.
  const details = [
    { label: "Email", value: contact.email },
    { label: "Phone", value: contact.phone },
    { label: "Office", value: contact.address },
  ].filter((row) => !isGap(row.value));
  const lines = contact.lines.filter((line) => !isGap(line.value));
  const aside = details.length > 0 || lines.length > 0; // without any details, the form sits centred on its own
  return (
    <>
      <PageHero path="/contact" title="Talk to an AOne engineer." sub="Tell us about your sites. An Atsuya engineer will reply within one working day." />
      <Section spacing="none" className="pt-12 pb-16 lg:pt-20 lg:pb-26">
        <div className="container-x grid-12 gap-y-16">
          {/* Left: the form */}
          <div className={`card col-span-12 p-6 lg:p-10 ${aside ? "lg:col-span-6" : "lg:col-span-8 lg:col-start-3"}`}>
            <AssessmentForm industries={industries.map((industry) => ({ value: industry.slug, label: industry.name }))} siteCounts={siteCounts} success={assessment.success} source="contact" submitLabel="Send" />
          </div>

          {/* Right: contact details */}
          {aside ? (
            <div className="col-span-12 lg:col-span-5 lg:col-start-8">
              {details.length ? (
                <dl className="mb-8">
                  {details.map((row) => (
                    <div key={row.label} className="flex items-baseline gap-6 border-t border-line py-5">
                      <dt className="t-label w-20 shrink-0 text-ink-3">{row.label}</dt>
                      <dd className="text-[1.0625rem] leading-7">{rich(row.value)}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {/* [TBD: map embed for the office address] */}
              {lines.length ? (
                <dl>
                  {lines.map((line) => (
                    <div key={line.label} className="flex items-baseline gap-6 border-t border-line py-4 last:border-b">
                      <dt className="t-label w-20 shrink-0 text-ink-3">{line.label}</dt>
                      <dd className="text-[1.0625rem] leading-7">{rich(line.value)}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          ) : null}
        </div>
      </Section>
    </>
  );
}
