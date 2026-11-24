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
  // Footer icons, in this order. An empty href shows the icon dimmed, not linked.
  social: [
    { label: "LinkedIn", href: "https://in.linkedin.com/company/atsuyatech" },
    { label: "X", href: "https://x.com/AtsuyaTech" },
    { label: "YouTube", href: "https://www.youtube.com/@atsuyatechnologies" },
    { label: "Facebook", href: "" }, // [TBD: Facebook URL] (kept inactive until the link is ready)
  ] as { label: "LinkedIn" | "X" | "YouTube" | "Facebook"; href: string }[],
};

// The logo wall, in full colour on a light band. `logo` gives the file and its intrinsic size (the
// wall sizes each mark by its proportions); without one, the wall sets the name in type.
// Sources: the colour files in the Atsuya brand folder ("Client logo"), prepared by trimming their
// margins; Dana, IndianOil, Domino’s, Smartworks, UTI Mutual Fund, Licious and Gokaldas Exports are
// cut from the case-study pages of docs/AOne Industry Solutions with case studies.pdf.
export type Customer = { name: string; logo?: { src: string; width: number; height: number; scale?: number } };
export const customers: Customer[] = [
  { name: "Blinkit", logo: { src: "/images/clients/blinkit.svg", width: 118.56, height: 34.56 } },
  { name: "Swiggy", logo: { src: "/images/clients/swiggy.svg", width: 164.99, height: 54.35 } },
  { name: "Zepto", logo: { src: "/images/clients/zepto.svg", width: 93.6, height: 32.92 } },
  { name: "Zomato", logo: { src: "/images/clients/zomato.svg", width: 2599.99, height: 628.51 } },
  { name: "Amazon Fresh", logo: { src: "/images/clients/amazon-fresh.png", width: 260, height: 240 } },
  { name: "bigbasket", logo: { src: "/images/clients/bigbasket.svg", width: 482.61, height: 120.87 } },
  { name: "Licious", logo: { src: "/images/clients/licious.png", width: 277, height: 110 } },
  { name: "Tender Cuts", logo: { src: "/images/clients/tender-cuts.svg", width: 455.94, height: 97.88 } },
  { name: "Domino’s", logo: { src: "/images/clients/dominos.png", width: 131, height: 121 } },
  { name: "IndianOil", logo: { src: "/images/clients/indianoil.png", width: 98, height: 120 } },
  { name: "Axis Bank", logo: { src: "/images/clients/axis-bank.svg", width: 1021.04, height: 272.61 } },
  { name: "UTI Mutual Fund", logo: { src: "/images/clients/uti-mutual-fund.png", width: 242, height: 113 } },
  { name: "The Hindu", logo: { src: "/images/clients/the-hindu.png", width: 545, height: 240 } },
  { name: "Wheels India", logo: { src: "/images/clients/wheels-india.svg", width: 1613.04, height: 618.2, scale: 1.3 } }, // stacked: its name line is small
  { name: "Dana", logo: { src: "/images/clients/dana.png", width: 246, height: 125 } },
  { name: "FLSmidth", logo: { src: "/images/clients/flsmidth.svg", width: 174.36, height: 52.27 } },
  { name: "Gokaldas Exports", logo: { src: "/images/clients/gokaldas-exports.png", width: 319, height: 114 } },
  { name: "Smartworks", logo: { src: "/images/clients/smartworks.png", width: 333, height: 115 } },
  { name: "Aavin", logo: { src: "/images/clients/aavin.svg", width: 473.21, height: 264.88 } },
  { name: "Nandini", logo: { src: "/images/clients/nandini.png", width: 387, height: 240 } },
  { name: "Hatsun", logo: { src: "/images/clients/hatsun.png", width: 456, height: 112 } },
  { name: "Medha", logo: { src: "/images/clients/medha.png", width: 430, height: 228 } },
  { name: "Grandiose" }, // [TBD: Grandiose logo file]
];

export type NavLink = { label: string; href: string; note?: string };

export const nav = {
  industries: industries.map((industry) => ({ slug: industry.slug, label: industry.name, href: `/industries/${industry.slug}` })),
  layers: layers.map((layer) => ({ label: layer.name, href: `/platform/${layer.slug}`, note: layer.line })),
  solutions: solutions.map((solution) => ({ label: solution.name, href: `/solutions/${solution.slug}` })),
  resources: [
    { label: "Resources hub", href: "/resources", note: "Guides, reports and the blog" },
    { label: "Case studies", href: "/customers", note: "Results from customer sites, named and numbered" },
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
  { title: "Resources", links: nav.resources.map(({ label, href }) => ({ label, href })) },
  { title: "Company", links: nav.company.filter((link) => link.href !== "/contact").map(({ label, href }) => ({ label, href })) },
  {
    title: "Contact",
    links: [{ label: "Talk to an AOne engineer", href: "/contact" }],
  },
];

// The newsletter sign-up, top left of the footer on every page of the site layout.
export const newsletter = {
  headline: "Notes from the field, in your inbox.",
  lead: "Case studies, product updates and practical guides on running physical operations with AOne. [TBD: how often the newsletter goes out]",
  success: "Thanks, you’re subscribed.",
  consent: "By subscribing, you agree to receive emails from Atsuya Technologies. You can unsubscribe at any time.",
};

export const legalLinks: NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

export const siteCounts = ["1", "2–5", "6–20", "21–100", "100+"];
