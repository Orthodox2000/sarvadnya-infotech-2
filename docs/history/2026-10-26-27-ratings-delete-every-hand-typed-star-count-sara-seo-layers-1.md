# 32. 2026-10-26/27 — Ratings: delete every hand-typed star count · Sara SEO layers 1–2 · visitor analytics correctness

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

**Owner (ratings):** *"remove rating as most of them are fale, we only have testimonials and user rating as real,
also ensure those dashboard rating and auto moving and not manual."*
**Owner (Sara SEO):** approved **layers 1 and 2 only** — indexable guide pages + the free TSS expiry checker.
**Owner (analytics):** *"AI/bot seperation r visitor list [is wrong]"*, raised while comparing the admin panel
against Search Console.

#### 32.1 Ratings — everything hand-typed was removed, not "corrected"

The site carried at least five star figures and **none could be traced to a review record**: `4.8/120`
(Gold), `4.7/85` (Server), `4.9/34` (`/contact`), `4.9/200` (Tally on WhatsApp), `4.6/55` (Backup for
Tally) — repeated across **nine** "Most Popular Products" sidebars, **three** Product JSON-LD nodes and
**one** LocalBusiness node. The database holds **four** reviews. A "corrected" number would still be typed
by hand, so the whole class was deleted.

| Surface | Before | After |
| :--- | :--- | :--- |
| 9 × "Most Popular Products" sidebar | `rating: '4.8', reviews: '120'` per row + a gold star SVG + "(120 reviews)" | **product name only** — the rows are links, not ratings |
| `lib/seo.ts` `productJsonLd()` | optional `aggregateRating` parameter | **parameter removed** — no Product node can emit a rating |
| `lib/seo.ts` `localBusinessRatingJsonLd()` | built the `4.9/34` AggregateRating for `/contact` | **function deleted**; `localBusinessJsonLd()` carries address/phone/areaServed only |
| `/contact` "Visit Our Office" card | `4.9` + five amber stars + "(34 reviews)" + JSON-LD | rating block **and** JSON-LD removed; the map stays |
| gold / server / silver / tallydrive / tss pages | `aggregateRating` passed wherever a figure was displayed | **no call site passes it** — no per-product review records exist, so omission is the only honest markup |

Files: `app/(site)/cloud/{aws,windows,tallycloudaccess,backup-for-tally}/page.tsx`, `app/(site)/hrms/page.tsx`,
`app/(site)/contact/page.tsx`, `app/(site)/products/{gold,server,silver,tallydrive}/page.tsx`, `lib/seo.ts`.
The rationale comment block above `productJsonLd()` now also records **why** there is no rating (so a
future reviewer does not "fix" it back in).

#### 32.2 The one rating that survives — `lib/rating-summary.mjs` (+ `.d.mts`)

Pure ESM, zero deps, hand-written `.d.mts` (same house pattern as `lib/email-autoreply.mjs` /
`lib/careers-referral.mjs` / `lib/sara-guard.mjs`):

- `normalizeRating(value)` — accepts a number **or** a numeric string (a DB import or admin edit can leave
  `"5"`), returns **`null`** for anything outside 1–5. `null` is a real state: an imported Google review may
  carry no stars, and inventing one is fake social proof.
- `summariseRatings(reviews)` — `{ average, count }` from the reviews that **actually** have a rating, or
  **`null` when nothing is rateable**. Callers must render nothing in that case, never a default.
- `formatRating(summary)` — one decimal (`"4.5"`), null in → null out.

`app/components/CustomerReviews.tsx` is now the **only** place a rating appears, and it **computes** it:

- header average from `summariseRatings(reviews)`, where `reviews` is the same list the wall renders
  (`/api/reviews`, falling back to `staticReviews`) — so adding, editing or deleting a review moves the
  number by itself and "from N reviews" can never exceed the cards shown;
- `aria-label="4.5 out of 5 stars from 4 reviews"` so the number is machine-readable;
- `StarRating` renders a **partial** star (two stacked rows, gold clipped to `average / 5`) — a computed
  average lands on values like 4.5 and rounding up would overstate the reviews;
