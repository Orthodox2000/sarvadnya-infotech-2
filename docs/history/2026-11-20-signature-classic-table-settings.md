# 2026-11-20 — classic Tally table settings on `email-signature.html`

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"apply similar table settings and adjustment to email signature file as well"*. Offered three scopes; owner chose **full classic pattern** with the constraint *"do 1 but ensure display looks same as current"*. |
| **Outer table** | Now the classic full-width pattern: `<table width="100%" bgcolor="#E8F0F0">` with `background-color:#E8F0F0`. The old `class="sig-shell"` is gone; its font/line-height/colour moved inline onto the table so they survive a paste from the first `<table>` to the last `</table>` (body styles do not travel). |
| **Centering cell** | `<td align="center" valign="top" style="padding:24px 12px;">` — same as the expiry email; the top/bottom gap lives on this non-outermost cell so Gmail keeps it. |
| **Card** | The signature's inner table is now `<table width="600" align="center" bgcolor="#FFFFFF" style="max-width:600px;width:100%;border:1pt solid #dddddd;">`. |
| **No `<style>` block** | Removed the four rules (`html,body`, `body`, `.sig-shell`, `.sig-shell a`). All 27 anchors already carried inline `text-decoration:none`, so no underlines returned. Body-only rules (margin/padding/overflow/font) are now inline on `<body>` for local viewing. |
| **Tagline** | Dropped the "Tally Certified Partner · Trusted Since 2008" text line under the wordmark, matching the expiry-email masthead removal. The certificate image still carries that label in `alt`. Address block margin nudged 7px → 12px to keep the spacing rhythm. |
| **Display preserved** | The internal hybrid two-column layout (346px brand + 244px contact), `#F7FBFB` strips, font sizes, all four `[bracketed]` sign-off placeholders, social icons (Facebook unlinked) and legal links are unchanged. The visible additions are the teal outer band, the 24px gap and the 1pt card border — the classic-pattern settings the owner asked for. |
| **Verified** | Static checks on comment-stripped markup: no `<style>`, no `sig-shell`, 27/27 links `text-decoration:none`, no underlines, classic outer/centering/card markup, tagline gone, two-column internals and strip colours intact. Standing single-pass directive (§3): no build, dev server, typecheck or check suite run. |
