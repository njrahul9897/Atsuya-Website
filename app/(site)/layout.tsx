import { nav, site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Newsletter } from "@/components/layout/Newsletter";
import { MegaIndustries, MegaList, MegaPlatform } from "@/components/layout/MegaMenus";

const mobile = [
  { title: "Industries", links: [{ label: "All industries", href: "/industries" }, ...nav.industries.map(({ label, href }) => ({ label, href }))] },
  { title: "Platform", links: [{ label: "How AOne works", href: "/platform" }, ...nav.layers.map(({ label, href }) => ({ label, href })), ...nav.solutions] },
  { title: "Customers", links: [{ label: "Customers", href: "/customers" }] },
  { title: "Resources", links: nav.resources.map(({ label, href }) => ({ label, href })) },
  { title: "Company", links: nav.company.map(({ label, href }) => ({ label, href })) },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header
        cta={site.cta}
        mobile={mobile}
        panels={{
          industries: <MegaIndustries />,
          platform: <MegaPlatform />,
          resources: <MegaList label="Resources" links={nav.resources} />,
          company: <MegaList label="Company" links={nav.company} />,
        }}
      />
      <main id="main">{children}</main>
      <Newsletter />
      <Footer />
    </>
  );
}
