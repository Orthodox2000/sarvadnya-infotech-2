import { hasEmbeddableVideo, type Module } from "./modules";

/**
 * CHANGE: 2026-11-02 — per-module landing-page content.
 *
 * WHY: /modules/[slug] needs more than the six DB fields on the module card. The rich
 * copy below is transcribed from the printed brochures in public/brochures/ — nothing here
 * is invented. Modules without a curated entry fall back to their DB record through
 * detailFromModule(), so every module gets a real page the moment it exists in the admin panel.
 *
 * CHANGE: 2026-11-03 — all six modules now have a curated entry, a data-driven hero flow,
 * gallery copy and a simulator id, so one page template renders six consistent pages.
 *
 * NOTE ON `videoUrl`: a curated entry may leave it empty. The page merges in the module's
 * database video when the curated value is empty or unusable (lib/modules.ts rejects the
 * `dQw4w9WgXcQ` placeholder), so the owner can publish a video from the admin panel without a
 * code change — it appears on the next build — and an empty string here is not "this module
 * has no video".
 */
export type ModuleScreen = "loadsheet" | "voucher" | "annexure";

export type ModulePillarIcon =
  | "truck"
  | "receipt"
  | "printer"
  | "briefcase"
  | "users"
  | "percent"
  | "shirt"
  | "building";

export type ModulePillar = {
  title: string;
  icon: ModulePillarIcon;
  points: string[];
  footerLabel: string;
  screen: ModuleScreen;
};

export type ModuleStep = {
  tag: string;
  title: string;
  body: string;
};

/** The interactive TallyPrime mock rendered at #simulator. */
export type ModuleSimulatorId = "container" | "cfa" | "society" | "agent" | "transport" | "garment";

export type ModuleGalleryItem = {
  src: string;
  alt: string;
  caption: string;
  /**
   * CHANGE: 2026-11-12 — native pixel size of the file.
   *
   * WHY: a single-image gallery used to sit in a fixed `aspect-[4/3]` box with `object-cover`,
   * so a wide photo (2816x1536) lost ~25% of its width to the crop even on a desktop that had
   * room for all of it. The page now derives the box from the real ratio, so the photo renders
   * uncropped at the width the section offers. Keep these numbers in sync with the file.
   */
  width?: number;
  height?: number;
};

/**
 * The "everyday headache → TallyPrime → output" band. Kept as data so every module gets
 * the same three-card layout with its own brochure wording.
 */
