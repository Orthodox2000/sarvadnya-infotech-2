# 2026-11-26 — New chrome design preview, rendered in `/demo` only

## Why

Owner supplied a standalone Tailwind HTML mockup of a redesigned news bar + navbar and asked for
it as the reference for a new design, with these tweaks (typos preserved):

> "make contact , career on top as code, cart as small icon only along with them on rigt og , so
> three items on news bar , smart siggest as button on nabvar, reduce size of loog , solutions
> merged with modules and learning merfed with ai , prope spacing and proper appearance on md"

Scope was confirmed before editing: **build it as a self-contained preview rendered inside `/demo`
only**; leave the live site chrome unchanged.

## Changes

### 1. `app/components/demo/ChromePreview.tsx` (new)

- `'use client'` component, fully self-contained. It is a fixed full-viewport layer
  (`fixed inset-0 z-[99999]`) above the inherited live chrome, with `body.overflow = 'hidden'`
  while mounted, so scrolling belongs to the preview only.
- **News bar** — teal `#045A57` with a `#033B38` pinned NEWS badge, duplicated-item marquee
  (32 s linear, pauses on hover). Right side now carries exactly **three items**: `Contact`,
  `Careers` and a small cart **icon with badge** (moved out of the navbar).
- **Navbar** — logo mark reduced to `h-8 w-8` (`lg:h-9`) and wordmark to `14px`/`17px`;
  Smart Suggest is a shimmer pill button; search + hamburger are the only other actions.
- **Merged menus** — four categories instead of six:
  `Products & Modules` (Solutions folded into a "Modules & Solutions" column),
  `AI & Learning` (Learning folded into the AI group, `NEW` badge),
  `Services` and `Company`. Hover mega panels are two-column with the `NEW` badge and arrow
  affordances; below `lg` the same content appears in a drawer.
- **md spacing** — header is `h-16` at md and `h-20` at lg; the news-bar utilities appear from
  `md:flex`, Smart Suggest from `sm:inline-flex`, and the category row is `lg:flex` so 768–1023 px
  is not crowded.
- Interactions from the reference are kept in React state: toast stack, `⌘/Ctrl+K` search modal
  with Esc/outside-click close, cart badge increment, mobile drawer toggle. Every link is a
  preview **toast** — no route is navigated and no content claim is invented.
- Brand discipline: approved teal scale only; no `green-*`/`emerald-*`, no new hex greens.

### 2. `app/(site)/demo/page.tsx`

- Now renders `<ChromePreview />` instead of the blank `<main>`. `metadata` (noindex) unchanged.

### Follow-up (same session) — owner correction: reuse the old assets, rearrange only

> "use previous asses, like logo sidenar and news , keep design as before just rearrange"
> "cart by defaul must be zero and search bar some width"
> "use content from actual navbar"

`ChromePreview.tsx` was rewritten. The invented mockup look (circular SVG logo, `#045A57` news
bar, shimmer pill, hand-written nav copy) was **removed**. It now uses:

- the real `/TallyCertificate.png` logo and the live wordmark, both scaled down;
- the live Navbar cream gradient, Smart Suggest button style and sparkle icon;
- the live NewsFeed teal `#006569` ticker, red ping dot, and the committed `STATIC_NEWS` array
  (real titles/URLs, no invented copy);
- the live Productbar `bg-teal-700` row, its 12px icons and its three-level megamenu renderer;
- real nav content imported from `lib/product-nav.ts` plus the AI/Solutions entries copied
  verbatim from `Productbar.tsx`.

Rearrangement only: Contact + Careers + cart icon on the right of the news bar; cart removed from
the navbar; Solutions folded into Modules, Learning folded into AI; logo reduced. **Cart starts at
0** (no badge until an item is added) and the search is a real width input (`sm:w-28`,
`lg:w-36`, `xl:w-48`), also available in the mobile drawer.

### Final shape (same session) — two bars, mockup design, real content

Owner, after the asset/rearrange pass:

> "now look for seed m jnafe size, and kep only 2 bars, no pridut bar , i want content as before,
> design as code sent"

Clarified: the garbled first phrase meant **speed of news movement**; "design as code sent" meant
go back to the HTML mockup's visual style. `ChromePreview.tsx` was rewritten again:

