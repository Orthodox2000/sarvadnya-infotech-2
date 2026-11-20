# 24. 2026-10-17 (third session) — Razorpay go-LIVE (mode-aware, fail-closed) + cart webhook + nested admin visitor rework

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

**Owner:** *"also update razorpay keys to live keys so ensure no nonsense remain and all routes are protected and secure from attacks"*, then *"ensure to tell them not to close browser or tab while waiting payment and add webhook, tell me in details what it needs to be added."*

Scope rulings given up-front: (1) enforce live with an **explicit `RAZORPAY_MODE=live`**, **fail-closed**; (2) **keep `/demo`** but hard-lock it to test-only; (3) **add the webhook** and also warn shoppers not to close the tab; (4) the security review covers the **cart/checkout routes only**.

#### A. Razorpay go-live — cart seam is now MODE-AWARE (the whole point)

The old cart seam (`lib/cart/payment.ts`) had a single hard-coded posture: `assertTestKeys()` + `isTestModeConfigured()`, i.e. it *only* ever worked in test mode. That is "the nonsense" the owner asked to remove. It now reads a mode:

| Fact | Detail |
| :--- | :--- |
| **`RAZORPAY_MODE` is fail-closed by construction** | `getMode()` returns `test` unless the value trims+lowercases to exactly `live`; missing, blank, or misspelled (`lve`, `Live `) → **test**. A deploy that forgets the var can never accidentally charge real money. |
| **`assertKeys()` — the key must MATCH the mode** | Replaces `assertTestKeys()`. Live mode requires `RAZORPAY_KEY_ID` to start `rzp_live_`; test mode requires `rzp_test_`. A prefix mismatch throws → the route returns **HTTP 503 before any other work**. Proven end-to-end: a `RAZORPAY_MODE=test` server holding live keys answers `/api/cart/order` **503** (E2E Server B). The test is a **prefix** test, never a substring test. |
| **`isTestModeConfigured()` → `isGatewayConfigured()`** | Same shape, mode-neutral name (it means "keys present and matching the mode"). |
| **`verifyWebhookSignature(rawBody, signature)`** | New. HMAC-SHA256 over the **raw** request body keyed by `RAZORPAY_WEBHOOK_SECRET`, compared with `crypto.timingSafeEqual`. Returns **false** when the secret is unset (so the webhook rejects everything until the owner configures it — see §24C). Accepts either hex casing. |
| **`/api/cart/order`** | `assertKeys()` is the **first** statement (before parse/validation/limiter), `notes: { source:'cart', mode:getMode(), cartItems }`, and it **persists + returns `testMode: !isLiveMode()`** instead of a hardcoded `true`. |
| **`/api/cart/verify`** | Reports `testMode: !isLiveMode()`. The HMAC-on-return verification is unchanged (still `timingSafeEqual`, amount from the stored order — §11/§12 posture kept). |
| **Checkout UI** | `app/(site)/checkout/page.tsx` is now `export const dynamic = 'force-dynamic'` (the mode is read per-request, so the page can never be cached with a stale banner) and passes `testMode = !isLiveMode()` down. `CheckoutContents.tsx` takes `testMode` as a **required** prop; the amber "Test mode — no real money moves" banner renders **`{testMode && …}`**, so a live checkout never falsely reassures a buyer. |
| **`/demo` stays test-only, on purpose** | `lib/demo/razorpay.ts` keeps its unconditional `assertTestKeys()` (still a prefix test) and `app/api/demo/order/route.ts` unchanged — the demo scaffold can never touch live keys regardless of `RAZORPAY_MODE`. **The mode switch is confined to the real cart seam.** (`/demo` is also git-tracked — see the §11 correction below.) |

#### B. "Don't close the tab" notice (owner ask)

A persistent amber notice renders under the Pay button on `/checkout` whenever a cart exists: *"Please keep this tab open until your payment is confirmed…"*. It is **always** shown (test AND live) because the client-return confirmation is the primary path in both — the webhook (§24C) is the backstop, not a replacement. Verified visible with a seeded cart at both modes via Puppeteer.

