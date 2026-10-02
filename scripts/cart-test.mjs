// CHANGE: 2026-10-02 — pure unit tests for the real site cart (SP-1 cart build).
// WHY: the pricing rules must be provable with plain `node` — no React, no Mongo, no network.
// This suite imports the same pure modules the server routes use (lib/cart/math.ts and the
// price catalogue), so a refactor of the math is caught here before it ever reaches a page.
//
// ALSO the page-parity guard: the catalogue's whole-rupee figures are asserted against the
// EXACT display strings the live pages hardcode today (silver/gold/tss/tallydrive), so the
// cart's maths can never drift from what the pricing tables print.
//
// Run: npm run test:cart

import assert from 'node:assert/strict';
import { PRICES_FALLBACK, getFallbackPriceItem, isKnownSlug, computePayablePaise } from '../lib/prices-catalog.mjs';
import {
  MAX_QTY,
  MAX_CART_LINES,
  sanitizeQty,
  sanitizeItems,
  addItem,
  setQty,
  removeItem,
  clearCart,
  computeTotals,
  toPriceMap,
} from '../lib/cart/math.ts';
import { priceRowView, validatePriceItem, resolvePriceItem } from '../lib/prices.ts';

let passed = 0;
let failed = 0;
const failures = [];

function check(name, fn) {
  try {
    fn();
    passed += 1;
  } catch (err) {
    failed += 1;
    failures.push({ name, err: err.message });
    console.error(`  ✗ ${name}\n    ${err.message}`);
  }
}

const known = toPriceMap(PRICES_FALLBACK);

// ---------------------------------------------------------------- catalogue maths
check('catalogue: silver = ₹26,550 (22,500 + 18%)', () => {
  const item = getFallbackPriceItem('tallyprime-silver');
  assert.equal(item.payablePaise, 2_655_000);
  assert.equal(item.priceStatus, 'priced');
});

check('catalogue: gold = ₹79,650', () => {
  assert.equal(getFallbackPriceItem('tallyprime-gold').payablePaise, 7_965_000);
});

check('catalogue: upgrade = ₹39,825 (25% off 53,100)', () => {
  const item = getFallbackPriceItem('tallyprime-upgrade-single-multi');
  assert.equal(item.payablePaise, 3_982_500);
  assert.equal(item.discountPaise, 1_327_500);
  assert.equal(item.discountLabel, '25% OFF');
});

check('catalogue: TSS 2-year rows match the page exactly', () => {
  assert.equal(getFallbackPriceItem('tss-single-2yr').payablePaise, 849_600); // 8,496
  assert.equal(getFallbackPriceItem('tss-multi-2yr').payablePaise, 2_548_800); // 25,488
  assert.equal(getFallbackPriceItem('tss-auditor-2yr').payablePaise, 1_274_400); // 12,744
});

check('catalogue: TSS 1-year rows match the page exactly', () => {
  assert.equal(getFallbackPriceItem('tss-single-1yr').payablePaise, 531_000);
  assert.equal(getFallbackPriceItem('tss-multi-1yr').payablePaise, 1_593_000);
  assert.equal(getFallbackPriceItem('tss-auditor-1yr').payablePaise, 796_500);
});

check('catalogue: tallydrive extra storage = ₹1,200 with 0% GST', () => {
  const item = getFallbackPriceItem('tallydrive-extra-storage-1yr');
  assert.equal(item.gstPct, 0);
  assert.equal(item.payablePaise, 120_000);
});

check('catalogue: modules are unpriced structure (₹0, not sellable)', () => {
  for (const m of PRICES_FALLBACK.filter((p) => p.category === 'modules')) {
    assert.equal(m.priceStatus, 'unpriced');
    assert.equal(m.payablePaise, 0);
  }
  assert.ok(PRICES_FALLBACK.filter((p) => p.category === 'modules').length >= 7);
});

check('catalogue: every priced slug is unique', () => {
  const slugs = new Set(PRICES_FALLBACK.map((p) => p.slug));
  assert.equal(slugs.size, PRICES_FALLBACK.length);
});

// ---------------------------------------------------------------- pure math
check('math: sanitizeQty clamps 0/-5/junk to 1 and 1e9 to MAX_QTY', () => {
  assert.equal(sanitizeQty(0), 1);
  assert.equal(sanitizeQty(-5), 1);
  assert.equal(sanitizeQty('bogus'), 1);
  assert.equal(sanitizeQty(2.9), 2);
  assert.equal(sanitizeQty(MAX_QTY + 100), MAX_QTY);
  assert.equal(sanitizeQty(7), 7);
});