- **Product bar removed entirely.** The merged categories now live in the navbar's centre as
  hover megamenus (as in the reference HTML), so the preview has exactly **two bars**: news ticker
  + navbar.
- **Design = the sent mockup**: dark `#094744` ticker with pinned `#073836` NEWS badge and teal
  ping dot; white navbar; circular mark; shimmer Smart Suggest pill; 2-column megamenus; toast
  stack and ⌘K search modal.
- **Content = the real site**: `productItems` from `lib/product-nav.ts` + AI/Solutions copied from
  `Productbar.tsx`, flattened recursively so deep links survive; `STATIC_NEWS` for the ticker.
- **News speed**: the mockup's fixed `32s` was wrong for 8 real items. Duration is measured from
  one group's `offsetWidth` at the live `TICKER_SPEED_PX_PER_SEC = 15` (32 s is only the
  pre-measurement fallback). Hover pauses it, as in the reference.
- Cart still starts at **zero**; the search input keeps real width (`w-28` → `lg:w-36` →
  `xl:w-44`) from md up, with an icon-button + modal below md.

### Runtime fixes (same session) — duplicate key, live-chrome bleed, colour, logo

The owner reported a React console warning from the running page and noted the inherited
`Ask Sara` / `WhatsApp` tabs plus the wrong news-bar colour. Fixed in `ChromePreview.tsx`:

- **Duplicate key** `Modules & Solutions-Document Management`: flattening the real nav puts
  `Document Management` in both the Modules and Solutions sub-trees. Menu keys now use
  `${heading}-${href}-${index}` (mobile drawer too), not the label.
- **Inherited chrome**: the `(site)` layout still mounts the live bars (`z-[2000]`) and the
  site-wide support stack (`z-[3000]`) behind the preview. The preview now sets
  `data-demo-preview` on `<body>` while mounted and injects a scoped CSS rule hiding those two
  z-layers. No live component was modified.
- **News-bar colour**: the mockup's `#094744` was replaced with the live brand primary
  `#006569`; the pinned badge/right rail use `#045A57`, the dot is red again, and number chips
  + separators use white tints — matching the real NewsFeed.
- **Logo enlarged** after the earlier compaction: `/TallyCertificate.png` now renders at
  `h-7 / sm:h-8 / lg:h-9` inside the 48/56/64px navbar rows, and the wordmark was scaled to
  `12/16/19px` so the name carries equal visual weight beside it.

### Hover panel + ticker fades (same session)

Owner: "fix hover effect, you can take entire page width to present inner items in proper width
wise presentations of content, remove search bar and show searchbar when hovered insider hovered
item" and "also in newsbar, we had gradient at start and end of news in actual news bar".

- Replaced the four small `group-hover` dropdowns with **one state-driven mega panel**. It was
  initially full-width; the owner then asked for 80%, so it is now centred at `w-[80%]`. Items
  are laid out in a 4-column grid — two columns fill the row, a single column spans all four —
  with each column's links in a 2-up sub-grid and a live result count.
- Hover/focus on a nav item sets `activeSection`; leaving the `<header>` or pressing Escape clears
  it. The active label turns teal and its chevron rotates — a deterministic hover effect, not a
  CSS `group-hover` that can be lost between the trigger and the panel.
- **Removed the persistent navbar search input.** The panel header now carries the only search
  field, filtering the hovered section's items; the mobile icon + ⌘K modal remain as fallbacks.
- Wordmark enlarged again to `18/28/32px` beside the `28/32/36px` logo, and the navbar category
  labels to `15/16px` (badge and chevron scaled with them).
- Ticker now has mirrored `#006569` gradient fades at both ends, matching the live NewsFeed's
  start fade (the live one only had a left gradient). Fades were then narrowed/lightened
  (`w-5 sm:w-8`, via `/60`), the NEWS badge shadow softened, and the white left border on the
  Contact/Careers rail removed. The entire bar (ticker, badge, rail and fades) was then unified
  to `#045A57` so it matches the Contact/Careers background exactly. Ticker words and number
  chips were finally set to `11px semibold`, the same as the Contact/Careers labels. The
  AI & Learning panel was limited to two item columns (one per heading); other sections keep
  the 2-up sub-grid. Services and the renamed **About Us** (display label for the real
  "Company" nav data) use a narrower 50% hover panel; the other two stay at 80%.
