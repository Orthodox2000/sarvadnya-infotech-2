# Performance Increment Plan — Google Search (last 28 days, ended 2026-10-06)

Source: `public/sarvadnyainfotech.com-Performance-on-Search-2026-10-07.xlsx`
(Google Search Console export, Web search type, last 28 days — parsed 2026-10-07, then the
xlsx was removed from `public/` per owner instruction).

---

## 1. Baseline — where the site stands today

| Metric | Value |
| :--- | :--- |
| Clicks (28 days) | **115** |
| Impressions (28 days) | **3,684** |
| CTR | **~3.1%** |
| Average position | **~7.4** |
| Geography | India 112 clicks (~97%), Indonesia/Singapore/Bahrain 1 each; US/EU impressions only |
| Devices | Desktop 78 (68%) / Mobile 37 (32%) |
| Rich results | Only "AMP non-rich result" (1 click) — **no FAQ, Product, or Review rich results** |
| Pages earning impressions | 82 URLs (≈50 unique routes incl. legacy aliases) |
| Queries earning impressions | 147 |

Daily rhythm: 1–12 clicks/day, 53–147 impressions/day. The window saw a rebuild + seeds
(18→19 news posts) mid-window, so part of the tail is new-page discovery.

**Interpretation:** impressions are healthy for the site's size and the average position
(~7.4, page 1) is decent — but CTR is ~3% because (a) a third of all clicks land on
non-canonical `http://` / `www` / legacy-slash URLs, (b) biggest impression clusters
(TSS, cloud-access) have near-zero CTR, and (c) the site earns no rich results.

---

## 2. Opportunity clusters (from the query + page sheets)

### A. Brand — healthy, keep protecting (≈39 of 115 clicks, 34%)
`sarvadnya technologies` 17 clicks pos 2 · `sarvadnya infotech llp` 17 clicks pos 1.06
CTR 47% · `sarvadnya` 3 · typo `sarvdnya` 1. Lands on `/` (42 clicks, 543 impr,
pos 5.4). Nothing to fix; the partner-verification link (2026-10-07) adds E-E-A-T proof
to the pages Google already ranks for the brand.

### B. TSS cluster — the single biggest untapped pool (~1,300 impressions, ~0% CTR)
Questions rank on page 1 already, nobody clicks because the SERP title/description and the
landing copy don't answer them:

| Query | Impressions | Position | Lands on |
| :--- | --: | --: | :--- |
| tss expired in tally means | 111 | 3.9 | `/news/tally-tss-expiry-meaning` (844 impr, 3 clicks) |
| tss full form in tally | 38 | 3.9 | same |
| tss has expired in tally | 32 | 6.0 | same |
| tss expired in tally | 24 | 6.3 | same |
| how to check tss expiry date in tally prime | 15 | 8.2 | same |
| tss renewal means | 11 | 6.5 | same |
| tss in tally / tss full form / what is tss | 12 | 1.0–1.7 | same |
| tss expired in tally means hindi | 3 | **1.0** | same |

- `/news/tally-tss-renewal-2026` adds 76 impr / 3 clicks; `/services/tss` 41 / 2.
- **Actions (editor, admin DB — no code):**
  1. Retitle `/news/tally-tss-expiry-meaning` to answer the query, e.g. *"TSS in Tally:
     What It Means, Why It Expires, and How to Renew"* — and rewrite its meta description
     to state the answer ("TSS = Tally Software Services…"). Both live in the `news`
     collection (admin edit; visible immediately on the article page, next deploy on `/news`).
  2. Add a short "How to check the TSS expiry date in TallyPrime" post — query has 15
     impressions at pos 8.2; an exact-match post is a page-1 (pos 1–3) target.
  3. Add FAQPage JSON-LD to the TSS post + `/services/tss` (recommended in the Task 5
     report, not implemented — needs a small dev sprint, P1 below).
  4. A one-paragraph Hindi summary in the same post would take the pos-1 `.hindi` query
     (currently zero competition).

