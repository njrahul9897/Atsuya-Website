import { legal } from "@/content/company";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { LegalBody } from "@/components/sections/LegalBody";

export const metadata = pageMeta("/cookies");

export default function Page() {
  const doc = legal.cookies;
  return (
    <>
      <PageHero path="/cookies" title={doc.title} sub={doc.description} size="h1" />
      <Section spacing="none" className="pt-8 pb-16 lg:pt-12 lg:pb-26">
        <div className="container-x">
          <LegalBody body={doc.body} />
        </div>
      </Section>
    </>
  );
}
