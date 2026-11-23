// The 13 case studies. Challenge, solution and impact text is taken from
// docs/AOne Industry Solutions with case studies.pdf (pages 11–14, 18–19, 23–24, 28–29, 33–34, 38).
// [TBD: confirm that every customer name is cleared for public use]

export type LayerKey = "iot" | "vision" | "blusquad";

export type CaseStudy = {
  slug: string;
  customer: string;
  named: boolean; // false where the PDF keeps the customer anonymous
  industry: string; // slug into industries.ts
  sector: string; // the PDF's own label for the study
  title: string;
  headline: { value: string; label: string }; // the number that leads the card
  challenge: string[];
  solution: string[];
  impact: string[];
  keyOutcomes: { value: string; label: string }[];
  source?: string;
  solutions: string[]; // slugs into solutions.ts
  layers: LayerKey[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "wheels-india",
    customer: "Wheels India",
    named: true,
    industry: "manufacturing",
    sector: "Automotive and engineering",
    title: "One of the world’s largest wheel manufacturers: from one plant to seven",
    headline: { value: "~₹1 Cr", label: "saved a year" },
    challenge: [
      "High compressed-air consumption and leaks across plants",
      "No real-time view of air use and losses",
      "Water use and leaks not visible in real time",
    ],
    solution: [
      "IoT-based AOne app to monitor and reduce compressed-air consumption and leaks",
      "Live data to guide leak fixes and pressure optimisation",
      "Real-time water monitoring, leak detection and consumption optimisation",
    ],
    impact: [
      "About ₹1 crore saved a year, from compressed air alone",
      "55% less air-compressor leakage",
      "10.68 lakh kWh saved and 875 tCO₂e avoided a year",
    ],
    keyOutcomes: [
      { value: "~₹1 Cr", label: "saved every year" },
      { value: "1.07M kWh", label: "energy saved a year" },
      { value: "55%", label: "less air-compressor leakage" },
      { value: "875 tCO₂e", label: "avoided a year" },
      { value: "7 plants", label: "on AOne" },
    ],
    source: "Disclosed in Wheels India’s Annual Report 2024–25.",
    solutions: ["energy-and-utilities", "esg-reporting"],
    layers: ["iot"],
  },
  {
    slug: "dana",
    customer: "Dana",
    named: true,
    industry: "manufacturing",
    sector: "Automotive and engineering · Quality",
    title: "AI-powered visual inspection of every axle for Dana and its global supplier network",
    headline: { value: "50%+", label: "fewer defects reaching customers" },
    challenge: [
      "Manual inspection depended on operator experience",
      "Subtle cracks, weld defects, dents, rust and paint runs missed in high-volume runs",
      "Paper logs made root-cause analysis incomplete",
    ],
    solution: [
      "AOne Eye captures every axle from multiple angles",
      "AI pass/fail decision in under 2 seconds",
      "Defective parts rejected automatically",
      "Every result logged for traceability",
    ],
    impact: [
      "100% surface coverage across 30+ defect types",
      "50%+ fewer defects reaching customers",
      "Zero defect escapes to OEMs",
      "Lower warranty and rework cost",
    ],
    keyOutcomes: [
      { value: "100%", label: "surface coverage" },
      { value: "99%+", label: "detection accuracy" },
      { value: "<2 s", label: "per inspection" },
      { value: "50%+", label: "fewer defects (PPM)" },
      { value: "30+", label: "defect types" },
      { value: "Zero", label: "escapes to OEMs" },
    ],
    solutions: ["quality-inspection"],
    layers: ["vision"],
  },
  {
    slug: "auto-component-leader",
    customer: "Global auto-component maker",
    named: false,
    industry: "manufacturing",
    sector: "Automotive and engineering",
    title: "Energy, water, equipment health and visual inspection across plants for one of the world’s largest auto-component makers",
    headline: { value: "27%", label: "less compressor downtime" },
    challenge: [
      "Compressed-air losses across plants",
      "Unplanned compressor downtime",
      "Line pressure slow to stabilise",
      "Defects found late by manual checks",
    ],
    solution: [
      "Multi-plant energy and water monitoring",
      "Compressor and line-pressure monitoring with alerts",
      "Equipment health and predictive maintenance",
      "AI visual inspection on the line",
    ],
    impact: [
      "18,000 m³ of compressed air saved a year",
      "27% less compressor downtime",
      "30% fewer defects",
      "Line-pressure stabilisation time halved",
    ],
    keyOutcomes: [
      { value: "18,000 m³", label: "air saved a year" },
      { value: "27%", label: "less compressor downtime" },
      { value: "30%", label: "fewer defects" },
      { value: "2x", label: "faster line pressure" },
    ],
    solutions: ["energy-and-utilities", "asset-health", "quality-inspection"],
    layers: ["iot", "vision"],
  },
  {
    slug: "gokaldas-exports",
    customer: "Gokaldas Exports",
    named: true,
    industry: "manufacturing",
    sector: "Textiles and apparel",
    title: "Indigo Blues, Doddaballapura plant: utility efficiency, cost savings and sustainability",
    headline: { value: "10–15%", label: "lower energy cost" },
    challenge: [
      "Network connectivity issues limiting data visibility",
      "Little remote visibility of utilities across key assets",
      "Hard to analyse and optimise compressed air, steam and water",
      "No benchmarking mechanism (SAM) for the garment industry",
    ],
    solution: [
      "AOne Smart EN on 26 key utility assets: transformers, compressors, water systems and more",
      "4G AOne devices for uninterrupted connectivity",
      "Real-time dashboards for management in Bengaluru",
      "Analysis of compressed-air lines and steam for hot water",
      "SAM (Standard Allowed Minutes) benchmarking",
    ],
    impact: [
      "Cost savings from optimised energy use",
      "Compressed-air leaks arrested, cutting wastage",
      "Better water efficiency and ZLD plant performance",
      "Utility visibility for faster, data-driven decisions",
      "A foundation for industry benchmarking with SAM",
    ],
    keyOutcomes: [
      { value: "10–15%", label: "lower energy cost" },
      { value: "15–20%", label: "lower air losses" },
      { value: "20–25%", label: "better water efficiency" },
      { value: "26 assets", label: "on 4G" },
    ],
    solutions: ["energy-and-utilities", "esg-reporting"],
    layers: ["iot"],
  },
  {
    slug: "quick-commerce-leaders",
    customer: "Blinkit, Amazon Fresh, bigbasket",
    named: true,
    industry: "quick-commerce",
    sector: "Quick commerce",
    title: "Powering 65% of India’s quick commerce, for Blinkit, Amazon Fresh and bigbasket",
    headline: { value: "3,000+", label: "dark stores monitored" },
    challenge: [
      "Temperature excursions across thousands of dark stores",
      "Paper logs and manual temperature checks",
      "No central visibility across cities",
    ],
    solution: [
      "24x7 monitoring of cold rooms, freezers and racks",
      "Instant AI anomaly alerts",
      "Automated compliance reports",
      "One dashboard across 50+ cities",
    ],
    impact: [
      "80% better temperature compliance",
      "2.5% less wastage",
      "100% real-time visibility across dark stores",
      "Millions of orders protected every day",
    ],
    keyOutcomes: [
      { value: "3,000+", label: "dark stores monitored" },
      { value: "1,300+", label: "dark stores with Blinkit" },
      { value: "50+", label: "cities covered" },
      { value: "80%", label: "better temperature compliance" },
      { value: "2.5%", label: "less wastage" },
    ],
    solutions: ["cold-chain"],
    layers: ["iot"],
  },
  {
    slug: "amazon-fresh",
    customer: "Amazon Fresh",
    named: true,
    industry: "quick-commerce",
    sector: "Quick commerce",
    title: "Keeping food fresher across 25 warehouses: land and expand from FY23 to FY25",
    headline: { value: "80%", label: "better temperature compliance" },
    challenge: [
      "Cold-room temperatures checked manually",
      "Room temperature alone did not show product temperature",
      "Compliance hard to prove across warehouses",
    ],
    solution: [
      "FY23: cold-room temperature monitoring",
      "FY24: rolled out to more warehouses",
      "FY24: product-temperature monitoring added",
      "FY25: product and room temperature at scale",
    ],
    impact: [
      "80% improvement in temperature compliance",
      "The food itself is tracked, not just the room",
      "25 warehouses on AOne, with further expansion",
    ],
    keyOutcomes: [
      { value: "25", label: "warehouses" },
      { value: "80%", label: "better temperature compliance" },
      { value: "Product", label: "temperature tracked, not just the room" },
      { value: "FY23 → FY25", label: "land and expand" },
    ],
    solutions: ["cold-chain"],
    layers: ["iot"],
  },
  {
    slug: "dominos",
    customer: "Domino’s",
    named: true,
    industry: "qsr",
    sector: "QSR",
    title: "Slicing energy bills by 22% with facility monitoring and occupancy-based control",
    headline: { value: "22%", label: "lower energy use" },
    challenge: [
      "Energy, DG sets, aircons, cold rooms and makelines not monitored together",
      "Exhaust fans and aircons running past need",
      "Comfort not linked to occupancy",
    ],
    solution: [
      "Monitoring of energy, DG, aircons, cold rooms, makelines and geysers",
      "Direct control of aircons, equipment and CCTV",
      "Occupancy-based comfort control",
      "Larger roll-out in FY25",
    ],
    impact: [
      "22% lower energy use",
      "A further 30% from occupancy-based comfort control",
      "30% less exhaust-fan overrun",
      "20% less aircon overrun",
    ],
    keyOutcomes: [
      { value: "22%", label: "lower energy use" },
      { value: "30%", label: "further, from occupancy-based comfort control" },
      { value: "30%", label: "less exhaust-fan overrun" },
      { value: "20%", label: "less aircon overrun" },
      { value: "30 kWh", label: "saved every day" },
    ],
    solutions: ["energy-and-utilities"],
    layers: ["iot"],
  },
  {
    slug: "global-qsr-chain",
    customer: "Global QSR chain",
    named: false,
    industry: "qsr",
    sector: "QSR",
    title: "Edge AI on existing DVRs across 3,000+ outlets in India",
    headline: { value: "3,000+", label: "outlets on edge AI" },
    challenge: [
      "SOP and safety checks done manually across outlets",
      "Aircons run regardless of footfall",
      "No view of customer flow",
    ],
    solution: [
      "Edge AI on the outlets’ existing DVRs",
      "SOP, safety and customer-flow analytics",
      "Dynamic, occupancy-based AC control",
    ],
    impact: [
      "30% lower energy cost from dynamic AC control",
      "50% better SOP compliance monitoring",
      "Rolled out across 3,000+ outlets",
    ],
    keyOutcomes: [
      { value: "3,000+", label: "outlets in India" },
      { value: "Edge AI", label: "on existing DVRs" },
      { value: "30%", label: "lower energy cost" },
      { value: "50%", label: "better SOP compliance" },
    ],
    solutions: ["safety-and-sop", "energy-and-utilities"],
    layers: ["vision", "iot"],
  },
  {
    slug: "smartworks",
    customer: "Smartworks",
    named: true,
    industry: "smart-buildings",
    sector: "Smart buildings",
    title: "AI-run HVAC across 55+ centres for India’s largest managed office platform",
    headline: { value: "20–30%", label: "energy savings" },
    challenge: [
      "Hotspots and uneven cooling",
      "HVAC running past occupancy hours",
      "Reactive maintenance",
      "No central visibility",
    ],
    solution: [
      "HVAC tuned every minute to occupancy and weather",
      "Right runtime and right settings",
      "Predictive maintenance",
      "One view across all centres",
    ],
    impact: [
      "20–30% energy savings across the portfolio",
      "95%+ system uptime",
      "Better EBITDA every month",
      "Healthier, more comfortable workspaces and stronger ESG",
    ],
    keyOutcomes: [
      { value: "20–30%", label: "energy savings" },
      { value: "95%+", label: "system uptime" },
      { value: "55+", label: "centres in 15+ cities" },
      { value: "~1M sq ft", label: "of offices" },
    ],
    solutions: ["energy-and-utilities", "asset-health"],
    layers: ["iot"],
  },
  {
    slug: "uti-mutual-fund",
    customer: "UTI Mutual Fund",
    named: true,
    industry: "smart-buildings",
    sector: "Smart buildings · BFSI",
    title: "14% less energy across a 1,40,000 sq ft, seven-floor building",
    headline: { value: "14%", label: "less energy" },
    challenge: [
      "Building energy use not visible by floor or system",
      "AC schedules set manually",
      "No baseline to plan energy renovation",
    ],
    solution: [
      "FY24: energy monitoring",
      "Energy renovation and observation analysis",
      "Direct AC control",
      "FY25: larger roll-out",
    ],
    impact: [
      "14% reduction in energy consumption",
      "Whole-building visibility across 7 floors",
      "A data-backed plan for further roll-out",
    ],
    keyOutcomes: [
      { value: "14%", label: "less energy" },
      { value: "1,40,000", label: "sq ft covered" },
      { value: "7", label: "floors" },
      { value: "AC control", label: "automated" },
    ],
    solutions: ["energy-and-utilities"],
    layers: ["iot"],
  },
  {
    slug: "licious",
    customer: "Licious",
    named: true,
    industry: "retail",
    sector: "Retail · Cold chain",
    title: "India’s leading online meat retailer: 700+ cold rooms and 121 retail outlets on AOne",
    headline: { value: "8% → 2%", label: "food wastage" },
    challenge: [
      "Cold rooms where a temperature rise means spoilage",
      "Manual temperature checks",
      "Food wastage around 8%",
    ],
    solution: [
      "Real-time IoT and AI alerts on 700+ cold rooms",
      "Rising temperatures flagged before spoilage",
      "Energy monitoring at retail outlets",
      "Land and expand over 8 years of partnership",
    ],
    impact: [
      "85% better temperature compliance",
      "Food wastage cut from 8% to 2%",
      "₹10 lakh+ of spoilage prevented",
      "100% product quality maintained",
    ],
    keyOutcomes: [
      { value: "700+", label: "cold rooms" },
      { value: "121", label: "retail outlets" },
      { value: "85%", label: "better temperature compliance" },
      { value: "8% → 2%", label: "food wastage" },
      { value: "₹10 lakh+", label: "spoilage prevented" },
      { value: "8 years", label: "of partnership" },
    ],
    solutions: ["cold-chain", "energy-and-utilities"],
    layers: ["iot"],
  },
  {
    slug: "grandiose-uae",
    customer: "Grandiose, UAE",
    named: true,
    industry: "retail",
    sector: "Retail",
    title: "Real-time energy monitoring and HVAC optimisation across 30+ retail facilities",
    headline: { value: "10%", label: "energy reduction" },
    challenge: [
      "Over-cooling in non-critical areas and hours",
      "24x7 operations with high HVAC load",
      "No central energy view across facilities",
    ],
    solution: [
      "Real-time energy monitoring",
      "HVAC optimisation by area and hour",
      "One view across 30+ facilities",
    ],
    impact: [
      "10% energy reduction",
      "Over-cooling eliminated",
      "Comfort and product quality maintained",
    ],
    keyOutcomes: [
      { value: "30+", label: "facilities" },
      { value: "10%", label: "energy reduction" },
      { value: "24x7", label: "operations" },
      { value: "Over-cooling", label: "eliminated" },
    ],
    solutions: ["energy-and-utilities"],
    layers: ["iot"],
  },
  {
    slug: "indianoil",
    customer: "IndianOil",
    named: true,
    industry: "oil-and-gas",
    sector: "Oil and gas · Quality",
    title: "AI inspection of every LPG cylinder for a Fortune 500 LPG leader, on patented technology",
    headline: { value: "2,400/hr", label: "LPG cylinders inspected" },
    challenge: [
      "Manual checks for dents, holes, cuts, cracks, corrosion and missing caps",
      "Slow, inconsistent and error-prone inspection",
      "Sampling instead of 100% inspection",
    ],
    solution: [
      "3D profiling builds a digital twin of each cylinder at 2,400 an hour",
      "OCR reads tare weight, expiry date and cap status on the move",
      "QR identity and defect history for every cylinder",
      "Defective cylinders pulled automatically",
    ],
    impact: [
      "80% less manual inspection time",
      "95%+ defect detection accuracy",
      "100% inspection, zero sampling",
      "Real-time inventory visibility",
    ],
    keyOutcomes: [
      { value: "2,400/hr", label: "cylinders profiled" },
      { value: "95%+", label: "detection accuracy" },
      { value: "80%", label: "less manual inspection time" },
      { value: "100%", label: "inspection, zero sampling" },
      { value: "Patented", label: "Indian Patent 202441033050" },
    ],
    source: "Indian Patent 202441033050.",
    solutions: ["quality-inspection"],
    layers: ["vision"],
  },
];

export const caseStudyBySlug = (slug: string) => caseStudies.find((study) => study.slug === slug);

export const caseStudiesBySlugs = (slugs: string[]) =>
  slugs.map((slug) => caseStudyBySlug(slug)).filter((study): study is CaseStudy => Boolean(study));
