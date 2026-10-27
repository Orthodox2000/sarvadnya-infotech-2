// CHANGE: 2026-09-05 — added optional `keywords` so synonyms like "stock" resolve
// deterministically to their topic; prevents over-matching falling through to the
// LLM (avoiding off-syllabus TSS replies and saving LLM token spend).
//
// CHANGE: 2026-10-22 — Sara is a business consultant, NOT a programmer. The
// shared guard (lib/sara-guard.mjs) is imported here so the OFFLINE fallback
// (used when the AI API is down) behaves exactly like the live reply: never
// code, always the requirement questions first.
// CHANGE: 2026-10-22 — RELATIVE import on purpose (house rule for lib/): the
// plain-node regression suites import this file directly (Node 24 native TS
// type-stripping) and cannot resolve the "@/" alias.
import { buildNoCodeReply, isCustomBuildRequest } from './sara-guard.mjs';
// CHANGE: 2026-10-22 — the offline fallback must be able to SUGGEST what we sell, exactly
// like the live reply does. The catalogue (products, cloud, services, modules, the 20 add-ons
// and the Tally Insights guides) lives in lib/sara-catalog.mjs so there is ONE source of
// truth shared with the chat route and the prompt.
import { catalogSuggestionReply, guideSuggestionReply } from './sara-catalog.mjs';

export type Topic = {
  label: string;
  answer: string;
  keywords?: string[];
  followUp?: Topic[];
  // CHANGE: 2026-10-26 — one-line summary used by the indexable guide pages (/learn-sara/
  // <topic>) as the meta description and the hub card teaser. Optional on purpose: a topic
  // added without it still renders, falling back to the first sentence of its answer.
  description?: string;
};

