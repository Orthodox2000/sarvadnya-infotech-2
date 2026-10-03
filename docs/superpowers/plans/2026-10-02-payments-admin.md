# Payments: Checkout Buyer Capture + Admin Ledger/Export (SP-3) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture Name/Email/Phone/Company at `/checkout`, store buyer details on every order with a `created → verified → (admin) refunded/fulfilled` audit trail, and let the admin read/export that record from two new pages (ledger + summary) — no delete, status+note updates only (owner's reframing).

**Architecture:** A dependency-free `lib/order-status.ts` is the single source of truth for the order status vocabulary, the atomic `$set.status + $push.statusHistory` update builder, the timeline reconstructor, and customer validation — written once and hand-ported to the nested admin repo (§10). The public flow routes (`/api/cart/order`, `/api/cart/verify`) write `created`/`verified` as actor `system`; the nested admin (`/api/admin/payments` + 2 pages) reads the ledger and writes `refunded`/`fulfilled` as actor `admin`, reusing the SP-2 `statusChangeUpdate` builder exactly as nested AGENTS.md §10 mandates. XLSX export is client-side `xlsx` (already a nested dependency).

**Tech Stack:** Next.js 15.5.19 / React 19.2.4 / TypeScript / Tailwind 4, MongoDB driver 7.4.0 (shared Atlas — both repos write the same `orders` collection), Razorpay TEST SDK 2.9.8, `xlsx` 0.18.5 (nested admin only), Node 24.21.0, plain-`node` .mjs test scripts (no deps).

**Spec:** `docs/superpowers/specs/2026-10-02-payments-admin-design.md`

---

## NEXT-SESSION HANDOFF SUMMARY (read this first)

**Status at end of 2026-10-02 (design session):** spec written, self-reviewed, committed (`f879606`, **already on both remotes**), owner approved the design in-chat ("do it") and asked for this TODO to be executed **tomorrow in a fresh session**. **No implementation code exists yet.**

**2026-10-03 (owner update before execution):** *"when buying tss they need to add their TSS serial number"* — **bounded addition folded in:** one serial number per TSS cart line, captured at checkout in the order-summary row, validated (pure `validateTssSerials` in `lib/order-status.ts`), sent as `tssSerials: {[slug]: string}`, persisted on the order, echoed by verify, shown on receipt + admin ledger + XLSX. Owner chose **one serial per TSS line** (multi-licence carts). Decision noted: one serial per line regardless of qty. Execution starts NOW (this session, Tasks 1–12).

| Item | State |
| :-- | :-- |
| Design approval | ✅ Owner said "do it" to the presented architecture (buyer capture + 2 admin pages + one news post) + TSS-serial-per-line (2026-10-03) |
| Spec | ✅ `docs/superpowers/specs/2026-10-02-payments-admin-design.md`, committed + pushed |
| This plan | ✅ Read this first; then execute tasks 1–12 in order |
| Execution method | **Native inline** (owner trend: short tasks, direct control). No subagents were requested. |
| Env blockers | ⚠️ Mongo unreachable locally while owner is on **VPN** → no local build (`/news` static export), no seed run. Vercel builds on push. `isIgnoredRequest` keeps localhost from writing production docs. |
| Deferred to owner | Run `node scripts/seed_news.mjs` when VPN is off (post is committed but not live). Rotate **Razorpay TEST keys** (leaked in a Session 5 transcript) before any go-live. |
| PII decision | Ledger GET omits `ip` from responses. Reviewer-approved as "cleaner payments record", reversible. |
| Two repos | Public repo = flow + news. Nested `sarvadnya-advanced/` = admin. Shared DB. Hand-port shared code, never symlink. Nested repo **not pushed** unless asked. |

**Execution order:** Tasks 1–7 (public flow + news + E2E) then Tasks 8–11 (nested admin) then Task 12 (commits/pushes). Each task ends with a commit.

---

## Global Constraints