- Final round: the NEWS label was rebuilt with the **live NewsFeed's gradient panel structure**
  (`absolute`, `bg-gradient-to-r solid -> transparent`, `px-6 pr-12`, red ping dot, `10/md:12px`
  wordmark), tinted `#045A57`. The same gradient was **mirrored on the left of the
  Contact/Careers rail** (`bg-gradient-to-l`, `pl-12 pr-6`). News titles and the Contact/Careers
  links now share the live `11px / md:14px` scale, and number chips use the live
  `10px / md:12px` scale. The cart icon was briefly halved per owner request, then restored to
  its original `28px` button / `16px` SVG / `16px` badge with `ring-2`. Finally the ticker words
  were given a real end background: solid `#006569` on the outer edges fading to transparent
  (`w-24 sm:w-40`), mirrored on the right end; the NEWS label and Contact rail keep their darker
  `#045A57` gradients as pinned ends.
- **Owner then said "forget" all of that ticker styling**: the hand-built ticker (state, ref,
  ResizeObserver measurement, marquee keyframes, gradient panels) was deleted and the **real
  `app/components/NewsFeed.tsx` imported directly** with `initialData={STATIC_NEWS}`. Only a
  demo-only right rail adds Contact | Careers | a cart icon (sized to the original 20px bar) on
  the right. The live NewsFeed file is unchanged; the layout's own copy stays hidden by the
  `data-demo-preview` selector on its `z-[2000]` wrapper. The Contact rail was then given the
  **same gradient as the imported NEWS label, mirrored** (`bg-gradient-to-l`, `pl-12 pr-6`, solid
  `#006569` fading into the ticker). The navbar category row's gap was tightened (`gap-3`,
  `xl:gap-5`) so the merged items fit beside the enlarged wordmark. The rail was then made an
  left-edge gradient. An absolute-overlay variant was tried but the rail disappeared (the
  imported NewsFeed root at `z-[2100]` painted over it), so it was restored as a **normal flex
  child**, always visible (no `hidden` breakpoint). It uses `#045A57 solid -> transparent` over
  the `#006569` ticker so the fade still reads; it was then deepened to `#033B38 -> 80% ->
  transparent` with a wider `pl-10 / md:pl-16` because `#045A57` was too close to the ticker
  colour to show a visible gradient. The company wordmark was reduced ~30% to `13/20/22px`,
  then raised +10px to `23/30/32px`, lowered 5px to `18/25/27px`, raised 2px to `20/27/29px`,
  raised a further 2px to `22/29/31px`, lowered 1px to `21/28/30px`, lowered 1px to `20/27/29px`
  lowered 3px to `17/24/26px` and raised 1px to **`18/25/27px`**.
  The navbar
  category labels went through several sizes (down to `11/12px`, up +10px, then back) and now sit
  at **`13/14px` in bold** — the owner reversed the earlier "no bold" call and then added +2px.
  The merged **Products & Modules** category was then split into two separate top-level items
  (**Products**, **Modules**) with the same real nav content; the row gap was tightened to
  `gap-2 / xl:gap-4` so five items still fit. Hover-panel item titles were made `font-extrabold`.
  The wide hover panel (Products / Modules / AI & Learning) was reduced from `w-[80%]` to
  **`w-[60%]`** because the item spacing looked too wide; Services / About Us stay at `w-[50%]`.
  The Modules panel's item grid was then set to **4 columns at `lg`** (`sm:grid-cols-2
  lg:grid-cols-4`) to spread its long modules + solutions list. Owner then said the box spacing
  was too much and the sub-children looked wrong, so the renderer was rebuilt to follow the
  **live `Productbar.tsx`**: recursive `Item.children` (no more `flatten`), parent links with a
  short description, children as small label-only links indented behind a teal left border, and a
  third indented level. Panel padding `py-6 -> py-3`, header `mb-5/pb-4 -> mb-3/pb-2.5`, grid gaps
  `gap-x-8/gap-y-6 -> gap-x-4/gap-y-3`, item cards `p-2.5 -> px-2 py-1`. The navbar button label
  was changed to **AI SMART SUGGEST**.
- **Cache-bust:** the browser kept executing an old copy of the dev chunk
  `app_components_demo_ChromePreview_tsx_8828340e._.js` (it still threw `flatten is not defined`
  although the source and the on-disk chunk contained only `toItems`). The module was renamed to
  `app/components/demo/ChromePreviewV2.tsx` and the import in `app/(site)/demo/page.tsx` updated,
  forcing a new chunk URL. Content is identical; no design change.
- **Follow-up:** the nested child links were too cramped, so spacing was eased — item grid
  `gap-x-4 gap-y-2.5`, parent link `px-2.5 py-1.5`, child/deep containers `gap-1 pl-3`, child
  links `py-1`, then increased again per owner to `gap-x-5 gap-y-3`, parent `px-3 py-2`, child
  lists `gap-1.5` and child links `py-1.5`. The news bar was raised from 20px to **21px** on
  `/demo` only: a `data-demo-news` wrapper + scoped CSS override leaves the shared
  `NewsFeed.tsx` byte-for-byte unchanged, and the demo right rail matched at `h-[21px]`; the
  owner then asked for **+2px**, so both are now **23px**.
  The title-to-search region briefly carried the diagonal teal gradient from the advanced
  dashboard hero, but the owner found it **too weird** — it was removed and the plain white row
  (teal title, grey subtitle, `bg-slate-50/90` input) restored.
- **Modules content cleanup:** "Document Management" was repeated — once under **Business
  Modules** (`m-dms` in `lib/product-nav.ts`) and again under **All Solutions → Business
  Boosters** (`sol-dms`). The `sol-dms` copy was removed (Business Boosters is now a plain link),
  and **Bank Import** was added to All Solutions as a real `/shop#excel-bank-statement-import`
  deep link (catalog item in `lib/tdl-catalog.mjs`). `Productbar.tsx` / `product-nav.ts` are
  unchanged — this is demo-only content.
