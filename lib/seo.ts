// One registry of every route on the site. Page metadata, breadcrumbs, the sitemap and the Open
// Graph images are all generated from it, so a new industry or case study in /content shows up in
// all four without further code.

import type { Metadata } from "next";
import { site } from "@/content/site";
import { industries } from "@/content/industries";
import { caseStudies } from "@/content/caseStudies";
import { solutions } from "@/content/solutions";
import { layers, platform } from "@/content/platform";
import { about, technology, partners, careers, resources, publishedPosts, legal, assessment } from "@/content/company";

export type Crumb = { name: string; path: string };

export type RouteMeta = {
  path: string;
  title: string; // used with the "%s | AOne by Atsuya" template unless `absoluteTitle`
  absoluteTitle?: boolean;
  description: string;
  crumbs: Crumb[]; // parents only; the page itself is added as the last crumb
  crumbName: string;
  og: { eyebrow: string; title: string; stat?: { value: string; label: string } };
  priority: number;
  type?: "article";
};

const INDUSTRIES: Crumb = { name: "Industries", path: "/industries" };
const PLATFORM: Crumb = { name: "Platform", path: "/platform" };
const SOLUTIONS: Crumb = { name: "Solutions", path: "/platform#solutions" };
const CUSTOMERS: Crumb = { name: "Customers", path: "/customers" };
const RESOURCES: Crumb = { name: "Resources", path: "/resources" };
const BLOG: Crumb = { name: "Blog", path: "/resources/blog" };
const COMPANY: Crumb = { name: "Company", path: "/company/about" };

const industryName = (slug: string) => industries.find((industry) => industry.slug === slug)?.name ?? "";

export function allRoutes(): RouteMeta[] {
  const fixed: RouteMeta[] = [
    {
      path: "/",
      title: "AOne by Atsuya | Make the world run autonomous",
      absoluteTitle: true,
      description: site.description,
      crumbs: [],
      crumbName: "Home",
      og: { eyebrow: "AOne · Operational intelligence", title: "Make the world run autonomous" },
      priority: 1,
    },
    {
      path: "/industries",
      title: "Industries",
      description: "One platform, eight industries: manufacturing, quick commerce, QSR, smart buildings, retail, oil and gas, dairy and HoReCa. Challenges, use cases and measurable impact for each.",
      crumbs: [],
      crumbName: "Industries",
      og: { eyebrow: "Industries", title: "One platform. Eight industries." },
      priority: 0.9,
    },
    {
      path: "/platform",
      title: "The AOne platform",
      description: `${platform.hero.headline} ${platform.hero.sub} See the architecture, the three layers, six solutions and how a rollout works.`,
      crumbs: [],
      crumbName: "Platform",
      og: { eyebrow: "The AOne platform", title: platform.hero.headline },
      priority: 0.9,
    },
    {
      path: "/customers",
      title: "Customers",
      description: "Results, named and numbered. Case studies from Wheels India, Dana, Domino’s, Smartworks, Licious, IndianOil and more: what was measured, what changed and by how much.",
      crumbs: [],
      crumbName: "Customers",
      og: { eyebrow: "Customers", title: "Results, named and numbered.", stat: { value: "3,000+", label: "dark stores monitored" } },
      priority: 0.9,
    },
    {
      path: "/resources",
      title: "Resources",
      description: resources.sub,
      crumbs: [],
      crumbName: "Resources",
      og: { eyebrow: "Resources", title: "Guides, reports and field notes." },
      priority: 0.5,
    },
    {
      path: "/resources/savings-estimator",
      title: "Savings estimator",
      description: "Estimate the typical energy savings range for your sites, from your industry, number of sites and monthly electricity bill. Indicative, based on typical AOne deployments.",
      crumbs: [RESOURCES],
      crumbName: "Savings estimator",
      og: { eyebrow: "Savings estimator", title: "A typical savings range for your sites." },
      priority: 0.7,
    },
    {
      path: "/resources/blog",
      title: "Blog",
      description: "Field notes from Atsuya on IoT, Vision AI and running physical operations with data.",
      crumbs: [RESOURCES],
      crumbName: "Blog",
      og: { eyebrow: "Blog", title: "Notes from the field." },
      priority: 0.4,
    },
    {
      path: "/company/about",
      title: "About Atsuya",
      description: `${about.headline} ${about.sub}`,
      crumbs: [],
      crumbName: "About",
      og: { eyebrow: "About Atsuya", title: about.headline },
      priority: 0.6,
    },
    {
      path: "/company/technology",
      title: "Patents and technology",
      description: "The technology behind AOne: Indian Patent 202441033050 for AI-based LPG cylinder inspection, the AOne hardware range, edge AI on existing DVRs, and security.",
      crumbs: [COMPANY],
      crumbName: "Technology",
      og: { eyebrow: "Patents and technology", title: technology.headline },
      priority: 0.6,
    },
    {
      path: "/company/partners",
      title: "Partners",
      description: partners.sub,
      crumbs: [COMPANY],
      crumbName: "Partners",
      og: { eyebrow: "Partners", title: partners.sub },
      priority: 0.3,
    },
    {
      path: "/company/careers",
      title: "Careers",
      description: `Careers at Atsuya Technologies. ${careers.sub}`,
      crumbs: [COMPANY],
      crumbName: "Careers",
      og: { eyebrow: "Careers", title: careers.sub },
      priority: 0.3,
    },
    {
      path: "/contact",
      title: "Contact",
      description: "Talk to an AOne engineer. Tell us about your sites and an Atsuya engineer will reply within one working day.",
      crumbs: [],
      crumbName: "Contact",
      og: { eyebrow: "Contact", title: "Talk to an AOne engineer." },
      priority: 0.7,
    },
    {
      path: "/book-assessment",
      title: "Book a site assessment",
      description: "Book a site assessment with an AOne engineer: a 30-minute call, a site walkthrough and a savings estimate for your operation.",
      crumbs: [],
      crumbName: "Book a site assessment",
      og: { eyebrow: "Book a site assessment", title: "Find the savings already sitting in your operation.", stat: assessment.proof },
      priority: 0.8,
    },
    ...(["privacy", "terms", "cookies"] as const).map(
      (key): RouteMeta => ({
        path: `/${key}`,
        title: legal[key].title,
        description: legal[key].description,
        crumbs: [],
        crumbName: legal[key].title,
        og: { eyebrow: "Atsuya Technologies", title: legal[key].title },
        priority: 0.1,
      }),
    ),
  ];

  const industryRoutes = industries.map(
    (industry): RouteMeta => ({
      path: `/industries/${industry.slug}`,
      title: `${industry.name}: AOne for your ${industry.siteNoun}`,
      description: `${industry.promise} ${industry.sub}`,
      crumbs: [INDUSTRIES],
      crumbName: industry.name,
      og: { eyebrow: industry.name, title: industry.promise, stat: { value: industry.heroStat.value, label: industry.heroStat.label } },
      priority: 0.8,
    }),
  );

  const layerRoutes = layers.map(
    (layer): RouteMeta => ({
      path: `/platform/${layer.slug}`,
      title: layer.aka ? `${layer.name} (${layer.aka})` : layer.name,
      description: `${layer.hero.headline} ${layer.hero.sub}`,
      crumbs: [PLATFORM],
      crumbName: layer.name,
      og: { eyebrow: layer.name, title: layer.hero.headline },
      priority: 0.7,
    }),
  );

  const solutionRoutes = solutions.map(
    (solution): RouteMeta => ({
      path: `/solutions/${solution.slug}`,
      title: solution.name,
      description: `${solution.headline} ${solution.line}`,
      crumbs: [SOLUTIONS],
      crumbName: solution.name,
      og: { eyebrow: `Solution · ${solution.name}`, title: solution.headline },
      priority: 0.7,
    }),
  );

  const caseStudyRoutes = caseStudies.map(
    (study): RouteMeta => ({
      path: `/customers/${study.slug}`,
      title: `${study.customer}: ${study.headline.value} ${study.headline.label} | AOne`,
      absoluteTitle: true,
      description: `${study.title}. ${study.impact.slice(0, 2).join(". ")}.`,
      crumbs: [CUSTOMERS],
      crumbName: study.customer,
      og: { eyebrow: `Case study · ${industryName(study.industry)}`, title: study.customer, stat: study.headline },
      priority: 0.6,
      type: "article",
    }),
  );

  const postRoutes = publishedPosts.map(
    (post): RouteMeta => ({
      path: `/resources/blog/${post.slug}`,
      title: post.title,
      description: post.summary,
      crumbs: [RESOURCES, BLOG],
      crumbName: post.title,
      og: { eyebrow: "Blog", title: post.title },
      priority: 0.2,
      type: "article",
    }),
  );

  return [...fixed, ...industryRoutes, ...layerRoutes, ...solutionRoutes, ...caseStudyRoutes, ...postRoutes];
}

