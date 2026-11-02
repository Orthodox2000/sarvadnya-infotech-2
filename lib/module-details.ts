import type { Module } from "./modules";

/**
 * CHANGE: 2026-11-02 — per-module landing-page content.
 *
 * WHY: /modules/[slug] needs more than the six DB fields on the module card. The rich
 * copy below is transcribed from the printed brochure
 * (public/brochures/container-handling-module-brochure.pdf) — nothing here is invented.
 * Modules without a curated entry fall back to their DB record through detailFromModule(),
 * so every module gets a real page the moment it exists in the admin panel.
 */
export type ModuleScreen = "loadsheet" | "voucher" | "annexure";

export type ModulePillar = {
  title: string;
  icon: "truck" | "receipt" | "printer";
  points: string[];
  footerLabel: string;
  screen: ModuleScreen;
};

export type ModuleStep = {
  tag: string;
  title: string;
  body: string;
};

export type ModuleDetail = {
  id: string;
  title: string;
  eyebrow: string;
  heroLead: string;
  suitedFor: string[];
  image: string;
  imageAlt: string;
  videoUrl: string;
  brochureUrl: string;
  shortDescription: string;
  fullDescription: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  features: string[];
  benefits: string[];
  pricing?: { label: string; price: string }[];
  pillars?: ModulePillar[];
  steps?: ModuleStep[];
  faqs?: { q: string; a: string }[];
  /** Only the container page ships the interactive TallyPrime simulator. */
  simulator?: boolean;
};

