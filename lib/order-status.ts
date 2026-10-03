// CHANGE: 2026-10-03 — SP-3 payments: single source of truth for the ORDER
// status vocabulary, the atomic $set.status + $push.statusHistory update builder
// (same invariant as the nested repo's SP-2 status-history.ts: status and history
// change in ONE op so they can never disagree), the newest-first timeline
// reconstructor, customer validation (captured at /checkout) and TSS serial
// validation (owner 2026-10-03 — one serial per TSS cart line).
// Deliberately free of Mongo/React/next/* dependencies in types and at runtime,
// so it is testable with plain `node` (scripts/order-status-test.mjs) and shared
// by the client (CheckoutContents), the public flow routes and the nested admin
// repo (hand-ported). Do NOT add Mongo types here — the single UpdateFilter cast
// lives at the driver boundary in the route / mongodb-utils layer.

/** The complete, validated order status vocabulary. Case-sensitive. */
export const ORDER_STATUSES = ['created', 'verified', 'refunded', 'fulfilled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Default actor for admin-driven changes (mirrors nested STATUS_ACTOR). */
export const ORDER_STATUS_ACTOR = 'admin' as const;

export type StatusEvent = {
  to: string; // the status the order became
  at: Date; // when the change was applied
  actor: string; // 'system' (created/verified, payment flow) | 'admin' (refunded/fulfilled)
  note?: string; // optional free text
};

export type TimelineEntry = StatusEvent & { from: string | null };

/**
 * The atomic update this builder produces: status is set and the audit event
 * appended by the SAME operation. Events store `to` only; `from` is derived by
 * buildOrderTimeline (no read-before-write -> no race between concurrent admins).
 * Typed precisely rather than as Mongo's UpdateFilter — the driver's PushOperator
 * rejects concrete value types against a bare Document; the single cast lives at
 * the driver boundary.
 */
export type StatusChangeUpdate = {
  $set: { status: OrderStatus; updatedAt: Date };
  $push: { statusHistory: StatusEvent };
};

/** Matches the user-agent cap at lib/visitors.ts:203. */
export const NOTE_MAX = 300;

/**
 * Strips control characters (so a note cannot inject line breaks into the audit
 * trail) and caps length. A note is never worth failing a status change over, so
 * this sanitises rather than rejects (mirrors nested lib/status-history.ts).
 */
function sanitizeNote(note?: string): string | undefined {
  if (note === undefined) return undefined;
  // eslint-disable-next-line no-control-regex
  const cleaned = note.replace(/[\u0000-\u001F\u007F]/g, ' ').trim();
  return cleaned ? cleaned.slice(0, NOTE_MAX) : undefined;
}

/** Type guard for the order vocabulary. */
export function isValidOrderStatus(s: string): s is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(s);
}

/**
 * Builds ONE atomic Mongo update that sets status and appends the event
 * together. `actor` defaults to 'admin' (matches SP-2); flow callers
 * (/api/cart/order, /api/cart/verify) pass 'system' explicitly. `at` is
 * injectable so tests are deterministic.
 */
export function orderStatusChangeUpdate(
  to: OrderStatus,
  opts?: { note?: string; at?: Date; actor?: 'system' | 'admin' },
): StatusChangeUpdate {
  const at = opts?.at ?? new Date();
  const event: StatusEvent = { to, at, actor: opts?.actor ?? ORDER_STATUS_ACTOR };
  const note = sanitizeNote(opts?.note);
  if (note !== undefined) event.note = note;

  return {
    $set: { status: to, updatedAt: at },
    $push: { statusHistory: event },
  };
}

/**
 * Reconstructs the timeline newest-first, deriving each entry's `from` from the
 * next-older entry's `to`. The oldest entry's `from` is null because legacy
 * orders are deliberately not backfilled. Pure and testable.
 */
export function buildOrderTimeline(history: StatusEvent[]): TimelineEntry[] {
  const ordered = [...history].sort((a, b) => b.at.getTime() - a.at.getTime());
  return ordered.map((ev, i) => ({ ...ev, from: ordered[i + 1]?.to ?? null }));
}

// ─── Customer capture (SP-3) ─────────────────────────────────────────────────

export type Customer = { name: string; email: string; phone: string; company?: string };

export type CustomerFieldErrors = { name?: string; email?: string; phone?: string; company?: string };

export type CustomerValidation =
  | { ok: true; value: Customer }
  | { ok: false; errors: CustomerFieldErrors };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/; // 10-digit Indian mobile, digits only

function asString(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

/**
 * Normalises an Indian mobile number: keeps digits only, then strips a leading
 * 91 country code only when it leaves a valid-length number (so a genuine
 * 10-digit number that happens to start with 91 is never destroyed, while
 * `+91 98213 09060`, `919821309060` and `9821309060` all collapse to 10 digits).
 */
function normalizePhone(phone: unknown): string {
  const digits = asString(phone).replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) return digits.slice(2);
  return digits;
}

/**
 * Validates the buyer card captured at /checkout. Pure and shared: the client
 * uses it to gate the Pay button, the server uses it to reject bad POSTs with
 * 400 + per-field errors (never silently mangled). `value` carries trimmed,
 * normalised data (phone as 10 digits); `company` is omitted when blank.
 */
export function validateCustomer(raw: unknown): CustomerValidation {
  const src = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const name = asString(src.name).trim();
  const email = asString(src.email).trim();
  const phone = normalizePhone(src.phone);
  const company = asString(src.company).trim();

  const errors: CustomerFieldErrors = {};
  if (!name) errors.name = 'Enter your name.';
  else if (name.length > 100) errors.name = 'Name must be 100 characters or fewer.';
  if (!email) errors.email = 'Enter your email address.';
  else if (email.length > 254 || !EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';
  if (!phone) errors.phone = 'Enter your mobile number.';
  else if (!PHONE_RE.test(phone)) errors.phone = 'Enter a valid 10-digit mobile number.';
  if (company.length > 100) errors.company = 'Company must be 100 characters or fewer.';

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const value: Customer = { name, email, phone };
  if (company) value.company = company;
  return { ok: true, value };
}

// ─── TSS serial capture (owner 2026-10-03) ───────────────────────────────────

export type TssSerialsValidation =
  | { ok: true; value: Record<string, string> } // trimmed, sanitised serials by TSS slug
  | { ok: false; errors: Record<string, string> }; // slug -> human message

/** A TSS cart line is any priced item whose slug starts with `tss-`. */
export function isTssSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && slug.startsWith('tss-');
}

/**
 * Validates the buyer's TSS serial numbers — one per TSS cart line (multi-licence
 * carts, owner pick). Mirrors the existing /api/tss-renewal free-text handling
 * (trim, strip <>, cap 64; no invented format regex). Only slugs present in
 * `tssSlugs` are required; extra keys in `raw` are ignored. `value` carries the
 * cleaned serials for persistence.
 */
export function validateTssSerials(raw: unknown, tssSlugs: string[]): TssSerialsValidation {
  const src = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const value: Record<string, string> = {};
  const errors: Record<string, string> = {};

  for (const slug of tssSlugs) {
    const cleaned = asString(src[slug]).replace(/[<>]/g, '').trim();
    if (!cleaned) {
      errors[slug] = 'Enter the TSS serial number for this item.';
      continue;
    }
    if (cleaned.length > 64) {
      errors[slug] = 'TSS serial must be 64 characters or fewer.';
      continue;
    }
    value[slug] = cleaned;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value };
}