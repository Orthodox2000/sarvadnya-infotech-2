# 2026-11-24 — Tally Insights: full-content search + separate ERP 9 shortcuts page

## Why

The owner asked for two things:

1. A search that covers **all data inside Tally Insights**. The existing sidebar field only
   filtered guide titles and section titles (`TallyInsightsNav.tsx`), so a visitor looking for
   one shortcut row, FAQ answer or menu path had to open guides and scroll. The global
   `/api/search` also does not index the curriculum at all.
2. A **separate ERP 9 page inside the shortcuts area** carrying the circulated shortcut table.
   The owner corrected the first attempt the same day: the supplied keys are ERP 9 keys and must
   not sit in a TallyPrime-named section or be merged with the TallyPrime complete-list lesson.
   See "Owner correction" below.

## Changes

### Search

- `lib/insights-search.ts` (new) — server-only index built once from `LESSONS`/`SECTIONS`, the
  same source that renders the pages. Every guide contributes passages for its title, intro,
  keywords, quick answer, section description, definitions, worked examples, shortcut rows,
  FAQs and every non-separator line of `bodyMd`. Each passage carries a short label
  ("Shortcut", "FAQ", "Key term", ...) which is also searched, so "narration shortcut" matches
  a shortcut row whose action text does not contain the word "shortcut". Matching is
  word-boundary based (`+` and `#` are treated as key characters) — never a bare substring.
  Broad multi-term queries must land in at least two passages so a single common word in a long
  body cannot bury the guide that answers the whole query.
- `app/api/insights/search/route.ts` (new) — `GET ?q=`, in-memory, no DB and no LLM, with the
  shared `PUBLIC_API_CACHE` header. Query capped at 120 characters.
- `app/api/search/route.ts` — the existing **global** site search now merges up to five guide
  matches (match label + snippet) ahead of generic pages, so a visitor who starts on `/search`
  can also reach a Tally Insights guide. Previously the curriculum was never indexed there.
- `app/components/TallyInsights/InsightsSearch.tsx` (new) — debounced (140 ms) autocomplete
  bar. Arrow Up/Down + Enter, Escape, clear button, highlighted query terms, "View all" panel
  and a no-match state linking to `/ask-sara`. No `window`/`localStorage` during render; the
  fetched data never arrives before hydration.
- `app/components/TallyInsights/W3DocsShell.tsx` — mounts the bar in an in-flow `div` at the
  top of the main column. The flex row still has exactly two children (nav + main); no overlay.
- `app/globals.css` — scoped `insights-search-*` styles using the teal scale, visible focus
  rings, a scrolling popover and a 640 px reduction so the field stays inside 360 px.

The sidebar's existing title-only filter was deliberately left alone: it is the browse-the-tree
control and has a documented hydration incident history. The new bar is the content search.

### ERP 9 shortcuts sub-page (final placement)

- `lib/learn-tally-curriculum.ts`
  - new lesson `erp9-shortcut-keys-faster-data-entry`, `sectionId: 'shortcuts-cheat-sheet'`,
    `order: 2` — a distinct sub-page at
    `/tally-insights/shortcuts-cheat-sheet/erp9-shortcut-keys-faster-data-entry`. It sits beside
    the TallyPrime complete list (order 1), not inside it.
  - the circulated table is transcribed as seven grouped markdown tables (general, reports,
    vouchers, masters and vouchers, vouchers and reports, reports/vouchers/masters, data
    processing). All five source columns are kept on every row; the header now names the last
    column **Tally.ERP 9 key** and the middle key column **TallyPrime key (for comparison)** so
    the ERP 9 value is the one the reader acts on. No shortcut was added, merged or "corrected".
  - ERP 9-focused SEO: title `ERP 9 Shortcut Keys`, description leading with Tally.ERP 9,
    keywords for `tally erp 9 shortcut keys`, `erp 9 shortcut keys list`, `tally erp9 shortcuts`,
    `tally erp 9 keyboard shortcuts` and similar. ERP 9-first `quickAnswer`, two definitions,
    five FAQs and related links to the TallyPrime list, the ERP 9 vs Prime comparison and the
    voucher-types guide.
- `app/sitemap.ts` derives lesson URLs from `getAllLessonSlugs()`, so the new URL is included
  without an edit. The lesson route's `generateStaticParams()` is also source-derived.
- The page uses the shared lesson template, so it inherits canonical URL, Article/Breadcrumb/FAQ
  JSON-LD, the 6h ISR window and the full-content search bar automatically.

### Owner correction (same day)

The first pass added a separate `erp9-shortcuts` **section** with lesson
`tallyprime-shortcut-keys-faster-data-entry` and TallyPrime-led SEO. The owner corrected it:
*"last set of shortcut keys i sent over were of erp9, and wanted in a seperate page and not with
tallyprime, check again and make new sub page isnide shortvut for erp 9 ans SEO it"*. That section
and lesson were removed and replaced with the ERP 9 sub-page above. The body copy no longer says
"TallyPrime shortcuts ... with ERP 9 equivalents"; it directs the reader to the **last column**
for the ERP 9 key and treats the TallyPrime key as comparison only.

## Content notes

- The source list is credited in-page as circulated on professional networks, with a note that
  menu labels can vary by release. Where the source's last column says "None", the page says so
  rather than inventing an ERP 9 key.
- No price, return-policy language, rating, W3 artwork or external asset was introduced.
- Every shortcut in the new lesson is searchable by key, action, location or ERP 9 equivalent
  because the index parses the markdown rows into individual passages.

## Verification (owner requested)

The owner explicitly asked for "build test and push", so the standing single-pass hold was
lifted for this verification only. Node v24.21.0 on PATH, no dev server running, so no
dev/build collision:

- `npm run typecheck` — exit 0.
- `npm run build` — exit 0; 180 routes generated. Both shortcut pages are prerendered, including
  `erp9-shortcut-keys-faster-data-entry.html` / `.meta` / `.rsc` under
  `.next/server/app/tally-insights/shortcuts-cheat-sheet/`; the new URL is in `sitemap.xml`.
- `npm run test:all` — exit 0; the full `&&` chain ran through to the final careers-email suite,
  all suites green (no early stop).
- Committed as `8a629a9` before verification; pushed to both remotes after verification. No
  source change was needed as a result of the checks.
