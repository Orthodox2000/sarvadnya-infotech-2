# 2026-11-20 (final wrapper) — owner supplies the exact gap-control shell

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner pasted the final wrapper HTML: outer table `padding:0`, `<td>` with `padding: 32px 16px` labelled *"GAP CONTROLS: padding: [top/bottom] [left/right]"*, inner white card `border-radius:6px`, inner content cell `padding: 32px 24px` labelled *"INNER CONTENT PADDING"*. |
| **Applied** | `email-templates/license-expiry-email-copy-paste.html` now uses that structure **verbatim** — gap on the `<td>`, not on the outer table or inside the content cell. Nested masthead / sender / legal / CTA blocks remain flat. This supersedes both earlier square-corner and 40px-outer-padding variants. The header comment was rewritten so it no longer claims square corners. |
| **Verified** | Standing single-pass directive (§3): no build, dev server, typecheck or check suite run. |
