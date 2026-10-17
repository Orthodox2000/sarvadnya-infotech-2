// CHANGE: 2026-10-16 — careers referral system: regression suite for lib/careers-referral.mjs.
// The code format is a security/UX boundary (uppercase-only unique IDs, no ambiguous chars),
// so these assertions lock the alphabet, the format gate, the normaliser and the generator.
// Zero deps; plain Node, same style as scripts/date-coerce-test.mjs.
import {
  REFERRAL_ALPHABET,
  REFERRAL_CODE_LENGTH,
  normalizeReferralCode,
  isValidReferralCodeFormat,
  generateReferralCode,
  generateUniqueReferralCode,
} from '../lib/careers-referral.mjs';

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

async function testAsync(name, fn) {
  try {
    await fn();
    console.log(`  ${name} ... PASS`);
    passed++;
  } catch (err) {
    console.log(`  ${name} ... FAIL — ${err.message}`);
    failed++;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

// ---------------------------------------------------------------- alphabet ---

test('alphabet is 32 unique chars', () => {
  assert(REFERRAL_ALPHABET.length === 32, `expected 32, got ${REFERRAL_ALPHABET.length}`);
  assert(new Set(REFERRAL_ALPHABET).size === 32, 'alphabet has duplicates');
});

test('alphabet excludes ambiguous 0 / O / 1 / I / l', () => {
  for (const ch of ['0', 'O', '1', 'I', 'l']) {
    assert(!REFERRAL_ALPHABET.includes(ch), `alphabet must not contain "${ch}"`);
  }
});

test('alphabet is uppercase letters + digits only', () => {
  assert(/^[A-Z2-9]+$/.test(REFERRAL_ALPHABET), `unexpected chars in alphabet: ${REFERRAL_ALPHABET}`);
});

test('code length is 8', () => {
  assert(REFERRAL_CODE_LENGTH === 8, `expected 8, got ${REFERRAL_CODE_LENGTH}`);
});

// ---------------------------------------------------------------- generator ---

test('generateReferralCode: 500 codes are 8 chars, in-alphabet, format-valid', () => {
  for (let i = 0; i < 500; i++) {
    const code = generateReferralCode();
    assert(code.length === 8, `bad length: ${code}`);
    assert(isValidReferralCodeFormat(code), `format rejected generated code: ${code}`);
    for (const ch of code) assert(REFERRAL_ALPHABET.includes(ch), `char "${ch}" not in alphabet: ${code}`);
  }
});

test('generator output is uppercase', () => {
  for (let i = 0; i < 50; i++) {
    const code = generateReferralCode();
    assert(code === code.toUpperCase(), `not uppercase: ${code}`);
  }
});

test('generator has no collisions across 5,000 codes', () => {
  const seen = new Set();
  for (let i = 0; i < 5000; i++) seen.add(generateReferralCode());
  assert(seen.size === 5000, `only ${seen.size}/5000 unique — suspicious collisions`);
});

test('generator exercises the whole alphabet (distribution sanity)', () => {
  const seen = new Set();
  for (let i = 0; i < 3000; i++) for (const ch of generateReferralCode()) seen.add(ch);
  assert(seen.size === 32, `only ${seen.size}/32 alphabet chars appeared in 3000 codes`);
});

// ---------------------------------------------------------------- format gate ---

test('format gate accepts a normal code', () => {
  assert(isValidReferralCodeFormat('XK7M2Q9B') === true, 'valid code rejected');
});

test('format gate rejects wrong length', () => {
  assert(isValidReferralCodeFormat('XK7M2Q9') === false, '7 chars accepted');
  assert(isValidReferralCodeFormat('XK7M2Q9BB') === false, '9 chars accepted');
  assert(isValidReferralCodeFormat('') === false, 'empty accepted');
});

test('format gate rejects lowercase', () => {
  assert(isValidReferralCodeFormat('xk7m2q9b') === false, 'lowercase accepted');
});

test('format gate rejects ambiguous chars and punctuation', () => {
  assert(isValidReferralCodeFormat('XK7M2Q90') === false, '0 accepted');
  assert(isValidReferralCodeFormat('XK7M2Q9O') === false, 'O accepted');
  assert(isValidReferralCodeFormat('X7M2Q9B1') === false, '1 accepted');
  assert(isValidReferralCodeFormat('X7M2Q9BI') === false, 'I accepted');
  assert(isValidReferralCodeFormat('XK7M-Q9B') === false, 'hyphen accepted');
  assert(isValidReferralCodeFormat('XK7M Q9B') === false, 'space accepted');
});

test('format gate rejects non-strings without throwing', () => {
  assert(isValidReferralCodeFormat(null) === false, 'null accepted');
  assert(isValidReferralCodeFormat(undefined) === false, 'undefined accepted');
  assert(isValidReferralCodeFormat(12345678) === false, 'number accepted');
  assert(isValidReferralCodeFormat({}) === false, 'object accepted');
});

// ---------------------------------------------------------------- normaliser ---

test('normalise uppercases and strips separators', () => {
  assert(normalizeReferralCode(' xk7m-2q9b ') === 'XK7M2Q9B', 'did not normalise to XK7M2Q9B');
  assert(normalizeReferralCode('ref_xk7m2q9b') === 'REFXK7M2Q9B', 'underscore not stripped');
});

test('normalise KEEPS digits 0/1 so a bad code fails loudly (never silently mangled)', () => {
  assert(normalizeReferralCode('XK7M2Q90') === 'XK7M2Q90', 'normalise dropped a 0');
  assert(isValidReferralCodeFormat(normalizeReferralCode('XK7M2Q90')) === false, 'normalised bad code passed format');
});

test('normalise returns empty string for non-strings', () => {
  assert(normalizeReferralCode(null) === '', 'null -> not empty');
  assert(normalizeReferralCode(undefined) === '', 'undefined -> not empty');
  assert(normalizeReferralCode(42) === '', 'number -> not empty');
});

// ---------------------------------------------------------------- unique gen ---

await testAsync('generateUniqueReferralCode retries a taken candidate', async () => {
  const first = generateReferralCode();
  let calls = 0;
  const code = await generateUniqueReferralCode(async (candidate) => {
    calls++;
    return candidate === first; // only the (re-generated) first call is "taken"
  });
  assert(isValidReferralCodeFormat(code), `unique code invalid: ${code}`);
  assert(calls >= 1, 'predicate never called');
  assert(code !== first || calls > 1, 'returned a code the predicate rejected');
});

await testAsync('generateUniqueReferralCode throws when every candidate is taken', async () => {
  let calls = 0;
  let threw = false;
  try {
    await generateUniqueReferralCode(async () => {
      calls++;
      return true;
    }, 4);
  } catch {
    threw = true;
  }
  assert(threw, 'expected a throw after exhausting attempts');
  assert(calls === 4, `expected 4 attempts, saw ${calls}`);
});

await testAsync('generateUniqueReferralCode rejects a non-function predicate', async () => {
  let threw = false;
  try {
    await generateUniqueReferralCode(null);
  } catch (err) {
    threw = err instanceof TypeError;
  }
  assert(threw, 'expected TypeError for a non-function predicate');
});

// ---------------------------------------------------------------- report ---

console.log(`\nreferral-code: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
