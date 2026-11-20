# 2026-11-12 (follow-up 3) — `/shop` "Best Seller" ribbon: band behind the text only

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"best seller entire triangle is same colour, i want a ribbon effect, only text has a background diagonally"* — the `clip-path` triangle from follow-up 2 filled the whole corner with one flat teal, which is what they rejected. |
| **Change** | The triangle fill is **gone**. What remains is a **150x24 teal band rotated 45°** with the label centred in it; the card corner keeps its own white background, so only the words carry the coloured strip. Two stacked spans share the exact same box (`left-[-27px] top-[12px] h-6 w-[150px] rotate-45`) — one is the band, one is `flex items-center justify-center` for the text — so the label is guaranteed to sit dead centre in the band. |
| **Why the band is cut off at the edges** | The 72x72 wrapper still carries `overflow-hidden rounded-tr-xl`. The band's ends therefore disappear under the card's top and right edges and follow the 12px radius — that is what turns a rotated rectangle into a *ribbon*. It still cannot poke outside the card. |
| **Numbers** | Band centre on the corner diagonal at perpendicular distance **d = 34px**, thickness **24px**. Visible axis length = `2d` = **68px** for a ~59px label → ~4px clear at each cut end. The band's near edge lands **31px** along each edge from the corner, which leaves the small white corner tip — that tip is the ribbon look, and it is why the corner is no longer one flat colour. |
| **Collision check** | The band occupies `u + v` in **[31, 65]** (`u` = distance from the card's right edge, `v` = from the top). Chip row is left-aligned (`u >= ~100`); the title's first line starts at `v ≈ 50`, i.e. `u + v >= 70`. Clear by ~5px at every width. |
| **Unchanged** | Card spacing pass (follow-up 1), the `whitespace-nowrap` / 11.5px action buttons (follow-up 2), `pointer-events-none` on the ribbon. |
| **Not done** | No screenshot — fit is arithmetic plus the `overflow-hidden` clip as the hard guarantee. |
