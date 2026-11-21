# 2026-11-20 — signature card border removed

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"no border"*. |
| **Applied** | Removed `border:1pt solid #dddddd;` from the signature's inner card table style in `email-templates/email-signature.html`. The card is still `width="600" align="left"` with `max-width:600px;width:100%` and a white background — only the visible 1pt outline is gone. |
| **Kept** | White background, left alignment, 24px/12px cell padding, no `<style>` block, inline no-underline links (27 anchors), tagline removed, internal two-column layout, `#F7FBFB` strips, placeholders and icons. The partner tiles keep their own `1px solid #D9E8E8` borders — those are separate 64px logo tiles, not the card. |
| **Verified** | No `1pt` / `#dddddd` border remains; card markup, white background, left alignment, links and structure intact. Standing single-pass directive (§3): no build, dev server, typecheck or check suite run. |
