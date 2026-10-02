// CHANGE: 2026-10-02 — server-authoritative product catalog for the /demo cart scaffold (SP-1).
// WHY: the order route reprices every total from THIS file by product id. A client-sent amount
// is never trusted, so this literal is the single fixed, auditable price source. It is
// deliberately NOT read from MongoDB: a demo cart must not be able to have its prices (or its
// failure modes) changed by a production data edit.
//
// All money is INTEGER PAISE. Never a float in rupees — 0.1 + 0.2 is a real class of payment
// bug, and Razorpay's Orders API takes paise anyway.
//
// SCOPE WARNING: these are plausible-looking figures for a TEST-ONLY scaffold. They are not
// quotes and must never be shown to a real customer. /demo is noindexed and disallowed in
// robots.txt (Task 3).

export interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  /** Integer paise. ₹18,000 => 1800000. Never a float. */
  pricePaise: number;
  /** GST percentage as a whole number, 0–100. */
  taxPct: number;
}

/** Indian GST rate applied to software licences/services in this catalog. */
export const GST_PCT = 18;

export const CATALOG: readonly CatalogProduct[] = [
  {
    id: 'tallyprime-silver',
    name: 'TallyPrime Silver — 1 User',
    description: 'Single-user licence with GST, payroll and TDS. The usual starting point for a first-time Tally setup.',
    image: '/tallyprime logo.png',
    pricePaise: 1800000,
    taxPct: GST_PCT,
  },
  {
    id: 'tallyprime-gold',
    name: 'TallyPrime Gold — 5 Users',
    description: 'Multi-user licence with multi-godown, branch and audit features for a growing team.',
    image: '/tallyprime logo.png',
    pricePaise: 5400000,
    taxPct: GST_PCT,
  },
  {
    id: 'tallyprime-server',
    name: 'TallyPrime Server — 50 Users',
    description: 'Concurrent-user server licence with remote access and centralised data control.',
    image: '/tallyprime logo.png',
    pricePaise: 15000000,
    taxPct: GST_PCT,
  },
  {
    id: 'tss-renewal',
    name: 'TSS Renewal — 1 Year',
    description: 'One year of Tally Software Service: statutory updates, remote support and new releases.',
    image: '/tssgold.png',
    pricePaise: 1100000,
    taxPct: GST_PCT,
  },
  {
    id: 'amc-annual',
    name: 'AMC — Annual Maintenance',
    description: 'Annual support covering data migration, TDL help and priority response.',
    image: '/amc.png',
    pricePaise: 900000,
    taxPct: GST_PCT,
  },
  {
    id: 'corporate-training',
    name: 'Corporate Training — 2 Days',
    description: 'On-site team training on TallyPrime, delivered at your premises.',
    image: '/trainning.png',
    pricePaise: 2500000,
    taxPct: GST_PCT,
  },
  {
    id: 'aws-cloud',
    name: 'AWS Cloud Hosting — Monthly',
    description: 'Managed TallyPrime hosting on AWS with backup and uptime monitoring.',
    image: '/tally%20on%20cloud.png',
    pricePaise: 450000,
    taxPct: GST_PCT,
  },
  {
    id: 'custom-module',
    name: 'Custom TDL Module',
    description: 'Bespoke module development scoped to your industry workflow.',
    image: '/TDLandCustom.jpg',
    pricePaise: 3500000,
    taxPct: GST_PCT,
  },
] as const;

/** id → product, for O(1) repricing on the server route. */
export const CATALOG_BY_ID: ReadonlyMap<string, CatalogProduct> = new Map(
  CATALOG.map((p) => [p.id, p]),
);

/** Narrow an unknown string to a known product id, or undefined. Used to reject junk ids. */
export function getProduct(id: unknown): CatalogProduct | undefined {
  if (typeof id !== 'string') return undefined;
  return CATALOG_BY_ID.get(id);
}