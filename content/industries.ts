// The eight industries. Every industry page, tile, mega-menu entry and estimator option renders
// from this file, so adding an industry is a data change. Copy is final unless marked [TBD].
// Source: the build brief and docs/AOne Industry Solutions with case studies.pdf.

export type Industry = {
  slug: string;
  name: string;
  siteNoun: string;
  promise: string;
  sub: string;
  heroStat: { value: string; label: string; source: string };
  video: { src: string; srcMobile: string; poster: string; posterMobile?: string }; // posterMobile: a 9:16 crop for phones
  challenges: { title: string; points: string[] }[];
  zones: { id: string; name: string; useCases: string[] }[];
  useCases: { iot: string[]; vision: string[]; blusquad: string[] };
  impact: { value: string; label: string }[];
  caseStudies: string[]; // slugs into caseStudies.ts
  proofPoints?: string[];
  subSectors?: { id: string; name: string; focus: string[]; proof: string }[];
  solutions: string[]; // slugs into solutions.ts
  cta: string;
};

// Placeholder clips cut from the brand films by scripts/make-placeholder-videos.mjs. A WebM with
// the same name sits beside each MP4. Drop the real 20–30 s films in under the same names.
const video = (slug: string) => ({
  src: `/videos/industries/${slug}.mp4`,
  srcMobile: `/videos/industries/${slug}-720.mp4`,
  poster: `/videos/industries/${slug}.jpg`,
  posterMobile: `/videos/industries/${slug}-mobile.jpg`,
});

