// CHANGE: 2026-10-16 — pure-ESM careers referral-code module (zero deps, importable from
// TS routes, the client signup form AND plain-Node test scripts — same pattern as
// lib/email-autoreply.mjs / lib/prices-catalog.mjs).
// WHY: the referral system needs ONE source of truth for the code alphabet + format,
// shared by the signup route (server validation), the backfill script, the signup form
// (?ref auto-fill) and scripts/referral-code-test.mjs.
//
// ISOMORPHIC BY DESIGN: randomness comes from globalThis.crypto.getRandomValues, which
// exists in every browser AND Node >= 19 — no `node:crypto` import, so this module can be
// bundled into the client component (AuthForms) without pulling a Node builtin into the
// browser bundle.

/** 32 chars: A-Z minus I/O plus 2-9 minus 0/1 — no ambiguous pairs (0/O, 1/I/l), so a
 *  code is safe to read aloud, spell over the phone or retype from a share link. */
export const REFERRAL_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const REFERRAL_CODE_LENGTH = 8;

const REFERRAL_FORMAT_RE = new RegExp(`^[${REFERRAL_ALPHABET}]{${REFERRAL_CODE_LENGTH}}$`);

/**
 * Uppercase + strip everything outside A-Z0-9 (spaces, hyphens, a stray "REF-" prefix…).
 * Note: this deliberately does NOT drop 0/1/O/I — if someone typed them the format check
 * fails loudly instead of silently mangling their input into a different code.
 */
export function normalizeReferralCode(input) {
  if (typeof input !== 'string') return '';
  return input.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/** Strict format gate: exactly REFERRAL_CODE_LENGTH chars, all from REFERRAL_ALPHABET. */
export function isValidReferralCodeFormat(code) {
  return typeof code === 'string' && REFERRAL_FORMAT_RE.test(code);
}

/** Cryptographically random code. The alphabet is 32 chars, so 256 % 32 === 0 and the
 *  rejection-sampled byte mapping is exactly uniform (no modulo bias). */
export function generateReferralCode() {
  let out = '';
  const acceptBelow = 256 - (256 % REFERRAL_ALPHABET.length); // === 256 for a 32-char alphabet
  while (out.length < REFERRAL_CODE_LENGTH) {
    const bytes = new Uint8Array(REFERRAL_CODE_LENGTH * 2);
    globalThis.crypto.getRandomValues(bytes);
    for (let i = 0; i < bytes.length && out.length < REFERRAL_CODE_LENGTH; i++) {
      if (bytes[i] < acceptBelow) out += REFERRAL_ALPHABET[bytes[i] % REFERRAL_ALPHABET.length];
    }
  }
  return out;
}

/**
 * Generate a code that passes `isTaken(code)` == false (async predicate, e.g. a DB
 * lookup). Retries up to `attempts` times; 32^8 ≈ 1.1e12 codes make a collision
 * vanishingly unlikely, so exhausting attempts means something else is wrong.
 */
export async function generateUniqueReferralCode(isTaken, attempts = 10) {
  if (typeof isTaken !== 'function') throw new TypeError('generateUniqueReferralCode requires an isTaken predicate');
  for (let i = 0; i < attempts; i++) {
    const code = generateReferralCode();
    // eslint-disable-next-line no-await-in-loop -- serial by intent: one DB check at a time
    if (!(await isTaken(code))) return code;
  }
  throw new Error('Could not generate a unique referral code');
}
