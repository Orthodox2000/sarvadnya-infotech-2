# 2026-11-24 — Tally Insights: one flex container, no viewport-driven hydration swap

## Why

The owner reported that the `/tally-insights/**` UI was "terrible and overlapping" and pasted a React hydration error: the server HTML had `<aside id="tally-insights-sidebar" class="w3-sidebar w3-collapse is-open">` while the client rendered `<button class="docs-sidebar-mobile-toggle" aria-controls="tally-insights-sidebar">`. That shape mismatch regenerates the whole tree on the client, which also explains the broken spacing.

Two separate causes:

1. **Two nested flex wrappers in the shell.** `W3DocsShell` put `<main>` inside a second `.w3-row`, so the article was a grandchild of the row that also held the sidebar. The sidebar was a sticky/absolutely-styled in-flow item in one row while the content sat in another — the visual overlap came from competing wrappers, not from a missing `overflow` rule.
2. **A viewport-driven element swap in the nav island.** Any `typeof window !== "undefined"` / `window.innerWidth` branch that chooses between a mobile `<button>` and the `<aside>` produces different HTML on the server and on the first client render. That is the exact diff in the pasted error.

## Changes

- `app/components/TallyInsights/W3DocsShell.tsx` — removed the inner `.w3-row` wrapper. The single `.belowtopnavcontainer w3-row` now has exactly **two in-flow children**: `<TallyInsightsNav />` (`<aside>`) and `<main class="w3-main ws-light-grey w3-col l10 m12 docs-main-col">`. No `position: fixed`, no transform, no backdrop.
- `app/components/TallyInsights/TallyInsightsNav.tsx` — the panel is **always** the same `<aside>` tree on server and client. `manualExpanded` starts as `null` and only a real click writes a value; with `null` no modifier class is added, so CSS owns the visual default (expanded at `lg+`, collapsed below it) and there is no first-paint change. `window.matchMedia()` is read only inside `useEffect`, never during render, and is used for `aria-expanded` / toggle intent only — it never chooses which element to render. `openSection` initial state now comes from props only; the route-derived active section is applied in an effect after hydration. All state names/uses were made consistent (`isOpen` → `visuallyOpen`, `userExpanded` → `manualExpanded`).
- `app/globals.css` — the desktop `flex-wrap: nowrap` rule is now scoped as `.belowtopnavcontainer.w3-row` so it unambiguously wins over the base `.w3-row` rule.

## Notes

- The `isOpen is not defined` console error seen immediately after the edit was a stale Turbopack HMR chunk captured mid-rename, not a live defect: the source and the regenerated chunk both use `visuallyOpen` / `manualExpanded` consistently, and the string `isOpen` no longer occurs in any Tally Insights file. A hard refresh (or a dev-server restart if the overlay persists) clears it.
- If a hydration error with a `docs-sidebar-mobile-toggle` button still appears after a hard refresh, it is a stale `.next` client bundle. Stop the dev server by PID, remove `.next`, then restart dev or rebuild — never run dev and build in the same tree at once.
- No build, dev, typecheck, `check:*` suite or browser probe was run for this fix (standing single-pass directive §3). Not committed or pushed; nested admin fork untouched.
