# Task 1 Report: `/modules?id=cf-agencies` deep links → `/modules#cf-agencies` fragment links

**Status:** DONE_WITH_CONCERNS

## What I implemented

All 5 brief steps, plus the sibling module deep-links required to make Step 4's verification actually pass:

1. **Fragment links (3 nav files):** `lib/product-nav.ts`, `app/components/Footer.tsx`, `app/components/QuickAccessHubDemo.tsx` — replaced the `/modules?id=cf-agencies` href with `/modules#cf-agencies`. Because Step 4's acceptance check (`rg -n "modules\?" lib app`) demands **zero** `/modules?` matches in `lib`/`app`, and the plan's architecture line says "fragment-link surgery for `/modules?id=` deep links" (plural), I also converted the 5 sibling static deep-links (`housing-societies`, `sales-commission`, `logistics-transport`, `container-handling`, `garment-retail`) in the same 3 files, the **dynamic** templates `/modules?id=${m.id || m._id}` in Footer + QuickAccessHubDemo, the commented-out `excel-to-tally` example in product-nav, and `app/api/search/route.ts` (`/modules?id=${moduleId}` → `/modules#${moduleId}`). Without these the Step 4 command could not pass.
2. **Anchor target (`ModuleCard.tsx`):** card wrapper div now `<div id={module.id} className="... scroll-mt-40">`. Verified `Module.id` is required in `lib/modules.ts`, and module docs carry it (`/api/modules` → `getModules()`; search route already used `m.id || m._id`).
3. **Hash scroll (`app/(site)/modules/page.tsx`):** added the brief's `useEffect` verbatim on `[modules]` to `scrollIntoView` the element matching `location.hash` after modules load (300ms delay so layout settles). `useEffect`/`useState` were already imported.
4. Per project convention, `// CHANGE: 2026-09-07 — <reason>` comments added to all touched files. No JSX structure/classes changed otherwise.

## What I tested + results

- `npm run typecheck` → passed (clean, no output/errors), run twice (after first edits and again after the ModuleCard comment relocation).
- `Select-String -Path lib\*.ts,lib\**\*.ts,app\**\*.ts,app\**\*.tsx -Pattern "modules\?"` → **NO_MATCHES** (`rg` is not installed on this machine; used the task's prescribed PowerShell fallback).

## Files changed

- `lib/product-nav.ts` — fragment links (static + commented example) + CHANGE comment
- `app/components/Footer.tsx` — fragment links (static + dynamic template)
- `app/components/QuickAccessHubDemo.tsx` — fragment links (static + dynamic template)
- `app/components/ModuleCard.tsx` — `id={module.id}` + `scroll-mt-40`
- `app/(site)/modules/page.tsx` — hash-scroll `useEffect`
- `app/api/search/route.ts` — search-result module links `#` instead of `?id=`

Commit: `16702a4` — `seo: convert module deep-links to #fragment anchors`

## Self-review findings

- Initial `// CHANGE` comment in ModuleCard was placed inside `return (...)`, valid JS but off-style; moved above the `return` so JSX structure stays byte-identical.
- The `?id=` references stopped being literal matches once the CHANGE comment text was reworded (avoided writing `/modules?id=` inside it) and the pre-existing `?id=excel-to-tally` comment was updated.
- Verified `/modules` page is a client component that ignores any query string, so `?id=` → `#` is behavior-preserving (hash arrives client-side and is handled by the new effect).
- Did not run `npm run build` (not required by the brief for this task; AGENTS.md warns dev+build must not run concurrently and none were running).

## Concerns

1. **Scope exceeded Step 1's literal wording.** The brief's Step 1 names only `cf-agencies`, but Step 4's command cannot pass while the sibling module links (same 3 files), the dynamic `?id=${m.id}` templates (Footer/QuickAccessHubDemo), and `app/api/search/route.ts` still emit `/modules?` URLs. I converted all of them to satisfy the stated acceptance check. If the controller intended ONLY cf-agencies (GSC reports just that 1 URL), the extra conversions are harmless-but-broader — flagging for confirmation.
2. **Search results link to `#` without a fallback.** `/search` results for modules now deep-link to `/modules#<id>`; the modules page scrolls to the anchor only when modules are already loaded. If the module isn't present (e.g. hidden/removed), the page just lands at top — same behavior as before with `?id=` (unused), so no regression.
3. `npm run build` was not run (brief's per-edit gate is typecheck; build happens at task-level verification in Task 6 per the plan).