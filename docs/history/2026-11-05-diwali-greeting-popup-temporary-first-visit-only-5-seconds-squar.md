# 2026-11-05 — Diwali greeting popup (temporary): first visit only, 5 seconds, square card fits every screen

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Area | Detail |
| :--- | :--- |
| **Brief** | Owner: *"i have 2 diwali photos. i want diwali template .png to appear on any first time visitors for 5 seconds then auto close, responsive on each screen fit, its square so ensure proper render ... its temporarily, we remove it manually later."* Asset used: **`public/diwali template 2026.png`** (measured **1080×1080**, 8-bit RGB, 2,179,111 bytes) — the square one; `public/diwali.png` (1920×960) is untouched. |
| **Change** | **NEW `app/components/DiwaliPopup.tsx`** (client component) + **one mount** in `app/(site)/layout.tsx` inside `VisitorProvider`, beside `<ConsentBanner />`. No DB, env, settings, CSS or `next.config.js` change. |
| **First-visit memory** | `localStorage['svd_diwali_2026'] = '1'`, same `svd_*` convention as the consent notice. Written **at open time**, not at close, so a visitor who navigates mid-show cannot see it again on the next page (the ConsentBanner September bug). Plus an in-memory `shownRef`, because `(site)/layout` does **not** remount on client-side navigation — with storage blocked (private mode) the write fails silently and the effect would otherwise re-fire per route. |
| **5 seconds** | `AUTO_CLOSE_MS = 5000` `setTimeout` cleared on unmount. Escape, backdrop click and the ✕ all close early; focus moves to the ✕ on open (`preventScroll`). **No `body` overflow lock** — it would hide the scrollbar for 5s and shift the page twice, worse than letting the visitor scroll behind the backdrop. |
| **Square, fully visible** | Wrapper `aspect-square w-[min(90vw,80vh,32rem)]`, image `width/height 1080` + `object-contain`, `sizes="(max-width: 640px) 90vw, 512px"`, `priority`. One rule covers 360 px (324 px card) and landscape (80vh cap) with a 32rem desktop ceiling; 80vh leaves room for the close button. `object-contain` in a 1:1 box means a future non-square replacement is letterboxed, never cropped or stretched. `dvh` was **not** used — nothing else on this site uses it, and `dvh` in a `min()` would invalidate the whole width declaration on older Safari. |
| **Stacking** | `z-[100002]` — above `ConsentBanner` (`z-[100001]`) and every modal (`z-[100000]`). Both can appear on a true first visit; the card covers the banner's corner for 5s and leaves the banner itself (which stays until dismissed) untouched. |
| **Deliberate skip** | `/checkout` and `/demo` (prefix match, `SKIP_PATHS`). A first-time visitor can arrive there from a shared link and a 5s blocking card is a lost order. Remove the two entries if the owner wants it literally everywhere. |
| **Removal later (by hand)** | Two steps: delete `app/components/DiwaliPopup.tsx`, then its `import` line and `<DiwaliPopup />` line in `app/(site)/layout.tsx`. The stale `svd_diwali_2026` key in visitors' localStorage is harmless. |
| **Verification** | Standing single-pass directive honoured — **no** build, dev/start server, typecheck, `check:*` or browser probe was run. The alt text is not a generic/filename value, so `check:alt` will pass; no `<h1>` is added, so `check:h1` is unaffected. |
