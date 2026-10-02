# Vercel / Atlas — Deployment & Migration Runbook

_Last updated: 2026-10-02 — written for the SP-1 cart build (site-wide cart, Razorpay
TEST-mode checkout, DB-driven prices, admin price manager). Applies to BOTH repos: the
public frontend (`sarvadnya-infotech`) and the nested admin fork (`sarvadnya-advanced/`).

---

## 1. What this covers

| Piece | Where it lives | Deploys as |
| :--- | :--- | :--- |
| Public site (`/`, 41 pages, cart, checkout, news, modules…) | `app/(site)/` etc. in **this repo** (frontend) | Vercel project A |
| Admin panel (`/admin/*`, 18 pages) + admin APIs | `sarvadnya-advanced/` (nested repo, own git origin) | Vercel project B |
| Database — single shared Atlas cluster | `MONGODB_URI` in **both** `.env` files → same `client.db()` | MongoDB Atlas (M0/M2) |
| File uploads (chunked) | Vercel Blob, `BLOB_READ_WRITE_TOKEN` / `BLOB_STORE_ID` | Vercel Blob store |
| Cart payments | Razorpay **TEST mode** (`rzp_test_` keys, hard-asserted) | Razorpay dashboard |
| Transactional email | Resend, direct inline send (see §11 — no cron) | Resend + MongoDB `email_queue` ledger |

The frontend repo **has no admin code at all** (`app/admin/`, `app/api/admin/`,
`lib/admin-auth.ts` are physically removed). The nested repo has the admin and its own
`proxy.ts` admin guard. **Do not deploy the nested repo's admin routes into project A.**

### 1a. Existing deployment (context)

The app is already live on Vercel (`sarvadnya-infotech.vercel.app`) and the domain
`https://sarvadnyainfotech.com`. This runbook is for a **fresh migration or a from-scratch
redeploy** (new account, new project, disaster recovery) and for **shipping new infra** —
Blob store, prices collection, cart — without breaking the live site.

---

## 2. Prerequisites

- Node 24.21.0 installed locally (see AGENTS.md §9). Vercel builds are independent of
  local Node — set the project's Node to **22.x LTS** (or 24.x) in Project → Settings →
  General → Node.js Version.
- MongoDB Atlas cluster with a database user (`readWriteAnyDatabase` for simplicity) and
  network access (`0.0.0.0/0` fine for a public site; consider Atlas Private Endpoint or
  Vercel IP allow-list later).
- Razorpay account with **test keys** — see §7. ⚠️ **The test secret was pasted into a chat
  transcript; rotate both keys before any go-live.**
- Resend account with a verified sender/domain (used for form emails + auto-replies).
- Access to the nested repo (`ankit-sarvadnya/advanced-sarvadnya.git`) for project B.

---

## 3. Environment variables

Every variable below is documented in `.env.example` (both repos). Public site values are
identical in both projects except the nested repo also needs `ADMIN_ACCESS_KEY`.

| Variable | Needed by | Notes |
| :--- | :--- | :--- |
| `MONGODB_URI` | both | The Atlas connection string. **There is no dev DB** — every local run and every production read uses this one cluster. |
| `BLOB_READ_WRITE_TOKEN` / `BLOB_STORE_ID` | both | Vercel Blob store used by all chunked uploads (admin images + career resume). |
| `RESEND_API_KEY` | both | Form email sending. |
| `RESEND_SENDER_EMAIL` | both | Verified sender (e.g. `webenquiry@en.sarvadnyainfotech.com`). Also the auto-reply fallback sender. |
| `RESEND_INTERNAL_TO` | both | Fallback internal recipient for submissions with no page destination. |
| `EMAIL_DESTINATION_RECIPIENTS` (optional) | both | Per-page recipients map, editable in Admin → Email Config (server-side only). |
| `EMAIL_MAX_ATTEMPTS` / `EMAIL_RATE_LIMIT` | both | Retry/rate defaults (5 attempts, 30/min). |
| `CRON_SECRET` | both | Optional bearer key for the external retry drain (`/api/admin/email/process`). |
| `AUTO_REPLY_ENABLED` | both | **Default OFF.** Flip to `1` to enable client thank-you emails. See `lib/email-autoreply.mjs`. |
| `AUTO_REPLY_FROM` / `AUTO_REPLY_REPLY_TO` | both | Auto-reply sender/reply-to (defaults documented in `.env.example`). |
| `GEMINI_API_KEY` / `GROQ_API_KEY` | both | Ask Sara chatbot (Groq rotation; local fallback exists). |
| `NEXT_PUBLIC_*` | both | Support phone/email/address, social links — must be **public** (no `NEXT_PUBLIC_` = server-only). |
| `VISITOR_IGNORE_IPS` | both | Comma-separated exact-match IPs never tracked (loopback is always ignored). **Required for local dev** — see §10. |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | both | **TEST keys only** — the gateway throws unless `KEY_ID` starts with `rzp_test_`. |
| `CART_ORDER_RATE_LIMIT` (optional) | both | Cart order endpoint rate limit (default 20/min, see `lib/cart/rate-limit.ts`). |
| `DEMO_ORDER_RATE_LIMIT` (optional) | both | `/demo` scafford-only checkout limit. |
| `ADMIN_ACCESS_KEY` | **nested only** | Master key checked by `proxy.ts` guard (`x-admin-key` header, `admin_key` cookie, `__admin_token`). |
| `MEGA_EMAIL` / `MEGA_PASSWORD` | both | Resume backups (job applications → MEGA). |