check('math: sanitizeItems drops unknown slugs and collapses duplicates', () => {
  const clean = sanitizeItems(
    [
      { slug: 'tallyprime-silver', qty: 1 },
      { slug: 'made-up-product', qty: 999 },
      { slug: 'tallyprime-silver', qty: 5 },
      null,
      { qty: 2 },
    ],
    known,
  );
  assert.deepEqual(clean, [{ slug: 'tallyprime-silver', qty: 1 }]);
});

check('math: addItem increments an existing line and appends a new one', () => {
  let items = [];
  items = addItem(items, 'tallyprime-silver', 1, known);
  items = addItem(items, 'tallyprime-silver', 1, known);
  assert.deepEqual(items, [{ slug: 'tallyprime-silver', qty: 2 }]);
  items = addItem(items, 'tss-single-1yr', 1, known);
  assert.equal(items.length, 2);
});

check('math: setQty clamps and removeItem deletes', () => {
  let items = [{ slug: 'tallyprime-silver', qty: 1 }];
  items = setQty(items, 'tallyprime-silver', 5, known);
  assert.equal(items[0].qty, 5);
  items = setQty(items, 'tallyprime-silver', 0, known);
  assert.equal(items[0].qty, 1); // floor at 1; removeItem is the delete
  items = removeItem(items, 'tallyprime-silver', known);
  assert.deepEqual(items, []);
  assert.deepEqual(clearCart(), []);
});

check('math: single TallyPrime Silver line = ₹26,550 incl 18% GST, no discount line', () => {
  const totals = computeTotals([{ slug: 'tallyprime-silver', qty: 1 }], known);
  assert.equal(totals.lines.length, 1);
  assert.equal(totals.subtotalPaise, 2_250_000);
  assert.equal(totals.gstPaise, 405_000);
  assert.equal(totals.discountPaise, 0);
  assert.equal(totals.totalPaise, 2_655_000);
  assert.equal(totals.itemCount, 1);
});

check('math: discounted TSS 2-year line shows base+GST, discount and net', () => {
  const totals = computeTotals([{ slug: 'tss-single-2yr', qty: 1 }], known);
  const line = totals.lines[0];
  assert.equal(line.subtotalPaise, 810_000);
  assert.equal(line.gstPaise, 145_800);
  assert.equal(line.discountPaise, 106_200);
  assert.equal(totals.totalPaise, 849_600);
  assert.equal(totals.totalPaise, totals.subtotalPaise + totals.gstPaise - totals.discountPaise);
});

check('math: multi-line bundle = silver + TSS 1yr (page pairings share no double-GST)', () => {
  const totals = computeTotals(
    [
      { slug: 'tallyprime-silver', qty: 1 },
      { slug: 'tss-single-1yr', qty: 1 },
    ],
    known,
  );
  assert.equal(totals.totalPaise, 2_655_000 + 531_000);
  assert.equal(totals.itemCount, 2);
});

check('math: quantity scales the line but not the unit price', () => {
  const totals = computeTotals([{ slug: 'tallydrive-extra-storage-1yr', qty: 2 }], known);
  assert.equal(totals.totalPaise, 240_000);
  assert.equal(totals.gstPaise, 0);
  assert.equal(totals.lines[0].unitPaise, 120_000);
});

check('math: unpriceable modules never enter totals (₹0 or line-free)', () => {
  const totals = computeTotals([{ slug: 'cf-agencies', qty: 1 }, { slug: 'tallyprime-silver', qty: 1 }], known);
  assert.equal(totals.lines.length, 1);
  assert.equal(totals.totalPaise, 2_655_000);
});

check('math: itemCount sums units, not lines', () => {
  const totals = computeTotals(
    [
      { slug: 'tallyprime-silver', qty: 1 },
      { slug: 'tss-single-1yr', qty: 3 },
    ],
    known,
  );
  assert.equal(totals.itemCount, 4);
});

// ---------------------------------------------------------------- page parity
check('row view: silver table string-for-string identical to the page', () => {
  const row = priceRowView(getFallbackPriceItem('tallyprime-silver'));
  assert.deepEqual(row, {
    product: 'TallyPrime Single User',
    validity: 'Lifetime',
    base: '22,500',
    gst: '4,050',
    total: '26,550/-',
  });
});

check('row view: gold upgrade carries strike/discount/save exactly as the page prints', () => {
  const row = priceRowView(getFallbackPriceItem('tallyprime-upgrade-single-multi'));
  assert.equal(row.base, '45,000');
  assert.equal(row.gst, '8,100');
  assert.equal(row.total, '39,825/-');
  assert.equal(row.strike, '53,100');
  assert.equal(row.discount, '25% OFF');
  assert.equal(row.save, 'You save 13,275/-');
});

