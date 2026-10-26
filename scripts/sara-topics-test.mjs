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

// CHANGE: 2026-10-23 — the /shop catalogue is a first-class topic: 107 ready-made items must be
// discoverable by name, and the answer must still ASK before recommending (consultant rule).
test('"what add-ons do you have" maps to the Tally Shop topic', () => {
  const r = matchTopic('what add-ons do you have');
  if (!r) throw new Error('no topic matched');
  if (r.topic.label !== 'Tally Shop & Ready-Made Add-ons') throw new Error(`got ${r.topic.label}`);
});
test('the Tally Shop topic links /shop, asks a question and never quotes code', () => {
  const t = saraTopics.find(x => x.label === 'Tally Shop & Ready-Made Add-ons');
  if (!t) throw new Error('shop topic missing');
  if (!t.answer.includes('[[Browse the Shop|/shop]]')) throw new Error('shop topic has no shop button');
  if (!t.answer.includes('?')) throw new Error('shop topic answer asks no question');
  if (/\[#Menu:|\[System:|\[Function:|OnAction\s*:|\$\$/.test(t.answer)) throw new Error('code in the shop topic');
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

// ─── Verified-fact regressions ─────────────────────────────────────────────
// CHANGE: 2026-10-26 — WHY: an audit against TallyHelp found four TSS claims that Tally
// does not publish — a "roughly 15 days before expiry" reminder window, a 10% discount on a
// two-year renewal, a bonus month for renewing early, and validity that "syncs back into
// Tally automatically". It also found the product name written two ways ("Tally Software
// Service" / "Tally Subscription Service"; the official name is Tally Software Services).
// These assertions pin the corrected wording so none of it can creep back in, and pin the
// two real renewal paths plus the 16 August 2026 ERP 9 closure.
console.log('📌 TSS facts (verified against TallyHelp)');

function tssText() {
  const parts = [];
  const topic = saraTopics.find(x => x.label === 'TSS Renewal & Subscription');
  if (!topic) throw new Error('TSS topic missing');
  parts.push(topic.answer);
  for (const f of topic.followUp ?? []) parts.push(`${f.label} ${f.answer}`);
  parts.push(getFallbackResponse('tss renewal'));
  parts.push(getTeachingFallbackResponse('tally tss renewal'));
  return parts.join('\n');
}

test('no TSS answer claims a 15-day reminder window', () => {
  if (/15\s*days/i.test(tssText())) throw new Error('unverified "15 days" claim is back');
});
test('no TSS answer promises a 10% discount or a bonus month', () => {
  const t = tssText();
  if (/10\s*%/.test(t)) throw new Error('unverified discount claim is back');
  if (/extra month/i.test(t)) throw new Error('unverified bonus-month claim is back');
});
test('no TSS answer claims validity syncs back automatically', () => {
  if (/syncs? back into Tally automatically/i.test(tssText())) {
    throw new Error('unverified auto-sync claim is back — the licence must be updated');
  }
});
test('the product name is Tally Software Services, never the singular or the wrong expansion', () => {
  const t = tssText();
  if (/Tally Software Service[^s]/.test(t)) throw new Error('singular "Tally Software Service" is back');
  if (/Tally Subscription Service/.test(t)) throw new Error('wrong expansion "Tally Subscription Service" is back');
  if (!t.includes('Tally Software Services')) throw new Error('correct product name missing');
});
test('the TSS answer gives both verified renewal paths', () => {
  const t = tssText();
  if (!t.includes('Alt+R (Manage TSS Renewal)')) throw new Error('Alt+R path missing');
  if (!t.includes('F1 (Help) > Settings > License > Manage License')) throw new Error('Manage License path missing');
  if (!t.includes('F9 (Renew TSS)')) throw new Error('F9 (Renew TSS) path missing');
});
test('the TSS answer tells the reader to update the licence after paying', () => {
  if (!/update the licence/i.test(tssText())) throw new Error('licence-update step missing');
});
test('the TSS answer states the ERP 9 renewal closure date', () => {
  if (!/16 August 2026/.test(tssText())) throw new Error('16 August 2026 ERP 9 closure missing');
});
test('the payroll answer keeps payroll native (Maintain Payroll, not an add-on)', () => {
  const r = getTeachingFallbackResponse('payroll salary pf esi');
  if (!/Maintain Payroll/i.test(r)) throw new Error(`payroll answer lost Maintain Payroll: ${r.slice(0, 120)}`);
});
test('the reports answer filters with Alt+F12, not a made-up shortcut', () => {
  const r = getTeachingFallbackResponse('balance sheet report');
  if (!/Alt\+F12/.test(r)) throw new Error(`reports answer lost Alt+F12: ${r.slice(0, 120)}`);
  if (/Ctrl\+F for search/i.test(r)) throw new Error('the old wrong search shortcut is back');
});
test('the voucher shortcut list keeps the verified key mapping', () => {
  const topic = saraTopics.find(x => x.label === 'Keyboard Shortcuts');
  if (!topic) throw new Error('Keyboard Shortcuts topic missing');
  const text = [topic.answer, ...(topic.followUp ?? []).map(f => f.answer)].join('\n');
  const pairs = [
    ['Ctrl+F8', 'Sales Order'],
    ['Ctrl+F9', 'Purchase Order'],
    ['Alt+F6', 'Credit Note'],
    ['Alt+F5', 'Debit Note'],
    ['Alt+F7', 'Stock Journal'],
    ['Ctrl+F4', 'Payroll'],
  ];
  for (const [key, label] of pairs) {
    const line = text.split('\n').find(l => l.includes(key));
    if (!line) throw new Error(`${key} is missing from the voucher list`);
    if (!line.includes(label)) throw new Error(`${key} should be ${label}, got: ${line.trim()}`);
  }
});

// ─── Data sanity: no duplicate topics ──────────────────────────────────────
console.log('🧩 Data sanity');
// CHANGE: 2026-10-23 — expected count 9 → 10 after adding the Tally Shop topic.
test('saraTopics has 10 unique topics', () => {
  if (saraTopics.length !== 10) throw new Error(`expected 10 topics, got ${saraTopics.length}`);
});
test('Keyboard Shortcuts topic appears exactly once', () => {
  const n = saraTopics.filter(t => t.label === 'Keyboard Shortcuts').length;
  if (n !== 1) throw new Error(`expected 1 occurrence, got ${n}`);
});

const total = passed + failed;
console.log(`\n${'━'.repeat(50)}`);
console.log(`  Total: ${total}  |  PASSED: ${passed}  |  FAILED: ${failed}\n`);
process.exit(failed > 0 ? 1 : 0);