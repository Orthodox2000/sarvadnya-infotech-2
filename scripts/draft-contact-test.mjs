// CHANGE: 2026-10-27 — regression suite for lib/draft-contact.mjs, the ONE rule that decides
// what counts as a real contact and whether a chat-originated draft may be written.
//
// WHY: owner — "form draft too triggers automatically form ask sara even no actal email is
// found, ensure proper regex matching exist before triggering form draft from ask sara".
// The chat tracker started with NO fields and flush('unload') skipped the "nothing changed"
// early return, so every modal close / page hide POSTed `fields: {}` and the admin "Form
// Drafts" screen filled with blank, unreachable rows. Worse, a lenient pattern let
// `a@b.c#` and `a@b..com` through.
//
// The module is imported by BOTH the browser tracker and the server route, so these tests
// pin the shared meaning of "valid" for both sides. Zero deps, no server, no DB.
import {
  EMAIL_PATTERN,
  CHAT_ENTRY_POINTS,
  isValidEmail,
  findEmail,
  hasValidEmail,
  isChatEntryPoint,
  shouldCaptureDraft,
} from '../lib/draft-contact.mjs';
import { readFileSync } from 'node:fs';

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

console.log('\nDraft capture gate - valid contact + chat-entry rule (no server/DB)\n');

// --- What counts as a real email -------------------------------------------------
console.log('Email validation');

const VALID = [
  'info@sarvadnyainfotech.com',
  'ankit.mali@gmail.com',
  'a_b+c@sub.domain.co.in',
  'sales@tally-partner.io',
  'first.last@example.museum',
];
const INVALID = [
  'a@b.c',            // single-letter TLD
  'a@b.c#',           // trailing junk
  'a@b..com',         // empty label
  '.a@b.com',         // leading dot in local part
  'a.@b.com',         // trailing dot in local part
  'a b@c.com',        // space
  'a@-b.com',         // host label starting with a hyphen is not a real label
  'plainstring',
  'no-at-sign.com',
  'two@@at.com',
  '@nolocal.com',
  'nolocal@.com',
  'nolocal@com',
  'user@domain.c',    // 1-char TLD again via other shape
  'user@domain.1com', // numeric TLD
];

test('accepts real-world addresses', () => {
  for (const email of VALID) assert(isValidEmail(email), `should accept: ${email}`);
});
test('rejects the malformed shapes a loose regex let through', () => {
  for (const email of INVALID) assert(!isValidEmail(email), `should reject: ${email}`);
});
test('trims surrounding whitespace but not inner characters', () => {
  assert(isValidEmail('  info@sarvadnyainfotech.com  '), 'trimmed address should pass');
  assert(!isValidEmail('in fo@sarvadnyainfotech.com'), 'inner space must fail');
});
test('tolerates a mixed-case address (case is not validity)', () => {
  assert(isValidEmail('Info@SarvadnyaInfotech.COM'), 'uppercase address should pass');
});
test('rejects non-strings without throwing', () => {
  for (const value of [null, undefined, 42, {}, [], true, () => {}]) {
    assert(!isValidEmail(value), `should reject non-string: ${String(value)}`);
  }
});
test('enforces the length bounds', () => {
  assert(!isValidEmail('a@b.c'), '5 chars is below the 6-char floor');
  const longLocal = 'a'.repeat(250) + '@x.com';
  assert(!isValidEmail(longLocal), 'over 254 chars must fail');
});
test('EMAIL_PATTERN is anchored (no partial match of a longer string)', () => {
  assert(!EMAIL_PATTERN.test('see info@sarvadnyainfotech.com for details'), 'pattern must be anchored');
});

// --- The chat rule -----------------------------------------------------------------
console.log('Chat entry points');

test('the chat entry points are exactly ask-sara and learn-sara', () => {
  assert(CHAT_ENTRY_POINTS.length === 2, `expected 2 chat entry points, got ${CHAT_ENTRY_POINTS.length}`);
  assert(isChatEntryPoint('ask-sara'), 'ask-sara must be a chat entry point');
  assert(isChatEntryPoint('learn-sara'), 'learn-sara must be a chat entry point');
});
test('form entry points are NOT chat-gated', () => {
  for (const entry of ['form', 'training', 'generic', 'contact-form']) {
    assert(!isChatEntryPoint(entry), `${entry} should not be chat-gated`);
  }
});
test('isChatEntryPoint rejects non-strings without throwing', () => {
  for (const value of [null, undefined, 0, {}, ['ask-sara']]) {
    assert(!isChatEntryPoint(value), `should be false: ${String(value)}`);
  }
});

// --- The gate itself ----------------------------------------------------------------
console.log('shouldCaptureDraft()');

