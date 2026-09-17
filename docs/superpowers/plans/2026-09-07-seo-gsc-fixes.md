# SEO GSC Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clear every Google Search Console indexing issue row (7 Not found 404, 14 Crawled-not-indexed, 4 Page-with-redirect, 2 Duplicate-without-canonical, 1 noindex, 1 403) with zero visible UI change.

**Architecture:** fragment-link surgery for `/modules?id=` deep links, `robots: noindex` on 4 low-value utility pages, platform-level www→non-www canonicalization, and a legacy-WordPress 301/410 edge layer (`next.config.js` redirects + `middleware.ts`).

**Tech Stack:** Next.js 15 App Router (`redirects()` in `next.config.js`, `middleware.ts`, `Metadata.robots`, `MetadataRoute.Sitemap`), TypeScript, Vercel.

**Spec:** Google Search Console export (7 Not-found 404 URLs, 10 crawled-not-indexed old-WP URLs, 4 page-with-redirect URLs, 2 duplicate-without-canonical URLs, 1 noindex URL `/wp-includes/js/wp-emoji-release.min.js?ver=6.9.4`, 1 403 URL `/2021/02/`) + user decisions: canonicalize www→non-www, noindex utility pages (`/search`, `/demo`, `/theme-settings`, `/learn-sara`) + drop from sitemap, dead old-WP URLs → 410 Gone, live-equivalent old-WP URLs → 301.

## Global Constraints

- No visible UI/JSX changes. Only metadata, links, edge responses, and Vercel console settings.
- Build discipline (AGENTS.md §9): never `npm run dev` + `npm run build` concurrently; if "Cannot find module for page" errors occur, delete `.next` and rebuild. Typecheck = `npm run typecheck`; build = `npm run build`.
- Every edit carries a `// CHANGE: <date> — <reason>` comment.
- Brand teal `#006569` untouched.
- Per-edit verification: `npm run typecheck` after each task's edits; `npm run build` at task-level verification gates.

---

### Task 1: `/modules?id=cf-agencies` deep links → `/modules#cf-agencies` fragment links

**Why:** `?id=cf-agencies` makes Google crawl `/modules?id=cf-agencies` as a separate URL (canonical → `/modules`). URL fragments (`#…`) are never sent to the server and never indexed separately. Fixes GSC "Alternative page with proper canonical tag" (1 URL).

**Files:**
- Modify: `lib/product-nav.ts:58`
- Modify: `app/components/Footer.tsx:118`
- Modify: `app/components/QuickAccessHubDemo.tsx:149`
- Modify: `app/components/ModuleCard.tsx:14` — add `id={module.id}` to the card wrapper div + `scroll-mt-40` class (anchor target)
- Modify: `app/(site)/modules/page.tsx` — add scrollIntoView effect on hash

- [ ] Step 1: Replace `"/modules?id=cf-agencies"` href with `"/modules#cf-agencies"` in the three files.
- [ ] Step 2: `app/components/ModuleCard.tsx` card wrapper: `<div id={module.id} className="group relative bg-white ...">` (append `scroll-mt-40` to class list).
- [ ] Step 3: `app/(site)/modules/page.tsx` — after modules load, scroll matching `location.hash` into view:
```tsx
useEffect(() => {
  if (!modules.length) return;
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;
  const el = document.getElementById(hash);
  if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
}, [modules]);
```
- [ ] Step 4: Verify: `npm run typecheck`; `rg -n "modules?" lib app --glob "*.ts" --glob "*.tsx"` returns no matches.
- [ ] Step 5: Commit.

### Task 2: noindex 4 utility pages + remove from sitemap

**Why:** `/demo` is an exact clone of the homepage (`app/(site)/demo/page.tsx:17`), `/search` is a JS-only shell, `/learn-sara` is a thin chat tool, `/theme-settings` is a dev color reference. noindex + sitemap removal clears "Duplicate without user-selected canonical" (home vs /demo) and thins the "Crawled/Discovered – currently not indexed" rows.

**Files:**
- Modify: `lib/seo.ts` — add optional `noindex?: boolean` to `seoMetadata`
- Modify: `app/(site)/search/layout.tsx`
- Modify: `app/(site)/learn-sara/layout.tsx`
- Modify: `app/(site)/demo/page.tsx`
- Modify: `app/(site)/theme-settings/page.tsx`
- Modify: `app/sitemap.ts` — remove `'/search'`, `'/demo'`, `'/learn-sara'`

- [ ] Step 1: `lib/seo.ts` — extend `seoMetadata` signature with `noindex?: boolean`; in the returned object add `...(noindex ? { robots: { index: false, follow: false } } : {})`. Child `robots` overrides root `app/layout.tsx` `robots: { index: true, follow: true }`.
- [ ] Step 2: `search/layout.tsx`, `learn-sara/layout.tsx` — add `noindex: true` to the `seoMetadata(...)` call.
- [ ] Step 3: `demo/page.tsx` and `theme-settings/page.tsx` — convert to:
```ts
import type { Metadata } from 'next';
export const metadata: Metadata = {
  ...seoMetadata({ /* existing args unchanged */ }),
  robots: { index: false, follow: false },
};
```
- [ ] Step 4: `app/sitemap.ts` — delete `'/search'`, `'/demo'`, `'/learn-sara'` from the routes array.
- [ ] Step 5: Verify: `npm run typecheck`; `rg -n "search|demo|learn-sara" app/sitemap.ts` shows no hits in routes list.
- [ ] Step 6: Commit.