> **Never commit `.env`.** Both repos gitignore `.env*`. Paste secrets directly into Vercel
> (Settings → Environment Variables) per project.

---

## 4. Deploy project A — public site (frontend repo)

1. Push the frontend repo to its origin **only when asked** (see AGENTS.md).
2. Vercel → Add New Project → import the frontend repo.
3. Framework preset: **Next.js**; Build command `npm run build`; Install `npm install`;
   Output directory default (Vercel detects `.next`).
4. Set Node.js version to 22.x LTS (or 24.x) — Project → Settings → General.
5. Add all env vars from `.env.example` (both build-time and runtime; `NEXT_PUBLIC_*` must
   be present at build for client bundles).
6. Deploy. First load will 404 on `/checkout/success` until you run the seed (§5) and the
   prices exist — **seed before testing checkout**.
7. After first deploy, run the seed scripts **against production** (they read the same
   `MONGODB_URI` the deployed app uses):

```bash
npm run seed:prices     # prices collection (idempotent, $setOnInsert → never clobbers admin edits)
npm run seed:modules    # modules collection
npm run seed:news       # blog posts (idempotent upsert by slug)
npm run seed:careers    # job listings
npm run bootstrap:email # EMAIL_FORM_RECIPIENTS + RESEND_SENDER_EMAIL, only if missing
```

(There is no `bootstrap:email` npm script — run `node scripts/bootstrap.mjs` if that seed
hasn't run yet; admin Email Config UI can also set recipients.)

---

## 5. Deploy project B — admin panel (nested repo)

1. Import the **nested repo** (`sarvadnya-advanced/`) as a separate Vercel project.
   Same Next.js preset, Node 22.x/24.x, `npm run build`.
2. Add the **same env vars** **plus** `ADMIN_ACCESS_KEY`.
3. Deploy. `/admin` is fenced by the repo's `proxy.ts` guard (Next 15 ignores the file —
   see §9 for the Next 16 warning). The panel reads/writes the SAME Atlas DB, so a price
   saved in Admin → **Prices** is immediately what the public site sells — no redeploy
   between them.
4. Verify `/admin/prices` lists the 17 seeded items; edit one price, confirm the public
   Silver/TSS/Gold/TallyDrive rows change to match.

---

## 6. Blob store

- Create a Blob store in Vercel (or reuse the one from the current project). Both projects
  share the same `BLOB_READ_WRITE_TOKEN`/`BLOB_STORE_ID` so admin-uploaded images are
  served by the public project.
- **Chunked upload already handles Vercel's ~4.5 MB function-body limit**: files > 3 MB are
  sliced to 2 MB chunks server-side (see AGENTS.md §5). No action needed for migration —
  but verify one > 3 MB upload in Admin (e.g. Settings logo) after deploy.

---

## 7. Razorpay TEST-mode checkout

- **Live money is impossible by construction.** `lib/demo/razorpay.ts` (scaffold) and
  `lib/cart/payment.ts` (cart) both refuse to run unless the key id starts with `rzp_test_`
  (prefix test — `xxrzp_test_yy` is refused).
- Prices are server-authoritative: the browser posts only `{items:[{id,qty}]}`; the order
  route recomputes totals from the DB/catalogue and rejects unknown/unpriced/inactive slugs.
