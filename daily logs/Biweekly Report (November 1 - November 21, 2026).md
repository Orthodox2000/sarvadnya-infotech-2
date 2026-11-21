# Biweekly Report (November 1 – November 21, 2026)

**Period:** 1 – 21 November 2026 (21 days) ·
**Scope:** Website updates & maintenance (SEO, product pages, admin panel, performance, email templates) + brand collateral ·
**Sources:** `daily logs/2026-11-02.md` … `daily logs/2026-11-21.md`, `daily logs/excel logs.csv`, `docs/HISTORY.md` + `docs/history/`, `git log` (1–21 Nov), and live-domain probes recorded in those logs. No daily log exists for 1, 6–11 or 18 Nov; those dates are covered from git history below ·
**Status:** Internal — not for external circulation ·
**Previous report:** Biweekly Report (5 – 17 October 2026); Monthly Report (October 2026)

---

## At a Glance

1. **Website / platform:** 42 work items logged across SEO, product pages, checkout, campaign popups, admin panel, performance, email plumbing and the Learning Hub.
2. **Admin panel (`sarvadnya-advanced/`):** 6 commits — dashboard rebuilt, readjusted twice, header aligned, Payments module removed, email CC/branding synced.
3. **Public repo:** 59 commits between 2 and 20 November plus one commit on 21 November; all pushed to `origin` + `secondary`. **1 November had no commit and no daily log** — the previous working day, 31 October, closed the October monthly report (commit `c733a5f`).
4. **Committed and pushed on 21 November:** the final 20 November email/template batch (signature, licence-expiry templates, shared `.mjs` templates, README, docs) together with the four 21 November lead-acknowledgement and Learning Hub sessions — pushed to `origin` + `secondary`, redeploy pending.
5. **Collateral:** 9 brand/email/campaign assets produced or finalised; **no new Digital Content tracker rows (`DC-…`) were logged in this window**.
6. **Verification:** public builds passed on 3 Nov (173/173 pages), 13 Nov and 19 Nov (176/176 pages); admin build passed on 13 Nov; `check:modules` added with 98 assertions; careers-email suite 36/36; live MISS → HIT confirmed on 11 cached API routes on 20 Nov.
7. **Biggest risk still open:** the SEO click-rate checkpoint for 27 retitled URLs is **due today (21 November)** and has no recorded result yet.

---

## 1. Day-by-Day Coverage Map (1 – 21 November)

1. **1 Nov — no work logged.** No daily log and no commit exist for this date. The last commit before the window is `c733a5f` (31 Oct: October monthly report, md + pdf); nothing from 1 Nov is claimed in this report.
2. **2 Nov — four sessions, six public commits.**
   - `85c7c93` — preferred-source buttons on 14 content surfaces + both TallyPrime 7.2 spellings.
   - `4bcd5f7` — daily log + tracker row 86.
   - `8d1476c` → `8216633` — bare pill site-wide, then allow-list (`/tally-insights`, `/news`, `/tutorials`) + footer deeplink.
   - `9270c30` — one indexable page per module, CTR-focused titles, sitemap, `ModuleModal` commented out.
   - `05c7eb2` ("mta iamge added") — **TSS serial rule** `/^7\d{8}$/` in `lib/order-status.ts`, checkout input filter, root-layout `openGraph.images` declaration (superseded later that day by `364b20f`), and the October monthly PDF.
3. **3 Nov — nine public commits.** Owner artwork upload/rename (`444a154`, `05ec4a8`, `b6ddc0a`), 27-URL SEO click plan + shortcut lesson re-targeting (`364b20f`), Belapur 301 (`64c9b1a`) + verification (`28aa094`), six module pages + guard (`fc9aff4`), lock/voucher content and UI (`0d357c1`), and the deploy record (`6cf3284`).
4. **4 Nov — four public commits.** Owner's compressed `diwali.png` upload (`25a7f7e`), scoped CORP/CORS override (`0fbf783`), careers/email batch (`0f722ab`), and the daily-log/tracker/live-header record (`008be26`).
5. **5 Nov — twelve public commits.** Diwali popup first pass (`97ba363`), square artwork master (`3451702`), signature + CORP/CORS (`768f2e1`), signature refinements (`6e1da4b`, `8e895a5`, `c797d63`, `5fa70b1`, `99c916a`, `8210009`, `a024efa`, `ae6842d`), and the signature daily-log/tracker entry (`912657f`).
6. **6 – 11 Nov — quiet period.** No daily log and no commit in either repo. No work is attributed to these dates.
7. **12 Nov — seven public commits, recovered from git history because no daily log was written.** Team hero video + Solutions wording (`b0de7b3`), Best Seller stamp → ribbon → band behind text (`e09c2df`, `c09e7aa`, `2229f86`), both review rows marquee (`9c817c6`), single gallery photo at native ratio (`b9c6503`), `Nosky.png` tracked (`24bcf2c`).
8. **13 Nov — audit + admin remake.** Public `bf06597` + docs `de3c6c9`; admin `5ad534e`. Both builds exit 0.
9. **14 Nov — dashboard readjusted twice.** Public `632cfaa` / `22f4610`; admin `df00531` / `59aa329`; docs `4e0eebb`.
10. **15 Nov — dashboard header alignment.** Public docs `e3e4ee8`; admin `9e97a1c`.
11. **16 Nov — five public commits + one admin commit.** Greeting popup replaces Diwali (`633c14e`), admin Payments removed (`e52afce`, admin `8e6998d`), aggregate rating removed (`8755485`), `ev.png` + session guard (`36312ad`), popup CTA removed (`65c2943`).
12. **17 Nov — five public commits.** DMS route + visitor-session timing (`f57978c`), Footer landline build fix (`fd5f983`), third-level menu (`0d15e06`), slow enter/exit (`5e8c20c`), stale session-flag fix (`886bf78`). DMS SEO and the three audit articles were written into the seed the same day but not published.
13. **18 Nov — no daily log and no commit.** No work is attributed to this date.
14. **19 Nov — one public commit.** Image compression, self-hosted fonts and middleware matcher narrowing (`d4b08ae`), with the owner-requested 176/176-page build.
15. **20 Nov — four public commits.** ISR/API caching/bot-skip (`ff96b6e`), careers leak fix + copy/paste expiry email (`180c4eb`), live verification record (`5ee1e2a`), history split (`591f23f`). The final email/template batch was left uncommitted at report time and landed with the 21 November commit.
16. **21 Nov — four sessions, one public commit.** Lead acknowledgement receipt (Web Team sender, left-aligned enquiry receipt, enabled for every lead); Learning Hub thumbnail opens/autoplays the player; admin-added tutorial invisible because of mixed `createdAt` types plus a 1-hour edge cache; second tutorial hosted as a local MP4 and inserted through the admin API against the root live cluster. Docs, tracker rows 149–152 and this report were updated, then everything was committed to `main` and pushed to `origin` + `secondary`. The SEO click checkpoint for the 27 retitled URLs is due today and still has no recorded result.

