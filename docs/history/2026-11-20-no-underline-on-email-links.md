# 2026-11-20 — no underline on email links

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"only thing, links have underline, remove decoration with links"*. |
| **Applied** | Added `text-decoration:none;` to **all 9 `<a>` elements** in `email-templates/license-expiry-email.html`: the support-page link (explicitly changed from `text-decoration:underline`), the `mailto:` and website text links, the "Renew Now" CTA, the masthead logo link and the four social icon links. |
| **Why all** | The global `<style>` block that used to carry `a { text-decoration: none; }` was removed with the classic Tally pattern, so Gmail/browser defaults underlined every anchor. Inline `text-decoration:none` on each link is the only reliable fix after copy-paste. |
| **Unchanged** | Teal outer background, classic table structure, `$contact_first_name$` merge field, owner copy, 10% only / no prices, "Team Sarvadnya", Facebook icon still unlinked. |
| **Verified** | All 9 anchors carry `text-decoration:none`, zero `text-decoration:underline` remain. Standing single-pass directive (§3): no build, dev server, typecheck or check suite run. |