- **Full revalidation (owner asked explicitly).** A one-off Puppeteer probe measured 15 widths
  (360, 375, 390, 414, 480, 640, 768, 900, 1024, 1100, 1152, 1280, 1366, 1440, 1920) with the
  dev server on :3000: **0 horizontal overflow**, all nav items/non-overlapping, news bar and
  rail both 23px, one search field per open panel, and no console/page errors. It exposed a real
  bug: the old 18/25/27px wordmark pushed the **hamburger off-screen at 360–640px** and the AI
  button off-screen at 640/1024. Fixed with the live Navbar's own budget — wordmark **11/16/21px**,
  image `h-6/h-8/h-9` capped at `max-w-[120px]`, row `gap-2 / px-3 (lg:gap-3 lg:px-4)`, nav labels
  13px until xl, AI button `md:inline-flex`. The mobile drawer was also "contracted" (flat 12px
  list of 25 labels); it now renders the **same recursive hierarchy** as the hover panel via
  `MobileNavItems` (78 links, 13px, teal indents).
- **Link audit:** 50 unique hrefs / 39 paths checked against the running dev server — all HTTP
  200. Hash targets verified in a hydrated browser: `/shop#excel-bank-statement-import` and
  `/shop#shop-filters` resolve (the shop deep-link effect expands the full list). The real nav
  href `/products#compare` has **no `#compare` element** on `/products`, so a demo-only override
  in `ChromePreviewV2.tsx` points it at `/products`; shared `product-nav.ts` is untouched.
  (An initial parallel fetches run produced false timeouts by hitting 39 cold dev routes at once;
  the sequential re-run is the result above.)
- **Live Navbar parity (owner: "check actual navbar for image size and text formatting").**
  Measured the live `Navbar.tsx` in-browser at 360/390/640/768/1024/1280 and copied its logo
  block verbatim: row `h-10 / lg:h-16` with `pr-3`, logo `h-full ml-2 lg:ml-3 max-w-[120px]
  sm:max-w-none lg:max-w-[200px]`, image `h-full w-auto object-contain`, wordmark `ml-2
  text-[11px] sm:text-[18px] lg:text-[21px] font-bold text-slate-900` with `font-black` LLP —
  **no `tracking-tight` / extrabold**. Verified the demo image and wordmark now measure
  **120×40 / 189.6×40 / 200×64** and 11/18/21px weight 700, identical to the live site.
  The live-sized logo is ~87px wider at lg, so the demo-only nav gave that back with `gap-1`,
  12px labels and 14px chevrons until xl, plus a narrower AI button; re-probe again showed
  **0 overflow / 0 console errors at all 15 widths**, with every control on-screen.

