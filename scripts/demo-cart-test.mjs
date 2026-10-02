// CHANGE: 2026-10-02 — deterministic regression suite for the /demo cart domain (SP-1).
// Runs standalone with Node 24 native TS type-stripping — no server, no React, no network,
// no tokens spent. Mirrors scripts/sara-topics-test.mjs.
//
// The security-critical cases are marked REGRESSION: they pin that a client-supplied
// amount/quantity is never trusted and that unknown ids are dropped rather than priced.
import { CATALOG, CATALOG_BY_ID, getProduct } from '../lib/demo/catalog.ts';
import {
  addItem,
  clearCart,
  computeTotals,
  removeItem,
  sanitizeItems,
  sanitizeQty,
  setQty,
  MAX_QTY,
} from '../lib/demo/cart.ts';
import { formatINR, formatINRFromRupees, formatINRWhole } from '../lib/demo/format.ts';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ${name} ... PASS`);
    passed++;
  } catch (err) {
    console.log(`  ${name} ... FAIL — ${err.message}`);
    failed++;
  }
}

function eq(actual, expected, what) {
  if (actual !== expected) throw new Error(`${what}: expected ${expected}, got ${actual}`);
}
function deepEq(actual, expected, what) {
  const a = JSON.stringify(actual);
  const b = JSON.stringify(expected);
  if (a !== b) throw new Error(`${what}: expected ${b}, got ${a}`);
}
function ok(cond, what) {
  if (!cond) throw new Error(what);
}

// ────────────────────────────── catalog ──────────────────────────────
console.log('\nCATALOG');

test('every product has a unique id', () => {
  const ids = CATALOG.map((p) => p.id);
  eq(new Set(ids).size, ids.length, 'unique id count');
});

test('REGRESSION: every pricePaise is a positive safe INTEGER (never a float)', () => {
  for (const p of CATALOG) {
    ok(Number.isInteger(p.pricePaise), `${p.id}: ${p.pricePaise} is not an integer`);
    ok(p.pricePaise > 0, `${p.id}: price not positive`);
    ok(Number.isSafeInteger(p.pricePaise), `${p.id}: price exceeds MAX_SAFE_INTEGER`);
  }
});

test('taxPct is a sane integer percentage on every product', () => {
  for (const p of CATALOG) {
    ok(Number.isInteger(p.taxPct), `${p.id}: taxPct not an integer`);
    ok(p.taxPct >= 0 && p.taxPct <= 100, `${p.id}: taxPct out of range`);
  }
});

test('getProduct rejects junk, CATALOG_BY_ID agrees with CATALOG', () => {
  eq(getProduct('nope'), undefined, 'unknown id');
  eq(getProduct(undefined), undefined, 'undefined');
  eq(getProduct(123), undefined, 'number');
  eq(getProduct({ toString: () => 'tallyprime-silver' }), undefined, 'object');
  eq(getProduct('tallyprime-silver')?.name, CATALOG[0].name, 'known id resolves');
  eq(CATALOG_BY_ID.size, CATALOG.length, 'map size matches catalog length');
});

// ───────────────────────────── totals ─────────────────────────────
console.log('\nTOTALS');

test('empty cart yields all-zero totals and no lines', () => {
  const t = computeTotals([]);
  deepEq(t.lines, [], 'lines');
  eq(t.subtotalPaise, 0, 'subtotalPaise');
  eq(t.taxPaise, 0, 'taxPaise');
  eq(t.totalPaise, 0, 'totalPaise');
  eq(t.itemCount, 0, 'itemCount');
});

test('single item, single qty: subtotal is unit price, tax on subtotal', () => {
  const p = CATALOG[0];
  const t = computeTotals([{ id: p.id, qty: 1 }]);
  eq(t.lines.length, 1, 'line count');
  eq(t.subtotalPaise, p.pricePaise, 'subtotalPaise');
  eq(t.taxPaise, Math.round((p.pricePaise * p.taxPct) / 100), 'taxPaise');
  eq(t.totalPaise, p.pricePaise + t.taxPaise, 'totalPaise');
  eq(t.itemCount, 1, 'itemCount');
});

test('quantity multiplies the unit price exactly', () => {
  const p = CATALOG[0];
  const t = computeTotals([{ id: p.id, qty: 3 }]);
  eq(t.subtotalPaise, p.pricePaise * 3, 'subtotalPaise at qty 3');
  eq(t.itemCount, 3, 'itemCount counts units, not lines');
});

test('quantity increments and decrements', () => {
  const p = CATALOG[0];
  let items = addItem([], p.id, 2);
  eq(items[0].qty, 2, 'after add qty 2');
  items = addItem(items, p.id, 3);
  eq(items[0].qty, 5, 'after add qty 3 more');
  eq(items.length, 1, 'still one line — addItem increments, never duplicates');
  items = setQty(items, p.id, 1);
  eq(items[0].qty, 1, 'after setQty 1');
});

test('duplicate addItem increments the row instead of duplicating it', () => {
  const p = CATALOG[0];
  const items = addItem(addItem(addItem([], p.id), p.id), p.id);
  eq(items.length, 1, 'line count stays 1');
  eq(items[0].qty, 3, 'qty accumulates to 3');
});

test('qty is clamped to a 1 minimum (setQty 0 and negatives become 1)', () => {
  const p = CATALOG[0];
  let items = addItem([], p.id, 4);
  eq(setQty(items, p.id, 0)[0].qty, 1, 'setQty 0 clamps to 1');
  eq(setQty(items, p.id, -7)[0].qty, 1, 'setQty -7 clamps to 1');
  eq(setQty(items, p.id, 2.9)[0].qty, 2, 'setQty 2.9 floors to 2');
  eq(setQty(items, p.id, MAX_QTY)[0].qty, MAX_QTY, 'setQty MAX_QTY allowed');
  eq(setQty(items, p.id, MAX_QTY + 500)[0].qty, MAX_QTY, 'setQty above MAX_QTY clamps');
});

test('sanitizeQty coerces junk to 1 and clamps floats/negatives', () => {
  eq(sanitizeQty(undefined), 1, 'undefined');
  eq(sanitizeQty(null), 1, 'null — Number(null) is 0, so clamp floor gives 1');
  eq(sanitizeQty(NaN), 1, 'NaN');
  eq(sanitizeQty(Infinity), 1, 'Infinity');
  eq(sanitizeQty('3'), 3, 'numeric string');
  eq(sanitizeQty('abc'), 1, 'non-numeric string');
  eq(sanitizeQty(0), 1, 'zero clamps to 1');
  eq(sanitizeQty(-1), 1, 'negative clamps to 1');
  eq(sanitizeQty(2.7), 2, 'float floors');
  eq(sanitizeQty(1e9), MAX_QTY, 'huge clamps to MAX_QTY');
});

test('removeItem deletes the line; removing an absent id is a no-op', () => {
  const p = CATALOG[0];
  const items = removeItem(addItem([], p.id), p.id);
  eq(items.length, 0, 'removed');
  eq(removeItem(items, p.id).length, 0, 'no-op on empty');
  eq(clearCart().length, 0, 'clearCart');
});

test('addItem of an UNKNOWN id leaves the cart unchanged (dropped, not priced)', () => {
  const p = CATALOG[0];
  const before = addItem([], p.id, 2);
  const after = addItem(before, 'free-money-hack', 99);
  eq(after.length, 1, 'unknown id not added');
  eq(after[0].id, p.id, 'existing line untouched');
  eq(computeTotals(after).subtotalPaise, p.pricePaise * 2, 'subtotal unchanged');
});

// ──────────────── REGRESSION: server-authoritative pricing ────────────────
console.log('\nREGRESSION — server-authoritative pricing');

test('REGRESSION: unknown id in computeTotals is DROPPED, not priced', () => {
  const p = CATALOG[0];
  const t = computeTotals([
    { id: p.id, qty: 1 },
    { id: 'invented-product', qty: 5 },
    { id: '../../etc/passwd', qty: 1 },
  ]);
  eq(t.lines.length, 1, 'only the known line survives');
  eq(t.subtotalPaise, p.pricePaise, 'subtotal is the known product only');
  eq(t.itemCount, 1, 'unknown qty contributes nothing to itemCount');
});

test('REGRESSION: client-claimed total is IGNORED; catalog decides the amount', () => {
  const p = CATALOG[0];
  // Shape an attacker would POST to /api/demo/order.
  const claimed = { items: [{ id: p.id, qty: 1 }], claimedTotal: 1 };
  const server = computeTotals(claimed.items);
  eq(server.totalPaise, p.pricePaise + Math.round((p.pricePaise * p.taxPct) / 100), 'server total from catalog');
  ok(server.totalPaise !== claimed.claimedTotal, 'server total must differ from the ₹0.01 claim');
});

test('REGRESSION: a client cannot smuggle its own price field into the totals', () => {
  const p = CATALOG[0];
  const t = computeTotals([{ id: p.id, qty: 1, pricePaise: 1, unitPaise: 1, totalPaise: 1 }]);
  eq(t.lines[0].unitPaise, p.pricePaise, 'unit price comes from catalog, not the payload');
  ok(t.totalPaise > 1, 'total is the catalog price, not the smuggled ₹0.01');
});

test('REGRESSION: client cannot override taxPct either', () => {
  const p = CATALOG[0];
  const t = computeTotals([{ id: p.id, qty: 1, taxPct: 0 }]);
  eq(t.taxPaise, Math.round((p.pricePaise * p.taxPct) / 100), 'tax still from catalog');
});

test('REGRESSION: non-array / malformed items degrade to an empty cart, never a throw', () => {
  for (const junk of [undefined, null, 0, 'items', {}, true, [[]], [{ id: 5, qty: 1 }], [{ nope: 1 }]]) {
    const t = computeTotals(junk);
    eq(t.totalPaise, 0, `junk ${JSON.stringify(junk)} must total 0`);
    eq(t.lines.length, 0, `junk ${JSON.stringify(junk)} must produce no lines`);
  }
});

test('REGRESSION: duplicate ids in a raw payload collapse to one line', () => {
  const p = CATALOG[0];
  const t = computeTotals([
    { id: p.id, qty: 2 },
    { id: p.id, qty: 3 },
  ]);
  eq(t.lines.length, 1, 'one line');
  eq(t.lines[0].qty, 2, 'first occurrence wins, duplicate dropped');
});

test('REGRESSION: raw garbage qty in the payload is clamped, not multiplied through', () => {
  const p = CATALOG[0];
  const t = computeTotals([{ id: p.id, qty: 1e12 }]);
  eq(t.lines[0].qty, MAX_QTY, 'qty clamped to MAX_QTY');
  eq(t.subtotalPaise, p.pricePaise * MAX_QTY, 'subtotal uses the clamped qty');
});

// ───────────────────────────── arithmetic ─────────────────────────────
console.log('\nARITHMETIC');

test('totals sum EXACTLY — totalPaise === subtotalPaise + taxPaise, no rounding drift', () => {
  const items = CATALOG.map((p, i) => ({ id: p.id, qty: (i % 5) + 1 }));
  const t = computeTotals(items);
  eq(t.totalPaise, t.subtotalPaise + t.taxPaise, 'total identity');
  eq(
    t.subtotalPaise,
    t.lines.reduce((s, l) => s + l.subtotalPaise, 0),
    'subtotal equals sum of line subtotals',
  );
  eq(
    t.taxPaise,
    t.lines.reduce((s, l) => s + l.taxPaise, 0),
    'tax equals sum of line taxes',
  );
});

test('no float contamination: every total is a safe integer', () => {
  const items = CATALOG.map((p, i) => ({ id: p.id, qty: (i * 3) % MAX_QTY }));
  const t = computeTotals(items);
  for (const [k, v] of Object.entries({
    subtotalPaise: t.subtotalPaise,
    taxPaise: t.taxPaise,
    totalPaise: t.totalPaise,
    itemCount: t.itemCount,
  })) {
    ok(Number.isSafeInteger(v), `${k} = ${v} is not a safe integer`);
  }
});

test('tax rounds half-up to whole paise (no fractional paise ever)', () => {
  // 3 paise at 50% = 1.5 paise -> 2. Built from the catalog price to keep it server-derived.
  const t = computeTotals([{ id: CATALOG[0].id, qty: 1 }]);
  for (const l of t.lines) {
    ok(Number.isInteger(l.taxPaise), `${l.id}: taxPaise ${l.taxPaise} is fractional`);
  }
});

test('sanitizeItems returns a fresh array and does not mutate its input', () => {
  const p = CATALOG[0];
  const input = [{ id: p.id, qty: 2 }];
  const snapshot = JSON.stringify(input);
  const out = sanitizeItems(input);
  eq(JSON.stringify(input), snapshot, 'input untouched');
  ok(out !== input, 'not the same array reference');
});

// ───────────────────────────── formatting ─────────────────────────────
console.log('\nFORMATTING');

test('formatINR converts paise to rupees with en-IN grouping', () => {
  eq(formatINR(1800000), '₹18,000.00', '18,000 rupees');
  eq(formatINR(0), '₹0.00', 'zero');
  eq(formatINR(100), '₹1.00', 'one rupee');
  // en-IN uses INDIAN digit grouping (lakh/crore), not western: 12,34,567 not 1,234,567.
  eq(formatINR(123456789), '₹12,34,567.89', 'lakh grouping');
  eq(formatINR(123456789012), '₹1,23,45,67,890.12', 'crore grouping');
});

test('formatINR never leaks binary-fraction noise', () => {
  eq(formatINR(1), '₹0.01', 'one paise');
  ok(!/0\.009|\.999999/.test(formatINR(1799)), 'no float noise in output');
  eq(formatINR(NaN), '₹0.00', 'NaN is safe');
  eq(formatINR(Infinity), '₹0.00', 'Infinity is safe');
});

test('formatINRFromRupees rounds to whole paise before formatting', () => {
  eq(formatINRFromRupees(18000), '₹18,000.00', 'integer rupees');
  eq(formatINRFromRupees(0.1 + 0.2), '₹0.30', '0.1+0.2 must be 0.30, not 0.30000000000000004');
});

test('formatINRWhole drops the decimals for chrome', () => {
  eq(formatINRWhole(1800000), '₹18,000', 'whole rupees');
  eq(formatINRWhole(1800049), '₹18,000', 'sub-rupee paise truncated');
});

// ───────────────────────────── summary ─────────────────────────────
console.log(`\n${'-'.repeat(60)}`);
console.log(`  Total: ${passed + failed}  |  PASSED: ${passed}  |  FAILED: ${failed}`);
console.log('-'.repeat(60));

if (failed > 0) process.exit(1);