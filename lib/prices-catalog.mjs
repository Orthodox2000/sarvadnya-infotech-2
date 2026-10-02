// CHANGE: 2026-10-02 — price catalogue for the real site cart (SP-1 cart build).
// WHY: prices used to live in four page files (silver / gold / tss / tallydrive) as display
// strings. The cart needs machine-readable integer-paise prices with GST and discounts per
// line, and the ADMIN (nested repo) needs to edit them against MongoDB. So the numbers moved
// into ONE catalogue and the pages derive their display rows from the same PriceItems they
// sell — a page can never print ₹26,550 while the cart charges something else.
//
// THIS FILE IS PURE ESM WITH ZERO DEPENDENCIES so it can be imported by:
//   - TypeScript (Next.js) via prices-catalog.d.mts and lib/prices.ts
//   - scripts/seed_prices.mjs (writes this same data to MongoDB, idempotently)
//   - scripts/cart-test.mjs (asserts the displayed amounts == the charged amounts)
// It holds NO secrets and does NO IO. Money is INTEGER PAISE, never float rupees.
//
// Every priced figure below was copied 1:1 from the live pages:
//   silver:   22,500 + 18% = 26,550      gold: 67,500 + 18% = 79,650
//   upgrade:  45,000 + 18% - 13,275 = 39,825 (25% OFF)
//   tss 1yr:  4,500/13,500/6,750 + 18% = 5,310/15,930/7,965
//   tss 2yr:  8,100/24,300/12,150 + 18% - (10% OFF) = 8,496/25,488/12,744
//   tallydrive extra storage: 1,200/year + 0% = 1,200
// Modules are UNPRICED (structure only): payable 0, "priced" false — the UI must refuse to
// add them ("This item cannot be added now").

const GST_PCT = 18;

/** base + round(base·gst/100) − discount, all in integer paise. */
export function computePayablePaise(basePaise, gstPct, discountPaise) {
  const base = Math.round(basePaise);
  const gst = Math.round((base * gstPct) / 100);
  const disc = Math.round(discountPaise);
  return base + gst - disc;
}

/** Builder for a SELLABLE item (priceStatus 'priced'). */
function priced({
  slug,
  name,
  category,
  validity,
  baseRupees,
  discountRupees = 0,
  discountLabel,
  gstPct = GST_PCT,
  pairsWith = [],
  addonSlugs = [],
  moduleSlugs = [],
  sortOrder,
}) {
  const basePaise = Math.round(baseRupees * 100);
  const discountPaise = Math.round(discountRupees * 100);
  return {
    slug,
    name,
    category,
    validity,
    basePaise,
    gstPct,
    discountPaise,
    payablePaise: computePayablePaise(basePaise, gstPct, discountPaise),
    pairsWith,
    addonSlugs,
    moduleSlugs,
    priceStatus: 'priced',
    discountLabel,
    sortOrder,
    updatedAt: null,
  };
}

/** Builder for a STRUCTURE-ONLY item (modules). Nothing can be charged for it yet. */
function unpriced({ slug, name, category, validity, sortOrder }) {
  return {
    slug,
    name,
    category,
    validity,
    basePaise: 0,
    gstPct: 0,
    discountPaise: 0,
    payablePaise: 0,
    pairsWith: [],
    addonSlugs: [],
    moduleSlugs: [],
    priceStatus: 'unpriced',
    sortOrder,
    updatedAt: null,
  };
}

// "Frequently paired with" is the Amazon-style bundle: what Buy Now offers next to the main
// item. Kept one-directional and curated per product (a TSS renewal does not re-sell the
// licence it protects; the 2-year sibling is the upsell instead).
const SILVER_ADDONS = ['party-wise-last-sold-rate', 'stock-group-wise-item-sales', 'discount-amount-sales-invoice'];
const SILVER_MODULES = ['cf-agencies', 'housing-societies'];
const GOLD_ADDONS = ['party-wise-last-sold-rate', 'double-discount', 'auto-email-sales-invoices'];
const GOLD_MODULES = ['logistics-transport', 'container-handling'];
const TSS_ADDONS = ['auto-email-sales-invoices', 'show-hsn-register'];
const TALLYDRIVE_ADDONS = ['auto-email-sales-invoices', 'auto-email-os-statement'];

