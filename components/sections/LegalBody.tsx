import Link from "next/link";
import { isGap } from "@/lib/tbd";
import { rich } from "@/components/ui/rich";

// The text of a legal page. Until the reviewed text is in (content/company.ts → legal), the page
// shows one plain line that points to the contact page.
export function LegalBody({ body }: { body: string[] }) {
  const paragraphs = body.filter((paragraph) => !isGap(paragraph));
  return (
    <div className="prose-plain max-w-[44rem] border-t border-line pt-10">
      {paragraphs.length ? (
        paragraphs.map((paragraph) => <p key={paragraph}>{rich(paragraph)}</p>)
      ) : (
        <p>
          This page is being prepared. If you have a question in the meantime, <Link href="/contact">contact us</Link>.
        </p>
      )}
    </div>
  );
}
