import { industries, energySavingsRange } from "@/content/industries";
import { home } from "@/content/home";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { CTABand } from "@/components/ui/CTABand";
import { SavingsEstimator, type EstimatorOption } from "@/components/forms/SavingsEstimator";

export const metadata = pageMeta("/resources/savings-estimator");

export default function SavingsEstimatorPage() {
  // Each industry's electricity or energy savings range, straight from its impact data.
  const options: EstimatorOption[] = industries.flatMap((industry) => {
    const range = energySavingsRange(industry);
    return range ? [{ slug: industry.slug, name: industry.name, ...range }] : [];
  });

  return (
    <>
      <PageHero path="/resources/savings-estimator" title="What could AOne *save* across your sites?" sub="Three inputs, one indicative range. It uses the typical electricity savings AOne deployments see in your industry." size="h1" />
      <Section spacing="none" className="pt-12 pb-16 lg:pt-20 lg:pb-26">
        <div className="container-x">
          <SavingsEstimator options={options} />
        </div>
      </Section>
      <CTABand headline={home.cta.headline} button={home.cta.button} line={home.cta.line} />
    </>
  );
}
