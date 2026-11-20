# 2026-11-12 (follow-up) — `/shop` card "Best Seller" tag → in-card stamp badge

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"that shop best seller tag is weird, fix it inside card, make it as a stamp tick or badge"*, then *"it must not look weird and outside card, also increase spacing in shop cards as currently all seems cramped"*. |
| **Before** | `app/(site)/shop/shop-browser.tsx` `ShopCard` hung the tag **above** the card (`absolute bottom-full`, plus a rotated-square pointer) since 2026-10-30, and the grid carried a reserved `gap-y-6` so one row's tag never overlapped the card above. It read as a floating label detached from the product. |
| **After** | A **filled teal stamp badge with a tick** — `rounded-full bg-[#006569] text-white`, inset hairline ring, 12 px checked SVG — sits at the **top-right of the card's own chip row** (`ml-auto`, last child of the same `flex flex-wrap` row as the group/category chips). Top-right placement + fill makes it read as a corner stamp; the outlined chips beside it stay visually subordinate. |
| **Why normal flow, not `absolute top-3 right-3`** | The card is one grid track wide: **328 px** at the 360 px floor with the page's `px-4`, i.e. 288 px of content at `p-5`. An absolute corner stamp must either cover the chip row or force `pr-*` reservation that pushes "TDL Add-on" and "Billing & Invoicing" onto two lines. In flow with `ml-auto` the row simply wraps — the badge drops to its own right-aligned line and nothing is ever covered, overflowed or left hanging outside the border. |
| **Spacing pass** | "Cramped" was structural, not a single value: card padding **16 → 20 px** (`p-4` → `p-5`), grid gap **12 → 16 px** (20 px from `sm`), chip row `mb-2/gap-1.5` → `mb-3/gap-2`, summary `mt-2/12.5 px` → `mt-2.5/13 px`, tags `mt-3/gap-1.5` → `mt-4/gap-2` with `px-2 py-1/11 px`, detail panel `mt-4` → `mt-5` with `p-4`, `space-y-2`, `pt-4`, action row `pt-4/gap-2` → `pt-5/gap-2.5`, buttons `h-9/11.5 px` → `h-10/12 px`. Results header `mb-3` → `mb-4`. |
| **Also reverted** | The grid is no longer `gap-x-3 gap-y-6`: the vertical reservation existed only for the above-card tag. Cards are equal height per row (`h-full` + `mt-auto` actions), so the change cannot misalign a row. |
| **Verification** | `npm run typecheck` clean, and the file was re-read to confirm no `bottom-full` / `gap-y-6` layout remains (only the explanatory comment mentions them). No build and no browser probe — the width arithmetic above is reasoning, not a measurement. |
