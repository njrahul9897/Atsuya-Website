import type { CSSProperties } from "react";
import { caseStudies } from "@/content/caseStudies";
import { industries } from "@/content/industries";
import { solutions } from "@/content/solutions";
import { layers } from "@/content/platform";
import { home } from "@/content/home";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { ProofStat } from "@/components/ui/ProofStat";
import { CaseStudyCard } from "@/components/ui/CaseStudyCard";
import { CTABand } from "@/components/ui/CTABand";
import { FilterGrid, type FilterGroup, type FilterItem } from "@/components/sections/FilterGrid";

export const metadata = pageMeta("/customers");

// The featured-results strip that opens the page.
const featuredResults = [
  { value: "3,000+", label: "dark stores monitored", source: "Blinkit, Amazon Fresh, bigbasket" },
  { value: "~₹1 Cr", label: "saved a year", source: "Wheels India, Annual Report 2024–25" },
  { value: "22%", label: "lower energy use", source: "Domino’s" },
  { value: "8% → 2%", label: "food wastage", source: "Licious" },
];

export default function CustomersPage() {
  const used = <T extends { slug?: string; key?: string }>(list: T[], pick: (study: (typeof caseStudies)[number]) => string[], id: (entry: T) => string) => list.filter((entry) => caseStudies.some((study) => pick(study).includes(id(entry))));

  const groups: FilterGroup[] = [
    { key: "industry", label: "Industry", options: used(industries, (study) => [study.industry], (entry) => entry.slug).map((entry) => ({ value: entry.slug, label: entry.name })) },
    { key: "solution", label: "Solution", options: used(solutions, (study) => study.solutions, (entry) => entry.slug).map((entry) => ({ value: entry.slug, label: entry.name })) },
    { key: "layer", label: "Layer", options: used(layers, (study) => study.layers, (entry) => entry.key).map((entry) => ({ value: entry.key, label: entry.name })) },
  ];

  const items: FilterItem[] = caseStudies.map((study) => ({
    id: study.slug,
    tags: { industry: [study.industry], solution: study.solutions, layer: study.layers },
    node: <CaseStudyCard study={study} />,
  }));

  return (
    <>
      <PageHero path="/customers" title="Results, named and numbered." sub={`What was measured, what changed and by how much. ${caseStudies.length} customer stories across ${new Set(caseStudies.map((study) => study.industry)).size} industries.`} />

      <Section spacing="none" className="pt-10 pb-16 lg:pt-14 lg:pb-24">
        <h2 className="sr-only">Featured results</h2>
        <ul className="container-x grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredResults.map((stat, index) => (
            <li key={stat.label} className="rounded-[1.25rem] bg-paper-2 p-6 lg:p-7" data-reveal="" style={{ "--reveal-delay": `${index * 60}ms` } as CSSProperties}>
              <ProofStat value={stat.value} label={stat.label} source={stat.source} size="xl" />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="paper-2" labelledBy="stories-title">
        <div className="container-x">
          <h2 id="stories-title" className="t-h2" data-reveal="">
            All customer stories
          </h2>
          <div className="mt-10">
            <FilterGrid groups={groups} items={items} gridClassName="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" />
          </div>
          {/* [TBD: confirm that every customer name is cleared for public use] */}
        </div>
      </Section>

      <CTABand headline={home.cta.headline} button={home.cta.button} line={home.cta.line} />
    </>
  );
}