---

## 2. Website Updates (42 items logged)

1. **WEB-001 — Google preferred-source buttons (2 Nov, SEO, Completed).**
   - Added `app/components/PreferredSource.tsx` using Google's standard declarative `google-add-preferred-source-btn` + `publisher.js`, with a Search Central deeplink fallback.
   - Mounted initially on 14 content surfaces, then reduced to **one site-wide mount**, then restricted to **Tally Insights / News / Tutorials** with a segment-exact allow-list; a small site-wide footer deeplink serves every other page.
   - Added Google hosts to CSP (`script-src`, `connect-src`, `img-src`, `font-src`, `frame-src`) and a short Google entry in `/privacy`.
   - Three owner clarifications were honoured in order: bare pill, no headings/deeplink in the button, then only the three content trees.

2. **WEB-002 — Both spellings of TallyPrime 7.2 (2 Nov, SEO, Completed).**
   - `SITE_KEYWORDS` and root metadata now carry both `TallyPrime 7.2` and `Tally Prime 7.2`; reaches ~49 pages via `seoMetadata()`.
   - Added a naming-equivalence FAQ to the curriculum (visible accordion + `FAQPage` JSON-LD) and keywords to Sara's offline matcher.
   - **No new product claim was introduced** — only the naming equivalence.

3. **WEB-002A — TSS serial format locked (2 Nov, Checkout, Completed).**
   - Owner rule: a TSS serial is **exactly 9 digits and starts with 7** (`/^7\d{8}$/`).
   - One definition, `TSS_SERIAL_RE` in `lib/order-status.ts`, is used by `validateTssSerials()` and re-checked by `/api/cart/order`, so the rule is server-authoritative; the client cannot bypass it.
   - Checkout input filters keystrokes and paste to 9 digits and adds `inputMode="numeric"`, `maxLength={9}`, `pattern="7[0-9]{8}"`, placeholder `e.g. 712345678`.
   - `scripts/order-status-test.mjs` re-pointed at the new rule (valid `712345678`, wrong prefix, 8-/10-digit, letters/dashes, `<`/`>` stripping, oversized); the old 64-character acceptance case was removed.
   - Deliberately **not** applied to `/api/tss-renewal`: that is a free-text enquiry form, not a purchase.

4. **WEB-003 — One indexable page per module (2 Nov, Product, Completed).**
   - Created `app/(site)/modules/[slug]/page.tsx`; `lib/modules.ts` exports `moduleHref()` as the single URL builder used by cards, nav, footer, search and Sara.
   - `ModuleModal.tsx` was **commented out, not deleted**, with restoration instructions in the file header, per owner request.
   - Rewrote listing + module titles for click-through; descriptions trimmed to the real 160-character budget including the contact suffix.
   - Sitemap `lastmod` now comes from each document's `updatedAt`/`createdAt`; no fake `new Date()`.

5. **WEB-004 — Single share image finalised (3 Nov, SEO, Completed, live).**
   - Diagnosed the owner's "image I never seen": `seoMetadata()` replaced the layout `openGraph` with a generated `/opengraph-image` card showing a letter "S".
   - Retired `app/opengraph-image.tsx` and `app/twitter-image.tsx`; after two intermediate states, owner-supplied `public/website-thumbnail.png` (**1280×720, RGB, no alpha**) became the one share image on every page.
   - `public/video-thumbnail.jpg` is now used **only** as the hero `<video poster>`; `check:seo` now fails if the declared share image file does not exist.
   - Live-verified after deploy: `og:image` and `twitter:image` both point at `/website-thumbnail.png`, declared 1280×720, file served 200 / 264,394 bytes.

6. **WEB-005 — SEO click plan from the 3-November GSC export (3 Nov, SEO, Completed, live).**
   - Data: 4–13 Oct **1,366 impr / 33 clicks / 2.42% CTR** → 26–31 Oct **4,722 impr / 47 clicks / 0.99% CTR**; 28-day total **154 clicks / 10,197 impressions / 1.51%**.
   - Diagnosis: the 29 Oct "action-first" rewrite had become **verb-first**, pushing searchers' own words out of the visible title head. New rule: **the query leads, the action goes in the tail**.
   - Retitled **27 URLs** (16 in code, 11 in MongoDB via new dry-run-by-default `scripts/update-news-seo.mjs`); two Belapur posts differentiated instead of competing.
   - Forecast stated as a model, not a result: the 27 URLs held 8,541 impressions / 63 clicks (0.74%); at 2.5% CTR that is **+151 clicks/month**. Checkpoint: 21 November.

