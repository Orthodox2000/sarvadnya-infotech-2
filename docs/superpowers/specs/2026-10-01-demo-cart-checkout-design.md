# `/demo` Cart + Razorpay Test Checkout — Design Spec

**Date:** 2026-10-01
**Status:** DESIGN ONLY — no code written. Awaiting owner approval to execute.
**Owner decisions captured:** see §2.

---

## 1. Goal

Replace the `/demo` homepage clone with an **isolated cart-based feature scaffold** for testing a
payment flow end to end in Razorpay **test mode**:

- Products rendered as item cards on `/demo`
- Each card adds to a cart
- The cart rolls up into a final total
- `/demo/checkout` shows line items + total and a clean "Pay" button
- The Pay button opens Razorpay Checkout, which redirects through a test payment
- **Test mode only.** No live server, no real money, no production fulfilment.

Secondary goal: make `/demo` a route the **live site can never depend on again**, so test code can
change freely without endangering production UX.

---

## 2. Owner decisions (2026-10-01)

| # | Decision |
| :-- | :-- |
| 1 | `/demo` is a **testing route with no real dependence**. Remake it, and put a **permanent** guard in place so the actual site never redirects/links to it. |
| 2 | Use **real Razorpay test keys**, not a mock. Create env shells. Use trusted, documented libraries. |
| 3 | Demo pages stay **inside `app/(site)/demo/`** — full site chrome (navbar, productbar, support button). |
| 4 | **Upgrade Node globally** and update packages, then verify the Razorpay integration. |
| 5 | **Checkpoint-commit** the 107 dirty working-tree files before starting. |
| 6 | Node 24 and the Razorpay keys will be added **later** — the plan is documented now, execution deferred. |

---

## 3. ⛔ Blocking issues found during investigation

### 3.1 `/demo` is not empty — it is a live, referenced clone of the homepage

`app/(site)/demo/page.tsx` (43 lines) is an exact homepage clone — `HomeHero` +
`CertifiedPartners` + `CustomerReviews` + `FAQ` + `Footer` — created 2026-08-25 for design review
and A/B comparison. Four live code paths reference it:

| File:line | Reference | Consequence |
| :-- | :-- | :-- |
| `app/api/chat/route.ts:74` | `[[Book a Demo\|/demo]]` | Chatbot sends users here |
| `app/api/chat/route.ts:79` | `[[Book a Demo\|/demo]]` | Chatbot example button |
| `app/api/chat/route.ts:93` | `Book a Demo: /demo` in site map | Chatbot nav map |
| `app/api/chat/route.ts:164` | `Book a Demo: /demo` in site map | Learn-Sara prompt nav map |
| `lib/sara-topics.ts:155` | `/demo\|trial\|free\|try\|test/` → `[[Book a Demo\|/demo]]` | **Very broad regex** — "free", "try", "test", "trial" all route here |
| `lib/form-destinations.ts:56` | `{ key: 'demo', paths: ['/demo'] }` | The **only** pre-wired email destination (`EMAIL_DESTINATION_RECIPIENTS`) |

Flushing it without a fix means anyone clicking "Book a Demo" in the live chatbot lands on a
shopping cart. This is the central problem the design must solve.

**Coupling verified as complete:** `scripts/sara-topics-test.mjs` contains **no** `/demo`
assertions (so repointing breaks no tests), and `scripts/generate_soft_copy.mjs:15` only lists
`/demo` as a path string.

### 3.2 Razorpay is blocked by the current Content-Security-Policy

`next.config.js:3-14` applies CSP globally via `source: '/(.*)'`:

| Directive | Current | Razorpay needs | Effect today |
| :-- | :-- | :-- | :-- |
| `script-src` | no `*.razorpay.com` | `https://checkout.razorpay.com` **and** `https://cdn.razorpay.com` | `checkout.js` blocked — checkout silently fails |
| `connect-src` | no `*.razorpay.com` | `https://api.razorpay.com` | Order API calls blocked |
| `frame-src` | only `google.com` + `salesiq.zohopublic.in` | `https://*.razorpay.com` | Checkout iframe blocked |