- **Both remotes, every commit:** public repo pushes `git push origin main && git push new-origin main` (§13). Nested repo: `git -C sarvadnya-advanced ...` with explicit identity `-c user.name="ankit-sarvadnya" -c user.email="ankit@tallycertified.com"`, commit **only**, never push unless asked. Public commits use `-c user.name="unknown" -c user.email="ankitmali2017@gmail.com"`.
- **Order statuses vocabulary (exact):** `['created','verified','refunded','fulfilled']` — case-sensitive, in exactly one module per repo. `created`/`verified` = actor `system` (flow); `refunded`/`fulfilled` = actor `admin`.
- **TSS serial capture (owner, 2026-10-03):** any cart line whose slug starts with `tss-` (`tss-single-1yr`, `tss-single-2yr`, `tss-multi-1yr`, `tss-multi-2yr`, `tss-auditor-1yr`, `tss-auditor-2yr`) requires the buyer's TSS serial number at checkout — **one serial per line** (multi-licence carts). Stored as `tssSerials: { [slug]: string }` on the order doc; Pay gated until every TSS line has a valid serial. Server rejects 400 if any priced TSS item lacks a serial. Rule is per line regardless of qty (decision noted).
- **Audit trail invariants (from SP-2, do not "simplify"):** status and history change in ONE atomic update (embedded array, not a separate collection — Atlas may be M0, no multi-doc transactions). Events store `to` only; `from` is derived newest-first by `buildTimeline` (no read-before-write → no race). **No backfill** — existing orders keep no synthetic history; oldest event renders `from: null` → "created as".
- **Money posture unchanged (do not weaken):** `assertTestKeys()` first; amount always server-authoritative; verify trusts only the HMAC (`crypto.timingSafeEqual`); buyer details are contact data, never a verification input; `notes.cartItems` remains display-only.
- **Production DB:** local runs must not write orders — everything already gated on `isIgnoredRequest()`; keep the gate exactly where it is. Mongo unreachable locally on VPN — code must keep working with the price-fallback path for local E2E.
- **`/demo` independence:** live checkout/payments code must not import `lib/demo/*` or contain the literal `/demo` (`npm run check:demo` scans). Priced-page/Buy-Now wording: secondary CTA stays "Know More" — not part of this build, do not touch.
- **Build discipline (§9):** never `next dev` + `next build` concurrently. Local `npm run build` cannot pass on VPN (Mongo) — Vercel validates on push.
- **News seed rule:** `scripts/seed_news.mjs` content **ASCII-only** (an em-dash once corrupted the file and dropped closing backticks). New post upserts by slug, idempotent.
- **Brand:** teal `#006569`; `teal-*` tokens only; WhatsApp green `#25D366` untouched.
- **Every edit carries a `// CHANGE: 2026-10-02 — <reason>` comment.** Surgical edits over rewrites.
- **Mobile-first:** all new UI verified at 360px (E2E probes 360/768/1440).

## Review Focus

1. **Malformed customer data** (1-char name, `a@b` email, 9-digit phone, `+91` spacing variants, 101-char fields, non-string `customer`) — client blocks Pay; server rejects with 400 + **per-field** errors; nothing persisted and no Razorpay order created.
2. **Order not found / bad id on admin status change** — `new ObjectId(id)` must not throw (500); missing/invalid id and unknown status return 404/400, not 200 (SP-2 fixed exactly this class of bug).
3. **Orders written before the feature existed** (no `statusHistory`, no `customer`) — admin ledger renders them without crashing; modal shows "no history" gracefully; `buildTimeline([])` returns `[]`.
4. **Filter combinations** (status + from/to + text) are AND-ed, not OR-ed; an invalid status or unparsable date filter is rejected with 400 rather than silently ignored.
5. **XLSX export matches the current filter** — export uses the SAME query as the visible page (not the default unfiltered set); `.xlsx` opens with headers, paise already converted to rupees.
6. **Verify's updateOne must stay single-op** — adding the `verified` hop must not turn the write into two separate updates (would let status and history disagree).

---

### Task 1: `lib/order-status.ts` + pure unit tests (public repo)

**Files:**
- Create: `lib/order-status.ts`
- Create: `scripts/order-status-test.mjs`
- Modify: `package.json` — add `"test:order-status": "node scripts/order-status-test.mjs"` and append it to `test:all` (after `test:cart`).

**Interfaces:**
- Produces (consumed by Tasks 2, 3, 4, 8, 9):
  ```ts
  export const ORDER_STATUSES = ['created', 'verified', 'refunded', 'fulfilled'] as const;
  export type OrderStatus = (typeof ORDER_STATUSES)[number];

  export type StatusEvent = { to: string; at: Date; actor: string; note?: string };
  export type TimelineEntry = StatusEvent & { from: string | null };

  // Atomic Mongo update — $set status + updatedAt, $push the event, SAME op.
  export type StatusChangeUpdate = {
    $set: { status: OrderStatus; updatedAt: Date };
    $push: { statusHistory: StatusEvent };
  };

  export function isValidOrderStatus(s: string): s is OrderStatus;
  // actor defaults to 'admin' (matches SP-2 STATUS_ACTOR); flow callers pass 'system' explicitly.
  export function orderStatusChangeUpdate(
    to: OrderStatus,
    opts?: { note?: string; at?: Date; actor?: 'system' | 'admin' },
  ): StatusChangeUpdate;

  // Newest-first, `from` derived from the next-older entry's `to`; empty in → [].
  export function buildOrderTimeline(history: StatusEvent[]): TimelineEntry[];

  export type Customer = { name: string; email: string; phone: string; company?: string };
  export type CustomerValidation =
    | { ok: true; value: Customer }
    | { ok: false; errors: { name?: string; email?: string; phone?: string; company?: string } };
  // Pure, shared by client (CheckoutContents) AND server (order route). No React/Mongo/next imports.
  export function validateCustomer(raw: unknown): CustomerValidation;

  // TSS serial capture (owner 2026-10-03). Serial map keyed by TSS slug.
  // INPUT: { [slug]: string | undefined } for the TSS lines in the cart.
  // OUTPUT: missing/blank serial for a listed slug → { ok:false, errors:{ [slug]: string } }.
  export type TssSerialsValidation =
    | { ok: true; value: Record<string, string> }   // trimmed, sanitised serials
    | { ok: false; errors: Record<string, string> }; // slug → human message
  // tssSlugs = slugs of the TSS lines actually in the cart (server derives from repriced items,
  // client derives from cart lines with slug.startsWith('tss-')). Serial: required, trimmed,
  // strips `<>`, ≤ 64 chars — mirrors /api/tss-renewal sanitize() (free text, no format regex).
  export function validateTssSerials(raw: unknown, tssSlugs: string[]): TssSerialsValidation;

  export function isTssSlug(slug: string): boolean; // slug.startsWith('tss-')
  ```

