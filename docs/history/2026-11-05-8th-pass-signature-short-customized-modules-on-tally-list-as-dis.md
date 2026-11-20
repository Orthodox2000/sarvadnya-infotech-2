# 2026-11-05 (8th pass) — Signature: short "Customized Modules on Tally" list as distinguishable chips

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Area | Detail |
| :--- | :--- |
| **Brief** | Owner: *"under services mention reduced version of this Customized Modules on Tally: Auto-Entry from Bank-Statement … and many more…, proper font"*, then *"items must be distinguishable and proper presentation"*. |
| **Content (reduced)** | Bank-Statement Auto-Entry · Cloud Service (anywhere, anytime) · Advance CFA · Basic CFA (multi-currency) · Housing Society · Transport (LR + auto-billing) · Container Handling (log sheet + auto-billing) · Broker / Agent Commission · Ready Garment (colour & size) · Business Boosters (document attach, e-sign, GST return & e-invoice lock) · and many more. Long original parentheticals were condensed to one short tail each; no new claims were added. |
| **Presentation** | First attempt was a single `&middot;`-separated paragraph under a `Customized Modules on Tally` label — rejected because the items ran together. Now each module is an **`inline-block` chip** (`background:#F4F9F9`, `border:1px solid #D4EAEA`, `radius:4px`, `padding:2px 8px`, 11px/1.55, brand name at weight 600 `#033B38`, the "what it does" tail at weight 400 `#5A677B`). Chips reflow at any width, so the list needs no second table and cannot overflow. |
| **Emphasis** | Only the NEW module is a **filled teal chip** (`#006569`, white text, `NEW` in `#C5E3E3`) — it carries the emphasis without an extra badge, and the set stays visually uniform. `and many more…` is deliberately chip-less italic `#8A97AA` so it reads as a closing note, not a module. |
| **Type** | Chip text is 11px against the 11.5px body — the label above stays the shared 9px / 700 / 1.3px uppercase teal, so the block sits on the same scale as Services and Certified Industry Partners. |
| **Measured** | Browser probe (local image mapping): **280 / 300 / 320 / 360 / 390 / 480 / 600 / 820 / 1024 / 1280 px → `scrollWidth == clientWidth`, zero elements past the right edge, all 10 images loaded**. 10 chips; 10 chip rows at 280px, 8 at 320/360, 5 at 480, 3 at 820, 2 at 1024+. Widest chip 385px at desktop, 283px at 320 (fits the 288px content box), 243px at 280. Only the Business Boosters chip wraps to two lines below 480px. Page height 1008px at 320, 592px at 1024. No build, typecheck, `check:*` or `test:all`. |