7. **WEB-006 — Belapur cannibalisation retired (3 Nov, SEO, Completed, live).**
   - `/news/it-companies-in-belapur` (28 impr, 0 clicks, position 14.25) now 308s into `/news/cbd-belapur-it-companies-list` (610 impr, 10 clicks, position 6.52).
   - Added `RETIRED_NEWS_SLUGS` and a filter in `fetchNews()`, which covers listing, API, search, related posts and sitemap from one place; the DB document is kept for easy un-retiring.
   - Live verified: 308 → 200 in one hop, 0 retired-slug hits in sitemap / listing / search.

8. **WEB-007 — Shortcut lesson re-targeted (3 Nov, Content/SEO, Completed).**
   - The page had **708 impressions, 0 clicks, position 9.8** against ~68 queries.
   - Added a **Function Keys F1–F12 table**, **11 quick-reference rows**, **19 new FAQs (24 total)**, and rewrote title/description/keywords (7 → 32 keywords).
   - Nothing invented: every answer restates a mapping already validated against Tally's published shortcut reference. Two exam-style queries were deliberately left unanswered because they could not be confirmed.

9. **WEB-008 — Lock article + voucher lesson (3 Nov, Content, Completed).**
   - Added two narrower locks (GST period lock, e-invoice lock) to the lock-data article, framed as configured on top of access control — never as stock features. Seed verified live: 1 updated, 24 skipped, article date 3 Nov 2026.
   - Added a visible `## Standardize Voucher Entry` section + FAQ to the vouchers lesson.
   - Vouchers lesson also rebuilt line-by-line against Tally's own "Vouchers in TallyPrime" page: three voucher families, correct shortcut mappings, "Choosing the mode" section, 4 new FAQs.

10. **WEB-009 — Six vertical-solution module pages + consistency guard (3 Nov, Product, Completed).**
   - Curated details in `lib/module-details.ts`, one flat teal template, six simulators, DB video fallback merged with curated URLs (four of six pages now embed real videos).
   - New `npm run check:modules` with **98 assertions** covering fields, assets, video rule, simulator wiring, flat theme, section rhythm and one H1 per page.
   - Verified: typecheck 0, build 173/173, static guards + deterministic suites PASS, 360/414/768/1280 px zero horizontal overflow.
   - First build attempt hit a transient `MongoServerSelectionError` prerendering `/news`; retry succeeded 173/173.

11. **WEB-010 — Module UI refinements (3 Nov, UI, Completed).**
    - Video copy moved above the video/cards pair; `items-stretch` + `lg:auto-rows-fr` make four feature cards divide the video's height.
    - Container simulator renders from `md` up; phones get a "needs a wider screen" note.
    - `ModuleCard` image changed from fixed `h-40` to `aspect-[3/2]` so the artwork keeps its native ratio at every width.

12. **WEB-011 — `/diwali.png` cross-origin access (4 Nov, Config, Completed, live).**
    - Added a later `headers()` rule in `next.config.js` sending `Cross-Origin-Resource-Policy: cross-origin` + `Access-Control-Allow-Origin: *` for this one asset; rule order is load-bearing because Next merges headers with last match winning.
    - Owner's upload replaced the file 6,754,815 → **850,052 bytes**, still 1920×960; live `content-length` matched exactly.

13. **WEB-012 — Careers + email pipeline tightening (4 Nov, Careers, Completed).**
    - Resume saves are now **silent** — no company mail, no candidate mail, no global CC.
    - New `EMAIL_CC_DESTINATIONS`: global CC applies **only** to ticked destinations; empty list = no CC anywhere. Retry drain forwards the stored destination.
    - New shared `lib/email-brand.mjs` header/footer; every careers template now carries the hosted logo.
    - Referral welcome mail now names the referrer in both the body and a `Referred by` row, with escaping and blank-name omission.
    - Verified: typecheck 0, `test:careers-email` **36/36**, `security:check` PASS, public + admin builds exit 0.

14. **WEB-013 — Diwali greeting popup, first version (5 Nov, Feature, Completed).**
    - New `app/components/DiwaliPopup.tsx`, mounted once in `app/(site)/layout.tsx`; first visit only (`svd_diwali_2026` written at **open** time), 5-second auto-close, ✕ / backdrop / Esc dismissal, focus to ✕, no scroll lock, `/checkout` and `/demo` skipped.
    - One square card, `aspect-square w-[min(90vw,80vh,32rem)]`, `object-contain` — 324×162 px at 360 px, 512 px cap on desktop.

15. **WEB-014 — Diwali popup follow-ups (5 Nov, Feature, Completed).**
    - Auto-close removed (owner wanted it until closed); backdrop lightened to `bg-[#033B38]/30 backdrop-blur-[2px]`; page scroll locked while open.
    - Wide `diwali.png` shown at `≥ md`, square template below, via `matchMedia` in one effect (only one image is downloaded).
    - Pre-optimised WebPs (**110 KB square, 139 KB wide**) replaced 2.1 MB / 850 KB PNGs; a 457-byte `<head>` preload script fires on first visit only; constants moved to `lib/diwali-popup.ts` so preload `href` and `<img src>` cannot drift.

16. **WEB-015 — Shop "Best Seller" ribbon, three passes (12 Nov, Shop, Completed).**
    - In-card stamp badge → diagonal corner ribbon → band behind the text only.
    - Card buttons no longer wrap.