- cards use the same `normalizeRating()` gate as the average, so a card can never show stars the average
  ignores.

#### 32.3 `scripts/schema-audit.mjs` rewritten around the new rule (8 groups, dependency-free)

Still the **third** entry in `test:all` (`npm run check:schema`):

1. `aggregateRating` appears **nowhere** in `app/` or `lib/`.
2. **No hand-typed star figure** anywhere — rule `\b(rating|reviews)\s*:\s*['"\`]\d`, so TS annotations
   (`rating: number`) and log strings stay legal while `rating: '4.8'` fails.
3. The permitted path must **exist and actually be used**: `lib/rating-summary.mjs` must export the three
   helpers **and** `CustomerReviews.tsx` must import it and call `summariseRatings()` — otherwise group 1
   would pass simply because nothing displays a rating at all.

Plus the pre-existing groups: one Product builder only, `itemCondition` on every Offer, the three permanent
omissions (`hasMerchantReturnPolicy` / `shippingDetails` / `priceValidUntil`) absent from source, `/products/server`
emits no Offer while every priced page emits one, prices derive from `payablePaise / 100`, TallyDrive's node
name matches its Offer, TSS Offers carry `itemOffered`, `sku`s unique.

New `scripts/rating-summary-test.mjs` (**18 assertions**, `npm run test:ratings`, last entry in `test:all`):
invalid/edge inputs, numeric strings, out-of-range rejection, the "nothing rateable → `null`" contract,
one-decimal rounding, and a mixed list ignoring unrated reviews instead of treating them as zero.

#### 32.4 Sara layer 1 — `/learn-sara` became an indexable hub, chat moved to `/learn-sara/chat`

The knowledge that answers visitors in chat was invisible to Google because `/learn-sara` was a `noindex`
client-side chat screen.

| Route | What it is | Indexable |
| :--- | :--- | :--- |
| `/learn-sara` | server-rendered **hub**: 10 guide cards, tool CTA, chat CTA | **yes** |
| `/learn-sara/<topic>` | one **guide per Sara topic** — the real answer, its follow-up Q&A, sibling links | **yes** |
| `/learn-sara/chat` | the chat UI (moved here verbatim, 631 lines) | **no** (`noindex` in `chat/layout.tsx`) |

One source of truth: `lib/sara-topics.ts` gained `description?` on `Topic` (meta description + hub teaser)
and exports `topicSlug()`, `SaraGuide`, `saraGuides`, `getSaraGuide()`, `getAllSaraGuideSlugs()`. The guide
body is **exactly** the answer Sara speaks in chat — nothing was rewritten or invented for SEO.

- `app/(site)/learn-sara/[topic]/page.tsx` sets `dynamicParams = false`, so a hand-typed slug **404s**
  instead of rendering a near-miss page.
- JSON-LD: a literal `Article` node (the shared `articleJsonLd()` hard-codes `/news/${slug}`), a
  `BreadcrumbList`, and `FAQPage` **only when the topic has follow-ups** (the ERP 9 topic has none and
  correctly emits none).
- `app/components/SaraGuideBody.tsx` renders the chat-flavoured markup (`[[Label|/url]]`, `**bold**`,
  `` `code` ``, lists) **on the server** and deliberately has **no `"use client"`** — a guide page must not
  ship a client bundle to display static text.
- `app/(site)/learn-sara/layout.tsx` was `git rm`'d: its old `noindex` metadata would have poisoned the
  whole subtree, hub and guides included.

#### 32.5 Sara layer 2 — `/tools/tss-expiry-checker`

The useful half of the query space the guides already answer.

- The **interactive** part is only the date input and the verdict (`TssExpiryChecker.tsx`: client `useState`,
  pure arithmetic, **no storage, no network, nothing sent**).