const CONTAINER_HANDLING: ModuleDetail = {
  id: "container-handling",
  title: "Container Handling Module in TallyPrime",
  eyebrow: "TallyPrime Customization · Vertical Solution",
  heroLead:
    "Record every container movement once. Create invoices from any load sheets in one go; get your reports and annexures ready, all inside TallyPrime.",
  suitedFor: [
    "Container transporters",
    "Logistics companies",
    "CFS & ICD operators",
    "Container yards & depots",
  ],
  image: "/contaner-mgt.jpg",
  imageAlt: "Container truck carrying a shipping container",
  videoUrl: "https://youtu.be/YqqtzzDL6o8",
  brochureUrl: "/brochures/container-handling-module-brochure.pdf",
  shortDescription: "Log sheet billing for container handling firms.",
  fullDescription:
    "In container handling, log sheets pile up and billing gets messy. Create log sheets with container and vehicle details, pick the ones to bill — one party or several — and print the bill with annexure. The unbilled log sheet report shows exactly what's pending, so nothing goes unpaid.",
  metaTitle: "Container Handling Module — Bulk Billing in TallyPrime",
  metaDescription:
    "Record a container movement once, bill load sheets in bulk and print the bill with annexure — all inside TallyPrime.",
  keywords: [
    "container handling module",
    "container handling module in tallyprime",
    "tallyprime container module",
    "container handling tally",
    "load sheet tally",
    "container annexure billing",
    "cfs icd tally module",
    "tally logistics module",
    "bulk freight billing tally",
  ],
  features: [
    "Create log sheets with container & vehicle details",
    "Bill selected log sheets — bulk or single, party-wise",
    "Print bills with annexure",
    "Print or export the annexure alone",
    "All log sheets report",
    "Unbilled log sheets report — see exactly what's pending billing",
  ],
  benefits: [
    "Every log sheet gets billed — nothing slips",
    "Bulk or single invoicing, whichever suits the day",
    "Annexure printing and export built in",
    "Track container handling activity from one place",
  ],
  pricing: [
    { label: "Container Handling Module (invoice format not included)", price: "Rs. 18,000/-" },
  ],
  pillars: [
    {
      title: "Load Sheet",
      icon: "truck",
      points: [
        "Capture vehicle no., container details, source–destination and other movement details.",
        "Add the extra cost of each movement (for example diesel) and see the final profitability of every movement in the Load Sheet report.",
      ],
      footerLabel: "Movement-wise profitability",
      screen: "loadsheet",
    },
    {
      title: "Auto-Invoicing",
      icon: "receipt",
      points: [
        "Super-fast invoice creation for multiple load sheets of the selected customer.",
        "Create invoices for a selected period, container type (1x20, 2x20, 1x40 etc.) or movement type (Export, Import, Loaded, Empty, Dscan etc.).",
      ],
      footerLabel: "Bulk customer billing",
      screen: "voucher",
    },
    {
      title: "Reports",
      icon: "printer",
      points: [
        "Daily Load Sheet report with multiple filters.",
        "Auto-billing report showing only the unbilled load sheets.",
        "Annexure print or export with the container movement details of every load sheet used for an invoice.",
      ],
      footerLabel: "Zero unbilled leakage",
      screen: "annexure",
    },
  ],
  steps: [
    {
      tag: "Load sheet entry",
      title: "Record the movement",
      body: "A truck moves a 1x20 export container. Enter the vehicle, container, route and cost in one load sheet.",
    },
    {
      tag: "Auto-invoicing",
      title: "Bill in bulk",
      body: "Pick the customer, then the period, container type or movement type. TallyPrime creates the invoices from the matching load sheets.",
    },
    {
      tag: "Annexure & accounts",
      title: "Print and reconcile",
      body: "Print the bill with its annexure, or export the annexure alone, and match your accounts with the movement details.",
    },
  ],
  faqs: [
    {
      q: "What does the Container Handling Module do in TallyPrime?",
      a: "It records each container movement as a load sheet, then creates freight invoices from the matching load sheets. The bill prints with its container annexure, and the unbilled report shows exactly which load sheets are still waiting for billing.",
    },
    {
      q: "Can I create invoices for one customer or for several parties?",
      a: "Yes. You pick the customer and the matching load sheets, then bill one party or several — party-wise. TallyPrime pulls the selected load sheets into the invoice instead of making you re-enter the movements.",
    },
    {
      q: "What can I filter while creating an invoice?",
      a: "The period, container type (1x20, 2x20, 1x40 etc.) and movement type (Export, Import, Loaded, Empty, Dscan etc.). Only the load sheets matching those filters are rolled into the freight bill.",
    },
    {
      q: "Does the module print an annexure with the invoice?",
      a: "Yes. The bill carries a container movement annexure, and the annexure can also be printed or exported on its own for customer reconciliation.",
    },
    {
      q: "Can I see which load sheets are still unbilled?",
      a: "Yes. The auto-billing report lists only the unbilled load sheets, so you can see exactly what is pending billing before the month closes.",
    },
    {
      q: "Does the module run inside TallyPrime?",
      a: "Yes. It is a TallyPrime customization, so the load sheets, freight bills, reports and annexure all stay inside TallyPrime alongside your regular accounting. Talk to us about your TallyPrime edition and user setup before installation.",
    },
  ],
  simulator: true,
};

export const moduleDetails: Record<string, ModuleDetail> = {
  "container-handling": CONTAINER_HANDLING,
};

export function getModuleDetail(slug: string): ModuleDetail | null {
  return moduleDetails[slug] ?? null;
}

/**
 * CHANGE: 2026-11-02 — hand-tuned SERP copy for the modules that live only in the database.
 *
 * WHY: those pages previously shipped `module.title` as the <title> and the first 158
 * characters of `shortDescription` as the description. That ranks but does not get clicked —
 * the owner's report was impressions without clicks. Every claim below is taken from that
 * module's own DB record (scripts/seed_modules.mjs); nothing new is stated about the product.
 * Keeping the copy here instead of editing the DB means the admin panel stays the source of
 * truth for the page body, while <title>/<description> stay engineered for the SERP.
 */
