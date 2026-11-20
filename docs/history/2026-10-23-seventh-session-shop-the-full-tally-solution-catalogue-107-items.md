# 29. 2026-10-23 (seventh session) — `/shop`: the full Tally solution catalogue (107 items) + Ask Sara / search / nav / sitemap wiring

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

**Owner:** *"tst build , document in detail and push"* on a `/shop` feature set that arrived
**uncommitted** from a concurrent writer. Scope read literally: **test** it, **build** it, **document** it,
**push** it. The catalogue, its copy and its UI were left **unmodified in substance**; only two defects
found by testing were fixed (SEO metadata length, deep-link paging) and both are called out below.

`/shop` is a **new, self-contained** catalogue page. `/addons` (20 curated add-ons) and `/modules`
(6 industry modules) are **untouched** — `/shop` is the complete list and merely **overlaps ~20 items**
with `/addons`.

#### 29.1 The data module (single source of truth)

| Fact | Detail |
| :--- | :--- |
| **`lib/tdl-catalog.mjs`** | Pure ESM, zero deps, committed data — **no database read anywhere**, so `/shop` prerenders (`○ /shop`, 6.58 kB, 142 kB first load). Exports `TDL_ITEMS`, `TDL_GROUPS`, `TDL_CATEGORIES`, `TDL_FEATURED`, `getTdlItem(slug)`. |
| **Catalogue size** | **107 items** — `addon: 73`, `excel: 11`, `booster: 9`, `module: 14`; **9 categories**; **10 featured**. Group counts and category counts each sum to 107 (asserted). |
| **Item shape** | `{ id, slug, title, summary, detail[], tags[], keywords[], group, category, featured }` + `href = "/shop#<slug>"`. `id === slug` and every slug is lowercase `[a-z0-9-]` (asserted). |
| **HARD RULES baked into the data** | **No prices anywhere** (the source spreadsheet's price columns were dropped at extraction) and **no single-user / multi-user split**. The item type has no price/cost/mrp/rate/discount field and no item text contains `₹`/`Rs.` — both asserted in this session's data audit. |
| **Typed surface** | `lib/tdl-catalog.ts` is a thin **typed facade** over the `.mjs` (same house pattern as `lib/addons.ts` over `lib/addons.mjs` and `lib/prices.ts` over `lib/prices-catalog.mjs`), with a hand-written `lib/tdl-catalog.d.mts` so plain Node and TypeScript share one list. |

#### 29.2 The page and its client island

| File | Role |
| :--- | :--- |
| `app/(site)/shop/page.tsx` | **Server component** (metadata + structured data static). Emits `ItemList` JSON-LD (name + deep link for all 107, **no Offer — there is no price to be honest about**) + `breadcrumbJsonLd`. |
| `app/(site)/shop/shop-browser.tsx` | **The only client island.** Sidebar + search + sort + filters + card grid + detail accordion + Buy/Ask actions. `React.memo` cards, `useMemo` for the filtered list, `useCallback` handlers. |
| `app/(site)/shop/needs-wizard.tsx` | "Not sure what you need?" panel — three chips (business type / area / the actual pain) composed into **one visible, editable sentence** with two exits: **Ask Sara** (prefills the chat) or **Send to our team** (prefills the enquiry form). |

Behaviour that is easy to break later:

| Rule | Detail |
| :--- | :--- |
| **Paging** | `PAGE_SIZE = 24`; only the first 24 cards render and "Show more" adds 24. 107 cards at once is heavy on the low-end phones this site targets. Any **filter change** resets paging to 24 — **but not a mount** (see the deep-link fix below). |
| **Deep links are the contract** | Every item is addressable at `/shop#<slug>`. Ask Sara, the sitemap `ItemList` JSON-LD, the nav and the search API all point at that shape, so the hash target **must** exist in the DOM on load. |
| **Buy is a quote request** | `handleBuy` opens `UnifiedContactModal` prefilled `Shop: <title>` with `destination="addons"` (an explicit destination, not a path-derived one — and a **new** destination would silently email nobody, see §6). Nothing is priced or charged; `/shop` never touches the cart or Razorpay. |
| **Ask Sara is prefill-only** | `handleAsk` calls `askSara(...)` from `lib/ask-sara.ts`; the visitor still presses send. There is no auto-send and no autonomous capture. |
| **URL state** | `q` / `category` / `group` are mirrored into the query string (via `history.replaceState`, not a navigation), so a filtered view is shareable and Back does not thrash. |
| **Responsive** | Filters collapse behind a toggle below `lg` (`aria-controls="shop-filters"` + `aria-expanded`); a result counter is `aria-live="polite"`; zero horizontal overflow at 360/768/1024/1440 (probed). |

#### 29.3 Wiring into the rest of the site

| Area | Detail |
| :--- | :--- |
| **`lib/ask-sara.ts` (NEW)** | One tiny contract: `SARA_ASK_EVENT = 'sara:ask'` + `askSara(question)` dispatching a `CustomEvent`. Ask Sara is a single global widget, so a page cannot hold its state — this keeps `SupportButton` the **only** owner of "is the chat open". |
| **`app/components/SupportButton.tsx`** | Listens for `sara:ask`, sets `initialQuestion`, opens the chat; `initialQuestion` is **cleared on close** so reopening manually never resurfaces an old question. |
| **`app/components/QuickSupportModal.tsx`** | New optional `initialQuestion` prop + an effect that places it in the input **when the modal opens**. Prefill only — never auto-sent. (The chat input is `input[type="text"][placeholder^="Type your message"]`, which is worth knowing before writing a probe.) |
| **`lib/sara-catalog.mjs` / `.d.mts`** | Imports the same catalogue and adds a **`shop` bucket** (`SHOP_CATALOGUE`, `SHOP_ITEMS`), the generated prompt block and the **offline** matching — so the AI path and the no-API fallback describe the same 107 items. One source of truth, no drift. |
| **`lib/sara-topics.ts`** | New topic **"Tally Shop & Ready-Made Add-ons"** (10 topics total) + add-on/shop fallbacks that answer with real items and the `/shop#slug` link. |
| **`app/api/chat/route.ts`** | The static site map inside **both** system prompts gained `Shop (107 TDLs, importers, boosters, modules): /shop`. |
| **`app/api/search/route.ts`** | `matchShopItems()` runs **before** the DB results and `/shop` was added to `SITE_MAP`. Consequence worth keeping: a search for *"duplicate purchase"* now returns a real shop item instead of nothing. |
| **`lib/product-nav.ts` + `Productbar`** | A **Shop group inside Modules** plus a **top-level Shop** entry flagged `desktopOnly: true`; `Productbar` already honours that flag with `hidden md:flex`, so the 360 px row is unchanged (probed: no product-bar overflow at any width). |
| **`app/sitemap.ts`** | `/shop` added. |

#### 29.4 The two defects testing found (the only code changed)

| Defect | Cause | Fix |
| :--- | :--- | :--- |
| **SEO metadata over the site's limits** | The new page shipped an 86-char `<title>` and a 223-char description (incl. suffix) — fresh `check:seo` warnings on a brand-new page. | Title → **`Tally Shop: TDL Add-ons & Importers`** (60 incl. `" \| Sarvadnya Infotech LLP"`), description → **157 chars** incl. the contact suffix. Same message, no new warnings. |
| **Deep links landed on nothing for items outside the first page** | The mount-time paging reset ran **after** the deep-link effect and overwrote `setVisible(TDL_ITEMS.length)` with 24, so `/shop#<slug>` only worked if the slug happened to be in the first 24 (`#duplicate-purchase-block` did, which is why it looked fine). Every other link — most of the 107 — stayed blank. | A `pagingReady` ref **skips the mount run** of the reset effect, so paging restarts on a filter **change** only. Verified with a deliberately late slug (`#container-handling-module`): the whole catalogue renders, the target opens and scrolls into view. |

#### 29.5 Verification (measured)

| Check | Result |
| :--- | :--- |
| `npm run typecheck` | **exit 0** |
| Catalogue data audit (ad-hoc, not committed) | **107 items**, groups 73/11/9/14, 9 categories, 10 featured, unique slugs, valid group+category+`href`, all arrays present, **0 price-like fields**, **0 price text**, both count sums = 107 |
| `check:h1` / `check:seo` / `check:insights-svg` / `check:demo` / `security:check` | **PASS** (only pre-existing SEO warnings remain) |
| Local suites | sara-topics **39/39** · sara-guard **51/51** · sara-catalog **37/37** · cart **32/32** · order-status **36/36** · dates **9/9** · payment-limit **45/45** · payment-gateway **26/26** · seo-links **18/18** · referral **19/19** · demo-cart **28/28** · demo-razorpay **23/23** |
| `test:all` | `scripts/sara-test.mjs` failed once on the **known deployed-site LLM flake** ("Off-syllabus TSS content leaked into a stock answer") and passed **19/19** on retry — the documented §18 pattern, unrelated to this work |
| `npm run build` | **exit 0**, `/shop` prerendered **static** (`○`, 6.58 kB / 142 kB) |
| Runtime (`next start`) | `/shop` **200**, correct `<title>`, **3** JSON-LD blocks, `/api/search?q=duplicate purchase` returns a shop item, `/sitemap.xml` contains `/shop` |
| Puppeteer `/tmp/opencode/verify-shop.cjs` | **54/54** at 360/768/1024/1440 — single H1, **zero horizontal overflow**, 24 cards first page, product bar no overflow, top-level Shop **hidden <768 / visible ≥768**, mobile filters collapse→expand, search narrows + counter + URL sync, clear-all, show-more, both deep links (early **and** late slug) render+open+scroll, Buy opens the enquiry modal prefilled `Shop: …`, Ask Sara opens with a prefilled question, wizard composes the sentence and opens the form, wizard fits 360 |

#### 29.6 ⚠️ Build-collision hazard, realised twice in this session

The §9 rule is not theoretical. During this work a **`next dev --turbopack -p 3100`** was started inside the
repo by another process while a production build was running: `.next` was corrupted, **every route
returned 500**, and the following builds failed with `PageNotFoundError: Cannot find module for page:
/_document` and `Invariant: no direct app page entry found for /_not-found` (plus one OOM kill, exit **137**,
on this memory-tight box). Repaired exactly as §9 prescribes — stop the dev processes, `rm -rf .next`
(which itself failed `ENOTEMPTY` while the dev server held files), rebuild → **exit 0**.

**Never build in the working repo while a dev server is running.** Kill by **PID**: `pkill -f "next start -p
3123"` matches the invoking shell's own command line and kills the shell (observed).

#### 29.7 Don't break

- **No prices and no single/multi-user split** anywhere in `lib/tdl-catalog.mjs` — that is the owner's explicit rule, and the sheet's price columns were deliberately dropped.
- **`lib/tdl-catalog.mjs` is the ONE source** for the shop; `lib/sara-catalog.mjs` and `app/api/search/route.ts` **import** it. Never re-declare shop items in the prompt or in a second list.
- **`/shop#<slug>` is a public contract** (JSON-LD, nav, search, Sara). Keep paging from resetting on mount.
- **Buy must stay a quote request** routed to the existing `addons` destination; never a cart/price path.
- `askSara()` is **prefill-only** — do not auto-send, and do not add a second owner of the chat's open state.
- `/addons` and `/modules` are **not** to be folded into `/shop`.
