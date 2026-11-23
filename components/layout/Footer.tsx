import Link from "next/link";
import { footerColumns, legalLinks, site } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { rich } from "@/components/ui/rich";

export function Footer() {
  return (
    <footer className="on-dark dark-vars bg-navy-950">
      <div className="container-x pt-16 pb-10 lg:pt-24">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <Link href="/" aria-label="Atsuya Technologies, home">
            <Logo mono className="h-10 w-auto text-white" />
          </Link>
          <p className="t-label text-ink-2">{site.tagline}</p>
        </div>

        <nav aria-label="Footer" className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-line pt-12 md:grid-cols-3 lg:grid-cols-6">
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