- **Every explanatory fact is static server-rendered HTML** so it is crawlable and cannot drift: where the
  date lives (`F1 (Help) > Settings > License > Manage License`), what stops when TSS lapses (e-invoicing,
  e-way bill, GST filing, GSTR-2A/2B download, bank payments, Remote Access / WhatsApp reports), how to
  renew (`Alt+R` when it is due, or `F9` from Manage License, 1 or 2 years, then **update the licence**), and
  the ERP 9 closure (**16 August 2026**).
- No day counts, no discounts, no "bonus validity" — the four claims removed in §31 stay removed, and the
  page's 5-question `FAQPage` is built from the same audited wording.
- `app/(site)/tools/page.tsx` hub created so the checker's breadcrumb (Home / Tools / TSS Expiry Checker)
  resolves to a real page instead of a 404.

**Wiring:** `app/sitemap.ts` re-adds `/learn-sara` (indexable again) plus `/tools`, `/tools/tss-expiry-checker`
and **all 10 guide URLs generated from `getAllSaraGuideSlugs()`** — so the sitemap cannot list a guide that
does not exist and a new topic appears automatically; the chat route is **excluded**. `app/api/search/route.ts`
`STATIC_PAGES` gained "Learn Sara: TallyPrime guides" and "TSS Expiry Checker (free tool)", which also flow
into `SITE_MAP` for the AI fallback. Four descriptions were trimmed (`payroll`, `reports`, `shortcuts`,
`/tools`) so the new pages produce **no new `check:seo` warnings** after `CONTACT_SUFFIX` (+39 chars).

#### 32.6 Visitor analytics — three independent defects, all measured against the live collection

1. **Crawlers stored as humans (write side).** `parseDevice()` in `lib/visitors.ts` only knew
   `bot|spider|crawler|slurp|curl|wget|headless|puppeteer|phantom|preview`. Live evidence: **16** docs of
   `facebookexternalhit/1.1` (Meta's link-preview fetcher), **2** of `Google-NotebookLM` and **2** of
   `(compatible; Dataprovider.com)` were stored as `device.type: 'unknown'` and therefore counted as people —
   one of them occupied **17 sessions**. `BOT_UA_PATTERN` is now an **exported string**, grouped so a reader
   knows why each token is there: classic crawlers · link unfurlers / social previewers · AI / answer-engine
   crawlers (`chatgpt`, `openai`, `gptbot`, `oai-searchbot`, `claude`, `anthropic`, `perplexity`, `cohere`,
   `ccbot`, `bytespider`, `notebooklm`, `googleother`, `google-extended`, `mediapartners`) · SEO / monitoring /
   security scanners (`ahrefs`, `semrush`, `mj12`, `dotbot`, `dataprovider`, `bitsight`, `pagespeed`,
   `lighthouse`, `uptime`, `pingdom`, `censys`, `shodan`, `nmap` …) · headless renderers · plain HTTP clients
   (`curl`, `wget`, `okhttp`, `python-requests`, `axios`, `node-fetch`, `undici`, `java/` …).
   **Deliberately excluded: bare `whatsapp`, `telegram`, `linkedin`, `twitter`, `pinterest`, `discord`** —
   those words also appear in **in-app browsers used by real customers**, and WhatsApp traffic in India is
   large. Each product's *crawler* is still caught by the `bot` token (`LinkedInBot`, `Twitterbot`,
   `Pinterestbot`, `TelegramBot`).
2. **Historical rows reclassify at READ time (no migration)** — see nested §22; the write-side fix only helps
   from the next deploy, and the collection already held thousands of misclassified rows.
3. **Hidden-tab page views were discarded.** `VisitorProvider.send()` returned early when
   `document.visibilityState !== 'visible'` and the path was **thrown away** — someone opening a Google result
   in a background tab (mobile especially) was never recorded at all. The path is now parked in
   `pendingPathRef` and flushed by the `visibilitychange` listener the moment the tab becomes visible; the
   beacon is still **not** sent while hidden (that rule was correct), it is simply no longer lost.

Measured live after the read-side reclassification: **human sessions 781 / bot sessions 547**; **unique humans
695** (was 712) and **unique bots 297** (was 279) — exactly the crawler rows moving tabs. KPI last 24 h **8**
(was 5 when it windowed on `firstSeen`), 7 d **97**.

