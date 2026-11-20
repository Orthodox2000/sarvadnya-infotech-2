# 2026-11-05 (10th pass) — Signature: sign-off contact is plain text, not tel:/mailto: links

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Area | Detail |
| :--- | :--- |
| **Brief** | Owner: *"below best regards don't make user credentials link, keep it normal text"*. |
| **Change** | In the sign-off block the mobile and email are now plain `<span>`-free text inside the styled `<div>` — the two `<a href="tel:…">` / `<a href="mailto:…">` wrappers are gone, so nothing is clickable or underlined there. Styling is preserved by moving `font-weight:600;color:#033B38` to the container and keeping the `&middot;` separator at weight 400. |
| **Unchanged** | The **Contact** column still has its `tel:` / `mailto:` links — the brief was scoped to the block below "Best regards". |
| **Docs** | Header SIGN-OFF note and the comment above the block now say the four placeholders are plain text and must not be re-linked. |
| **Measured** | Probe at 280 / 320 / 360 / 820 / 1024 px: `scrollWidth == clientWidth`, zero overflowing elements, `0` anchors inside the sign-off. The contact line is one line from 360px and wraps to two at 280–320 (no overflow). No build, typecheck, `check:*` or `test:all`. |