check('row view: TSS 2-year save string matches the page', () => {
  const row = priceRowView(getFallbackPriceItem('tss-single-2yr'));
  assert.equal(row.base, '8,100');
  assert.equal(row.gst, '1,458');
  assert.equal(row.total, '8,496/-');
  assert.equal(row.strike, '9,558');
  assert.equal(row.save, 'You save 1,062/-');
});

// ---------------------------------------------------------------- validation
check('validate: rejects a negative base price', () => {
  const r = validatePriceItem({ ...getFallbackPriceItem('tallyprime-silver'), basePaise: -1 }, new Set());
  assert.equal(r.ok, false);
  assert.ok(r.errors.basePaise);
});

check('validate: rejects a discount larger than the pre-discount total', () => {
  const r = validatePriceItem({ ...getFallbackPriceItem('tallyprime-silver'), discountPaise: 99_999_999 }, new Set());
  assert.equal(r.ok, false);
  assert.ok(r.errors.discountPaise);
});

check('validate: rejects a mismatched payablePaise (UI/server disagreement)', () => {
  const r = validatePriceItem({ ...getFallbackPriceItem('tallyprime-silver'), payablePaise: 1 }, new Set());
  assert.equal(r.ok, false);
  assert.ok(r.errors.payablePaise);
});

check('validate: unpriced rows must be all-zero', () => {
  const module = getFallbackPriceItem('cf-agencies');
  const r = validatePriceItem({ ...module, basePaise: 1 }, new Set());
  assert.equal(r.ok, false);
  assert.ok(r.errors.priceStatus || r.errors.basePaise);
  const ok = validatePriceItem({ ...module }, new Set());
  assert.equal(ok.ok, true);
});

check('validate: rejects self-pairing and unknown pair slugs', () => {
  const good = getFallbackPriceItem('tallyprime-silver');
  const self = validatePriceItem({ ...good, pairsWith: ['tallyprime-silver'] }, new Set(['tss-single-1yr']));
  assert.equal(self.ok, false);
  const unknown = validatePriceItem({ ...good, pairsWith: ['ghost-99'] }, new Set(['tss-single-1yr']));
  assert.equal(unknown.ok, false);
  const ok = validatePriceItem({ ...good, pairsWith: ['tss-single-1yr'] }, new Set(['tss-single-1yr']));
  assert.equal(ok.ok, true);
});

check('validate: slug shape is strict', () => {
  const good = getFallbackPriceItem('tallyprime-silver');
  assert.equal(validatePriceItem({ ...good, slug: 'Bad Slug!' }, new Set()).ok, false);
  assert.equal(validatePriceItem({ ...good, slug: '' }, new Set()).ok, false);
});

check('validate: a valid priced item normalises and recomputes payable', () => {
  const r = validatePriceItem(getFallbackPriceItem('tallyprime-gold'), new Set());
  assert.equal(r.ok, true);
  assert.equal(r.value.payablePaise, 7_965_000);
});

// ---------------------------------------------------------------- helpers
check('resolvePriceItem: live list wins, fallback fires on absence, null when both unknown', () => {
  assert.equal(resolvePriceItem('tallyprime-silver', null).slug, 'tallyprime-silver');
  const live = [{ ...getFallbackPriceItem('tallyprime-silver'), payablePaise: 999_999_999 }];
  assert.equal(resolvePriceItem('tallyprime-silver', live).payablePaise, 999_999_999);
  assert.equal(resolvePriceItem('totally-unknown', live), null);
});

check('isKnownSlug / computePayablePaise basics', () => {
  assert.equal(isKnownSlug('tallyprime-silver'), true);
  assert.equal(isKnownSlug('nope'), false);
  assert.equal(computePayablePaise(22_500, 18, 0), 26_550);
  assert.equal(computePayablePaise(8_100, 18, 1_062), 8_496);
  assert.equal(computePayablePaise(0, 0, 0), 0);
});

check('toPriceMap: last doc wins, unknown slugs absent', () => {
  const map = toPriceMap([getFallbackPriceItem('tallyprime-silver'), getFallbackPriceItem('tallyprime-silver')]);
  assert.equal(map.size, 1);
  assert.equal(map.has('nope'), false);
});

console.log(`\ncart-test: ${passed} passed, ${failed} failed (${PRICES_FALLBACK.length} catalogue items, MAX_QTY=${MAX_QTY}, MAX_CART_LINES=${MAX_CART_LINES})`);
if (failed > 0) {
  console.error(failures.map((f) => `  ✗ ${f.name}`).join('\n'));
  process.exit(1);
}