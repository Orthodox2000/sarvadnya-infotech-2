# 2026-11-20 (Gmail spacer rows) — vertical gap must be a real row, not padding

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"Gmail strips padding-top and padding-bottom on the outermost pasted container unless there is an explicit spacer row (`&nbsp;`) inside the outer table. Add a dedicated top spacer row and bottom spacer row."* Supplied the full wrapper with `#eef3f3` background, top/bottom spacer `<tr>`s and a content `<td>` with only left/right padding. |
| **Applied** | `email-templates/license-expiry-email-copy-paste.html` outer table is now `bgcolor="#eef3f3"`, `border-collapse:collapse`, with a **TOP SPACER ROW** and **BOTTOM SPACER ROW**: `<td height="32" style="height:32px;font-size:32px;line-height:32px;mso-line-height-rule:exactly;">&nbsp;</td>`. Main content row `<td>` has only `padding-left/right:16px`. Body background matched to `#eef3f3`. The white card keeps `border-radius:6px`. |
| **Inner cell** | The owner's skeleton showed `padding:0` on the inner content cell; the previous turn explicitly asked for `padding:32px 24px` as *"INNER CONTENT PADDING: space between card edge and text/logo"*. I kept **32px 24px** so the heading/body text does not sit flush against the card border, and flagged the deviation for the owner. |
| **Gap size** | 32px in all four places on each spacer `<td>`; change all four together to 24 or 40 to resize the top/bottom background gap. |
| **Verified** | Standing single-pass directive (§3): no build, dev server, typecheck or check suite run. |
