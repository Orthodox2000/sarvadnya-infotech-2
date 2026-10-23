// CHANGE: 2026-10-22 — NEW: the catalogue Sara sells from.
//
// WHY: the owner asked Sara to be updated "with our new website content, updated addons and
// details" so she can SUGGEST them instead of only answering. Until now the product list lived
// as a hand-maintained blob inside the system prompt in app/api/chat/route.ts, the add-ons lived
// in lib/addons.ts, and the free learning guides lived in lib/learn-tally-curriculum.ts — three
// separate places, none of them reachable from the chat route.
//
// This module is the SINGLE SOURCE OF TRUTH for what we sell and what we teach:
//   PRODUCTS          — products, cloud, services and the 6 industry modules (with a detail line)
//   ADDONS            — the 20 ready TDL add-ons, imported from ./addons.mjs (one source of truth)
//   SHOP              — the full /shop catalogue (107 TDLs, importers, boosters, modules), imported
//                       from ./tdl-catalog.mjs (CHANGE: 2026-10-23, same one-source-of-truth rule)
//   LEARNING_SECTIONS / LEARNING_LESSONS — the Tally Insights knowledge hub (13 / 16)
//   buildCatalogPromptBlock() / buildGuidesPromptBlock() — the prompt text, GENERATED from the
//                      data above so the prompt can never drift from the catalogue
//   suggestCatalog()  — deterministic matching (a business problem -> the add-on/product/guide
//                      that solves it), used by the offline fallback when the AI API is down
//
// PURE ESM, zero dependencies (house pattern: lib/prices-catalog.mjs, lib/email-autoreply.mjs,
// lib/careers-referral.mjs) so plain-Node test suites can import it directly.
// RELATIVE imports on purpose: the plain-Node suites cannot resolve the "@/" alias.

import { addons as addonCatalogue } from './addons.mjs';
import { TDL_ITEMS, TDL_GROUPS, TDL_CATEGORIES } from './tdl-catalog.mjs';

