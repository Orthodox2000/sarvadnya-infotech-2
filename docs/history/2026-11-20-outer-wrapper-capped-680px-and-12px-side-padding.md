# 2026-11-20 (outer wrapper) — cap at 680px, 12px side padding

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"In `license-expiry-email_2.html` (your previous version), the inner card was fixed at `width=\"600\"`, which prevented the table from blowing up to 1200px — it only scrolled on screens narrower than 600px. To fix both issues (no 1200px desktop width copied onto the outer wrapper, and no horizontal scrolling on phones): remove `width=\"100%\"` from the outer table and cap it with `style=\"max-width:680px; width:100%; margin:0 auto;\"`... use `style=\"width:100%; max-width:600px;\"` WITHOUT `width=\"600\"` on the inner card, and keep the outer side padding small (`padding:0 12px;`)."* Follow-up: *"just run on old file"* → applied to `email-templates/license-expiry-email.html`. |
| **Outer table** | Removed the `width="100%"` attribute; style is now `background-color:#E8F0F0;max-width:680px; width:100%; margin:0 auto;`. Chrome now copies at most a 680px wrapper instead of the full 1200px+ desktop viewport. |
| **Inner card** | Kept fluid: `style="width:100%; max-width:600px;..."` with **no** `width="600"` attribute (the earlier session had already removed it). It scales down to 360–414px phones without scrolling and caps at 600px on wide screens. |
| **Side padding** | Main content `<td>` changed from `padding:0 16px` to `padding:0 12px` so the 600px card fits cleanly inside a 360px phone. |
| **Unchanged** | Top/bottom spacer rows, 4px corners, `white-space:nowrap` removal, owner copy, 10% only / no prices, "Team Sarvadnya", unlinked Facebook icon, `/products` CTA, `/contact` support link. |
| **Verified** | Static checks only; standing single-pass directive (§3) — no build, dev server, typecheck or check suite run. |