export const industries: Industry[] = [
  {
    slug: "manufacturing",
    name: "Manufacturing",
    siteNoun: "factory",
    promise: "A factory that tells you what it needs, before it stops.",
    sub: "Machines, utilities, quality and safety on one platform, from raw material to dispatch.",
    heroStat: { value: "~₹1 Cr", label: "saved a year, from compressed air alone", source: "Wheels India · Annual Report 2024–25" },
    video: video("manufacturing"),
    challenges: [
      { title: "Machine downtime", points: ["Unplanned breakdowns", "High maintenance cost", "Lost production"] },
      { title: "Energy consumption", points: ["Rising cost", "Over-run hours", "No equipment-level data"] },
      { title: "Compressed air", points: ["20–30% compressor waste", "Undetected leaks"] },
      { title: "Water usage", points: ["Unmetered process use", "No quality monitoring"] },
      { title: "Fuel and gas", points: ["Theft and pilferage", "Boiler and furnace inefficiency"] },
      { title: "Quality issues", points: ["Manual inspection errors", "Defects reaching customers"] },
      { title: "Safety and compliance", points: ["PPE non-compliance", "Unauthorised zone entry", "Manual audits"] },
      { title: "Low OEE", points: ["No real-time utilisation", "Idle time", "Hidden capacity losses"] },
      { title: "ESG reporting", points: ["No digital audit records", "Hard to report sustainability"] },
    ],
    zones: [
      { id: "raw-material", name: "Raw material handling", useCases: ["Material flow monitoring", "Weighbridge automation", "Silo and tank monitoring"] },
      { id: "processing", name: "Processing and production", useCases: ["Machine health", "OEE monitoring", "Process optimisation", "Line-wise production"] },
      { id: "quality", name: "Quality inspection", useCases: ["Defect detection", "Label verification", "Dimension checks", "AI-based inspection"] },
      { id: "packaging", name: "Packaging and dispatch", useCases: ["Packaging monitoring", "Barcode verification", "Line clearance"] },
      { id: "utilities", name: "Utilities and infrastructure", useCases: ["Electricity, air, water, gas and fuel monitoring", "HVAC and temperature", "Utility optimisation"] },
      { id: "esg", name: "ESG and compliance", useCases: ["Energy and water reporting", "Carbon footprint", "Automated compliance"] },
    ],
    useCases: {
      iot: [
        "Machine health and predictive maintenance: vibration, temperature, current and acoustic monitoring",
        "Utilities monitoring for all six utilities",
        "OEE and production counts",
        "Material handling and WIP traceability",
        "Centralised dashboard and automated reports",
      ],
      vision: ["Inline defect detection", "PPE compliance", "Label and barcode verification", "Restricted zones and forklift–pedestrian safety"],
      blusquad: ["Monitoring, maintenance and compliance support", "Continuous improvement"],
    },
    impact: [
      { value: "30–40%", label: "less unplanned downtime" },
      { value: "15–25%", label: "electricity savings" },
      { value: "25%", label: "less compressed-air waste" },
      { value: "70%", label: "lower defect escape rate" },
      { value: "18%", label: "water savings" },
      { value: "60%", label: "fewer safety incidents" },
    ],
    subSectors: [
      { id: "process", name: "Heavy / process", focus: ["Compressors, boilers and fuel", "Transformer and power quality", "Predictive maintenance"], proof: "15% lower transformer input-power loss" },
      { id: "automotive", name: "Automotive and engineering", focus: ["Compressed air and water", "AI vision inspection", "Machine health and OEE"], proof: "~₹1 Cr saved a year at Wheels India" },
      { id: "food-beverage", name: "Food and beverage", focus: ["Cold rooms and chillers", "Hygiene and SOP", "FSSAI-ready records"], proof: "80% better compliance at a leading dairy" },
      { id: "textiles", name: "Textiles and apparel", focus: ["Compressed air, steam and water", "ZLD", "SAM benchmarking"], proof: "10–15% lower energy cost at Gokaldas Exports" },
      { id: "pharma", name: "Pharma and life sciences", focus: ["Clean-room temperature and humidity", "HVAC and AHU", "Audit-ready records"], proof: "3 of the top 10 laboratories run on AOne" },
      { id: "electronics", name: "Electronics and electricals", focus: ["Energy and power quality", "Vision AI for assembly and labels", "Compressed air and HVAC"], proof: "The same AOne stack as automotive and process plants" },
    ],
    caseStudies: ["wheels-india", "dana", "auto-component-leader", "gokaldas-exports"],
    solutions: ["energy-and-utilities", "asset-health", "quality-inspection", "safety-and-sop", "esg-reporting"],
    cta: "Book a plant assessment",
  },
  {
    slug: "quick-commerce",
    name: "Quick commerce",
    siteNoun: "dark-store network",
    promise: "Fresh at every dark store, in every city, every minute.",
    sub: "Cold chain, energy, shrinkage and SOPs monitored across thousands of stores from one screen.",
    heroStat: { value: "65%", label: "of India’s quick commerce runs on AOne", source: "Blinkit, Amazon Fresh, bigbasket" },
    video: video("quick-commerce"),
    challenges: [
      { title: "Temperature excursions", points: ["Cold-chain breaks", "Manual checks", "No real-time alerts"] },
      { title: "Refrigeration energy", points: ["Rising cost", "Unmonitored compressor run hours"] },
      { title: "Inventory shrinkage", points: ["Pilferage", "Unauthorised access", "Expired stock"] },
      { title: "SOP compliance", points: ["Hygiene across locations", "Manual audits"] },
      { title: "Manual monitoring", points: ["Paper logs", "Delayed detection", "No central view"] },
      { title: "Workforce", points: ["High attrition", "Inconsistent execution across shifts"] },
    ],
    zones: [
      { id: "cold-room", name: "Cold room", useCases: ["Real-time temperature", "Instant alerts", "Digital logs"] },
      { id: "freezers", name: "Freezers and chillers", useCases: ["Compressor performance", "Predictive alerts"] },
      { id: "picking-aisles", name: "Picking aisles", useCases: ["Inventory movement", "Picking activity"] },
      { id: "entry", name: "Entry and back door", useCases: ["Vision AI for unauthorised access"] },
      { id: "store-floor", name: "Store floor", useCases: ["Hygiene compliance", "PPE compliance", "SOP compliance"] },
      { id: "electrical-panel", name: "Electrical panel", useCases: ["Outlet-level energy", "Equipment-level energy"] },
    ],
    useCases: {
      iot: ["Refrigeration optimisation", "Temperature monitoring", "Energy monitoring"],
      vision: ["Shrinkage prevention", "SOP and hygiene compliance", "PPE and restricted zones"],
      blusquad: ["Temperature checks, hygiene audits and stock rotation"],
    },
    impact: [
      { value: "30%", label: "lower spoilage cost" },
      { value: "20–25%", label: "refrigeration energy savings" },
      { value: "40–60%", label: "lower shrinkage" },
      { value: "80%", label: "compliance improvement" },
    ],
    caseStudies: ["quick-commerce-leaders", "amazon-fresh"],
    solutions: ["cold-chain", "energy-and-utilities", "safety-and-sop"],
    cta: "Book a dark-store pilot",
  },
  {
    slug: "qsr",
    name: "QSR",
    siteNoun: "outlet",
    promise: "Every outlet on brand standard, every shift.",
    sub: "Food safety, energy, equipment and SOPs, watched in real time across every kitchen.",
    heroStat: { value: "22%", label: "lower energy use", source: "Domino’s" },
    video: video("qsr"),
    challenges: [
      { title: "Kitchen temperature deviations", points: ["Spoilage risk", "Manual checks", "FSSAI risk"] },
      { title: "High energy use", points: ["HVAC, kitchen equipment and lighting", "No view across outlets"] },
      { title: "SOP non-compliance", points: ["Handwash, PPE and food handling unmonitored"] },
      { title: "Equipment breakdowns", points: ["Fryer, oven, chiller and exhaust failures"] },
      { title: "Workforce gaps", points: ["Inconsistent opening and closing", "High turnover"] },
      { title: "Manual records", points: ["Paper checklists", "Slow audits"] },
    ],
    zones: [
      { id: "cold-storage", name: "Cold storage", useCases: ["Temperature monitoring", "Digital logs"] },
      { id: "makeline", name: "Makeline and hot holding", useCases: ["Temperature alerts"] },
      { id: "fryers-ovens", name: "Fryers and ovens", useCases: ["Predictive maintenance"] },
      { id: "handwash-prep", name: "Handwash and prep", useCases: ["Vision AI SOP compliance"] },
      { id: "dining-hvac", name: "Dining and HVAC", useCases: ["Occupancy-based comfort control"] },
      { id: "exhaust-dg", name: "Exhaust and DG", useCases: ["Overrun detection"] },
    ],
    useCases: {
      iot: ["Kitchen and cold-storage monitoring", "Energy and HVAC management", "Predictive maintenance", "Opening and closing checklists"],
      vision: ["Handwash, PPE, food handling and hygiene", "Customer-flow analytics on existing DVRs"],
      blusquad: ["Temperature checks, hygiene audits and SOP compliance"],
    },
    impact: [
      { value: "100%", label: "digital food-safety audit trail" },
      { value: "12–18%", label: "electricity savings" },
      { value: "92%", label: "SOP compliance improvement" },
      { value: "40%", label: "faster issue resolution" },
    ],
    caseStudies: ["dominos", "global-qsr-chain"],
    solutions: ["cold-chain", "energy-and-utilities", "asset-health", "safety-and-sop"],
    cta: "Book an outlet assessment",
  },
  {
    slug: "smart-buildings",
    name: "Smart buildings",
    siteNoun: "building",
    promise: "Buildings that cool, light and run to how they’re used.",
    sub: "Energy, HVAC, assets, safety and ESG for offices and campuses, on one dashboard.",
    heroStat: { value: "20–30%", label: "energy savings across 55+ centres", source: "Smartworks" },
    video: video("smart-buildings"),
    challenges: [
      { title: "High energy use", points: ["HVAC, lighting, lifts and pumps", "No real-time view"] },
      { title: "HVAC and comfort", points: ["Over-cooling", "Poor air quality", "Manual control"] },
      { title: "Equipment", points: ["Chiller, AHU, pump and DG breakdowns"] },
      { title: "Safety and compliance", points: ["Manual audits", "Fire and life-safety records"] },
      { title: "Occupant experience", points: ["Complaints", "Slow response"] },
      { title: "ESG reporting", points: ["Manual data", "No standard reports"] },
    ],
    zones: [
      { id: "chiller-plant", name: "Chiller plant and AHUs", useCases: ["Performance monitoring", "Predictive alerts"] },
      { id: "office-floors", name: "Office floors", useCases: ["Temperature and humidity", "Indoor air quality", "Occupancy"] },
      { id: "lifts-pumps", name: "Lifts and pumps", useCases: ["Asset health"] },
      { id: "dg-set", name: "DG set", useCases: ["Runtime", "Fuel"] },
      { id: "lobby-security", name: "Lobby and security", useCases: ["Vision AI", "People counting"] },
      { id: "rooftop-meters", name: "Rooftop and meters", useCases: ["Energy", "Water", "Carbon"] },
    ],
    useCases: {
      iot: ["Energy monitoring and optimisation", "HVAC and environment", "Asset health", "ESG management", "Compliance records"],
      vision: ["PPE", "Restricted areas", "People counting and occupancy", "Fire and smoke detection"],
      blusquad: ["Proactive monitoring, maintenance and compliance support"],
    },
    impact: [
      { value: "15–25%", label: "lower electricity use" },
      { value: "20–30%", label: "lower maintenance cost" },
      { value: "25%", label: "lower carbon footprint" },
      { value: "40%", label: "faster issue resolution" },
      { value: "100%", label: "digital compliance records" },
    ],
    caseStudies: ["smartworks", "uti-mutual-fund"],
    solutions: ["energy-and-utilities", "asset-health", "safety-and-sop", "esg-reporting"],
    cta: "Book a building assessment",
  },
  {
    slug: "retail",
    name: "Retail",
    siteNoun: "store",
    promise: "Every store compliant, efficient and on-planogram.",
    sub: "Cold zones, energy, shrinkage, shelves and footfall, compared across every store.",
    heroStat: { value: "8% → 2%", label: "food wastage", source: "Licious" },
    video: video("retail"),
    challenges: [
      { title: "Chiller compliance", points: ["Spoilage risk", "Manual checks", "FSSAI"] },
      { title: "High energy", points: ["Long-running chillers, HVAC and lighting", "No benchmarking"] },
      { title: "Shrinkage", points: ["Theft", "Mis-scans", "Manual tracking"] },
      { title: "Planogram non-compliance", points: ["Misplaced stock", "Out-of-stocks"] },
      { title: "Limited footfall insight", points: ["No dwell time or movement data"] },
      { title: "Manual audits", points: ["Paper checklists", "Inconsistent quality"] },
    ],
    zones: [
      { id: "cold-zone", name: "Cold zone and chillers", useCases: ["Temperature monitoring", "Digital records"] },
      { id: "aisles-shelves", name: "Aisles and shelves", useCases: ["AI planogram monitoring"] },
      { id: "high-value", name: "High-value zone", useCases: ["Loss prevention"] },
      { id: "entrance", name: "Entrance", useCases: ["Footfall", "Dwell time"] },
      { id: "back-store", name: "Back store", useCases: ["Inward inventory", "Outward inventory"] },
      { id: "electrical-panel", name: "Electrical panel", useCases: ["Energy benchmarking"] },
    ],
    useCases: {
      iot: ["Chiller and cold-zone monitoring", "Energy and utility optimisation", "Inventory traceability (barcode, RFID)"],
      vision: ["Loss prevention", "Planogram compliance", "Footfall heatmaps", "SOP and hygiene"],
      blusquad: ["Audits and compliance support"],
    },
    impact: [
      { value: "100%", label: "digital cold-chain records" },
      { value: "15–20%", label: "electricity savings" },
      { value: "20–35%", label: "less shrinkage" },
      { value: "90%+", label: "planogram compliance" },
    ],
    caseStudies: ["licious", "grandiose-uae"],
    solutions: ["cold-chain", "energy-and-utilities", "safety-and-sop"],
    cta: "Book a store assessment",
  },
  {
    slug: "oil-and-gas",
    name: "Oil & gas",
    siteNoun: "value chain",
    promise: "Safer, leaner operations from wellhead to cylinder.",
    sub: "Asset health, energy, emissions and safety across upstream, midstream and downstream.",
    heroStat: { value: "2,400/hr", label: "LPG cylinders inspected by patented AI", source: "IndianOil · Patent 202441033050" },
    video: video("oil-and-gas"),
    challenges: [
      { title: "Asset reliability", points: ["Pump, compressor and turbine failures"] },
      { title: "High energy", points: ["Compression, pumping and heating costs"] },
      { title: "Safety, health and environment", points: ["Leaks", "Hazardous emissions", "Worker safety"] },
      { title: "Leakage and emissions", points: ["Flaring", "Fugitive emissions", "Regulation"] },
      { title: "Fragmented data", points: ["SCADA, DCS and historians with no unified view"] },
      { title: "Compliance reporting", points: ["Manual collection", "Slow audits"] },
    ],
    zones: [
      { id: "upstream", name: "Upstream", useCases: ["Exploration and production"] },
      { id: "midstream", name: "Midstream", useCases: ["Processing", "Pipelines: pressure, temperature and flow"] },
      { id: "downstream", name: "Downstream", useCases: ["Refining and storage", "LPG bottling and distribution"] },
    ],
    useCases: {
      iot: ["Asset health and predictive maintenance", "Energy optimisation", "Pipeline and facility monitoring", "SCADA and DCS integration"],
      vision: ["Gas-leak detection", "PPE and restricted areas", "AI cylinder inspection (3D profiling, OCR)"],
      blusquad: ["Proactive monitoring, maintenance and compliance support"],
    },
    impact: [
      { value: "20–40%", label: "less unplanned downtime" },
      { value: "10–25%", label: "energy cost savings" },
      { value: "Lower", label: "emissions" },
      { value: "Unified", label: "visibility across sites" },
    ],
    caseStudies: ["indianoil"],
    solutions: ["asset-health", "energy-and-utilities", "quality-inspection", "safety-and-sop", "esg-reporting"],
    cta: "Book a site assessment",
  },
  {
    slug: "dairy",
    name: "Dairy",
    siteNoun: "dairy chain",
    promise: "From milk intake to dispatch, nothing warms up unnoticed.",
    sub: "Cold chain, energy, water, quality and equipment across collection, processing and distribution.",
    heroStat: { value: "80%", label: "better compliance", source: "A leading dairy brand" },
    video: video("dairy"),
    challenges: [
      { title: "Cold-chain deviations", points: ["Spoilage across collection, processing and storage"] },
      { title: "High energy", points: ["Chillers, refrigeration and boilers", "Compressed air"] },
      { title: "Quality and safety", points: ["Contamination risk", "Manual checks", "FSSAI"] },
      { title: "Equipment breakdowns", points: ["Chillers, boilers, pumps and homogenisers"] },
      { title: "Milk collection", points: ["Quality at centres", "Tanker temperature and routes"] },
      { title: "Manual reporting", points: ["No digital audit trail", "Data silos"] },
    ],
    zones: [
      { id: "collection-centre", name: "Collection centre", useCases: ["Bulk milk chiller temperature"] },
      { id: "tanker", name: "Tanker", useCases: ["Temperature", "Route", "Door alerts"] },
      { id: "processing", name: "Processing", useCases: ["Pasteuriser, homogeniser and boiler health"] },
      { id: "cold-storage", name: "Cold storage", useCases: ["Temperature and humidity"] },
      { id: "packaging", name: "Packaging", useCases: ["Line OEE", "Pack counts", "Vision AI defect detection"] },
      { id: "water-etp", name: "Water and ETP", useCases: ["Consumption", "Effluent quality", "Leaks"] },
    ],
    useCases: {
      iot: ["Tanker monitoring", "Cold storage", "Energy and utilities", "Water management", "Equipment health", "Production and packaging"],
      vision: ["Foreign objects, spillage and packaging defects", "PPE and hygiene"],
      blusquad: ["Hygiene audits, SOP compliance and maintenance"],
    },
    impact: [
      { value: "100%", label: "cold-chain compliance" },
      { value: "15–25%", label: "energy savings" },
      { value: "40–60%", label: "lower water losses" },
      { value: "30–50%", label: "less downtime" },
      { value: "99%+", label: "product quality compliance" },
    ],
    proofPoints: [
      "Leading dairy brand: 24x7 bulk milk chiller monitoring, 80% better compliance",
      "Leading ice-cream brand: 15% less daily energy per chiller",
      "2 of the top 10 ice-cream brands served",
    ],
    caseStudies: [],
    solutions: ["cold-chain", "energy-and-utilities", "asset-health", "quality-inspection", "safety-and-sop"],
    cta: "Book a plant assessment",
  },
  {
    slug: "horeca",
    name: "HoReCa",
    siteNoun: "property",
    promise: "Guests feel the comfort. You see the savings.",
    sub: "Kitchens, cold chain, HVAC, energy and safety across hotels and restaurants.",
    heroStat: { value: "20%", label: "lower LPG use", source: "A leading hotel chain" },
    video: video("horeca"),
    challenges: [
      { title: "Cold-chain compliance", points: ["Spoilage", "Manual checks", "FSSAI"] },
      { title: "High energy", points: ["HVAC, kitchens and laundry", "No occupancy control"] },
      { title: "Equipment breakdowns", points: ["Chillers, boilers and HVAC"] },
      { title: "Safety and security", points: ["Guest areas", "Restricted zones"] },
      { title: "Inconsistent standards", points: ["SOPs across outlets", "Staff turnover"] },
      { title: "Water", points: ["Leaks", "High kitchen and laundry use"] },
    ],
    zones: [
      { id: "kitchen-cold-room", name: "Kitchen and cold room", useCases: ["FSSAI-ready temperature logs", "LPG monitoring"] },
      { id: "guest-rooms", name: "Guest rooms", useCases: ["Occupancy-based HVAC"] },
      { id: "laundry", name: "Laundry", useCases: ["Energy", "Water"] },
      { id: "lobby-entries", name: "Lobby and entries", useCases: ["Vision AI security"] },
      { id: "plant-room", name: "Plant room", useCases: ["Chiller and boiler predictive maintenance"] },
      { id: "restaurant", name: "Restaurant", useCases: ["Comfort", "Hot holding"] },
    ],
    useCases: {
      iot: ["Kitchen and cold-chain monitoring", "Energy management", "HVAC optimisation", "Predictive maintenance"],
      vision: ["Guest safety and security", "Hygiene and SOP"],
      blusquad: ["Temperature checks, hygiene audits and digital reporting"],
    },
    impact: [
      { value: "100%", label: "FSSAI-ready digital temperature logs" },
      { value: "18–22%", label: "electricity savings" },
      { value: "70%", label: "faster incident response" },
      { value: "35%", label: "fewer emergency maintenance calls" },
    ],
    proofPoints: [
      "Leading hotel chain: 20% lower LPG consumption",
      "3 of the top 10 hotel chains on AOne",
      "Leading cloud kitchen: 60% better hot-holding compliance",
    ],
    caseStudies: [],
    solutions: ["cold-chain", "energy-and-utilities", "asset-health", "safety-and-sop"],
    cta: "Book a property assessment",
  },
];