/** A sellable item: a product, a cloud service, a service we offer, or an industry module. */
export const PRODUCTS = [
  // ---- TallyPrime editions -------------------------------------------------
  {
    id: 'tallyprime-silver',
    label: 'TallyPrime Silver',
    category: 'product',
    detail: 'Single-user licence. Best for solo businesses, small shops and single-operator firms.',
    url: '/products/silver',
    keywords: ['silver', 'single user', 'one user', 'solo', 'small shop', 'small business', 'tallyprime silver'],
  },
  {
    id: 'tallyprime-gold',
    label: 'TallyPrime Gold',
    category: 'product',
    detail: 'Multi-user LAN licence for 2-10 users. For growing teams who need simultaneous access on one data set.',
    url: '/products/gold',
    keywords: ['gold', 'multi user', 'multiuser', 'lan', '2-10 users', 'growing team', 'tallyprime gold'],
  },
  {
    id: 'tallyprime-server',
    label: 'TallyPrime Server',
    category: 'product',
    detail: 'Enterprise edition for 10+ users, for large organisations with heavy data and strict control.',
    url: '/products/server',
    keywords: ['server', 'enterprise', '10 users', 'large organisation', 'multi branch', 'tallyprime server'],
  },
  // ---- Cloud ---------------------------------------------------------------
  {
    id: 'tally-cloud-access',
    label: 'Tally Cloud Access',
    category: 'cloud',
    detail: 'Managed multi-cloud platform (AWS / Oracle / Windows) in Basic, Standard and Professional tiers.',
    url: '/cloud/tallycloudaccess',
    keywords: ['cloud access', 'tallycloudaccess', 'managed cloud', 'remote access', 'work from anywhere', 'anywhere'],
  },
  {
    id: 'aws-cloud',
    label: 'AWS Cloud',
    category: 'cloud',
    detail: 'Run TallyPrime on AWS and reach your books from anywhere in the world.',
    url: '/cloud/aws',
    keywords: ['aws', 'amazon', 'aws cloud', 'hosted tally', 'cloud server'],
  },
  {
    id: 'windows-cloud',
    label: 'Windows Cloud Desktop',
    category: 'cloud',
    detail: 'A full Windows desktop on the cloud, so Tally runs exactly as it does on your office PC.',
    url: '/cloud/windows',
    keywords: ['windows cloud', 'virtual desktop', 'windows vm', 'remote desktop', 'vdi'],
  },
  {
    id: 'backup-for-tally',
    label: 'Backup for TallyPrime',
    category: 'cloud',
    detail: 'Automated encrypted cloud backup of your Tally data, so a laptop failure is never a data loss.',
    url: '/cloud/backup-for-tally',
    keywords: ['backup for tally', 'cloud backup', 'automatic backup', 'encrypted backup', 'data safety'],
  },
  // ---- Business solutions --------------------------------------------------
  {
    id: 'tallydrive',
    label: 'TallyDrive',
    category: 'product',
    detail: 'Automated cloud backup with AES-256 encryption, scheduled backups and 1-click restore.',
    url: '/products/tallydrive',
    keywords: ['tallydrive', 'backup', 'restore', 'aes', 'scheduled backup', 'data loss', 'safe data'],
  },
  {
    id: 'tallycapital',
    label: 'TallyCapital',
    category: 'product',
    detail: 'Business finance through partner banks - unsecured loans up to 75L, LAP up to 15Cr, working capital and professional loans.',
    url: '/products/tallycapital',
    keywords: ['tallycapital', 'loan', 'loans', 'funding', 'working capital', 'unsecured', 'lap', 'borrow', 'finance', 'emi'],
  },
  {
    id: 'hrms',
    label: 'HRMS',
    category: 'product',
    detail: 'Complete human resource management - payroll, attendance, employee records and compliance, connected to TallyPrime.',
    url: '/hrms',
    keywords: ['hrms', 'hr', 'human resource', 'payroll software', 'attendance software', 'employee records', 'leave', 'compliance'],
  },
  // ---- Services ------------------------------------------------------------
  {
    id: 'amc',
    label: 'AMC (Annual Maintenance Contract)',
    category: 'service',
    detail: 'Priority support with a 15-minute response SLA, unlimited remote support and quarterly health checks.',
    url: '/services/amc',
    keywords: ['amc', 'maintenance', 'annual maintenance', 'support contract', 'sla', 'helpline', 'support'],
  },
  {
    id: 'corporate-training',
    label: 'Corporate Training',
    category: 'service',
    detail: 'Customised GST, payroll and MIS training for your accounting team, on your own data and screens.',
    url: '/services/corporate-training',
    keywords: ['training', 'corporate training', 'workshop', 'staff training', 'team training', 'gst training', 'payroll training'],
  },
  {
    id: 'tdl-customization',
    label: 'TDL Customization',
    category: 'service',
    detail: 'Bespoke Tally features built by our technical team - custom invoices, workflows, modules, digital signatures, email and SMS automation.',
    url: '/services/tdl',
    keywords: ['tdl', 'customization', 'customisation', 'custom development', 'bespoke', 'custom feature', 'custom screen', 'custom field'],
  },
  {
    id: 'tss-renewal',
    label: 'TSS Renewal',
    category: 'service',
    detail: 'Keeps TallyPrime updated with the latest statutory releases. Works on Silver, Gold and Server. Renew in-app (Gateway of Tally > Alt+R, or F1 > Settings > License > Manage License > F9), or share your serial number and we process it for you.',
    url: '/services/tss',
    keywords: ['tss', 'renew', 'renewal', 'subscription', 'serial number', 'manage license', 'tally software services', 'expiry', 'expired'],
  },
  {
    id: 'tally-on-mobile',
    label: 'Tally on Mobile (BizAnalyst)',
    category: 'service',
    detail: 'Real-time business dashboards on the phone - live bank balances, daily sales and stock status.',
    url: '/services/mobile-app-biz',
    keywords: ['mobile', 'phone', 'bizanalyst', 'android', 'dashboard on phone', 'on the go', 'mobile reports'],
  },
  {
    id: 'tally-on-whatsapp',
    label: 'Tally on WhatsApp',
    category: 'service',
    detail: 'Send invoices, payment reminders and ledger queries over WhatsApp - your customers get answers instantly.',
    url: '/services/tally-on-whatsapp',
    keywords: ['whatsapp', 'send invoice on whatsapp', 'payment reminder', 'whatsapp business', 'chat with customers'],
  },
  // ---- Industry modules ----------------------------------------------------
  {
    id: 'module-cfa',
    label: 'CFA Module (Clearing & Forwarding Agencies)',
    category: 'module',
    detail: 'Job creation and import, job-wise reimbursable billing and job profitability reports inside TallyPrime.',
    url: '/modules#cf-agencies',
    keywords: ['cfa', 'clearing and forwarding', 'cf agency', 'job work', 'job costing', 'reimbursable billing', 'import job'],
  },
  {
    id: 'module-housing-society',
    label: 'Housing Society Module',
    category: 'module',
    detail: 'Automated maintenance billing, interest calculation and registers for housing societies.',
    url: '/modules#housing-societies',
    keywords: ['housing society', 'society', 'maintenance billing', 'apartment', 'resident', 'society billing'],
  },
  {
    id: 'module-salesman',
    label: 'SalesMan / Agent Module',
    category: 'module',
    detail: 'Broker commissions, Rate Difference (RD) tracking and settlement reports for any business that uses agents.',
    url: '/modules#sales-commission',
    keywords: ['salesman', 'agent', 'broker', 'commission', 'rate difference', 'rd', 'settlement', 'agent commission'],
  },
  {
    id: 'module-transport',
    label: 'Transport Module',
    category: 'module',
    detail: 'LR (Lorry Receipt) creation, single and multiple LR billing, plus annexure - built for own and hired vehicle fleets.',
    url: '/modules#logistics-transport',
    keywords: ['transport', 'logistics', 'lr', 'lorry receipt', 'fleet', 'vehicle', 'delivery', 'truck', 'hired vehicle'],
  },
  {
    id: 'module-container',
    label: 'Container Handling Module',
    category: 'module',
    detail: 'Log Sheet creation, bulk and single party invoicing, unbilled reports and annexure printing for container handling.',
    url: '/modules#container-handling',
    keywords: ['container', 'log sheet', 'logsheet', 'harbour', 'port', 'container handling', 'unbilled'],
  },
  {
    id: 'module-garment',
    label: 'Garment / Footwear Module',
    category: 'module',
    detail: 'Auto item creation with colour and size, and fast billing for readymade garments and footwear retail.',
    url: '/modules#garment-retail',
    keywords: ['garment', 'footwear', 'fashion', 'clothing', 'readymade', 'colour and size', 'retail', 'apparel'],
  },
];

