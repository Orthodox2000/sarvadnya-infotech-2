# 2026-11-24 — Tally Insights: full-content search + ERP 9 shortcut-equivalents section

## Why

The owner asked for two things:

1. A search that covers **all data inside Tally Insights**. The existing sidebar field only
   filtered guide titles and section titles (`TallyInsightsNav.tsx`), so a visitor looking for
   one shortcut row, FAQ answer or menu path had to open guides and scroll. The global
   `/api/search` also does not index the curriculum at all.
2. A new section carrying the circulated **"TallyPrime Shortcut Keys for Faster Data
   Entry"** table, including the *Location in TallyPrime*, *Where does it work* and
   *Equivalent in Tally.ERP 9* columns.

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

### ERP 9 shortcuts section

- `lib/learn-tally-curriculum.ts`
  - new section `erp9-shortcuts` (order 14) — "ERP 9 Shortcuts & Faster Data Entry", with its
    own SEO title/description and keywords.
  - new lesson `tallyprime-shortcut-keys-faster-data-entry` — the complete circulated table,
    transcribed as seven grouped markdown tables (general, reports, vouchers, masters and
    vouchers, vouchers and reports, reports/vouchers/masters, data processing). All five source
    columns are kept on every row. No shortcut was added, merged or "corrected".
  - `quickAnswer`, definitions, four FAQs, two related links and one quiet corporate-training
    promo. SEO title kept under 35 characters of body copy because `seoMetadata()` appends the
    brand suffix.
- `app/sitemap.ts` already derives section and lesson URLs from `SECTIONS` and
  `getAllLessonSlugs()`, so the new URLs are included without an edit.
- Both new routes are covered by `generateStaticParams()` in the section and lesson pages;
  no static param list needed updating.

## Content notes

- The source list is credited in-page as circulated on professional networks, with a note that
  menu labels can vary by release. Where the source's last column says "None", the page says so
  rather than inventing an ERP 9 key.
- No price, return-policy language, rating, W3 artwork or external asset was introduced.
- Every shortcut in the new lesson is searchable by key, action, location or ERP 9 equivalent
  because the index parses the markdown rows into individual passages.

## Not done (single-pass directive)

No build, typecheck or static guard was run in this session. The owner lifted the verification
hold on earlier sessions; this one followed the standing single-turn code-generation directive.