const META_OVERRIDES: Record<string, { title: string; description: string; keywords?: string[] }> = {
  "cf-agencies": {
    title: "CFA Module for TallyPrime — Job & Reimbursable Billing",
    description:
      "Keep job expenses, reimbursables and multi-currency CFA invoices in TallyPrime — no re-entry, nothing missed.",
    keywords: ["cfa module", "clearing and forwarding tally", "cfa billing software", "job work billing tally", "reimbursable billing"],
  },
  "housing-societies": {
    title: "Housing Society Billing Module for TallyPrime",
    description:
      "Set each member's charges once; maintenance bills and late-payment interest then generate automatically in TallyPrime.",
    keywords: ["housing society module", "society maintenance billing", "society accounting software", "interest on delayed payment"],
  },
  "sales-commission": {
    title: "SalesMan / Agent Commission Module for TallyPrime",
    description:
      "Set agent commission by item or broker, track rate difference, and settle payouts inside TallyPrime.",
    keywords: ["salesman module", "agent commission software", "broker commission tally", "rate difference tally"],
  },
  "logistics-transport": {
    title: "Transport Module for TallyPrime — LR Billing in Bulk",
    description:
      "Create lorry receipts, bill one or many LRs in a single invoice, and export the annexure from TallyPrime.",
    keywords: ["transport module tally", "lorry receipt software", "lr billing tally", "transport billing software"],
  },
  "garment-retail": {
    title: "Garment & Footwear Billing Module for TallyPrime",
    description:
      "Create colour-and-size items as you bill, track stock by variation and print invoices with colour/size columns.",
    keywords: ["garment module tally", "footwear billing software", "colour size stock tally", "readymade garment billing"],
  },
};

/** Cut at a word boundary under `max` so a snippet never stops mid-word or mid-comma. */
function clampDescription(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const space = cut.lastIndexOf(" ");
  const trimmed = (space > 40 ? cut.slice(0, space) : cut).replace(/[\s.,;:—–-]+$/, "");
  return `${trimmed}.`;
}

/**
 * CHANGE: 2026-11-02 — description now leads with the outcome and stops on a clean boundary.
 * The old version hard-sliced at 158 characters, which cut words in half AND stayed inside the
 * 122-character budget the contact CTA leaves us (the suffix adds 38 chars).
 */
function metaDescriptionFor(module: Module): string {
  const short = (module.shortDescription || "").trim();
  const benefit = (module.benefits?.[0] || "").trim();
  const base = [short, benefit].filter(Boolean).join(" ") || (module.fullDescription || "").trim();
  return clampDescription(base || module.title, 118);
}

/** `${title} for TallyPrime`, unless the title already names Tally (avoids "Tally … Tally"). */
function metaTitleFor(module: Module): string {
  const title = (module.title || "").trim();
  if (/tally/i.test(title)) return title;
  return `${title} for TallyPrime`;
}

/**
 * Fallback for any module that has no curated brochure page yet. Every field comes from the
 * DB record, so a newly added module is a working page without a code change.
 */
export function detailFromModule(module: Module): ModuleDetail {
  const id = module.id || module._id || "";
  const meta = META_OVERRIDES[id];
  return {
    id,
    title: module.title,
    eyebrow: module.category || "TallyPrime Module",
    heroLead: module.shortDescription,
    suitedFor: [],
    image: module.image || "/TDLandCustom.jpg",
    imageAlt: `${module.title} for TallyPrime`,
    videoUrl: module.videoUrl,
    brochureUrl: module.brochureUrl,
    shortDescription: module.shortDescription,
    fullDescription: module.fullDescription,
    metaTitle: meta?.title ?? metaTitleFor(module),
    metaDescription: meta?.description ?? metaDescriptionFor(module),
    keywords: [
      ...(meta?.keywords ?? []),
      (module.title || "").toLowerCase(),
      `${(module.title || "").toLowerCase()} for tallyprime`,
      "tallyprime module",
      "tally tdl module",
      module.category?.toLowerCase() || "business module",
    ].filter(Boolean),
    features: module.features ?? [],
    benefits: module.benefits ?? [],
    pricing: module.pricing,
  };
}
