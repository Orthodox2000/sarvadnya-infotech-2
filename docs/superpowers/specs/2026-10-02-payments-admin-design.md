# Payments: Checkout Buyer Capture + Admin Ledger/Export (SP-3, 2026-10-02) — Design Spec

**Date:** 2026-10-02
**Status:** DESIGN ONLY — no code written yet. Awaiting owner approval to execute.
**Owner decisions captured:** see §2.

---

## 1. Goal

Turn the successful-payment flow into a first-class, admin-visible record:

1. **Checkout capture** — `/checkout` collects Name, Email, Phone and Company (optional) from the
   buyer, validates them, and blocks the Pay button until they are valid. The Razorpay TEST order
   and the stored `orders` document both carry the buyer details.
2. **Audit trail** — every order carries a `statusHistory[]` timeline (`created` → `verified`, then
   admin `refunded` / `fulfilled`), written atomically with the status itself (the SP-2
   `statusChangeUpdate` pattern, generalized to orders and hand-ported to both repos per §10).
3. **Admin Payments — TWO pages** in the nested admin deployment:
   - **Ledger + Transaction Log** (read-only): every order, filterable by status / date range /
     text search, row-detail modal with the full timeline, XLSX export of the filtered set.
   - **Summary + Export**: rolled-up totals (orders count, sum paid, GST, discount) for the
     current filters, presentable (Print/Save-as-PDF via the established scoped-print pattern)
     and XLSX-downloadable.
4. **Update status + note** from the admin (the *Update* arm of CRUD). **Delete is deliberately
   absent** — the owner reframed the admin as read-only/export pages (see §2.1).
5. **News post** — one new `/news` blog post on international TallyPrime licenses and usage
   outside India, from the owner's provided copy (see §6).

---

## 2. Owner decisions (2026-10-02)

