// CHANGE: 2026-10-22 — deterministic regression suite for the Sara "consultant,
// not programmer" guard (lib/sara-guard.mjs).
//
// WHY THIS EXISTS: on 22/10/2026 in production a visitor typed
//   "CAN YOU DRAFT TDL" -> "DRAFT TDL FOR ADD PENDING INVOICES IN SALES INVOICE"
// and Sara pasted a raw TDL snippet. The system prompt already said "keep
// responses short"; the model ignored it. This suite pins the HARD half of
// the fix so that regression is impossible without a failing test.
//
// Runs standalone with plain Node (the guard is pure ESM, zero deps):
//   node scripts/sara-guard-test.mjs
// No server, no AI, no tokens spent.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  applyConsultantGuard,
  buildDiscountReply,
  buildDiscoveryBlock,
  buildNoCodeReply,
  containsProgrammingCode,
  countQuestions,
  hasCtaButton,
  hasDiscoveryQuestion,
  isCustomBuildRequest,
  isDiscountQuery,
  isOffTopicQuery,
  isTdlRequest,
  SALES_LONG_REPLY_CHARS,
  stripCtaButtons,
} from '../lib/sara-guard.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ${name} ... PASS`);
    passed++;
  } catch (err) {
    console.log(`  ${name} ... FAIL - ${err.message}`);
    failed++;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function assertEqual(actual, expected, msg) {
  if (actual !== expected) throw new Error(`${msg || 'not equal'}: got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
}

// ---------------------------------------------------------------------------
// The exact snippet Sara pasted in production on 22/10/2026.
// ---------------------------------------------------------------------------
const OWNER_TDL_SNIPPET = [
  '[#Menu: Gateway of Tally]',
  '[System: UDF]',
  '[Function: PendingInvoiceList]',
  'OnAction : PendingInvoiceList',
  '$$String:$List: $$Fetch',
].join('\n');

console.log('\n🛡️  Sara Consultant Guard - Local Regression (no server/AI)\n');

// ─── 1. Code detection ─────────────────────────────────────────────────────
console.log('🚫 Code detection');
test('the owner\'s production TDL snippet is detected as code', () => {
  assert(containsProgrammingCode(OWNER_TDL_SNIPPET), 'TDL snippet not flagged');
});
test('a TDL snippet embedded mid-reply is detected', () => {
  const reply = `Sure, here you go:\n\n${OWNER_TDL_SNIPPET}\n\nHope that helps!`;
  assert(containsProgrammingCode(reply), 'embedded TDL not flagged');
});
test('a ```text menu path is NOT code', () => {
  const menuPath = '```text\nF11 > Company Features > Enable GST\n```';
  assert(!containsProgrammingCode(menuPath), 'menu path wrongly flagged');
});
test('a plain business answer is NOT code', () => {
  const reply = 'TallyPrime has 400+ built-in reports. Press Alt+F1 for detailed view and F12 to configure columns.';
  assert(!containsProgrammingCode(reply), 'business answer wrongly flagged');
});
test('a JavaScript snippet IS code', () => {
  assert(containsProgrammingCode('```js\nconst x = 1;\n```'), 'js snippet not flagged');
});
test('a SQL statement IS code', () => {
  assert(containsProgrammingCode('SELECT * FROM vouchers WHERE amount > 500'), 'SQL not flagged');
});
test('a Python function IS code', () => {
  assert(containsProgrammingCode('def build_report():\n    return 1'), 'python not flagged');
});
test('empty / non-string input is not code', () => {
  assert(!containsProgrammingCode(''), 'empty string flagged');
  assert(!containsProgrammingCode(null), 'null flagged');
  assert(!containsProgrammingCode(undefined), 'undefined flagged');
});

// ─── 2. Build-request detection ────────────────────────────────────────────
console.log('🔎 Build-request detection');
test('"CAN YOU DRAFT TDL" is a build request', () => {
  assert(isCustomBuildRequest('CAN YOU DRAFT TDL'), 'draft tdl not detected');
});
test('the production follow-up ("DRAFT TDL FOR ADD PENDING INVOICES...") is a build request', () => {
  assert(
    isCustomBuildRequest('DRAFT TDL FOR ADD PENDING INVOICES IN SALES INVOICE'),
    'production follow-up not detected'
  );
});
test('"I want a TDL" is a build request', () => {
  assert(isCustomBuildRequest('I want a TDL'), 'want a tdl not detected');
});
test('"We need a custom report for GST" is a build request', () => {
  assert(isCustomBuildRequest('We need a custom report for GST'), 'need a custom report not detected');
});
test('"TDL customization" is a build request', () => {
  assert(isCustomBuildRequest('TDL customization'), 'tdl customization not detected');
});
test('"custom report for GST" (no verb) is a build request', () => {
  assert(isCustomBuildRequest('custom report for GST'), 'custom report not detected');
});
test('"what is a custom field" is NOT a build request (informational)', () => {
  assert(!isCustomBuildRequest('what is a custom field'), 'informational custom field hijacked');
});
test('"difference between a TDL and report customization" is NOT a build request', () => {
  assert(!isCustomBuildRequest('difference between a TDL and report customization'), 'difference question hijacked');
});
test('"What is TDL?" is NOT a build request (informational)', () => {
  assert(!isCustomBuildRequest('What is TDL?'), 'informational tdl question hijacked');
});
test('"I need info about custom reports" is NOT a build request (informational)', () => {
  assert(!isCustomBuildRequest('I need info about custom reports'), 'informational custom report hijacked');
});
test('"which script for GST" is NOT a build request', () => {
  assert(!isCustomBuildRequest('which script for GST'), 'bare script noun hijacked');
});
test('"which program should I use" is NOT a build request', () => {
  assert(!isCustomBuildRequest('which program should I use'), 'bare program noun hijacked');
});
test('an ordinary question is NOT a build request', () => {
  assert(!isCustomBuildRequest('How do I file GSTR-1?'), 'ordinary question hijacked');
});

// ─── 3. Question detection ─────────────────────────────────────────────────
console.log('❓ Question detection');
test('countQuestions counts "?" marks', () => {
  assertEqual(countQuestions('One? Two? Three?'), 3, 'question count');
});
test('a real question counts as discovery', () => {
  assert(hasDiscoveryQuestion('Which screen do you use daily?'), 'real question not detected');
});
test('"Want me to go into more detail?" is NOT a discovery question', () => {
  assert(!hasDiscoveryQuestion('Absolutely, we can do that. Want me to go into more detail?'), 'depth offer counted as discovery');
});
test('"Shall I walk you through it?" is NOT a discovery question', () => {
  assert(!hasDiscoveryQuestion('Here is the plan. Shall I walk you through it?'), 'depth offer counted as discovery');
});
test('a numbered question list counts as discovery', () => {
  assert(hasDiscoveryQuestion('1. Where should it live?\n2. How many users?'), 'numbered questions not detected');
});
// CHANGE: 2026-10-29 — live learn-mode defect (I2). The reply had already asked
// "Tell me what you are trying to achieve on your screen" (no question mark), so
// the guard appended a second discovery block WITH a second copy of the same CTA.
test('a plain-spoken info request counts as discovery (no question mark)', () => {
  assert(
    hasDiscoveryQuestion('Tell me what you are trying to achieve on your screen, and I will teach you the TallyPrime way.'),
    'imperative info request not detected'
  );
});
test('the live I2 learn reply is NOT given a second discovery block', () => {
  const liveReply =
    'Custom development and custom reports are handled by our expert technical team over at [[TDL Customization|/services/tdl]].\n' +
    'Tell me what you are trying to achieve on your screen, and I will gladly teach you the closest built-in TallyPrime way to do it!';
  const out = applyConsultantGuard(liveReply, 'write a tdl for me', { isLearn: true });
  assertEqual(out.action, 'none', 'action');
  assertEqual(out.reply, liveReply, 'reply was modified');
  assertEqual(out.reply.split('[[TDL Customization|/services/tdl]]').length - 1, 1, 'CTA button duplicated');
});
test('the discovery block never repeats a CTA the reply already shows', () => {
  const out = applyConsultantGuard(
    'Custom TDL work is handled by our technical team. [[TDL Customization|/services/tdl]]',
    'CAN YOU DRAFT TDL'
  );
  assertEqual(out.action, 'added-discovery', 'action');
  assertEqual(out.reply.split('[[TDL Customization|/services/tdl]]').length - 1, 1, 'CTA button duplicated');
  assert(out.reply.includes('Where should it live'), 'discovery questions missing');
});

// ─── 4. The guard itself ───────────────────────────────────────────────────
console.log('🧱 Guard actions');
test('code in a reply is REPLACED (blocked-code)', () => {
  const out = applyConsultantGuard(`Sure:\n\n${OWNER_TDL_SNIPPET}`, 'CAN YOU DRAFT TDL');
  assertEqual(out.action, 'blocked-code', 'action');
  assert(!containsProgrammingCode(out.reply), 'reply still contains code');
  assert(out.reply.includes("I don't write code"), 'reply does not decline code');
  assert(out.reply.includes('[[TDL Customization|/services/tdl]]'), 'TDL button missing');
  assert(out.reply.includes('?'), 'no discovery question in the replacement');
});
test('a build request answered without questions gets the discovery block', () => {
  const out = applyConsultantGuard(
    'Absolutely, we can develop a custom TDL for pending invoices in Sales.',
    'CAN YOU DRAFT TDL FOR ADD PENDING INVOICES IN SALES INVOICE'
  );
  assertEqual(out.action, 'added-discovery', 'action');
  assert(out.reply.includes('Absolutely'), 'original answer was discarded');
  assert(out.reply.includes('Where should it live'), 'discovery question missing');
  assert(out.reply.includes('[[TDL Customization|/services/tdl]]'), 'TDL button missing');
});
test('a build request that ALREADY asked questions is left untouched', () => {
  const original = 'Happy to brief our team. Which screen do you use daily, and should it print too?';
  const out = applyConsultantGuard(original, 'CAN YOU DRAFT TDL');
  assertEqual(out.action, 'none', 'action');
  assertEqual(out.reply, original, 'reply was modified');
});
test('"Want me to go into more detail?" does NOT count as discovery', () => {
  const out = applyConsultantGuard(
    'Absolutely, we can develop that for you. Want me to go into more detail?',
    'CAN YOU DRAFT TDL'
  );
  assertEqual(out.action, 'added-discovery', 'action');
  assert(out.reply.includes('Where should it live'), 'discovery block not added');
});
test('a long sales reply with no question gets the closing question (soft-length-nudge)', () => {
  const long = 'TallyPrime supports a wide range of features. '.repeat(40);
  const out = applyConsultantGuard(long, 'Tell me about TallyPrime');
  assertEqual(out.action, 'soft-length-nudge', 'action');
  assert(out.reply.includes('Want me to walk you through it step by step?'), 'nudge question missing');
});
test('a long reply that already asks a question is left alone', () => {
  const long = 'TallyPrime supports a wide range of features. '.repeat(40) + ' Which module do you need?';
  const out = applyConsultantGuard(long, 'Tell me about TallyPrime');
  assertEqual(out.action, 'none', 'action');
  assertEqual(out.reply, long, 'reply was modified');
});
test('a short sales reply is left alone', () => {
  const out = applyConsultantGuard('TallyPrime is our accounting suite.', 'What is TallyPrime?');
  assertEqual(out.action, 'none', 'action');
});
test('a non-build short reply is left alone', () => {
  const out = applyConsultantGuard('Use F11 > Company Features > Enable GST.', 'How do I enable GST?');
  assertEqual(out.action, 'none', 'action');
});
test('Learn mode is exempt from the length nudge', () => {
  const long = 'Step one. '.repeat(200);
  const out = applyConsultantGuard(long, 'Teach me payroll', { isLearn: true });
  assertEqual(out.action, 'none', 'action');
  assertEqual(out.reply, long, 'reply was modified');
});
test('Learn mode still refuses code', () => {
  const out = applyConsultantGuard(`Sure:\n\n${OWNER_TDL_SNIPPET}`, 'write a tdl', { isLearn: true });
  assertEqual(out.action, 'blocked-code', 'action');
  assert(!containsProgrammingCode(out.reply), 'reply still contains code');
});
test('a non-TDL build request routes to the specialist page, not the TDL page', () => {
  const out = applyConsultantGuard('```js\nconst x = 1;\n```', 'write a script for my bank feed');
  assertEqual(out.action, 'blocked-code', 'action');
  assert(out.reply.includes('[[Talk to a Specialist|/contact]]'), 'specialist button missing');
  assert(!out.reply.includes('/services/tdl'), 'TDL button shown for a non-TDL request');
});
test('the guard never throws on empty input', () => {
  const out = applyConsultantGuard('', 'CAN YOU DRAFT TDL');
  assert(typeof out.reply === 'string', 'reply not a string');
  assertEqual(out.action, 'added-discovery', 'action');
});

// ─── 5. The canned replies ─────────────────────────────────────────────────
console.log('💬 Canned replies');
test('buildNoCodeReply always asks at least one question', () => {
  const reply = buildNoCodeReply('CAN YOU DRAFT TDL');
  assert(reply.includes('?'), 'no question asked');
  assert(reply.includes("don't write code"), 'does not decline code');
});
test('buildNoCodeReply picks the TDL button for a TDL request', () => {
  assert(buildNoCodeReply('draft a tdl').includes('[[TDL Customization|/services/tdl]]'), 'TDL button missing');
  assert(!buildNoCodeReply('draft a tdl').includes('[[Talk to a Specialist'), 'wrong button');
});
test('buildDiscoveryBlock always asks at least one question', () => {
  const reply = buildDiscoveryBlock('draft a tdl');
  assert(reply.includes('?'), 'no question asked');
});
test('isTdlRequest spots TDL requests', () => {
  assert(isTdlRequest('DRAFT TDL FOR PENDING INVOICES'), 'tdl not spotted');
  assert(!isTdlRequest('how do I file GSTR-1'), 'false positive');
});
test('SALES_LONG_REPLY_CHARS is a sane budget', () => {
  assert(SALES_LONG_REPLY_CHARS >= 800 && SALES_LONG_REPLY_CHARS <= 2000, 'budget out of range');
});

// ─── 6. Static source guards (the prompt half of the fix) ──────────────────
console.log('📄 Static source guards');
const routeSrc = readFileSync(join(ROOT, 'app/api/chat/route.ts'), 'utf8');
const topicsSrc = readFileSync(join(ROOT, 'lib/sara-topics.ts'), 'utf8');

test('the sales prompt states "I AM NOT A PROGRAMMER"', () => {
  assert(routeSrc.includes('I AM NOT A PROGRAMMER'), 'sales prompt rule missing');
});
test('the sales prompt states "ASK BEFORE YOU TELL"', () => {
  assert(routeSrc.includes('ASK BEFORE YOU TELL'), 'sales prompt rule missing');
});
test('the learn prompt states "I AM NOT A PROGRAMMER"', () => {
  assert(routeSrc.includes('I AM NOT A PROGRAMMER'), 'learn prompt rule missing');
});
test('the prompt carries the worked TDL example', () => {
  assert(routeSrc.includes('WORKED EXAMPLE'), 'worked example missing');
});
test('the chat route actually calls the guard', () => {
  assert(routeSrc.includes('applyConsultantGuard'), 'guard not imported');
  assert(routeSrc.includes('finalizeReply'), 'finalizeReply missing');
});
test('the guard is wired into BOTH provider branches', () => {
  const calls = routeSrc.split('finalizeReply(').length - 1;
  assert(calls >= 3, `expected the guard on both providers (found ${calls} references)`);
});
test('the offline fallback uses the same guard', () => {
  assert(topicsSrc.includes("from './sara-guard.mjs'"), 'guard not imported by sara-topics');
  assert(topicsSrc.includes('isCustomBuildRequest'), 'build-request check missing');
  assert(topicsSrc.includes('buildNoCodeReply'), 'no-code reply missing');
});
test('the offline fallback has a TDL topic', () => {
  assert(topicsSrc.includes('TDL & Customisation'), 'TDL topic missing');
});

// ─── 7. Prompt policies pinned by the 2026-10-29 chat-quality battery ───────
// WHY: none of these were covered by any suite, and each one produced a real
// bad reply in production testing (off-topic pitch, invented TSS lead-time,
// invented/denied discount, edition contradicting the user-count question).
console.log('📌 Chat-quality prompt policies');
test('off-topic answers are not given a forced product button', () => {
  assert(/Do NOT attach a product button to a purely off-topic answer/i.test(routeSrc), 'off-topic no-pitch rule missing');
});
test('the TSS block forbids every lead-time window', () => {
  assert(/NEVER quote or imply a lead-time window/i.test(routeSrc), 'lead-time ban missing');
  assert(/"a few days before expiry"/.test(routeSrc), 'the exact banned phrase is not named');
});
test('the TSS block neither promises nor denies a multi-year discount', () => {
  assert(/neither promise one NOR deny one/i.test(routeSrc), 'discount neutrality rule missing');
  assert(!/NEVER promise a discount/i.test(routeSrc), 'old one-sided discount rule is back');
});
test('the edition logic forbids recommending an edition before knowing the user count', () => {
  assert(/EDITION LOGIC/.test(routeSrc), 'edition logic rule missing');
  assert(/Silver is SINGLE user; TallyPrime Gold is MULTI user/i.test(routeSrc), 'edition facts missing');
});
test('the learn prompt only ties back when there is an honest angle', () => {
  assert(!/Always find a reasonable angle to connect back/i.test(routeSrc), 'forced tie-back rule is back');
  assert(/leave the pitch out/i.test(routeSrc), 'opt-out wording missing');
});

// ─── 8. Off-topic pitching + discount neutrality (2026-10-29 battery) ──────
// WHY: both were prompt rules that the model ignored in production testing.
// "That would be Narendra Modi. [[Explore TallyInsights|/tally-insights]]"
// and "We do not offer a flat 10% multi-year discount" are now impossible.
console.log('🚫 Off-topic pitching & discount neutrality');
test('isOffTopicQuery recognises small talk, politics and creative requests', () => {
  for (const q of [
    'who is the prime minister of india',
    'write me a poem about rain',
    'what is the weather like today',
    'tell me a joke',
    'is it going to rain tomorrow',
    'who won the cricket world cup',
  ]) {
    assert(isOffTopicQuery(q), `not detected as off-topic: "${q}"`);
  }
});
test('isOffTopicQuery leaves business questions alone', () => {
  for (const q of [
    'how do i create a company in tally prime',
    'i have stock across 3 godowns and its a mess',
    'what is tss',
    'do you have an addon to block duplicate purchase entry',
    'my customers dont pay on time, how do i track outstanding',
    'what is training schedule for corporate training',
    // CHANGE: 2026-10-29 — "capital of" is an off-topic keyword, but an
    // accounting question can contain it. Business context must win.
    'how do i show capital of the firm in the balance sheet',
    'explain capital of the company and its disclosure',
  ]) {
    assert(!isOffTopicQuery(q), `business query misread as off-topic: "${q}"`);
  }
});
test('stripCtaButtons removes the button but keeps the answer', () => {
  const live = 'That would be Narendra Modi. \n[[Explore TallyInsights|/tally-insights]]';
  const out = stripCtaButtons(live);
  assertEqual(out, 'That would be Narendra Modi.', 'stripped text');
  assert(!hasCtaButton(out), 'button survived');
});
test('the live F1 off-topic reply loses its product button', () => {
  const out = applyConsultantGuard(
    'That would be Narendra Modi. \n[[Explore TallyInsights|/tally-insights]]',
    'who is the prime minister of india'
  );
  assertEqual(out.action, 'stripped-offtopic-cta', 'action');
  assertEqual(out.reply, 'That would be Narendra Modi.', 'reply');
});
test('an off-topic answer with no button is untouched', () => {
  const original = 'Soft grey clouds drift low,\nWashing dust from every leaf,\nPuddles catch the sky.';
  const out = applyConsultantGuard(original, 'write me a poem about rain');
  assertEqual(out.action, 'none', 'action');
  assertEqual(out.reply, original, 'reply was modified');
});
test('a business answer keeps its product button', () => {
  const original = 'Tracking outstanding is a TallyPrime report. [[Explore Receivables|/products/gold]]';
  const out = applyConsultantGuard(original, 'my customers dont pay on time');
  assertEqual(out.action, 'none', 'action');
  assertEqual(out.reply, original, 'business button was stripped');
});
test('isDiscountQuery spots discount questions without hijacking GST schemes', () => {
  assert(isDiscountQuery('is there a 10% discount if i pay for 2 years'), 'discount query missed');
  assert(isDiscountQuery('any offer if i pay multi-year?'), 'multi-year query missed');
  assert(!isDiscountQuery('how do i opt for the composition scheme in gst'), 'GST scheme hijacked');
});
test('the discount reply neither promises nor denies and carries no percentage', () => {
  const tss = buildDiscountReply('is there a discount on tss for 2 years');
  assert(!/\b10\s*%|\bbonus\b|\bextra month/i.test(tss), 'invented a figure');
  assert(tss.includes('/services/tss'), 'TSS pricing link missing');
  assert(!/do not offer|no discount|never a discount/i.test(tss), 'reply denies a real discount');
  assert(buildDiscountReply('any discount on tallydrive').includes('/products'), 'generic pricing link missing');
});
test('the live G2 denial is replaced by the neutral pricing answer', () => {
  const denial =
    'We do not offer a flat 10% multi-year discount directly in chat, but our team can always check if any active seasonal schemes apply.';
  const out = applyConsultantGuard(denial, 'is there a 10% discount if i pay for 2 years');
  assertEqual(out.action, 'pricing-redirect', 'action');
  assert(!/do not offer/i.test(out.reply), 'denial survived');
  assert(!/\b10\s*%/.test(out.reply), 'percentage survived');
  assert(out.reply.includes('/services/tss'), 'TSS pricing link missing');
});

// ---------------------------------------------------------------------------
console.log(`\n${failed === 0 ? '✅' : '❌'} Sara guard: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
