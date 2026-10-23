// CHANGE: 2026-09-05 — deterministic regression suite for the Learn Sara topic matcher.
// Covers the "stock -> TSS renewal" bug (fix in lib/sara-topics.ts keyword synonyms).
// Runs standalone with Node 24 native TS type-stripping — no server, no AI, no tokens spent.
import { matchTopic, saraTopics, getFallbackResponse, getTeachingFallbackResponse } from '../lib/sara-topics.ts';

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

function expectMatch(query, expectedLabel) {
  const r = matchTopic(query);
  if (!r) throw new Error(`"${query}" -> null, expected "${expectedLabel}"`);
  if (r.topic.label !== expectedLabel) {
    throw new Error(`"${query}" -> "${r.topic.label}" (score ${r.score}), expected "${expectedLabel}"`);
  }
}

function expectNull(query) {
  const r = matchTopic(query);
  if (r) throw new Error(`"${query}" -> "${r.topic.label}" (score ${r.score}), expected null`);
}

console.log('\n🧠 Sara Topic Matcher — Local Regression (no server/AI)\n');

// ─── The reported bug: stock must teach inventory, never drift to TSS ──────
console.log('📦 Inventory keywords');
test('"stock" maps to Inventory Management', () => expectMatch('stock', 'Inventory Management'));
test('"how do I track stock in tally" maps to Inventory', () => expectMatch('how do I track stock in tally', 'Inventory Management'));
test('"stock items" maps to Inventory', () => expectMatch('stock items', 'Inventory Management'));
test('"godown transfer" maps to Inventory', () => expectMatch('godown transfer', 'Inventory Management'));
test('"batch expiry tracking" maps to Inventory', () => expectMatch('batch expiry tracking', 'Inventory Management'));
test('"reorder level" maps to Inventory', () => expectMatch('reorder level', 'Inventory Management'));
test('"inventory" maps to Inventory', () => expectMatch('inventory', 'Inventory Management'));

// ─── Off-syllabus guard: TSS must stay isolated to TSS queries ─────────────
console.log('🚫 TSS isolation');
test('"tss renewal" maps to TSS Renewal', () => expectMatch('tss renewal', 'TSS Renewal & Subscription'));
test('"renew" maps to TSS Renewal', () => expectMatch('renew', 'TSS Renewal & Subscription'));
test('"serial number renewal" maps to TSS Renewal', () => expectMatch('serial number renewal', 'TSS Renewal & Subscription'));
test('"stock" does NOT map to TSS', () => {
  const r = matchTopic('stock');
  if (r && r.topic.label === 'TSS Renewal & Subscription') throw new Error('"stock" wrongly mapped to TSS');
});

// ─── ERP 9 upgrade must map to the new topic, never fall through to TSS ─────
console.log('💼 ERP 9 upgrade isolation');
// CHANGE: 2026-09-11 — ERP9/renew queries now resolve deterministically to the
// new ERP 9 License Upgrade topic instead of drifting to TSS or the LLM.
test('"erp9 renewal" maps to ERP 9 License Upgrade', () => expectMatch('erp9 renewal', 'ERP 9 License Upgrade'));
test('"has tally stopped erp renewals" maps to ERP 9', () => expectMatch('has tally stopped erp renewals', 'ERP 9 License Upgrade'));
test('"how do I upgrade my licence to tallyprime" maps to ERP 9', () => expectMatch('how do I upgrade my licence to tallyprime', 'ERP 9 License Upgrade'));

// ─── Other topics still match ──────────────────────────────────────────────
console.log('🗂 Other topics');
test('"gst filing" maps to GST & Tax Filing', () => expectMatch('gst filing', 'GST & Tax Filing'));
test('"gst return" maps to GST & Tax Filing', () => expectMatch('gst return', 'GST & Tax Filing'));
test('"bank reconciliation neft" maps to Banking', () => expectMatch('bank reconciliation neft', 'Banking & Reconciliation'));
test('"payroll pf esi" maps to Payroll', () => expectMatch('payroll pf esi', 'Payroll & Employees'));
test('"balance sheet" maps to Reports', () => expectMatch('balance sheet', 'Reports & Analysis'));
test('"shortcut keys" maps to Keyboard Shortcuts', () => expectMatch('shortcut keys', 'Keyboard Shortcuts'));

// ─── Garbage and over-match guard ──────────────────────────────────────────
console.log('⚙️ Over-match guard');
test('random gibberish returns null', () => expectNull('zzzz qqqqq qwerty'));

