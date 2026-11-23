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

// The logo wall. `logo` is left empty until each mark is cleared; the wall sets the name in type
// until then. [TBD: confirm each logo is cleared for public use]
export const customers: { name: string; logo?: string }[] = [
  { name: "Blinkit" },
  { name: "Amazon Fresh" },
  { name: "bigbasket" },
  { name: "Wheels India" },
  { name: "Dana" },
  { name: "IndianOil" },
  { name: "Domino’s" },
  { name: "Smartworks" },
  { name: "UTI Mutual Fund" },
  { name: "Licious" },
  { name: "Gokaldas Exports" },
  { name: "Grandiose" },
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
