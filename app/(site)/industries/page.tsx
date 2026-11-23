import type { CSSProperties } from "react";
import { industries } from "@/content/industries";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { IndustryTile } from "@/components/ui/IndustryTile";
import { CTABand } from "@/components/ui/CTABand";
import { home } from "@/content/home";

export const metadata = pageMeta("/industries");

export default function IndustriesPage() {
  return (
    <>
      <PageHero path="/industries" next="paper-2" eyebrow="Industries" title="One platform. Eight industries." sub="AOne IoT, Vision AI and BluSquad, set up for the way each operation runs. Pick yours to see the challenges, the use cases and the measured results." />
      <Section tone="paper-2" spacing="none" className="pt-10 pb-24 lg:pt-16 lg:pb-40">
        <ul className="container-x grid grid-cols-1 gap-6 md:grid-cols-2">
          {industries.map((industry, index) => (
            <li key={industry.slug} data-reveal="" style={{ "--reveal-delay": `${(index % 2) * 60}ms` } as CSSProperties}>
              <IndustryTile industry={industry} size="large" />
            </li>
          ))}
        </ul>
      </Section>
      <CTABand headline={home.cta.headline} button={home.cta.button} line={home.cta.line} />
    </>
  );
}
