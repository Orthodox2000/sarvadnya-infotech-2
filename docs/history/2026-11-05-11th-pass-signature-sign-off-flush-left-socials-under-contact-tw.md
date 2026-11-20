# 2026-11-05 (11th pass) — Signature: sign-off flush left, socials under Contact, two columns rebuilt as a table (fixes the sent-email stacking + overflow)

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Area | Detail |
| :--- | :--- |
| **Briefs** | Owner: *"and margin strict left, no padding or margin left"* · *"also social media icon below contact section"* · *"and even on wider screen, contact section moves to next line"* · *"also Tally Certified Partner / Sarvadnya Infotech LLP / trust line / address section still left indented and some margin"* · *"in sent email"*. |
| **Root cause** | The two columns were `div.sig-col` with a `<style>` media query. Pasting a signature into Gmail keeps only the table markup — our own paste instructions start at the first `<table>` — so the stylesheet, and with it `display:inline-block;width:50%`, is gone. What survives is the inline `display:block;width:100%`, i.e. the Contact column wraps below Brand at **every** width. A block also adds its 32px padding on top of `width:100%` wherever a client strips `box-sizing`, which is the horizontal overflow line seen on desktop. Both symptoms were one defect. |
| **Fix** | The row is now a real `<table>` with two `<td class="sig-col" width="50%">` cells — the 50/50 split, the divider (`border-left:1px solid #D9E8E8`) and the cell padding are HTML attributes / inline styles, so the columns stay side by side in a client with no stylesheet at all. The media query now only *stacks* them (`display:block;width:100%`) below 820px. |
| **Sign-off** | Already plain text; its `<td>` keeps `padding:18px 16px 14px 0` and no `sig-cell` class. With the columns no longer able to push it, the block is flush left at x=0 at every width. |
| **Flush left** | The whole signature is now flush left, not just the sign-off: brand column `padding:18px 16px 18px 0`, partner strip / services / legal rows `… 16px … 0`, and the stacked (≤819px) contact cell and `.sig-cell` rows drop their left inset too. The desktop Contact cell keeps 16px so its text does not touch the divider. |
| **Social icons** | Moved out of the brand column into the Contact column, after the Web row (`margin-top:10px`), so they read as the tail of Contact: WhatsApp, LinkedIn, Instagram, Facebook, YouTube, 20×20, 10px gutters. Brand column now ends at the address. |
| **Docs** | Header/markup comments record why the row is a table and why the sign-off has no `sig-cell`. |
| **Measured** | Puppeteer, with and without the `<style>` block, at 280 / 320 / 360 / 390 / 480 / 600 / 700 / 820 / 1024 / 1280 px. With styles: stacked ≤700, side by side ≥820, name one line throughout, `scrollWidth == clientWidth`, **zero** elements past the right edge, left edge of certificate / trust line / address / sign-off / partner strip / services / legal = **0**. Without styles (the sent-email case): side by side at **every** width, no overflow from 320px up, name wraps to 2–3 lines below 600px rather than overflowing. No build, typecheck, `check:*` or `test:all`. |
