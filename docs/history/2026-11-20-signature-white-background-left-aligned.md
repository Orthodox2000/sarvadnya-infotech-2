# 2026-11-20 — signature: white background, left aligned

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner, correcting the previous change: *"i dont want is center align or background colour teal, white bg and left aligned"*. |
| **Background** | `#E8F0F0` → **`#FFFFFF`** on `<body>`, the outer table's `bgcolor` and `background-color`. No teal remains in the signature. |
| **Alignment** | Centering cell `align="center"` → `align="left"`; card table `align="center"` → `align="left"`. The signature now sits against the left edge (with the 12px cell gutter) instead of being centred. |
| **Kept** | The rest of the classic Tally settings from the previous session: full-width outer table, `padding:24px 12px` centering/cell gap, `width="600"` card with `max-width:600px;width:100%` and `1pt solid #dddddd` border, no `<style>` block, inline no-underline links, tagline removed. Internal two-column layout, strips, placeholders and icons untouched. |
| **Note** | The four remaining `align="center"` values are on the Certified Industry Partner tile `<td>`s, where they centre each logo inside its own 64px tile — intentional, not wrapper alignment. |
| **Verified** | Static checks: no teal, white body/outer, left-aligned wrapper, card intact, no `<style>`, 27/27 links no underline, tagline gone, two-column internals intact. Standing single-pass directive (§3): no build, dev server, typecheck or check suite run. |
