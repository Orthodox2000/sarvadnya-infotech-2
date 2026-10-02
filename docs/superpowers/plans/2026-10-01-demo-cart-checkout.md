# `/demo` Cart + Razorpay Test Checkout — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `/demo` homepage clone with an isolated cart scaffold — product cards → cart → totals → `/demo/checkout` → Razorpay **test-mode** payment — and put a permanent guard in place so the live site can never depend on `/demo` again.

**Architecture:** A server-authoritative product catalog with pure cart maths (`lib/demo/catalog.ts`, `lib/demo/cart.ts`, zero React/IO so plain `node` can test them), a client cart store persisted to `localStorage`, two API routes (create order / verify signature), and a single Razorpay gateway seam (`lib/demo/razorpay.ts`) that hard-blocks any key not beginning `rzp_test_`. Independence from production is enforced by a CI-style grep guard, not by convention.

**Tech Stack:** Next.js **15.5.19** App Router (the version `package-lock.json` pins and Vercel actually installs — NOT the 15.5.26/15.5.27 this plan originally claimed), React 19.2.4, Tailwind 4, TypeScript 5.9.3, MongoDB driver **7.4.0** (production cluster — see §Global Constraints), Razorpay official Node SDK `razorpay@2.9.8` (exact-pinned), Node **24.21.0** LTS.

> **Correction (2026-10-02, after Task 1).** This line previously read *"Next.js 15.5.27 … MongoDB 7.7.0"*, taken from a drifted `node_modules` tree rather than the lockfile. Both forks' `package-lock.json` pin `next` 15.5.19 and `mongodb` 7.4.0, and `daily logs/2026-09-18.md` records the owner choosing to *"keep 15.5.19"*. `npm install` under Node 24 restored the tree to the lockfile, dropping the drift. **Verify versions against the lockfile, never against `node_modules`.** See AGENTS.md §9 and §10.

**Spec:** `docs/superpowers/specs/2026-10-01-demo-cart-checkout-design.md`

**Status:** ✅ **Tasks 1–9 implemented.** Verified end-to-end against a production build on 2026-10-02: browser suite **30/30** at 360/768/1440 px, all three negative controls (NC-A/B/C) pass, and the production database took **zero** writes. Full record with every deviation and bug found: `.superpowers/sdd/2026-10-01-demo-cart-checkout/progress.md`.

> ⚠️ **ONE ITEM STILL NEEDS A HUMAN:** a real click-through on Razorpay's own mock bank page. The checkout frame is cross-origin and runs invisible hCaptcha + Stripe Radar, so it is deliberately not automatable — the run proved the modal *opens* and that our server-side verification is correct, but not the payment itself. See Task 8 in the ledger.
>
> ⚠️ **Keys:** the Razorpay test secret was pasted into a chat transcript. **Rotate it before any go-live.**
>
> ⚠️ **Nothing here is committed.** Per Ruling 0, the public repo is deliberately left uncommitted.

---

## Global Constraints

- **Build discipline (AGENTS.md §9):** never run `npm run dev` and `npm run build` concurrently. Turbopack dev rewrites `.next` while the production build reads it → random `Cannot find module for page: X`. Machine has 7.3 GB RAM / ~1.8 GB free; `next.config.js` already sets `experimental.cpus: 1`. Builds take ~2–4 min.
- **Production database:** `.env` `MONGODB_URI` points at the live Atlas cluster and `next dev` reads it. `MONGODB_DB` is read by zero lines of code and there is no DB switch. Never write real documents from a local run — use `isIgnoredRequest()` from `lib/visitors.ts`.
- **RazorPay test mode only.** Keys must begin `rzp_test_`. `lib/demo/razorpay.ts` throws otherwise. No capture, no webhook, no fulfilment, no email.
- **Server-authoritative pricing.** The order route recomputes every total from `catalog.ts` by product id. A client-sent amount is never trusted — this is asserted by a negative-control test.
- **Repo-wide CRLF noise** inflates diffs (external drive). Use `git diff --ignore-all-space` for real numbers.
- **Brand:** teal `#006569` primary, `teal-*` tokens only. `green-*` / `emerald-*` are retired as the brand. WhatsApp green `#25D366` is preserved and untouched.
- **Every edit carries a `// CHANGE: 2026-10-01 — <reason>` comment.**
- **Mobile-first** — all new components verified at 360px minimum.
- **`npm update`, never `npm update --latest`.** Next 16 and TypeScript 7 are out of scope; `mongodb` must not be downgraded to 6.21.0.

