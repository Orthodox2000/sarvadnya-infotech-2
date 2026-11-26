# 2026-11-26 — Scoped in-guide search, AI Overview cleanup, selection and glassmorphic nav

## Why

Owner, after the sidebar/gradient pass:

> "the global search gets Quick AI Overview [text ending in] `[[Tally Prime`, last text, fix it. Also in
> insight, searchbar is different for each lesson, search only within that. E.g. if I search shortcut or
> print, just take me to shortcut for print or show me that. Global search only on navbar search. Finally
> when I select something, don't have browser default, use our green colour lighter shade. Finally sidebar
> selected items don't show our green, use green but glassmorphed and lighter."

Scope confirmed with the owner: **per-lesson search that jumps to the exact match**; a single section
index searches only that section's guides; global search stays in the navbar (`SearchBar.tsx` →
`/search?q=`).

## Changes

### 1. Quick AI Overview stray `[[` token

- `app/api/search/route.ts`
  - New `sanitizeSummary()` keeps only **complete** `[[Label|url]]` tokens whose URL came from that
    response's result list, then strips any remaining `[[` / `]]` from plain text. This is applied to
    the Groq output before it is returned — the root cause was a half-written token such as a trailing
    `[[Tally Prime`, which the old renderer printed literally.
  - The summariser prompt now explicitly forbids unclosed brackets and invented URLs, and caps links
    at two.
- `app/(site)/search/page.tsx` — the renderer defensively strips stray brackets from plain parts, so
  an older Edge-cached summary also renders clean without a purge.
- No new LLM call, no new key, no change to `sara-guard` or the Sara route.

### 2. In-guide search is local and lands on the exact match

- `lib/insights-search.ts`
  - Factored the ranking loop into `scoreEntries()`; `searchInsights()` (global `/api/search`) keeps its
    original behaviour and result order.
  - New `searchInsightsScoped(query, { sectionId, lessonSlug })` filters `LESSONS` to the current guide
    or section before ranking.
  - Passages now carry an `anchor` that mirrors a real rendered id. Shortcut rows carry the highest
    weight (11) so a "print" query surfaces the print shortcut row, not a generic "print" mention in
    the body.
  - Markdown body blocks are indexed through `parseMarkdownBlocks()` so body ids match the renderer
    one-for-one (`body-<index>`).
- `app/api/insights/search/route.ts` — accepts optional `?section=` and `?lesson=`; without them it
  still serves the original all-guides search.
- `app/components/TallyInsights/InsightsSearch.tsx` — takes a `scope` prop, builds the scoped URL,
  never redirects to `/search` (global search is navbar-only), and on a same-page result scrolls to
  the anchor with `scrollIntoView()` plus `history.replaceState`. Copy now says "matches" and
  "this guide / this section".
- Anchors rendered on the lesson page: `guide-intro`, `quick-answer`, `term-N`, `example-N`,
  `shortcut-N`, the existing `faq-N`, and `body-N` from `MarkdownBody` (new optional `anchorPrefix`
  prop, default off for its other consumers).
- `W3DocsShell.tsx` no longer mounts the search bar; each insights page mounts it with its own scope,
  keeping the shell's two-in-flow-children flex invariant.
- `app/globals.css` — `scroll-margin-top: 96px` on anchored elements so the sticky navbar never covers
  the matched line.

### 3. Brand polish

- `app/globals.css`
  - Site-wide `::selection` uses `#b8dede` on `#033b38` instead of the browser default blue.
  - Selected sidebar rows (section pill, lesson and search-result) are now light glassmorphic teal:
    `rgba(0, 101, 105, 0.11)` fill, hairline `rgba(0, 101, 105, 0.18)` border, inset white highlight,
    soft teal shadow and `backdrop-filter: blur(10px)`, with `#004f52` text instead of white. Hover
    stays a plain `#e5f4f4` tint; bold remains reserved for the selection.

## Deliberately unchanged

- Navbar `SearchBar.tsx` is the only global search; `/api/search` is untouched apart from the summary
  sanitiser. The in-guide bar has no `/search` fallback.
- No page markup removed, no hydration change (anchors are server-rendered ids; browser APIs are used
  only inside the click handler). One `<h1>` per page preserved.
- No prices, payment, email, SEO metadata or Sara changes. Nested admin fork untouched.

## Verification

During these edits the single-pass owner directive (root `AGENTS.md` §3) applied: no build, dev server,
typecheck, lint or browser probe was run while the code was being written. The owner's dev server was
already reporting the known `.next` manifest collision (§2.1); it was later stopped **by PID** and
`.next` removed before the production build.

The owner lifted the directive later the same day and asked for build, tests and push. `npm run build`
passed (Next 15.5.29, 180 routes, lint/type validation included) and `npm run test:all` passed end to
end with every suite green; only 3 pre-existing non-fatal SEO title-length warnings on untouched
layouts and Node `MODULE_TYPELESS_PACKAGE_JSON` warnings from static scripts appeared. No browser probe
was run.