**Exact validation rules (pin these in tests):**
- `name`: required, trimmed non-empty, ≤ 100 chars.
- `email`: required, trimmed, ≤ 254, matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- `phone`: strip `+91`/`91` prefix and all `[^\d]`, then require exactly 10 digits starting `[6-9]` → `/^[6-9]\d{9}$/`. (`+91 98213 09060` and `9821309060` both valid; 9-digit, letters, and landlines starting 0/2 rejected.)
- `company`: optional; when present trimmed ≤ 100 chars.
- Note sanitisation (reuse SP-2): strip `[\u0000-\u001F\u007F]`, trim, cap 300.

- [ ] **Step 1.1:** Write failing tests in `scripts/order-status-test.mjs` (plain `node`, `assert`, zero deps — mirror `sara-topics-test.mjs` style): run `node scripts/order-status-test.mjs` and see "Cannot find module" fail.
- [ ] **Step 1.2:** Implement `lib/order-status.ts` with the exact signatures + rules above (copy the SP-2 `sanitizeNote` approach; `buildTimeline` mirrors `sarvadnya-advanced/lib/status-history.ts:84`; note `$push` typing casts the same way `lib/mongodb-utils.ts` does for SP-2).
- [ ] **Step 1.3:** Run `node scripts/order-status-test.mjs` — all assertions pass (one per rule: 6 validation accept/reject cases, note sanitisation, actor default/override, timeline order + `from` derivation + empty history, plus `validateTssSerials`: valid serial accepted+trimmed, blank serial rejected with slug-keyed error, unknown slug ignored, `<>` stripped, 65-char serial rejected).
- [ ] **Step 1.4:** Add `test:order-status` script; run `npm run typecheck` — exit 0.
- [ ] **Step 1.5:** Commit (public identity):
  ```bash
  git add lib/order-status.ts scripts/order-status-test.mjs package.json
  git -c user.name="unknown" -c user.email="ankitmali2017@gmail.com" commit -m "feat(cart): order status module + customer validation (SP-3)"
  ```

---

### Task 2: `/api/cart/order` — accept + validate + persist `customer`, write the `created` hop

**Files:**
- Modify: `app/api/cart/order/route.ts`

**Interfaces:**
- Consumes: `validateCustomer` from Task 1.
- Produces: response now includes `customer` (echoed, for Razorpay `prefill`); persisted doc gains `customer` + `statusHistory: [{to:'created', at, actor:'system'}]`.

- [ ] **Step 2.1:** After the existing items-shape checks (route line 68–74) and **before** `repriceOrderItems`, parse `body.customer`:
  ```ts
  const customerResult = validateCustomer((body as { customer?: unknown }).customer);
  if (!customerResult.ok) {
    return NextResponse.json({ ok: false, error: 'Please complete your details.', errors: customerResult.errors }, { status: 400 });
  }
  ```
- [ ] **Step 2.2:** After `repriceOrderItems` succeeds (and `totals.lines` is known), validate TSS serials server-side against the repriced TSS lines:
  ```ts
  const tssSlugs = totals.lines.filter((l) => isTssSlug(l.slug)).map((l) => l.slug);
  // NEW: no priced TSS item may lack a serial — 400 with slug-keyed errors.
  const serialsResult = validateTssSerials((body as { tssSerials?: unknown }).tssSerials, tssSlugs);
  if (!serialsResult.ok) {
    return NextResponse.json({ ok: false, error: 'Enter the TSS serial number(s) for your TSS item(s).', errors: serialsResult.errors }, { status: 400 });
  }
  ```
  Carry `serialsResult.value` through (empty object `{}` when no TSS lines).
- [ ] **Step 2.3:** Pass `customer: customerResult.value` and `tssSerials: serialsResult.value` into the `insertOne` doc (line 127–147) and add to that same doc:
  ```ts
  statusHistory: [{ to: 'created' as const, at: now, actor: 'system' as const }],
  ```
  (`now` is the same `new Date()` already used for `createdAt`/`updatedAt`.)