---

## Phase 0 — Preconditions

- [ ] **Step 0.1:** Confirm approval of `docs/superpowers/specs/2026-10-01-demo-cart-checkout-design.md`.
- [ ] **Step 0.2:** Confirm the 107 dirty files are safe to checkpoint-commit, then:
  ```bash
  git add -A && git commit -m "chore: checkpoint pre-demo-cart working tree"
  ```
- [ ] **Step 0.3:** Confirm Node 24.21.0 and the `rzp_test_*` keys will be supplied (Tasks 1 and 6 are blocked until then).

---

### Task 1: Upgrade Node to 24.21.0 LTS

**Why:** Razorpay's official SDK requires Node ≥ 22.2; this machine runs Node 20.18.1 (`~/.local/node-v20.18.1`, PATH patched in both `~/.bashrc` and `~/.profile` per AGENTS.md §9). Node 24.21.0 is the current Active LTS ("Krypton") and ships npm 11.19.0. Node 26.10.0 is `lts: false` and is the wrong choice for a box that must build reliably.

**Files:**
- Modify: `~/.bashrc` — **replace** the `node-v20.18.1` PATH line
- Modify: `~/.profile` — **replace** the `node-v20.18.1` PATH line
- Modify: `AGENTS.md` §9 — correct the Node version facts
- Modify: `package.json` — `@types/node` to `^24`

- [ ] **Step 1.1:** Install Node 24.21.0 to `~/.local/node-v24.21.0`.
- [ ] **Step 1.2:** **Replace** (do not append) the `node-v20.18.1` PATH line in **both** `~/.bashrc` and `~/.profile`. AGENTS.md §9 records that `.bashrc` alone is not enough because it early-returns for non-interactive shells — appending would leave `bash -lc` on v20.
- [ ] **Step 1.3:** Verify in a **fresh login shell** (this is the decisive check, not the current shell):
  ```bash
  bash -lc 'node -v && npm -v'
  # expect v24.21.0 and 11.19.0
  ```
- [ ] **Step 1.4:** Keep `~/.local/node-v20.18.1` on disk. Reverting is one PATH line.
- [ ] **Step 1.5:** `npm install` — regenerates `package-lock.json` and rebuilds native/optional deps against the new runtime. **Most likely step to fail on memory**; free RAM and retry rather than skipping verification.
- [x] **Step 1.6:** ~~`npm update` — semver-compatible only. Expect `next` 15.5.26 → 15.5.27 and `shadcn` 4.21.0 → 4.21.1. **Verify `mongodb` stayed at 7.7.0**~~ — **NOT RUN (Ruling 2).** Patch bumps are irrelevant to a cart scaffold, and every one is a new way for the lockfile to drift. Step 1.5's `npm install` alone brought `node_modules` **back** to the lockfile (15.5.26 → 15.5.19, mongodb 7.7.0 → 7.4.0), which is the outcome this step was meant to protect against. Note the original expectation was also built on a false premise: `next` was never at 15.5.26 in the lockfile.
- [ ] **Step 1.7:** Set `@types/node` to `^24` in `package.json` to match the runtime.
- [ ] **Step 1.8:** Smoke test: `npm run typecheck` and `npm run test:sara-local`.
- [ ] **Step 1.9:** Correct AGENTS.md §9 — the Node version, the new install path, and the fact that installed Next is 15.5.x not 16.
- [ ] **Step 1.10:** Commit.

---

### Task 2: Install the official Razorpay SDK

**Why:** Owner decision — use the real, trusted, documented library rather than a mock. `razorpay@2.9.8` is MIT-licensed, maintained by Razorpay, 414k weekly downloads, published 2026-07-15, and its only dependency is `axios@^1.18.1`.

**Files:**
- Modify: `package.json` — `razorpay` dependency
- Modify: `package-lock.json`

- [ ] **Step 2.1:** `npm i razorpay@2.9.8`.
- [ ] **Step 2.2:** Pin the exact version (no `^`) so a Razorpay release cannot silently change behaviour mid-test.
- [ ] **Step 2.3:** Verify the SDK imports and instantiates under Node 24:
  ```bash
  node -e "const R=require('razorpay');const i=new R({key_id:'rzp_test_x',key_secret:'y'});console.log('sdk ok', typeof i.orders.create)"
  ```
