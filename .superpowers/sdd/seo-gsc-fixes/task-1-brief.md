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