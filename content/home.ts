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
    before: "On paper",
    after: "In AOne",
    // The same three moments, on paper and in AOne. Readings are illustrative UI content.
    moments: [
      {
        id: "log",
        paper: {
          title: "Temperature log · Cold room 2",
          rows: [
            ["22:00", "3.5°C", "ok"],
            ["00:00", "3.9°C", "ok"],
            ["02:00", "—", "not checked"],
            ["06:00", "9.4°C", "?"],
          ],
        },
        aone: { status: "alert", time: "02:14", title: "Cold room 2 rising", detail: "Temp 6.1°C · threshold 5.0°C", action: "Alert sent to store manager" },
      },
      {
        id: "audit",
        paper: {
          title: "Closing checklist",
          rows: [
            ["Handwash log", "✓", ""],
            ["Exhaust off", "", "blank"],
            ["AC off", "✓", ""],
            ["Freezer door", "", "blank"],
          ],
        },
        aone: { status: "warn", time: "23:40", title: "Exhaust fan still running", detail: "Outlet closed 23:00 · overrun 40 min", action: "Switched off remotely" },
      },
      {
        id: "alarm",
        paper: {
          title: "Compressor panel",
          rows: [["ALARM", "03:05", "not acknowledged"]],
        },
        aone: { status: "ok", time: "03:21", title: "Compressor 2 vibration", detail: "BluSquad engineer assigned 03:07", action: "Resolved" },
      },
    ],
    losses: [
      "Energy left running",
      "Breakdowns nobody saw coming",
      "Stock that spoils between checks",
      "Defects that reach customers",
      "Audits done on paper",
    ],
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