- [ ] **Step 2.4:** Confirm `razorpay/dist/utils/razorpay-utils` exposes `validatePaymentVerification` — this is the SDK-provided alternative to hand-rolling the HMAC.
- [ ] **Step 2.5:** Commit.

---

### Task 3: Permanent `/demo` independence

**Why:** `/demo` is currently referenced by 5 live chatbot/Sara code paths plus the only pre-wired email destination. Flushing it without this fix means anyone clicking "Book a Demo" in the production chatbot lands on a shopping cart. This is the highest-risk task in the plan — it touches production conversation code.

**Files:**
- Delete: `app/(site)/demo/page.tsx`
- Modify: `app/api/chat/route.ts` (lines 74, 79, 93, 164)
- Modify: `lib/sara-topics.ts:155`
- Modify: `lib/form-destinations.ts:56`
- Modify: `app/robots.ts`
- New: `scripts/check-demo-independence.mjs`
- Modify: `package.json` — `check:demo` script

- [ ] **Step 3.1:** Delete `app/(site)/demo/page.tsx` (the 43-line homepage clone).
- [ ] **Step 3.2:** `app/api/chat/route.ts:74` — **rewrite the sentence, do not blind-replace.** It currently reads *"divert to `[[Get a Quote|/contact]]` or `[[Book a Demo|/demo]]`"*. A naive replace yields two identical `/contact` links. Rewrite so the pricing guidance still reads naturally with one destination.
- [ ] **Step 3.3:** `app/api/chat/route.ts:79` — change the example button to `/contact`.
- [ ] **Step 3.4:** `app/api/chat/route.ts:93` and `:164` — remove the `Book a Demo: /demo` entry from both site maps. `Contact: /contact` is already present, so no link is lost.
- [ ] **Step 3.5:** `lib/sara-topics.ts:155` — change **only** the link target to `[[Book a Demo|/contact]]`. **Keep the regex** `/demo|trial|free|try|test/` intact so "free", "try", "test" and "trial" still match and users still get a booking path.
- [ ] **Step 3.6:** `lib/form-destinations.ts:56` — **keep the `demo` key.** The stored `EMAIL_DESTINATION_RECIPIENTS.demo` recipient depends on it; removing the key orphans that database entry and silently stops demo-page email routing. Retitle to mark it test-only and keep `paths: ['/demo']`.
- [ ] **Step 3.7:** Write `scripts/check-demo-independence.mjs` — grep `app/`, `lib/`, `components/` for `/demo` outside `app/(site)/demo/` and `app/api/demo/`, exit non-zero on a hit, and allow an explicit allowlist with a required justification comment per entry.
- [ ] **Step 3.8:** Add `"check:demo": "node scripts/check-demo-independence.mjs"` to `package.json` and append it to `test:all`.
- [ ] **Step 3.9:** `app/robots.ts` — add `/demo` and `/demo/` to `disallow`. Today the route relies on metadata alone.
- [ ] **Step 3.10:** Verify:
  ```bash
  npm run check:demo                 # must exit 0
  npm run test:sara-local            # proves the repoint broke no matcher cases
  npm run typecheck
  ```
- [ ] **Step 3.11:** **Negative control** — add a temporary `/demo` reference to a production file, confirm `check:demo` fails, then remove it.
- [ ] **Step 3.12:** Commit.

---

### Task 4: Cart domain (pure, testable)

**Why:** Client-side totals are attacker-controlled. Separating the catalog and cart maths from React means the pricing rules are unit-testable with plain `node` and reusable by the server route without importing any client code.

**Files:**
- New: `lib/demo/catalog.ts`
- New: `lib/demo/cart.ts`
- New: `lib/demo/format.ts`
- New: `scripts/demo-cart-test.mjs`
- Modify: `package.json` — `test:demo`

- [ ] **Step 4.1:** `lib/demo/catalog.ts` — the server-authoritative product list: `id`, `name`, `description`, `image`, `pricePaise` (integer paise, never a float), `taxPct`. Prices must be realistic Tally-adjacent figures so the demo reads plausibly. No DB read — the catalog is a literal so the server route has a fixed, auditable price source.
- [ ] **Step 4.2:** `lib/demo/cart.ts` — pure functions, no React, no IO, no `process.env`:
  - `addItem(items, id, qty)` / `removeItem` / `setQty` — clamp `qty` to ≥ 1, drop unknown ids
  - `computeTotals(items)` — resolve each id against the catalog, drop any id not in the catalog, return `{ lines, subtotalPaise, taxPaise, totalPaise, itemCount }`
  - **All arithmetic in integer paise.** Never floats — `0.1 + 0.2` in rupees is a real class of payment bug.
