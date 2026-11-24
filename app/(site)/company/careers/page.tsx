import { careers as content } from "@/content/company";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/hero/PageHero";
import { Button } from "@/components/ui/Button";
import { CTABand } from "@/components/ui/CTABand";
import { home } from "@/content/home";

export const metadata = pageMeta("/company/careers");

// A short intro and a call to action; the list follows once its content is ready.
export default function Page() {
  return (
    <>
      <PageHero path="/company/careers" next="paper-2" title={content.headline} sub={content.sub}>
        <Button href={content.cta.href} size="lg">
          {content.cta.label}
        </Button>
      </PageHero>
      {/* The open roles goes here once it is ready (content/company.ts → tbd). */}
      <CTABand headline={home.cta.headline} button={home.cta.button} line={home.cta.line} />
    </>
  );
}