17. **WEB-016 — Homepage review wall + team hero + Solutions wording (12 Nov, Homepage, Completed).**
    - Both review rows now marquee on every screen size.
    - `/team` hero becomes a video slot for the Diwali 2026 video; Solutions menu wording changed.

18. **WEB-017 — Module gallery photo at native ratio (12 Nov, UI, Completed).**
    - A single gallery image now renders uncropped at its own aspect instead of being forced into a fixed crop.

19. **WEB-018 — Two-repo audit + dependency updates (13 Nov, Maintenance, Completed).**
    - Typecheck, six static guards and deterministic suites passed in both repos before any edit; found 5 rule violations and 2 documentation gaps.
    - Replaced retired `green-*`/`emerald-*` with `teal-700`; fixed admin active-nav icon that was teal on teal; bumped Next **15.5.28 → 15.5.29** (public) and **15.5.19 → 15.5.29** (admin), plus in-range updates to mongodb, resend, lucide-react, @vercel/blob, tailwindcss, radix-ui and geist.
    - **Next 16 deliberately not adopted** — `proxy.ts` would activate an admin guard in the public deployment.
    - Remaining advisories (14 public / 34 admin) left for an owner decision; no `npm audit fix --force`.

20. **WEB-019 — Admin dashboard remade (13 Nov, Admin, Completed).**
    - Replaced flat counters with headline KPIs, "Needs attention" action links, system health, grouped metrics, recent orders/leads and quick links.
    - `app/api/admin/stats/route.ts` rewritten with parallel queries and new fields, **no existing fields removed** (old test scripts depend on them); read-only, `visitorsLast24h` still windows on `lastSeen`, Site Visitors still unique humans.
    - Added loading skeletons, error banner with Retry and relative timestamps.

21. **WEB-020 — Dashboard readjusted (14 Nov, Admin, Completed).**
    - Owner: important stats were below the fold and there were too many dead modules.
    - Reordered to compact header → six-tile KPI row → recent orders + Needs attention → recent leads + "All totals".
    - Deleted System health panel, Quick-links footer and fifteen lifetime tiles; collapsed unique numbers into one `MiniStat` card.
    - Needs-attention rows with `count === 0` filtered out; empty state added; 10 px hint text moved to `slate-500` for AA contrast.
    - `app/admin/page.tsx` 790 → 707 lines.

22. **WEB-021 — Dashboard compactness follow-up (14 Nov, Admin, Completed).**
    - Owner: no payments or candidates above the fold; all stats visible on desktop without scrolling.
    - `StatCard` → `StatTile` (value + label only), **14 non-financial tiles in two rows** at `xl:grid-cols-7`.
    - Orders, revenue and careers figures moved to a bottom "Payments & careers" card; leads come before orders.
    - Warn colour (`text-amber-700`) only on TSS pending, bug reports 24 h and leads 24 h when non-zero.
    - `app/admin/page.tsx` 707 → 660 lines.

23. **WEB-022 — Dashboard header alignment (15 Nov, Admin, Completed).**
    - "Updated 18:32" caption was stacking under Refresh and lifting the button ~7 px out of line.
    - Caption is now inline **before** the Refresh button in one non-wrapping row; button padding 36 → 32 px; caption stays outside the button (not clickable, plain status text).
    - Arithmetic width check at ≥1024 / 640 / 360 px; no overflow.

24. **WEB-023 — Greeting popup replaces Diwali card (16 Nov, Feature, Completed).**
    - Owner-supplied `er.png` (1280×640) → `greeting-popup.webp` **66,070 bytes**; one 2:1 box `w-[min(90vw,160vh,56rem)]` on every width (324×162 at 360 px, 896×448 from 1280 px).
    - New visitor: immediate; returning visitor (old Diwali flag): 20-second timer; already-seen: never. Flag written at show time; storage-blocked tabs treated as first visit.
    - Renamed `DiwaliPopup.tsx` → `GreetingPopup.tsx`, `lib/diwali-popup.ts` → `lib/greeting-popup.ts`; old identifiers fully removed, demo-independence allow-list updated.

25. **WEB-024 — Admin Payments module removed (16 Nov, Admin, Completed).**
    - Deleted both payments pages, tabs and API route, plus the sidebar entry and six order/revenue fields from the stats API; every ledger order was a demo/test order.
    - Removed recent-orders panel, awaiting-payment row and four payment totals from the dashboard; bottom card is now a full-width Careers card.
    - No other admin screen was dropped; order-status helpers remain as audit utilities.

26. **WEB-025 — Homepage aggregate rating removed (16 Nov, Corrective, Completed).**
    - Owner reported a bogus "4.5 from 4 reviews" summary. Removed the computed header block from `CustomerReviews.tsx` while keeping review cards, per-card ratings and marquee.
    - Reinforces the standing rule: no hand-typed rating may appear anywhere on the site.

27. **WEB-026 — Greeting image, repeat fix, asset cleanup (16 Nov, Feature, Completed).**
    - Regenerated WebP from owner's `ev.png` (~65 KB); `er.png`, `diwali-popup-square.webp` and `diwali-popup-wide.webp` deleted as unused.
    - Added a `sessionStorage` guard so a visitor who already saw the card does not see it again 20 seconds later in the same tab session.

28. **WEB-027 — Popup CTA removed + DMS route source check (16 Nov, Feature, Completed).**
    - Removed the overlay button; the artwork itself is now the only in-card link to `/modules/document-management` and closes the popup on click.
    - Source check confirmed the DMS route existed in code but had not been pushed.

