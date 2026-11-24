// Homepage copy, in section order (brief §6). The order of sections is fixed.

export const home = {
  hero: {
    // Placeholder: a 20 s cut of the two brand films. The final film is a 45–60 s cut across all
    // eight industries with AOne data overlays. A WebM with the same name sits beside the MP4.
    video: {
      src: "/videos/home-hero.mp4",
      srcMobile: "/videos/home-hero-720.mp4",
      poster: "/videos/home-hero.jpg",
      posterMobile: "/videos/home-hero-mobile.jpg", // a 9:16 crop for phones
    },
    // The hero is the headline alone, with the site's call to action beneath it.
    headline: "Make the world run autonomous",
  },

  proof: [
    { value: "65%", label: "of India’s quick commerce runs on AOne", source: "Blinkit, Amazon Fresh, bigbasket" },
    { value: "~₹1 Cr", label: "saved a year from compressed air alone", source: "Wheels India, Annual Report 2024–25" },
    { value: "22%", label: "lower energy use", source: "Domino’s" },
    { value: "2,400/hr", label: "LPG cylinders inspected by patented AI", source: "IndianOil, Patent 202441033050" },
  ],

  logoWall: { label: "Running on AOne" },

  industries: { headline: "Built for the way your operation actually runs." },

  problem: {
    headline: "Your operation is talking. Nobody is listening.",
    answer: "But AOne does.",
    lead: "On the night shift, with fewer people on the floor, a small fault can go unnoticed until it becomes a breakdown. AOne devices watch every asset around the clock, catch the fault as it starts and alert your team on the AOne dashboard before anything goes wrong.",
    losses: [
      "Energy left running",
      "Breakdowns nobody saw coming",
      "Stock that spoils between checks",
      "Defects that reach customers",
      "Audits done on paper",
    ],
    // The night-shift illustration beside it. Readings and times are illustrative UI content.
    night: {
      description:
        "A plant at night, with one operator at the far end of the floor. A compressor near the front starts to overheat. The AOne sensor on it catches the change as it starts and sends an alert through the gateway to the AOne dashboard, which notifies the on-call engineer before the compressor fails.",
      shift: "Night shift",
      dashboard: "AOne dashboard",
      live: "Live",
      asset: "Compressor 2",
      normal: "Normal",
      warning: "Early warning",
      alert: { time: "02:51", text: "Bearing temperature rising" },
      notified: "On-call engineer alerted",
      idle: "Idle",
      others: ["Line 1", "Line 2"],
    },
  },

  how: {
    headline: "Sense. See. Decide. Act.",
    steps: [
      { id: "sense", name: "Sense", body: ["Sensors and cameras drop into place."] },
      { id: "see", name: "See", body: ["Data lines flow to one dashboard."] },
      { id: "decide", name: "Decide", body: ["Vision AI and anomaly detection flag an issue."] },
      { id: "act", name: "Act", body: ["A BluSquad engineer resolves it, and the alert turns green."] },
    ],
  },

  layers: { headline: "Three layers, one platform." },

  stories: {
    headline: "Proven where it’s hardest.",
    lead: "Customers stay and expand: 8+ years with Licious, seven plants at Wheels India.",
    featured: "wheels-india",
    standard: ["quick-commerce-leaders", "dana", "dominos", "smartworks", "licious"],
    link: { label: "See all customer stories", href: "/customers" },
  },

  // Figures from Atsuya (November 2026): 500+ cities, 3+ countries, 1,60,64,400 sq ft monitored
  // for energy efficiency, 9,90,000 kg of food waste prevented, 1,10,662 t of CO₂ avoided and
  // 73,433 kL of water saved. Shown rounded down, in international units.
  impact: {
    headline: "Our impact",
    reach: "AOne runs in **500+ cities** across **3+ countries**, and monitors **16 million+ sq ft** of space for energy efficiency.",
    outcomes: [
      { value: "990", unit: "tonnes", label: "of food waste prevented" },
      { value: "110,000+", unit: "tonnes", label: "of CO₂ emissions avoided" },
      { value: "73 million+", unit: "litres", label: "of water saved" },
    ],
    // [TBD: the month and year these figures are as of] [TBD: how CO₂ avoided is calculated]
    note: "Cumulative across AOne deployments.",
  },

  cta: {
    headline: "Find the savings already sitting in your operation.",
    button: { label: "Book a site assessment", href: "/book-assessment" },
    line: "A 30-minute call with an AOne engineer. No slideware.",
  },
};
