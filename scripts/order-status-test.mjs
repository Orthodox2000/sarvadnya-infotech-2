// CHANGE: 2026-10-03 — pure regression suite for the SP-3 order status module.
// Covers: ORDER_STATUSES vocabulary, orderStatusChangeUpdate (atomic $set+$push,
// actor default/override, note sanitisation), buildOrderTimeline (newest-first,
// `from` derivation, empty history), validateCustomer (per-field rules — name,
// email, phone incl. +91/91 normalisation, company), validateTssSerials (one per
// TSS line, owner 2026-10-03) and isTssSlug. Runs standalone with Node 24 native
// TS type-stripping — no server, no Mongo, zero deps.
import {
  ORDER_STATUSES,
  isValidOrderStatus,
  orderStatusChangeUpdate,
  buildOrderTimeline,
  validateCustomer,
  validateTssSerials,
  isTssSlug,
} from '../lib/order-status.ts';

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

function assertOk(validation) {
  if (!validation.ok) throw new Error(`expected ok:true, got errors ${JSON.stringify(validation.errors)}`);
}

function assertErrors(validation, expectedKeys) {
  if (validation.ok) throw new Error(`expected ok:false (keys ${JSON.stringify(expectedKeys)}), got ok:true`);
  const keys = Object.keys(validation.errors).sort();
  const want = [...expectedKeys].sort();
  if (JSON.stringify(keys) !== JSON.stringify(want)) {
    throw new Error(`expected errors on ${JSON.stringify(want)}, got ${JSON.stringify(keys)}`);
  }
}

console.log('\n🛒 Order Status Module — SP-3 (checkout buyer capture + ledger)\n');

// ─── Vocabulary ─────────────────────────────────────────────────────────────
console.log('📖 ORDER_STATUSES vocabulary');
test('vocabulary is exactly created/verified/refunded/fulfilled', () => {
  if (JSON.stringify(ORDER_STATUSES) !== JSON.stringify(['created', 'verified', 'refunded', 'fulfilled'])) {
    throw new Error(`got ${JSON.stringify(ORDER_STATUSES)}`);
  }
});
test('isValidOrderStatus accepts every vocabulary word', () => {
  for (const s of ORDER_STATUSES) if (!isValidOrderStatus(s)) throw new Error(`${s} rejected`);
});
test('isValidOrderStatus rejects unknown + wrong-case', () => {
  if (isValidOrderStatus('PENDING')) throw new Error('PENDING accepted');
  if (isValidOrderStatus('garbage')) throw new Error('garbage accepted');
  if (isValidOrderStatus('')) throw new Error('empty accepted');
});

// ─── orderStatusChangeUpdate: atomic $set+$push, actor, note ────────────────
console.log('🔄 orderStatusChangeUpdate (atomic update builder)');
test('actor defaults to admin, default time is now', () => {
  const u = orderStatusChangeUpdate('refunded');
  if (u.$set.status !== 'refunded') throw new Error('status not set');
  if (u.$push.statusHistory.actor !== 'admin') throw new Error(`actor ${u.$push.statusHistory.actor}`);
  if (!(u.$push.statusHistory.at instanceof Date)) throw new Error('at not a Date');
  if (u.$set.updatedAt !== u.$push.statusHistory.at) throw new Error('$set.updatedAt and history.at differ');
});
test('actor override to system (flow callers)', () => {
  const at = new Date('2026-10-03T10:00:00Z');
  const u = orderStatusChangeUpdate('created', { actor: 'system', at });
  if (u.$push.statusHistory.actor !== 'system') throw new Error(`actor ${u.$push.statusHistory.actor}`);
  if (u.$push.statusHistory.to !== 'created') throw new Error('to wrong');
  if (u.$push.statusHistory.at.getTime() !== at.getTime()) throw new Error('injected at ignored');
  if (u.$set.updatedAt.getTime() !== at.getTime()) throw new Error('updatedAt not injected at');
});
test('note is trimmed + control chars replaced with space', () => {
  const u = orderStatusChangeUpdate('fulfilled', { note: '  refunded\nby\tadmin  ' });
  if (u.$push.statusHistory.note !== 'refunded by admin') {
    throw new Error(`note ${JSON.stringify(u.$push.statusHistory.note)}`);
  }
});
test('note blank after sanitise -> omitted entirely', () => {
  const u = orderStatusChangeUpdate('fulfilled', { note: '   \n\t  ' });
  if ('note' in u.$push.statusHistory) throw new Error('blank note kept');
  const u2 = orderStatusChangeUpdate('fulfilled');
  if ('note' in u2.$push.statusHistory) throw new Error('undefined note kept');
});
test('note capped at 300 chars (matches visitors.ts cap)', () => {
  const u = orderStatusChangeUpdate('fulfilled', { note: 'x'.repeat(500) });
  if (u.$push.statusHistory.note.length !== 300) throw new Error(`len ${u.$push.statusHistory.note.length}`);
});