// ─── TDL / custom build must land on the consultant topic, never on code ────
// CHANGE: 2026-10-22 — Sara is a business consultant, NOT a programmer. A TDL
// request must resolve to the "TDL & Customisation" topic (which asks the
// requirement questions and routes to the technical team) and the topic answer
// must never contain code.
console.log('🧱 TDL / custom build isolation');
test('"tdl" maps to TDL & Customisation', () => expectMatch('tdl', 'TDL & Customisation'));
test('"can you draft tdl" maps to TDL & Customisation', () => expectMatch('can you draft tdl', 'TDL & Customisation'));
test('"tdl customization" maps to TDL & Customisation', () => expectMatch('tdl customization', 'TDL & Customisation'));
test('"custom report for gst" maps to TDL & Customisation', () => expectMatch('custom report for gst', 'TDL & Customisation'));
test('"custom invoice format" maps to TDL & Customisation', () => expectMatch('custom invoice format', 'TDL & Customisation'));
test('"report" still maps to Reports & Analysis', () => expectMatch('report', 'Reports & Analysis'));
test('"balance sheet" still maps to Reports & Analysis', () => expectMatch('balance sheet', 'Reports & Analysis'));
test('the TDL topic answer contains no code', () => {
  const t = saraTopics.find(x => x.label === 'TDL & Customisation');
  if (!t) throw new Error('TDL topic missing');
  if (/\[#Menu:|\[System:|\[Function:|OnAction\s*:|\$\$/.test(t.answer)) {
    throw new Error('TDL topic answer contains code');
  }
});
test('the TDL topic answer asks the requirement questions', () => {
  const t = saraTopics.find(x => x.label === 'TDL & Customisation');
  if (!t) throw new Error('TDL topic missing');
  if (!t.answer.includes('?')) throw new Error('TDL topic answer asks no question');
  if (!t.answer.includes('[[TDL Customization|/services/tdl]]')) throw new Error('TDL topic answer has no button');
});

// ─── Catalogue suggestions (the OFFLINE Sara must suggest what we sell) ─────
// CHANGE: 2026-10-22 — the owner asked Sara to know our add-ons, products and modules "with
// details" and to suggest them. The live path uses the generated catalogue prompt; this
// covers the OFFLINE path (API down), where lib/sara-catalog.mjs does the matching.
console.log('🛍 Catalogue suggestions');
test('offline fallback suggests the right add-on for a business problem', () => {
  const r = getFallbackResponse('stop billing customers who have not paid');
  if (!r.includes('Block Billing beyond Due Date')) throw new Error(`got: ${r.slice(0, 120)}`);
  if (!r.includes('[[Block Billing beyond Due Date|/addons#block-billing-beyond-due-date]]')) {
    throw new Error('the add-on reply has no button');
  }
});
test('offline fallback suggests an industry module when one matches', () => {
  const r = getFallbackResponse('we are a transport business and need lorry receipt billing');
  if (!r.includes('Transport Module')) throw new Error(`got: ${r.slice(0, 120)}`);
});
test('offline fallback still answers a price question with the sales route', () => {
  const r = getFallbackResponse('what is the price of tallyprime gold');
  if (!/price|pricing|quote/i.test(r)) throw new Error(`price question was hijacked: ${r.slice(0, 120)}`);
  if (r.includes('Block Billing')) throw new Error('catalogue hijacked a price question');
});
test('offline fallback still refuses a custom build with the requirement questions', () => {
  const r = getFallbackResponse('can you draft a TDL for pending invoices');
  if (!r.includes('/services/tdl')) throw new Error(`got: ${r.slice(0, 120)}`);
});
test('teaching fallback points at the exact free guide', () => {
  const r = getTeachingFallbackResponse('cost centre department wise accounting');
  if (!r.includes('/tally-insights/cost-centres/cost-centre-in-tally')) throw new Error(`got: ${r.slice(0, 160)}`);
});

// ─── Data sanity: no duplicate topics ──────────────────────────────────────
console.log('🧩 Data sanity');
// CHANGE: 2026-10-22 — expected count 8 → 9 after adding the TDL & Customisation topic.
test('saraTopics has 9 unique topics', () => {
  if (saraTopics.length !== 9) throw new Error(`expected 9 topics, got ${saraTopics.length}`);
});
test('Keyboard Shortcuts topic appears exactly once', () => {
  const n = saraTopics.filter(t => t.label === 'Keyboard Shortcuts').length;
  if (n !== 1) throw new Error(`expected 1 occurrence, got ${n}`);
});

const total = passed + failed;
console.log(`\n${'━'.repeat(50)}`);
console.log(`  Total: ${total}  |  PASSED: ${passed}  |  FAILED: ${failed}\n`);
process.exit(failed > 0 ? 1 : 0);