- **Final simplification + sizing pass (owner: "simplify code … fix sizing for md/sm … bring AI
   Smart Suggest closer to nav items").** `ChromePreviewV2.tsx` went 491 → ~415 lines: one shared
  `ItemLinks` renderer serves the hover panel and mobile drawer, one `SearchIcon` replaces three
  copies, popular searches moved to a constant, and stale/superseded `CHANGE` comments were removed.
  Logo/wordmark now scale **proportionally** with the smaller nav text — image `h-10 / sm:h-9 /
  md:h-10 / lg:h-11 / xl:h-16` and wordmark `11/14/16/18/21px` against nav labels `12/14px` —
  with row heights `40/44/48/56/64px` (4px vertical padding until xl, live-exact at xl). The row
  is three flex groups; `flex-1` on the logo column pushes the **nav + AI button together to the
  right edge** (AI sits 8px after the categories at lg, 16px at xl). Re-probed 360–1920: 0
  overflow, 0 console errors, no overlaps.
- **Hover-panel fixes from the same pass.** A wrapper `div` from `ItemLinks` had become the only
  grid child and collapsed Products/Modules to one column; the grid classes now go into
  `ItemLinks className`, so Products renders 2 columns and Modules 4. Removed the `NEW` badge on
  AI & Learning and the per-heading item-count badge ("Core Tally Products 2") — the count is no
  longer rendered anywhere. Verified in-browser at 1024 and 1440.

- **News badge parity + final +2px (owner suggestion).** The demo right rail now mirrors the
  real left badge: it lives inside the `relative z-[2100]` news wrapper (fed by the imported
  NewsFeed), uses `absolute right-0 top-0 bottom-0 z-[1010]`, and switches to
  `bg-gradient-to-l from-[#006569] via-[#006569] to-transparent` with `pl-10 pr-4 md:pl-12 md:pr-6`.
  The imported ticker root is demoted to `z-0` by scoped CSS only on `/demo` so the rail paints
  above the marquee; `NewsFeed.tsx` remains unchanged and the links/cart stay clickable (no
  `pointer-events-none`). News bar raised from 23px to **25px** (20px live +5px demo only).
  Verified at 360/768/1440: ticker+rail both 25px, rail z-1010, solid-via gradient, cart hit-test
  passes, no overflow. Owner then said Contact still sat on the transparent part of the fade;
  widening the stop did not help, so the badge is now **fully solid** `bg-[#006569]` with the fade
  moved into a separate `absolute right-full w-20 bg-gradient-to-r` strip to its left. Measured at
  360/768/1440: rail solid from x=144/504/1176, fade immediately to its left, whole Contact label
  inside the solid region, cart still clickable.
- **Panel polish (owner: "option spacing too long", "rounded at bottom like in current prod").**
  The demo mega panel now mirrors live `Productbar.tsx`: `border border-[#E9F1FA]`,
  `rounded-b-2xl`, `overflow-hidden` (square top, 18px bottom radius), replacing the old
  `border-b border-slate-200`. Hover-panel option spacing tightened — `gap-1.5 -> gap-1` on the
  option list and each item, depth-0 link `py-2 -> py-1.5`; the compact mobile drawer is
  unchanged. Verified at 1024/1440: radii `0/0/18/18px`, 1px `#E9F1FA` border, overflow hidden,
  0 overflow. Full 15-width probe still 0 errors / 0 console errors / 25px bars.
- **Third-level children tightened (owner: "last children spacing is still large in height").**
  Only nested leaf options changed: non-compact `depth >= 1` links went `py-1.5 -> py-1`, taking
  each leaf from **36px to 32px** tall. Parent rows (still 47.3px) and the compact mobile drawer
  are untouched. Verified in the rendered Products panel at 1440; full 15-width probe remains
  0 errors / 0 console errors.
- **Wordmark comparison (owner: "why does the live company name look thicker/stretched than demo?").**
  Measured the exact inner span on both pages. At **xl (1280+) they are pixel-identical**: 21px,
  weight 700, same `Segoe UI`-first stack, 239.23px wide. Below xl the difference is only the
  deliberate proportional downscale from the previous pass — live is 18px@768 / 21px@1024,
  demo is 16px@768 / 18px@1024. There is no font-weight, letter-spacing, stretch or font-loading
  difference (Geist is `unloaded` on both; `--font-sans` resolves to the Segoe UI stack). Restoring
  exact parity below xl means using the live classes `text-[11px] sm:text-[18px] lg:text-[21px]`.

### Production port — same session, owner's final instruction

> "now final document all and words work in daily log and excel, then convert this new navbar,
> newsbar and product bar replacement code to actual frontend layout, ensure it properly fits and
> all content on current one exist on new system, and renders same on all devices. just commit but
> don't push"

- **New `app/components/SiteChrome.tsx`** is the production port of the approved preview. One
  client component now owns the 25px news bar + navbar; the old teal `Productbar` row is gone and
  its destinations live in the centred hover panels. The shared `NewsFeed.tsx` is imported as-is
  with `STATIC_NEWS`; the 25px override is scoped through `[data-news-rail] > div:first-child`, so
  the shared ticker source is still byte-for-byte unchanged.
- **`app/(site)/layout.tsx`** no longer mounts `NewsFeed` + `Navbar` + `Productbar` (nor the
  dynamic ticker loader). It mounts `<SiteChrome />` inside the same sticky `z-[2000]`
  `overflow-x-clip` wrapper. `CartProvider` still wraps the chrome; `CartDrawer` stays mounted once
  at layout level; `STATIC_SITE_SETTINGS` still feeds `SupportButton`.
- **Real actions, not preview mocks:** the news-rail cart is `[data-cart-target]` wired to
  `useCart().openDrawer()` with the live `totals.itemCount` badge; **AI SMART SUGGEST** is a real
  `/find-solution` link; the ⌘K / mobile-icon modal submits to `/search?q=...`; every panel and
  drawer link is a real `next/link`. The demo toast stack, fake cart counter and preview overlay
  are deliberately not ported.
- **Content parity:** all merged sections come from the same `productItems`, AI entries and
  Solutions entries used by the preview. The old chrome exposed 51 distinct hrefs; all are present
  except `/products#compare`, which is remapped to `/products` because the live `/products` page
  has no `#compare` target. `Document Management` was removed only from the duplicate
  All Solutions branch; it remains under Modules → Business Modules. `Bank Import` keeps its
  `/shop#excel-bank-statement-import` deep link. `product-nav.ts` and `Productbar.tsx` are not
  edited; the parent `/services` href was never rendered by the old `Productbar` either.
- **Verification (explicitly requested):** dev server on `:3000`; Puppeteer compared `/` with
  `/demo` at **14 widths, 360–1920 px** — 0 horizontal overflow on both, 25px news bar on both,
  identical navbar row heights (40/44/48/56/64), wordmark sizes (11/14/16/18/21px), nav-label
  sizes (12/14px) and control visibility at every width, 0 console/page errors. Hover panels
  (≥1024) and mobile drawers (<1024) also measured 0 overflow. The real cart drawer and search
  modal both open. **50 unique exposed hrefs, all HTTP < 400.** Link/hover probes target the
  demo layer explicitly (`[aria-label="Two-bar chrome preview"]`), because the hidden live header
  remains in the demo DOM.
- No build, typecheck or static guard was run (single-turn code-generation mode). No push.

## Deliberately not touched

- `NewsFeed.tsx`, `Productbar.tsx`, `Navbar.tsx` and `lib/product-nav.ts` remain byte-for-byte
  unchanged — the port is additive (`SiteChrome.tsx` + the layout mount), not a rewrite of shared
  sources. The nested admin fork is untouched.
- `/demo/checkout*` and `/api/demo/*`, `assertTestKeys()`, `check:demo` guard — unchanged.
- `/demo` still renders its self-contained preview layer through `ChromePreviewV2.tsx`.

## Result

- `/demo` → full-screen new-design preview (news bar + navbar with merged category menus).
- Every other `(site)` route → the same two-bar chrome, now with real cart, search and navigation.

No build/typecheck/static guard was run (single-turn code-generation mode).
