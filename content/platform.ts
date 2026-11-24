// The AOne platform: three layers, the architecture, deployment and integrations.
// Readout values inside `mock` are illustrative UI content for the mock-ups, not customer data.

import type { LayerKey } from "./caseStudies";

export type MockRow = { label: string; value?: string; status: "ok" | "warn" | "alert" | "live" };

export type Layer = {
  key: LayerKey;
  slug: string;
  name: string;
  aka?: string;
  line: string; // the homepage and menu line
  hero: { headline: string; sub: string };
  capabilities: { title: string; points: string[]; mock: { title: string; rows: MockRow[] } }[];
  notes?: { label: string; title: string; body: string; href?: string }[];
  caseStudies: string[];
  proofTbd?: string;
};

export const layers: Layer[] = [
  {
    key: "iot",
    slug: "aone-iot",
    name: "AOne IoT",
    line: "Connects machines, utilities and processes for real-time visibility.",
    hero: {
      headline: "Every machine, meter and cold room on one live view.",
      sub: "AOne IoT connects machines, utilities and processes for real-time visibility and intelligence.",
    },
    capabilities: [
      {
        title: "Utilities monitoring",
        points: ["Electricity, compressed air and water", "Fuel and diesel, LPG and gas", "HVAC and temperature"],
        mock: {
          title: "Utilities · Plant 1",
          rows: [
            { label: "Electricity", value: "412 kW", status: "ok" },
            { label: "Compressed air", value: "6.8 bar", status: "warn" },
            { label: "Water", value: "18 m³/h", status: "ok" },
            { label: "LPG", value: "64%", status: "ok" },
          ],
        },
      },
      {
        title: "Machine health",
        points: ["Vibration and temperature", "Current and acoustic monitoring", "Anomalies detected early"],
        mock: {
          title: "Machine health · Line 2",
          rows: [
            { label: "Compressor 1 · vibration", value: "2.1 mm/s", status: "ok" },
            { label: "Compressor 2 · vibration", value: "7.4 mm/s", status: "alert" },
            { label: "Chiller · current", value: "38 A", status: "ok" },
            { label: "Pump 4 · temperature", value: "61°C", status: "ok" },
          ],
        },
      },
      {
        title: "Cold-chain temperature",
        points: ["Cold rooms, freezers, chillers and tankers", "Instant alerts", "Digital logs"],
        mock: {
          title: "Cold chain · Store 14",
          rows: [
            { label: "Cold room 1", value: "3.2°C", status: "ok" },
            { label: "Cold room 2", value: "3.8°C", status: "ok" },
            { label: "Freezer 3", value: "−12.6°C", status: "alert" },
            { label: "Chiller rack", value: "4.1°C", status: "ok" },
          ],
        },
      },
      {
        title: "OEE",
        points: ["Real-time machine utilisation", "Cycle time", "Production counts"],
        mock: {
          title: "OEE · Shift B",
          rows: [
            { label: "Line 1", value: "Running", status: "ok" },
            { label: "Line 2", value: "Idle 12 min", status: "warn" },
            { label: "Line 3", value: "Running", status: "ok" },
            { label: "Count", value: "1,284", status: "live" },
          ],
        },
      },
      {
        title: "Centralised dashboard and automated reports",
        points: ["Real-time visibility across sites", "Alerts", "Automated reports"],
        mock: {
          title: "All sites",
          rows: [
            { label: "Sites online", value: "24 of 24", status: "ok" },
            { label: "Open alerts", value: "3", status: "warn" },
            { label: "Weekly report", value: "Sent Mon 08:00", status: "ok" },
            { label: "Live feed", value: "Now", status: "live" },
          ],
        },
      },
    ],
    caseStudies: ["wheels-india", "smartworks", "licious"],
  },
  {
    key: "vision",
    slug: "vision-ai",
    name: "Vision AI",
    aka: "AOne Eye",
    line: "Automates quality, safety and compliance with computer vision.",
    hero: {
      headline: "Cameras that check, not just record.",
      sub: "Vision AI automates quality, safety and compliance with computer vision, on the line and on the cameras you already own.",
    },
    capabilities: [
      {
        title: "Defect detection",
        points: ["30+ defect types at Dana", "Pass/fail in under 2 seconds", "Defective parts rejected automatically"],
        mock: {
          title: "Inline inspection · Station 3",
          rows: [
            { label: "Part 0412", value: "Pass", status: "ok" },
            { label: "Part 0413", value: "Fail · weld", status: "alert" },
            { label: "Part 0414", value: "Pass", status: "ok" },
            { label: "Inspecting", value: "Part 0415", status: "live" },
          ],
        },
      },
      {
        title: "PPE and restricted zones",
        points: ["Helmet, gloves and safety vest", "Unauthorised zone entry", "Forklift–pedestrian safety"],
        mock: {
          title: "Safety · Bay 2",
          rows: [
            { label: "Helmet", value: "PPE OK", status: "ok" },
            { label: "Safety vest", value: "No vest", status: "alert" },
            { label: "Restricted zone", value: "Clear", status: "ok" },
            { label: "Camera 6", value: "Live", status: "live" },
          ],
        },
      },
      {
        title: "Label and barcode verification",
        points: ["Missing or incorrect labels", "Barcode verification", "Packaging integrity"],
        mock: {
          title: "Packaging · Line 4",
          rows: [
            { label: "Label", value: "Verified", status: "ok" },
            { label: "Barcode", value: "Verified", status: "ok" },
            { label: "Seal", value: "Check", status: "warn" },
            { label: "Camera 2", value: "Live", status: "live" },
          ],
        },
      },
      {
        title: "Planogram and footfall",
        points: ["AI-based shelf monitoring", "Customer counting and dwell time", "Heatmaps and zone analytics"],
        mock: {
          title: "Store 7 · Aisle 3",
          rows: [
            { label: "Shelf A", value: "On planogram", status: "ok" },
            { label: "Shelf B", value: "Gap found", status: "warn" },
            { label: "Entrance", value: "Counting", status: "live" },
            { label: "High-value zone", value: "Clear", status: "ok" },
          ],
        },
      },
      {
        title: "SOP and hygiene",
        points: ["Handwash, PPE and food handling", "Kitchen hygiene", "Digital evidence and reports for audits"],
        mock: {
          title: "Kitchen · Outlet 212",
          rows: [
            { label: "Handwash", value: "Done", status: "ok" },
            { label: "Gloves", value: "Missing", status: "alert" },
            { label: "Hair net", value: "OK", status: "ok" },
            { label: "DVR channel 3", value: "Live", status: "live" },
          ],
        },
      },
    ],
    notes: [
      {
        label: "Edge AI",
        title: "Runs on the DVRs you already have",
        body: "A global QSR chain runs AOne edge AI on the existing DVRs in 3,000+ outlets in India, for SOP, safety and customer-flow analytics.",
        href: "/customers/global-qsr-chain",
      },
      {
        label: "Indian Patent 202441033050",
        title: "Patented LPG cylinder profiling",
        body: "At IndianOil, 3D profiling builds a digital twin of each cylinder at 2,400 an hour while OCR reads tare weight, expiry date and cap status on the move.",
        href: "/customers/indianoil",
      },
    ],
    caseStudies: ["dana", "indianoil", "global-qsr-chain"],
  },
  {
    key: "blusquad",
    slug: "blusquad",
    name: "BluSquad",
    line: "Expert people on monitoring, maintenance and compliance, so nothing waits.",
    hero: {
      headline: "People on every alert, so nothing waits.",
      sub: "BluSquad is the managed service behind AOne: expert support for monitoring, maintenance, compliance and continuous improvement.",
    },
    capabilities: [
      {
        title: "Proactive monitoring and alerts",
        points: ["Proactive monitoring of live alerts", "Resolution support", "Continuous, efficient operations"],
        mock: {
          title: "BluSquad · Open alerts",
          rows: [
            { label: "Freezer 3 · Store 14", value: "Engineer assigned", status: "warn" },
            { label: "Compressor 2 · Plant 1", value: "On site", status: "live" },
            { label: "AHU 5 · Tower B", value: "Resolved", status: "ok" },
            { label: "Cold room 2 · Store 9", value: "Resolved", status: "ok" },
          ],
        },
      },
      {
        title: "Temperature checks",
        points: ["Support for temperature checks", "Stock rotation", "Digital reporting"],
        mock: {
          title: "Temperature checks · Today",
          rows: [
            { label: "06:00 round", value: "Done", status: "ok" },
            { label: "12:00 round", value: "Done", status: "ok" },
            { label: "18:00 round", value: "In progress", status: "live" },
            { label: "Stock rotation", value: "Due", status: "warn" },
          ],
        },
      },
      {
        title: "Hygiene audits",
        points: ["Hygiene audits", "SOP compliance support", "Digital audits and reporting"],
        mock: {
          title: "Hygiene audit · Outlet 212",
          rows: [
            { label: "Handwash station", value: "Pass", status: "ok" },
            { label: "Prep surfaces", value: "Pass", status: "ok" },
            { label: "Cold storage", value: "Action raised", status: "warn" },
            { label: "Report", value: "Filed", status: "ok" },
          ],
        },
      },
      {
        title: "Maintenance and compliance support",
        points: ["Expert support for maintenance", "Compliance and operations support", "Task monitoring"],
        mock: {
          title: "Maintenance · This week",
          rows: [
            { label: "Chiller service", value: "Scheduled", status: "ok" },
            { label: "Compressor 2 bearing", value: "Raised", status: "warn" },
            { label: "Fire audit records", value: "Up to date", status: "ok" },
            { label: "DG run test", value: "Done", status: "ok" },
          ],
        },
      },
      {
        title: "Continuous improvement",
        points: ["[TBD: describe the continuous-improvement service]"],
        mock: {
          title: "Improvement log",
          rows: [
            { label: "Air leak · Line 2", value: "Fixed", status: "ok" },
            { label: "AC schedule · Floor 4", value: "Tuned", status: "ok" },
            { label: "Exhaust overrun", value: "In review", status: "warn" },
            { label: "Next review", value: "Friday", status: "live" },
          ],
        },
      },
    ],
    caseStudies: [],
    proofTbd: "[TBD: confirm which customer deployments include BluSquad managed services, then list 2–3 case studies here]",
  },
];

