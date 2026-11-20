# 2026-11-05 (13th pass) — Signature: hybrid columns, one-line wordmark, wider gutter, 590px

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Area | Detail |
| :--- | :--- |
| **Brief** | Owner, in three messages: mobile after sending shows *"company name overflows and wraps bad while contact stays flex, we need flex wrap there"*; then *"increase spacing between company details and contact and never wrap company name and reduce width by 10px on desktop max"*; then *"mobile number wrap goes below mobile title"* and *"at least double"* for the spacing. |
| **Root cause** | A signature pasted into Gmail keeps only table markup — the `<style>` block is dropped, so the `.sig-col` media query never travelled with the mail. The surviving two-cell table therefore stayed side by side at every width and squeezed the wordmark into 2–3 lines on a phone, while the Contact cell's phone pairs wrapped under their labels. |
| **Layout** | The two-cell table is replaced by the hybrid ("spongy") pattern: two `div.sig-col` with `display:inline-block; width:100%; max-width:346px` (brand) / `244px` (contact), `vertical-align:top`, `box-sizing:border-box`, inside a `font-size:0;line-height:0` wrapper with no whitespace between the tags. Two columns fit from a 590px content width and stack below it — no media query at all, so the sent-email copy behaves the same as the file. |
| **Font** | The Calibri stack, 11.5px/1.6 and `#3D4A5C` are now also inline on the outer `table.sig-shell`, so the type survives when the `<style>` block does not. |
| **Wordmark** | `white-space:nowrap` with `font-size:16px; font-size:clamp(10px,3.9vw,16px)` — *"Sarvadnya Infotech LLP"* is one line at every width probed. 16px measures 182px in Arial/Liberation and the name cell leaves 186px, so a wider font still cannot force a wrap. The certificate-to-name gap went 7px → 5px to pay for the gutter. |
| **Gutter** | The space between the company details and Contact is the brand column's `padding-right`: **16px → 48px** (three times the original, "at least double"). Because padding sits inside `max-width`, it stays a true inline-only gutter in both the side-by-side and the stacked state. |
| **Width** | Column total **600px → 590px** on desktop (346 + 244). Contact keeps 244px of text width — the same as the old 260px column minus its 16px trailing inset — so the paired numbers on the MOBILE row stay beside the label instead of dropping below it. |
| **Sign-off** | Still plain text (0 anchors, 0 `tel:` / `mailto:`), now styled as body ink `#5A677B` at weight 400 with `text-decoration:none`, so it cannot read as a clickable contact line. |
| **Docs** | Header/markup comments rewritten for the 346 + 244 geometry, the 48px gutter, the nowrap rule and its measured 182px/186px numbers. |
| **Measured** | Puppeteer at 280 / 300 / 320 / 360 / 390 / 480 / 589 / 590 / 640 / 700 / 820 / 1024 / 1280 px, with the `<style>` block and with it stripped: `scrollWidth == clientWidth`, **zero** elements past the right edge, wordmark `nameLines: 1` and `nameOverflow: 0` throughout, all four contact rows exactly one line, both mobile numbers on the same line as their label, columns side by side from a 590px content width, column total **590**, gutter **48**. No build, typecheck, `check:*` or `test:all`. |
