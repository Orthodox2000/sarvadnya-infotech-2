# 2026-11-12 (follow-up 2) — `/shop` "Best Seller" → diagonal corner ribbon; card buttons no longer wrap

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"its still bad, make a corner crossed best seller"* (the inline pill from follow-up 1 was rejected) and *"also get quote moves text wraps to next line, reduce size if needed"*. |
| **Final shape** | A **solid teal diagonal corner ribbon**: a 72x72 box welded to the card's top-right corner, containing a `clip-path: polygon(100% 0, 0 0, 100% 100%)` triangle and one rotated line of white uppercase text (`rotate-45`, 9px, `tracking-[0.08em]`). It reads as a stamp across the corner, and the label is the only thing on the diagonal. |
| **Why a clipped triangle, not a rotated rectangle** | A rotated strip near a 90° corner is the trap: either the strip is offset ~36px from the corner (leaving a bare notch and, at 20-24px thickness, only ~40-70px of visible text), or it is pushed into the corner and the text is cut mid-letter. The triangle covers the corner completely *and* leaves a straight hypotenuse for text — the geometry the two rejected attempts were fighting. |
| **Why it cannot escape the card** | The wrapper carries `overflow-hidden rounded-tr-xl`, so the ribbon is clipped to the card's own 12px radius. The 2026-10-30 version hung **outside** the border (`absolute bottom-full`) — that is exactly the defect this removes. |
| **Text fit (measured on the box, not eyeballed)** | The label sits on the triangle's median (`x + y = 72`), ~11px in from the hypotenuse, where the open chord is `72√2 - 2·11 ≈ 79px`. "BEST SELLER" at 9px with `0.08em` tracking is ~70px → ~4px clear at each end, so no letter is clipped. |
| **Content collision check** | The triangle is the region `u + v <= 72` (`u` = distance from the card's right edge, `v` = from the top). The chip row is left-aligned, i.e. `u >= ~100` down to the 360px floor, and the title starts at `v ≈ 54`, where the triangle has already withdrawn past the 20px padding (`u <= 18`). Nothing is covered at any width, and the ribbon is `pointer-events-none` so it never eats a click. |
| **Buttons** | "Get Quote" wrapped onto two lines in the 3-up layout beside the filter sidebar, where each action button is only ~84px wide: `px-3.5` (28px) + a 12px label left ~56px of text box for a ~61px word. Fixed by `whitespace-nowrap`, `text-[11.5px]` and `px-2` (→ ~58px label in a ~68px box), and the expanded label was shortened **"Hide details" → "Hide"** — it could not fit two words in that track either. Row gap `2.5 → 2` to keep the pair balanced. |
| **Unchanged** | The spacing pass from follow-up 1 (p-5 card, 16/20px grid gap, wider chips/tags/detail paddings) stands — the ribbon replaces only the badge. |
| **Not done** | No browser/Puppeteer screenshot of the ribbon. The fit above is arithmetic on the box, plus `overflow-hidden` as the hard guarantee that it stays inside the card. |
