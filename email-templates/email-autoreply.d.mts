// CHANGE: 2026-11-20 — Relocated from lib/ to email-templates/; types unchanged.
// CHANGE: 2026-09-21 — Type declarations for the pure-ESM client auto-reply
// template module (email-templates/email-autoreply.mjs). Kept hand-written and minimal so
// TS can import the shared template without generating types on every build.

export interface AutoreplyCompany {
  name: string;
  tagline: string;
  email: string;
  phoneLines: string[];
  website: string;
  address?: string;
}

export interface AutoreplyRenderOptions {
  name?: string;
  /** The submitted email (echoed back in the acknowledgement receipt). */
  email?: string;
  /** The submitted phone/contact number. */
  contact?: string;
  /** Product/service the lead enquired about (the form's `service` field). */
  product?: string;
  /** The submitted message (the form's `description` field). */
  message?: string;
  /** Pre-formatted submission date/time shown in the receipt. */
  submittedAt?: string;
  /** @deprecated Kept for older callers; pass `product` instead. */
  service?: string;
  company?: Partial<AutoreplyCompany>;
  /** Ready-to-use logo src, resolved by the caller:
   * { cid: 'sarvadnya-logo' } → <img src="cid:…">  (inline attachment, live send)
   * { data: 'data:image/png;base64,…' }             (fully offline preview)
   * { url: 'https://…/TallyCertificate.png' }       (hosted fallback) */
  logo?: { cid?: string; data?: string; url?: string };
}

export const CLIENT_AUTOREPLY_SUBJECT: string;
export const DEFAULT_COMPANY: AutoreplyCompany;
export function buildClientAutoreplyHtml(options?: AutoreplyRenderOptions): string;