- [ ] **Step 2.4:** Echo `customer: customerResult.value` and `tssSerials: serialsResult.value` in the success JSON response (after `persisted`).
- [ ] **Step 2.5:** Verify: `npm run typecheck` exit 0; `node scripts/cart-test.mjs` still 31/31; manual probe `curl -s -X POST localhost:3000/api/cart/order -H 'content-type: application/json' -d '{"items":[],"customer":{"name":"A","email":"x"}}'` → 400 `Your cart is empty.` **before** hitting customer validation (ordering intact).
- [ ] **Step 2.6:** Commit:
  ```bash
  git add app/api/cart/order/route.ts
  git -c user.name="unknown" -c user.email="ankitmali2017@gmail.com" commit -m "feat(cart): capture + validate checkout customer on order create (SP-3)"
  ```

---

### Task 3: `/api/cart/verify` — append the `verified` hop (same atomic update)

**Files:**
- Modify: `app/api/cart/verify/route.ts`

**Interfaces:**
- Consumes: `orderStatusChangeUpdate` from Task 1.
- Produces: response gains `customer` (from the stored order) for the receipt; the existing `updateOne` (route line 106–122) appends `{ to:'verified', actor:'system', note:'Payment <paymentId> verified' }`.

- [ ] **Step 3.1:** Replace the current `$set`-only update with ONE op built from the Task 1 builder — `orderStatusChangeUpdate('verified', { at, actor:'system', note: \`Payment ${razorpayPaymentId} verified\` })` spread alongside the existing `razorpayPaymentId` set:
  ```ts
  const chg = orderStatusChangeUpdate('verified', { note: `Payment ${razorpayPaymentId} verified`, actor: 'system' });
  await db.collection('orders').updateOne({ razorpayOrderId }, {
    $set: { ...chg.$set, razorpayPaymentId },
    $push: chg.$push,
  } as never);
  ```
  Keep the `isIgnoredRequest` gate and the catch-when-DB-down exactly as-is.
- [ ] **Step 3.2:** Echo `customer` in the success response: `customer: (typeof stored?.customer === 'object' && stored.customer) ? normalizedCustomer(stored.customer) : null` — normalize defensively (name/email strings, phone string) so a pre-feature order (`customer` missing) returns `null`, never `undefined`. Also echo `tssSerials` defensively: `tssSerials: (typeof stored?.tssSerials === 'object' && stored.tssSerials) ? stored.tssSerials : null` — a pre-feature order returns `null`.
- [ ] **Step 3.3:** Verify: `npm run typecheck` exit 0; static guard `npm run check:demo` PASS (no `/demo` string introduced).
- [ ] **Step 3.4:** Commit:
  ```bash
  git add app/api/cart/verify/route.ts
  git -c user.name="unknown" -c user.email="ankitmali2017@gmail.com" commit -m "feat(cart): verified status hop with payment note on verify (SP-3)"
  ```

---

### Task 4: `CheckoutContents.tsx` — buyer details card, Pay gating, Razorpay prefill

**Files:**
- Modify: `app/(site)/checkout/CheckoutContents.tsx`

**Interfaces:**
- Consumes: `validateCustomer` (client-side; module is dependency-free), `data.customer` from Task 2's response.
- Produces: `{ items, customer }` POST body; `prefill: { name, email, contact }` in the Razorpay options.

