# Sarvadnya Infotech — Agent Instructions

> **This file is loaded into context on every single turn. Keep it small.**
> It holds the rules that change behaviour. Everything else lives beside it:
>
> | Need | Read |
> | :--- | :--- |
> | How a subsystem works, why it is built that way | **`docs/ARCHITECTURE.md`** (§1–§14, pointers below) |
> | What shipped in which session, what was measured, what was left undone | **`docs/HISTORY.md`** |
> | Migration runbook | `docs/MIGRATION-VERCEL.md` |
> | Admin-vs-frontend split | `docs/ADMIN-VS-FRONTEND-ISOLATION.md`, `docs/NESTED-ADMIN-REPO.md` |
>
> **Append new session notes to `docs/HISTORY.md`. Never grow this file with history.**
> If you add a rule here, add the reasoning to `docs/ARCHITECTURE.md` and link the §number.

---

## 1. What this is

Marketing + commerce site for **Sarvadnya Infotech LLP**, a Tally Certified Partner (since 2008) in
CBD Belapur, Navi Mumbai. Next.js App Router, TypeScript, Tailwind 4, MongoDB. Customers buy Tally
licences, TSS renewals, cloud hosting and add-ons; the site also runs a blog, a Tally knowledge hub,
a product catalogue, a cart with Razorpay checkout, careers with a referral system, and an AI assistant
("Sara").

Two deployments, two repos:

| Tree | Deploys | Contains |
| :--- | :--- | :--- |
| this repo (root) | public site | `app/(site)/`, `app/components/`, `lib/` — **no admin panel**, `app/admin/` + `lib/admin-auth.ts` were physically removed |
| `sarvadnya-advanced/` | admin panel | `app/admin/` + `app/api/admin/`, own git repo, **gitignored here**, own remote |

---

## 2. Non-negotiables

Each line is a rule that has already been broken once. The reasoning and the incident are linked.

### 2.1 Build discipline
- **Never run `npm run dev` and `npm run build` in the same tree at the same time.** Production artifacts
  land in the same `.next/` the dev server is reading → every route 500s and builds fail with
  `PageNotFoundError: Cannot find module for page: X`. Recover: stop dev → `rm -rf .next` → rebuild.
- To verify a build while a dev server must stay up, build an **isolated copy** (`/tmp/opencode/build-check*`).
- Kill stray servers **by PID**. `pkill -f "next start -p NNNN"` matches the invoking shell's own command
  line and kills the shell.
- This box has ~7.5 GB RAM. `next.config.js` sets `experimental.cpus: 1`. Builds take 2–4 min. One OOM
  (exit 137) has already been hit.
- System `node` is snap v10 and **cannot** run this project. A modern Node must be first on `PATH` (set in
  **both** `~/.bashrc` and `~/.profile` — Ubuntu `.bashrc` early-returns for non-interactive shells).
- Verify versions against **`package-lock.json`**, never `node_modules` (which drifts ahead). Currently
  `next` 15.5.x. **Next 16 must not be adopted** until `proxy.ts` is deleted or re-scoped — see 2.4.

### 2.2 There is no dev database
`MONGODB_URI` points at the **live** cluster and `next dev` reads it too. Every local page load, curl,
Puppeteer run and form test **writes to production**.

- `lib/visitors.ts` exports `isIgnoredIp()` / `isIgnoredRequest()`. Loopback is always ignored; add a LAN
  address to `VISITOR_IGNORE_IPS` to silence it. Every form route and every capture route gates on it
  **before** writing or emailing.
- `isPublicIp()` is **not** a substitute — it only skipped geo/DNS enrichment, the document was still written.
- A seed is not verified until it is verified **on the live domain**, or with `MONGODB_URI` forced to the
  production cluster. A local seed run proves nothing.

### 2.3 Money
- **Prices are server-authoritative.** `/api/cart/order` accepts only `{items:[{slug,qty}]}` and recomputes
  from the DB/catalog. No route reads a client amount. `/demo` is the same, and is hard-locked to **test
  keys** (`assertTestKeys()`) regardless of `RAZORPAY_MODE`.