29. **WEB-028 — DMS route shipped + third navigation entry + visitor-session timing (17 Nov, Feature, Completed).**
    - Root cause of the live 404 was a **deployment gap**: curated DMS detail, template support, sitemap entry, nav link, brochure and settings normaliser were still uncommitted from 16 Nov.
    - Committed and pushed that source; confirmed live 200 afterwards.
    - Added Document Management under Solutions → Business Boosters in `Productbar.tsx`; popup, modules menu and boosters menu all resolve to the same curated entry.
    - Popup timing now reads the admin's `svd_vid` visitor cookie: no cookie → immediate; existing session → 20 s. The `<head>` script captures the cookie **before** `VisitorProvider` can create it, so first visits cannot be misclassified.

30. **WEB-029 — Vercel build failure and third-level menu fixed (17 Nov, Fix, Completed).**
    - First push reached both remotes but Vercel failed: an unclosed `<br>` in a newly committed Footer landline line broke SWC. Replaced with two separately dialable `tel:` anchors, one number per line, no slash.
    - Isolated build then passed: **compiled successfully, 173/173 pages, exit 0**.
    - Added a third-level branch to `Productbar.tsx` — the megamenu renderer previously walked only two levels, so the new DMS link would never have displayed. Rebuilt successfully again.

31. **WEB-030 — Popup animation + stale flag fix (17 Nov, Feature, Completed).**
    - Enter and exit both use `duration-700 ease-in-out`; one `GREETING_TRANSITION_MS = 700` constant drives class duration and unmount timer. `prefers-reduced-motion` unmounts immediately.
    - Bug: on the 3rd+ visit, a stale `sessionStorage` flag returned early and the 20 s timer was never scheduled. Fix computes `returning` first, resets the flag to `'0'` for repeat visitors, then schedules the timer. Rebuilt 173/173 pages.

32. **WEB-031 — DMS SEO + audit articles + price guard (17 Nov, SEO/Content, Partly done).**
    - Module page: meta title `Audit-Ready Documents in TallyPrime` (renders at exactly 60 chars with brand), description 146 rendered chars, new audit keywords, three features and two benefits stating the link-only storage model, three new FAQs feeding `FAQPage` JSON-LD.
    - Three new seed articles: `audit-preparation-checklist-small-business`, `attach-documents-in-tallyprime`, `audit-document-struggles-and-solutions` (6 / 7 / 5 FAQs, 8 tags each, all linking to the DMS module).
    - New `npm run check:dms-prices` wired into `test:all` — no DMS price anywhere in curated data, seed copy, brochure or nav/popup/sitemap/template.
    - **Pending:** the seed was deliberately not run (it writes to live); `node scripts/seed_news.mjs` publishes the three articles.

33. **WEB-032 — Image, font and Edge CPU pass (19 Nov, Performance, Completed).**
    - Middleware was the only Edge deployment; its catch-all matcher was burning Fluid CPU on every image, video, PDF, font and `_next/*` request in `iad1`. Narrowed to documents + `/api/*`, with static-extension exclusions that still allow dotted slugs such as `/news/tallyprime-7.2`.
    - Self-hosted Geist (variable 100–900) and Playfair Display (variable 400–900) in `app/fonts/`; `next/font/google` → `next/font/local`, same CSS variables, Google Fonts kept only as fallback.
    - `scripts/compress-images.mjs` (`npm run optimize:images`) re-encoded **59 rasters, 68.5 MB → 20.7 MB (−69.7%)**; names unchanged because they are a public contract. Added `cardbg.webp` / `mobilebg.webp` and lazy/eager loading on raw `<img>` tags.
    - Owner-requested build: **exit 0**, 48 s compile, **176/176 static pages**, middleware 34.7 kB. Fixed one JSX comment that initially broke the `/about` ternary.

34. **WEB-033 — ISR, CDN caching, bot skip and careers leak fix (20 Nov, Performance, Completed, live).**
    - `/news/[slug]` and `/modules/[slug]`: `force-dynamic` → `revalidate = 3600` + `dynamicParams = true`; one-hour staleness for admin edits explicitly accepted.
    - News lookup wrapped in React `cache()` (metadata + page share one query); `getRelatedNews()` uses a projected `.limit(3)` query.
    - New `lib/api-cache.ts` applies one CDN header to **11 public GET routes**; exact-path rules in `next.config.js` come after the global `no-store` rule (last match wins).
    - `/api/identify` returns **204** before rate-limit/parse/DB work for ignored IPs and known crawler UAs.
    - Fixed the root `/api/careers` leak: both `find({})` queries now use `{ visible: { $ne: false } }`.
    - Live verified: all 11 allowlisted routes **MISS → HIT**; `/api/health` and `/api/email/diagnostic` still `no-store` + MISS; `/api/careers*` return byte-identical JSON (MD5, 10,633 bytes); bot POST 204 in ~0.4 s.

35. **WEB-034 — Email templates consolidated + renewal flow (20 Nov, Email/Commerce, Committed 21 Nov).**
    - Created top-level `email-templates/`; moved `email-signature.html`, `email-autoreply.mjs`, `email-brand.mjs`, `email-careers.mjs` (plus their `.d.mts` files) out of `lib/`; updated imports and docs. Senders/ledger (`lib/email.ts`, `email-otp.ts`, `email-queue.ts`) deliberately stayed in `lib/`.
    - New `license-expiry-email.html`: Calibri, teal `#006569`, owner-verbatim copy, `$contact_first_name$` merge field, one "Renew Now" CTA → `/products`, no prices, "Team Sarvadnya".
    - Added `license-renewal` form type with an optional serial-number field; "Know More" → "Renew" on `/products/gold`, `/products/silver` and `/products/tallydrive` (desktop hero, mobile hero and Quick Links).