### C. Cloud-access / TallyCloud login intent (portal confusion)
`tallycloudaccess` 357 impr (pos 10, 0 clicks on this form) + 316 (2 clicks),
`tally cloud access` 42, `in cloud access` 20, plus typo clusters (`in.onlinecloudacces`,
`icloud tally`, `cloud acsses`, `incloudaccess@tallysolution.com` — people pasting the
cloud portal login). Lands on `/cloud/tallycloudaccess` (196 impr, pos 5.5) and
`/cloud/backup-for-tally` (23).
- **Action:** the `/cloud/tallycloudaccess` page should answer "where do I log in to my
  Tally cloud account?" explicitly (portal address/URL, first paragraph) and carry a
  FAQPage rich result. A matching FAQ heading can take these pos-5–10 queries to pos 1-3.

### D. Local SEO — Belapur / Navi Mumbai IT-company & partner queries
`it companies in belapur` 69 impr (2 clicks pos 8.6) · `belapur it company list` 42 (2) ·
`software companies in navi mumbai / belapur` 57 (4) · `tally partner near me` 10 ·
`tally certified partner near me` 6 · `find/locate tally partner` 16.
Lands on `/news/cbd-belapur-it-companies-list` (289 impr, pos 7.7, 5 clicks),
`/news/software-companies-in-navi-mumbai` (32, pos 17.8), `/news/tally-partner-near-me`
(84 impr, pos 9), `/news/it-companies-in-belapur` (15), `/news/smbs-cbd-belapur-certified-tally-partner` (4).
- **Actions:** consolidate the local posts' `<title>` onto the exact query forms ("IT
  companies in Belapur, Navi Mumbai — list & directory"); interlink the 4–5 local posts
  (cheap internal links pass equity); verify LocalBusiness JSON-LD is served on `/`
  (check `lib/seo.ts`); the partner-near-me post (84 impr) deserves an answer-first title.

### E. Rich results — zero earned today, biggest CTR lever
Only "AMP non-rich result" appears in Search appearance (1 click). The site has
review data (4.9★, 34 reviews on `/contact`), priced products, and FAQ content — unused.
- **P1 code path (recommended dev work, needs owner sign-off):**
  1. `Product` + `Offer` JSON-LD on `/products/{silver,gold,server,tallydrive}` and
     `/services/tss` (prices are DB-driven already).
  2. `FAQPage` JSON-LD on `/services/tss`, `/cloud`, `/news/tally-tss-expiry-meaning`
     (from the page's own FAQ content).
  3. `AggregateRating`/`Review` JSON-LD beside the 4.9★ / 34-reviews block on `/contact`.

### F. URL hygiene — 37 of 115 clicks (32%) land on non-canonical variants
From the Pages sheet (all 301/308 to the apex HTTPS canonical — probe-verified 2026-10-07):

| Non-canonical URL | Clicks | Impressions |
| :--- | --: | --: |
| `http://sarvadnyainfotech.com/` | 28 | 491 |
| `https://www.sarvadnyainfotech.com/` | 7 | 77 |
| `…/tally-cloud-services/` | 10 | 30 |
| `…/about-us/` | 2 | 342 |
| `…/tally-product-2/` | 1 | 72 |
| `…/tally-prime/` | 0 | 22 |
| `www/…/cloud/tallycloudaccess` | 2 | 196 |
| `www/…/products/gold`, `www/…/report-problem` | 2 | 4 |

- No code change can speed this up further: the redirects are correct and single-hop
  for the no-slash forms; the `/foo/` forms are exactly 2 hops (Next's mandatory
  trailing-slash 308 → the 301/308) and inside Google's tolerance (verified in dev
  + live; documented in `next.config.js`).
- **Owner (GSC, no code):** on the affected groups run **Validate fix** / URL Inspection
  → **Request Indexing** (especially the `http://` homepage and `/about-us/`), and confirm
  the Sitemaps screen shows only the apex-https sitemap (`/sitemap.xml` lists apex URLs).
  These rows consolidate over a few weeks; the next 28-day export should show the
  `http://` row fading.

### G. Noise (ignore, don't chase)
`jambi69` 11 impr, `sawindia` 5, `sudrania software llp` 5, `sree tammina…`, `yes`,
`kya h`, `best software company in kannauj` — 0-click noise skewing the impression count
by ~2%. No action.

---

## 3. Prioritized roadmap

