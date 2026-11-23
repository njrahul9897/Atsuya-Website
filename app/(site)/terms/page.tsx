import { legal } from "@/content/company";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/hero/PageHero";
import { Section } from "@/components/ui/Section";
import { rich } from "@/components/ui/rich";

export const metadata = pageMeta("/terms");

export default function Page() {
  const doc = legal.terms;
  return (
    <>
      <PageHero path="/terms" title={doc.title} sub={doc.description} size="h1" />
      <Section spacing="none" className="pt-8 pb-16 lg:pt-12 lg:pb-26">
        <div className="container-x">
          <div className="prose-plain max-w-[44rem] border-t border-line pt-10">
            {doc.body.map((paragraph) => (
              <p key={paragraph}>{rich(paragraph)}</p>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