`checkout.js` loads `cdn.razorpay.com/static/cx/razorpay-risk-detection/bundle.js` at popup time.
Two independent real-world reports confirm that allowing only `checkout.razorpay.com` leaves the
popup working but silently degrades fraud signals (a Razorpay Magento issue, and a Next.js
repository commit broadening the rule to `*.razorpay.com`). **Wildcard `https://*.razorpay.com` is
required, not the single host.**

Also flagged: `Cross-Origin-Opener-Policy: same-origin` (`next.config.js:106`) must be verified
against a live checkout and escalated to `same-origin-allow-popups` **only if** the modal misbehaves.

**Site-wide by necessity:** Next merges header rules rather than replacing them, so a
`/demo/:path*`-scoped header cannot *remove* a global directive. The addition is unavoidably global.
It is purely additive — no existing directive is removed or narrowed.

### 3.3 Razorpay's official SDK requires Node ≥ 22.2; this machine runs Node 20.18.1

From Razorpay's official prerequisites page: *"You must use Node.js v22.2 or higher."*

| Fact | Verified |
| :-- | :-- |
| Official SDK is `razorpay@2.9.8` — MIT, `razorpay/razorpay-node`, 414k weekly downloads, published 2026-07-15 | ✅ |
| Only dependency is `axios@^1.18.1` | ✅ |
| The package declares **no `engines` field**, so `npm i razorpay` succeeds silently on Node 20 | ✅ |
| It is nonetheless **officially unsupported** on Node 20 | ✅ |
| This project declares **no `engines`**, so Vercel picks its own Node — **deployment is unaffected**; only local `next dev` runs Node 20 | ✅ |
| AGENTS.md §9 records that installing Node here was already a painful ritual — system `node` was snap v10.24.1, so Node 20.18.1 was installed to `~/.local/node-v20.18.1` and PATH was patched in **both** `~/.bashrc` and `~/.profile` | ✅ |

### 3.4 Client-supplied totals are attacker-controlled

The order-creation route must recompute the total from a **server-side** catalog keyed by product
id, and must never accept a client-sent amount. Razorpay's own go-live checklist repeats this. This
is locked into the design now so the test scaffold does not teach the wrong pattern.

### 3.5 Local runs write to the PRODUCTION MongoDB

Per AGENTS.md and Thread A of the 2026-10-01 log, `.env` `MONGODB_URI` points at the live Atlas
cluster and `next dev` reads it. `MONGODB_DB` is read by zero lines of code, there is no
`NODE_ENV` guard, and no DB switch exists. Cart/order persistence therefore lands in production
unless explicitly handled.

### 3.6 `app/demo/` and `app/(site)/demo/` would collide

Both resolve to `/demo`, which is a hard Next.js build error. "Isolated page" and "flush current
structure" are therefore the same action, not two.

### 3.7 SEO

`/demo` is currently `robots: { index: false, follow: false }` and was removed from
`app/sitemap.ts:9` on 2026-09-07. It is **not** in `app/robots.ts` disallow, so metadata is the only
protection. New `/demo/checkout/*` routes need the same treatment.

---

## 4. Non-blocking observations

| # | Observation |
| :-- | :-- |
| N1 | **107 files modified, 0 untracked.** New work on an uncommitted tree makes rollback and review hard. |
| N2 | **`.env` has a malformed line** — a bare `'gsk_d0K1Zg13abC…'` with no `=`, plus duplicated `GEMINI_API_KEY`/`GROQ_API_KEY` entries. dotenv ignores invalid lines so nothing breaks today, but it is a stray credential-shaped string. Unrelated to this work — flagged, not fixed. |
| N3 | `.env.example` is the documented env contract (AGENTS.md); new vars go there with matching comment style. |
| N4 | AGENTS.md claims Next 16 / React 19; **the lockfile pins Next 15.5.19**. Only relevant if a package bump is attempted. **Corrected 2026-10-02:** this row originally said *"installed is 15.5.26"*, which was read off a drifted `node_modules` tree. `package-lock.json` — which is what Vercel installs from — pins **15.5.19**, and `daily logs/2026-09-18.md` records the owner choosing to keep it. See §10's `proxy.ts` warning: a Next 16 upgrade would activate a dormant admin guard in the public frontend. |
| N5 | `tsconfig.json` has `strict: false`, `moduleResolution: bundler`. New code should still be written typed. |
| N6 | Brand rule: `teal-*` tokens only. `green-*` / `emerald-*` are retired as the brand. WhatsApp green `#25D366` untouched. |
| N7 | Vercel `maxDuration` — the order route is a plain Node serverless function. The Hobby 2-cron limit is irrelevant here (no cron, no email). |
| N8 | Machine has 7.3 GB RAM with ~1.8 GB free. `next.config.js` already sets `experimental.cpus: 1`. `npm install` against a new Node is the most likely step to fail on memory. |