| # | Decision |
| :-- | :-- |
| 1 | **Delete semantics:** reframed away from hard/soft delete — instead build **2 admin pages**: a read-only ledger + transaction log, and a simple presentable/downloadable view with filters to download each. No delete anywhere. |
| 2 | **Update semantics:** status + note (audit trail). |
| 3 | **List scope:** all orders, status-filtered (attempted and successful both appear). |
| 4 | **Second page shape:** summary + export view — filters → totals (count, sum, GST) → Print/PDF + XLSX of filtered rows. |
| 5 | **News scope:** one post in the existing `/news` blog, seeded via `scripts/seed_news.mjs`. |
| 6 | **Export format:** XLSX (`xlsx` npm package — already a dependency in the nested admin repo's submissions page). |

### 2.1 Missing decision (explicitly absent by design)

**DELETE:** no delete endpoint, no delete UI. The owner's answer to the delete question replaced
it with the two-page read-only/export design. If the owner later wants deletion, it must be a new
decision with its own semantics (soft-delete archive recommended then).

---

## 3. ⛔ Constraints and context that shape this design

### 3.1 Two repos, shared DB, hand-ported shared code (§10)

| | Public repo (this one) | Nested admin repo (`sarvadnya-advanced/`) |
| :-- | :-- | :-- |
| Origin | `ankit-sarvadnya/sarvadnya-infotech.git` (+ `new-origin` fork) | `ankit-sarvadnya/advanced-sarvadnya.git` |
| Git identity | `-c user.name="unknown" -c user.email="ankitmali2017@gmail.com"` | `-c user.name="ankit-sarvadnya" -c user.email="ankit@tallycertified.com"` |
| Commit/push | commit + push **both** remotes (§13) | commit to nested origin; push only when asked |
| Writes `orders` | `/api/cart/order`, `/api/cart/verify` | **admin status changes** |
| Reads `orders` | render/none | **admin ledger/summary** |

**Rule:** any shared logic (order status module, validation) is written once and **hand-ported**
to the other repo — never symlinked, never a shared package. The two repos' `tsconfig` stays
separate; the public repo's `tsconfig.json` `exclude` keeps `sarvadnya-advanced` out of `tsc`
(verified-by-rule in §10 — do not remove).

### 3.2 Existing code this builds on (reuse, don't reinvent)

| Existing piece | Role in this design |
| :-- | :-- |
| `app/(site)/checkout/CheckoutContents.tsx` | Gains the buyer-details form; Pay button gated on validity; Razorpay `prefill` populated. |
| `app/api/cart/order/route.ts` | Already persists the `orders` doc (gated on `isIgnoredRequest`). Gains `customer` field + `created` status event + buyer validation. |
| `app/api/cart/verify/route.ts` | Already flips `status:'verified'` + stores `razorpayPaymentId`. Gains the `verified` status event. |
| `lib/cart/store.tsx` | Cart context — untouched (no buyer data in cart storage). |
| `lib/payment.ts` | `createOrder` accepts `notes` — buyer info goes in the stored doc, **not** as order notes (notes are display-only Razorpay metadata; the admin reads our DB, not Razorpay). |
| `sarvadnya-advanced/lib/status-history.ts` | SP-2 audit-trail module. **Generalise, don't fork-copy:** extract the atomic-update builder so orders reuse it (nested AGENTS.md §10 mandates: *"SP-1's Orders screen must reuse `statusChangeUpdate`"*). |
| `sarvadnya-advanced/app/admin/submissions/page.tsx` | Reference for admin list page + `xlsx` export + pagination/filters conventions. |
| `sarvadnya-advanced/app/admin/tss-renewals/page.tsx` | Reference for the timeline modal (buildTimeline render). |
| `app/admin/*` removal in public repo | Admin UI **only exists** in the nested repo — the ledger/summary pages go there, never here. |
| `scripts/seed_news.mjs` | Gains the new international-TallyPrime post (ASCII-only content rule — §6). |

### 3.3 Security posture of the money flow (unchanged — do not weaken)

- `assertTestKeys()` runs before any order is created — cart stays TEST-only.
- Amount is always server-authoritative; the browser never sends an amount.
- `/api/cart/verify` trusts **only** the HMAC signature (`crypto.timingSafeEqual`); buyer details
  are captured at order time and stored — they are administrative/contact data, never a
  verification input.
- Buyer PII (email/phone) is stored in the shared `orders` collection (the site already stores
  full visitor IP + form submissions there). **No new PII surface** beyond what form submissions
  already hold; still, the ledger masks nothing (admin-only page behind the admin guard).

### 3.4 Local environment

- Mongo is unreachable from this machine (owner on VPN) — see §5.4 for what can/cannot be tested.
- `npm run build` cannot pass locally (`/news` static export needs Mongo). Vercel builds on push.

---

## 4. Design

### 4.1 Data model — `orders` collection (extended, shared)

Every order document gains/keeps:

```ts
{
  orderId: string,            // our short id (cart_<uuid20>)
  razorpayOrderId: string,
  razorpayPaymentId?: string, // set on verify
  amountPaise: number,
  currency: 'INR',
  items: [{ slug, name, qty, unitPaise, totalPaise }],
  subtotalPaise, gstPaise, discountPaise: number,
  customer: {                 // NEW — captured at /checkout, validated server-side
    name: string,             // 1..100 chars, required
    email: string,            // validated email, required
    phone: string,            // 10-digit Indian mobile (digits only after +91 strip), required
    company: string          // optional, <= 100 chars
  },
  tssSerials: {               // NEW — owner 2026-10-03: { [tssSlug]: serial }, one per TSS line
    'tss-single-1yr': string, // trimmed, <> stripped, <= 64 chars; {} when no TSS lines
  },
  status: 'created' | 'verified' | 'refunded' | 'fulfilled',
  statusHistory: [           // NEW — SP-2 audit events, same shape as StatusEvent
    { to: 'created', at: Date, actor: 'system', note?: undefined },
    { to: 'verified', at: Date, actor: 'system', note: 'Payment <id> verified' },
    // admin hops append: { to: 'refunded', at, actor: 'admin', note?: string }
  ],
  testMode: true,
  ip: string,
  createdAt: Date,
  updatedAt: Date
}
```

**`ORDER_STATUSES = ['created','verified','refunded','fulfilled']`** — the vocabulary lives in
the shared order-status module (both repos). `created`/`verified` are written by the payment flow
(actor `system`); `refunded`/`fulfilled` by the admin (actor `admin`). Every hop is one atomic
`$set.status + $push.statusHistory`.

### 4.2 Shared module — `lib/order-status.ts` (both repos, hand-ported)

Mirrors `sarvadnya-advanced/lib/status-history.ts` but for orders. Because nested AGENTS.md §10
says the Orders screen must **reuse** `statusChangeUpdate` (not re-implement it), the nested copy
should ideally import the atomic builder from `status-history.ts`; the public repo has no
`status-history.ts`, so its copy carries the builder. → **Implement a generalised
`statusChangeUpdate` first (nested), then hand-port the generalised builder to the public repo as
the order-status module's core.** Public copy stays dependency-free (no React/Mongo types at
runtime) so the pure tests run under plain `node`.

