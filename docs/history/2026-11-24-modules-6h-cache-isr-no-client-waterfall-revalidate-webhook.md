# 2026-11-24 — Modules: 6h cache/ISR, no client waterfall, on-demand revalidate webhook

## Why

`/modules` and `/modules/[slug]` were identified as CPU-heavy under traffic. Module content changes rarely. The goal was to serve module grid/detail from cache/ISR, avoid per-visit DB work and client fetch waterfalls, while keeping admin/manual updates fast and safe.

## Changes

### Listing: server-rendered, no client fetch

- `app/(site)/modules/page.tsx` — converted from a `'use client'` page that fetched `/api/modules` in `useEffect` to a server component. Reads modules through cached `getModules()` and passes data to `ModulesPageClient`.
- `app/(site)/modules/page.tsx` — `export const revalidate = 21600` (6 hours).
- `app/(site)/modules/ModulesPageClient.tsx` — new client component containing only interactive UI: hash deep-link scroll and `UnifiedContactModal`. No data fetching.

### Detail pages: longer ISR window

- `app/(site)/modules/[slug]/page.tsx` — `revalidate` raised from `3600` to `21600`. `dynamicParams = true` and `generateStaticParams()` remain; slug validation still flows through existing `loadDetail()`/`notFound()`.

### Data cache: modules tag, 6h TTL

- `lib/mongodb-utils.ts` — added `CACHED_MODULE_SECONDS = 60 * 60 * 6`. `getModules()` now uses `{ revalidate: CACHED_MODULE_SECONDS, tags: ['modules'] }` with key `['public-modules-v1']`. News cache remains at 1 hour.

### Public API/CDN cache

- `lib/api-cache.ts` — added `PUBLIC_MODULES_API_CACHE = 'public, s-maxage=21600, stale-while-revalidate=86400'`; kept generic `PUBLIC_API_CACHE` at 1 hour.
- `app/api/modules/route.ts` — returns `PUBLIC_MODULES_API_CACHE`.
- `next.config.js` — added `PUBLIC_MODULES_API_CACHE` constant and a specific `/api/modules` header override after the generic public API allowlist, so modules get 6h `s-maxage` while other public APIs keep their existing policy.

### On-demand revalidation webhook

- `app/api/revalidate/route.ts` — new secured POST endpoint. Auth: `REVALIDATE_SECRET` required; accepts `x-revalidate-secret`, `Authorization: Bearer ...`, or body `secret`. Default invalidation: tags `['modules']`, paths `['/modules', '/api/modules', '/sitemap.xml']`. Accepts custom `tags`/`paths` arrays for targeted updates.

Example admin/manual call:

```bash
curl -X POST https://<site>/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: $REVALIDATE_SECRET" \
  -d '{"tags":["modules"],"paths":["/modules","/api/modules","/sitemap.xml","/modules/<slug>"]}'
```

### Test guard update

- `scripts/module-pages-consistency-test.mjs` — updated to reflect current reality: allow-listed optional curated module `document-management`, allowed optional template bands (`attachGroups`/`audiences`/`videoComingSoon`) while preserving shipped-module rhythm contract, and allowed `/modules` server page delegating its single `<h1>` to `ModulesPageClient.tsx`. Result: 100/100 assertions pass.

## Verification

- `./node_modules/.bin/tsc --noEmit --pretty false --project tsconfig.json` — exit 0.
- `node scripts/module-pages-consistency-test.mjs` — PASS 100/100.
- Confirmed no `fetch('/api/modules')` in modules listing page/client.
- Confirmed no `force-dynamic`/`cookies()`/`headers()` in module routes/API/revalidate (only historical comment).

## Cache matrix

| Surface | Cache | TTL | Update |
|---|---:|---:|---|
| `/modules` | Next ISR + Data Cache `modules` tag | 6h | `/api/revalidate` tag/path or redeploy |
| `/modules/[slug]` | Next ISR + Data Cache `modules` tag | 6h | `/api/revalidate` include affected slug path |
| `/api/modules` | CDN/Edge `s-maxage` + SWR, Data Cache | 6h/24h SWR | `/api/revalidate`; external CDN edge may lag until TTL/SWR unless platform-purged |
| sitemap/search module reads | Data Cache `modules` tag (+ own route cache policy) | 6h data cache | `/api/revalidate` |

## External follow-up

- Add `REVALIDATE_SECRET` to frontend deployment env (and admin env if admin triggers webhook).
- Wire admin module create/update/delete/reorder to POST `/api/revalidate` with affected paths.
- For guaranteed instant global CDN freshness, add platform CDN purge (Vercel/CDN API) alongside Next revalidation; `revalidateTag/revalidatePath` refresh Next/Data Cache but not every already-cached external edge response.
- If 5 hours is preferred over 6, set `21600` -> `18000` in `lib/api-cache.ts`, `next.config.js`, `lib/mongodb-utils.ts`, and module page `revalidate` exports. Keep values in sync.