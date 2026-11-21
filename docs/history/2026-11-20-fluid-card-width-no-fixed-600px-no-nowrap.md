# 2026-11-20 (fluid card) — no fixed 600px, no `white-space:nowrap`

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"The inner card table currently has a fixed `width=\"600\"` attribute and `style=\"width:600px;max-width:600px;\"`. Because it is locked to 600px — and Gmail strips `<style>` `@media` rules when you copy-paste — narrow screens or split panes have to scroll horizontally. Change `width=\"600\"` to `width=\"100%\"` and use `width:100%;max-width:600px;`. Remove `white-space:nowrap;` from the masthead text."* |
| **Applied** | `email-templates/license-expiry-email.html`: `<table role="presentation" class="wrap">` now has `width="100%"` and `style="width:100%;max-width:600px;..."`. The card shrinks to fit narrow screens and caps at 600px on wide ones. |
| **Masthead** | Removed `white-space:nowrap;` from **both** places — the wordmark `<td>` and the *"Tally Certified Partner · Trusted Since 2008"* tagline `<div>` — so the text can wrap instead of forcing the table wider. |
| **Why inline** | Gmail strips `<style>` blocks on paste: responsive `@media` font-size overrides only apply when sent raw (API/HTML sender), but `width:100%;max-width:600px;` is inline and works in both paths. The `.wrap { width:100% !important; }` media rule was left in place for the raw-send path. |
| **Copy/paste file** | Already fluid (`width="100%"` + `max-width:600px`) with no `nowrap` — no change needed. Both templates now behave the same. |
| **Rules unchanged** | Owner copy, 10% only / no prices, "Team Sarvadnya", unlinked Facebook icon, `/products` CTA, `/contact` support link, spacer-row gap. |
| **Verified** | Static checks only; standing single-pass directive (§3) — no build, dev server, typecheck or check suite run. |