API:

```ts
export const ORDER_STATUSES = ['created','verified','refunded','fulfilled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export function isValidOrderStatus(s: string): s is OrderStatus;

// Atomic update: $set { status, updatedAt } + $push { statusHistory: {to, at, actor, note?} }
export function orderStatusChangeUpdate(to: OrderStatus, opts?: { note?: string; at?: Date; actor?: 'system' | 'admin' }): StatusChangeUpdate;

// Newest-first timeline with derived `from` (SP-2 semantics)
export function buildOrderTimeline(history: StatusEvent[]): TimelineEntry[];
```

**Actor rule:** `system` for flow writes (`created`, `verified`), `admin` for admin status changes
(default when omitted from admin callers). Keeps the SP-2 constant `STATUS_ACTOR='admin'` as the
default for admin paths.

### 4.3 Checklist capture (public repo)

**`CheckoutContents.tsx`:**

- New "Your details" card above the payment column (mobile: between items and totals): fields
  Name*, Email*, Phone*, Company (optional), all with `localityNote`-style inline validation
  messages and `aria-invalid`/`aria-describedby` wiring (accessibility guideline).
- Validation (client, shared rules): name non-empty ≤100; email regex; phone → strip
  leading `+91`/spaces/dashes → require exactly 10 digits; company ≤100 if present.
- Pay button `disabled` until the form is valid (`useMemo` over field values).
- On Pay: POST `{ items, customer }` to `/api/cart/order`; use `data.customer` + `data.amount`
  when opening Razorpay → `prefill: { name, email, contact }`.

**TSS serial number per TSS line (owner addition, 2026-10-03):** any order-summary line whose
slug starts with `tss-` (`tss-single-1yr`, `tss-single-2yr`, `tss-multi-1yr`, `tss-multi-2yr`,
`tss-auditor-1yr`, `tss-auditor-2yr`) gets its own "TSS Serial Number *" input inside the line
row (below the qty stepper). State held in `CheckoutContents` as `serialBySlug: Record<slug,
string>`, passed to `PayButton`; Pay stays disabled while any TSS line lacks a valid serial.
Serial rule (pure `validateTssSerials(serials, tssSlugs)`, mirrors the existing
`/api/tss-renewal` free-text handling — no invented format regex): required, trimmed, strips
`<>`, ≤ 64 chars. One serial per line regardless of qty (owner pick; per-qty serials would be a
follow-up). The client sends `tssSerials: {[slug]: string}` in the POST body.

**`app/api/cart/order/route.ts`:**

- Parse + validate `customer` server-side (same rules, rejects with 400 + per-field errors —
  never silently mangles).
- **Parse + validate `tssSerials`** against the repriced TSS lines (a priced `tss-*` item with a
  missing/blank serial → 400 + slug-keyed errors; no TSS lines → `{}`).
