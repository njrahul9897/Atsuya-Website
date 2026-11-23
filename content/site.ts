// Site-wide facts: identity, contact details, navigation and the customer list.

import { industries } from "./industries";
import { layers } from "./platform";
import { solutions } from "./solutions";

export const site = {
  name: "Atsuya Technologies",
  legalName: "Atsuya Technologies Pvt. Ltd.",
  product: "AOne",
  url: "https://www.atsuyatech.com",
  tagline: "Connected. Personalized. Intelligence.",
  description: "AOne, the operational intelligence platform from Atsuya Technologies, connects machines, cold rooms, kitchens and buildings with IoT, Vision AI and BluSquad experts.",
  cta: { label: "Book a site assessment", href: "/book-assessment" },
  contact: {
    email: "[TBD: contact email]",
    phone: "[TBD: phone number]",
    address: "[TBD: office address]",
    lines: [
      { label: "Sales", value: "[TBD: sales contact]" },
      { label: "Support", value: "[TBD: support contact]" },
      { label: "Careers", value: "[TBD: careers contact]" },
    ],
  },
  social: {
    linkedin: "", // [TBD: LinkedIn URL]
  },
};

// The logo wall. `logo` gives the file and its intrinsic size (the wall sizes each mark by its
// proportions); without one, the wall sets the name in type.
// Sources: Blinkit is the vector file from the Atsuya brand folder; the PNGs are cut from the
// case-study pages of docs/AOne Industry Solutions with case studies.pdf, background removed.
export type Customer = { name: string; logo?: { src: string; width: number; height: number; scale?: number } };
export const customers: Customer[] = [
  { name: "Blinkit", logo: { src: "/images/clients/blinkit.svg", width: 115, height: 31, scale: 0.8 } }, // a heavy wordmark
  { name: "Amazon Fresh", logo: { src: "/images/clients/amazon-fresh.png", width: 153, height: 109 } },
  { name: "bigbasket" }, // [TBD: bigbasket logo file]
  { name: "Wheels India", logo: { src: "/images/clients/wheels-india.png", width: 280, height: 114 } },
  { name: "Dana", logo: { src: "/images/clients/dana.png", width: 246, height: 125 } },
  { name: "IndianOil", logo: { src: "/images/clients/indianoil.png", width: 98, height: 120 } },
  { name: "Domino’s", logo: { src: "/images/clients/dominos.png", width: 131, height: 121 } },
  { name: "Smartworks", logo: { src: "/images/clients/smartworks.png", width: 333, height: 115 } },
  { name: "UTI Mutual Fund", logo: { src: "/images/clients/uti-mutual-fund.png", width: 242, height: 113 } },
  { name: "Licious", logo: { src: "/images/clients/licious.png", width: 277, height: 110 } },
  { name: "Gokaldas Exports", logo: { src: "/images/clients/gokaldas-exports.png", width: 319, height: 114 } },
  { name: "Grandiose" }, // [TBD: Grandiose logo file]
];

export type NavLink = { label: string; href: string; note?: string };

export const nav = {
  industries: industries.map((industry) => ({ slug: industry.slug, label: industry.name, href: `/industries/${industry.slug}` })),
  layers: layers.map((layer) => ({ label: layer.name, href: `/platform/${layer.slug}`, note: layer.line })),
  solutions: solutions.map((solution) => ({ label: solution.name, href: `/solutions/${solution.slug}` })),
  resources: [
    { label: "Resources hub", href: "/resources", note: "Guides, reports and the blog" },
    { label: "Savings estimator", href: "/resources/savings-estimator", note: "A typical savings range for your sites" },
    { label: "Blog", href: "/resources/blog", note: "Notes from the field" },
  ] satisfies NavLink[],
  company: [
    { label: "About", href: "/company/about", note: "We make physical operations visible" },
    { label: "Technology", href: "/company/technology", note: "Patents, hardware and edge AI" },
    { label: "Partners", href: "/company/partners" },
    { label: "Careers", href: "/company/careers" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavLink[],
};

export const footerColumns: { title: string; links: NavLink[] }[] = [
  { title: "Industries", links: nav.industries.map(({ label, href }) => ({ label, href })) },
  {
    title: "Platform",
    links: [{ label: "How AOne works", href: "/platform" }, ...nav.layers.map(({ label, href }) => ({ label, href })), ...nav.solutions],
  },
  {
    title: "Customers",
    links: [
      { label: "All case studies", href: "/customers" },
      { label: "Wheels India", href: "/customers/wheels-india" },
      { label: "Dana", href: "/customers/dana" },
      { label: "Domino’s", href: "/customers/dominos" },
      { label: "Licious", href: "/customers/licious" },
    ],
  },
  { title: "Resources", links: nav.resources.map(({ label, href }) => ({ label, href })) },
  { title: "Company", links: nav.company.filter((link) => link.href !== "/contact").map(({ label, href }) => ({ label, href })) },
  {
    title: "Contact",
    links: [
      { label: "Book a site assessment", href: "/book-assessment" },
      { label: "Talk to an AOne engineer", href: "/contact" },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

export const siteCounts = ["1", "2–5", "6–20", "21–100", "100+"];
