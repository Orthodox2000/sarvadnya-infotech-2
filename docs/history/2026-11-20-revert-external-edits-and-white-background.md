# 2026-11-20 — revert external edits to `license-expiry-email.html`; white background

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"I made changes from outside, revert to your version"* followed by *"and make background white from teal"*. |
| **External damage found** | The file had been truncated at the sender-block `<p>` (130 lines) — the five social icons, legal band, bottom spacer row and all closing tags were gone. It had also reintroduced `width="100%"` on the outer table, dropped the `max-width:680px; margin:0 auto;` cap, added `margin:0 auto` to the inner card, changed the masthead `line-height` to 1.15 and replaced the `&nbsp;` entities with a literal non-breaking space. |
| **Restored** | Rewrote `email-templates/license-expiry-email.html` in full to my last version: no `width="100%"` attribute on the outer table plus `max-width:680px; width:100%; margin:0 auto;` cap; fluid inner card `width:100%; max-width:600px;` with no `width="600"`; `padding:0 12px` side gap; masthead `line-height:1.1` with no `nowrap`; top/bottom `&nbsp;` spacer rows; full sender block, five social icons (Facebook unlinked), legal band and closing tags. |
| **New background** | All `#E8F0F0` (body, outer table, both spacer rows, main content `<td>`) changed to **`#ffffff`**. The white card keeps its 4px radius and `box-shadow` so its edges stay visible on the white page; the spacer rows still reserve the vertical gap even though the band is now the same colour. |
| **Unchanged** | Owner copy, 10% only / no prices, "Team Sarvadnya", unlinked Facebook icon, `/products` CTA, `/contact` support link. |
| **Note** | `license-expiry-email-copy-paste.html` was NOT touched — it still uses its `#eef3f3` background. Tell me if it should become white too. |
| **Verified** | 17 static checks pass (full 188-line structure, 5 icons, 2 spacer rows, colours, copy rules). Standing single-pass directive (§3): no build, dev server, typecheck or check suite run. |