- Verification is **signature-only** (HMAC-SHA256 over `order_id|payment_id`) in the
  `/api/cart/verify` route — there is deliberately **no payment-capture API call** and no
  webhook to configure. (A display-only `orders.fetch` on the receipt is allowed post-HMAC;
  it can't change the verdict.)
- **Prepare for go-live later**: create LIVE Razorpay keys, flip them in both projects' env,
  and test ONE real order. **Rotate the current test secret first** — it leaked in a chat.

---

## 8. CSP & third-party domains

`next.config.js` already allows (site-wide, merged headers):

- Razorpay: `https://*.razorpay.com` in `script-src`, `connect-src`, `frame-src` (the
  wildcard is required for `cdn.razorpay.com/…/razorpay-risk-detection/bundle.js`).
- Zoho SalesIQ tracking: `*.zohopublic.in` / `*.zohocdn.com` (+ `wss:` for analytics).
- Vercel Blob + site domains in `img-src`/`connect-src`.

If a fresh project gets its own Vercel URL (e.g. `project-a.vercel.app`), add it to
`img-src`/`connect-src` or images/fetch calls to blob storage may be blocked — check the
browser console after first deploy.

---

## 9. The `proxy.ts` / Next 16 landmine (read before upgrading)

This **frontend** repo contains a `proxy.ts` that is byte-identical to the nested repo's
full admin guard (`x-admin-key`/`admin_key`/`__admin_token` + `/admin` + `/api/admin`
path checks). It is **inert** only because the installed Next **15.5.19** (lockfile-pinned)
never reads a `PROXY_FILENAME`. **Upgrading to Next 16 would activate an admin guard in the
public frontend deployment.** Delete or re-scope this repo's `proxy.ts` before any Next 16
upgrade. Same for the tsconfig `exclude` of `sarvadnya-advanced/` — do not remove it.

---

## 10. Backups, rollback, and the local-dev trap

### The trap
There is **no dev/test database**. Local `next dev`, curl, Puppeteer and test scripts all
hit the **same live Atlas cluster** (`client.db()` with no name argument). Before any local
run: set `VISITOR_IGNORE_IPS` for your machine's public IP and rely on the built-in
loopback ignore — §"Tracking ignore list" in AGENTS.md. Cart `demo_orders` writes are
already gated on `isIgnoredRequest(request)`.

### Backup
```bash
npm run backup:db                                     # all collections → backups/<timestamp>/
BACKUP_COLLECTIONS=prices,modules,news npm run backup:db   # pick collections
node scripts/db-backup.mjs                            # or BACKUP_COLLECTIONS=prices
```
Driver-based (no `mongodump` needed), BSON-safe JSON, ordered by `_id`, manifest written
alongside. **Run it before any migration step.** `backups/` is gitignored — copy the folder
off the machine for real safekeeping.

### Restore
```bash
mongosh "$MONGODB_URI" --file restore-script.js   # or
mongorestore --uri "$MONGODB_URI" --dir backups/<timestamp>/
```
For a single collection, use `mongosh` + `insertMany` from the dump (documents are plain
JSON with hex `_id`s; drop the collection first if you want a clean slate).

### Rollback checklist
1. Back up current state (`npm run backup:db`).
2. Point env back to the previous values (or redeploy the previous commit).
3. `scripts/seed_prices.mjs` re-adds catalogue items **only if missing** (`$setOnInsert`) —
   it never undoes an admin's edit and never deletes.

---

## 11. Operations notes (things that look wrong but are deliberate)

| Observation | Why it's correct |
| :--- | :--- |
| No cron for email | Vercel Hobby allows **2 cron jobs, min once/day**. Form emails are sent **directly inline** in the request, with exactly-once semantics via the `jobKey` unique slot; outcome (and client auto-reply) is recorded in the `email_queue` ledger. Failed sends are retried from Admin → Email Config, or by an external scheduler hitting `/api/admin/email/process` with `CRON_SECRET`. |
| `demo_orders` stays empty on localhost | Both gateway routes gate persistence on `isIgnoredRequest`. Expected. |
| Receipt is `window.print()`, not a PDF lib | Real text layer (searchable txn number), zero dependencies, works on every mobile OS. |
| `/checkout`, `/checkout/*`, `/demo` are `noindex` | `app/robots.ts` disallows them; the demo independence guard (npm `check:demo`) fails the build-adjacent checks if any live code references `/demo`. |
| Prices render from DB with a fallback | Pages derive rows via `priceRowView`/`resolve`; if a document is missing/renamed the built-in catalogue (`lib/prices-catalog.mjs`) produces **identical strings** — the page can never go blank. |

---

## 12. Post-migration verification checklist

```bash
npm run typecheck        # exit 0
npm run test:cart        # 31/31 — cart maths + page-parity + money guards
npm run check:demo       # PASS — no /demo reference in live code
npm run test:all         # full suite (includes the above + sara + api + demo)
npm run build            # exit 0 (run ALONE — never with `next dev`)
```

Smoke (browser, 360/768/1440):
1. `/products/silver` → hero **Buy Now!** → bundle modal (Silver + TSS companions) → cart
   drawer totals match the page rows → `/checkout` → Razorpay TEST popup → mock-bank
   success → receipt lists every item, TEST MODE box present.
2. Navbar cart badge count + `svd_cart` localStorage persistence across reload.
3. TSS page per-row **Add** (no bundle), TallyDrive extra storage add is quiet.
4. Admin (`project B`) `/admin/prices`: edit `tallyprime-silver` base → public Silver row
   and cart price change on refresh (no redeploy).
5. `window.print()` on the receipt inside Chrome/Android → a PDF with only the receipt
   (no navbar/cookie/popovers) — the `:has()` print rule.
6. One > 3 MB admin upload (Blob chunking) and one form submission email arrives
   (internal copy) with auto-reply OFF by default.