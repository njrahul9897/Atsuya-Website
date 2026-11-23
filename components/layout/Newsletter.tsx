import { newsletter } from "@/content/site";
import { rich, splitAccent } from "@/components/ui/rich";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

// The newsletter sign-up: a light band between each page's last section and the dark footer.
export function Newsletter() {
  // The accent phrase gets its own line ("Notes from the field," / "in your inbox.").
  const [head, tail] = splitAccent(newsletter.headline);
  return (
    <section aria-labelledby="newsletter-title" className="border-t border-line bg-paper-2">
      <div className="container-x band-y grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-x-6">
        <div className="lg:col-span-6" data-reveal="">
          <h2 id="newsletter-title" className="t-h2">
            {head}
            {tail ? (
              <>
                <br />
                <span className="accent">{tail}</span>
              </>
            ) : null}
          </h2>
          <p className="t-lead mt-5 max-w-[34rem] text-ink-2">{rich(newsletter.lead)}</p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8" data-reveal="">
          <NewsletterForm success={newsletter.success} consent={newsletter.consent} />
        </div>
      </div>
    </section>
  );
}
