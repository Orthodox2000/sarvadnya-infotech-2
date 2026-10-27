// CHANGE: 2026-10-27 — ONE place that decides what counts as a real email, and
// whether a chat-originated draft is allowed to be written at all.
//
// WHY: owner — "form draft too triggers automatically from ask sara even no actual
// email is found, ensure proper regex matching exist before triggering form draft
// from ask sara". The chat tracker called start() with NO fields and flush('unload')
// bypasses the "nothing changed" early return, so closing the modal (or leaving the
// page) POSTed `fields: {}` and the admin panel got a blank "Form Drafts" row with
// no reachable contact. A chat has no form to recover, so a draft without a real
// email is noise, not a lead.
//
// Pure ESM, zero deps (house pattern: lib/rating-summary.mjs, lib/sara-guard.mjs,
// lib/careers-referral.mjs) so the same module is imported by BOTH the browser
// tracker and the server route — no client/server drift on what "valid" means.

/**
 * Deliberately stricter than `[^\s@]+@[^\s@]+\.[^\s@]{2,}` (which accepted `a@b.c#`,
 * `a@b..com`, `.a@b.com` and `a@-b.com`):
 *   - local part: dot-separated atext runs, so no leading/trailing dot and no `..`
 *   - host: every label starts and ends alphanumeric (no `-b.com`)
 *   - TLD: 2+ letters only (no digits)
 */
export const EMAIL_PATTERN =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/

/** Entry points that come from a CHAT (no form to recover => email required). */
export const CHAT_ENTRY_POINTS = Object.freeze(['ask-sara', 'learn-sara'])

/**
 * @param {unknown} value
 * @returns {boolean} true only for a syntactically valid, trimmed, lower-cased-able address
 */
export function isValidEmail(value) {
  if (typeof value !== 'string') return false
  const email = value.trim()
  if (email.length < 6 || email.length > 254) return false
  return EMAIL_PATTERN.test(email)
}

/**
 * Finds the first valid email in a captured-fields object.
 * Scans the VALUES rather than trusting key names, because the chat tracker and
 * the (future) form trackers use different field names for the same thing.
 *
 * @param {Record<string, unknown>|null|undefined} fields
 * @returns {string|null} the normalised email, or null when there is none
 */
export function findEmail(fields) {
  if (!fields || typeof fields !== 'object') return null
  for (const value of Object.values(fields)) {
    if (typeof value === 'string' && isValidEmail(value)) return value.trim().toLowerCase()
  }
  return null
}

/**
 * @param {Record<string, unknown>|null|undefined} fields
 * @returns {boolean}
 */
export function hasValidEmail(fields) {
  return findEmail(fields) !== null
}

/**
 * @param {unknown} entryPoint
 * @returns {boolean} true for the chat entry points, which must prove a contact first
 */
export function isChatEntryPoint(entryPoint) {
  return typeof entryPoint === 'string' && CHAT_ENTRY_POINTS.includes(entryPoint)
}

/**
 * The single gate both sides call.
 *
 *  - chat entry points  -> only when a valid email is present
 *  - everything else    -> unchanged (a real form draft is captured progressively;
 *                          gating it on a finished email would defeat its purpose)
 *
 * @param {unknown} entryPoint
 * @param {Record<string, unknown>|null|undefined} fields
 * @returns {boolean} true when the draft may be written
 */
export function shouldCaptureDraft(entryPoint, fields) {
  if (!isChatEntryPoint(entryPoint)) return true
  return hasValidEmail(fields)
}