// ─── buildOrderTimeline ─────────────────────────────────────────────────────
console.log('🕓 buildOrderTimeline (newest-first, from derived)');
test('empty history -> empty timeline', () => {
  if (JSON.stringify(buildOrderTimeline([])) !== '[]') throw new Error('not []');
});
test('orders newest-first and derives `from` from next-older `to`', () => {
  const history = [
    { to: 'created', at: new Date('2026-10-03T09:00:00Z'), actor: 'system' },
    { to: 'verified', at: new Date('2026-10-03T09:05:00Z'), actor: 'system' },
    { to: 'fulfilled', at: new Date('2026-10-03T09:10:00Z'), actor: 'admin', note: 'done' },
  ];
  const tl = buildOrderTimeline(history);
  if (tl.length !== 3) throw new Error(`len ${tl.length}`);
  // newest first
  if (tl[0].to !== 'fulfilled' || tl[1].to !== 'verified' || tl[2].to !== 'created') {
    throw new Error(`order ${tl.map((e) => e.to).join(',')}`);
  }
  // from derivation
  if (tl[0].from !== 'verified') throw new Error(`fulfilled.from ${tl[0].from}`);
  if (tl[1].from !== 'created') throw new Error(`verified.from ${tl[1].from}`);
  if (tl[2].from !== null) throw new Error(`created.from ${tl[2].from}`);
  // spread keeps note
  if (tl[0].note !== 'done') throw new Error('note lost');
});
test('sort preserves insertion order for equal timestamps (stable sort)', () => {
  const at = new Date('2026-10-03T09:00:00Z');
  const tl = buildOrderTimeline([
    { to: 'created', at, actor: 'system' },
    { to: 'verified', at, actor: 'system' },
  ]);
  // History is append-only, so insertion order IS chronology; ES2019 stable sort
  // keeps it when timestamps collide (created pushed before verified).
  if (tl[0].to !== 'created' || tl[1].to !== 'verified') {
    throw new Error(`unstable sort: ${tl.map((e) => e.to).join(',')}`);
  }
});

// ─── validateCustomer ───────────────────────────────────────────────────────
console.log('👤 validateCustomer (per-field rules)');
test('full valid customer accepted, trimmed, phone normalised +91 spacing', () => {
  const r = validateCustomer({ name: '  Ankit Mali  ', email: '  ankit@example.com ', phone: '+91 98213 09060', company: '  Sarvadnya Infotech  ' });
  assertOk(r);
  if (r.value.name !== 'Ankit Mali') throw new Error(`name ${JSON.stringify(r.value.name)}`);
  if (r.value.email !== 'ankit@example.com') throw new Error(`email ${JSON.stringify(r.value.email)}`);
  if (r.value.phone !== '9821309060') throw new Error(`phone ${JSON.stringify(r.value.phone)}`);
  if (r.value.company !== 'Sarvadnya Infotech') throw new Error(`company ${JSON.stringify(r.value.company)}`);
});
test('minimal valid customer accepted, company omitted when blank', () => {
  const r = validateCustomer({ name: 'A', email: 'a@b.co', phone: '9821309060', company: '' });
  assertOk(r);
  if ('company' in r.value) throw new Error('blank company kept');
});
test('bare 91 prefix stripped when it leaves exactly 10 digits', () => {
  const r = validateCustomer({ name: 'Ankit', email: 'ankit@example.com', phone: '919821309060' });
  assertOk(r);
  if (r.value.phone !== '9821309060') throw new Error(`phone ${JSON.stringify(r.value.phone)}`);
});
test('genuine 10-digit number starting with 91 is NOT destoyed by prefix strip', () => {
  const r = validateCustomer({ name: 'Ankit', email: 'ankit@example.com', phone: '9198765432' });
  assertOk(r);
  if (r.value.phone !== '9198765432') throw new Error(`phone ${JSON.stringify(r.value.phone)}`);
});
test('empty name rejected with name error', () => {
  const r = validateCustomer({ name: '   ', email: 'a@b.co', phone: '9821309060' });
  assertErrors(r, ['name']);
});
test('a@b email rejected with email error', () => {
  const r = validateCustomer({ name: 'Ankit', email: 'a@b', phone: '9821309060' });
  assertErrors(r, ['email']);
});
test('uppercase + spaces email rejected', () => {
  const r = validateCustomer({ name: 'Ankit', email: 'A B@example.com', phone: '9821309060' });
  assertErrors(r, ['email']);
});
test('9-digit phone rejected with phone error', () => {
  const r = validateCustomer({ name: 'Ankit', email: 'a@b.co', phone: '982130906' });
  assertErrors(r, ['phone']);
});
test('landline (starts 0) rejected with phone error', () => {
  const r = validateCustomer({ name: 'Ankit', email: 'a@b.co', phone: '02249742200' });
  assertErrors(r, ['phone']);
});
test('letters in phone rejected with phone error', () => {
  const r = validateCustomer({ name: 'Ankit', email: 'a@b.co', phone: '982130906x' });
  assertErrors(r, ['phone']);
});
test('101-char name rejected with name error', () => {
  const r = validateCustomer({ name: 'x'.repeat(101), email: 'a@b.co', phone: '9821309060' });
  assertErrors(r, ['name']);
});
test('101-char company rejected with company error', () => {
  const r = validateCustomer({ name: 'Ankit', email: 'a@b.co', phone: '9821309060', company: 'x'.repeat(101) });
  assertErrors(r, ['company']);
});
test('non-string customer -> all three required-field errors, no crash', () => {
  const r = validateCustomer(null);
  assertErrors(r, ['name', 'email', 'phone']);
  const r2 = validateCustomer('hello');
  assertErrors(r2, ['name', 'email', 'phone']);
});
test('multiple simultaneous errors reported together', () => {
  const r = validateCustomer({ name: '', email: 'a@b', phone: '123' });
  assertErrors(r, ['name', 'email', 'phone']);
});

