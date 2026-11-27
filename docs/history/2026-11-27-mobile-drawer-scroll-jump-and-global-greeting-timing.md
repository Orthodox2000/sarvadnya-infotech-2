# 2026-11-27 — Mobile drawer scroll-jump fixed; greeting popup moved to ONE global 15 s / 6 h rule

## Why

Owner, urgent:

> "urgent error, for mobile navbar hiden menu, scrollbar is not smooth for mobiel, it first scoll to bottom of website , then scrolls menu"

and, in the same turn:

> "and popup modal, change setting to one lobal, when user visits, it waits 15 seocns and see popup modal, and records time, reset only after 6 hours"
> "applicable to all"

Both were reproduced/measured before editing.

## 1. Mobile drawer scroll jump

### Root cause (measured)

`SiteChrome.tsx` rendered the drawer as an **in-flow child of the sticky header**. At 360 × 800:

| | scrollY | header | wrapper | document height |
| :-- | --: | --: | --: | --: |
| before open | 300 | 66 px | 66 px | 5308 px |
| after open | **2245** | **2011 px** | **2011 px** | 7253 px |

The drawer added 1945 px *above* the viewport; scroll anchoring pushed `scrollY` by exactly that
amount. It also made the sticky header 2011 px tall. The visible symptom was "scroll to the bottom,
then scroll the menu".

### Fix — `app/components/SiteChrome.tsx`

- Drawer is now an **absolute overlay** anchored to the `relative` header (`top-full`, capped at
  `max-h-[calc(100dvh-5rem)]`, `overflow-y-auto overscroll-contain`, `role="dialog"`,
  `aria-label="Site menu"`), plus a `fixed inset-0` backdrop (`Close menu`) for tap-outside close.
  The header and document height no longer change when it opens; the links scroll inside the panel.
- `useEffect` on `mobileOpen` locks `document.body.style.overflow = 'hidden'` and **restores the
  previous value** on cleanup, so background scroll stops while the overlay is up and resumes after.
- Escape now also closes the drawer (it was already closing search / hover section).

### Verified (headless Chrome, 360 × 800, running dev server)

- `scrollY 300 -> 300` on open; document height `5308 -> 5308`; header/wrapper stay `66 px`.
- Drawer `clientHeight 719 / scrollHeight 1944`, top `65` — scrolls internally; scrolling it does not
  move the page.
- Backdrop present; body overflow `hidden` while open; Escape closes and restores scroll.

## 2. Greeting popup — one global rule

### Old model (removed)

New visitor (no `svd_vid` cookie) got the card immediately; repeat visitor got it after 20 s. The
decision used a `<head>` window global (`__svdGreetingReturning`), the admin's visitor-session cookie,
and a **sessionStorage** flag (`svd_greeting_2026_session`) that was reset to `'0'` on repeat visits.
That is three moving parts and it was not the rule the owner asked for.

### New model — `lib/greeting-popup.ts`, `app/components/GreetingPopup.tsx`, `app/layout.tsx`

- **Every** visitor: wait `GREETING_DELAY_MS = 15_000` from landing, then show the card and write
  `Date.now()` to **`localStorage['svd_greeting_2026_shown_at']`**.
- **No card for 6 hours** (`GREETING_COOLDOWN_MS = 6 * 60 * 60 * 1000`) regardless of reloads, tabs
  or sessions. After 6 h the 15 s timer runs again.
- Removed `GREETING_RETURNING_GLOBAL`, `VISITOR_SESSION_COOKIE`, `GREETING_REVISIT_DELAY_MS`,
  `GREETING_SESSION_KEY`, `GREETING_STORAGE_KEY` and their imports. The `svd_vid` cookie is no longer
  read by the popup (VisitorProvider still uses it for admin analytics — untouched).
- `shownRef` still blocks a second card in one page load (StrictMode-safe); read/write stays inside
  effects, never during render. Reveal re-checks the skip paths (`/checkout`, `/demo`) and the
  cooldown, so navigating to a payment route mid-countdown cannot put a modal over checkout, and a
  second tab showing the card meanwhile cancels the pending one without extending the cooldown.
- `buildGreetingPreloadScript()` simplified: skip paths + cooldown check only; preload the artwork
  when a card is actually due. `app/layout.tsx` preload comment updated.

### Verified (headless Chrome, fresh browser context)

- Timer is scheduled for exactly 15000 ms; no popup at 13 s from the schedule, visible at 16 s.
- Timestamp written at show time; reload during cooldown shows no popup and leaves the timestamp
  unchanged; with a 7-hour-old timestamp the 15 s timer runs again (quiet at 12 s, popup at ~16 s).
- All skip paths and existing dismissal handlers unchanged.

## Not done

- No build, typecheck or static guard suite (owner's single-pass directive, AGENTS §3). Verification
  was browser-based against the already-running dev server only.
- No push — the owner did not ask for one in this turn; the commits stay local.
- Nested admin fork untouched.

## Result

- Mobile hidden menu opens smoothly without moving the page; it scrolls in its own capped panel.
- One global popup setting: 15 s delay, show time recorded, reset only after 6 hours, for everyone.