- Include `customer` + `tssSerials` in the persisted doc; append `created` event:
  ```
  { $set: { ..., status:'created', createdAt, updatedAt },
    $push: { statusHistory: { to:'created', at, actor:'system' } } }
  ```
  (single insertOne with the event inside the doc — no separate write).
- Echo `customer` in the JSON response (for Razorpay prefill).

**`app/api/cart/verify/route.ts`:**

- On success, the existing `updateOne` also appends:
  `{ to:'verified', at, actor:'system', note:'Payment <razorpayPaymentId> verified' }`
  in the SAME `$set+$push` (per §4.2 builder).
- Return `customer` + `tssSerials` in the verified payload (harmless; receipt may show them).

**Receipt (`VerifyResult.tsx`)**: show buyer name + email on the verified receipt (payment-record
completeness). Default ON and implemented in this build; if it complicates the receipt layout it
is dropped with a note — but the intent is to include it.

### 4.4 Admin API — `sarvadnya-advanced/app/api/admin/payments/route.ts`

- `GET` — list with filters: `status` (any ORDER_STATUSES value), `from`/`to` (ISO dates →
  `createdAt` range), `q` (regex over `orderId | customer.name | customer.email | customer.phone`),
  `page`/`limit` (default 25, max 100). Response: `{ items, total, page, totalPages }`, each item
  projected WITHOUT `ip` (admin already sees IPs elsewhere, but the ledger is a payments record —
  keep it clean; decision noted, reversible).
- `POST` — `{ id, status, note? }`: validates id (`isValidObjectId`), status
  (`isValidOrderStatus`), applies `orderStatusChangeUpdate(status, { note, actor:'admin' })` via
  `findOneAndUpdate(..., { returnDocument:'after' })`. Returns the fresh doc + `buildOrderTimeline`.
  Reuses the 404-on-missing and 400-on-invalid patterns from `app/api/admin/prices/route.ts`
  (SP-1) and `tss-renewals` (SP-2). **No DELETE handler.**
- Auth = the deployment's `proxy.ts` admin guard (all `/api/admin/*`) — same as sibling routes,
  no per-route auth.

### 4.5 Admin pages — `sarvadnya-advanced/app/admin/`

| Page | Route | Contents |
| :-- | :-- | :-- |
| **Payments — Ledger** | `/admin/payments` | Filter bar (status select, from/to date, search input, Apply/Reset); read-only table: created, orderId, customer name/email/phone/company, item count + first item, TSS serial(s) (join `tssSerials` values), amount (INR), status badge, actions → **detail modal** (items list, totals, razorpay ids, TSS serials, statusHistory timeline via `buildOrderTimeline`, status-change form: select refunded/fulfilled + note + Save). XLSX export button (`xlsx` — same helper as submissions page) exporting the **currently-filtered** rows from the API, with a **TSS Serial(s)** column. |
| **Payments Summary** | `/admin/payments/summary` | Same filter bar; totals cards (orders count, sum `amountPaise`, sum `gstPaise`, sum `discountPaise`, average order); **Print / Save-as-PDF** button (`window.print()` with the scoped-print pattern from the receipt); XLSX export of filtered rows. A `Link` back to the ledger. |
| Sidebar | `AdminSidebar.tsx` | One "Payments" entry → `/admin/payments` (+ summary reachable via a tab/link on the page). |

**Layout decision:** two routes with a small tab switcher (`Ledger | Summary`) rather than one
page with a mode toggle — matches "2 pages" wording and keeps each page focused.

### 4.6 News post (public repo) — §6

---

## 5. Testing

### 5.1 Pure unit tests (public repo) — `scripts/order-status-test.mjs`

Standalone, zero dep, plain `node` (like `sara-topics-test.mjs`):
- vocabulary: `isValidOrderStatus` accept/refuse;
- builder: `$set.status`, `$push.statusHistory` shape, actor default + override, note sanitisation
  (control chars stripped, 300 cap), injectable `at`;