- [ ] **Step 4.3:** `lib/demo/format.ts` — `formatINR(paise)` and `formatINRFromRupees`, using the existing `RupeeIcon`/`Intl.NumberFormat('en-IN')` conventions.
- [ ] **Step 4.4:** `scripts/demo-cart-test.mjs` — standalone, mirroring `scripts/sara-topics-test.mjs`. Cover:
  - empty cart → all totals 0
  - single item, single qty
  - quantity increments and decrements
  - qty clamped at 1 minimum
  - unknown product id is **dropped, not priced**
  - duplicate `addItem` of the same id increments rather than duplicating the row
  - tax computed on subtotal, totals sum exactly (no rounding drift)
  - a **regression assertion that `computeTotals` output for a client-supplied `{items, claimedTotal}` still yields the catalog-derived total** — the negative control for §Global Constraints
- [ ] **Step 4.5:** Add `"test:demo": "node scripts/demo-cart-test.mjs"` and insert it into `test:all`.
- [ ] **Step 4.6:** Verify `npm run test:demo` and `npm run typecheck`.
- [ ] **Step 4.7:** Commit.

---

### Task 5: Cart state + UI

**Why:** `localStorage` persistence matches the repo's existing pattern (`svd_consent_notice`, `svd_vid`) and keeps the demo dependency-free. `localStorage` must be read in `useEffect`, never during render — the ConsentBanner hydration bug (Thread B, 2026-09-30) is the precedent.

**Files:**
- New: `lib/demo/cart-store.tsx`
- New: `app/components/demo/DemoScopeBanner.tsx`
- New: `app/components/demo/ProductCard.tsx`
- New: `app/components/demo/CartLine.tsx`
- New: `app/components/demo/TotalsPanel.tsx`
- New: `app/components/demo/RazorpayButton.tsx`
- New: `app/(site)/demo/layout.tsx`
- New: `app/(site)/demo/page.tsx`
- New: `app/(site)/demo/checkout/page.tsx`
- New: `app/(site)/demo/checkout/success/page.tsx`
- New: `app/(site)/demo/checkout/cancel/page.tsx`

- [ ] **Step 5.1:** `lib/demo/cart-store.tsx` — React context + `useReducer`, `localStorage` key `svd_demo_cart`. Read the persisted cart in `useEffect`, **never during render**. Persist on every state change. Wrap the provider value in `useMemo`; memoize callbacks with `useCallback`; wrap `ProductCard`, `CartLine` and `TotalsPanel` in `React.memo` per the AGENTS.md performance conventions.
- [ ] **Step 5.2:** `DemoScopeBanner.tsx` — a prominent, honest test-mode notice: this is a test route, payments are Razorpay test mode, no real money moves. Must be visible at 360px.
- [ ] **Step 5.3:** `ProductCard.tsx` — image, name, description, price, and an **Add to cart** button with a real focus-visible ring and a `min-h-10` tap target.
- [ ] **Step 5.4:** `CartLine.tsx` — row with qty stepper and remove control.
- [ ] **Step 5.5:** `TotalsPanel.tsx` — subtotal, tax, total. Teal `#006569` for the total row.
- [ ] **Step 5.6:** `app/(site)/demo/layout.tsx` — renders `DemoScopeBanner` above `{children}`.
- [ ] **Step 5.7:** `app/(site)/demo/page.tsx` — grid of `ProductCard`s + a sticky cart summary with item count, running total, and a link to `/demo/checkout`. `robots: { index: false, follow: false }`.
- [ ] **Step 5.8:** `app/(site)/demo/checkout/page.tsx` — `CartLine` list, `TotalsPanel`, `RazorpayButton`, plus a real empty-cart state. `robots: { index: false, follow: false }`.
- [ ] **Step 5.9:** `success/page.tsx` and `cancel/page.tsx` — order id, amount, verified/failed badge, explicit test-mode wording, return-to-cart link. Both `noindex`.
- [ ] **Step 5.10:** Verify `npm run typecheck`; render each page at 360px.
- [ ] **Step 5.11:** Commit.

---

### Task 6: Razorpay gateway seam + API routes

**Why:** The gateway is isolated in one module so swapping it, or hardening it for real payments later, touches exactly one file. The live-key guard is what makes "test mode only" structural rather than a convention someone can forget.