export const PRICES_FALLBACK = [
  // ---- products ----
  priced({
    slug: 'tallyprime-silver',
    name: 'TallyPrime Single User',
    category: 'products',
    validity: 'Lifetime',
    baseRupees: 22500,
    pairsWith: ['tss-single-1yr', 'tss-single-2yr'],
    addonSlugs: SILVER_ADDONS,
    moduleSlugs: SILVER_MODULES,
    sortOrder: 10,
  }),
  priced({
    slug: 'tallyprime-gold',
    name: 'TallyPrime Multi User',
    category: 'products',
    validity: 'Lifetime',
    baseRupees: 67500,
    pairsWith: ['tss-multi-1yr', 'tss-multi-2yr'],
    addonSlugs: GOLD_ADDONS,
    moduleSlugs: GOLD_MODULES,
    sortOrder: 20,
  }),
  priced({
    slug: 'tallyprime-upgrade-single-multi',
    name: 'Upgrade: Single to Multi',
    category: 'products',
    validity: 'Lifetime',
    baseRupees: 45000,
    discountRupees: 13275,
    discountLabel: '25% OFF',
    pairsWith: ['tss-multi-1yr'],
    addonSlugs: ['party-wise-last-sold-rate'],
    moduleSlugs: ['excel-to-tally'],
    sortOrder: 30,
  }),
  priced({
    slug: 'tallydrive-extra-storage-1yr',
    name: 'TallyDrive Extra Storage',
    category: 'products',
    validity: 'Per year',
    baseRupees: 1200,
    gstPct: 0,
    pairsWith: ['tss-single-1yr', 'tss-multi-1yr'],
    addonSlugs: TALLYDRIVE_ADDONS,
    moduleSlugs: [],
    sortOrder: 40,
  }),

  // ---- services (TSS) ----
  priced({
    slug: 'tss-single-1yr',
    name: 'TSS Single User (1 Year)',
    category: 'services',
    validity: '1 Year',
    baseRupees: 4500,
    pairsWith: ['tss-single-2yr'],
    addonSlugs: TSS_ADDONS,
    moduleSlugs: [],
    sortOrder: 10,
  }),
  priced({
    slug: 'tss-single-2yr',
    name: 'TSS Single User (2 Years)',
    category: 'services',
    validity: '2 Years',
    baseRupees: 8100,
    discountRupees: 1062,
    discountLabel: '10% OFF',
    pairsWith: [],
    addonSlugs: TSS_ADDONS,
    moduleSlugs: [],
    sortOrder: 20,
  }),
  priced({
    slug: 'tss-multi-1yr',
    name: 'TSS Multi User (1 Year)',
    category: 'services',
    validity: '1 Year',
    baseRupees: 13500,
    pairsWith: ['tss-multi-2yr'],
    addonSlugs: TSS_ADDONS,
    moduleSlugs: [],
    sortOrder: 30,
  }),
  priced({
    slug: 'tss-multi-2yr',
    name: 'TSS Multi User (2 Years)',
    category: 'services',
    validity: '2 Years',
    baseRupees: 24300,
    discountRupees: 3186,
    discountLabel: '10% OFF',
    pairsWith: [],
    addonSlugs: TSS_ADDONS,
    moduleSlugs: [],
    sortOrder: 40,
  }),
  priced({
    slug: 'tss-auditor-1yr',
    name: 'TSS Auditor (1 Year)',
    category: 'services',
    validity: '1 Year',
    baseRupees: 6750,
    pairsWith: ['tss-auditor-2yr'],
    addonSlugs: TSS_ADDONS,
    moduleSlugs: [],
    sortOrder: 50,
  }),
  priced({
    slug: 'tss-auditor-2yr',
    name: 'TSS Auditor (2 Years)',
    category: 'services',
    validity: '2 Years',
    baseRupees: 12150,
    discountRupees: 1593,
    discountLabel: '10% OFF',
    pairsWith: [],
    addonSlugs: TSS_ADDONS,
    moduleSlugs: [],
    sortOrder: 60,
  }),

  // ---- modules: structure only, NOT for sale yet ----
  unpriced({ slug: 'cf-agencies', name: 'CFA Module', category: 'modules', validity: 'One-time licence', sortOrder: 10 }),
  unpriced({ slug: 'housing-societies', name: 'Housing Society Module', category: 'modules', validity: 'One-time licence', sortOrder: 20 }),
  unpriced({ slug: 'sales-commission', name: 'Sales Commission Module', category: 'modules', validity: 'One-time licence', sortOrder: 30 }),
  unpriced({ slug: 'logistics-transport', name: 'Logistics Module', category: 'modules', validity: 'One-time licence', sortOrder: 40 }),
  unpriced({ slug: 'container-handling', name: 'Container Handling Module', category: 'modules', validity: 'One-time licence', sortOrder: 50 }),
  unpriced({ slug: 'garment-retail', name: 'Garment Retail Module', category: 'modules', validity: 'One-time licence', sortOrder: 60 }),
  unpriced({ slug: 'excel-to-tally', name: 'Excel to Tally Module', category: 'modules', validity: 'One-time licence', sortOrder: 70 }),
];

/** Lookup helper for fallback-ﬁ rst resolution (pages, tests). Undefined when unknown. */
export function getFallbackPriceItem(slug) {
  return PRICES_FALLBACK.find((p) => p.slug === slug) || null;
}

/** A stable id for external references — the slug IS the id. */
export function isKnownSlug(slug) {
  return getFallbackPriceItem(slug) !== null;
}