export const layerBySlug = (slug: string) => layers.find((layer) => layer.slug === slug);
export const layerByKey = (key: LayerKey) => layers.find((layer) => layer.key === key)!;

export const platform = {
  hero: {
    eyebrow: "The AOne platform",
    headline: "One platform from sensor to *solved.*",
    sub: "AOne IoT, Vision AI and BluSquad managed services, working as one.",
  },
  architecture: {
    headline: "From the edge to the *engineer.*",
    tiers: [
      { id: "edge", name: "Edge devices", items: ["Sensors", "4G gateways", "Existing DVRs and CCTV"] },
      { id: "cloud", name: "AOne cloud", items: ["AI models", "Dashboard", "Alerts"] },
      { id: "people", name: "BluSquad", items: ["People on monitoring, maintenance and compliance"] },
    ],
  },
  deployment: {
    headline: "How a rollout *works.*",
    steps: [
      { title: "Site assessment", body: "A 30-minute call, a site walkthrough and a savings estimate." },
      { title: "Install", body: "Plug-and-play devices, on 4G where needed." },
      { title: "Go live", body: "Every asset on one dashboard." },
      { title: "Expand", body: "Site by site." },
    ],
  },
  integrations: {
    headline: "Works with what is already installed.",
    items: ["Existing DVRs and CCTV", "SCADA and DCS", "BMS", "ERP"],
    tbd: "[TBD: confirm the integration list]",
  },
};