- timeline: newest-first, derived `from`, empty-history handling.

### 5.2 Pure unit tests (nested repo)

- `orderStatusChangeUpdate` / generalised `statusChangeUpdate` still passes the existing
  `scripts/status-history-test.mjs` (22 assertions) — regression proof the generalisation is
  behaviour-preserving.

### 5.3 E2E (public repo, dev server, stubbed Razorpay — §11/§12 posture)

`/tmp/opencode/verify-payments.cjs`:
- fill the checkout form invalid → Pay disabled + validation messages;
- fill valid → Pay enabled; POST `/api/cart/order` intercepted → assert body has
  `customer {name,email,phone,company}` and `items`;
- stub order+verify success → success page; receipt shows buyer name/email;
- empty-cart + lazy-load + hydration-consistency probes (360/768/1440).

### 5.4 What CANNOT be tested locally (owner on VPN → Atlas unreachable)

- Real Mongo writes on the public routes (isIgnoredRequest gating already makes localhost not
  persist — so nothing new is lost locally).
- The nested admin pages (they read Mongo). Nested verification = `npm run typecheck` in the
  nested repo + pure status-history regression + code review.
- `npm run build` (needs Mongo for `/news`) — both repos build on Vercel push.

---

## 6. News post (public repo)

Add ONE post to `scripts/seed_news.mjs` (upsert by slug; **ASCII-only content** — the em-dash once
corrupted the file, §3 of AGENTS.md news entry):

- **slug:** `tallyprime-international-licenses`
- **title:** "Using TallyPrime Outside India: International Licenses Explained"
- **category:** Tally Prime
- **tags:** `['tallyprime international license', 'tally international edition', 'tally outside india', 'tally prime middle east', 'tally uae']`
- **content:** based verbatim on the owner's paragraph — India-edition blocked outside India;
  permanent operations abroad (e.g. UAE, Singapore, UK) require upgrading to an International
  Edition or purchasing a designated international/regional license; short-trip nuance not claimed
  (stick to the owner's copy; do not invent travel-policy details).
- Description + author standard (author `Sarvadnya Infotech LLP`). CTA link `/products`.

Seeding runs with `node scripts/seed_news.mjs` (needs Mongo — run when Atlas is reachable; the
file upsert is idempotent). **When the VPN is off, run it; until then the post is committed but
not live.**

---

## 7. Out of scope / explicit non-goals

- No DELETE for orders/payments (owner redesign — §2.1).
- No email/notification on successful payment (not requested; auto-reply system exists for forms
  and is not wired to cart — do not add without asking).
- No changes to the `/demo` scaffold (independence guard — do not reference it from live code).
- No admin editing of buyer fields (status+note only, per owner).
- No product/module price changes, no cart-math changes, no currency changes.
- No index/migration work beyond what Mongo auto-indexes (`createdAt`, `status` — created
  implicitly by queries; optional explicit indexes noted for a later ops pass).

---

## 8. Files touched (preview)

**Public repo:** `lib/order-status.ts` (new), `scripts/order-status-test.mjs` (new),
`app/api/cart/order/route.ts`, `app/api/cart/verify/route.ts`,
`app/(site)/checkout/CheckoutContents.tsx`, `app/(site)/checkout/success/...` (receipt buyer
line), `scripts/seed_news.mjs`, this spec + daily logs + tracker rows.

**Nested repo:** `lib/status-history.ts` (generalise builder — behaviour-preserving),
`lib/order-status.ts` (new, reusing the builder), `app/api/admin/payments/route.ts` (new),
`app/admin/payments/page.tsx` + `app/admin/payments/summary/page.tsx` (new),
`app/admin/AdminSidebar.tsx` (entry), `scripts/status-history-test.mjs` (add order-status cases),
nested `AGENTS.md`/`ADMIN-ISOLATION.md` doc notes.