/** The add-ons catalogue, with the /addons page itself as the entry point. */
export const ADDONS_CATALOGUE = {
  id: 'addons-catalogue',
  label: 'Tally Add-ons Catalogue (20 ready-made TDL add-ons)',
  category: 'learning',
  detail: 'Ready-to-install TDL add-ons for TallyPrime - invoice formatting, controls, automation, email and approvals.',
  url: '/addons',
  keywords: ['addon', 'addons', 'add-on', 'add-ons', 'add on', 'add ons', 'tdl addons', 'ready made', 'ready-made', 'extension'],
};

/**
 * The full shop catalogue (/shop) — 107 TDLs, Excel importers, boosters and industry modules.
 * CHANGE: 2026-10-23 — Sara must be able to point at the RIGHT one of 107 items, so the shop is
 * part of her catalogue exactly like the 20 add-ons are. It is generated from lib/tdl-catalog.mjs
 * (the same data /shop renders from) so the two can never drift.
 */
export const SHOP_CATALOGUE = {
  id: 'shop-catalogue',
  label: 'Tally Shop (our complete catalogue of TDLs, importers, boosters and modules)',
  category: 'learning',
  detail: 'Every Tally add-on, Excel to Tally importer, business booster and industry module we build - searchable by the problem it solves, quote on request.',
  url: '/shop',
  keywords: ['shop', 'catalogue', 'catalog', 'tdl', 'tdls', 'addon list', 'add-on list', 'all addons', 'what do you have', 'what do you sell', 'solutions list', 'product list'],
};