**On the GSC gap:** GSC clicks are Google Search clicks only, while the panel counts **every** source (direct,
WhatsApp, referral, AI assistants) — so the panel should read *higher* than GSC, not lower. That inversion is
what made these defects worth chasing.

#### 32.7 `/contact` map — the grey box was a CSP omission

`next.config.js` allowed only `https://www.google.com` in `frame-src`, but the fallback `mapSrc` is
`https://maps.google.com/maps?q=…&output=embed`. A browser console probe showed
*"Framing 'https://maps.google.com/' violates … frame-src"*, so the page shipped a grey box.
`https://maps.google.com` was added — header-only change (the map is a plain embed, nothing else touched).

#### 32.8 Verification (all measured)

- `npm run typecheck` **exit 0** (after `rm -rf .next` — the deleted `learn-sara/layout.tsx` left stale route types).
- `npm run build` **exit 0** with **no dev server running**: `/learn-sara` **static**, `/learn-sara/[topic]`
  **10 prerendered paths**, `/learn-sara/chat`, `/tools`, `/tools/tss-expiry-checker` all built.
- `check:h1` / `check:seo` / `check:schema` / `check:demo` **PASS** (only pre-existing SEO description-length
  warnings); `security:check` **ALL CHECKS PASSED**.
- `npm run test:all` **EXIT 0** — sara 19/19 (deployed site), sara-local 49/49, sara-guard 51/51, sara-catalog
  37/37, cart 32/32, order-status 36/36, dates 9/9, payments 45/45, payments-gateway 26/26, seo-links 18/18,
  referral 19/19, **ratings 18/18**.
- Puppeteer `/tmp/opencode/verify-sara-seo.cjs` → **122/122** against `next start`: hub + all 10 guides + both
  tool pages 200/indexable/one `<h1>`/correct canonical; chat 200 + `noindex`; unknown guide **404**; hub
  `ItemList` with 10 real URLs + `BreadcrumbList`; guide `Article` + `BreadcrumbList` + `FAQPage` with correct
  `mainEntityOfPage` and **no raw `[[ ]]` / `**`**; ERP 9 guide emits no `FAQPage`; tool `FAQPage` (5 questions) +
  `BreadcrumbList`; expired/active/cleared verdicts all work; **the typed date is written to neither
  localStorage nor sessionStorage**; zero horizontal overflow at 360 px on all 5 route types; the sitemap lists
  the hub, the tool and all 10 guides and **not** the chat.
- Homepage rating invariant `/tmp/opencode/check-rating-live.cjs` → **3/3**: `/api/reviews` returns 4 rateable
  reviews, `summariseRatings()` gives **4.5**, the homepage label reads exactly `4.5 out of 5 stars from 4
  reviews`, and no hand-typed figure (`4.8`, `4.7`, `4.9`, "120 reviews" …) remains in the page text.

#### 32.9 Don't break

- **The only permitted rating** is the review-wall average from `lib/rating-summary.mjs`. Never add
  `aggregateRating` to a Product or LocalBusiness node, and never type a star figure — `check:schema` fails on
  both, and it also fails if the wall stops calling `summariseRatings()`.
- `lib/sara-topics.ts` remains the single source for the guides **and** the chat fallbacks. Editing a guide
  means editing the topic, which also changes what Sara says in chat — intentional.
- `/learn-sara/chat` must keep its `noindex`; `/learn-sara` and `/learn-sara/<topic>` must stay
  server-rendered and indexable. **Do not put `noindex` metadata back on a `learn-sara/layout.tsx`** — it would
  cover the guides too.
- `SaraGuideBody.tsx` and every guide page stay **server** components; adding `"use client"` defeats the point.
- The TSS checker stays arithmetic-only and storage-free. Do not add analytics, cookies or a "save my date"
  feature.
- `BOT_UA_PATTERN` must stay **byte-identical** in `lib/visitors.ts` (frontend) and `lib/visitor-groups.ts`
  (nested admin); the nested suite asserts it (674 chars).