- [ ] **Step 4.1:** Add a **"Your details"** card (`section` + `aria-label="Your details"`) as the FIRST block inside the `lg:grid-cols-[1fr_360px]` left column (above the Order summary section, route line 261–276); on mobile it stacks naturally above the summary. Fields: Name*, Email*, Phone*, Company (optional). Every input: `aria-invalid`, `aria-describedby` pointing at a live error `<p id=... role="alert">` when invalid; teal focus ring (`focus-visible:ring-[#006569]`); 360px-safe layout (two-column name/phone on sm+, stacked below).
- [ ] **Step 4.2:** Local state `{ name, email, phone, company }` + a `useMemo` computing `validateCustomer(...)` on every keystroke; show per-field errors only after the field has been touched OR Pay was attempted (avoid error spam on first keypress — match the site's `localityNote` style).
- [ ] **Step 4.3:** Gate the Pay button: add `!customerValid` AND `!serialsValid` to the existing `disabled` condition (route line 202) and, when either is invalid, render a hint under the button: "Add your details above to continue." (reuse the `role="status"` error block styling).
- [ ] **Step 4.3b (TSS serial capture, owner 2026-10-03):** For every order-summary line whose slug passes `isTssSlug`, render a **"TSS Serial Number \*"** text input inside that line's `SummaryLine` (below the qty stepper): placeholder like "e.g. your Tally serial", `aria-invalid` + `aria-describedby` → live per-line error `<p role="alert">`. State is `serialBySlug: Record<string,string>` held in `CheckoutContents` (NOT in cart storage), passed down as `serial={serialBySlug[line.slug]}` + `onSerialChange(slug, value)`; `serialsValid` = `validateTssSerials(serialBySlug, tssSlugs).ok` where `tssSlugs` derives from `totals.lines.filter(l => isTssSlug(l.slug))`. PayButton receives `serialsValid` + serial map as props.
- [ ] **Step 4.4:** Change the POST body `{ items }` → `{ items, customer: { name, email, phone, company: company || undefined }, tssSerials: serialBySlug }`; set `prefill: { name: data.customer?.name ?? '', email: data.customer?.email ?? '', contact: data.customer?.phone ?? '' }` in the Razorpay options (route line 158).
- [ ] **Step 4.5:** Verify: `npm run typecheck` exit 0. Manual dev-server probe at 360px: card renders, Pay disabled initially, valid details enable it, invalid email shows inline error + Pay stays disabled, a TSS line without a serial keeps Pay disabled until its serial is filled.
- [ ] **Step 4.6:** Commit:
  ```bash
  git add "app/(site)/checkout/CheckoutContents.tsx"
  git -c user.name="unknown" -c user.email="ankitmali2017@gmail.com" commit -m "feat(checkout): buyer details card gates Pay and prefills Razorpay (SP-3)"
  ```

---

### Task 5: Receipt shows buyer name + email (payment-record completeness)

**Files:**
- Modify: `app/(site)/checkout/success/VerifyResult.tsx`
- Modify: `app/(site)/checkout/success/Receipt.tsx`

**Interfaces:**
- Consumes: `customer` from Task 3's verify response.

- [ ] **Step 5.1:** In `VerifyResult.tsx`, thread the verified `customer` (name + email) AND `tssSerials` into `<Receipt>` props: `customer?: { name?: string; email?: string } | null` and `tssSerials?: Record<string, string> | null`.
- [ ] **Step 5.2:** In `Receipt.tsx`, render a small "Bought by" block (name / email) only when `customer?.name || customer?.email` is present — a localhost/pre-feature receipt with `null` customer prints nothing extra. When `tssSerials` is present, render each `slug: serial` as a small "TSS Serial" line (per item). Mobile-safe text sizes; add to the print-scoped `.demo-receipt-page`-equivalent so nothing new leaks outside the receipt card.
- [ ] **Step 5.3:** Verify: `npm run typecheck` exit 0; `npm run check:demo` PASS.
- [ ] **Step 5.4:** Commit:
  ```bash
  git add "app/(site)/checkout/success/VerifyResult.tsx" "app/(site)/checkout/success/Receipt.tsx"
  git -c user.name="unknown" -c user.email="ankitmali2017@gmail.com" commit -m "feat(checkout): receipt shows buyer name + email (SP-3)"
  ```

---

### Task 6: News post — international TallyPrime licenses (commit now, seed later)

**Files:**
- Modify: `scripts/seed_news.mjs` (add one post object to the `posts` array; **ASCII-only**, hyphens not em-dashes)

**Exact post (values pinned):**
```js
{
  slug: 'tallyprime-international-licenses',
  title: 'Using TallyPrime Outside India: International Licenses Explained',
  date: 'October 2, 2026',
  category: 'Tally Prime',
  description: 'Why a domestic Indian TallyPrime license stops working abroad permanently, and the upgrade or international license options for UAE, Singapore, UK and other regions.',
  tags: ['tallyprime international license', 'tally international edition', 'tally outside india', 'tally prime middle east', 'tally uae'],
  link: '/products',
  author: 'Sarvadnya Infotech LLP',
  content: `...`,
}
```
**Content:** condense the owner's paragraph, **verbatim meaning, no invented travel-policy details**: a domestic Indian TallyPrime license will not work permanently outside India; the India edition is blocked from activation/reactivation abroad; options = upgrade to the International Edition or purchase a designated international/regional license (examples: UAE, Singapore, UK). Add a 2–3 bullet list + a short "check with your Tally partner" closer + CTA line pointing at `/products`. All ASCII — use `->` or words, never `—`.

- [ ] **Step 6.1:** Insert the post into `scripts/seed_news.mjs` `posts` array (after the last post object, before the closing `];`). Add a `// CHANGE: 2026-10-02 — ...` header note.
- [ ] **Step 6.2:** Verify the file parses and stays ASCII: `node --check scripts/seed_news.mjs` exit 0; `LC_ALL=C grep -P '[^\x00-\x7F]' scripts/seed_news.mjs` → no output (only the existing `TallyCertificate.png`/UTF-8-safe strings exempt — confirm nothing new is non-ASCII).
- [ ] **Step 6.3:** Do **not** run the seed (Mongo unreachable on VPN). Note in the commit body: "seed run deferred — needs Mongo reachable".
- [ ] **Step 6.4:** Commit:
  ```bash
  git add scripts/seed_news.mjs
  git -c user.name="unknown" -c user.email="ankitmali2017@gmail.com" commit -m "feat(news): international TallyPrime licenses post (seed deferred, SP-3)"
  ```

---

### Task 7: E2E suite `/tmp/opencode/verify-payments.cjs` + full gates (public)

**Files:**
- Create: `/tmp/opencode/verify-payments.cjs` (Puppeteer, same stub posture as `verify-cart.cjs`: `/api/cart/order` + `/api/cart/verify` stubbed **in-browser** via request interception; real routes never called/mocked).

**Cases (extend the verify-cart posture; viewports 360/768/1440):**
1. Invalid customer (empty name, `a@b` email, 9-digit phone) → Pay **disabled** + inline per-field errors (assert each `<p role="alert">` text).
2. Valid customer → Pay enabled; **intercept** `/api/cart/order` and assert the POST body has `customer { name, email, phone, company }` exactly.
3. Company left blank → body has no company key (or `undefined` is dropped by JSON.stringify).
4. One real-route probe (NOT stubbed): POST `/api/cart/order` with invalid `customer` → HTTP 400 `{ ok:false, errors:{...} }` and no Razorpay order created (assert the route didn't 503/502 — i.e. it failed at validation, not at assertTestKeys/rate limit; run this FIRST in the suite while intercepting everything later).
4b. **TSS serial (owner 2026-10-03):** cart with a `tss-single-1yr` line → serial input visible in the line; Pay disabled until filled; blank serial → per-line error + intercepted POST never fires; filled → POST body has `tssSerials: { 'tss-single-1yr': '<serial>' }`. Cart WITHOUT TSS → no serial inputs + `tssSerials` absent/`{}` in the POST body. Real-route probe: POST with a TSS item and missing serial → 400 `Enter the TSS serial number(s)...`.
5. Stubbed Razorpay success → success page renders receipt with the buyer name + email ("Bought by" block) + TSS serial line(s).
6. Orders with no customer (pre-feature) → verify response `customer: null` → receipt renders without the block, no crash.
7. Hydration + lazy-load probes: zero hydration errors, zero horizontal overflow at 360px, drawer + checkout stepper still green (re-run `verify-cart.cjs` 58/58 + `verify-checkout-stepper.cjs` 26/26 after all UI edits).

- [ ] **Step 7.1:** Write and run `/tmp/opencode/verify-payments.cjs` against `next dev` (dev server on this machine; Mongo down — price fallback path). All cases green.
- [ ] **Step 7.2:** Full gates: `npm run typecheck` 0 · `npm run check:demo` PASS · `npm run test:cart` 31/31 · `npm run test:order-status` PASS · re-run `verify-cart.cjs` + `verify-checkout-stepper.cjs` → unchanged.
- [ ] **Step 7.3:** Update `daily logs/2026-10-02.md` (append this session's SP-3 section) and `daily logs/excel logs.csv` row 29. Commit docs:
  ```bash
  git add "daily logs/2026-10-02.md" "daily logs/excel logs.csv"
  git -c user.name="unknown" -c user.email="ankitmali2017@gmail.com" commit -m "docs: SP-3 payments design + implementation plan logged"
  ```
- [ ] **Step 7.4:** Push BOTH remotes (§13):
  ```bash
  git push origin main && git push new-origin main
  ```

---

### Task 8: Nested — generalise `statusChangeUpdate` (actor) + `lib/order-status.ts`

**Files:**
- Modify: `sarvadnya-advanced/lib/status-history.ts` — extend the builder's opts with `actor?: string` (defaults to `STATUS_ACTOR`), keeping the existing 22-test behaviour identical.
- Create: `sarvadnya-advanced/lib/order-status.ts` — reuses the generalised builder (nested AGENTS.md §10: Orders must reuse `statusChangeUpdate`, not re-implement it).
- Modify: `sarvadnya-advanced/scripts/status-history-test.mjs` — add order-status cases.
- Modify: `sarvadnya-advanced/package.json` — `test:all` already runs `status-history-test.mjs`; no new script needed if cases live in the same file.

**Interfaces:**
- Consumes: `statusChangeUpdate`, `buildTimeline` from `./status-history`.
- Produces:
  ```ts
  export const ORDER_STATUSES = ['created', 'verified', 'refunded', 'fulfilled'] as const;
  export type OrderStatus = (typeof ORDER_STATUSES)[number];
  export function isValidOrderStatus(s: string): s is OrderStatus;
  // actor: 'admin' — the admin panel's writes; flow writes happen in the PUBLIC repo.
  export function orderStatusChangeUpdate(to: OrderStatus, opts?: { note?: string; at?: Date }): StatusChangeUpdate;
  export { buildTimeline };
  export type { StatusEvent, TimelineEntry };
  ```

- [ ] **Step 8.1:** Update `statusChangeUpdate(to, opts)` signature in `status-history.ts` to accept `actor?: string` (event.actor = `opts?.actor ?? STATUS_ACTOR`). Existing TSS callers pass nothing → still `'admin'`.
- [ ] **Step 8.2:** Create `sarvadnya-advanced/lib/order-status.ts` per the interfaces above (ASCII-safe, `// CHANGE: 2026-10-02 — SP-3` header).
- [ ] **Step 8.3:** Add tests to `sarvadnya-advanced/scripts/status-history-test.mjs`: (a) `isValidOrderStatus` accept/refuse all 4 + junk, (b) `orderStatusChangeUpdate` sets status + push shape, actor `'admin'`, note sanitised, injectable `at`, (c) `buildTimeline` on order histories with derived `from`. Run `npm run test:status` (22 + new) — all green.
- [ ] **Step 8.4:** `npm run typecheck` (nested) — exit 0. Then public `npm run typecheck` + `npx tsc --noEmit --listFiles | grep -c 'sarvadnya-advanced'` → **0** (exclude intact).
- [ ] **Step 8.5:** Commit in the NESTED repo (explicit identity, no push):
  ```bash
  git -C sarvadnya-advanced add lib/status-history.ts lib/order-status.ts scripts/status-history-test.mjs
  git -C sarvadnya-advanced -c user.name="ankit-sarvadnya" -c user.email="ankit@tallycertified.com" commit -m "feat(payments): order status vocabulary + actor-generalised audit builder (SP-3)"
  ```

---

### Task 9: Nested — `app/api/admin/payments/route.ts` (GET ledger + POST status/note)

**Files:**
- Create: `sarvadnya-advanced/app/api/admin/payments/route.ts`
- Modify: `sarvadnya-advanced/lib/mongodb-utils.ts` — add `updateOrderStatus(id, status, note?)` (mirror `updateTssRenewalStatus`: `findOneAndUpdate` `returnDocument:'after'`, the single `as never` boundary cast lives here).

**Interfaces:**
- Consumes: `orderStatusChangeUpdate`, `isValidOrderStatus`, `buildOrderTimeline` from Task 8.
- **GET** `?status=&from=&to=&q=&page=&limit=` → `{ items, total, page, totalPages }`:
  - filter: `status` (valid via `isValidOrderStatus`, else 400), `from`/`to` (ISO date strings → `createdAt: { $gte/$lte }`, unparsable → 400), `q` → `$or` regex against `orderId`, `customer.name`, `customer.email`, `customer.phone` (case-insensitive, escaped);
  - pagination: `page` ≥ 1, `limit` 25 default / max 100; `sort: { createdAt: -1 }`;
  - **projection omits `ip`** (`{ _id: 0, ip: 0 }` — PII decision, spec §4.4); items serialised with `serializeData` (Dates → ISO) per sibling routes; the page's pagination UI derives `totalPages` from `total`.
- **POST** `{ id, status, note? }` → 200 `{ ok, order, timeline }`:
  - `ObjectId.isValid(id)` else 400; `isValidOrderStatus(status)` else 400; `note` optional (cap 300);
  - `updateOrderStatus(id, status, note)` → `null` ⇒ 404 (missing order), else `timeline: buildOrderTimeline(order.statusHistory)`;
  - **no DELETE handler** (owner reframing); **no buyer-field editing** (status+note only).

- [ ] **Step 9.1:** Add `updateOrderStatus` to nested `lib/mongodb-utils.ts` (same shape as `updateTssRenewalStatus`, actor flows from the order-status module's default `'admin'`).
- [ ] **Step 9.2:** Create the GET/POST route per the interfaces; follow sibling conventions (dynamic export, no per-route auth — `proxy.ts` guards all `/api/admin/*`, body parsing + 400/404 shapes from `app/api/admin/prices/route.ts` and `tss-renewals/route.ts`).
- [ ] **Step 9.3:** Verify nested `npm run typecheck` exit 0; public `npm run check:demo` PASS (no `/demo` string in new code). Local API smoke test impossible (Mongo) — code-review pass + Vercel on push.
- [ ] **Step 9.4:** Commit (nested identity, no push):
  ```bash
  git -C sarvadnya-advanced add lib/mongodb-utils.ts app/api/admin/payments/route.ts
  git -C sarvadnya-advanced -c user.name="ankit-sarvadnya" -c user.email="ankit@tallycertified.com" commit -m "feat(payments): admin ledger API + status/note update, no delete (SP-3)"
  ```

---

### Task 10: Nested — `/admin/payments` ledger page (table + modal + XLSX)

**Files:**
- Create: `sarvadnya-advanced/app/admin/payments/page.tsx`
- Modify: `sarvadnya-advanced/app/admin/AdminSidebar.tsx` — add `{ label: 'Payments', href: '/admin/payments', icon: '<credit-card path>' }` after the Prices entry (line 42).

**Interfaces:**
- Consumes: `GET /api/admin/payments` (Task 9), `buildOrderTimeline` (Task 8).
- **Ledger page:** filter bar (status select from `ORDER_STATUSES` + "All", from/to date inputs, `q` text input, Apply + Reset), read-only table (created, orderId, customer name/email/phone/company, item count + first item, **TSS serial(s) — join `tssSerials` values for TSS items**, amount in ₹ — the nested repo has **no** public cart `formatINR`; use a small local helper like the prices page's `toRupees(paise).toLocaleString('en-IN')`), status badge, pagination (`PAGE_SIZES` + `getPageNumbers` patterns from `submissions/page.tsx`).
- **Detail modal:** full items list + totals, razorpay ids, timeline rendered via `buildTimeline` (same newest-first UI as `tss-renewals` modal, `from: null` → "created as"), and a **status-change form**: select `refunded`/`fulfilled` + note + Save (POST to Task 9; on 200 refresh list + show the fresh timeline). Buttons disabled while the request is in flight; unchanged-status re-click must NOT fire (SP-2's duplicate-event bug).
- **XLSX export:** button → `fetch('/api/admin/payments?export=1&<current filters>&limit=...')` — actually reuse the submissions pattern: one GET that returns **all filtered rows** (export: set `limit` high or a dedicated `export=1` that ignores pagination), then `XLSX.utils.json_to_sheet(rows)` (paise → rupees, camelCase → readable headers), `book_append_sheet`, `writeFile('payments_<date>.xlsx')`.

- [ ] **Step 10.1:** Create the ledger page per the interfaces (copy pagination/table/alert patterns from `submissions/page.tsx`, modal/timeline patterns from `tss-renewals/page.tsx`).
- [ ] **Step 10.2:** Add the sidebar entry.
- [ ] **Step 10.3:** Nested `npm run typecheck` exit 0. No local run (Mongo) — Vercel validates.
- [ ] **Step 10.4:** Commit (nested identity, no push):
  ```bash
  git -C sarvadnya-advanced add app/admin/payments/page.tsx app/admin/AdminSidebar.tsx
  git -C sarvadnya-advanced -c user.name="ankit-sarvadnya" -c user.email="ankit@tallycertified.com" commit -m "feat(payments): admin ledger page with status/note update + XLSX export (SP-3)"
  ```

---

### Task 11: Nested — `/admin/payments/summary` page (totals + print + XLSX)

**Files:**
- Create: `sarvadnya-advanced/app/admin/payments/summary/page.tsx`
- Modify: `sarvadnya-advanced/app/admin/payments/page.tsx` — add a small tab switcher `Ledger | Summary` linking both routes (matches "2 pages" wording; summary page links back to the ledger).

**Interfaces:**
- Consumes: `GET /api/admin/payments` (Task 9) with the same filter bar.
- **Summary:** filter bar (status/from/to/q — same state shape as the ledger), totals cards: orders count, sum `amountPaise`, sum `gstPaise`, sum `discountPaise`, average order (paise → the same local ₹ helper pinned in Task 10). Print/Save-as-PDF via `window.print()` scoped to the summary card area (reuse the receipt's scoped-print trick — hide sidebar + chrome, keep the totals card); XLSX export of the filtered rows (same helper as Task 10).

- [ ] **Step 11.1:** Create the summary page + tab switcher + sidebar-tab wiring (no sidebar change needed — one entry covers both; summary links back).
- [ ] **Step 11.2:** Nested `npm run typecheck` exit 0. Local run blocked (Mongo) — Vercel validates on push.
- [ ] **Step 11.3:** Commit (nested identity, no push):
  ```bash
  git -C sarvadnya-advanced add app/admin/payments/summary/page.tsx app/admin/payments/page.tsx
  git -C sarvadnya-advanced -c user.name="ankit-sarvadnya" -c user.email="ankit@tallycertified.com" commit -m "feat(payments): summary + export page with print/PDF and XLSX (SP-3)"
  ```

---

### Task 12: Final verification + dual-remote push (public) + nested commit verification

- [ ] **Step 12.1:** Public gates (final): `npm run typecheck` 0 · `npm run check:demo` PASS · `npm run test:cart` · `npm run test:order-status` · `verify-payments.cjs` + `verify-cart.cjs` (58/58) + `verify-checkout-stepper.cjs` (26/26).
- [ ] **Step 12.2:** Nested gates: `npm run typecheck` exit 0 · `npm run test:status` (22 + new order cases) green.
- [ ] **Step 12.3:** Public push both remotes (§13):
  ```bash
  git push origin main && git push new-origin main
  ```
- [ ] **Step 12.4:** Nested repo — confirm clean tree, confirm commits present, **no push**:
  ```bash
  git -C sarvadnya-advanced status --porcelain        # empty
  git -C sarvadnya-advanced log --oneline -3
  ```
- [ ] **Step 12.5:** Update AGENTS.md (public §12 cart table + news entry) and nested AGENTS.md (§10/§11) with the SP-3 additions + dates. Commit both repos (public pushed both remotes; nested committed only).
- [ ] **Step 12.6:** Confirm the isolation rules still hold: `git check-ignore -v sarvadnya-advanced` resolves; `git status --porcelain | grep -c sarvadnya-advanced` → 0; `npx tsc --noEmit --listFiles | grep -c 'sarvadnya-advanced'` → 0.
- [ ] **Step 12.7:** Tell the owner: `node scripts/seed_news.mjs` still deferred (VPN); seed at next Mongo-reachable moment. Remind: rotate Razorpay TEST keys before go-live.

---