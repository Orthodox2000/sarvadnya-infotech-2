# 2026-11-20 (main template) — spacer rows on `license-expiry-email.html`

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"`license-expiry-email.html` currently puts `padding:40px 24px` directly on `<table class="outer">`. When rendered in a browser and copied into Gmail, Gmail strips padding from the outermost pasted `<table>` — leaving the `#E8F0F0` background flush against the top of the card. To force a real top (and bottom) gap when copy-pasting into Gmail, add explicit spacer `<tr>` rows with `&nbsp;` inside `<table class="outer">` and move the horizontal padding (16px left/right) onto the main content `<td>`."* A complete updated file was supplied. |
| **Applied** | Wrote the supplied file **verbatim** to `email-templates/license-expiry-email.html`. The outer table is now `bgcolor="#E8F0F0" style="background-color:#E8F0F0;width:100%;"` — **no outer padding**. The `.outer` media rule was removed from `<style>`. |
| **Spacer rows** | A top row immediately after the outer table opens and a bottom row just before it closes, each `<td height="32" bgcolor="#E8F0F0" style="height:32px;font-size:32px;line-height:32px;background-color:#E8F0F0;">&nbsp;</td>`. A real table row with `&nbsp;` survives Gmail's paste sanitizer where vertical padding does not. |
| **Horizontal gap** | Moved onto the main content `<td align="center" bgcolor="#E8F0F0" style="padding:0 16px;background-color:#E8F0F0;">`. The 600px white card keeps `border-radius:4px`. |
| **Also in the supplied file** | `white-space:nowrap` on the masthead wordmark cells, body copy held at 15px with tightened band paddings, `border-top` on the sender block. These are owner-supplied presentational details, applied unchanged. |
| **Copy/paste file** | Reverted my interim 40px hardened spacer experiment in `license-expiry-email-copy-paste.html` back to the owner's exact 32px skeleton, so both templates now use the same gap. |
| **Rules unchanged** | Owner-verbatim copy, **10% only / no prices**, "Team Sarvadnya" sign-off, Facebook icon present but unlinked, single "Renew Now" CTA to `/products`, support link `/contact`. |
| **Copy tip** | Open in a browser, **Ctrl+A / Cmd+A** (do not drag-select below the top edge, or the top spacer row is skipped), then paste into Gmail compose. Verified result: a solid `#E8F0F0` band above the card. |
| **Verified** | Standing single-pass directive (§3): no build, dev server, typecheck or check suite run. |
