import { careers as content } from "@/content/company";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CTABand } from "@/components/ui/CTABand";
import { home } from "@/content/home";

export const metadata = pageMeta("/company/careers");

// A simple page: a short intro, a list and a call to action. Content is still to come.
export default function Page() {
  return (
    <>
      <PageHero path="/company/careers" next="paper-2" title={content.headline} sub={content.sub}>
        <Button href={content.cta.href} size="lg">
          {content.cta.label}
        </Button>
      </PageHero>
      <Section tone="paper-2">
        <div className="container-x">
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[0, 1, 2].map((slot) => (
              <li key={slot} className="card p-6 lg:p-8">
                <p className="t-label text-ink-3">0{slot + 1}</p>
                <p className="mt-6">
                  <span className="tbd">[TBD: careers entry]</span>
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <span className="tbd">{content.tbd}</span>
          </p>
        </div>
      </Section>
      <CTABand headline={home.cta.headline} button={home.cta.button} line={home.cta.line} />
    </>
  );
}
