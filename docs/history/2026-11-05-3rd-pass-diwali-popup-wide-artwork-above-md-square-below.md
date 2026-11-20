# 2026-11-05 (3rd pass) — Diwali popup: wide artwork above `md`, square below

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Area | Detail |
| :--- | :--- |
| **Brief** | Owner: *"for devices above md show diwali.png which is wider."* |
| **Two assets** | `SQUARE_ART` = `public/diwali template 2026.png` (1080×1080) below the Tailwind `md` breakpoint; `WIDE_ART` = `public/diwali.png` (1920×960, 2:1) from 768 px up. |
| **How the swap is done** | `window.matchMedia('(min-width: 768px)')` in an effect, with a `change` listener (so rotation / window resize while the card is open swaps artwork) removed on unmount. **Not** two `hidden md:block` `<Image>` tags: that ships both srcsets and `priority` preloads both, i.e. every visitor downloads two festival images for one card. No hydration risk — the card renders nothing until the first-visit effect opens it, and the breakpoint state is set in the same post-mount effect batch. |
| **Fitting, now per artwork** | square `< md`: `aspect-square w-[min(90vw,80vh,32rem)]`. Wide `>= md`: `aspect-[2/1] w-[min(90vw,160vh,56rem)]` — because the ratio is 2:1 the height lands at `min(45vw,80vh,28rem)`, so it is still **never taller than 80vh** at any width. `object-contain` stays, so neither artwork can be cropped or stretched. |
| **`sizes`** | square: `(max-width: 640px) 90vw, 512px` (unchanged). wide: `(min-width: 1280px) 896px, 90vw` — at ≥1280 px the card is capped at 56rem = 896 px, so asking for 90vw would make the optimizer return a bigger file than the slot needs. |
| **Alt text** | Different per artwork (`check:alt`): the square keeps the wishes line, the wide one is "Happy Diwali from Sarvadnya Infotech LLP — festive greeting banner" (no invented visual detail). |
| **Unchanged** | First-visit-only storage, no timer, lighter backdrop, scroll lock, `/checkout` + `/demo` skip, two-step removal. |
| **Verification** | Standing single-pass directive honoured — no build, dev/start server, typecheck, `check:*` or browser probe. |
