# 2026-11-27 — `botid` installed (not wired), new navbar verified across devices, pushed to origin

## Why

Owner: "install npm i botid". After the install, a follow-up about a Vercel BotID prompt
("vercel asked m to add to log bot") was ambiguous; when asked to clarify, the owner replied:

> "f0oret it ,document all and push new navbar to origin"

So: **no BotID code was wired**; this session documents the install, the full navbar verification,
and pushes the pending navbar port (`050cf82`) to the canonical remote.

## Changes

### 1. `botid@1.5.13` installed — package only

- `npm i botid` on Node v24.21.0 / npm 11.19.0.
- `package.json`: `"botid": "^1.5.13"` added to `dependencies`.
- `package-lock.json`: +18 lines recording the resolved package.
- **Not wired into any route, middleware or component.** `initBotId()`, `checkBotId()` and
  `<BotIdClient />` are deliberately absent — the owner cancelled that work before it started.
  No `next.config.js`, `middleware.ts` or route handler was touched.
- `npm audit` reported 8 pre-existing vulnerabilities (4 moderate, 4 high); `audit fix` was
  **not** run, so no unrelated dependency was changed.

### 2. Navbar verification (no code changes)

The live navbar is **`app/components/SiteChrome.tsx`**, mounted by `app/(site)/layout.tsx`.
`app/components/Navbar.tsx` is **dead code** — unmounted since `050cf82`; edit `SiteChrome.tsx`
and `lib/product-nav.ts` for navbar work.

Method: headless Chrome (Puppeteer 25.17.0 / system Chrome) against the already-running dev server
on `http://127.0.0.1:3000`. No dev/build start or stop, no `.next` collision.

| Viewport | Result |
| :-- | :-- |
| 360 × 800 | Pass — no horizontal overflow (360/360); logo, news rail (Contact / Careers / cart), mobile search button and hamburger visible; desktop categories hidden; drawer opens (51 links, 5 sections), no overflow with it open, closes |
| 390 × 844 | Pass — same as 360 (390/390) |
| 768 × 1024 | Pass — `md` switch correct: hamburger visible, AI Smart Suggest shown, search-modal button hidden; drawer works |
| 1024 × 768 | Pass — 5 hover categories + AI Smart Suggest visible, hamburger/search hidden; no overflow; all 5 hover panels open after the first-load greeting popup is dismissed |
| 1280 × 800 | Pass — hover panels open (Products 10 links, Modules 22, AI & Learning 8, Services 6, About Us 5); no overflow |
| 1440 × 900 | Pass — same, no overflow |

**Link validity**

- 39 unique navbar route paths collected from the rendered header, mobile drawer and hover panels —
  every one returned **HTTP 200**. Includes `/`, `/find-solution`, `/careers`, `/contact`, `/search`,
  `/shop`, and every product/service/module destination from `lib/product-nav.ts` plus the inline
  AI/solution lists in `SiteChrome.tsx`.
- 7 hash deep links verified by loading each URL **with the hash** so the client deep-link effect
  renders the target: all anchors found (5 on `/addons`, `/shop#shop-filters`, and
  `/shop#excel-bank-statement-import`).
- `/shop#excel-bank-statement-import` only exists in the DOM after the deep-link effect expands the
  paginated list — loading bare `/shop` and querying the id is a false negative (AGENTS §5.6 contract).

**Interactions**

- Search modal opens on tap (mobile) and on Ctrl+K (desktop); submitting `gst` navigates to
  `/search?q=gst`.
- Cart button opens the real `CartDrawer` (`role="dialog"`, `aria-label="Your cart"`).
- Mobile drawer opens/closes via the `Toggle menu` button; all 5 sections and 51 links render.

**Non-defects observed**

- `GreetingPopup` is a full-screen `z-[100002]` modal on first load. It intercepts hover/click until
  dismissed (✕ / outside / Esc) — by design, not a navbar fault. Dismiss it in any automated probe.
- `Navbar.tsx` being stale is expected; it is retained but unreferenced.

### 3. Push

- `050cf82 feat: port approved two-bar chrome into site layout` was **local only** — `origin/main`
  and `secondary/main` were both at `20ab47a` before this session.
- Pushed to **`origin main`** (owner's explicit request) and **`secondary main`** (standing
  dual-remote discipline in AGENTS §2.5) together with this session's docs + botid commit.

## Deliberately not done

- No BotID integration code, no `botid` config, no new environment variable.
- No build, typecheck or static guard suite — the owner's single-pass mode (AGENTS §3) applies;
  verification was browser-based only.
- Nested admin fork (`sarvadnya-advanced/`) untouched.

## Result

- `botid@1.5.13` present in the dependency tree but unused.
- Navbar confirmed working and correctly rendering at six widths with all links valid.
- New navbar + session docs now live on both remotes.