/** The shop items as catalogue entries (one per TDL), deep-linked to /shop#slug. */
const SHOP_ITEMS = TDL_ITEMS.map((item) => ({
  id: item.slug,
  label: item.title,
  title: item.title,
  kind: 'shop',
  detail: item.summary,
  url: `/shop#${item.slug}`,
  keywords: item.keywords || [],
}));

/** The free knowledge hub - "Tally Insights" - and the guides inside it. */
export const LEARNING_SECTIONS = [
  { id: 'fundamentals-version-transitions', title: 'Tally Fundamentals & Version Transitions' },
  { id: 'shortcuts-cheat-sheet', title: 'Tally Prime Shortcuts' },
  { id: 'company-masters', title: 'Company Setup, Masters & Chart of Accounts' },
  { id: 'vouchers-contra', title: 'Vouchers, Contra & Day-to-Day Entries' },
  { id: 'gst-compliance', title: 'GST in Tally Prime' },
  { id: 'bank-reconciliation', title: 'Bank Reconciliation & Cash Management' },
  { id: 'cost-centres', title: 'Cost Centres, Projects & Departmental Accounting' },
  { id: 'inventory', title: 'Inventory, BOM & Godowns' },
  { id: 'payroll-hrms', title: 'Payroll, HR & Attendance' },
  { id: 'reports-analysis', title: 'Reports, Analysis & Audit Readiness' },
  { id: 'integration', title: 'Integration (Excel Power Query, XML API, ODBC)' },
  { id: 'career-prep', title: 'Career Preparation (Interview, MCQ & Advanced)' },
  { id: 'tss-licensing-cloud', title: 'TSS, Licensing, Upgrades & Tally Cloud Access' },
];

