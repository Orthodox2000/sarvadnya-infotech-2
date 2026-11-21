# 2026-11-20 — classic Tally table pattern restored on `license-expiry-email.html`

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"get tal[l] back"* — use the classic Tally email structure: outer `width="100%"` table with a light-gray background and the gap inside the centering `<td>`; inner `width="600"` card, `align="center"`, `bgcolor="#FFFFFF"`, `1pt #dddddd` border; no `<style>` block needed for layout. They explicitly called out that my `max-width:680px` outer cap and removal of `width="600"` from the inner card caused the earlier side/width problems. |
| **Applied** | `email-templates/license-expiry-email.html` now has: outer `<table width="100%" bgcolor="#f4f4f4" style="background-color:#f4f4f4;">`; middle `<td align="center" valign="top" style="padding:24px 12px;">`; inner `<table width="600" align="center" bgcolor="#FFFFFF" style="max-width:600px;width:100%;border:1pt solid #dddddd;">`. |
| **Removed** | The entire `<style>` block (no layout CSS at all now — table attributes and inline `<td>` padding only), the `max-width:680px; margin:0 auto` outer cap, and both top/bottom `&nbsp;` spacer rows. The 24px top/bottom gap now comes from the non-outermost centering `<td>`, which is why it survives Gmail paste. |
| **Width model** | The `width="600"` attribute is back on the inner table (Gmail's classic anchor), while `width:100%;max-width:600px;` inline still lets browsers shrink it on phones. The outer table intentionally spans the full viewport again. |
| **Why 24px** | The owner described both a 15px top-only gap and the classic `padding-top:24px;padding-bottom:24px;` middle cell; I used the latter as the final "classic pattern" spec and added 12px left/right for 360–414px phones. |
| **Unchanged** | Owner copy, 10% only / no prices, "Team Sarvadnya", unlinked Facebook icon, `/products` CTA, `/contact` support link, full sender block + five socials + legal band. |
| **Verified** | 19 static checks pass on the 165-line file. Standing single-pass directive (§3): no build, dev server, typecheck or check suite run. |