- **Payment verification is the HMAC and only the HMAC** — `crypto.timingSafeEqual` over
  `order_id|payment_id`, amount read from the stored order. `orders.fetch` in the demo path is **display
  only** and must never feed the verdict.
- `lib/cart/payment.ts` is mode-aware and **fail-closed**: `getMode()` returns `test` unless `RAZORPAY_MODE`
  trims to exactly `live`; `assertKeys()` then requires the key prefix to match the mode or the route
  returns **503 before any other work**. The `rzp_test_`/`rzp_live_` test is a **prefix** test, never a
  substring test.
- The cart webhook (`/api/cart/webhook`) verifies the signature over the **raw** body before parsing, and is
  idempotent (`created` → `verified` only). It is a backstop for the client-return path, not a replacement.
- **The return policy is never published** — not in page copy, not in an email, not in structured data.
  Licences are returnable in limited cases with no time limit and no cooling-off; that is internal
  knowledge only.
- `hasMerchantReturnPolicy`, `shippingDetails` and `priceValidUntil` are **deliberately absent** from
  structured data. The rationale comment sits above `productJsonLd()` in `lib/seo.ts`. An absent field that
  looks like an oversight will get "fixed" back in — read the comment first. `check:schema` enforces it.

### 2.4 Nested repo `sarvadnya-advanced/`
- It is a **fork with its own origin**, gitignored here. It can never appear in a commit in this repo.
- **Read its own `AGENTS.md` before editing anything there.** Different deployment, different rules.
- Commits there go to its repo. **Never push either repo without being asked.**
- The forks have **drifted**. Shared files (`lib/email.ts`, `lib/mongodb.ts`, `lib/visitors.ts`,
  `app/(site)/`, `next.config.js`, `lib/seo.ts`, `app/api/chat/route.ts`) must be **hand-ported** and
  individually verified — never copied wholesale. Its chat route is **CRLF**: edit in place, never `cp` over.
  Its `app/(site)/` is dead weight but stays until a build proves nothing imports it.
- `tsconfig.json` **excludes** it on purpose. `include` is recursive and `"@/*"` resolves against **this**
  root, so a nested `import '@/lib/…'` resolves to a file that was deleted here. Removing the `exclude`
  produces ~167 foreign files and ~10 errors, and the tempting "fix" corrupts live frontend routing.
- **`proxy.ts` in this repo is a dormant admin guard.** It is inert only because Next 15 defines
  `MIDDLEWARE_FILENAME` and has no `PROXY_FILENAME`. It is the Next 16 name for `middleware.ts` — adopting
  Next 16 would activate an admin guard in the **public** deployment. What actually runs here is
  `middleware.ts` (legacy redirects, CORS, the segment-exact `/admin` 404 block — no admin-pass logic).

### 2.5 Remotes
`origin` = `sarvadnyawebteam/sarvadnya-live.git` (canonical) · `secondary` = `Orthodox2000/sarvadnya-infotech-2.git`.
Push discipline is **both**: `git push origin main && git push secondary main`. `secondary` is not a
historical mirror — never assume it has history `origin` lacks. `git remote -v` is the source of truth.

### 2.6 Brand
- Primary is **teal `#006569`**, with `#045A57` / `#033B38` for depth and the light tints
  `#E5F4F4` `#D4EAEA` `#B8DEDE` `#DDEFEF` `#C5E3E3` `#D9E8E8` `#E8F0F0` for backgrounds/borders/chips.
  Use the `teal-NN` Tailwind scale.
- **`green-*` and `emerald-*` are retired as the brand.** Do not reintroduce them or hex greens.
- **WhatsApp green `#25D366` (hover `#1ebe5b`) is preserved** and must not be changed.
- Palette ids in `lib/palettes.ts` and `app/(site)/products/product-theme.ts` are referenced by stored
  product data — they must stay stable.

### 2.7 Accessibility / layout floor
- Minimum verified width is **360 px**; every new component is checked there.
- One `<h1>` per page (`check:h1`).
- No horizontal overflow anywhere. The desktop navbar row has a measured budget — **do not widen it
  without re-probing 1024–1280 px**, including the fallback-font state (production first paint is wider
  than the webfont).

---

## 3. Working mode — owner directive (2026-10-30)