export const LEARNING_LESSONS = [
  {
    id: 'tally-erp9-vs-tally-prime',
    section: 'fundamentals-version-transitions',
    title: 'Difference Between Tally ERP 9 and Tally Prime',
    detail: 'A side-by-side comparison table of features, so the owner can decide what an upgrade actually buys.',
    url: '/tally-insights/fundamentals-version-transitions/tally-erp9-vs-tally-prime',
    keywords: ['erp 9', 'erp9', 'vs prime', 'difference between', 'comparison', 'upgrade', 'old version'],
  },
  {
    id: 'latest-version-of-tally-prime',
    section: 'fundamentals-version-transitions',
    title: 'Latest Version of Tally Prime (7.2)',
    detail: 'What TallyPrime 7.2 is, what changed, and how to plan an upgrade (we do the upgrade for you).',
    url: '/tally-insights/fundamentals-version-transitions/latest-version-of-tally-prime',
    keywords: ['latest version', '7.2', 'version', 'new release', 'update tally', 'upgrade to 7.2'],
  },
  {
    id: 'tally-prime-shortcuts-complete-list',
    section: 'shortcuts-cheat-sheet',
    title: 'Tally Prime Shortcut Keys: Complete List',
    detail: 'The full printable shortcut list - hidden keys, essential keys, navigation and voucher shortcuts.',
    url: '/tally-insights/shortcuts-cheat-sheet/tally-prime-shortcuts-complete-list',
    keywords: ['shortcut', 'shortcuts', 'hotkey', 'keyboard', 'f5', 'f8', 'f9', 'alt g', 'cheat sheet'],
  },
  {
    id: 'how-to-create-company-in-tally',
    section: 'company-masters',
    title: 'How to Create a Company in Tally Prime',
    detail: 'Step-by-step company creation - state, books beginning from, financial year and GST readiness.',
    url: '/tally-insights/company-masters/how-to-create-company-in-tally',
    keywords: ['create company', 'new company', 'company setup', 'books beginning', 'financial year'],
  },
  {
    id: 'masters-ledgers-groups',
    section: 'company-masters',
    title: 'Masters, Ledgers & Groups in Tally Prime',
    detail: 'How masters, ledgers and groups work together, with an industry-specific chart of accounts.',
    url: '/tally-insights/company-masters/masters-ledgers-groups',
    keywords: ['masters', 'ledger', 'ledgers', 'groups', 'chart of accounts', 'create ledger'],
  },
  {
    id: 'vouchers-types-contra',
    section: 'vouchers-contra',
    title: 'Types of Vouchers in Tally Prime',
    detail: 'Payment, Receipt, Journal, Contra, Sales, Purchase - what each one is for and when to use it.',
    url: '/tally-insights/vouchers-contra/vouchers-types-contra',
    keywords: ['voucher', 'vouchers', 'payment receipt journal contra', 'contra', 'entry types'],
  },
  {
    id: 'how-to-record-bank-reconciliation-in-tally',
    section: 'bank-reconciliation',
    title: 'How to Record Bank Reconciliation in Tally Prime',
    detail: 'Auto BRS end to end - import the statement, let Tally match, then accept the reconciliation.',
    url: '/tally-insights/bank-reconciliation/how-to-record-bank-reconciliation-in-tally',
    keywords: ['bank reconciliation', 'brs', 'reconcile', 'bank statement', 'auto brs'],
  },
  {
    id: 'cost-centre-in-tally',
    section: 'cost-centres',
    title: 'Cost Centre in Tally Prime with Examples',
    detail: 'Department-wise and project-wise accounting without any customisation.',
    url: '/tally-insights/cost-centres/cost-centre-in-tally',
    keywords: ['cost centre', 'cost center', 'department', 'project', 'departmental accounting'],
  },
  {
    id: 'tally-inventory-bom-godowns',
    section: 'inventory',
    title: 'Tally Prime Inventory: Stock Items, Godowns, BOM',
    detail: 'Stock items, godowns, batches, reorder levels and bill of materials - the full inventory picture.',
    url: '/tally-insights/inventory/tally-inventory-bom-godowns',
    keywords: ['inventory', 'stock item', 'godown', 'bom', 'bill of materials', 'batch', 'reorder level'],
  },
  {
    id: 'tally-gst',
    section: 'gst-compliance',
    title: 'GST in Tally Prime: Setup, Invoicing and GST Reports',
    detail: 'Enable GST, raise compliant invoices and read the GST reports without guesswork.',
    url: '/tally-insights/gst-compliance/tally-gst',
    keywords: ['gst', 'gst setup', 'gst invoice', 'gst reports', 'gstr', 'intra state', 'igst', 'cgst', 'sgst'],
  },
  {
    id: 'tally-payroll-hrms',
    section: 'payroll-hrms',
    title: 'Payroll in TallyPrime: What Is Native, What Needs an HRMS Add-on',
    detail: 'An honest split between what TallyPrime payroll does on its own and what needs our HRMS.',
    url: '/tally-insights/payroll-hrms/tally-payroll-hrms',
    keywords: ['payroll', 'salary', 'payslip', 'pf', 'esi', 'hrms', 'attendance', 'pay structure'],
  },
  {
    id: 'tally-reports-analysis',
    section: 'reports-analysis',
    title: 'TallyPrime Reports: Balance Sheet, Profit and Loss, Cash Flow and Audit Readiness',
    detail: 'The reports that matter, how to read them, and how to get audit-ready output.',
    url: '/tally-insights/reports-analysis/tally-reports-analysis',
    keywords: ['report', 'reports', 'balance sheet', 'profit and loss', 'cash flow', 'audit', 'analysis'],
  },
  {
    id: 'tally-integration-excel-xml-odbc',
    section: 'integration',
    title: 'TallyPrime Integration: Excel, XML API, ODBC and Power Query',
    detail: 'Pull Tally data into Excel or Power BI, and push data in, using the supported routes.',
    url: '/tally-insights/integration/tally-integration-excel-xml-odbc',
    keywords: ['integration', 'excel', 'xml', 'odbc', 'power query', 'powerbi', 'api', 'export data'],
  },
  {
    id: 'tally-career-prep',
    section: 'career-prep',
    title: 'Tally Interview Questions and MCQs: Career Preparation Guide',
    detail: 'Interview questions, MCQs and advanced topics for anyone preparing for a Tally job.',
    url: '/tally-insights/career-prep/tally-career-prep',
    keywords: ['interview', 'mcq', 'career', 'job', 'preparation', 'hiring', 'fresher'],
  },
  {
    id: 'tss-licensing-upgrades-cloud',
    section: 'tss-licensing-cloud',
    title: 'TSS, Licensing, ERP 9 to Prime Upgrades and Tally Cloud Access',
    detail: 'What TSS covers, how licensing works, when to upgrade and how to reach Tally from anywhere.',
    url: '/tally-insights/tss-licensing-cloud/tss-licensing-upgrades-cloud',
    keywords: ['tss', 'licensing', 'license', 'upgrade', 'cloud access', 'erp 9 upgrade', 'subscription'],
  },
  {
    id: 'tss-offline-renewal-how-to-renew',
    section: 'tss-licensing-cloud',
    title: 'How to Renew Tally TSS Offline: Steps, Requirements and When to Contact Us',
    detail: 'The offline TSS renewal path - what you need, how it works, and when we should handle it for you.',
    url: '/tally-insights/tss-licensing-cloud/tss-offline-renewal-how-to-renew',
    keywords: ['tss renewal', 'offline renewal', 'renew tss', 'tss expiry', 'renew offline', 'serial number'],
  },
];

