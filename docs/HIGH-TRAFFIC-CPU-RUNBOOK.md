# High-traffic CPU runbook — 2026-11-25

> Operational record for the Fluid Active CPU / edge-request investigation and the
> hands-off hardening that followed. Session-level history is indexed in
> [docs/HISTORY.md](HISTORY.md); the three same-day detail files are linked at the end.
>
> Scope: public frontend only (`origin` = `sarvadnyawebteam/sarvadnya-live.git`).
> The nested `sarvadnya-advanced/` admin deployment was **not** touched.

---

## 1. What the owner reported

- "CPU usage is near 85% for a month, yesterday was peak."
- "Even last 7 days we have 60% edge requests."
- Later: "visitor increased and I can also track 70 visitors, so peak is justified but we need to optimise."
- Then: "I won't be updating stuff for any time in the next few weeks, so we need to prepare for high traffic and sustain all."
- Implementation request: static newsbar, reviews, homepage entities, contacts and footer; no DB dependency for those reads.

Conclusion up front: **the peak is real traffic, not a bug**. The work is therefore about removing CPU per request and serving repeat traffic from the edge, not about finding a broken route.

---

## 2. Telemetry supplied by the owner

### 2.1 CDN paths (7 days) — requests and cache hit rate

The percentage in the Vercel paths table is the **CDN cache hit rate**, not an error rate.

| Group | Examples | Requests | Hit rate | Reading |
| :--- | :--- | ---: | ---: | :--- |
| Ingestion beacons | Speed Insights ingestion, Web Analytics page view | 50 + 43 | 0% | Vercel's own endpoints; they count as edge requests but do **not** run our functions. |
| Tracking | `/api/identify` | 37 | 0% | Our largest Node-function CPU bucket; intentionally uncached. |
| Learning feed | `/api/tutorials` | 23 | 0% | The only public read API with no cache; 4 client call sites. |
| Legacy probes | `/2021/02/18/sample-blog/` and no-slash form | 16 + 14 | 0% | Already answered at the Edge as 410 by `middleware.ts` `GONE_PREFIXES` — no function CPU. |
| Public read APIs | `/api/prices` 22 / 59.1%, `/api/settings` 22 / 63.6%, `/api/modules` 31 / 71% | 75 total | mixed | Every miss is a Node invocation + Mongo read. |
| Static chunks / fonts | e.g. `webpack-*.js` 85%, `layout-*.js` 88.9%, woff2 82–90% | ~20 each | 70–95% | Already cached; not the CPU problem. |
| Images | `/_next/image` 135 / 88.9%; `/logo.png` 88.2%; various `/assets/images/*` 96–98% | 135+ | high | Misses re-encode through sharp inside a Function. |
| Pages | `/news/[slug]` 161 / 91.9%, `/tally-insights/[section]` 39 / 92.3%, `/404` 38 / 88.6% | 238 | high | The ~10% misses are Node renders. |

### 2.2 Bot breakdown (7 days)

| Bot | Requests | Hit rate | Note |
| :--- | ---: | ---: | :--- |
| `meta-webindexer` | 382 | 95.3% | Almost all served from cache. |
| `facebookexternalhit` | 235 | 93.6% | Link previews; keep working. |
| `meta-externalagent` | 151 | 60.7% | The largest source of **uncached** bot page renders (~59 misses). |
| `oai-searchbot` | 67 | 94% | Mostly cached. |
| `googlebot` | 50 | 83.7% | Keep. |
| `semrush`, `petalbot`, `baiduspider`, `bingbot`, `gptbot`, `exasearchbot`, etc. | 19–33 each | 80–100% | Low volume after caching. |

Most bot traffic is a **CDN request-volume** story, not a CPU story. Blocking crawlers would trade CPU for search/AI visibility and was deliberately left as an owner decision.

### 2.3 Fluid Active CPU by path

Project summary: P75 Active CPU **228 ms**, memory avg **258 MB / 2.05 GB**, CPU throttle P75 **41.3%**, cold starts **25%**.

| Path | Invocations | Total Active CPU | Approx. per call |
| :--- | ---: | ---: | ---: |
| `/api/identify` | 37 | 7 s | 189 ms |
| `/api/tutorials` | 23 | 3.4 s | 148 ms |
| `/` | 12 | 3.19 s | 266 ms |
| `/api/prices` | 11 | 2 s | 182 ms |
| `/contact` | 10 | 1.74 s | 174 ms |
| `/news` | 9 | 1.69 s | 188 ms |
| `/api/modules` | 9 | 1.48 s | 164 ms |
| `/api/settings` | 8 | 1.28 s | 160 ms |
| `/tally-insights/fundamentals-version-transitions` | 9 | 750 ms | 83 ms |
| long tail (careers, find-solution, hrms, product/service/module/news pages) | 5–8 each | 200 ms–1.8 s each | — |

Cold starts (25%) plus 41% CPU throttle mean **each avoidable invocation costs more than its raw duration suggests**. The strategy was: eliminate invocations first, then make the unavoidable ones cheaper.

---

## 3. Changes made, in order

### Phase 1 — Static homepage chrome and content