export const saraTopics: Topic[] = [
  {
    label: "GST & Tax Filing",
    description: "How GST works in TallyPrime: enabling GST, auto CGST/SGST/IGST, e-invoicing, e-way bills and GSTR-1 / GSTR-3B filing.",
    keywords: ["gst return", "gstr1", "gstr-1", "gstr", "tax filing", "e invoice", "einvoice", "eway bill", "e-way bill", "ewaybill"],
    answer: "TallyPrime handles GST automatically. Here's what you need to know:\n\n- Enable GST: Go to Company Features (F11) > Enable GST\n- Auto-calculation: Tally calculates CGST, SGST, IGST on every invoice\n- E-Invoicing: Generate directly from Tally (one click)\n- GSTR-1: Gateway > Reports > Statutory Reports > GST > GSTR-1\n- GSTR-3B: Same path, select GSTR-3B\n- E-Way Bill: Generate for shipments above ₹50,000\n\nTallyPrime also auto-reconciles your GSTR-2A/2B with purchase records.",
    followUp: [
      { label: "How to file GSTR-1?", answer: "Steps to file GSTR-1:\n\n1. Gateway > Reports > Statutory Reports > GST > GSTR-1\n2. Review all outward supplies\n3. Check for errors (Tally highlights mismatches)\n4. Click 'Export' to generate JSON\n5. Upload to GST portal or use direct upload\n\nTally also auto-filters B2B, B2C, CDNR, and HSN summaries for you." },
      { label: "E-Invoicing steps", answer: "E-Invoicing in TallyPrime:\n\n1. Enable: F11 > GST > Enable E-Invoicing\n2. Set IRN threshold (currently ₹5 crore)\n3. Generate: While saving invoice, press Ctrl+I for IRN\n4. Tally auto-generates QR code and IRN\n5. Print the invoice with QR code\n\nNo external portal needed — everything happens inside Tally." },
    ]
  },
  {
    label: "Inventory Management",
    description: "Stock items, godowns, batches, bill of materials, reorder levels and valuation methods in TallyPrime inventory.",
    keywords: ["stock", "stock item", "stock items", "stock entry", "items", "item", "goods", "product", "products", "godown", "godowns", "batch", "batches", "reorder", "barcode", "bom", "multi location", "multi-location"],
    answer: "TallyPrime's inventory is more powerful than most people realize:\n\n- Stock Items: Create with units, opening balance, and godown\n- Godowns: Track stock across multiple locations (F11 > Enable Godowns)\n- Batches: For medicines, food, or perishables with expiry tracking\n- BOM: Bill of Materials for manufacturing businesses\n- Reorder Levels: Set minimum stock and get alerts\n- Valuation: FIFO, LIFO, or Average — pick your method\n\nPro tip: Use 'Stock Summary' report to see real-time inventory across all locations.",
    followUp: [
      { label: "Multi-location tracking", answer: "Multi-godown tracking:\n\n1. Enable Godowns: F11 > Inventory Features > Maintain Multiple Godowns\n2. Create Godowns: Inventory Info > Godowns > Create\n3. Transfer Stock: Use Stock Journal (Alt+F7) for inter-godown transfers\n4. Reports: Stock Summary shows per-godown quantities\n\nYou can also see godown-wise balance in any stock item report." },
      { label: "Barcode integration", answer: "Barcode support in TallyPrime:\n\n1. Enable barcodes: F11 > Inventory Features > Enable Barcodes\n2. Assign barcode to each stock item\n3. During invoicing, scan the barcode — item auto-fills\n4. Supports Code 128, EAN-13, and QR codes\n\nWorks with USB barcode scanners. Just plug and play." },
    ]
  },
  {
    label: "Banking & Reconciliation",
    description: "Auto bank reconciliation in TallyPrime: import a bank statement, match entries, print cheques and run cash-flow reports.",
    keywords: ["brs", "cheque", "bank statement", "neft", "rtgs", "upi", "reconcile", "reconciliation"],
    answer: "TallyPrime makes banking effortless:\n\n- Auto BRS: Import bank statement (CSV/OFX) and match entries automatically\n- Cheque Printing: Design and print cheques directly\n- E-Payments: Send payments to vendors via NEFT/RTGS from Tally\n- Post-Dated Cheques: Track PDCs with maturity reminders\n- Cash Flow Reports: Predict future cash positions\n\nTo start auto-reconciliation: Go to Banking > Bank Reconciliation > select your bank > Import Statement.",
    followUp: [
      { label: "Auto bank reconciliation", answer: "Auto BRS steps:\n\n1. Go to Banking > Bank Reconciliation\n2. Select your bank ledger\n3. Click 'Import Bank Statement'\n4. Choose CSV, OFX, or QIF format\n5. Tally auto-matches entries by amount and date\n6. Review unmatched entries and manually match\n7. Accept — your BRS is done\n\nTime saved: Usually 2-3 hours of manual work becomes 5 minutes." },
    ]
  },
  {
    label: "Payroll & Employees",
    description: "Payroll is built into TallyPrime: switch it on, set pay heads, run attendance and the payroll voucher, and print payslips.",
    keywords: ["salary", "salaries", "pay structure", "pf", "esi", "attendance", "payslip", "employee", "employees", "hra"],
    // CHANGE: 2026-10-26 — payroll is NATIVE in TallyPrime (F11 > Show more features >
    // Maintain Payroll), so this answer no longer implies an add-on is needed and no longer
    // names a non-existent "Payroll Features" screen.
    answer: "TallyPrime's payroll module is built in - it is just hidden until you switch it on:\n\n- Enable it: F11 (Company Features) > press F11 again to Show more features > Maintain Payroll = Yes\n- Employee Profiles: Create Master > Payroll Masters > Employee Group / Employee\n- Pay Structure: Salary Details inside the employee record - basic, HRA, PF, ESI and custom components\n- Attendance: Attendance voucher for the month, or attendance imported from a device\n- Auto PF/ESI: employer and employee shares calculated from the pay heads\n- Income Tax: TDS on salary computed from the pay heads and reported in the TDS reports\n- Payslips: print or email a payslip for each employee from inside TallyPrime\n- Monthly run: Payroll voucher (Ctrl+F4)\n\nAn HRMS is only needed for employee self-service, biometric attendance and HR workflows - not for calculating salary.",
    followUp: [
      { label: "Creating pay structure", answer: "Pay structure setup:\n\n1. Create Master > Payroll Masters > Pay Head\n2. Create the components:\n   - Basic (earnings, the base for PF/ESI where applicable)\n   - HRA (earnings)\n   - PF Employee (deduction from the employee)\n   - PF Employer (employer contribution)\n3. Group the components under Salary Details in the employee record\n4. Assign the salary details to each employee\n\nTallyPrime calculates the earnings, deductions and statutory amounts from the pay head settings." },
    ]
  },
  {
    label: "Reports & Analysis",
    description: "TallyPrime reports for most business questions: balance sheet, profit and loss, cash flow and stock analysis.",
    keywords: ["report", "reports", "balance sheet", "profit", "cash flow", "dashboard", "ratio"],
    answer: "TallyPrime has 400+ built-in reports:\n\n- Balance Sheet: Real-time, drill-down to any ledger\n- Profit & Loss: See your business health at a glance\n- Cash Flow: Day-wise cash position\n- Stock Analysis: Aging, movement, slow/fast moving items\n- Ratio Analysis: Key financial ratios auto-calculated\n- Excel Export: Any report can be exported to Excel\n- Multi-period: Compare reports across different periods\n\nKeyboard shortcuts: Alt+F1 for detailed view, Alt+F12 for filter, F12 for configuration.",
    followUp: [
      { label: "Custom reports", answer: "Creating custom views:\n\n1. Open any standard report\n2. Press F12 (Configure)\n3. Change columns, rows, sorting, or grouping\n4. Save configuration — it becomes your custom view\n\nFor advanced needs:\n- Use Columnar reports (multiple periods side by side)\n- Use Cost Centre reports for department-wise tracking\n- Export to Excel and create your own dashboards\n\nTally also supports ODBC for real-time data in PowerBI or Excel." },
    ]
  },
  {
    label: "Keyboard Shortcuts",
    description: "TallyPrime keyboard shortcuts that save the most time: vouchers, navigation and reports.",
    keywords: ["shortcut", "shortcuts", "hotkey", "hotkeys", "keys", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "alt g", "ctrl a", "ctrl f"],
    // CHANGE: 2026-10-26 — checked against Tally Solutions' official shortcut reference.
    // Two keys were wrong: F1 opens the Help menu (F3 switches between open companies), and
    // Ctrl+F is autofill in a voucher (the find bar is Alt+F). Ctrl+K is the display-language
    // selector, the calculator is Ctrl+N; and Debit Note / Credit Note were swapped.
    answer: "Master these shortcuts and TallyPrime becomes lightning fast:\n\n- Alt+G — Go To (find any feature instantly)\n- Ctrl+G — Switch To (move between open tasks)\n- Alt+K — Company menu (create / alter / select / shut)\n- F3 — Switch between companies that are already open\n- F2 — Change the voucher date or the report date/period\n- F4 — Contra voucher\n- F5 — Payment voucher\n- F6 — Receipt voucher\n- F7 — Journal voucher\n- F8 — Sales voucher\n- F9 — Purchase voucher\n- Ctrl+A — Accept/Save\n- Alt+F — Open the find bar (masters and transactions)\n- Alt+F1 — Detailed view\n- Ctrl+N — Open or hide the calculator\n\nPro tip: Press Alt+G and type what you need — Tally finds it for you.",
    followUp: [
      { label: "Voucher shortcuts", answer: "Every voucher type has a shortcut:\n\n- F4 — Contra (bank-to-cash transfers)\n- F5 — Payment (outgoing money)\n- F6 — Receipt (incoming money)\n- F7 — Journal (adjustments)\n- F8 — Sales (your invoices)\n- F9 — Purchase (supplier bills)\n- Alt+F6 — Credit Note (sales return)\n- Alt+F5 — Debit Note (purchase return)\n- Ctrl+F8 — Sales Order\n- Ctrl+F9 — Purchase Order\n- Alt+F7 — Stock Journal\n- Ctrl+F4 — Payroll voucher\n\nCtrl+N opens or hides the calculator from anywhere." },
    ]
  },
  {
    // CHANGE: 2026-09-11 — New topic: legacy ERP renewal discontinued. Sits BEFORE TSS so
    // ERP9/upgrade queries match here first (matcher keeps stable order on equal scores).
    label: "ERP 9 License Upgrade",
    description: "Tally has discontinued Tally.ERP 9 renewals; ERP 9 users are given the option to upgrade the licence to TallyPrime.",
    keywords: ["erp9", "erp 9", "erp renewal", "erp9 renewal", "erp 9 renewal", "erp renewals", "erp 9 renewals", "discontinued", "legacy erp", "upgrade to tallyprime", "tallyprime upgrade", "erp upgrade"],
    answer: "Yes, Tally has officially discontinued legacy ERP renewals. Now ERP 9 users are given the option to upgrade their license to TallyPrime. For more customised information, contact Sarvadnya Infotech LLP. [[Contact Us|/contact]]",
  },
  {
    label: "TSS Renewal & Subscription",
    description: "What TSS covers, how to renew it inside TallyPrime, what stops when it expires, and what to do on Tally.ERP 9 now.",
    keywords: ["tss", "renew", "renewal", "subscription", "serial number", "manage license"],
    answer: "TSS (Tally Software Services) is the annual subscription that keeps a TallyPrime licence current — new releases, statutory compliance updates, the connected services (e-invoicing, e-way bills, GST filing and GSTR-2A/2B download, bank payments and auto bank reconciliation, mobile/WhatsApp reports) and technical support.\n\nYes, you can renew TSS directly from inside TallyPrime:\n\n1. From the Gateway of Tally, press Alt+R (Manage TSS Renewal) — this option appears when your renewal is due.\n2. Or go to F1 (Help) > Settings > License > Manage License, then press F9 (Renew TSS).\n3. Tally opens the Tally Solutions TSS renewal page in your browser — pick 1 Year or 2 Years, fill in the billing details and the serial number, and pay.\n4. After payment, update the licence from Manage License so TallyPrime shows the new coverage end date.\n\nWhen TSS is expired the connected features stop — e-invoicing, e-way bills, GST filing and GSTR-2A/2B download, bank payments and auto-BRS, mobile/WhatsApp reports — but offline data entry keeps working and your data stays safe. On Tally.ERP 9 there is nothing left to renew: TSS renewal was discontinued for all customers from 16 August 2026, so the path there is an upgrade to TallyPrime.\n\nIf the option is not visible on your screen, tell us your serial number and we can renew it for you: [[Renew TSS|/services/tss]]",
    followUp: [
      { label: "What stops when TSS expires?", answer: "When TSS is expired, these stop working:\n\n- E-invoicing & e-way bill generation/cancellation\n- GST auto-download of GSTR-2A/2B and direct return filing\n- Banking utilities — direct payments and auto bank reconciliation\n- Remote Access & WhatsApp — mobile/browser reports and WhatsApp invoice sharing\n\nOffline data entry keeps working and your data stays safe. Renew, then update the licence from Manage License, to turn them back on. [[Renew TSS|/services/tss]]" },
      { label: "No TSS option visible?", answer: "The Alt+R (Manage TSS Renewal) shortcut only appears on the Gateway of Tally when your renewal is due. You can reach the same thing any time via F1 (Help) > Settings > License > Manage License, then press F9 (Renew TSS). If you still don't see it, share your serial number with our team and we will renew it for you. [[Renew TSS|/services/tss]]" },
    ]
  },
  {
    // CHANGE: 2026-10-23 — NEW topic for the /shop catalogue. 107 ready-made TDLs, Excel
    // importers, boosters and industry modules already exist, so the most common question
    // ("is there something for X?") should resolve here instantly and zero-token - and Sara
    // must still ask ONE question before recommending, per the consultant rule.
    label: "Tally Shop & Ready-Made Add-ons",
    description: "107 ready-made TDL add-ons, Excel to Tally importers, boosters and industry modules TallyPrime businesses ask for most.",
    keywords: ["addon", "addons", "add-on", "add-ons", "add on", "add ons", "ready made", "ready-made", "shop", "catalogue", "catalog", "tdl list", "list of tdl", "addon list", "add-on list", "which addon", "what do you have", "what do you sell", "your products list"],
    answer: "Most requests are already built. Our shop has 107 ready-made solutions: TDL add-ons for a single job (invoice print formats, approvals, billing controls), Excel to Tally importers, business boosters and full industry modules - each one configured for your company, with no price on the page.\n\nTo point you at the right one, tell me: what has to happen, and where does it happen now (billing screen, purchase entry, a report, or outside Tally)?\n\n[[Browse the Shop|/shop]]\n[[Custom TDL|/services/tdl]]",
    followUp: [
      { label: "How does buying work?", answer: "Nothing is charged on the shop page. Every TDL is installed and licensed for your company, so **Buy** opens a short enquiry with that item already named. Our team confirms it fits your TallyPrime version, sends the quote and the setup plan, and installs it with you.\n\nIf the item turns out not to fit, we tell you before anything is billed. [[Browse the Shop|/shop]]" },
      { label: "Nothing in the shop fits", answer: "Then it is a custom build, and that is a normal request. Three things let our technical team scope it properly:\n\n1. Where it should live - your daily screen or a separate report?\n2. What it must show or do, and whether it prints, sends or updates anything.\n3. How many people use it, and how often.\n\nOften a built-in configuration (F12 on any report, cost centre, export to Excel) covers it with no TDL at all. [[TDL Customization|/services/tdl]]" },
    ]
  },
  {
    // CHANGE: 2026-10-22 — NEW topic. Sara is a business consultant, NOT a
    // programmer: a TDL / custom-build request must NEVER be answered with
    // code. This topic is deterministic (it wins the local matcher, so it
    // costs zero LLM tokens) and its answer asks the requirement questions
    // FIRST, then routes the build to our technical team.
    // Placed LAST on purpose: build requests are routed here deterministically
    // by the isCustomBuildRequest() check in matchTopic(), so the array order
    // does not decide the outcome. Keeping it last stops the generic word
    // overlap ("tallyprime", "how") from stealing unrelated queries such as
    // "how do I upgrade my licence to tallyprime".
    label: "TDL & Customisation",
    description: "When a TallyPrime need is a TDL customisation, what the technical team needs to scope it, and what you can do without one.",
    keywords: ["tdl", "customisation", "customization", "customise", "customize", "custom report", "custom reports", "custom field", "custom voucher", "custom screen", "custom invoice", "write tdl", "draft tdl", "tdl customization", "tdl customisation"],
    answer: "A TDL is Tally's own extension language - the way to add custom screens, fields and reports inside TallyPrime. Writing one is done by our technical team, and I don't write code myself. Three quick things so I brief them properly:\n\n1. Should it sit on the screen you use every day, or as a separate report?\n2. What exactly should it show or do (and should it print, send or update anything)?\n3. How many people will use it, and how often?\n\n[[TDL Customization|/services/tdl]]",
    followUp: [
      { label: "Options without a TDL", answer: "A lot, and it is usually enough:\n\n- Reports: press F12 (Configure) on any report to change columns, rows, sorting and grouping - that becomes your saved view.\n- Columnar reports: compare several periods side by side.\n- Cost Centre reports: department-wise tracking without any customisation.\n- Export to Excel: any report can be exported and shaped there.\n\nIf none of these cover what you need, our technical team can build a TDL on top of them." },
      { label: "Turnaround for a custom build", answer: "It depends on the scope, so the three questions above matter. A focused tweak usually takes days; anything with data migration or a new screen takes longer.\n\nSend us the brief and our technical team will confirm what is possible in TallyPrime itself first - a built-in configuration is often faster and cheaper than a TDL." },
    ]
  },
];