#### C. Cart webhook — `app/api/cart/webhook/route.ts` (NEW)

Server-to-server backstop for the case the owner named: the browser never returns (tab closed / phone died / network dropped) **after** Razorpay captured the money, which would otherwise leave the order stuck at `created`.

| Guard | Detail |
| :--- | :--- |
| **Signature first** | Reads `await request.text()` (the **raw** bytes), verifies `x-razorpay-signature` via `verifyWebhookSignature` **before** `JSON.parse`. A bad/absent signature → **400**. |
| **Idempotent** | On `payment.captured` / `order.paid`, updates **`{ razorpayOrderId, status: 'created' }` → `verified`** with `orderStatusChangeUpdate(..., { actor: 'system' })` (`$set.status` + `$push.statusHistory` atomically). If the client-return verify already ran, the filter matches nothing → no-op (never double-advances, never downgrades `refunded`/`fulfilled`). |
| **Abuse posture** | Per-IP limiter `CART_WEBHOOK_RATE_LIMIT` (default **120/min**) and the `isIgnoredRequest` gate (loopback/dev traffic is not persisted). GET/PUT → **405**. Unhandled/unknown events are **2xx-acked** (`handled: false`) so Razorpay does not retry-storm us. |
| **Still additive** | The client-return HMAC verify is untouched; the webhook is a second, independent confirmation path. `scripts/security-audit.mjs` `writeRoutes` now includes the webhook, so losing its limiter fails the audit. |

#### D. Config + verification

- `.env.example` documents `RAZORPAY_MODE`, `RAZORPAY_WEBHOOK_SECRET`, `CART_WEBHOOK_RATE_LIMIT`, and the "demo is test-only" rule. Local `.env` (gitignored) set to `RAZORPAY_MODE=live`; the dead `NEXT_PUBLIC_RAZORPAY_KEY_ID` line removed (no code ever read it); backup at `/tmp/opencode/.env.bak-golive`.
- NEW `scripts/payment-gateway-test.mjs` — **26 assertions** (`test:payments-gateway`, wired into `test:all`): mode fail-closed, prefix match, webhook signature valid/tampered/unset/malformed, plus static guards on the routes and the "demo stays test-only" rule.
- **Verified:** `test:all` **EXIT 0** · `npm run build` **exit 0** standalone (`/checkout` + `/api/cart/webhook` compiled as ƒ dynamic) · `security:check` **PASS** · `check:demo`/`check:h1`/`check:seo` PASS · `test:payments-gateway` 26/26 · `test:demo-gateway` 23/23 · `test:payments` 45/45 · **live go-live E2E 13/13** (`/tmp/opencode/verify-razorpay-golive.mjs`: two spawned dev servers — live mode: no banner, keep-tab notice visible with a seeded cart, webhook 200/400/400/200/405, order not 503; test-mode-with-live-keys: banner present, order **503**).
- ⚠️ **Vercel production env vars must be set by hand** (`RAZORPAY_MODE=live`, the live `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`) **and** the webhook endpoint added in the Razorpay Dashboard — the `.env` edit is local-dev only.

#### E. Nested admin — visitor de-duplication (`sarvadnya-advanced`, pointer)

Same session, in the nested repo: `/admin/visitors` used to list one row **per visit**, so the same person appeared many times. It now aggregates **IP + device signature** into a single row with a summed `visits` count, ordered by latest activity; **bots are separated** by an explicit tab and excluded from the KPI cards (which now count **unique humans**). New `lib/visitor-groups.ts` + rewritten `app/api/admin/visitors/route.ts` (GET `scope=humans|bots`, DELETE `?ids=` ≤ 500) + rewritten `app/admin/visitors/page.tsx` + `app/api/admin/stats/route.ts`. Full detail in **`sarvadnya-advanced/AGENTS.md` §20**.
