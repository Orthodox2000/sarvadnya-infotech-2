# 2026-11-03 — Belapur cannibalisation retired with a 301 (owner-approved)

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Area | Detail |
| :--- | :--- |
| **The overlap** | `/news/cbd-belapur-it-companies-list` (610 impressions, 10 clicks, pos 6.52) and `/news/it-companies-in-belapur` (28 impressions, 0 clicks, pos 14.25) ranked for the same "it companies in belapur" cluster. The morning's retitle of the weaker post (to "IT Support Companies in Belapur") did not stop the split, so the weak URL was retired into the strong one. |
| **The redirect** | `next.config.js`: `/news/it-companies-in-belapur` → **308** → `/news/cbd-belapur-it-companies-list`, next to the 2026-10-12 GSC redirects. The trailing-slash form needs no entry — Next emits its own 308 to the no-slash path first (the documented 2-hop behaviour). |
| **Single source, one filter** | New **`RETIRED_NEWS_SLUGS`** in `lib/news-utils.ts`; `fetchNews()` in `lib/mongodb-utils.ts` filters it. Because `fetchNews()` backs the `/news` listing, `/api/news`, site search, related posts **and** `app/sitemap.ts`, a retired article cannot keep appearing as a card that links to a redirect, and the sitemap cannot advertise a 301ing URL (GSC "Page with redirect"). The constant and the redirect must be kept in step — that rule is written on the constant. |
| **Nothing deleted** | The document stays in the collection and in the admin panel; the copy and its `_id` survive, so un-retiring is two edits (drop the slug from the list, drop the redirect) rather than a restore. The seed keeps the post with an explicit RETIRED note saying exactly that. |
| **Tooling** | `scripts/update-news-seo.mjs` no longer lists the slug (its `seoTitle` can never be seen again), so the retitle allow-list is 10, not 11. |
| **Verification** | Standing single-pass directive honoured: no typecheck, build, dev server or `check:*`. `node --check` on `next.config.js`, `scripts/seed_news.mjs`, `scripts/update-news-seo.mjs`; `lib/news-utils.ts` imported under `--experimental-strip-types` (type-only import stubbed in `/tmp`) and the filter proved to drop only the retired slug. Live 308 confirmed after deploy. |
