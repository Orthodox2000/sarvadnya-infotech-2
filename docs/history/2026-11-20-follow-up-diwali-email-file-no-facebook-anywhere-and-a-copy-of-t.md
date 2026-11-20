# 2026-11-20 (follow-up) — Diwali email file, no Facebook anywhere, and a copy of the real Tally eDM

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"i hav added test.html in email template folder whihc is diwali template, the facebook link is wrong so do not use facebook, keep it mpty, and this is actual [email] we want to make copy"* — followed by the full Gmail-sourced Tally rental-renewal HTML. |
| **Diwali** | `email-templates/test.html` renamed to **`email-templates/diwali-email.html`** (descriptive name). It is a genuine Diwali email: 480px banner from `/diwali.png`, `$contact_first_name$` merge field, real social icons. The earlier statement that no Diwali *email* template existed is now superseded — the site artwork files are still artwork, but this email is a template. |
| **Facebook = empty** | Owner ruled the Facebook link wrong. The Facebook `<td>` is now deliberately empty (no href, no image) in `email-signature.html`, `license-expiry-email.html` and `diwali-email.html`. `email-templates/README.md` records the ruling so it is not "fixed" back. The real Tally eDM never contained Facebook. Twitter/X remains absent (no URL exists). |
| **Actual Tally eDM copy** | New **`email-templates/tally-rental-expiry-actual.html`** — a faithful copy of the pasted HTML: same wording, order, colours and Tally `vtrack` links (kept verbatim, `&amp;` intact). Only three cleanups: Gmail `googleusercontent.com/meips/...` proxy image URLs replaced with the real `mirror1.tallysolutions.com` URLs carried after the `#` in each src; Gmail-only `data-saferedirecturl` / `class="CToWUd"` / `data-bit` attributes removed; `max-width:100%` + a ≤620px media query added so the 600px banner fits a phone. No Facebook added. This is the reference copy; `license-expiry-email.html` remains our branded send-ready version. |
| **Verified** | Standing single-pass directive (§3): no build, dev server, typecheck or check suite run. |