Live content was captured **read-only** from the production cluster into `/tmp/opencode/live-static-data.json` using `/tmp/opencode/read-live-content.mjs` (outside the repo). Counts: 25 settings keys, 1 FAQ document, 15 news items, 4 reviews, 9 partners, 6 modules. Only public fields were copied into the repo; API keys, recipient maps and CC configuration were deliberately excluded. Nothing was invented.

New module: `lib/static-site-content.ts`
- `STATIC_NEWS` — 12 ticker items (title, description, slug, date only).
- `STATIC_REVIEWS` — the 4 live reviews with their real ratings; no rating invented.
- `STATIC_PARTNERS` — canonical brand row: AWS → Biz Analyst → TallyPrime → OTU → NoSky.
- `STATIC_HOME_FAQ` — 21 live Q&As.
- `STATIC_SITE_SETTINGS` — 13 public contact/social/map fields.
- `STATIC_FOOTER_MODULES` — 6 live id/title pairs.

Server routes:
- `app/(site)/layout.tsx` — became a sync component. Removed `getSettings()`, `getNews()`, `getSettingsData()` and `normaliseSettings()`; the ticker and WhatsApp button take the snapshot arrays.
- `app/(site)/page.tsx` — became sync. The four DB reads are left as a **commented block** (owner asked to comment them out, not delete) and replaced by snapshot constants.
- `app/(site)/contact/page.tsx` — `fetchSettings()` removed; uses the snapshot. The form POST is untouched.

Client components — all mount-time `/api/*` fetches and skeleton states removed:
- `NewsFeed.tsx` (`/api/news`), `CustomerReviews.tsx` (`/api/reviews`), `CertifiedPartners.tsx` (`/api/partners?type=brand`), `faq.tsx` (`/api/content?section=home_faq`), `Footer.tsx` (`/api/settings` + `/api/modules`), `SupportButton.tsx` (`/api/settings`).

### Phase 2 — Learning feed (`/api/tutorials`)

- `QuickSupportModal.tsx` — mounted site-wide while closed, so its mount-time fetch was one invocation per visitor. It now fetches only when Sara opens, with a cancellation guard and a "already loaded" check.
- `Productbar.tsx` — removed the Learning hover/click prefetch of `/api/tutorials`.
- `app/api/tutorials/route.ts` — response now carries a public cache header; warm-instance memory cache avoids repeat Mongo reads on edge misses.
- `lib/api-cache.ts`, `next.config.js` — added `PUBLIC_TUTORIALS_API_CACHE` and an exact-path header rule placed last so it overrides the blanket `/api/:path*` `no-store` rule.

### Phase 3 — Hands-off high-traffic hardening

**Public API cache TTLs** (`lib/api-cache.ts` + mirrored constants in `next.config.js`):

| Constant | Before | After | Used by |
| :--- | :--- | :--- | :--- |
| `PUBLIC_API_CACHE` | 1 h | **6 h** | `/api/prices`, `/api/news`, `/api/settings`, `/api/content`, `/api/partners`, `/api/reviews`, `/api/search`, `/api/insights/search`, `/api/careers/visible`, `/api/careers/list` |
| `PUBLIC_MODULES_API_CACHE` | 6 h | **24 h** | `/api/modules` |
| `PUBLIC_TUTORIALS_API_CACHE` | none → 5 min | **6 h** | `/api/tutorials` |

All keep `stale-while-revalidate=86400`, so a stale copy answers while the refresh happens in the background.

**ISR windows:**

| Route | Before | After |
| :--- | :--- | :--- |
| `/news/[slug]` | 1 h | 6 h |
| `/news` | implicit | explicit 6 h |
| `/modules`, `/modules/[slug]` | 6 h | 24 h |
| `/tally-insights/[section]`, `.../[lesson]` | 6 h | 24 h |

**Data-layer cache fix (found during build verification):** Next caps a route's ISR at the shortest `unstable_cache` TTL it reads. `lib/mongodb-utils.ts` had `CACHED_CONTENT_SECONDS = 1 h` and `CACHED_MODULE_SECONDS = 6 h`, so the first build still reported `/news` at 1 h and `/modules` at 6 h. Both were raised to 6 h / 24 h; the second build reports the intended values. This is essential — changing only the route `revalidate` does nothing while the data cache is shorter.

**Images:** `next.config.js` `images.minimumCacheTTL = 604800` (7 days), targeting the 135 `/_next/image` requests in the CDN report.