/** The knowledge-hub entry point (the guides above live inside it). */
export const INSIGHTS_HUB = {
  id: 'tally-insights',
  label: 'Tally Insights (free knowledge hub)',
  category: 'learning',
  detail: 'Our free written guides for TallyPrime - 13 sections and 16 step-by-step lessons you can read and share.',
  url: '/tally-insights',
  keywords: ['insights', 'knowledge hub', 'guides', 'tutorial', 'learn', 'documentation', 'free guide', 'how to'],
};

const ADDON_URL_PREFIX = '/addons#';

// ---------------------------------------------------------------------------
// Prompt blocks - GENERATED from the data above so the prompt can never drift
// from the catalogue (the old prompt carried a hand-maintained copy).
// ---------------------------------------------------------------------------

/** Compact one-line catalogue entry used inside the prompt. */
function catalogueLine(item) {
  return `- **${item.label}** — ${item.detail} [[${item.label}|${item.url}]]`;
}

/**
 * The SALES catalogue block: products, cloud, services, modules and every add-on.
 * @returns {string}
 */
export function buildCatalogPromptBlock() {
  const lines = [];

  const group = (title, items) => {
    lines.push(`${title}:`);
    for (const item of items) lines.push(catalogueLine(item));
    lines.push('');
  };

  group('TALLYPRIME EDITIONS & BUSINESS SOLUTIONS', PRODUCTS.filter((p) => p.category === 'product'));
  group('CLOUD SOLUTIONS', PRODUCTS.filter((p) => p.category === 'cloud'));
  group('SERVICES', PRODUCTS.filter((p) => p.category === 'service'));
  group('INDUSTRY MODULES (plug into TallyPrime)', PRODUCTS.filter((p) => p.category === 'module'));
  group('ADD-ONS (ready-made TDL add-ons for TallyPrime)', [
    ADDONS_CATALOGUE,
    ...addonCatalogue.map((a) => ({
      id: a.id,
      label: a.title,
      category: 'addon',
      detail: a.useCase || a.description,
      url: `${ADDON_URL_PREFIX}${a.id}`,
      keywords: a.keywords || [],
    })),
  ]);

  // CHANGE: 2026-10-23 — the full /shop catalogue (107 items), generated from the same data the
  // shop page renders. Sara must be able to name the exact item and link straight to its anchor,
  // otherwise "do you have something for container handling?" ends in a generic answer.
  group(
    `TALLY SHOP — THE COMPLETE CATALOGUE (${TDL_ITEMS.length} items across ${TDL_GROUPS.length} collections: ${TDL_GROUPS.map((g) => g.label).join(', ')}; filterable by ${TDL_CATEGORIES.length} categories incl. ${TDL_CATEGORIES.slice(0, 4).map((c) => c.label).join(', ')})`,
    [SHOP_CATALOGUE, ...SHOP_ITEMS],
  );

  return lines.join('\n').trim();
}