**Files:**
- New: `lib/demo/razorpay.ts`
- New: `app/api/demo/order/route.ts`
- New: `app/api/demo/verify/route.ts`
- Modify: `.env.example`
- Modify: `.env` (gitignored — confirmed via `git check-ignore`)

- [ ] **Step 6.1:** `.env.example` — add the documented env shell (§6.5 of the spec): `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, each with a comment explaining the `rzp_test_` requirement and that the secret must never reach the browser.
- [ ] **Step 6.2:** `.env` — the same keys, empty values, ready for the owner to paste real test keys into later.
- [ ] **Step 6.3:** `lib/demo/razorpay.ts`:
  - `assertTestKeys()` — **throw** unless `RAZORPAY_KEY_ID.startsWith('rzp_test_')`. Log neither key nor secret.
  - `createOrder({ amountPaise, receipt, notes })` — SDK call, `currency: 'INR'`, amount in paise, `receipt` ≤ 40 chars.
  - `verifySignature({ orderId, paymentId, signature })` — HMAC-SHA256 over `` `${orderId}|${paymentId}` `` keyed by the secret, compared with `crypto.timingSafeEqual`. Prefer the SDK's `validatePaymentVerification` where it fits.
  - Lazy singleton — never instantiate at module scope, so importing this file without keys does not throw during build.
- [ ] **Step 6.4:** `app/api/demo/order/route.ts` — `POST { items: [{ id, qty }] }`:
  - Sanitize and validate input
  - **Reprice server-side from `catalog.ts`** — never read an amount from the body
  - Rate-limit using the pattern from `app/api/email/submit/route.ts`
  - Create the Razorpay order
  - Write to the new **`demo_orders`** collection, but only when `isIgnoredRequest(request)` is false — **and create the Razorpay order either way**, so local runs get a genuine end-to-end checkout with zero production writes
  - Never call `sendEmailDirect`, `markConversion`, or `lookupGeo`
- [ ] **Step 6.5:** `app/api/demo/verify/route.ts` — `POST { razorpay_order_id, razorpay_payment_id, razorpay_signature }`:
  - Look the order up by `razorpay_order_id` **from the database, never from the client body** (Razorpay go-live checklist)
  - Verify the signature with a timing-safe compare
  - Store `razorpay_payment_id` for idempotency
  - Return a minimal result — **no card data, no secrets, in any log line**
- [ ] **Step 6.6:** `RazorpayButton.tsx` — `POST /api/demo/order`, then inject
  `<script src="https://checkout.razorpay.com/v1/checkout.js">` (**never self-hosted**), then
  `new Razorpay(options).open()` with `theme.color: '#006569'` to match the brand.
  - Open **only on user action**, never on page load
  - `order_id` from the server response — **never fabricate it**
  - `amount` must match the server order **exactly**
  - `handler(response)` → POST all three fields to `/api/demo/verify`
  - **A new Order per attempt** — do not cache or reuse an `order_id` after a failure
  - `prefill` name/email/contact from the checkout form
  - Surface `payment.failed` in the UI rather than swallowing it
- [ ] **Step 6.7:** Verify `npm run typecheck` and `npm run test:demo`.
- [ ] **Step 6.8:** Commit.

---

### Task 7: CSP for Razorpay

**Why:** Without this the checkout fails silently. `checkout.js` loads `cdn.razorpay.com/static/cx/razorpay-risk-detection/bundle.js` at popup time, so allowing only `checkout.razorpay.com` leaves the popup working but degrades fraud signals — confirmed by two independent real-world reports.

**Files:**
- Modify: `next.config.js` (the `csp` array, lines 3–14)

- [ ] **Step 7.1:** Add `https://*.razorpay.com` to `script-src`, `frame-src` and `connect-src`. Wildcard, not the single host.
- [ ] **Step 7.2:** Add a `// CHANGE: 2026-10-01 — <reason>` comment above each addition explaining the `cdn.razorpay.com` risk-detection dependency and that the rule is site-wide because Next **merges** header rules rather than replacing them, so a `/demo/:path*`-scoped header cannot remove a global directive.
- [ ] **Step 7.3:** Confirm the change is **purely additive** — no existing directive removed or narrowed. Run `git diff next.config.js` and read it.
- [ ] **Step 7.4:** Verify `npm run build` **alone** (AGENTS.md §9), then confirm the emitted header contains the three additions.
- [ ] **Step 7.5:** Flag for verification, not blind change: `Cross-Origin-Opener-Policy: same-origin` (line 106). Test a real checkout first; escalate to `same-origin-allow-popups` **only if** the modal misbehaves.
- [ ] **Step 7.6:** Commit.

