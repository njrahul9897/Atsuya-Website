// The six cross-industry solutions. Each page is one template: the problem, how AOne solves it,
// where it applies, aggregated impact and related case studies. Use cases, impact figures and
// industries are pulled from industries.ts with the `match` patterns below, so they stay in step
// with the industry data. Problem and "how" lines come from the PDF in /docs (pages 6–9, 16, 21,
// 26, 31, 36, 40, 44).

import { industries, type Industry } from "./industries";

export type Solution = {
  slug: string;
  name: string;
  line: string; // one line for menus and cards
  headline: string;
  problem: { headline: string; points: string[] };
  how: { title: string; points: string[] }[];
  match: string; // regex source: which use cases belong to this solution
  impactMatch: string; // regex source: which impact figures belong to this solution
};

export const solutions: Solution[] = [
  {
    slug: "energy-and-utilities",
    name: "Energy and utilities",
    line: "Electricity, compressed air, water, fuel, gas and HVAC on one view.",
    headline: "Six utilities on one view.",
    problem: {
      headline: "The bill arrives monthly. The waste happens every hour.",
      points: [
        "Ever-increasing energy cost",
        "Unmonitored over-run hours",
        "No equipment-level consumption data",
        "20–30% compressor waste and undetected leaks",
        "Unmetered process water",
        "Fuel theft, and boiler and furnace inefficiency",
      ],
    },
    how: [
      { title: "Electricity", points: ["Real-time consumption", "Machine, line and department sub-metering", "Idle detection and power-factor alerts", "Energy audit reports"] },
      { title: "Compressed air", points: ["Leak detection and localisation", "Compressor performance monitoring", "Lower run-hours and energy cost"] },
      { title: "Water", points: ["Process-wise water metering", "Cooling tower monitoring", "Leak detection and alerts", "Water quality monitoring"] },
      { title: "Fuel and diesel", points: ["DG set monitoring", "Fuel dispensing points", "Theft and inefficiency detection"] },
      { title: "LPG and gas", points: ["Gas flow monitoring", "Boiler, furnace and process burner monitoring", "Consumption-based reordering"] },
      { title: "HVAC and temperature", points: ["AHU and chiller monitoring", "Ambient temperature control", "Filter clogging detection", "Energy optimisation"] },
    ],
    match: "energy|electric|utilit|compressed|water|fuel|\\bgas\\b|hvac|\\bdg\\b|lpg|boiler|steam|refrigeration optim|comfort control|overrun",
    impactMatch: "electricity|energy|compressed-air|water",
  },
  {
    slug: "cold-chain",
    name: "Cold chain",
    line: "Cold rooms, freezers, chillers and tankers, logged and alerted in real time.",
    headline: "Every cold room, freezer and tanker, logged by the minute.",
    problem: {
      headline: "A cold chain breaks between two checks.",
      points: [
        "Spoilage from breaks in the cold chain",
        "Paper temperature logs and manual checks",
        "No real-time alerts",
        "FSSAI compliance that is hard to prove",
      ],
    },
    how: [
      { title: "Monitor", points: ["Real-time temperature for cold rooms, freezers, chillers and hot-holding units", "Product temperature, not just room temperature", "Tanker temperature, route and door alerts"] },
      { title: "Alert", points: ["Instant alerts for deviations", "AI anomaly alerts before spoilage"] },
      { title: "Record", points: ["Digital logs and automated compliance reports", "FSSAI-ready records"] },
      { title: "Support", points: ["BluSquad temperature checks, hygiene audits and stock rotation"] },
    ],
    match: "temperature|cold|chill|freez|refriger|tanker|hot.holding|fssai",
    impactMatch: "spoilage|cold-chain|fssai|food-safety|refrigeration",
  },
  {
    slug: "asset-health",
    name: "Asset health and predictive maintenance",
    line: "Vibration, temperature, current and acoustic monitoring that flags failures early.",
    headline: "Know which machine is about to stop.",
    problem: {
      headline: "Breakdowns give warning. Usually nobody is measuring.",
      points: ["Unplanned breakdowns", "High maintenance cost", "Lost production", "No predictive alerts"],
    },
    how: [
      { title: "Sense", points: ["Vibration, temperature, current and acoustic monitoring", "Compressors, chillers, boilers, pumps, AHUs, fryers and ovens"] },
      { title: "Detect", points: ["Anomalies detected early", "Predictive alerts", "Real-time machine utilisation, cycle time and production counts"] },
      { title: "Act", points: ["BluSquad maintenance support", "Lower downtime and maintenance cost"] },
    ],
    match: "health|predictive|maintenance|oee|performance|runtime|process optimis",
    impactMatch: "downtime|maintenance|issue resolution|incident response",
  },
  {
    slug: "quality-inspection",
    name: "Quality inspection",
    line: "Vision AI that inspects every part, pack and label on the line.",
    headline: "Every part inspected, not a sample.",
    problem: {
      headline: "Sampling finds some defects. Customers find the rest.",
      points: ["Manual inspection errors", "Defects reaching customers", "Inconsistent quality checks", "Sampling instead of 100% inspection"],
    },
    how: [
      { title: "Inspect", points: ["Real-time inline inspection", "Surface defects, misalignment and missing parts", "AI pass/fail in under 2 seconds at Dana"] },
      { title: "Verify", points: ["Label and barcode verification", "Packaging integrity", "Missing or incorrect label detection"] },
      { title: "Trace", points: ["Every result logged for traceability", "Defective parts rejected automatically"] },
      { title: "Patented", points: ["3D profiling and OCR for LPG cylinders, Indian Patent 202441033050"] },
    ],
    match: "defect|inspection|label|barcode|dimension|foreign|packaging|planogram|cylinder|line clearance|pack count",
    impactMatch: "defect|quality|planogram",
  },
  {
    slug: "safety-and-sop",
    name: "Safety and SOP compliance",
    line: "PPE, restricted zones, hygiene and SOPs, checked by camera instead of clipboard.",
    headline: "Standards checked on every shift, at every site.",
    problem: {
      headline: "A checklist records what someone remembered to tick.",
      points: [
        "PPE non-compliance",
        "Unauthorised zone entry",
        "Handwash, hygiene and food handling unmonitored",
        "Manual audits and checklists",
        "Inconsistent execution across shifts and sites",
      ],
    },
    how: [
      { title: "Safety", points: ["PPE detection: helmet, gloves and safety vest", "Restricted zone monitoring", "Forklift–pedestrian safety", "Real-time alerts to supervisors"] },
      { title: "SOP and hygiene", points: ["Handwash, food handling and kitchen hygiene", "Opening and closing checklists", "Digital evidence and reports for audits"] },
      { title: "Edge AI", points: ["Runs on the DVRs and CCTV already installed"] },
      { title: "BluSquad", points: ["Hygiene audits and SOP compliance support"] },
    ],
    match: "ppe|sop|hygiene|restricted|unauthoris|safety|security|handwash|fire|smoke|loss prevention|shrinkage|checklist|people counting|vision ai",
    impactMatch: "safety|sop|shrinkage|compliance improvement|compliance records",
  },
  {
    slug: "esg-reporting",
    name: "ESG reporting",
    line: "Energy, water and carbon data collected automatically, ready for disclosure.",
    headline: "ESG numbers that come from meters, not spreadsheets.",
    problem: {
      headline: "ESG reports are built by hand, from numbers nobody metered.",
      points: ["No digital audit records", "Manual data collection", "Hard to track energy, water and carbon footprint", "No standardised reports for ESG disclosures"],
    },
    how: [
      { title: "Measure", points: ["Energy, water, waste and carbon footprint tracked at source", "Flaring, fugitive emissions and leaks monitored"] },
      { title: "Report", points: ["Automated ESG reports", "Energy and water reporting", "Records for statutory audits"] },
      { title: "Certify", points: ["Support for green building certifications"] },
    ],
    match: "esg|carbon|emission|reporting|compliance records|automated compliance|effluent",
    impactMatch: "carbon|emissions|water|digital compliance",
  },
];