// CHANGE: 2026-10-22 — the label of the custom-build topic. Exported so the
// matcher can route build requests to it deterministically.
export const TDL_TOPIC_LABEL = 'TDL & Customisation';

// CHANGE: 2026-10-26 — SEO layer 1. Every Sara topic now has a real, indexable URL under
// /learn-sara/<slug>, generated from the SAME answer text Sara speaks in chat. WHY: the page
// used to be a chat-only, noindex screen, so the knowledge inside it could never rank; the
// guides are server-rendered from this one source, so there is no second copy of the content
// to keep in sync. The slug is derived here (not stored per topic) so the hub cards, the
// guide pages, the sitemap and the search map can never disagree about an address.
export function topicSlug(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export type SaraGuide = { slug: string; label: string; topic: Topic };

export const saraGuides: SaraGuide[] = saraTopics.map((topic) => ({
  slug: topicSlug(topic.label),
  label: topic.label,
  topic,
}));

export function getSaraGuide(slug: string): SaraGuide | null {
  return saraGuides.find((guide) => guide.slug === slug) ?? null;
}

export function getAllSaraGuideSlugs(): string[] {
  return saraGuides.map((guide) => guide.slug);
}

export function matchTopic(query: string): { topic: Topic; score: number } | null {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

  // CHANGE: 2026-10-22 — a custom-build request ALWAYS resolves to the TDL &
  // Customisation topic, whatever the generic scoring says. Without this,
  // "custom report for GST" scored higher on "Reports & Analysis" (whose
  // answer mentions "custom reports") and a build request was answered with a
  // generic reports list instead of the requirement questions.
  if (isCustomBuildRequest(query)) {
    const build = saraTopics.find(t => t.label === TDL_TOPIC_LABEL);
    if (build) return { topic: build, score: 100 };
  }

  const scoredTopics = saraTopics.map(t => {
    const labelLower = t.label.toLowerCase();
    const answerLower = t.answer.toLowerCase();
    let score = 0;

    if (labelLower.includes(queryLower)) score += 20;

    for (const word of queryWords) {
      if (labelLower.includes(word)) score += 5;
      if (answerLower.includes(word)) score += 2;
    }

    // CHANGE: 2026-09-05 — synonym keywords keep short/ambiguous queries ("stock",
    // "godown", "renew") on-syllabus without burning an LLM call or drifting to TSS.
    if (t.keywords) {
      for (const kw of t.keywords) {
        // \b boundaries stop short keywords (e.g. "keys") from matching longer words.
        if (new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(queryLower)) {
          score += 5;
        }
      }
    }

    if (t.followUp) {
      for (const fu of t.followUp) {
        const fuLower = fu.label.toLowerCase();
        for (const word of queryWords) {
          if (fuLower.includes(word)) score += 3;
        }
      }
    }

    return { topic: t, score };
  }).sort((a, b) => b.score - a.score);

  const bestMatch = scoredTopics[0];
  if (bestMatch && bestMatch.score >= 5) {
    return bestMatch;
  }
  return null;
}

export function getFallbackResponse(userInput: string): string {
  const input = userInput.toLowerCase().trim();

  // CHANGE: 2026-10-22 — a custom-build request is never answered here. It
  // gets the requirement questions + the technical team, exactly like the
  // live reply (lib/sara-guard.mjs is the single source of truth for that).
  // Checked BEFORE the contextual patterns so "custom report for GST" is not
  // hijacked by the generic reports answer below.
  if (isCustomBuildRequest(userInput)) {
    return buildNoCodeReply(userInput);
  }

  const contextualResponses: [RegExp, string][] = [
    // CHANGE: 2026-10-22 — "cost" is a pricing word, but "cost centre" is a Tally feature.
    // The negative lookahead keeps a "cost centre" question out of the pricing answer.
    [/price|cost(?!\s*cent)|rate|charge|fees|kitna|how much|expensive|cheap|budget/, "Good call checking prices! Rather than dumping numbers here, our pricing pages break it all down clearly. Tap the button that fits your size — or tell me your team size and I'll point you to the perfect setup.\n\n[[Silver Pricing|/products/silver#pricing]]\n[[Gold Pricing|/products/gold#pricing]]\n[[Server Pricing|/products/server#pricing]]\n[[Get a Quote|/contact]]"],
    [/who are you|about you|what can you do|how can you help|help me|i need help/, "I'm Sara, your business advisor from Sarvadnya Infotech LLP. We make Tally work for you. Three things businesses love us for:\n\n**TallyPrime** setup & support [[Explore|/products]]\n**AMC** with 15-min response SLA [[Learn More|/services/amc]]\n**Cloud backup** so data is never lost [[TallyDrive|/products/tallydrive]]\n\nWhat's the one thing eating the most time in your business?"],
    [/\bhello\b|\bhi\b|\bhey\b|namaste|good\s*(morning|afternoon|evening)|hii+|hlo|hola/, "Hello! Welcome to Sarvadnya — we've been automating businesses since 2008. Quick one: how many people work with your accounts? I'll suggest the perfect TallyPrime setup."],
    [/\bthanks?\b|\bty\b|thank you|\bbye\b|goodbye|\bok(ay)?\b|theek|alright|\bnice\b|\bgreat\b|\bcool\b/, "You're welcome! Whenever you're ready, I'd love to show you how **TallyDrive** keeps your data safe on autopilot. [[Explore TallyDrive|/products/tallydrive]]"],
    [/mango|fruit|vegetable|perishable|expiry|food|restaurant|cafe|kirana|grocery|pharmacy|medical|jewelry|jewellery/, "Perishable stock is a headache — expiry, wastage, reordering. **TallyPrime** tracks batches, expiry dates, and reorder levels automatically. Want me to show you how it handles that?"],
    [/software|install|setup|download|update|version|license/, "We handle the full **TallyPrime** setup — installation, data migration, GST config — and our **AMC** keeps it running with a 15-min response SLA. [[AMC Support|/services/amc]]\n\nWant us to set it up for you?"],
    [/integration|sync|connect|api|crm|erp|ecommerce|shopify|amazon|flipkart/, "**TallyPrime** connects with CRMs, ERPs, and e-commerce through our **Data Integration** service. We've built custom workflows for 200+ businesses. What system are you using?"],
    [/mobile|phone|android|app|access|remote|travel|outside|on the go|away/, "**Tally on Mobile** gives you live dashboards on your phone — bank balances, daily sales, stock status — no more calling your accountant. [[See It|/services/mobile-app-biz]]\n\nWant a quick demo?"],
    [/training|learn|teach|team|staff|students?|workshop/, "**Corporate Training** is customized for your team — GST, payroll, inventory, MIS reports — with certified Tally experts. For self-paced lessons, Learn Sara teaches step by step. [[Open Learn Sara|/learn-sara]]\n\nWant to schedule a workshop?"],
    [/error|problem|issue|not working|slow|crash|bug|fix|hang|freeze/, "Let's fix that! Quick checks: 1) restart TallyPrime, 2) confirm the license is active, 3) compress data (Data > Compress). If it still acts up, our **AMC** team jumps in with a 15-min SLA. [[AMC Support|/services/amc]]"],
    [/bank|reconcil|payment|upi|neft|rtgs|cheque|transfer/, "**TallyPrime** does auto bank reconciliation, e-payments via NEFT/RTGS, and UPI — that alone saves 2-3 hours a week. Want me to show you how?"],
    [/report|analytics|data|insight|dashboard|profit|loss|sales figures|sales report/, "**TallyPrime** has 400+ reports — Balance Sheet, cash flow, stock aging — all exportable to Excel. Which report do you need the most?"],
    [/team|multi|user|concurrent|office|branch|lan|multiple people/, "**TallyPrime Gold** lets your whole team work on the same data at once, and **TallyPrime Server** handles 10+ users for bigger setups. How many people need access?"],
    [/gst|tax|return|filing|compliance|gstr|einvoice|e-invoice|eway|e-way/, "**TallyPrime** auto-calculates GST, generates e-invoices, and files GSTR-1/3B. Are you filing manually right now? I'll show you how to automate it."],
    [/backup|data loss|lost|safe|secure|cloud|restore|stolen|corrupt/, "Worrying about lost data? **TallyDrive** backs up automatically with AES-256 encryption and 1-click restore. Is your Tally data backed up right now? [[Explore TallyDrive|/products/tallydrive]]"],
    [/loan|finance|capital|money|funding|invest|credit|borrow/, "**TallyCapital** offers business loans up to 75L unsecured, plus working capital — with quick approvals for Tally users. Want to check your eligibility?"],
    // CHANGE: 2026-10-26 — narrowed to actual HR-process questions. The old pattern also
    // caught "payroll / salary / employee / attendance", so a payroll question could be
    // answered with an HRMS pitch even though payroll is native in TallyPrime.
    [/hrms|human\s+resource|hr\s+(?:software|module|process|workflow|portal)|\bleave\b/, "Payroll itself is built into **TallyPrime** - salary structures, attendance, PF/ESI and payslips all work natively once Maintain Payroll is enabled. An **HRMS** is for the people side: employee self-service, leave approval workflows, biometric attendance and appraisals. [[See HRMS|/hrms]]\n\nWhich part are you trying to solve - paying people, or managing them?"],
    [/logistics|transport|delivery|fleet|vehicle|driver|truck|lorry|\blr\b/, "Our **Transport Module** automates LR (Lorry Receipt) creation and Single / Multiple LR billing inside TallyPrime — built for transport businesses running Own / Hired vehicles. [[Explore Modules|/modules]]"],
    [/container|log sheet|logsheet|harbour|port/, "Our **Container Handling Module** handles Log Sheet creation, Bulk / Single Party invoicing, and Annexure printing for the logistics industry's container handling activity. [[Explore Modules|/modules]]"],
    [/garment|retail|fashion|clothing|size|color|colour|store|footwear|shoes/, "Our **Garment / Footwear Sales Module** auto-creates items with color & size, and makes billing fast inside TallyPrime — perfect for readymade garments and footwear. [[Explore Modules|/modules]]"],
    [/society|housing|apartment|maintenance|building/, "Our **Housing Society Module** automates maintenance billing, interest calculation, and registers inside **TallyPrime** — built exactly for societies with 70+ members. [[Explore Modules|/modules]]"],
    [/cf\b|c\s*&|clearing|forwarding|job|import|reimbursable/, "Our **CFA Module** manages Jobs with documentation, multi-currency invoicing, and job-wise profitability inside TallyPrime — built for Clearing & Forwarding agencies. [[Explore Modules|/modules]]"],
    [/broker|agent|commission|rd|rate difference|salesman/, "Our **SalesMan / Agent Module** automates broker commissions and Rate Difference (RD) tracking inside TallyPrime for any industry using agents or brokers. [[Explore Modules|/modules]]"],
    // CHANGE: 2026-10-23 — the /shop catalogue is a first-class answer: 107 ready-made TDLs,
    // Excel importers, boosters and industry modules. Still asks before recommending.
    [/\badd-?ons?\b|\bshop\b|catalogue|catalog|ready[- ]made|\btdls?\b/, "We have 107 ready-made solutions in the shop - TDL add-ons, Excel to Tally importers, business boosters and industry modules - each installed and licensed for your company. [[Browse the Shop|/shop]]\n\nWhat should it do, and where does that work happen today (billing, purchase, a report, or outside Tally)?"],
    [/whatsapp|message|chat|remind/, "**Tally on WhatsApp** sends invoices, payment reminders, and ledger queries automatically — your customers get answers instantly. [[Learn More|/services/tally-on-whatsapp]]\n\nWant to set it up?"],
    [/cloud|online|remote|access|anywhere|from home|work from home/, "You can run TallyPrime from anywhere on **AWS Cloud** or **Windows Cloud Desktop**. [[Cloud Options|/cloud]]\n\nWhich would suit your team best?"],
    [/demo|trial|free|try|test/, "I'd love that! Book a free demo and our team will walk you through the right setup for your business. [[Book a Demo|/contact]]"],
    [/career|job|vacancy|interview|fresher|hiring/, "We're always looking for great people at Sarvadnya — check open roles here: [[Careers|/careers]]. And for your own team, our **Corporate Training** builds Tally skills fast."],
    [/about|company|who is|team|founder|address|location|belapur|navi mumbai/, "We're Sarvadnya Infotech LLP — a Tally Certified Partner since 2008 in Belapur, trusted by 1500+ businesses. [[About Us|/about]]\n\nWhat can we do for your business today?"],
    [/\btss\b|subscription|renew(?!.*amc)|serial\s*number/, "You can renew your **TSS** (Tally Software Services) right from inside TallyPrime: from the Gateway of Tally press **Alt+R** (Manage TSS Renewal), or go to **F1 (Help) > Settings > License > Manage License**, then press **F9 (Renew TSS)**. Tally opens the renewal page with your serial number to hand — pick 1 Year or 2 Years, pay, then update the licence so the new end date shows. The Alt+R option only appears when your renewal is due. Prefer we handle it? Share your serial number and we'll renew it for you. [[Renew TSS|/services/tss]]"],
    [/news|update|latest|announcement/, "We share product updates and news regularly — have a look: [[News|/news]]. Meanwhile, our **TSS Renewal** keeps your TallyPrime current with the latest statutory releases. [[Learn More|/services/tss]]"],
    [/calculator|addition|multiply|calculate|math|\d+\s*[+\-*\/]\s*\d+/, "I can't crunch numbers myself, but **TallyPrime** does all the math for you — totals, GST, payroll, and more, with zero manual calculation. [[See TallyPrime|/products]]\n\nWhat calculation are you trying to do?"],
  ];

  for (const [pattern, response] of contextualResponses) {
    if (pattern.test(input)) return response;
  }

  // CHANGE: 2026-10-22 — the catalogue check comes AFTER the contextual patterns (those are
  // more specific) and BEFORE the generic replies (which are the last resort). It turns a
  // business problem into the exact product / module / add-on that solves it, so the OFFLINE
  // Sara suggests the same things the online one does.
  const catalogReply = catalogSuggestionReply(userInput);
  if (catalogReply) return catalogReply;

  const genericResponses = [
    "Sounds like you run a business! **TallyPrime** can handle billing, inventory, GST, and payments all in one place. What do you deal in — products, services, or both?",
    "Got it! Every business needs clean accounting and GST compliance. **TallyPrime** automates all of it. What's the task taking most of your time right now?",
    "Interesting! Whatever your business, **TallyPrime** simplifies the books. Is it billing, inventory, or GST filing that's giving you the most trouble?",
    "I'm with you! However you work, we can make the numbers easier — **TallyPrime** for accounting, **TallyDrive** for safe backups. [[Explore All Products|/products]]\n\nWhat does your business sell?",
  ];

  const hash = input.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return genericResponses[hash % genericResponses.length];
}

export function getTeachingFallbackResponse(userInput: string): string {
  const input = userInput.toLowerCase();

  const teachingResponses: [RegExp, string][] = [
    [/hello|hi|hey|namaste|good\s*(morning|afternoon|evening)/, "Hello! Welcome to Learn Sara. I am here to help you master TallyPrime step by step. What would you like to learn about — GST, inventory, banking, payroll, or something else?"],
    [/thank|thanks|bye|goodbye|ok|okay|theek|alright/, "You're welcome! Keep practicing and you'll master TallyPrime in no time. Feel free to come back anytime with more questions."],
    [/\btss\b|subscription|renew(?!.*amc)|serial\s*number/, "Yes, you can renew your TSS (Tally Software Services) directly from inside TallyPrime:\n\n1. From the Gateway of Tally, press **Alt+R** (Manage TSS Renewal) — this option appears when your renewal is due.\n2. Or go to **F1 (Help) > Settings > License > Manage License**, then press **F9 (Renew TSS)**.\n3. Tally opens the Tally Solutions renewal page in your browser — pick 1 Year or 2 Years, fill in the billing details and the serial number, and complete the payment.\n4. Update the licence from Manage License so TallyPrime shows the new coverage end date.\n\nWhen TSS is expired, e-invoicing, e-way bills, GST filing, bank payments and mobile/WhatsApp reports stop — but offline data entry and your data keep working. On Tally.ERP 9 there is nothing left to renew from 16 August 2026; that path is an upgrade to TallyPrime. If the option is not visible on your screen, share your serial number and our team will renew it for you. [[Renew TSS|/services/tss]]"],
    [/\btdl\b|custom\s+(?:report|voucher|field|screen|invoice)|write\s+(?:a\s+|the\s+)?(?:code|script|program)|write\s+(?:a\s+|the\s+)?tdl|draft\s+(?:a\s+)?tdl|develop(?:ment)?\s+report/, "I don't write code, so I won't hand you a script - custom development is done by our technical team. [[TDL Customization|/services/tdl]]\n\nTell me what you're trying to achieve on screen and I'll show you the closest way to do it in TallyPrime itself - most needs are solved by a report configuration (F12), a cost centre or an export."],
    // CHANGE: 2026-10-23 — add-ons are a learning topic too: what they are, how they load, and
    // where the ready-made list lives. Kept short and pointed at the shop, never a sales dump.
    [/\badd-?ons?\b|ready[- ]made|\bshop\b|catalogue|catalog/, "An add-on (TDL) is extra functionality loaded on top of TallyPrime - a print format, an extra field, a control on a voucher, or a whole report. It does not change your data; you load it and it appears in the screens you already use.\n\nWe have 107 ready-made ones, and the shop page describes what each does in plain language. [[Browse the Shop|/shop]]\n\nWhich screen are you trying to change, and what should it show?"],
    // CHANGE: 2026-10-22 — "cost" is a pricing word, but "cost centre" is a Tally feature.
    // Without the negative lookahead the price answer hijacked every "cost centre" question
    // and hid the Cost Centre guide in the knowledge hub.
    [/price|cost(?!\s*cent)|rate|charge|fees|buy|purchase|license/, "For pricing and license details, please contact our sales team directly. Here, let us focus on learning how to use TallyPrime effectively. What feature would you like to understand?"],
    [/software|install|setup|download|update|version/, "To install TallyPrime: download from tallysolutions.com, run the installer, and follow the setup wizard. During first launch, create your company with GST details. Want me to walk you through the initial configuration step by step?"],
    [/gst|tax|return|filing|compliance|gstr/, "TallyPrime handles GST end to end. To get started: go to Company Features (F11) and Enable GST. Then set your GST rate and HSN/SAC codes. Would you like to learn how to create a GST invoice, or how to file GSTR-1?"],
    [/inventory|stock|godown|warehouse|item|product/, "TallyPrime inventory management is powerful. Start by creating Stock Items under Inventory Info. You can track quantities, values, godowns, batches, and reorder levels. What type of business inventory are you managing?"],
    [/bank|reconcil|payment|upi|neft|rtgs|cheque/, "Bank reconciliation in TallyPrime is simple: go to Banking > Bank Reconciliation, import your bank statement, and Tally auto-matches entries. Want me to explain the step-by-step process?"],
    // CHANGE: 2026-10-26 — payroll is native and lives under Maintain Payroll, not a
    // "Payroll Features" screen. Also points at the enable path that actually exists.
    [/payroll|salary|employee|attendance|pf|esi/, "TallyPrime has a full payroll module built in - it is just switched off by default. To enable it: press F11 (Company Features), press F11 again on that screen to show more features, set Maintain Payroll to Yes and accept. Then Create Master > Payroll Masters covers Employee Group, Employee, Pay Head and Salary Details, attendance is recorded with the Attendance voucher, the monthly run is the Payroll voucher (Ctrl+F4), and payslips print or email from inside TallyPrime. Would you like to learn how to set up a pay structure?"],
    // CHANGE: 2026-10-26 — "Ctrl+F to search" was wrong: Ctrl+F autofills a voucher, the
    // find bar is Alt+F, and filtering a report is Alt+F12.
    [/report|balance.sheet|profit|loss|cash.flow/, "TallyPrime has 400+ built-in reports. Press Alt+F1 for detailed view, F12 to configure columns, Alt+F12 to filter and Alt+F to open the find bar. The Balance Sheet and Profit & Loss reports update in real time. Which report would you like to learn to read?"],
    // CHANGE: 2026-10-26 — the shortcut list was corrected against Tally Solutions'
    // official reference: F3 (not F1) switches companies, and Alt+F (not Ctrl+F) opens the
    // find bar; Ctrl+F autofills vouchers and Ctrl+N is the calculator.
    [/shortcut|keyboard|key|hotkey|ctrl|alt/, "Here are the most useful shortcuts:\n\n- Alt+G - Go To (find anything)\n- Ctrl+G - Switch To (move between open tasks)\n- Alt+K - Company menu\n- F3 - Switch between open companies\n- F5 - Payment voucher\n- F8 - Sales voucher\n- F9 - Purchase voucher\n- Ctrl+A - Accept/Save\n- Alt+F - Find bar (masters and transactions)\n- Ctrl+N - Calculator\n\nWant me to explain any specific shortcut in detail?"],
    [/voucher|entry|transaction|journal|contra/, "TallyPrime uses different voucher types for different transactions:\n\n- F5 - Payment (money going out)\n- F6 - Receipt (money coming in)\n- F7 - Journal (adjustments)\n- F8 - Sales (your invoices)\n- F9 - Purchase (supplier bills)\n\nWhich voucher type would you like to learn to create?"],
    [/error|problem|issue|not working|slow|crash|bug|fix/, "Common TallyPrime issues and fixes:\n\n- Slow performance: Go to Data > Compress\n- Can't find feature: Press Alt+G and search\n- Data corruption: Use Help > Troubleshooting > Data Integrity\n- GST mismatch: Use the GST Reconciliation report\n\nWhat specific issue are you facing?"],
    [/backup|restore|data|safe/, "To backup in TallyPrime: go to Data > Backup, select your company, choose a destination folder, and confirm. To restore: Data > Restore, select the backup file. I recommend backing up daily. Want to learn about automatic cloud backup with TallyDrive?"],
    [/cloud|remote|access|online|anywhere/, "You can access TallyPrime remotely via AWS Cloud or Windows Cloud Desktop. This lets you work from home, office, or while traveling. Want me to explain how remote access works step by step?"],
    [/e.invoice|einvoicing|irn|qrcode/, "E-Invoicing in TallyPrime:\n\n1. Enable: F11 > GST > Enable E-Invoicing\n2. Set IRN threshold (currently Rs. 5 crore)\n3. While saving invoice, press Ctrl+I for IRN\n4. Tally auto-generates QR code and IRN\n\nWould you like to practice creating an e-invoice?"],
    [/e.way|eway|ewaybill|shipment/, "E-Way Bill generation in TallyPrime:\n\n1. Enable: F11 > GST > Enable E-Way Bill\n2. While creating an invoice for goods above Rs. 50,000\n3. Enter vehicle details and destination\n4. Tally generates the E-Way Bill JSON\n\nWant me to walk through the complete process?"],
  ];

  for (const [pattern, response] of teachingResponses) {
    if (pattern.test(input)) return response;
  }

  // CHANGE: 2026-10-22 — point the learner at the EXACT free guide from the Tally Insights
  // knowledge hub instead of writing a long answer, when one matches their question.
  const guideReply = guideSuggestionReply(userInput);
  if (guideReply) return guideReply;

  const genericTeachingResponses = [
    "That is an interesting question! Let me help you understand this better in the context of TallyPrime. Could you tell me more about what you are trying to accomplish? For example, are you working with invoicing, inventory, or reports?",
    "Good question! TallyPrime has a feature for that. Let me guide you through it step by step. First, can you tell me which TallyPrime product you are using — Silver (single user) or Gold (multi user)?",
    "I understand your question. Let me break this down into simple steps. In TallyPrime, most tasks start from the Gateway of Tally. What specific area are you trying to learn — accounting, inventory, or statutory compliance?",
  ];

  const hash = input.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return genericTeachingResponses[hash % genericTeachingResponses.length];
}

export const SARA_WELCOME = "Hello! I'm Sara, your Sarvadnya Infotech LLP Assistant. I can help you automate your business with Tally—feel free to ask your questions!";
