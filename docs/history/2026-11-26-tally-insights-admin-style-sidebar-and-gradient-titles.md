# 2026-11-26 — Tally Insights: admin-style sidebar and gradient page titles

## Why

Owner: *"insight presentation structure is good but we need to improve; in advanced we have sidebar with
proper size text and all — use that structure and design. Don't want icons, and we can drop short
description from sidebar, just title in proper size. You have advanced dashboard gradient presentation
of title — apply that to each title of page so it's better to look."*

This supersedes the 2026-11-24 ask for one-line sidebar descriptions: the sidebar now shows titles only.
Scope is the `/tally-insights/**` docs shell (section + lesson pages), not the whole marketing site and
not the nested admin fork.

## Changes

- `app/components/TallyInsights/TallyInsightsNav.tsx`
  - Removed **every SVG** from the sidebar: hamburger in the collapse toggle, magnifier on the search
    field and the chevron on each section. The section toggle is now a plain `+` / `−` text button with
    the same `aria-expanded` / `aria-label` behaviour.
  - Removed the per-section `description` line and the lesson-count badge. A nav entry is now just its
    title. The local `NavModel` type no longer declares `description`.
  - Removed the "Search results / N guides" subtitle; the count stays as a small chip in the toggle so
    search feedback is not lost.
- `app/globals.css`
  - Sidebar adopts the admin panel's visual language: `#020617` slate surface, teal gradient header,
    white 18px panel title, white-on-teal active pill (`#006569`), 14px/800 section titles and 13px/600
    lesson titles with `10px`+ vertical padding, rounded 10px pill rows, subtle teal box-shadow. Search
    input and focus rings restyled for the dark surface (light `#b8dede` focus outline).
  - Collapsed desktop rail widened 52px → 76px so the text-only "Guides" toggle remains visible and
    readable; the label is no longer hidden in the collapsed state.
  - Every `.overview_header.docs-page-header` (both section and lesson pages) now uses the admin
    dashboard hero gradient `linear-gradient(135deg, #006569, #045A57, #033B38)` with two CSS-only
    decorative circles, white `h1`, `#ddefef` kicker/lede and a translucent quick-answer card. The
    band stays shallow so the guide list / article remains in view.

## Deliberately unchanged

- **No markup change in either insights page** — both already render `overview_header docs-page-header`,
  so the gradient is purely CSS. No new elements, no hydration risk, still exactly one `<h1>` per page.
- Same single in-flow flex row (sidebar + main), same collapse state model (`manualExpanded` starts
  `null`, viewport read only in an effect). No overlay or fixed positioning reintroduced.
- Full-content search in the shell and the sidebar title filter both remain functional.
- No icons anywhere in the sidebar; the global WhatsApp green and the retired `green-*`/`emerald-*`
  families were not touched.
- The nested admin fork was not edited and was not pushed.

## Follow-up same day — light teal sidebar (owner rejected the dark surface)

Owner, after seeing `http://localhost:3000/tally-insights/fundamentals`: *"the black background is
not suitable, create a better [scheme] matching website theme."* The admin sidebar's **structure** is
kept (roomy pill rows, 14px bold section titles, 13px lesson titles, no icons, titles only), but its
**colour** is no longer the admin's dark slate. `app/globals.css` now uses the site's brand ramp:
sidebar surface `#f7fbfb` with a `#d4eaea` border, head gradient `#e5f4f4 → #d9e8e8`, teal `#006569`
title/toggle/count, white search field, `#e5f4f4` hover rows and a solid `#006569` active pill. Focus
rings and scrollbar are teal again. The gradient page-title band is unchanged (that was the separate
owner ask). **This follow-up supersedes every "dark surface / #020617" description above.**

## Follow-up 2 same day — width and weight refinement

Owner: *"check width and sizing, sidebar we hardly need width for sub items and normal descriptions and
answers, reserve bold and thickness to show important only."*

- Sidebar desktop column narrowed **270px → 230px** (`.w3-sidebar.w3-collapse` inside
  `@media (min-width: 1024px)`). The collapsed rail stays 76px so the text-only "Guides" toggle still
  fits. Below 1024px the sidebar remains full-width, so no mobile width was changed.
- **Thickness is now earned, not given.** Regular (400/500) is the default for guide/lesson titles,
  search-result titles, ledes, quick answers, article paragraphs/lists, card descriptions, CTA copy,
  breadcrumbs, related links, the "back" link, table labels and small uppercase meta/labels. The only
  800/900 weights left on the docs pages are: the page `<h1>`, section/lesson/article headings, the
  **active** section pill and **active** lesson/result, the CTA title, and action chips/badges
  (`insights-search-submit`, `docs-cta-link`, `docs-promo-badge`, `mark`), where the weight is part of
  the control's affordance rather than text emphasis.
- Static sizing check (no browser probe): at 1024px viewport the inner row is 992px → 230px sidebar +
  14px gap → 748px main (716px after its padding, ~676px article text). At 360px the full-width column
  yields ~278px of article text, protected by the existing `overflow-wrap: anywhere` on the header,
  cards and article. The widest nav row has ~148px of title space at 230px, enough for the longest
  section title to wrap in two lines.

## Follow-up 3 same day — still smaller sidebar text

Owner: *"sidebar text smaller more."* This is a second type-size pass after the width/weight pass; no
layout geometry changes. `app/globals.css` steps every sidebar text down one notch:

- panel title `18px → 16px`, "Guides" toggle label `10px → 9px`, sidebar search input `13px → 12px`;
- section title `14px → 13px`, section `+` / `−` glyph `17px → 15px`;
- lesson link `13px → 12px`, search-result title `13px → 12px`, result section label `11px → 10px`,
  empty-state text `13px → 12px`.

Padding, pill radius, the narrow 230px column, the 76px collapsed rail, regular/bold weights and the
light glassmorphic selection are all unchanged. Static-only at this point: build and test results are
recorded in Verification below once the owner's explicit build/test request is complete.

## Verification

For the first two passes (structure, light teal colours, width/weight), the single-pass owner directive
(root `AGENTS.md` §3) applied: **no build, dev server, typecheck, lint or browser probe was run.**
Static review only — every removed class still has no remaining JSX consumer, and the new rules are
scoped so no non-insights page inherits the sidebar styling or the white title. The width and weight
figures above are computed from the CSS, not measured in a live browser.

The owner lifted that directive in follow-up 3 and explicitly asked for build, tests and push. The dev
server was stopped **by PID** and `.next` removed first (§2.1). `npm run build` passed — Next 15.5.29,
180 routes generated, lint/type validation included. `npm run test:all` passed end to end — every
suite green (h1, alt, seo, schema, demo guards, module pages, cart/payments, Sara local + live,
order-status, dates, drafts, careers mail); the only output of note was 3 pre-existing non-fatal SEO
title-length warnings on untouched layouts and Node `MODULE_TYPELESS_PACKAGE_JSON` warnings from
static test scripts. No browser probe was run.

The `ENOENT ... .next/server/middleware-manifest.json` the owner saw in the dev terminal is the known
build/dev `.next` collision from root `AGENTS.md` §2.1, not a CSS error: stop the dev server **by PID**,
remove `.next`, then restart `next dev` (or build with no dev server running) so the manifest is
regenerated. In follow-up 3 the running dev server was stopped by PID and its `.next` cleared before
the production build; no server was restarted by this session.
