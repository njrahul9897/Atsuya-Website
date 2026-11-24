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
    headline: "Make the world run *autonomous*",
  },

  proof: [
    { value: "65%", label: "of India’s quick commerce runs on AOne", source: "Blinkit, Amazon Fresh, bigbasket" },
    { value: "~₹1 Cr", label: "saved a year from compressed air alone", source: "Wheels India, Annual Report 2024–25" },
    { value: "22%", label: "lower energy use", source: "Domino’s" },
    { value: "2,400/hr", label: "LPG cylinders inspected by patented AI", source: "IndianOil, Patent 202441033050" },
  ],

  logoWall: { label: "Running on *AOne*" },

  industries: { headline: "Built for the way your operation *actually runs.*" },

  problem: {
    headline: "Your operation is talking. Nobody is listening.",
    answer: "But AOne does.",
    tabsLabel: "Five things AOne listens for",
    // Beside the list, one illustration of a plant (illustrations/model/ops.ts) plays a story for
    // each problem, zoomed in on its zone. Times, readings and statuses in the dashboard card are
    // illustrative UI content.
    scene: {
      description: "An isometric plant: an office block, a cold room, a packing line with a camera, a compressor and an electrical panel, each with an AOne device wired to one gateway.",
      dashboard: "AOne dashboard",
      calm: "All readings normal",
    },
    problems: [
      {
        key: "energy",
        title: "Energy left running",
        story: "At 20:40 the office lights and AC are still on with nobody in. The AOne energy sensor notices and switches them off.",
        time: "20:40",
        asset: "Office block",
        status: { before: "Running", problem: "Nobody in", fixed: "Switched off" },
        alert: "Lights and AC on with nobody in",
        action: "Switched off by AOne",
        pin: { problem: "Lights and AC on", fixed: "Switched off" },
      },
      {
        key: "break",
        title: "Breakdowns nobody saw coming",
        story: "At 10:42 a bearing on Compressor 2 starts to heat. The AOne sensor catches it early, alerts the team and a technician is assigned before the compressor fails.",
        time: "10:42",
        asset: "Compressor 2",
        status: { before: "Normal", problem: "Early warning", fixed: "Technician assigned" },
        alert: "Bearing temperature rising",
        action: "Technician assigned",
        pin: { problem: "Bearing heating up", fixed: "Technician on site" },
      },
      {
        key: "cold",
        title: "Stock that spoils between checks",
        story: "At 14:12 the door of Cold Room 2 is left open and the temperature climbs. AOne alerts the shift lead, the door is closed and the room recovers before the stock spoils.",
        time: "14:12",
        asset: "Cold Room 2",
        status: { before: "3.8°C", problem: "6.4°C, rising", fixed: "Back to 3.8°C" },
        alert: "Door left open, 6.4°C",
        action: "Shift lead alerted, door closed",
        pin: { problem: "Door open, 6.4°C", fixed: "Door closed" },
      },
      {
        key: "defect",
        title: "Defects that reach customers",
        story: "At 11:30 a carton with a misprinted label reaches the packing line. The Vision AI camera spots it and the line rejects it before dispatch.",
        time: "11:30",
        asset: "Packing line",
        status: { before: "Inspecting", problem: "Defect found", fixed: "Rejected" },
        alert: "Misprinted label on a carton",
        action: "Rejected before dispatch",
        pin: { problem: "Defect found", fixed: "Rejected" },
      },
      {
        key: "audit",
        title: "Audits done on paper",
        story: "At 09:00 the morning audit runs itself: AOne records the fire extinguisher, electrical panel, cold-room log and first-aid kit checks, and the report is ready with no paperwork.",
        time: "09:00",
        asset: "Morning audit",
        status: { before: "Due", problem: "Checking", fixed: "Report ready" },
        checks: ["Fire extinguisher", "Electrical panel", "Cold room log", "First-aid kit"],
        action: "Report ready, no paperwork",
      },
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
    headline: "Proven where it’s *hardest.*",
    lead: "Customers stay and expand: 8+ years with Licious, seven plants at Wheels India.",
    featured: "wheels-india",
    standard: ["quick-commerce-leaders", "dana", "dominos", "smartworks", "licious"],
    link: { label: "See all customer stories", href: "/customers" },
  },

  // Figures from Atsuya (November 2026): 500+ cities, 3+ countries, 1,60,64,400 sq ft monitored
  // for energy efficiency, 9,90,000 kg of food waste prevented, 1,10,662 t of CO₂ avoided and
  // 73,433 kL of water saved. Shown rounded down, in international units.
  impact: {
    headline: "Our *impact*",
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
    headline: "Find the *savings* already sitting in your operation.",
    button: { label: "Book a site assessment", href: "/book-assessment" },
    line: "A 30-minute call with an AOne engineer. No slideware.",
  },
};