---

## 5. Toolchain decisions

### 5.1 Node target: **v24.21.0 (LTS "Krypton")**

| Release | Version | Status |
| :-- | :-- | :-- |
| Latest current | v26.10.0 (2026-09-21) | `lts: false` — **not** LTS |
| **Latest LTS** | **v24.21.0** (2026-09-07), npm 11.19.0 | **Krypton — target** |
| Maintenance LTS | v22.23.3 (2026-09-23) | Jod |

Node 24.21.0 satisfies Razorpay's ≥ 22.2 requirement, is the Active LTS line, and ships npm
11.19.0. Node 26 is "Current", not LTS — the wrong choice for a box that must run `next dev` and
`next build` reliably.

### 5.2 Package updates: `npm update`, **never** `npm update --latest`

`npm outdated` as of 2026-10-01:

| Package | Current *(per `node_modules`)* | **Actual, per `package-lock.json`** | `npm update` → Wanted | `--latest` → Latest | Verdict |
| :-- | :-- | :-- | :-- | :-- | :-- |
| `next` | ~~15.5.26~~ *(drift)* | **15.5.19** | 15.5.27 | **16.3.8** | Major 15→16 — out of scope. **And note §10's `proxy.ts` trap: upgrading would activate a dormant admin guard in the public frontend.** |
| `typescript` | 5.9.3 | 5.9.3 | 5.9.3 | **7.0.2** | Major ×2 (Go rewrite) — out of scope |
| `mongodb` | ~~7.7.0~~ *(drift)* | **7.4.0** | 7.4.0 | **6.21.0** | ⚠️ "Latest" is *older* — would **downgrade**. Stays 7.4.0 |
| `@types/node` | 20.19.43 | **24.19.1** *(raised by Task 1.7)* | 24.19.1 | 26.6.3 | Pinned to `^24` to match the runtime — done |
| `react` / `react-dom` | 19.2.4 | 19.2.4 | 19.2.4 | 19.3.0 | Minor — safe |
| `dotenv` | 17.4.2 | 17.4.2 | 17.4.2 | 18.0.5 | Minor — safe |

> **Correction (2026-10-02, after Task 1).** The "Current" column was read from a `node_modules` tree that had drifted **ahead of** the lockfile. `npm install` under Node 24 restored it to the lockfile, so `next` fell 15.5.26 → **15.5.19** and `mongodb` 7.7.0 → **7.4.0**. Neither value was ever pinned by the repo — `daily logs/2026-09-18.md` had already recorded 15.5.19 and the owner's decision to keep it. **The lockfile is authoritative; `node_modules` is not.** Note this also means the *"stay at 7.7.0"* verdict was guarding a version the project never had.
| `shadcn` | 4.21.0 | 4.21.1 | 4.21.1 | Patch — safe |

**`npm update` applies only semver-compatible bumps** — `next` patch and `shadcn` patch. That is
safe and satisfies "update packages". **`--latest` would jump Next to 16.3.8 and TypeScript to 7.0.2
across 100+ files on a 1.8 GB-free machine, and would actively downgrade `mongodb`.** Next 16 and
TypeScript 7 are explicitly out of scope for this change.

### 5.3 Razorpay library: official SDK `razorpay@2.9.8`

