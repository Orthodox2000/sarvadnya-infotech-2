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