---

### Task 8: End-to-end verification

**Why:** The CSP and the live-key guard are both invisible failure modes — the modal either opens or it does not. Only a real browser run proves them.

**Files:** none (verification only)

- [ ] **Step 8.1:** Full gate run: `npm run typecheck` → `npm run test:sara-local` → `npm run test:demo` → `npm run check:demo`.
- [ ] **Step 8.2:** `npm run build` **alone**, no `next dev` running.
- [ ] **Step 8.3:** Puppeteer at **360 / 768 / 1440** px: add to cart → cart badge updates → totals correct → navigate to `/demo/checkout` → click Pay → **the Razorpay modal opens with zero CSP violations in the console**.
- [ ] **Step 8.4:** Complete payment with test card `4111 1111 1111 1111` → land on `/demo/checkout/success` → assert the signature verified.
- [ ] **Step 8.5:** **Negative control A** — POST a tampered amount to `/api/demo/order`; assert the server returns the catalog-derived total and ignores the client value.
- [ ] **Step 8.6:** **Negative control B** — POST a forged `razorpay_signature` to `/api/demo/verify`; assert rejection.
- [ ] **Step 8.7:** **Negative control C** — set a non-`rzp_test_` key; assert `lib/demo/razorpay.ts` throws and the route 500s rather than calling Razorpay.
- [ ] **Step 8.8:** Confirm `demo_orders` gained **zero** documents from the local run (the Thread-A `isIgnoredRequest()` gate).
- [ ] **Step 8.9:** Confirm no email was sent (`email_queue` ledger unchanged).
- [ ] **Step 8.10:** Confirm no hydration mismatch in the browser console (the Thread B class of bug).
- [ ] **Step 8.11:** Record the CSP violation count explicitly in the daily log — a silently degraded risk-detection script is the failure mode to watch for.

---

### Task 9: Documentation

**Why:** AGENTS.md requires every change to be traceable via daily logs and the Excel tracker, with `// CHANGE:` comments in the code.

**Files:**
- Modify: `AGENTS.md` — §9 Node facts, new section for the demo scaffold, `Last Updated` bump
- Modify: `daily logs/2026-10-01.md` — Thread E
- Modify: `daily logs/excel logs.csv` — row `(15)`, `01-10-26`

- [ ] **Step 9.1:** AGENTS.md — document the demo scaffold, the `/demo` independence guard and how to re-run it, the Razorpay test-mode constraint, and the env vars. Update §9 with the Node 24 facts. Bump `Last Updated`.
- [ ] **Step 9.2:** `daily logs/2026-10-01.md` — add **Thread E** covering: the six blocking issues, the RazorPay SDK + Node-version research, the `npm update` vs `--latest` distinction and the `mongodb` downgrade trap, the CSP requirement, and the full verification results from Task 8. Add the new files to the Traceability table.
- [ ] **Step 9.3:** `daily logs/excel logs.csv` — append row `(15)`, date `01-10-26`.
- [ ] **Step 9.4:** **Validate the CSV after appending.** Thread C of this very log records that this file was silently corrupt for three months because appends were never parsed. Required invariants: BOM preserved, CRLF line endings with **zero bare LF**, exactly 2 fields per row, `DD-MM-YY` dates, internal quotes escaped as double-double quotes, and **no trailing newline on the final line**. Abort without writing if any check fails. Write a **standalone** script, not an inline heredoc — the log records that an inline parser reported a contradictory row count because of a typo in the heredoc, not because the file was wrong.
- [ ] **Step 9.5:** Commit.

---

## Rollback

| Layer | Action |
| :-- | :-- |
| Node | Restore the single `node-v20.18.1` PATH line in `~/.bashrc` and `~/.profile`; the directory is still on disk |
| Packages | `git revert` the Task 1–2 commit, then `npm ci` |
| `/demo` independence | `git revert` the Task 3 commit — restores the chatbot refs |
| CSP | Remove the three `https://*.razorpay.com` additions |
| Feature | Delete `app/(site)/demo`, `app/api/demo`, `lib/demo`, `app/components/demo`, and the two new scripts |

## Out of scope

Next.js 16 · TypeScript 7 · `mongodb` downgrade · real capture / webhooks / refunds / fulfilment ·
inventory, coupons, shipping · any production product page or pricing change · `cpanel-landing/`
(still deleted — pre-existing state recorded 2026-08-27).