Verified against Razorpay's own documentation:

- **Order creation:** `POST https://api.razorpay.com/v1/orders`, HTTP Basic auth
  (`key_id:key_secret`), body `{ amount, currency, receipt, notes }`. Amount in **paise**
  (`50000` = ₹500). `receipt` max 40 chars.
- **Amount must match exactly** between the Orders API and the checkout options, in paise.
- **One Order per payment attempt.** An `order_id` maps 1:1 to a payment attempt; reusing it after a
  failed payment errors. Never cache or reuse an `order_id`.
- **Checkout:** `<script src="https://checkout.razorpay.com/v1/checkout.js">` — **never self-host**,
  always the Razorpay CDN. Open the modal **only on a user action**, never on page load.
- **Handler vs callback:** SPAs (this project) use the JS `handler` function, which receives
  `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`. All three go to the server.
- **Signature verification:** HMAC-SHA256 over `{order_id}|{payment_id}` keyed by `key_secret`,
  compared with `crypto.timingSafeEqual`. The SDK ships
  `validatePaymentVerification({ order_id, payment_id }, signature, secret)` as a helper.
- **Webhook** is the production-grade confirmation path, but it needs a public HTTPS URL — not
  available while not deployed. **The demo therefore relies on client-side verification only and is
  explicitly NOT production-grade order confirmation.**
- **Test mode:** keys must begin `rzp_test_`. Test card `4111 1111 1111 1111`.
- Go-live checklist items adopted by design: server-side signature verification, `order_id` sourced
  from the server DB not the client callback, fulfilment only after verification passes,
  timing-safe comparison, `razorpay_payment_id` stored for idempotency, secret never exposed to the
  frontend or logged.

---

## 6. Architecture

### 6.1 File layout

```
app/(site)/demo/
  layout.tsx                    TEST-MODE banner + scope notice
  page.tsx                      /demo                 product grid + item cards
  checkout/
    page.tsx                    /demo/checkout        line items + totals + Pay
    success/page.tsx            /demo/checkout/success
    cancel/page.tsx             /demo/checkout/cancel

app/api/demo/
  order/route.ts                POST  reprice → Razorpay order
  verify/route.ts               POST  HMAC signature verification

app/components/demo/
  DemoScopeBanner.tsx           test-mode notice
  ProductCard.tsx               item card + Add to cart
  CartLine.tsx                  one cart row, qty stepper
  TotalsPanel.tsx               subtotal / tax / total
  RazorpayButton.tsx            loads checkout.js, opens the modal

lib/demo/
  catalog.ts                    SERVER-AUTHORITATIVE products (id → pricePaise)
  cart.ts                       pure cart maths — no React, no IO, unit-testable
  cart-store.tsx                client provider + localStorage persistence
  razorpay.ts                   the single gateway seam (SDK lives here)
  format.ts                     ₹ / paise formatting

scripts/
  demo-cart-test.mjs            cart maths + repricing tests
  check-demo-independence.mjs   PERMANENT guard: fail if production code links /demo
```

`lib/demo/catalog.ts` and `lib/demo/cart.ts` are deliberately framework-free so plain `node` can
exercise them — the same pattern as the existing `scripts/sara-topics-test.mjs`.

### 6.2 Data flow

```
/demo  (ProductCard)
  └─ cart-store.tsx  ──localStorage──>  { id, qty }[]
       │
/demo/checkout
  └─ renders CartLine + TotalsPanel from cart.ts  (display maths only)
       │  Pay clicked
       ▼
POST /api/demo/order  { items: [{ id, qty }] }
  └─ lib/demo/razorpay.ts  ── server-side reprice from catalog.ts ──> ignore client amount
  └─ Razorpay SDK → POST https://api.razorpay.com/v1/orders
  └─ writes `demo_orders` (gated by isIgnoredRequest)
  └─ returns { orderId, amountPaise, currency, keyId }
       ▼
RazorpayButton → load checkout.razorpay.com/v1/checkout.js → new Razorpay(options).open()
  └─ handler(response) → POST /api/demo/verify { order_id, payment_id, signature }
       └─ HMAC-SHA256 + timingSafeEqual → /demo/checkout/success
```