**P0 — owner/editor, zero code, this week**
1. GSC: Validate fix / Request indexing on the redirect-error + 410 groups (§2F).
2. Retitle + rewrite meta description of `/news/tally-tss-expiry-meaning` (§2B).
3. Publish "How to check TSS expiry date in TallyPrime" post (§2B.2).
4. Confirm sitemap = apex https only (§2F).

**P1 — dev sprint (recommended, needs owner sign-off)**
1. Product/Offer + FAQPage + Review JSON-LD (§2E) — highest-leverage CTR change.
2. Make `/news` listing force-dynamic so new posts appear immediately instead of at the
   next deploy (currently the listing is part of the site-wide static snapshot; deviates
   from the established pattern → needs explicit approval).
3. Cloud-login answer block + FAQ on `/cloud/tallycloudaccess` (§2C).

**P2 — content, watch the next report**
- Hindi TSS FAQ (pos-1 query, zero competition), local-post title consolidation (§2D),
  cloud-login portal post, tutorials ↔ news interlinking.

**Measurement:** re-export the same GSC report next month; compare per-cluster
clicks/CTR/position for the TSS cluster, local cluster, and the non-canonical-URL rows.

---

## 4. Your GSC error lists — current status (all probe-verified live 2026-10-07)

### "Page with redirect error" bucket
| URL | Current live behavior | Verdict |
| :--- | :--- | :--- |
| `/tally-cloud-services` (+`/`) | 301/308 -> `/cloud` -> 200 | Correct; 1 hop; target indexed |
| `/about-us` (+`/`) | 308 -> `/about` -> 200 | Correct |
| `/housing-societies-2` (+`/`) | 308 -> `/modules` -> 200 | Correct |
| `/tally-prime` (+`/`) | 308 -> `/products` -> 200 | Correct |
| `/tally-prime-product` (+`/`) | 308 -> `/products` -> 200 | Correct |
| `/blog` (+`/`) | 308 -> `/news` -> 200 | Correct |
| `/small-add-ons-in-tally-erp-9` (+`/`) | 308 -> `/news/tally-erp9-add-ons` -> 200 | Correct |
| `http://sarvadnyainfotech.com/` | 301 -> `https://` apex -> 200 | Platform TLS hop; correct |
| `http://www.sarvadnyainfotech.com/` | TLS hop -> www/apex 301 -> 200 | Correct (2 hops: platform TLS + host canonical) |
| `https://www.sarvadnyainfotech.com/` | 301 -> apex -> 200 | Correct |
| `www/…/modules?id=cf-agencies` | www 301 -> `/modules?id=…` -> id-retirement 308 -> `/modules` | Correct (2 hops) |
| `/capabilities` | **200 directly (no redirect at all)** | Nothing to fix |

All targets return 200. These GSC rows are stale/transient from around the 2026-09-16/17
redirect rollout; they clear on recrawl (P0.1).

### "404 not found" bucket (old-site links — already handled)
| URL | Current behavior | Verdict |
| :--- | :--- | :--- |
| `/?et_core_page_resource=` | 410 Gone | Correct — Google drops it |
| `/category/uncategorized/` | 410 Gone | Correct |
| `/shop/all-mouse-pads` | 410 Gone | Correct |
| `/shop/bumper+stickers` | 410 Gone | Correct |
| `/shop/cool+stickers` | 410 Gone | Correct |
| `/shop/framed-prints` | 410 Gone | Correct |
| `/shop/gallery-boards` | 410 Gone | Correct |

410 (not 404) tells Google the URL is permanently gone — the fastest way to retire old
WooCommerce/Divi URLs. Nothing to change; the rows drop after recrawl.

**Why the trailing-slash forms can't be 1 hop:** Next.js emits its own trailing-slash 308
before both middleware and `redirects()` run (verified in dev + live). `/foo/` is therefore
always `308 -> /foo -> 301/308 -> target`. Within Google's limit; documented in
`next.config.js` (NOTE 2026-10-07). No code fix exists on this stack.

---

## 5. Notes
- Raw parsed data kept at `/tmp/opencode/gsc-full.txt` (throwaway copy of all 7 sheets).
- The xlsx was removed from `public/` after this plan was prepared (owner instruction).
- See `AGENTS.md` — partner verification link (Tally Solutions) added to `/contact` and the
  footer, 2026-10-07.