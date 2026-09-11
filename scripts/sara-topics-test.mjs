// CHANGE: 2026-09-05 — deterministic regression suite for the Learn Sara topic matcher.
// Covers the "stock -> TSS renewal" bug (fix in lib/sara-topics.ts keyword synonyms).
// Runs standalone with Node 24 native TS type-stripping — no server, no AI, no tokens spent.
import { matchTopic, saraTopics } from '../lib/sara-topics.ts';

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

// ─── Data sanity: no duplicate topics ──────────────────────────────────────
console.log('🧩 Data sanity');
// CHANGE: 2026-09-11 — expected count 7 → 8 after adding the ERP 9 License Upgrade topic.
test('saraTopics has 8 unique topics', () => {
  if (saraTopics.length !== 8) throw new Error(`expected 8 topics, got ${saraTopics.length}`);
});
test('Keyboard Shortcuts topic appears exactly once', () => {
  const n = saraTopics.filter(t => t.label === 'Keyboard Shortcuts').length;
  if (n !== 1) throw new Error(`expected 1 occurrence, got ${n}`);
});

const total = passed + failed;
console.log(`\n${'━'.repeat(50)}`);
console.log(`  Total: ${total}  |  PASSED: ${passed}  |  FAILED: ${failed}\n`);
process.exit(failed > 0 ? 1 : 0);