// Short proof lines for the mega menu (first line) and the /industries tiles (both lines).
export const industryProofLines: Record<string, [string, string]> = {
  manufacturing: ["~₹1 Cr saved a year at Wheels India", "50%+ fewer defects at Dana"],
  "quick-commerce": ["3,000+ dark stores", "65% of India’s quick commerce"],
  qsr: ["3,000+ outlets on edge AI", "22% lower energy use at Domino’s"],
  "smart-buildings": ["55+ Smartworks centres", "14% less energy at UTI Mutual Fund"],
  retail: ["700+ Licious cold rooms", "30+ Grandiose facilities in the UAE"],
  "oil-and-gas": ["2,400 LPG cylinders inspected an hour", "Indian Patent 202441033050"],
  dairy: ["80% better compliance at a leading dairy brand", "2 of the top 10 ice-cream brands"],
  horeca: ["20% lower LPG use at a leading hotel chain", "3 of the top 10 hotel chains"],
};

export const industryBySlug = (slug: string) => industries.find((industry) => industry.slug === slug);

// The industry's electricity or energy savings range, read from `impact` for the savings estimator.
export function energySavingsRange(industry: Industry): { min: number; max: number; label: string } | null {
  const entry = industry.impact.find((item) => /electricity|energy/i.test(item.label) && /\d/.test(item.value));
  if (!entry) return null;
  const numbers = entry.value.match(/\d+(\.\d+)?/g)?.map(Number) ?? [];
  if (numbers.length === 0) return null;
  return { min: numbers[0], max: numbers[numbers.length - 1], label: `${entry.value} ${entry.label}` };
}
