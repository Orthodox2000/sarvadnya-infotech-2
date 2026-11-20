# 2026-11-02 — TSS serial number format locked to 9 digits starting with 7

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Area | Detail |
| :--- | :--- |
| **Rule (owner)** | *"in purchase page we have a tss serial number input, apply regex so that its only 9 digits and starts with 7"* — `/^7\d{8}$/`. |
| **Single definition** | `lib/order-status.ts` exports **`TSS_SERIAL_RE = /^7\d{8}$/`**; `validateTssSerials()` still trims and strips `<>` first, keeps its blank and 64-char guards, then rejects anything failing the regex with *"TSS serial must be 9 digits and start with 7."* Because `/api/cart/order` re-validates server-side, the rule is **server-authoritative** — a client can never skip it. |
| **Checkout input** | `app/(site)/checkout/CheckoutContents.tsx` TSS serial input now filters keystrokes and paste with `replace(/\D/g,'').slice(0,9)`, plus `inputMode="numeric"`, `maxLength={9}`, `pattern="7[0-9]{8}"` and placeholder `e.g. 712345678`. UX only — the gate is the shared validator. |
| **Tests** | `scripts/order-status-test.mjs` re-pointed at the new rule: valid `712345678`, not-starting-with-7, 8- and 10-digit, letters/dashes, `<`/`>` stripping and oversized cases. The old 64-char acceptance case is gone (no longer reachable). |
| **Not changed** | `/api/tss-renewal` (the renewal enquiry form in `app/components/TssRenewalForm.tsx`) stays free-text on purpose — it is an enquiry, not a purchase, and people paste whatever the Manage License screen shows. |