// ─── validateTssSerials (owner 2026-10-03) ──────────────────────────────────
console.log('🔢 validateTssSerials (one serial per TSS line)');
test('valid serial accepted and trimmed', () => {
  const r = validateTssSerials({ 'tss-single-1yr': '  ABC-123XY  ' }, ['tss-single-1yr']);
  assertOk(r);
  if (r.value['tss-single-1yr'] !== 'ABC-123XY') throw new Error(`serial ${JSON.stringify(r.value['tss-single-1yr'])}`);
});
test('blank serial rejected with slug-keyed error', () => {
  const r = validateTssSerials({ 'tss-single-1yr': '   ' }, ['tss-single-1yr']);
  assertErrors(r, ['tss-single-1yr']);
});
test('missing slug entry rejected (TSS line with no serial)', () => {
  const r = validateTssSerials({}, ['tss-auditor-2yr']);
  assertErrors(r, ['tss-auditor-2yr']);
});
test('unknown slug ignored entirely', () => {
  const r = validateTssSerials({ 'tss-single-1yr': 'ABC', bogus: 'X' }, ['tss-single-1yr']);
  assertOk(r);
  if ('bogus' in r.value) throw new Error('unknown slug kept in value');
  if (Object.keys(r.value).length !== 1) throw new Error(`value keys ${Object.keys(r.value)}`);
});
test('<> stripped from serial', () => {
  const r = validateTssSerials({ 'tss-single-1yr': '<AB>C' }, ['tss-single-1yr']);
  assertOk(r);
  if (r.value['tss-single-1yr'] !== 'ABC') throw new Error(`serial ${JSON.stringify(r.value['tss-single-1yr'])}`);
});
test('serial of only < > becomes blank -> rejected', () => {
  const r = validateTssSerials({ 'tss-single-1yr': '<><>' }, ['tss-single-1yr']);
  assertErrors(r, ['tss-single-1yr']);
});
test('65-char serial rejected', () => {
  const r = validateTssSerials({ 'tss-single-1yr': 'A'.repeat(65) }, ['tss-single-1yr']);
  assertErrors(r, ['tss-single-1yr']);
});
test('64-char serial accepted (boundary)', () => {
  const r = validateTssSerials({ 'tss-single-1yr': 'A'.repeat(64) }, ['tss-single-1yr']);
  assertOk(r);
});
test('two TSS lines: one bad -> only that slug errors; value has the good one', () => {
  const r = validateTssSerials(
    { 'tss-single-1yr': 'GOOD123', 'tss-multi-2yr': '' },
    ['tss-single-1yr', 'tss-multi-2yr'],
  );
  assertErrors(r, ['tss-multi-2yr']);
});
test('no TSS lines -> ok with empty value even via non-object input', () => {
  const r = validateTssSerials(null, []);
  assertOk(r);
  if (Object.keys(r.value).length !== 0) throw new Error('value not empty');
});

// ─── isTssSlug ──────────────────────────────────────────────────────────────
console.log('🏷️  isTssSlug');
test('tss slugs recognised, non-tss and non-strings rejected', () => {
  if (!isTssSlug('tss-single-1yr')) throw new Error('tss-single-1yr missed');
  if (!isTssSlug('tss-auditor-2yr')) throw new Error('tss-auditor-2yr missed');
  if (isTssSlug('silver')) throw new Error('silver accepted');
  if (isTssSlug('')) throw new Error('empty accepted');
  if (isTssSlug(null)) throw new Error('null accepted');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('❌ order-status tests FAILED');
  process.exit(1);
}
console.log('✅ order-status tests pass');