### 6.3 Permanent `/demo` independence

This is the part that makes the fix durable rather than a one-time cleanup.

1. Delete `app/(site)/demo/page.tsx` (the homepage clone).
2. Repoint every chatbot/Sara reference to `/contact`:
   - `app/api/chat/route.ts:74` — **rewrite the sentence**; it currently links `/contact` *and*
     `/demo`, so a naive replace would produce two identical links.
   - `app/api/chat/route.ts:79` — the example button.
   - `app/api/chat/route.ts:93` and `:164` — drop the `Book a Demo: /demo` site-map entry entirely
     (`Contact: /contact` is already listed).
   - `lib/sara-topics.ts:155` — keep the regex so "demo / free / try / test / trial" still matches;
     change only the link target to `/contact`.
3. `lib/form-destinations.ts:56` — **keep the `demo` key.** The stored
   `EMAIL_DESTINATION_RECIPIENTS.demo` recipient depends on it; deleting the key would orphan that
   database entry. Retitle it to mark the page test-only, and keep `paths: ['/demo']` so any form on
   the test page still routes somewhere sane.
4. **The enforcement:** `scripts/check-demo-independence.mjs` greps `app/`, `lib/` and `components/`
   for `/demo` outside the demo folders and exits non-zero on a hit. Wired as `npm run check:demo`
   and into `npm run test:all`. Without this, any future edit can silently re-couple production to
   the test route.
5. `app/robots.ts` — add `/demo` and `/demo/` to `disallow`, so the route is blocked even if
   metadata is later changed.
6. All three new pages carry `robots: { index: false, follow: false }`.

### 6.4 Testing-mode guarantees

These are **structural**, not conventions:

| Guarantee | Mechanism |
| :-- | :-- |
| Live keys cannot work | `lib/demo/razorpay.ts` **throws** unless `RAZORPAY_KEY_ID` starts with `rzp_test_` |
| No production money | Razorpay test mode only; no capture call |
| No production fulfilment | No webhook, no order-fulfilment code, no email |
| No prod DB pollution | `demo_orders` is a new isolated collection; the Mongo write is gated by `isIgnoredRequest()` (Thread-A convention) |
| …but still a real end-to-end test | When the IP is ignored, the **Razorpay test order is still created** — test mode never moves money — so you get a genuine checkout run with zero prod writes |
| Not indexed | `robots.ts` disallow + `noindex` metadata on all three pages |
| Visible to humans | `DemoScopeBanner` states plainly that this is a test route |

### 6.5 Env shell

Added to both `.env.example` (documented contract) and `.env` (gitignored, verified via
`git check-ignore`):

```
# ── Razorpay (TEST MODE ONLY — /demo checkout scaffold) ─────────────
# Generate test keys: Razorpay Dashboard > Settings > API Keys > Generate Test Key
# Keys MUST start with rzp_test_. The order route HARD-BLOCKS any non-test key.
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# Public key id only — safe in the browser bundle. NEVER the secret.
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

`DEMO_PAYMENT_MODE` (`mock` | `razorpay`) keeps the flow usable before the keys arrive; it defaults
to `razorpay` once `RAZORPAY_KEY_ID` is present. The live-key guard applies in both modes.

---

## 7. UI

| Page | Contents |
| :-- | :-- |
| `/demo` | Scope banner, product grid of `ProductCard`s, sticky cart summary with item count and running total, link to `/demo/checkout` |
| `/demo/checkout` | `CartLine` list with qty steppers, `TotalsPanel` (subtotal / tax / total), `RazorpayButton`, empty-cart state |
| `/demo/checkout/success` | Order id, amount, verified/failed badge, explicit "test mode" wording |
| `/demo/checkout/cancel` | Cancellation state with a return-to-cart link |

Constraints: teal `#006569` primary and `teal-*` tokens only; Razorpay checkout `theme.color`
`#006569` to match the brand; mobile-first verified to 360px; keyboard-accessible focus states per
AGENTS.md; `React.memo` + `useCallback` on cart rows to match the repo's performance conventions.