### Task 3: www → non-www canonicalization

**Why:** GSC reports `www.sarvadnyainfotech.com` redirect/duplicate rows. `SITE_URL` is the bare domain. One host must win. Fixes the `http://www.` and `http://` "Page with redirect" rows.

**Primary (zero code):**
- [ ] Step 1: Vercel console → project → Settings → Domains → `www.sarvadnyainfotech.com` → redirect to `sarvadnyainfotech.com`, permanent. Out of repo; manual.

**Alternative (in-repo, only if platform redirect not possible):**
- [ ] Modify `middleware.ts`: if `request.nextUrl.host === 'www.sarvadnyainfotech.com'`, return 301 to the apex host preserving pathname + search, and widen `config.matcher` to cover all page routes (exclude `_next/static`, `_next/image`, and static asset extensions).
NOTE: Tasks 3 and 5 both edit `middleware.ts` if the middleware route is chosen — implement them in one pass if so, else platform redirect for www (recommended) + middleware for 410s only.

### Task 4: Legacy-WP URL 301 mapping (`next.config.js` redirects())

**Why:** old WordPress pages that still get crawled and have a live equivalent should 301 so link equity consolidates and the not-indexed rows clear.

**Files:** Modify `next.config.js` — add to existing `redirects()` array (permanent: true).

| source | destination |
|---|---|
| `/tally-erp-9-single-multi-user-license` | `/products/silver` |
| `/tally-prime` | `/products` |
| `/tally-prime-product` | `/products` |
| `/tally-product-2` | `/products` |
| `/upgrade-of-tally-erp-9-products` | `/services/tss` |
| `/housing-societies-2` | `/modules` |
| `/erp-consulting-services-3` | `/capabilities` |
| `/customized-ready-modules-for-specific-business-lines` | `/modules` |
| `/tally-software-implementation-service` | `/services` |

Next.js default `trailingSlash: false` 308-normalizes `/old/` → `/old` first, so single no-slash sources suffice.

- [ ] Step 1: Add the 9 redirect rules (comment: `// CHANGE: 2026-09-07 — ...`).
- [ ] Step 2: Verify `npm run typecheck` (config only) and that the sources don't collide with existing routes.
- [ ] Step 3: Commit.

### Task 5: Legacy-WP 410 layer (`middleware.ts`)

**Why:** dead WordPress/WooCommerce artifacts (shop, product, feeds, wp-includes, date archives, Divi resource URL) with no live equivalent must return 410 so Google drops them instead of re-crawling 404s. `next.config.js` redirects cannot emit 410 and cannot match query strings.

**Files:** Modify `middleware.ts` (keep existing CORS logic intact).

```ts
// CHANGE: 2026-09-07 — Deleted old-WordPress/WooCommerce URLs: 410 Gone so Google stops crawling.
const GONE_PATHS = new Set([
  '/shop/bumper+stickers', '/shop/gallery-boards', '/shop/framed-prints',
  '/shop/all-mouse-pads', '/shop/cool+stickers',
  '/product', '/product/', '/feed', '/feed/', '/automobile-industries', '/automobile-industries/',
  '/author/admin/feed', '/author/admin/feed/',
]);
const GONE_PREFIXES = ['/wp-includes/', '/wp-content/', '/wp-admin/', '/wp-json/', '/2021/'];
// In middleware(), before existing logic:
//   const pathname = request.nextUrl.pathname;
//   if (GONE_PATHS.has(pathname) || GONE_PREFIXES.some(p => pathname.startsWith(p)) ||
//       (pathname === '/' && request.nextUrl.searchParams.has('et_core_page_resource'))) {
//     return new NextResponse(null, { status: 410 });
//   }
```

```ts
// config.matcher
['/api/:path*', '/shop/:path*', '/product', '/product/:path*', '/feed',
 '/author/:path*', '/automobile-industries',
 '/wp-includes/:path*', '/wp-content/:path*', '/wp-admin/:path*', '/wp-json/:path*',
 '/2021/:path*', '/']
```

- [ ] Step 1: Add GONE_PATHS / GONE_PREFIXES + 410 branch; keep CORS branch unchanged.
- [ ] Step 2: Update `config.matcher`.
- [ ] Step 3: Verify `npm run typecheck`.
- [ ] Step 4: Commit.

### Task 6: Deploy + Search Console follow-up (manual, not in-repo)

- [ ] Step 1: Deploy (`npm run build` already clean); spot-check with curl:
  - `curl -o /dev/null -w "%{http_code}" https://sarvadnyainfotech.com/shop/bumper+stickers` → 410
  - `/wp-includes/js/wp-emoji-release.min.js` → 410
  - `/2021/02/` → 410
  - `/tally-prime` → 301 Location to `/products`
  - `GET /search`, `/demo` → `<meta name="robots" content="noindex…">`
- [ ] Step 2: GSC bare property: re-submit `sitemap.xml`; Request Indexing on `/modules`, `/products`, `/cloud/aws`, `/addons`.
- [ ] Step 3: After www→apex 301 settles, GSC www property converges to redirects (archive or let drain).

## Deferred
- Remaining tail of "Discovered – currently not indexed" (46) = sitemap pages Google hasn't crawled; heals via re-indexing.
- `/ask-sara` → `/?ask-sara=true` (intentional UX), `/cloud/nosky` → `/cloud/backup-for-tally` (already correct), both harmless.
- `/cloud/aws` and `/addons` "Page with redirect" flags are transient trailing-slash 301s — no code change; heal after re-crawl.