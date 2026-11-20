# 2026-11-05 (2nd pass) — Diwali popup: no timeout, lighter backdrop, page scroll locked

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Area | Detail |
| :--- | :--- |
| **Brief** | Owner: *"keep it until someone closes or clicks outside, and background green blur is too much, reduce lightly."* |
| **Timer removed** | `AUTO_CLOSE_MS` and its `setTimeout` effect are deleted. The card is dismissed only by the ✕, a click outside it, or `Escape` (all three already existed). The `localStorage` entry is still written **at open time**, so dismissing is not what makes it stop reappearing on other pages. |
| **Lighter backdrop** | Overlay class changed `bg-[#033B38]/75 backdrop-blur-sm` → **`bg-[#033B38]/30 backdrop-blur-[2px]`**. The green tint and the blur are both much weaker; the card keeps its own drop shadow + `ring-white/15` so it still reads as the top layer. |
| **Scroll lock added** | With no timer the card can sit for minutes, so a scrollable page behind a dimmed layer looks broken. `document.body.style.overflow = 'hidden'` while open, restored to the **previous** value on close and on unmount — the same pattern as `ModuleModal` / `UnifiedContactModal`, so a navigation while it is open cannot leave the site unscrollable. |
| **Consequence to know** | Because it now waits for a dismissal, it **covers the cookie banner** (`z-[100001]`, bottom-right) until closed. The banner is untouched and is still there underneath afterwards. |
| **Unchanged** | First-visit-only storage, the in-memory re-show guard, `/checkout` + `/demo` skip, the square fitting rule (`min(90vw,80vh,32rem)` + `object-contain`), the alt text, and the two-step removal. |
| **Verification** | Standing single-pass directive honoured — no build, dev/start server, typecheck, `check:*` or browser probe. |
