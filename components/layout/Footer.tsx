import Link from "next/link";
import { footerColumns, legalLinks, newsletter, site } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { rich, splitAccent } from "@/components/ui/rich";
import { Facebook, LinkedIn, XLogo, YouTube } from "@/components/ui/icons";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

const socialIcons = { LinkedIn, X: XLogo, YouTube, Facebook };

// The footer opens with the newsletter (heading on the left, the email field and its consent
// line on the right), then the logo and the link columns, then the legal line with the social
// icons.
export function Footer() {
  const [head, tail] = splitAccent(newsletter.headline);
  const missingSocial = site.social.filter((profile) => !profile.href).map((profile) => profile.label);
  return (
    <footer className="on-dark dark-vars bg-navy-950">
      <div className="container-x pt-16 pb-10 lg:pt-20">
        <section aria-labelledby="footer-newsletter-title" className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <div className="lg:col-span-6">
            <h2 id="footer-newsletter-title" className="text-[1.75rem] leading-[2.125rem] font-semibold tracking-[-0.02em] text-ink lg:text-[2.25rem] lg:leading-[2.625rem]">
              {head} {tail ? <span className="accent">{tail}</span> : null}
            </h2>
            <p className="mt-3 max-w-[36rem] text-[1.0625rem] leading-7 text-ink-2">{rich(newsletter.lead)}</p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <NewsletterForm success={newsletter.success} consent={newsletter.consent} />
          </div>
        </section>

        <nav aria-label="Footer" className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-line pt-12 md:grid-cols-3 lg:mt-16 lg:grid-cols-6">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" aria-label="Atsuya Technologies, home" className="inline-block">
              <Logo mono className="h-10 w-auto text-white" />
            </Link>
            <p className="t-label mt-5 max-w-[14rem] text-ink-2">{site.tagline}</p>
          </div>
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="t-label text-ink-3">{column.title}</h2>
              <ul className="mt-4 space-y-1">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="inline-flex min-h-8 items-center text-[0.9375rem] leading-[1.375rem] text-ink-2 transition-colors duration-200 hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
                {column.title === "Contact" ? (
                  <>
                    <li className="pt-2 text-[0.9375rem] leading-[1.375rem] text-ink-2">{rich(site.contact.email)}</li>
                    <li className="pt-1 text-[0.9375rem] leading-[1.375rem] text-ink-2">{rich(site.contact.phone)}</li>
                  </>
                ) : null}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-6 text-[0.875rem] leading-5 text-ink-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
            <p>© 2026 {site.legalName}</p>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-8 items-center transition-colors duration-200 hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ul className="flex items-center gap-2" aria-label="Atsuya Technologies on social media">
              {site.social.map((profile) => {
                const Icon = socialIcons[profile.label];
                const circle = "flex h-10 w-10 items-center justify-center rounded-full border border-line";
                return (
                  <li key={profile.label}>
                    {profile.href ? (
                      <a href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={`Atsuya Technologies on ${profile.label}`} className={`${circle} text-ink-2 transition-colors duration-200 hover:border-transparent hover:bg-brand hover:text-white`}>
                        <Icon size={16} />
                      </a>
                    ) : (
                      // No URL yet: shown dimmed and not linked, named for screen readers.
                      <span role="img" aria-label={`${profile.label} (link to come)`} className={`${circle} text-ink-3 opacity-60`}>
                        <Icon size={16} />
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            {missingSocial.length ? <span className="tbd">[TBD: {missingSocial.join(", ")} URL{missingSocial.length > 1 ? "s" : ""}]</span> : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