export type ModuleFlow = {
  inputTitle: string;
  inputs: string[];
  engine: string;
  outputTitle: string;
  outputs: string[];
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
  /** Problem / automation band. Rendered only when present. */
  problem?: { eyebrow: string; title: string; body: string };
  flow?: ModuleFlow;
  /** Section headings so no page hardcodes container-specific copy. */
  videoCopy?: { eyebrow: string; title: string; body: string };
  simulatorCopy?: { eyebrow: string; title: string; body: string };
  whatYouGetCopy?: { eyebrow: string; title: string };
  howItWorksCopy?: { eyebrow: string; title: string };
  benefitsCopy?: { eyebrow: string; title: string };
  galleryCopy?: { eyebrow: string; title: string };
  gallery?: ModuleGalleryItem[];
  /** Which interactive walkthrough to render. Omitted = no simulator section. */
  simulator?: ModuleSimulatorId;
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
  problem: {
    eyebrow: "The everyday headache",
    title: "Many movements. Many invoices. Too much manual work.",
    body: "Manual calculation, corrections, printing and report preparation take a lot of time and effort. With this module, TallyPrime picks up the matching load sheets for the customer and creates the invoices for you.",
  },
  flow: {
    inputTitle: "Step A · Your filters",
    inputs: [
      "1 customer (party account)",
      "Period (date range)",
      "Container type (1x20, 2x20, 1x40)",
      "Movement type (Export, Import, Empty)",
    ],
    engine:
      "Picks up matching unbilled load sheets and groups the rates automatically.",
    outputTitle: "Step B · Instant output",
    outputs: ["Grouped by 1x20 / 2x20 / 1x40", "Annexure ready to print", "Books reconciled automatically"],
  },
  videoCopy: {
    eyebrow: "See it in TallyPrime",
    title: "Your load sheets and bill, the way TallyPrime shows them",
    body: "Watch the module in action, then scroll down to click through the load sheet, freight bill and annexure yourself.",
  },
  simulatorCopy: {
    eyebrow: "Click through the module",
    title: "See it in TallyPrime",
    body: "Add a movement, filter by billed or unbilled, then auto-create a freight bill and open its annexure — the same screens the brochure shows.",
  },
  whatYouGetCopy: { eyebrow: "What you get", title: "From the first movement to the final bill" },
  howItWorksCopy: { eyebrow: "Automation for container businesses", title: "Enter once. TallyPrime does the billing." },
  benefitsCopy: { eyebrow: "Business benefits", title: "Built for high-volume container operations" },
  galleryCopy: { eyebrow: "On the ground", title: "Built around the container movement" },
  gallery: [
    {
      src: "/contaner-mgt.jpg",
      alt: "Container truck carrying a shipping container",
      width: 1920,
      height: 1280,
      caption: "One movement, one load sheet — vehicle, container and route together.",
    },
    {
      src: "/assets/images/1519003722824-194d4455a60c.jpg",
      alt: "Goods vehicle on a highway",
      width: 800,
      height: 530,
      caption: "Export, import and empty movements bill from the same register.",
    },
    {
      src: "/assets/images/1586528116311-ad8dd3c8310d.jpg",
      alt: "Cargo and shipping documentation",
      width: 800,
      height: 533,
      caption: "The annexure carries the container details behind every bill.",
    },
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
  simulator: "container",
};

const CFA_AGENCIES: ModuleDetail = {
  id: "cf-agencies",
  title: "CFA Module for TallyPrime",
  eyebrow: "TallyPrime Add-on · Clearing & Forwarding",
  heroLead:
    "Open a job, add what it costs, bill it. The CFA Module keeps every job, reimbursable and invoice inside TallyPrime — no spreadsheets, no re-typing, no lost charges.",
  suitedFor: [
    "Clearing & forwarding agencies",
    "Freight forwarders",
    "Customs brokers",
    "C&F agents",
  ],
  image: "/assets/images/1586528116311-ad8dd3c8310d.jpg",
  imageAlt: "Cargo and shipping documentation at a clearing and forwarding desk",
  videoUrl: "",
  brochureUrl: "/brochures/cfa-module-brochure.pdf",
  shortDescription: "Job billing and reimbursables for CFA agencies — all inside Tally.",
  fullDescription:
    "Clearing & forwarding means many jobs, expenses, and bills — and reimbursables get missed. This module keeps every job's expenses and income connected in Tally. Reimbursable amounts auto-fill when you bill — no digging through files. Print CFA-format invoices with QR / IRN, bill in multiple currencies, and close jobs once done. Billing and books stay in one place.",
  metaTitle: "CFA Module for TallyPrime — Job & Reimbursable Billing",
  metaDescription:
    "Keep job expenses, reimbursables and multi-currency CFA invoices in TallyPrime — no re-entry, nothing missed.",
  keywords: [
    "cfa module",
    "cfa module for tallyprime",
    "clearing and forwarding tally",
    "cfa billing software",
    "job work billing tally",
    "reimbursable billing",
    "multi currency invoice tally",
    "cfa e invoice irn",
  ],
  features: [
    "Create jobs with all documentation details — no more scattered files",
    "Import jobs from Excel so you never retype anything",
    "Reimbursable expenses auto-filled when you bill — nothing gets missed",
    "Print CFA-format invoices with QR code & IRN",
    "Multi-currency invoices for forwarding agencies, exchange rate included",
    "Close single or multiple jobs after final billing",
    "Job-wise profitability and open/closed job reports",
  ],
  benefits: [
    "One software for billing and accounting — no double work",
    "Never miss reimbursable charges again — paid vs billed always matches",
    "See which jobs actually make money with the ready-made profitability report",
    "E-invoices generated free by Tally itself",
  ],
  pricing: [{ label: "CFA Module", price: "Rs. 25,000/-" }],
  problem: {
    eyebrow: "The everyday headache",
    title: "Many jobs. Many expenses. Reimbursables that go missing.",
    body: "When job costs sit in spreadsheets and bills are raised somewhere else, reimbursables get missed and nobody knows which shipment actually made money. The module keeps the job, its expenses and its invoice connected in TallyPrime.",
  },
  flow: {
    inputTitle: "Step A · Create the job",
    inputs: ["Job and party details", "Shipment and documentation", "Job expenses under the right heads"],
    engine:
      "Keeps every expense and bill attached to its job, so the invoice can pull the reimbursables automatically.",
    outputTitle: "Step B · Bill & close",
    outputs: ["CFA-format invoice with QR / IRN", "Reimbursables auto-filled", "Job-wise profitability"],
  },
  videoCopy: {
    eyebrow: "See it in TallyPrime",
    title: "From a job card to a closed, billed shipment",
    body: "The brochure walks through the job register, the CFA invoice and the profitability report. The click-through below follows the same three screens.",
  },
  simulatorCopy: {
    eyebrow: "Click through the module",
    title: "See it in TallyPrime",
    body: "Open a job, add its expenses, then bill it with the reimbursables filled in. Switch the currency and watch the invoice recalculate.",
  },
  whatYouGetCopy: { eyebrow: "What you get", title: "Jobs, expenses and bills in one place" },
  howItWorksCopy: { eyebrow: "Simple by design", title: "Three steps. That's the whole job." },
  benefitsCopy: { eyebrow: "Why C&F teams choose Sarvadnya", title: "One software. Fewer misses. Better margins." },
  galleryCopy: { eyebrow: "On the ground", title: "Built around the C&F job" },
  gallery: [
    {
      src: "/assets/images/1586528116311-ad8dd3c8310d.jpg",
      alt: "Cargo and shipping documentation",
      width: 800,
      height: 533,
      caption: "Job documents, shipment details and expenses stay on one job record.",
    },
    {
      src: "/contaner-mgt.jpg",
      alt: "Container truck carrying a shipping container",
      width: 1920,
      height: 1280,
      caption: "Transport, labour, port and misc costs are logged as they happen.",
    },
    {
      src: "/assets/images/1519003722824-194d4455a60c.jpg",
      alt: "Goods vehicle on a highway",
      width: 800,
      height: 530,
      caption: "Reimbursables reach the invoice instead of sitting in a file.",
    },
  ],
  pillars: [
    {
      title: "Jobs",
      icon: "briefcase",
      points: [
        "Open, track and close every C&F job from one register.",
        "Import jobs from Excel so nothing is typed twice, and keep every document detail on the job.",
      ],
      footerLabel: "Every job in one register",
      screen: "loadsheet",
    },
    {
      title: "Expenses & reimbursables",
      icon: "receipt",
      points: [
        "Capture job-wise costs under the correct heads as they happen.",
        "Chargeable costs are auto-filled at billing time — transport, port, labour and misc charges are never missed.",
      ],
      footerLabel: "Reimbursables never missed",
      screen: "voucher",
    },
    {
      title: "Billing & profit",
      icon: "printer",
      points: [
        "Raise CFA-format invoices with QR code and IRN directly from the job.",
        "Bill in multiple currencies and read job-wise profitability from open and closed job reports.",
      ],
      footerLabel: "Job-wise profitability",
      screen: "annexure",
    },
  ],
  steps: [
    {
      tag: "Create the job",
      title: "Open the job",
      body: "Enter the job, party and shipment details once. Every expense and bill hangs off that job.",
    },
    {
      tag: "Add job expenses",
      title: "Log what it costs",
      body: "Log transport, labour, port and misc costs as they happen — under the right heads.",
    },
    {
      tag: "Bill & close",
      title: "Raise the invoice",
      body: "Raise the invoice from the job. Reimbursables auto-fill. Close one job or many at once.",
    },
  ],
  faqs: [
    {
      q: "What is the CFA Module for TallyPrime?",
      a: "It is a TallyPrime add-on for clearing and forwarding agencies. It keeps each job, its expenses and its invoice connected, so you can bill in the CFA format without maintaining a separate billing tool.",
    },
    {
      q: "How do reimbursables reach the invoice?",
      a: "Every chargeable expense is recorded against the job. When you raise the invoice, those reimbursable amounts are pulled into the bill automatically instead of being typed again.",
    },
    {
      q: "Can I bill in USD or EUR?",
      a: "Yes. Multi-currency invoices are supported, with the exchange rate applied to the invoice. The brochure shows this as part of the billing screen.",
    },
    {
      q: "Does the module generate e-invoices?",
      a: "Yes. The CFA-format invoice can carry the QR code and IRN generated by TallyPrime, ready to share with the customer.",
    },
    {
      q: "Can I import jobs instead of entering them one by one?",
      a: "Yes. Jobs can be imported from Excel, so an existing job list does not have to be retyped into TallyPrime.",
    },
    {
      q: "Can I close several jobs together?",
      a: "Yes. A single job or multiple jobs can be closed after final billing, and the open/closed job reports keep the status visible.",
    },
  ],
  simulator: "cfa",
};

const HOUSING_SOCIETIES: ModuleDetail = {
  id: "housing-societies",
  title: "Housing Society Module for TallyPrime",
  eyebrow: "TallyPrime Add-on · Housing Society",
  heroLead:
    "Set each member's charges once. The module generates maintenance bills and interest vouchers itself — monthly, quarterly or your own cycle — inside TallyPrime.",
  suitedFor: [
    "Housing societies",
    "Managing committees",
    "Commercial & mixed-use societies",
    "Society accountants",
  ],
  image: "/housing society.png",
  imageAlt: "Residential housing society building",
  videoUrl: "",
  brochureUrl: "/brochures/housing-society-module-brochure.pdf",
  shortDescription: "Auto maintenance bills and interest for 70+ member societies.",
  fullDescription:
    "If your society has 70+ members, maintenance bills and interest take forever each month. Set each member's charges once, and the module generates bills and interest vouchers itself — monthly, quarterly, or your cycle. Bills print with outstanding and interest details, late-payment interest is auto-calculated, and GST is handled per the Society Act. You stop doing the maths.",
  metaTitle: "Housing Society Billing Module for TallyPrime",
  metaDescription:
    "Set each member's charges once; maintenance bills and late-payment interest then generate automatically in TallyPrime.",
  keywords: [
    "housing society module",
    "housing society billing module tallyprime",
    "society maintenance billing",
    "society accounting software",
    "interest on delayed payment",
    "society member register",
    "maintenance bill software",
  ],
  features: [
    "Set each member's maintenance charges once — bills generate themselves",
    "Auto bill generation monthly, quarterly, or your custom cycle",
    "Interest on delayed payments calculated automatically",
    "Print bills with outstanding & interest details (with or without receipt)",
    "Share, nomination & mortgage details kept in one place",
    "Bulk email maintenance bills to all members",
    "Registers for members, share, nomination, lien & mortgage — ready when needed",
  ],
  benefits: [
    "Built for societies with 70+ members",
    "No more manual billing and interest maths every month",
    "Surrendered / transferred members stop getting billed automatically",
    "GST compliant as per the Society Act",
  ],
  pricing: [
    { label: "Housing Society Module (implementation charges extra)", price: "Rs. 18,000/-" },
  ],
  problem: {
    eyebrow: "The everyday headache",
    title: "70+ members. Every month. The same bills and interest maths by hand.",
    body: "Charges are copied into each bill, interest is worked out on a calculator for every late payer, and share, nomination and mortgage details sit in separate files. The module puts the member, the charges and the interest in one TallyPrime record.",
  },
  flow: {
    inputTitle: "Step A · Set it once",
    inputs: ["Premise and area", "Member, share and nomination", "Maintenance, sinking, repair and education charges"],
    engine:
      "Generates the month's bills from the charges stored in each member record, and calculates interest on whatever is still pending.",
    outputTitle: "Step B · Every month",
    outputs: ["Bills with dues and interest", "Bulk email to all members", "Collection and outstanding reports"],
  },
  videoCopy: {
    eyebrow: "See it in TallyPrime",
    title: "One record for every member and flat",
    body: "The brochure shows the member register and the interest calculation. The click-through below follows the same screens with sample society data.",
  },
  simulatorCopy: {
    eyebrow: "Click through the module",
    title: "See it in TallyPrime",
    body: "Open a member, read the charge break-up, then change the interest rate or the days late and watch the interest recalculate.",
  },
  whatYouGetCopy: { eyebrow: "What you get", title: "Members, bills and interest in one record" },
  howItWorksCopy: { eyebrow: "How it works", title: "Set charges once. Bill every cycle." },
  benefitsCopy: { eyebrow: "Why societies choose Sarvadnya", title: "Built for societies that outgrew spreadsheets" },
  galleryCopy: { eyebrow: "On the ground", title: "Built around the society office" },
  gallery: [
    {
      src: "/housing society.png",
      alt: "Residential housing society building",
      width: 2816,
      height: 1536,
      caption: "Every flat, member and charge sits in one TallyPrime record.",
    },
  ],
  pillars: [
    {
      title: "Member & premise",
      icon: "users",
      points: [
        "Premise structure, floor, number, occupancy type and area for each flat.",
        "Class of member, admission, entrance fee, share details and date of cessation in the same record.",
      ],
      footerLabel: "One record per member",
      screen: "loadsheet",
    },
    {
      title: "Automated billing",
      icon: "receipt",
      points: [
        "Set charges once and generate bills monthly, quarterly or on your own cycle.",
        "Maintenance, sinking fund, repair fund and education fund flow into each bill, and bills can be emailed to all members together.",
      ],
      footerLabel: "Bills without the maths",
      screen: "voucher",
    },
    {
      title: "Interest & registers",
      icon: "printer",
      points: [
        "Interest on delayed payments is calculated from the pending amount, the rate and the days late.",
        "Members, share, nomination, lien and mortgage registers stay ready, with outstanding and interest reports alongside them.",
      ],
      footerLabel: "Interest worked out for you",
      screen: "annexure",
    },
  ],
  steps: [
    {
      tag: "Set charges",
      title: "Enter the member once",
      body: "Premise, member, share and the monthly charge heads are stored in one member record.",
    },
    {
      tag: "Generate bills",
      title: "Create the cycle",
      body: "Create the month's bills and the charges set in each member record flow in. Email every bill in one click or print with dues and interest.",
    },
    {
      tag: "Record receipts",
      title: "Reconcile and report",
      body: "Record receipts, match them with the bank statement, and read the collection and outstanding reports. Billing stops when a flat is transferred.",
    },
  ],
  faqs: [
    {
      q: "Which societies is this module meant for?",
      a: "It is built for societies with 70+ members, where preparing bills, working out interest and keeping registers by hand becomes difficult. Commercial and mixed-use societies bill shops and offices the same way as flats.",
    },
    {
      q: "How is interest on a late bill calculated?",
      a: "Interest is calculated on the pending amount for the number of days it is late, at the rate set for the member. The brochure's worked example uses Rs. 6,226 pending for 13 days at 21% a year, which comes to Rs. 47.",
    },
    {
      q: "Can I print a bill with the outstanding and interest?",
      a: "Yes. Bills can be printed with dues and interest details, with or without receipts.",
    },
    {
      q: "Can bills be emailed to all members?",
      a: "Yes. The module supports bulk email of maintenance bills to all members in one click.",
    },
    {
      q: "What happens when a flat is transferred?",
      a: "The member record carries the date of cessation, and billing stops for the old member once the flat is transferred. The share, nomination, lien and mortgage details stay in the register.",
    },
    {
      q: "Does the society data stay in TallyPrime?",
      a: "Yes. Members are ledgers and bills are vouchers, so the society records and the accounts stay together in TallyPrime with no separate software to run.",
    },
  ],
  simulator: "society",
};

const SALES_COMMISSION: ModuleDetail = {
  id: "sales-commission",
  title: "SalesMan / Agent Commission Module for TallyPrime",
  eyebrow: "TallyPrime Add-on · SalesMan / Agent",
  heroLead:
    "Set commission at item or broker level, tag the agent in any sale, and settle payouts inside TallyPrime. Commission is calculated on your base rate — never on the rate difference or taxes.",
  suitedFor: [
    "Distributors",
    "Wholesalers",
    "Manufacturers selling through agents",
    "Broker-driven sales teams",
  ],
  image: "/assets/images/1554224155-6726b3ff858f.jpg",
  imageAlt: "Sales team reviewing orders and commission records",
  videoUrl: "",
  brochureUrl: "/brochures/salesman-agent-module-brochure.pdf",
  shortDescription: "Broker commission and rate difference tracking in Tally.",
  fullDescription:
    "Selling through agents means month-end chaos — commission, rate differences, and who's been paid. This module keeps it in Tally. Set commission at item or broker level, pick the agent in any sale, and commission calculates on your rate only. Tag amounts as paid when settled, and pull broker-wise reports anytime. Your agents see exactly what they're owed.",
  metaTitle: "SalesMan / Agent Commission Module for TallyPrime",
  metaDescription:
    "Set agent commission by item or broker, track rate difference, and settle payouts inside TallyPrime.",
  keywords: [
    "salesman module",
    "salesman agent module tallyprime",
    "agent commission software",
    "broker commission tally",
    "rate difference tally",
    "commission settlement software",
    "broker wise sales report",
  ],
  features: [
    "Set commission for each broker or stock item — quantity or percentage based",
    "Pick any agent in a sale or purchase; change rates right in the bill",
    "Rate difference tracked separately — invoice shows RD + your rate",
    "Commission calculated on your rate only, not on RD (excl. tax)",
    "Mark RD & commission as paid when settled",
    "Broker-wise commission, RD and receivable/payable reports",
  ],
  benefits: [
    "No more month-end commission arguments",
    "Agents always know exactly what they're owed",
    "Paid vs unpaid RD and commission stays clear",
    "Works for any industry that sells through salesmen or agents",
  ],
  pricing: [{ label: "SalesMan / Agent Module", price: "Rs. 4,500/-" }],
  problem: {
    eyebrow: "The everyday headache",
    title: "Month-end commission, rate differences and 'did we pay this?'",
    body: "Selling through brokers turns month-end into a scramble — chasing commissions, untangling rate differences and guessing what is paid. Manual sheets drift from the books, and commissions accidentally get calculated on RD or taxes.",
  },
  flow: {
    inputTitle: "Step A · In the voucher",
    inputs: ["Tag the broker or agent", "Enter the base rate", "Add the rate difference, if any"],
    engine:
      "Tracks the rate difference separately and calculates commission strictly on the base rate. Taxes and RD never enter the commission base.",
    outputTitle: "Step B · One click",
    outputs: ["Commission computed on base rate", "RD shown separately on the invoice", "Paid / unpaid settlement trail"],
  },
  videoCopy: {
    eyebrow: "See it in TallyPrime",
    title: "The agent stays on the voucher, the maths stays automatic",
    body: "The brochure shows the sales voucher and the commission preview side by side. The click-through below follows the same flow with sample data.",
  },
  simulatorCopy: {
    eyebrow: "Click through the module",
    title: "See it in TallyPrime",
    body: "Pick the agent, change the basis or the rate, and watch the commission recalculate. Then mark the settlement as paid.",
  },
  whatYouGetCopy: { eyebrow: "What you get", title: "Built for real broker and agent workflows" },
  howItWorksCopy: { eyebrow: "How it works", title: "From invoice to settlement in three steps" },
  benefitsCopy: { eyebrow: "Why sales teams choose Sarvadnya", title: "Know exactly what is due" },
  galleryCopy: { eyebrow: "On the ground", title: "Built around the sales counter" },
  gallery: [
    {
      src: "/assets/images/1554224155-6726b3ff858f.jpg",
      alt: "Sales team reviewing orders and commission records",
      width: 800,
      height: 459,
      caption: "The agent is picked on the sale, so commission follows the invoice.",
    },
  ],
  pillars: [
    {
      title: "Commission setup",
      icon: "percent",
      points: [
        "Set commission for each broker or stock item, on a quantity basis (fixed per unit) or a percentage basis (on sales value).",
        "Choose the basis that fits the arrangement — 5 per unit on 120 units, or 2.5% on a base value of 57,600.",
      ],
      footerLabel: "Quantity or percentage",
      screen: "loadsheet",
    },
    {
      title: "Rate difference",
      icon: "receipt",
      points: [
        "Change the rate right in the bill and the rate difference is captured separately.",
        "The printed invoice shows RD plus your base rate, and commission is never calculated on RD or taxes.",
      ],
      footerLabel: "RD kept out of commission",
      screen: "voucher",
    },
    {
      title: "Settlement & reports",
      icon: "printer",
      points: [
        "Mark RD and commission as paid when settled, with a clean, traceable audit trail.",
        "Broker-wise sales, paid vs unpaid outstanding and the rate-difference report sit together.",
      ],
      footerLabel: "No more 'did we pay this?'",
      screen: "annexure",
    },
  ],
  steps: [
    {
      tag: "Tag the agent",
      title: "Pick the broker in the voucher",
      body: "Select the broker or agent while creating the sales voucher in TallyPrime — nothing else changes in your routine.",
    },
    {
      tag: "Add RD if any",
      title: "Change the rate in the bill",
      body: "The rate difference is captured separately without ever touching your commission base.",
    },
    {
      tag: "Auto-calculate & settle",
      title: "Review and mark paid",
      body: "Commission computes on the base rate. Review, track and mark RD and commission as paid in a single click.",
    },
  ],
  faqs: [
    {
      q: "What does the SalesMan / Agent Module do?",
      a: "It keeps broker and agent commission inside TallyPrime. You set the commission at item or broker level, tag the agent on a sale, and the module calculates and tracks what is payable.",
    },
    {
      q: "Is commission calculated on the rate difference or on taxes?",
      a: "No. Commission is calculated strictly on your base rate. The rate difference is tracked separately and taxes are excluded from the commission base.",
    },
    {
      q: "Can commission be a fixed amount per unit instead of a percentage?",
      a: "Yes. Commission can be set on a quantity basis (a fixed amount per unit) or a percentage basis (on the sales value). The brochure shows both: 5 per unit x 120 units = 600, and 2.5% x 57,600 = 1,440.",
    },
    {
      q: "Does the printed invoice show the rate difference?",
      a: "Yes. The invoice shows the rate difference plus your base rate, so the agent and the customer can both see how the amount was built.",
    },
    {
      q: "Can I mark commission and RD as paid?",
      a: "Yes. RD and commission can be marked as paid on settlement, which keeps a traceable audit trail and separates paid from unpaid amounts.",
    },
    {
      q: "Which reports are available?",
      a: "Broker-wise sales, an outstanding summary of paid versus unpaid commission and RD, and a rate-difference report by broker and invoice.",
    },
  ],
  simulator: "agent",
};

const LOGISTICS_TRANSPORT: ModuleDetail = {
  id: "logistics-transport",
  title: "Transport Module for TallyPrime",
  eyebrow: "TallyPrime Add-on · Transport & Logistics",
  heroLead:
    "Make the lorry receipt once. TallyPrime does the billing. Create LRs with every detail, see them all on one page, and invoice the unbilled ones in bulk.",
  suitedFor: ["Truck owners", "Transport agents", "Goods carriers", "Logistics firms"],
  image: "/assets/images/1519003722824-194d4455a60c.jpg",
  imageAlt: "Goods vehicle on a highway",
  videoUrl: "",
  brochureUrl: "/brochures/transport-module-brochure.pdf",
  shortDescription: "Create, track and bill lorry receipts from Tally.",
  fullDescription:
    "Transport businesses live on LRs. This module lets you create LRs with all details, see every LR on one page, and auto-create invoices from unbilled ones. Bill one LR or many in a single invoice, print with LR details, and export the annexure. Billing runs off the LR itself, so errors go down and nothing sits unbilled.",
  metaTitle: "Transport Module for TallyPrime — LR Billing in Bulk",
  metaDescription:
    "Create lorry receipts, bill one or many LRs in a single invoice, and export the annexure from TallyPrime.",
  keywords: [
    "transport module tally",
    "transport module for tallyprime",
    "lorry receipt software",
    "lr billing tally",
    "transport billing software",
    "lr annexure",
    "freight bill tally",
  ],
  features: [
    "Create LRs (lorry receipts) with all required details — own or hired vehicles",
    "See every LR on a single page",
    "Auto-create invoices from unbilled LRs",
    "Bill single or multiple LRs in one invoice",
    "Print invoices with LR details and export the annexure",
    "LR report shows billing status and bill number",
  ],
  benefits: [
    "Billing driven by the LR itself — fewer manual mistakes",
    "No more hunting for which LR is billed",
    "One invoice can cover many LRs",
    "Can be customized further to fit how you work",
  ],
  pricing: [{ label: "Transport Module", price: "On request" }],
  problem: {
    eyebrow: "The everyday headache",
    title: "Every LR on a different page. Billing from memory.",
    body: "When LRs live in a book or a spreadsheet, you have to remember which ones are still unbilled. The module keeps every LR on one page, with its billing status and bill number, so the invoice is created from the LR itself.",
  },
  flow: {
    inputTitle: "Step A · Create the LR",
    inputs: ["Party and route", "Own or hired vehicle", "Weight, rate and charges"],
    engine:
      "Keeps the LR as the billing source, so an invoice can be created from one LR or a batch of unbilled LRs.",
    outputTitle: "Step B · Invoice",
    outputs: ["One LR or many in one bill", "Invoice with LR details", "Annexure ready to export"],
  },
  videoCopy: {
    eyebrow: "See it in TallyPrime",
    title: "From LR entry to freight bill",
    body: "The brochure shows the LR, the freight bill and the LR report. The click-through below follows the same three screens.",
  },
  simulatorCopy: {
    eyebrow: "Click through the module",
    title: "See it in TallyPrime",
    body: "Enter an LR, change its weight or rate, then auto-create an invoice from the unbilled LRs and check the report.",
  },
  whatYouGetCopy: { eyebrow: "What you get", title: "Everything an LR needs, in one place" },
  howItWorksCopy: { eyebrow: "How it works", title: "From LR to invoice in 3 steps" },
  benefitsCopy: { eyebrow: "Business benefits", title: "Every LR billed. Nothing unbilled." },
  galleryCopy: { eyebrow: "On the ground", title: "Built around the LR" },
  gallery: [
    {
      src: "/assets/images/1519003722824-194d4455a60c.jpg",
      alt: "Goods vehicle on a highway",
      width: 800,
      height: 530,
      caption: "One LR carries the party, route, vehicle, weight and rate.",
    },
    {
      src: "/contaner-mgt.jpg",
      alt: "Container truck carrying a shipping container",
      width: 1920,
      height: 1280,
      caption: "Own or hired vehicles are recorded on the same LR.",
    },
    {
      src: "/assets/images/1586528116311-ad8dd3c8310d.jpg",
      alt: "Cargo and shipping documentation",
      width: 800,
      height: 533,
      caption: "The invoice prints with LR details; the annexure exports separately.",
    },
  ],
  pillars: [
    {
      title: "Create LRs",
      icon: "truck",
      points: [
        "Enter party, route, vehicle (own or hired), weight, rate and charges once.",
        "Every LR sits on a single page, so nothing is left in a separate book or sheet.",
      ],
      footerLabel: "Every LR on one page",
      screen: "loadsheet",
    },
    {
      title: "Auto-create invoices",
      icon: "receipt",
      points: [
        "Pick one unbilled LR or many, and create the invoice from them in one go.",
        "Bill a whole batch in one invoice and print it with the LR details.",
      ],
      footerLabel: "One invoice, many LRs",
      screen: "voucher",
    },
    {
      title: "LR report",
      icon: "printer",
      points: [
        "See the billing status and bill number for every LR.",
        "Export the annexure with the invoice so the customer can reconcile the LRs.",
      ],
      footerLabel: "No more hunting for billed LRs",
      screen: "annexure",
    },
  ],
  steps: [
    {
      tag: "Create the LR",
      title: "Record the trip",
      body: "Enter party, route, vehicle (own or hired), weight, rate and charges once.",
    },
    {
      tag: "Pick unbilled LRs",
      title: "Choose one or many",
      body: "See every LR on one page. Select one LR, or a batch of unbilled LRs.",
    },
    {
      tag: "Invoice is ready",
      title: "Print or export",
      body: "Print the invoice with LR details, or export the annexure for reconciliation.",
    },
  ],
  faqs: [
    {
      q: "What does the Transport Module do in TallyPrime?",
      a: "It records lorry receipts with their full details, shows every LR on one page, and creates invoices from the unbilled LRs. Billing runs off the LR itself rather than a separate billing sheet.",
    },
    {
      q: "Can I bill more than one LR in a single invoice?",
      a: "Yes. You can bill a single LR or many LRs together in one invoice, and the invoice prints with the LR details.",
    },
    {
      q: "Does it work for hired vehicles?",
      a: "Yes. The LR records whether the vehicle is owned or hired, along with the party, route, weight, rate and charges.",
    },
    {
      q: "How do I know which LR is already billed?",
      a: "The LR report shows the billing status and the bill number for every LR, so you can see at a glance which ones are still unbilled.",
    },
    {
      q: "Can I export the annexure?",
      a: "Yes. The invoice prints with the LR details, and the annexure can be exported for customer reconciliation.",
    },
    {
      q: "Can the module be customized further?",
      a: "Yes. The module can be customized to fit the way your transport business works. Talk to us about your LR format and billing process.",
    },
  ],
  simulator: "transport",
};

const GARMENT_RETAIL: ModuleDetail = {
  id: "garment-retail",
  title: "Garment & Footwear Billing Module for TallyPrime",
  eyebrow: "TallyPrime Add-on · Garment & Footwear Retail",
  heroLead:
    "Items create themselves, sizes add up on their own, and stock updates by colour and size — inside your TallyPrime.",
  suitedFor: [
    "Garment stores",
    "Footwear shops",
    "Boutiques",
    "Multi-brand showrooms",
    "Franchise outlets",
  ],
  image: "/assets/images/1523381210434-271e8be1f52b.jpg",
  imageAlt: "Garment and footwear display in a retail store",
  videoUrl: "",
  brochureUrl: "/brochures/garment-footwear-module-brochure.pdf",
  shortDescription: "Color and size stock tracking for garment and footwear sellers.",
  fullDescription:
    "In garments and footwear, one design comes in many colors and sizes — stock becomes a headache. This module creates items as you enter purchases or sales, tracks by color and size, and keeps billing fast. Invoices print with color and size columns for more items per page, and the closing stock report shows exactly what's left.",
  metaTitle: "Garment & Footwear Billing Module for TallyPrime",
  metaDescription:
    "Create colour-and-size items as you bill, track stock by variation and print invoices with colour/size columns.",
  keywords: [
    "garment module tally",
    "garment footwear module tallyprime",
    "footwear billing software",
    "colour size stock tally",
    "readymade garment billing",
    "closing stock by size",
    "boutique billing software",
  ],
  features: [
    "Items created automatically during purchase & sales entry",
    "Track every item by color and size",
    "Fast billing and purchase entry, even with many variations",
    "Invoice print with color & size columns — more items per page",
    "Closing stock report by color and size",
  ],
  benefits: [
    "No more creating items by hand before you can bill",
    "Know exactly what's in stock, in which color & size",
    "Billing stays quick even with lots of variations",
    "Buy smarter — a clear picture of what actually sells",
  ],
  pricing: [{ label: "Garment / Footwear Sales Module", price: "Rs. 15,000/-" }],
  problem: {
    eyebrow: "The everyday headache",
    title: "One design. Many colours. Many sizes.",
    body: "Five colours across six sizes is thirty separate items to create by hand before the first bill. With this module they are created automatically while you enter the purchase or the sale.",
  },
  flow: {
    inputTitle: "Step A · Enter the sale",
    inputs: ["Pick the style and colour", "Fill the size columns", "Let the item create itself"],
    engine:
      "Creates the colour-and-size item while you type the bill, then calculates quantity, amount and stock for that exact variation.",
    outputTitle: "Step B · Instant output",
    outputs: ["Quantity and amount worked out", "Stock drops by colour and size", "Closing stock ready at month-end"],
  },
  videoCopy: {
    eyebrow: "See it in TallyPrime",
    title: "Your invoice and stock, the way TallyPrime shows them",
    body: "The brochure shows the size-column invoice and the closing-stock screen. The click-through below lets you change the sizes yourself.",
  },
  simulatorCopy: {
    eyebrow: "Click through the module",
    title: "See it in TallyPrime",
    body: "Fill the size columns, watch the quantity and total calculate, then open the closing stock to see what is left in each size.",
  },
  whatYouGetCopy: { eyebrow: "What you get", title: "Simple tools that save hours every week" },
  howItWorksCopy: { eyebrow: "How it works", title: "Three steps. No extra training." },
  benefitsCopy: { eyebrow: "Automation for retail", title: "Enter once. TallyPrime does the rest." },
  galleryCopy: { eyebrow: "On the ground", title: "Built around the retail counter" },
  gallery: [
    {
      src: "/assets/images/1523381210434-271e8be1f52b.jpg",
      alt: "Garment and footwear display in a retail store",
      width: 2816,
      height: 1536,
      caption: "Every style, colour and size stays visible at the counter.",
    },
  ],
  pillars: [
    {
      title: "Items create themselves",
      icon: "shirt",
      points: [
        "New style, colour or size? The item is created automatically while you enter the purchase or the sale.",
        "No separate item master to set up before billing.",
      ],
      footerLabel: "No item master setup",
      screen: "loadsheet",
    },
    {
      title: "Billing that adds up",
      icon: "receipt",
      points: [
        "Fill the size columns and the quantity and amount are worked out for you.",
        "Billing stays quick even when a family picks six pieces in different sizes.",
      ],
      footerLabel: "Quantity and amount calculated",
      screen: "voucher",
    },
    {
      title: "Stock by colour & size",
      icon: "printer",
      points: [
        "Every sale and purchase updates stock by exact colour and size.",
        "The closing stock report shows exactly which ones are left, in quantity and value.",
      ],
      footerLabel: "Know what is left",
      screen: "annexure",
    },
  ],
  steps: [
    {
      tag: "Enter the purchase",
      title: "Items are created for you",
      body: "A new style arrives in a colour and several sizes. Enter the purchase once and every item is created.",
    },
    {
      tag: "Bill at the counter",
      title: "Totals work themselves out",
      body: "Fill the size columns and the quantity and amount are calculated row by row.",
    },
    {
      tag: "Check what is left",
      title: "Stock updates by itself",
      body: "Every sale updates stock by colour and size, so the closing stock report is ready at month-end.",
    },
  ],
  faqs: [
    {
      q: "What does the Garment & Footwear Module do?",
      a: "It creates items automatically while you enter a purchase or a sale, keeps stock by colour and size, and prints invoices with colour and size columns.",
    },
    {
      q: "Do I have to create every colour and size as a separate item first?",
      a: "No. The module creates the item while you enter the purchase or the sale, so the colour-and-size combinations do not have to be set up in advance.",
    },
    {
      q: "How does the invoice print many variations?",
      a: "The invoice prints with its own colour and size columns, so more items fit on a page and the bill reads clearly.",
    },
    {
      q: "Can I see closing stock by size?",
      a: "Yes. The closing stock report shows quantity, rate and value by colour and size, so you can see exactly what is left.",
    },
    {
      q: "Does billing stay fast with many pieces?",
      a: "Yes. Quantity, amount and totals are calculated as you fill the size columns, so billing stays quick even when a customer picks several sizes.",
    },
  ],
  simulator: "garment",
};

export const moduleDetails: Record<string, ModuleDetail> = {
  "container-handling": CONTAINER_HANDLING,
  "cf-agencies": CFA_AGENCIES,
  "housing-societies": HOUSING_SOCIETIES,
  "sales-commission": SALES_COMMISSION,
  "logistics-transport": LOGISTICS_TRANSPORT,
  "garment-retail": GARMENT_RETAIL,
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
 *
 * CHANGE: 2026-11-03 — retained as the fallback for any module added later in the admin panel;
 * the six shipped modules now carry the same values in their curated entries.
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
    // CHANGE: 2026-11-03 — the DB still holds a placeholder video for five modules; never ship it.
    videoUrl: hasEmbeddableVideo(module.videoUrl) ? module.videoUrl : "",
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