36. **WEB-035 — Email template corrections and copy/paste variant (20 Nov, Email, Committed 21 Nov).**
    - Owner's Diwali email added as `diwali-email.html`; a verbatim copy of the real Tally eDM added as `tally-rental-expiry-actual.html` (later deleted from the working tree).
    - Rules locked down: **no prices** (10% annual offer only), Facebook icon shown but never linked, no Twitter/X handle invented, "Team Sarvadnya" sign-off.
    - Added `license-expiry-email-copy-paste.html` with all-inline styling, real spacer rows, flat corners and the owner's final wrapper (32 px top/bottom gap via the wrapping `<td>`, 6 px card radius, 32×24 px inner cell).
    - Main template iterated through less rounding, outer padding, fluid width, 680 px cap, white background, classic Tally table pattern, teal background, no underlines, tagline removal and Gmail-safe spacer rows.

37. **WEB-036 — Shared email brand + signature scrollbar (20 Nov, Email, Committed 21 Nov).**
    - `renderBrandHeader()` lost the partner tagline and links the logo to `company.website`; `renderBrandFooter()` has no person name and uses five current legal routes from `company.website`.
    - Auto-reply and careers templates now sign off "Team Sarvadnya"; OTP template keeps its own minimal header and never uses global CC.
    - Signature horizontal scrollbar root cause: Outlook's Word renderer adds 24 px cell padding to a 100%-width table, and `overflow-x:hidden` on `<body>` forced `overflow-y:auto`. Fixed with real spacer rows + flanking 12 px gutter cells; zero overflow verified at 280–1440 px with and without forced wide fonts.

38. **WEB-037 — Session history split (20 Nov, Docs, Committed).**
    - `docs/HISTORY.md` was **454 KB**; now a **16 KB headline index** linking to **79 detail files** under `docs/history/`. All prose moved verbatim, nothing deleted.
    - One detail file + one index row per session is now the documented convention; references updated in `AGENTS.md`, `scripts/compress-images.mjs` and a news-page comment.

39. **WEB-038 — Lead acknowledgement receipt (21 Nov, Email, Committed).**
    - `email-templates/email-autoreply.mjs` now renders an enquiry **receipt**: Name, Email, Contact, Product, Date and a wrapping Message cell; new options with `service` kept as a product fallback and IST date formatting from `lib/email.ts`.
    - `email-brand.mjs` gained `align:'left'` (default still `'center'`) for the classic white shell / 24 px spacer rows / 12 px gutters / `width="600" align="left"` card, inline CSS only. Sign-off and footer read **Sarvadnya Web Team**.
    - `lib/email.ts` adds `AUTOREPLY_SENDER_NAME` + `withSenderName()`; reply-to pinned to `info@sarvadnyainfotech.com` with a safe fallback. `AUTO_REPLY_ENABLED` defaults **ON** (`1`) unless an admin setting/env sets `0`.
    - `lib/email-queue.ts` no longer drops the acknowledgement when a page has no internal recipient; the internal copy stays destination-first/opt-in and a skipped internal copy is recorded as `sent`, not `failed`. Sidebar forms use `skipCompanyCopy:true`.

40. **WEB-039 — Learning Hub: thumbnail opens the player (21 Nov, UI, Committed).**
    - In `app/(site)/tutorials/page.tsx` the thumbnail is now a real button calling `openDetails(tutorial)` with `aria-label` and a touch-visible play icon; "Explore" remains as a secondary path.
    - YouTube modal iframe changed from `autoplay=0` to `autoplay=1`, so a thumbnail tap starts playback instead of merely opening a paused player.

41. **WEB-040 — Admin-added tutorial invisible: mixed `createdAt` sort + edge cache (21 Nov, Fix, Committed).**
    - The new bank-import row held an ISO-string `createdAt` while older rows held BSON Dates; Mongo orders String below Date, so `sort({createdAt:-1})` put the newest video last. `fetchTutorials()` now normalises both shapes to an epoch number and sorts in JS, with no data migration.
    - `/api/tutorials` dropped `PUBLIC_API_CACHE` for `Cache-Control: no-store`, and the exact-path CDN allowlist entry was removed so a freshly added tutorial appears on the next page load.
    - Cluster mapping: the custom domain reads the root `.env` cluster; both Vercel aliases read a stale 6-row cluster. New learning content must be written to the root cluster.

42. **WEB-041 — Local MP4 tutorial + native player through the admin API (21 Nov, Content/UI, Committed).**
    - Hosted `public/videos/bank-statement-import-tool-demo.mp4` (17 MB) and its poster, added as a **second** tutorial with distinct title/description/tags via `POST /api/tutorials` against the root live cluster (id `6b016d23435c4027ad0442dd`); live feed went 7 → 8.
    - `isLocalVideo()` selects a native `<video controls autoPlay playsInline preload="metadata" poster>` and an "Open Video" CTA; YouTube entries keep the no-cookie iframe. Frontend and assets need a deploy before they go live.

---

## 3. Digital Content & Collateral (10 items)

*Report-local IDs below; these are **not** tracker `DC-…` rows. No new Digital Content tracker rows were logged between 2 and 21 November.*

