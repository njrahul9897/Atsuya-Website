import Link from "next/link";
import { footerColumns, legalLinks, newsletter, site } from "@/content/site";
import { home } from "@/content/home";
import { Logo } from "@/components/ui/Logo";
import { rich, splitAccent } from "@/components/ui/rich";
import { ArrowRight } from "@/components/ui/icons";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

// The footer opens with the two ways to stay in touch: the newsletter (top left) and a site
// assessment (top right). Then the logo and the link columns, then the legal line.
export function Footer() {
  const [head, tail] = splitAccent(newsletter.headline);
  return (
    <footer className="on-dark dark-vars bg-navy-950">
      <div className="container-x pt-16 pb-10 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <section aria-labelledby="footer-newsletter-title" className="lg:col-span-7">
            <h2 id="footer-newsletter-title" className="text-[1.75rem] leading-[2.125rem] font-semibold tracking-[-0.02em] text-ink lg:text-[2.25rem] lg:leading-[2.625rem]">
              {head} {tail ? <span className="accent">{tail}</span> : null}
            </h2>
            <p className="mt-3 max-w-[36rem] text-[1.0625rem] leading-7 text-ink-2">{rich(newsletter.lead)}</p>
            <div className="mt-6 max-w-[36rem]">
              <NewsletterForm success={newsletter.success} consent={newsletter.consent} />
            </div>
          </section>

          <Link href={site.cta.href} className="group flex flex-col justify-between gap-8 rounded-[1.25rem] border border-line bg-white/[0.04] p-6 transition-colors duration-300 hover:border-transparent hover:bg-brand lg:col-span-4 lg:col-start-9 lg:p-8">
            <span className="flex items-start justify-between gap-6">
              <span className="text-[1.5rem] leading-[1.875rem] font-semibold tracking-[-0.01em] text-ink">{site.cta.label}</span>
              <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors duration-300 group-hover:bg-white group-hover:text-brand">
                <ArrowRight />
              </span>
            </span>
            <span className="text-[0.9375rem] leading-[1.375rem] text-ink-2 transition-colors duration-300 group-hover:text-white">{home.cta.line}</span>
          </Link>
        </div>

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

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 text-[0.875rem] leading-5 text-ink-2 md:flex-row md:items-center md:justify-between">
          <p>© 2026 {site.legalName}</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex min-h-8 items-center transition-colors duration-200 hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              {site.social.linkedin ? (
                <a href={site.social.linkedin} rel="noopener noreferrer" target="_blank" className="inline-flex min-h-8 items-center transition-colors duration-200 hover:text-ink">
                  LinkedIn
                </a>
              ) : (
                <span className="inline-flex items-center gap-2">
                  LinkedIn <span className="tbd">[TBD: LinkedIn URL]</span>
                </span>
              )}
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