> *"Act strictly as a single-turn code generation assistant. Do not invoke external linting agents, do not
> run iterative build checks, and do not call automated skills unless explicitly requested. Provide the
> design code directly."*

- Answer in **one pass** and return the design/code directly — no subagent fan-out, no multi-round
  self-review.
- **No external linting/audit agents on your own initiative** (`eslint`, `tsc --noEmit`, `check:h1|seo|schema|alt|demo`,
  `security:check`).
- **No iterative build verification** — do not loop `npm run build`, do not start `next dev`/`next start`
  to inspect your own work.
- **No automated skills** unless the user names one.
- Verification runs **only when the user explicitly asks** (or the change is genuinely destructive). When
  they do ask, the full regime below applies unchanged.
- **Precedence:** this mode overrides "Validate Before Completing" and the build discipline in 2.1 for
  *default* runs. Those rules are not deleted — they resume on request.

---

## 4. Developer guidelines

- **Surgical updates.** Prefer a targeted replace over a full-file rewrite of an existing file.
- **Never assume.** If scope, a requirement or an implementation detail is unclear, ask. Do not fill gaps
  with guesses.
- **Minimal code / use libraries.** Do not over-engineer; 30 lines plus a dependency beats 200 hand-rolled.
- **Document every change.** Inline `// CHANGE: <date> — <reason>` on non-obvious edits, plus a session
  note in `docs/HISTORY.md` (and the daily log / tracker row the project keeps).
- **Validate before completing.** Re-read the original request, re-check every item, confirm each
  requirement is actually satisfied. Requirements get silently dropped during scope — do the second pass.
- **Accessibility:** high contrast, visible focus states, real labels, `alt` on meaningful images
  (`alt=""` only for genuinely decorative ones — `check:alt`).
- **Performance:** this site targets low-end phones. `IntersectionObserver` / Page Visibility gating,
  `content-visibility: auto`, `React.memo` + `useCallback` on hot components, `next/image` with `sizes`
  and intrinsic dimensions. `will-change`/`translateZ(0)` sparingly.

---

## 5. Codebase rules that bite

### 5.1 Client vs server
- **Never import a `node:crypto`- or SDK-backed module from a client component.** It works in dev and dies
  at `next build` with `UnhandledSchemeError`. Concretely: `lib/cart/payment.ts` (Razorpay + crypto) is
  server-only; a client cannot use it (and `RAZORPAY_KEY_ID` is not a `NEXT_PUBLIC_` var, so it would
  always read false anyway). This exact defect shipped once in `shop-browser.tsx`.
- Hydration: read `localStorage`/`window`/`document` **only inside `useEffect`**, never during render. This
  has caused real hydration bugs here (the cart store, the consent banner, the referral prefill).
- Server components must not carry `"use client"` just because they render rich text — `MarkdownBody`,
  `LessonFigure`, `SaraGuideBody` are deliberately server-only so pages don't ship a bundle for static text.

### 5.2 SEO plumbing
- `seoMetadata()` in `lib/seo.ts` is the single metadata helper for ~50 pages. It **must** declare
  `images` in **both** `openGraph` and `twitter` (with `summary_large_image`) — a page-level `openGraph`
  object without `images` **replaces** the file-based `app/opengraph-image.tsx` and silently kills the share
  card everywhere. It takes `contactSuffix` to opt out of the phone/location tail on reference pages.
- `articleJsonLd()` takes **`path`** for anything outside `/news` — `slug` gets `/news/` prefixed and
  produced double-slash URLs that GSC flagged. A slash inside `slug` now fails `check:schema`.
- **Ratings are computed, never typed.** The only permitted rating on the site is the review-wall average
  from `lib/rating-summary.mjs` (`summariseRatings()` → `{average,count}` or **`null`** when nothing is
  rateable). `aggregateRating` appears nowhere in `app/` or `lib/`, and no `rating: '4.8'` literal may
  exist. `check:schema` fails on both, and also fails if the review wall stops calling `summariseRatings()`.
- Sitemap entries are generated from the same source that renders the pages (`getAllLessonSlugs()`,
  `getAllSaraGuideSlugs()`) so it cannot list a page that does not exist.

