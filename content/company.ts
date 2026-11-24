import { hasTbd } from "@/lib/tbd";

// Company, resources, blog and legal content. Most of this is waiting on Atsuya: every gap is a
// [TBD: …] marker, which the site never shows (lib/tbd.ts); `npm run tbd` lists them all.

export const about = {
  headline: "We make physical operations visible.",
  sub: "Atsuya Technologies builds AOne, the operational intelligence platform that combines AOne IoT, Vision AI and BluSquad managed services across eight industries.",
  story: "[TBD: founding year, founders, HQ, team size]",
  principles: [
    { title: "Measure before you promise", body: "Every claim on this site sits next to a number, and where it is cleared, a named customer." },
    { title: "Hardware, software and people, together", body: "AOne IoT, Vision AI and BluSquad are built to work as one." },
    { title: "Land small, prove it, expand", body: "Wheels India went from one plant to seven. Licious has been on AOne for eight years." },
  ],
  footprint: { value: "500+", label: "cities with live deployments, across 3+ countries", tbd: "[TBD: offices]" },
  leadershipTbd: "[TBD: leadership names, roles and photographs]",
};

export const technology = {
  headline: "Patented AI, plug-and-play hardware and AI at the edge.",
  sub: "The technology behind AOne, from the sensor on the asset to the model on the camera.",
  patents: [
    {
      number: "Indian Patent 202441033050",
      title: "AI-based LPG cylinder inspection",
      body: "3D profiling builds a digital twin of each cylinder at 2,400 an hour. OCR reads tare weight, expiry date and cap status on the move.",
      href: "/customers/indianoil",
    },
  ],
  hardware: {
    intro: "Plug-and-play devices, on 4G where the site needs it.",
    items: [
      { name: "AOne Smart EN", body: "Utility monitoring for transformers, compressors, water systems and more. 26 assets at Gokaldas Exports." },
      { name: "4G AOne devices", body: "Uninterrupted connectivity where the plant network is unreliable." },
      { name: "AOne Eye", body: "Multi-angle capture for inline visual inspection, with a pass/fail decision in under 2 seconds at Dana." },
    ],
    tbd: "[TBD: full hardware range and specifications]",
  },
  edge: {
    title: "Edge AI on the cameras you already own",
    body: "Vision AI runs as edge AI on existing DVRs. A global QSR chain uses it across 3,000+ outlets in India.",
    href: "/customers/global-qsr-chain",
  },
  security: { title: "Security and hosting", body: "[TBD: certifications, data security and hosting details]" }, // the card shows once this is written
};

export const partners = {
  headline: "Partners",
  sub: "Work with Atsuya to bring AOne to more factories, stores, kitchens and buildings.",
  tbd: "[TBD: partner categories, partner list and partner programme details]",
  cta: { label: "Talk to us about partnering", href: "/contact" },
};

export const careers = {
  headline: "Careers",
  sub: "Help make physical operations visible.",
  tbd: "[TBD: open roles, locations and how to apply]",
  cta: { label: "Get in touch", href: "/contact" },
};

export const resources = {
  headline: "Resources",
  sub: "Guides, reports and field notes on running physical operations with data.",
  guides: [
    { kind: "Guide", title: "[TBD: guide title]", body: "[TBD: guide summary]" },
    { kind: "Report", title: "[TBD: report title]", body: "[TBD: report summary]" },
  ],
};

export type Post = { slug: string; title: string; date: string; summary: string; body: string[] };

// Three seeded placeholder posts.
export const posts: Post[] = [
  {
    slug: "placeholder-post-1",
    title: "[TBD] Blog post one",
    date: "[TBD: date]",
    summary: "[TBD: summary for blog post one]",
    body: ["[TBD: body copy for blog post one]"],
  },
  {
    slug: "placeholder-post-2",
    title: "[TBD] Blog post two",
    date: "[TBD: date]",
    summary: "[TBD: summary for blog post two]",
    body: ["[TBD: body copy for blog post two]"],
  },
  {
    slug: "placeholder-post-3",
    title: "[TBD] Blog post three",
    date: "[TBD: date]",
    summary: "[TBD: summary for blog post three]",
    body: ["[TBD: body copy for blog post three]"],
  },
];

// Posts still carrying a [TBD] title are placeholders: they are not listed, built or indexed.
export const publishedPosts = posts.filter((post) => !hasTbd(post.title));
export const postBySlug = (slug: string) => publishedPosts.find((post) => post.slug === slug);

export const legal: Record<"privacy" | "terms" | "cookies", { title: string; description: string; body: string[] }> = {
  privacy: {
    title: "Privacy policy",
    description: "How Atsuya Technologies collects, uses and protects personal data.",
    body: ["[TBD: privacy policy text, reviewed by legal]"],
  },
  terms: {
    title: "Terms of use",
    description: "The terms that apply to using the Atsuya Technologies website.",
    body: ["[TBD: terms of use text, reviewed by legal]"],
  },
  cookies: {
    title: "Cookie policy",
    description: "How the Atsuya Technologies website uses cookies.",
    body: ["[TBD: cookie policy text, reviewed by legal]"],
  },
};

export const assessment = {
  headline: "Book a site assessment.",
  sub: "Tell us about your sites. An AOne engineer will come back with a plan, not a pitch.",
  next: [
    { title: "A 30-minute call", body: "With an AOne engineer, about how your operation runs today." },
    { title: "A site walkthrough", body: "We look at the assets, utilities and cameras already in place." },
    { title: "A savings estimate", body: "A range for your sites, based on comparable AOne deployments." },
  ],
  proof: { value: "~₹1 Cr", label: "saved a year from compressed air alone", source: "Wheels India, Annual Report 2024–25" },
  success: "Thanks — an Atsuya engineer will reply within one working day.",
};