1. **CL-001 — Company email signature (Completed, live).** Calibri, teal brand, brand-colour social icons, left-aligned white card, no border, no underlines, Facebook icon unlinked, no X; usable placeholders in the sign-off.
2. **CL-002 — Licence-expiry email, send-ready (Committed 21 Nov).** Owner-verbatim expiry/renewal copy, `$contact_first_name$`, one Renew CTA → `/products`, 10% offer only, `Team Sarvadnya`, classic Tally table pattern, teal background, Gmail-safe spacer rows.
3. **CL-003 — Licence-expiry email, browser copy/paste (Committed 21 Nov).** All-inline styling, owner's exact wrapper, 32 px spacer rows, 6 px card radius, 32×24 px inner cell.
4. **CL-004 — Diwali email template (Committed 21 Nov).** Owner-added HTML renamed from `test.html`, 480 px `/diwali.png` banner, merge field, real icons, Facebook unlinked.
5. **CL-005 — Actual Tally rental-expiry eDM copy (Reference, later deleted from working tree).** Wording, order, colours and tracking links preserved; Gmail proxy images replaced with real `mirror1.tallysolutions.com` URLs; no Facebook.
6. **CL-006 — Greeting artwork (Live).** `public/ev.png` master + `public/greeting-popup.webp` (~65 KB, 1280×640) used by the popup; no runtime reference to the old Diwali artwork.
7. **CL-007 — Diwali masters (Retained deliberately).** `public/diwali.png` (cross-origin embeds) and `public/diwali template 2026.png` (source artwork) kept; older WebPs removed.
8. **CL-008 — DMS brochure + three audit articles (Brochure available / articles pending seed).** `public/brochures/dms-module-brochure.pdf`; three SEO articles written into the seed but not published to the live news collection.
9. **CL-009 — Team Diwali video (Live).** `public/videos/team-diwali-2026.mp4` in the `/team` hero; separate from the greeting popup.
10. **CL-010 — Bank-statement import demo MP4 + poster (Committed 21 Nov, deploy pending).** `public/videos/bank-statement-import-tool-demo.mp4` (17 MB) and `bank-statement-import-tool-demo-poster.jpg` back the second Learning Hub tutorial, inserted through the admin API against the root live cluster; the assets ship with this commit and go live on redeploy.

---

## 4. Readiness & Weekly Target

1. **Product catalogue / brochure readiness:** no finished catalogue or brochure was added for the six product families named in the October report (Tally Customized Product, Tally Cloud, HRMS, Mobile App, Tally Updates, Other Services). The one new downloadable asset is the **DMS module brochure**.
2. **Weekly content target (2 creatives + 1 audio/visual):** no counts were logged for the November weeks, so the target cannot be scored from the tracker. Do **not** carry October's "Missed" verdict forward without new data.
3. **Social distribution:** no new Instagram / WhatsApp posts are recorded in the November logs. The two approvals pending in the October report (TallyPrime 7.2 flyer, Tally on Mobile post) remain **unverified** — no evidence they were cleared.
4. **Temporary campaign asset:** the greeting popup is still live by design and must be **removed manually** after the festival — delete `app/components/GreetingPopup.tsx` and its mount in `app/(site)/layout.tsx`.
5. **Paid media / lead capture:** no new campaign or UTM work was logged in this window.

---

## 5. Changes from the Previous Report (5 – 17 October)

1. **Scope grew:** from 7 website items + 8 digital items → **42 website items + 10 collateral items**.
2. **SEO moved from indexing to click conversion:** preferred sources, one URL per module, the owner's share image, 27 retitled URLs and the Belapur 308 replaced "remove old pages from index".
3. **Product depth:** six vertical-solution pages, a 98-assertion consistency guard, DB video fallback, and module UI fixes replaced the single Gate Pass module item.
4. **New admin workstream:** dashboard rebuilt, readjusted twice, header aligned, then Payments removed entirely — the October report had no admin workstream.
5. **New performance workstream:** Edge middleware narrowing, self-hosted fonts, 69.7% image compression, ISR, 11-route CDN caching and bot-skip did not exist in the October report.
6. **Email work deepened:** from letterhead/card drafts to a full template folder, a licence-renewal send-ready + copy/paste pair, opt-in global CC and a proven scrollbar fix.
7. **Tracker discipline regressed:** October had 8 logged `DC-…` rows; November has none. This report lists collateral from daily logs instead.

---

## 6. Verification & Build Status

1. **Public builds:** 3 Nov — 173/173 pages (first attempt hit a transient Mongo timeout, retry clean); 13 Nov — exit 0; 19 Nov — exit 0, 48 s, 176/176 pages, middleware 34.7 kB.
2. **Admin build (13 Nov):** exit 0, middleware 35.2 kB; the live admin guard compiled.
3. **Static guards:** `check:h1`, `check:seo`, `check:schema`, `check:alt`, `check:demo`, `check:insights-svg`, `security:check` all PASS on 13 Nov; `check:modules` added with 98 assertions on 3 Nov.
4. **Deterministic suites (13 Nov):** cart 32, order-status 38, dates 9, payments 45, payments-gateway 26, sara-local 49, sara-guard 80, sara-catalog 37, ratings 18, draft-contact 23, referral 19, seo 18, news-verify 22.
5. **Careers email:** `test:careers-email` **36/36** on 4 Nov; no live send occurred during verification.
6. **Runtime / mobile probes:** seven module URLs 200 with one `<h1>` each; 360 / 414 / 768 / 1280 px zero horizontal overflow; signature probed 280–1440 px with and without styles.
7. **Live-domain checks:** share image, Belapur 308, `/diwali.png` headers, DMS 404 → 200, 11 cached API routes MISS → HIT, careers JSON parity, bot 204.
8. **Verification policy:** most 5–20 November changes ran under the owner's single-pass directive (`AGENTS.md` §3), so no build, dev server or `check:*` suite was run for those individual passes. The exceptions are explicitly listed above.
9. **21 November work:** also ran under §3 — no build, dev server, typecheck or check suite. Live read-only checks confirmed 8 tutorials on the custom domain after the admin API insert; the frontend player and `public/videos/` assets await deploy.

---

## 7. Challenges Faced