export const solutionBySlug = (slug: string) => solutions.find((solution) => solution.slug === slug);

export const industriesForSolution = (slug: string): Industry[] => industries.filter((industry) => industry.solutions.includes(slug));

// Use cases for a solution inside one industry: zone use cases and layer use cases that match.
export function matchingUseCases(solution: Solution, industry: Industry): string[] {
  const pattern = new RegExp(solution.match, "i");
  const found = new Set<string>();
  for (const zone of industry.zones) {
    for (const useCase of zone.useCases) {
      if (pattern.test(`${zone.name} ${useCase}`)) found.add(`${zone.name}: ${useCase.charAt(0).toLowerCase()}${useCase.slice(1)}`);
    }
  }
  for (const useCase of [...industry.useCases.iot, ...industry.useCases.vision, ...industry.useCases.blusquad]) {
    if (pattern.test(useCase)) found.add(useCase);
  }
  return [...found];
}

// Typical results for a solution, gathered across the industries it applies to.
export function impactFor(solution: Solution): { value: string; label: string; industry: string }[] {
  const pattern = new RegExp(solution.impactMatch, "i");
  return industriesForSolution(solution.slug).flatMap((industry) =>
    industry.impact
      .filter((item) => /\d/.test(item.value) && pattern.test(item.label))
      .map((item) => ({ ...item, industry: industry.name })),
  );
}