export function routeFor(path: string): RouteMeta {
  const route = allRoutes().find((entry) => entry.path === path);
  if (!route) throw new Error(`No route metadata for ${path}`);
  return route;
}

// "/" → ["home.png"], "/industries/qsr" → ["industries", "qsr.png"]
export const ogSegments = (path: string) => {
  const parts = path === "/" ? ["home"] : path.slice(1).split("/");
  parts[parts.length - 1] += ".png";
  return parts;
};
export const ogPath = (path: string) => `/og/${ogSegments(path).join("/")}`;

export function pageMeta(path: string): Metadata {
  const route = routeFor(path);
  const title = route.absoluteTitle ? { absolute: route.title } : route.title;
  const fullTitle = route.absoluteTitle ? route.title : `${route.title} | AOne by Atsuya`;
  const image = { url: ogPath(path), width: 1200, height: 630, alt: route.og.title };
  return {
    title,
    description: route.description,
    alternates: { canonical: path },
    openGraph: {
      type: route.type === "article" ? "article" : "website",
      siteName: site.name,
      locale: "en_IN",
      url: path,
      title: fullTitle,
      description: route.description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: route.description, images: [image.url] },
  };
}

const absolute = (path: string) => `${site.url}${path === "/" ? "" : path}`;

export function breadcrumbJsonLd(path: string) {
  const route = routeFor(path);
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...route.crumbs, { name: route.crumbName, path }];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: absolute(crumb.path) })),
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  logo: `${site.url}/images/logos/atsuya-logo.svg`,
  slogan: site.tagline,
  description: site.description,
  brand: { "@type": "Brand", name: site.product },
  // The social profiles, once their URLs are set in content/site.ts.
  ...(site.social.some((profile) => profile.href) ? { sameAs: site.social.map((profile) => profile.href).filter(Boolean) } : {}),
};

export function articleJsonLd(path: string, headline: string, about: string) {
  const route = routeFor(path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description: route.description,
    about,
    image: `${site.url}${ogPath(path)}`,
    mainEntityOfPage: absolute(path),
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/images/logos/atsuya-logo.svg` } },
  };
}