### 5.3 Content truth
- **Nothing invented.** If a fact is not in Tally's published documentation or on-page, it does not ship —
  not in a blog post, not in a lesson, not in structured data, not in a chat reply.
- **TSS facts have exactly one correct form** and are pinned in `scripts/sara-topics-test.mjs`: the expiry
  date lives at `F1 (Help) > Settings > License > Manage License`; `Alt+R` appears *when renewal is due*
  (there is **no** day count); duration is 1 or 2 years with **no advertised discount**; the licence must be
  **updated** before the new date shows; ERP 9 TSS renewal closed **16 August 2026**. If Tally changes a
  fact, update the prose **and** the assertions together.
- Payroll is native to TallyPrime (`F11 > Show more features > Maintain Payroll`) — it is not an add-on.
- News seed content is **ASCII-only**. A non-ASCII dash has silently corrupted `scripts/seed_news.mjs`
  before. `bodyMd` literals in the curriculum use double quotes or template literals.

### 5.4 Sara (the AI assistant)
- **She is a business consultant, not a programmer.** She never emits TDL, scripts, SQL, HTML or code
  blocks (a ```` ```text ```` fence is fine — that is a menu path). She **asks before she tells**: one
  short answer plus a question, not an essay.
- `lib/sara-guard.mjs` is the **single source** of "no code / ask first / no CTA on an off-topic answer /
  neutral discount answer". `applyConsultantGuard()` must stay wired into **both** provider branches
  (Gemini and Groq) before the reply leaves the server. Do not re-implement these rules inline.
- `lib/sara-catalog.mjs` generates the product/guides prompt blocks from the same data the site renders.
  **`GROQ_INPUT_TOKEN_BUDGET` is a hard ceiling** (Groq free tier is 8,000 TPM on the whole request) —
  that is why the shop ships names plus a few deep links instead of 107 descriptions. Re-adding detail
  re-breaks every chat request.
- Gemini keys come in `AIza`, `AQ.` and `ya29.` forms. **Only a `ya29.` prefix is an OAuth token**;
  everything else goes in `x-goog-api-key`. Testing "not `AIza`" sent `AQ.` keys as Bearer tokens → 401 →
  the chat appeared dead.
- Offline fallback matching (`lib/sara-topics.ts` + the catalogue) uses **word boundaries and stopwords**,
  never substrings — substring scoring once answered "how r u" with a list of products.

### 5.5 Capture, drafts, email
- Chat transcripts and non-submitted drafts are **first-party**, stored with a **30-day TTL**
  (`ensureCaptureIndexes()` creates the TTL indexes; `npm run db:indexes:chats` is the manual path).
- **`lib/draft-contact.mjs` is the only definition of a valid email.** A **chat** draft is captured only
  when a real email is present; every other entry point stays ungated (a form draft is progressive by
  design). The gate runs client-side and again server-side; the server must **merge the stored fields**
  before refusing, because the tracker posts only a diff.
- Email is **destination-first**: each page routes to its own recipient from `EMAIL_DESTINATION_RECIPIENTS`;
  a destination with no configured recipient **saves the submission and emails nobody** (opt-in by design).
  Adding a new destination key without configuring it is a silent no-op — check this when wiring a new form.
- Sending is **exactly-once** via a unique `jobKey` claim in the `email_queue` ledger. A retried or
  duplicate POST gets `deduped: true` and never fires a second email — including the client auto-reply,
  which rides the same claim.
- The client auto-reply is **OFF by default** (`AUTO_REPLY_ENABLED=0` is a kill-switch). Recipients are
  resolved **server-side only**; a client can never control them.
- **Transactional careers mail is not marketing mail.** Job applications, resume saves and the signup
  welcome are **not** gated by `AUTO_REPLY_ENABLED`; they send through `sendEmailDirect()` /
  `sendTemplatedEmail()`. The `careers` destination is seeded to `hr@sarvadnyainfotech.com`
  (`npm run seed:careers-recipient`) and is still opt-in.
- **Never route a one-time code through `sendTemplatedEmail()`** — it applies the global CC, which would leak
  an OTP to a third party. `lib/email-otp.ts` owns its Resend call via `getEmailConfig()`.
- Before sending, never promise the return policy.

### 5.6 Catalogue and `/shop`
- `lib/tdl-catalog.mjs` is the **one source** for the shop, imported by `lib/sara-catalog.mjs` and the
  search API. Never re-declare shop items in a second list.
- **No prices and no single/multi-user split in the shop data** — the source spreadsheet's price columns
  were deliberately dropped.
- `/shop#<slug>` is a **public contract** (JSON-LD, nav, search, Sara all link to it), so a deep link must
  render its target even when the slug is beyond the first page of results.
- "Buy" is a **quote request** routed to the existing `addons` destination. `/shop` never touches the cart
  or Razorpay.
- `askSara()` is **prefill-only**; the visitor presses send. `SupportButton` is the only owner of the chat's
  open state.

### 5.7 Isolation guards
- `/demo` and the live cart must never reference each other. `npm run check:demo` greps both directions and
  is part of `test:all`; run `npm run test:demo-guard` (negative controls) explicitly, never inside a suite.
- `/demo` **is** committed (24 files). Its safety is `assertTestKeys()`, not obscurity.
- `/checkout`, `/demo` and `/shop` are `noindex` / excluded from the sitemap where appropriate.

---

## 6. Commands

```bash
npm run dev            # turbopack dev server (never alongside a build)
npm run build          # production build (never alongside dev)
npm run typecheck      # tsc --noEmit

# static guards (cheap, no network, no DB)
npm run check:h1       npm run check:seo       npm run check:schema
npm run check:alt      npm run check:insights-svg   npm run check:demo
npm run security:check

# deterministic suites (no LLM, no deployed site)
npm run test:cart      npm run test:order-status    npm run test:dates
npm run test:payments  npm run test:payments-gateway
npm run test:sara-local npm run test:sara-guard     npm run test:sara-catalog
npm run test:ratings   npm run test:draft-contact   npm run test:referral
npm run test:seo-links npm run test:news-verify

npm run test:all       # everything above, minus the two that need a live server
```

- `test:all` is an `&&` chain — if it stops early, later suites did **not** run. A red `test:all` that
  reports "one failure" is often the first of many silently skipped.
- `scripts/sara-test.mjs` (inside `test:all`) calls the **deployed** site and judges the answer with another
  LLM. It flakes; a single failure there is not evidence about local code. Re-run it.
- `scripts/careers-loading-test.mjs` and the Puppeteer probes need a dev/start server and are **not** in
  `test:all`.
- Seeds and maintenance: `node scripts/seed_news.mjs`, `scripts/seed_careers.mjs`, `scripts/seed_prices.mjs`,
  `scripts/migrate-string-dates.mjs`, `scripts/migrate-blob-store.mjs`, `scripts/backfill-referral-codes.mjs`
  — the migration scripts are **dry-run by default** (`--apply` to write) and take credentials from the env
  only. **Never hard-code a secret in a script** (that happened, and the values had to be purged from git
  history with a force-push).

---

## 7. Where the detail lives

| Topic | Section in `docs/ARCHITECTURE.md` |
| :--- | :--- |
| Framework, performance engineering, component catalogue | §1–§3 |
| Sara (chatbot), `sara-topics`, learn page | §4 |
| Chunked upload / Vercel payload limit | §5 |
| Email system, recipients, auto-reply, ledger | §6 |
| Brand and theme values | §7 |
| First-party chat/draft capture, tracking ignore list | §8 |
| Build discipline, Node version, lockfile | §9 |
| Nested admin deployment, `proxy.ts` landmine | §10 |
| `/demo` scaffold, receipts, cart stepper | §11 |
| Site-wide cart, DB prices, checkout, payments admin | §12 |
| Dual-remote deployment | §13 |
| `/careers` split layout | §14 |

Everything about **when** and **why** a change was made — including the incidents that produced the rules in
section 2 above — is in **`docs/HISTORY.md`**, newest first.

---

*This file was distilled on 2026-10-30 from a 355 KB `AGENTS.md` that was being re-injected into every
session. The prose was not deleted — it was moved to `docs/ARCHITECTURE.md` and `docs/HISTORY.md`. Do not
undo that split: keep this file under ~20 KB and put new detail in the `docs/` files.*