/**
 * The LEARN catalogue block: the free Tally Insights guides.
 * @returns {string}
 */
export function buildGuidesPromptBlock() {
  const lines = [];
  lines.push(catalogueLine(INSIGHTS_HUB));
  lines.push('');
  lines.push('THE SECTIONS INSIDE IT (open the hub above to browse them):');
  for (const section of LEARNING_SECTIONS) {
    lines.push(`- ${section.title}`);
  }
  lines.push('');
  lines.push('THE GUIDES INSIDE IT:');
  for (const lesson of LEARNING_LESSONS) {
    lines.push(`- **${lesson.title}** — ${lesson.detail} [[${lesson.title}|${lesson.url}]]`);
  }
  return lines.join('\n').trim();
}

// ---------------------------------------------------------------------------
// Deterministic suggestion engine - used by the OFFLINE fallback (when the AI
// API is down) so the offline Sara suggests the same things the online one does.
// Word-boundary matching, exactly like lib/sara-topics.ts matchTopic().
// ---------------------------------------------------------------------------

function scoreItem(item, queryLower, queryWords) {
  let score = 0;
  // CHANGE: 2026-10-22 — every entry is normalised to a `label` by allEntries(), but the
  // fallback keeps this defensive so a future entry shape can never crash the matcher.
  const labelLower = String(item.label || item.title || '').toLowerCase();

  if (labelLower.includes(queryLower) && queryLower.length > 3) score += 20;

  for (const word of queryWords) {
    if (labelLower.includes(word)) score += 5;
    if (item.detail && item.detail.toLowerCase().includes(word)) score += 2;
  }

  for (const kw of item.keywords || []) {
    if (new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(queryLower)) score += 5;
  }

  return score;
}

/**
 * All catalogue entries (products + add-ons + guides) in one flat list.
 * CHANGE: 2026-10-22 — every entry is normalised to the SAME shape (`id`, `label`, `title`,
 * `kind`, `detail`, `url`, `keywords`) so the scorer and the callers never have to care
 * whether the source used `title` (lessons, add-ons) or `label` (products).
 */