test('a chat draft with NO fields is refused (the blank-row bug)', () => {
  assert(!shouldCaptureDraft('ask-sara', {}), 'ask-sara + {} must be refused');
  assert(!shouldCaptureDraft('learn-sara', {}), 'learn-sara + {} must be refused');
  assert(!shouldCaptureDraft('ask-sara', null), 'ask-sara + null must be refused');
  assert(!shouldCaptureDraft('ask-sara', undefined), 'ask-sara + undefined must be refused');
});
test('a chat draft with a name + phone but no email is still refused', () => {
  assert(!shouldCaptureDraft('ask-sara', { name: 'Ankit', phone: '9821309060' }), 'no email -> refused');
});
test('a chat draft with an INVALID email is refused', () => {
  assert(!shouldCaptureDraft('ask-sara', { name: 'Ankit', email: 'ankit@' }), 'bad email -> refused');
  assert(!shouldCaptureDraft('ask-sara', { name: 'Ankit', email: 'a@b.c' }), 'short TLD -> refused');
});
test('a chat draft with a VALID email is allowed', () => {
  assert(shouldCaptureDraft('ask-sara', { name: 'Ankit', email: 'ankit.mali@gmail.com' }), 'valid email -> allowed');
  assert(shouldCaptureDraft('learn-sara', { email: 'INFO@SarvadnyaInfotech.com' }), 'valid email -> allowed');
});
test('the email may be under ANY field name (the value is what matters)', () => {
  assert(shouldCaptureDraft('ask-sara', { emailAddress: 'ankit.mali@gmail.com' }), 'emailAddress should count');
  assert(shouldCaptureDraft('ask-sara', { contact: 'ankit.mali@gmail.com' }), 'contact holding an email should count');
});
test('non-chat entry points are NOT gated (a real form draft is captured progressively)', () => {
  assert(shouldCaptureDraft('form', {}), 'form + {} must still be allowed');
  assert(shouldCaptureDraft('generic', { note: 'half-typed' }), 'generic draft must still be allowed');
  assert(shouldCaptureDraft(undefined, {}), 'unknown entry point must default to allowed');
});

// --- Field scanning ------------------------------------------------------------------
console.log('findEmail() / hasValidEmail()');

test('findEmail returns the normalised (trimmed, lower-cased) address', () => {
  assert(findEmail({ email: '  Ankit.Mali@Gmail.COM ' }) === 'ankit.mali@gmail.com', 'normalisation failed');
});
test('findEmail returns null when nothing qualifies', () => {
  for (const fields of [{}, { name: 'Ankit' }, { email: 'nope' }, null, undefined, 'not-an-object']) {
    assert(findEmail(fields) === null, `expected null for ${JSON.stringify(fields)}`);
  }
});
test('findEmail ignores non-string values', () => {
  assert(findEmail({ a: 123, b: null, c: { d: 'x@y.com' } }) === null, 'only string values count');
});
test('hasValidEmail mirrors findEmail', () => {
  assert(hasValidEmail({ email: 'ankit.mali@gmail.com' }) === true, 'valid -> true');
  assert(hasValidEmail({ email: 'bad' }) === false, 'invalid -> false');
});

// --- Wiring: the gate must actually be called, on both sides -------------------------
// CHANGE: 2026-10-27 — static checks added after the runtime probe caught a real defect.
// The tracker only POSTs the DIFF of the fields, so the chat flush "name+email" then
// "phone" arrives as `fields:{phone}` — no email in the payload — and the server refused
// it, silently dropping the number. A unit test cannot see that (the module was right;
// the caller was wrong), so pin the caller.
console.log('wiring (client tracker + server route)');

const read = (rel) => readFileSync(new URL(`../${rel}`, import.meta.url), 'utf8');

test('the client tracker asks the shared module before flushing', () => {
  const src = read('lib/draft-tracker.ts');
  assert(/shouldCaptureDraft\(/.test(src), 'draft-tracker.ts must call shouldCaptureDraft()');
  assert(
    /\.\.\.this\.lastSent,\s*\.\.\.this\.pending/.test(src),
    'draft-tracker.ts must gate on the MERGED view (lastSent + pending), not the diff',
  );
});

test('the server route asks the shared module and merges STORED fields before refusing', () => {
  const src = read('app/api/drafts/flush/route.ts');
  assert(/shouldCaptureDraft\(/.test(src), 'flush route must call shouldCaptureDraft()');
  assert(
    /prior\.fields/.test(src) && /\{\.\.\.carried,\s*\.\.\.f\}/.test(src),
    'flush route must re-check with the stored fields merged ({...carried, ...f}); otherwise a diff flush with no email in it is refused and the field is lost',
  );
  assert(/skipped:\s*'no_contact'/.test(src), 'flush route must answer skipped:no_contact rather than writing');
});

test('the learn-sara screen no longer ships a draft tracker (it has no form)', () => {
  const src = read('app/(site)/learn-sara/chat/page.tsx');
  assert(!/createDraftTracker/.test(src), 'learn-sara/chat must not start a draft tracker');
});

console.log('\n' + '-'.repeat(50));
console.log(`  Total: ${passed + failed}  |  PASSED: ${passed}  |  FAILED: ${failed}`);
console.log('-'.repeat(50) + '\n');
if (failed > 0) process.exit(1);