**Visitor enrichment lever:** `app/api/identify/route.ts` now skips the post-response ipwho.is + reverse-DNS work when `VISITOR_ENRICHMENT=0`. Default `1` preserves behaviour. The visitor ledger itself (session upsert, paths, UTMs — the owner's 70-visitor source) is never skipped. Documented in `.env.example`.

### Deliberately not changed

- `/api/identify` beacon frequency — simply raising the old client throttle only delayed path beacons without reducing their count. It is now **batched** instead ([detail](history/2026-11-25-batched-identify-beacons.md)): one POST carries all paths in a 30 s window, and the server increments the counters by the batch size so path history and visitor totals are preserved. Section-only beacons (`paths: []`) record late section views without inventing a page view; retries are bounded and POSTs are serialized so the beacon cannot become its own CPU leak.
- `robots.txt` / crawler blocking — most bot hits are already cached; blocking trades CPU for search and AI-search visibility.
- `/api/cart/*`, payment verification, `/demo` — money paths stay `no-store`, test-key locked, and HMAC-verified.
- Tally Insights content structure — already static in `lib/learn-tally-curriculum.ts`; moving it to `data/` would add import churn with zero CPU or DB benefit.
- The nested admin fork — different repo, different deployment rules.

---

## 4. Verification

Owner explicitly asked for a build, overriding the default single-pass directive.

```
npm run build
```

- **Build 1:** `Next.js 15.5.29`, `cpus: 1`, compiled in 61 s, "Linting and checking validity of types" clean, 180 static pages generated, zero errors. Route table exposed the data-cache cap: `/news` 1 h, `/modules` 6 h.
- **Fix:** raised `CACHED_CONTENT_SECONDS` / `CACHED_MODULE_SECONDS` in `lib/mongodb-utils.ts`.
- **Build 2:** compiled in 30.7 s, 180/180 pages, zero errors. Route table confirmed `/news` **6 h**, `/modules` **1 d**, `/tally-insights/[section]` and `.../[lesson]` **1 d**, `/sitemap.xml` 6 h. Only pre-existing warning is the `postcss-url-parser` notice in `app/globals.css`.

No `npm run dev` was started at any point during verification, so no production artifacts were clobbered.

---

## 5. Deploy and monitor

1. Deploy this repo. The static-homepage snapshot and all TTL changes ship together.
2. Optionally set `VISITOR_ENRICHMENT=0` in Vercel if Active CPU is still high after the deploy. No rebuild required.
3. Watch the same Vercel path table for 3–7 days:
   - `/api/tutorials` invocations should fall from 23 to roughly the number of Sara opens plus cache windows.
   - `/api/prices`, `/api/modules`, `/api/settings` invocations should fall with the longer shared cache.
   - `/` and `/contact` should fall because their DB reads and client fetches were removed.
   - `/news/[slug]` uncached renders should fall with 6 h ISR + 6 h data cache.
4. Confirm the visitor ledger still shows the expected ~70 visitors — it must be unaffected by the TTL and enrichment changes.

---

## 6. Rollback / restore points

| Change | How to restore |
| :--- | :--- |
| Long API caches | `PUBLIC_API_CACHE` → `s-maxage=3600`; modules → `21600`; tutorials → `300`. Change both `lib/api-cache.ts` **and** `next.config.js`. |
| Long ISR | Route `revalidate` values **and** `CACHED_CONTENT_SECONDS` / `CACHED_MODULE_SECONDS` in `lib/mongodb-utils.ts` must be lowered together. |
| Static homepage | Remove the snapshot constants in `app/(site)/layout.tsx`, `app/(site)/page.tsx`, `app/(site)/contact/page.tsx` and restore the commented DB reads. `lib/static-site-content.ts` can be deleted. |
| Tutorials cache | Restore `Cache-Control: no-store` in `app/api/tutorials/route.ts` and remove the exact-path rule in `next.config.js`; restore the mount-time fetches in `QuickSupportModal` / `Productbar` only if freshness on next load is required. |
| Image TTL | Remove `minimumCacheTTL` from `next.config.js`. |
| Enrichment | Remove `VISITOR_ENRICHMENT=0` from Vercel, or set it to `1`. |

---

## 7. Risks and open decisions

- **Staleness:** admin edits to prices/news/modules/settings/careers/tutorials now take 6–24 h. The owner confirmed no updates for several weeks. If a price changes unexpectedly, the displayed price (6 h cache) could differ from the server-authoritative cart price — lower `PUBLIC_API_CACHE` to 1 h immediately if that happens.
- **`/api/identify` was the top CPU path (7 s).** It is the source of the visitor ledger and already skips bots, rate-limits and defers enrichment via `after()`. Levers added: the optional enrichment kill-switch (`VISITOR_ENRICHMENT=0`, owner-set) and batched beacons ([detail](history/2026-11-25-batched-identify-beacons.md)), which cut invocation count without changing ledger totals. The follow-up hardening also closes the beacon's own leak paths: one timer, no overlapping POSTs, bounded retries, and no fake `/` view from section-only traffic.
- **AI crawlers:** `meta-externalagent` drives ~59 uncached page renders in 7 days. Edge-blocking it would cut CPU but may reduce AI-search visibility — needs an explicit owner decision.
- **No automated tests were run.** The build covers type checking; the static guards (`check:h1`, `check:schema`, etc.) were not invoked because the owner did not ask for them.

---

## 8. Related detail files

- [Static homepage chrome and content](history/2026-11-25-static-homepage-chrome-cpu-mitigation.md)
- [Fluid CPU follow-up: tutorials fetch gating](history/2026-11-25-fluid-cpu-tutorials-api-and-client-fetch-trim.md)
- [High-traffic hands-off cache hardening](history/2026-11-25-high-traffic-hands-off-cache-hardening.md)