function allEntries() {
  const addonEntries = addonCatalogue.map((a) => ({
    id: a.id,
    label: a.title,
    title: a.title,
    kind: 'addon',
    detail: a.useCase || a.description,
    url: `${ADDON_URL_PREFIX}${a.id}`,
    keywords: a.keywords || [],
  }));
  const productEntries = PRODUCTS.map((p) => ({
    ...p,
    title: p.label,
    kind: p.category === 'module' ? 'module' : 'product',
  }));
  const guideEntries = LEARNING_LESSONS.map((l) => ({ ...l, label: l.title, kind: 'guide' }));
  const learningEntries = [INSIGHTS_HUB, ADDONS_CATALOGUE, SHOP_CATALOGUE].map((l) => ({
    ...l,
    title: l.label,
    kind: 'learning',
  }));
  // CHANGE: 2026-10-23 — the 107 shop items participate in offline matching too, so the fallback
  // (AI API down) can still name the exact TDL instead of a generic "we do customisation".
  return [...productEntries, ...addonEntries, ...SHOP_ITEMS, ...guideEntries, ...learningEntries];
}

/** Which result bucket each entry kind lands in. */
const BUCKETS = {
  product: 'products',
  module: 'modules',
  addon: 'addons',
  shop: 'shop',
  guide: 'guides',
  learning: 'learning',
};

/**
 * Match a visitor's message against the catalogue.
 * @param {string} query
 * @param {{ limit?: number, minScore?: number }} [options]
 * @returns {{ products: any[], addons: any[], shop: any[], guides: any[], modules: any[], learning: any[] }}
 */
export function suggestCatalog(query, options = {}) {
  const limit = typeof options.limit === 'number' ? options.limit : 3;
  const minScore = typeof options.minScore === 'number' ? options.minScore : 6;
  const queryLower = String(query || '').toLowerCase().trim();
  if (!queryLower) return { products: [], addons: [], shop: [], guides: [], modules: [], learning: [] };

  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);

  const scored = allEntries()
    .map((item) => ({ item, score: scoreItem(item, queryLower, queryWords) }))
    .filter((s) => s.score >= minScore)
    .sort((a, b) => b.score - a.score);

  const out = { products: [], addons: [], shop: [], guides: [], modules: [], learning: [] };
  for (const { item } of scored) {
    // CHANGE: 2026-10-22 — the bucket is resolved through an explicit map. An unknown kind
    // is skipped instead of throwing, so a future entry can never break the matcher.
    const bucket = BUCKETS[item.kind];
    if (!bucket) continue;
    if (out[bucket].length >= limit) continue;
    out[bucket].push(item);
  }
  return out;
}

/**
 * A short "we have exactly this" reply for the offline fallback, or null when
 * nothing in the catalogue is a confident match.
 * @param {string} query
 * @returns {string|null}
 */
export function catalogSuggestionReply(query) {
  const { products, addons, shop, guides, modules, learning } = suggestCatalog(query, { limit: 1 });
  const pick = addons[0] || modules[0] || products[0] || shop[0] || guides[0] || learning[0];
  if (!pick) return null;

  const intro =
    pick.kind === 'addon'
      ? 'We have a ready-made add-on for exactly that'
      : pick.kind === 'shop'
        ? 'We have exactly that in our shop catalogue'
        : pick.kind === 'guide'
          ? 'We have a free written guide on that'
          : pick.kind === 'module'
            ? 'We have a module for that'
            : pick.kind === 'learning'
              ? 'We have exactly that'
              : 'We have a product for that';

  return `${intro}: **${pick.label}** — ${pick.detail}\n\n[[${pick.label}|${pick.url}]]\n\nIs that the gap you are trying to close?`;
}

/**
 * A short "we wrote a guide for that" reply for the TEACHING fallback (Learn Sara),
 * or null when no guide is a confident match.
 * @param {string} query
 * @returns {string|null}
 */
export function guideSuggestionReply(query) {
  const { guides } = suggestCatalog(query, { limit: 1, minScore: 8 });
  const pick = guides[0];
  if (!pick) return null;
  return `We have a written guide for exactly that: **${pick.title}** — ${pick.detail}\n\n[[${pick.title}|${pick.url}]]\n\nWant to walk through it here step by step, or read the guide first?`;
}