---

## 8. Verification plan

| Gate | Command / method |
| :-- | :-- |
| Types | `npm run typecheck` |
| Cart logic | `npm run test:demo` — pure maths + repricing, no browser |
| Sara regression | `npm run test:sara-local` — proves the `/demo` → `/contact` repoint broke nothing |
| Independence guard | `npm run check:demo` must exit 0 |
| Build | `npm run build` — **alone**, never alongside `next dev` (AGENTS.md §9) |
| Browser | Puppeteer at 360 / 768 / 1440: add → cart → totals → checkout → modal opens with **zero CSP violations** → test card `4111 1111 1111 1111` → success page |
| Negative control | Tampered client amount is rejected; the server total wins |

---

## 9. Files to be changed

| File | Change |
| :-- | :-- |
| `app/(site)/demo/page.tsx` | **DELETE** (homepage clone) |
| `app/(site)/demo/layout.tsx` | NEW — scope banner |
| `app/(site)/demo/checkout/{page,success/page,cancel/page}.tsx` | NEW |
| `app/api/demo/order/route.ts` | NEW |
| `app/api/demo/verify/route.ts` | NEW |
| `lib/demo/{catalog,cart,razorpay,format}.ts` | NEW |
| `lib/demo/cart-store.tsx` | NEW |
| `app/components/demo/*.tsx` | NEW (5 components) |
| `scripts/demo-cart-test.mjs` | NEW |
| `scripts/check-demo-independence.mjs` | NEW — the permanent guard |
| `app/api/chat/route.ts` | 4 × `/demo` → `/contact` (one sentence rewritten) |
| `lib/sara-topics.ts` | L155 link target → `/contact` |
| `lib/form-destinations.ts` | L56 retitle, key preserved |
| `next.config.js` | CSP `script-src` / `frame-src` / `connect-src` += `https://*.razorpay.com` |
| `app/robots.ts` | disallow `/demo`, `/demo/` |
| `.env.example` / `.env` | 3 Razorpay vars, documented / empty |
| `package.json` | `razorpay` dep; `test:demo`, `check:demo` scripts; `test:all` chain |
| `package-lock.json` | regenerated by `npm install` |
| `AGENTS.md` | §9 Node correction, new section for the demo scaffold, `Last Updated` bump |
| `daily logs/2026-10-01.md` | Thread E |
| `daily logs/excel logs.csv` | row `(15)`, `01-10-26` |

---

## 10. Risks and rollback

| Risk | Mitigation |
| :-- | :-- |
| Node swap breaks `next` / `tsc` | Verify in a **fresh `bash -lc`** (the `.bashrc` early-return trap from AGENTS.md). Keep the Node 20 directory on disk — reverting is one PATH line |
| `npm update` surprises us | Semver-only, no `--latest`. Commit immediately after; revert is one command |
| `npm install` OOM at 1.8 GB free | Most likely failure point. Free memory and retry — do not skip verification |
| Razorpay test keys absent | `DEMO_PAYMENT_MODE=mock` keeps the whole flow working; the live-key guard blocks live keys in both modes |
| Prod DB pollution | New `demo_orders` collection + `isIgnoredRequest()` gate |
| CSP change breaks something else | Purely additive; no existing directive removed or narrowed |
| Repo-wide CRLF noise inflates diffs | Use `git diff --ignore-all-space` (already noted in the 2026-10-01 log) |

**Rollback:** Node = restore one PATH line. Packages = revert commit. Feature = delete
`app/(site)/demo`, `app/api/demo`, `lib/demo`, revert the CSP lines, revert the chatbot refs.

---

## 11. Out of scope

- Next.js 16, TypeScript 7, `mongodb` downgrade
- Real payment capture, webhooks, refunds, order fulfilment, invoicing
- Stock/inventory, coupons, shipping, tax slab logic beyond a flat demo rate
- Any change to the production product pages or their pricing sections
- `cpanel-landing/` (still deleted — a pre-existing unexplained state, recorded 2026-08-27)