1. **Deployment gap caused a live 404.** The DMS source existed locally but was never committed; the popup CTA led to `/modules/document-management` → 404 while a control module returned 200. Fixed by committing the pending files.
2. **A Vercel build was rejected** by an unclosed `<br>` in the Footer landline line inherited from uncommitted work. Fixed in an isolated copy before re-push; three stale `next-server` processes also had to be killed by PID.
3. **Fluid CPU spike in `iad1`.** The catch-all Edge middleware charged every static asset to the bill. Narrowed matcher; the invoice impact still needs confirmation after deploy.
4. **Click-through, not ranking, is the leak.** GSC showed impressions up ~3.5× while CTR fell from 2.42% to 0.99%; 27 titles were rewritten, but the 21 November checkpoint has no recorded result yet.
5. **Gmail and Outlook strip or reinterpret markup.** Padding on the outermost table disappears; `overflow-x:hidden` creates a scroll container; Outlook adds cell padding to 100%-width tables. Resolved with spacer rows, flanking gutters and inline styles.
6. **Repeat-visit logic was fragile.** Diwali → greeting migration, `sessionStorage` surviving reloads and the `svd_vid` cookie being created after first paint each produced a replay or a missed popup; all three were fixed in code.
7. **Security debt needs a decision.** 14 public and 34 admin `npm audit` advisories remain; `npm audit fix --force` would move Next to 16 and activate the dormant `proxy.ts` guard in the public deployment.
8. **Tracker blind spot.** No digital-content rows were logged in this window, so content ROI and weekly-target scoring are not measurable from the Excel tracker.
9. **Mixed BSON types and two clusters masked new content.** An admin-added tutorial stored `createdAt` as a string while older rows held Dates, so Mongo sorted it last; a 1-hour edge cache would have hidden any fix. Separately, the deployed admin aliases write to a stale cluster the public custom domain never reads. Fixed with JS epoch sorting, `no-store` on `/api/tutorials`, and writing through the root cluster.

---

## 8. Pending Items / Needs Attention Outside the Code

1. **SEO checkpoint (due today):** read clicks — not impressions — on the 27 retitled URLs; compare against the 0.74% baseline and the 21 November note in `docs/SEO-CLICK-PLAN-2026-11-03.md`.
2. **Publish the DMS articles:** run `node scripts/seed_news.mjs` against the **production** `MONGODB_URI`, then `npm run test:news-verify` and live URL checks.
3. **Done 21 Nov — the 20 November email batch and the four 21 November sessions were committed to `main` and pushed to `origin` + `secondary`.** Redeploy and re-check the expiry email, signature, footer deeplink and Learning Hub player on the custom domain.
4. **Browser-probe the admin dashboard** at 1024–1280 px, including the fallback-font first paint, to confirm the two-row 14-tile fit — it has only been sized arithmetically.
5. **Confirm the Vercel Fluid CPU bill drop** and visually check the OG share card plus one compressed hero after deploy.
6. **Decide on `npm audit` remediation**; keep both repos on Next 15 until `proxy.ts` is deleted or re-scoped.
7. **Mark the Belapur redirect fixed in GSC** once recrawled, and clear "Page with redirect" rows.
8. **Update the digital-content tracker** for November collateral and resolve the two October approvals (owner action).
9. **Remove the greeting popup manually** after the festival, using exactly the two edits recorded in `WEB-023`.
10. **Search Console preferred-source eligibility** is domain-level and an owner action; ad blockers will still suppress the button, by design.

---

## 9. How We Can Improve — Clearer Information for Customers

1. **Answer four questions on every product or post:** *What is it? Who is it for? What problem does it solve? What do I gain?* The new DMS page and audit articles are the first assets written this way; apply the same shape to the other five module pages.
2. **Lead with the outcome, then the feature.** Replace "link-only storage" with "your audit files stay in the folder you already use; Tally stores only the link".
3. **One clear, tagged CTA everywhere:** "Book a free demo" or "WhatsApp us", with UTM tags and a lead-source field, so the 21 November click data can be tied to enquiries.
4. **Fix snippets before chasing rankings.** The 27-URL rewrite proved the site is shown but not clicked; keep the searcher's phrase in the title head and the qualifier ("Previous Year", "7.2", "Navi Mumbai") visible.
5. **Make the dashboard read as a queue.** The 14-tile row is non-financial and actionable; keep payments and careers below the fold and colour only the numbers that imply someone is waiting.
6. **Measure, don't assume.** The two open items — dashboard width and Fluid CPU spend — are still arithmetic/model-based; one browser probe and one invoice check close them.
7. **Keep the tracker honest.** Log each new asset as a row with a posted date; otherwise the monthly report cannot measure content ROI.

---

## 10. Next Steps

1. **High — redeploy the 21 November commit** and verify the Learning Hub player + local MP4, the lead acknowledgement receipt, and the email templates on the custom domain (commit and push to both remotes are done).
2. **High — run the 21 November SEO checkpoint** on the 27 retitled URLs and record clicks/CTR against the 0.74% baseline.
3. **High — seed the three DMS audit articles into production** and verify them live with `test:news-verify`.
4. **High — confirm the Fluid CPU drop** on the Vercel invoice after the 19/20 November deploy.
5. **Medium — browser-probe the admin dashboard** at 1024–1280 px with fallback fonts; close the "arithmetic only" caveat.
6. **Medium — update the Excel / digital-content tracker** for November collateral and reopen the two October approvals.
7. **Medium — decide the `npm audit` remediation path** without adopting Next 16.
8. **Low — remove the greeting popup manually** after the festival; keep only the owner's `ev.png` master.
9. **Low — mark the Belapur 301 fixed** in Search Console once recrawled.

---

*Prepared from the daily logs, session-history detail files and git history for 1–21 November 2026. Where a live or tracker result was not recorded, the report says so rather than inferring one.*
