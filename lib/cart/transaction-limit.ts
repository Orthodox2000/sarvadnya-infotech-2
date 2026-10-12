// CHANGE: 2026-10-12 — per-TRANSACTION rate limiting for the payment routes.
// WHY (owner: "avoid same IP spamming or route attacks — rate limit per transaction
// trigger"): a plain per-IP window is the wrong shape for a checkout. One IP can open many
// genuine orders (offices, NAT, mobile carriers), while an attacker spamming the same cart,
// the same buyer identity, or brute-forcing one order's signature is what actually needs
// braking. This limiter keys each ATTEMPT by every dimension the attacker must vary, and
// names the scope that tripped, so the response tells an operator the shape of the attack.
//
// SCOPES
//   ip       — raw IP. A burst brake; the same posture as every other public write route.
//   cart     — ip + SHA-256(cart). Re-submitting the SAME cart over and over.
//   identity — SHA-256(email|phone). The same buyer hammering order creation.
//   order    — razorpayOrderId + ip. Signature-verification brute force on ONE order.
//
// The hashes are truncated digests, never reversals of the raw values, and are used only as
// in-process map keys — nothing is persisted or logged here.
import crypto from 'node:crypto';
import { createRateLimiter, type RateLimiter } from '../rate-limit.ts';
import { normalizePhone } from '../order-status.ts';

export interface ScopeConfig {
  /** Requests allowed per window. */
  limit: number;
  /** Window length in ms. */
  windowMs: number;
  /** In-memory key cap per scope (defaults to the limiter's own 5000). */
  maxEntries?: number;
}

export interface LimitDecision {
  limited: boolean;
  /** The scope that tripped, or null when nothing did. */
  scope: string | null;
  /** Seconds until the tripped window resets (0 when not limited). */
  retryAfter: number;
  /** Headers to stamp on a 429. Empty when not limited. */
  headers: Record<string, string>;
}

export interface TransactionLimiter {
  /** Checks every scope whose key is provided; fails on the FIRST scope over its limit. */
  check(keys: Partial<Record<string, string>>): LimitDecision;
  /** Per-scope map sizes — exposed for tests and ops. */
  sizes(): Record<string, number>;
}

const digest = (value: string): string =>
  crypto.createHash('sha256').update(value).digest('hex').slice(0, 24);

/**
 * Deterministic cart fingerprint. Sorted, so re-adding the same items in a different
 * order is still recognised as the same transaction (that is the spam we are braking,
 * not legitimate re-ordering before paying).
 */
export function cartFingerprint(items: Array<{ slug?: unknown; qty?: unknown }>): string {
  const normalised = items
    .map((i) => `${String(i.slug ?? '').trim()}:${Number(i.qty ?? 0) || 0}`)
    .sort()
    .join('|');
  return digest(normalised);
}

/** Buyer fingerprint from email + phone (phone normalised exactly like the checkout gate). */
export function identityFingerprint(email: unknown, phone: unknown): string {
  const e = String(email ?? '').trim().toLowerCase();
  const p = normalizePhone(phone);
  return digest(`${e}|${p}`);
}

export function createTransactionLimiter(scopes: Record<string, ScopeConfig>): TransactionLimiter {
  const limiters: Record<string, RateLimiter> = {};
  for (const [name, cfg] of Object.entries(scopes)) {
    limiters[name] = createRateLimiter(cfg.limit, cfg.windowMs, cfg.maxEntries);
  }

  return {
    check(keys: Partial<Record<string, string>>): LimitDecision {
      for (const [name, limiter] of Object.entries(limiters)) {
        const key = keys[name];
        if (!key) continue;
        const res = limiter.check(key);
        if (res.limited) {
          const resetSeconds = Math.ceil((Date.now() + res.retryAfter * 1000) / 1000);
          return {
            limited: true,
            scope: name,
            retryAfter: res.retryAfter,
            headers: {
              'Retry-After': String(res.retryAfter),
              'X-RateLimit-Limit': String(scopes[name].limit),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': String(resetSeconds),
              'X-RateLimit-Scope': name,
            },
          };
        }
      }
      return { limited: false, scope: null, retryAfter: 0, headers: {} };
    },
    sizes(): Record<string, number> {
      const out: Record<string, number> = {};
      for (const [name, limiter] of Object.entries(limiters)) out[name] = limiter.size();
      return out;
    },
  };
}
