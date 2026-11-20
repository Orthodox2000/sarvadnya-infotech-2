# 25. 2026-10-17 (fourth session) — ₹1 live payment-trial item (TEMPORARY)

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

**Owner:** *"create a 1rs trial in demo route for pament and testing of route and push to main, and fix outdated code and push to main"*, clarified to **option 2** (*"do no.2 but w will remove it properly and document it as well"*) — a **real ₹1 item on the live cart seam**, removable and documented. The second half was retracted (*"orgett it, ensure no beaking or buggy stuff remains"* → no stale-alias fix; just prove nothing breaks).

**Why not `/demo`:** `/demo` is hard-locked to **test keys** (`assertTestKeys()` in `lib/demo/razorpay.ts` throws unless `RAZORPAY_KEY_ID` starts `rzp_test_`), so a live ₹1 there would 503. The trial therefore lives on the **real cart seam**, which is mode-aware and live-capable (§24A).

| Piece | Detail |
| :--- | :--- |
| **Catalogue entry** | `lib/prices-catalog.mjs` gains `export const PAYMENT_TRIAL_SLUG = 'payment-trial-1rupee'` + one **TEMPORARY** `priced()` row: name `Payment Trial (Rs. 1)`, `category: 'others'`, `validity: 'Test'`, `sortOrder: 999`, `baseRupees: 1`, `gstPct: 0` → **payablePaise 100** (exactly ₹1; Razorpay's minimum is 100 paise — 18% GST would make it ₹1.18). `pairsWith`/`addonSlugs`/`moduleSlugs` are all `[]`, so the bundle modal and the drawer cross-sell stay silent for it, and no pricing page lists it (pages render explicit slug lists, not the whole catalogue). |
| **Typed surface** | `lib/prices-catalog.d.mts` declares `PAYMENT_TRIAL_SLUG: string`; `lib/prices.ts` re-exports it so the UI imports it from the typed facade. |
| **Entry point** | NEW `app/(site)/checkout/trial/page.tsx` (server shell — `robots: noindex` + `force-dynamic`) + `app/(site)/checkout/trial/TrialPay.tsx` (client UI: one `<h1>`, the ₹1 row, reuses `CartAddButton`, and a **Go to checkout** `Link` → `/checkout`, where the real buyer-details + Pay flow runs). It changes **nothing** anywhere else and nothing links to it. `app/robots.ts` already disallows the whole `/checkout` subtree and `app/sitemap.ts` is a static list, so the route can never be indexed. The client shows an amber "not sellable … re-run `seed:prices`" hint when the row is missing/inactive after the live list settles. |
| **Price guard** | `scripts/cart-test.mjs` pins the row (payable **100** paise, `gstPct 0`, `priceStatus 'priced'`) — suite is now **32 assertions**. |
| **Removal tool** | NEW `scripts/remove-payment-trial.mjs` → `npm run remove:payment-trial` (**DRY-RUN default**, `--apply` deletes the `prices` doc by slug; credentials masked in the log; URI from `MONGODB_URI`). |

**Where it must be seeded (VERIFIED, not assumed).** `getPrices()` (`lib/prices-server.ts`) returns DB rows **as-is** when the collection is non-empty and does **not** merge the fallback — so the item only stays sellable if it is in the DB the deployment reads (the fallback is the empty-DB safety net). A **reversible sentinel probe** (rename the doc's `name` through the frontend `.env` URI, read it back on the live site + the admin, restore) proved that **both the deployed frontend and the deployed admin read the FRONTEND `.env` cluster — `sarvadnya.zvdcpsj.mongodb.net`, db `test`**. The trial was seeded there (**17 → 18** docs; live `/api/prices` now returns `source: mongo`, 18 items) and also into the nested repo's **local** `.env` cluster (`ac-1nfykty…/sarvadnya-infotech`, admin-local parity).

**Removal checklist (the "remove it properly" deliverable) — 4 steps:**
1. `npm run remove:payment-trial -- --apply` against the **live** DB (the frontend `.env`), then repeat with the nested `.env` URI for parity. (Dry-run first shows exactly what would go.)
2. Delete the folder `app/(site)/checkout/trial/` (both files).
3. Remove the `PAYMENT_TRIAL_SLUG` block + the `priced()` row from `lib/prices-catalog.mjs`, its declaration in `lib/prices-catalog.d.mts`, the re-export in `lib/prices.ts`, and the `cart-test.mjs` assertion.
4. Commit + deploy. Nothing else references the slug — `grep -rn "payment-trial-1rupee\|PAYMENT_TRIAL_SLUG"` returns only those **7 files** (`checkout/trial/*`, the 3 price libs, `cart-test.mjs`, `remove-payment-trial.mjs`).

**Verified:** `typecheck` 0 · `test:all` **EXIT 0** · `test:cart` **32/32** · `check:demo` / `check:h1` / `check:seo` PASS · `security:check` PASS · `npm run build` **exit 0** standalone (`/checkout/trial` compiled **ƒ dynamic**) · `next start` runtime: `/api/prices` → `mongo`, 18 items, trial `100`/`priced`; `/checkout/trial` → 200 with `noindex` + the H1; `/api/cart/order` empty body → **400** (not 503) · removal dry-run finds the doc. **Live:** `/api/prices` = `mongo`, 18 items, trial present.

**⚠️ Observations (pre-existing, NOT changed by this work):** (1) before this session's seed, live `/api/prices` returned **`source: fallback`** (17 items) even though `zvdcpsj/test` already held 17 `prices` docs — i.e. the deployed function was reading **no** price rows at that moment; after the seed it reads the DB (`mongo`). Re-check `MONGODB_URI` in the frontend Vercel project if `fallback` ever reappears. (2) The nested repo's **local** `.env` points at `ac-1nfykty…` while **both deployments** read `zvdcpsj/test`, so nested-local DB state ≠ nested-deployed DB state. (3) §18's older note ("deployed frontend reads the nested admin cluster") does not match the probe above — corrected here; the probe is the source of truth.
