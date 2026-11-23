import type { Metadata } from "next";
import { nav, site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MegaIndustries, MegaList, MegaPlatform } from "@/components/layout/MegaMenus";
import { Button, ArrowLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <Header
        solid
        cta={site.cta}
        mobile={[
          { title: "Home", links: [{ label: "Home", href: "/" }] },
          { title: "Industries", links: [{ label: "Industries", href: "/industries" }] },
          { title: "Platform", links: [{ label: "Platform", href: "/platform" }] },
          { title: "Customers", links: [{ label: "Customers", href: "/customers" }] },
          { title: "Contact", links: [{ label: "Contact", href: "/contact" }] },
        ]}
        panels={{
          industries: <MegaIndustries />,
          platform: <MegaPlatform />,
          resources: <MegaList label="Resources" links={nav.resources} />,
          company: <MegaList label="Company" links={nav.company} />,
        }}
      />
      <main id="main" className="flex min-h-[80svh] items-center bg-paper pt-[var(--header-h)]">
        <div className="container-x py-24">
          <p className="t-label flex items-center gap-2 text-ink-3">
            <span className="h-2 w-2 rounded-full bg-alert" aria-hidden="true" />
            404 · Signal lost
          </p>
          <h1 className="t-display mt-6 max-w-[52rem]">This page went offline. Everything else is monitored.</h1>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button href="/" size="lg">
              Home
            </Button>
            <ArrowLink href="/industries">Industries</ArrowLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
