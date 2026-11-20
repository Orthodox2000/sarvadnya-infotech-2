# 2026-11-20 (template corrections) — no prices, Team Sarvadnya, Facebook unlinked

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"some correction in template, do not mention prices just 10% never mention 900rs save etc, and team sarvadnya not tally at bottom and RENEW NOW & SAVE ₹900 line is unnecessary as renew button already above and add facebook tag in social media, just dont link facebook."* |
| **No prices** | `license-expiry-email.html`: the separate "RENEW NOW & SAVE ₹900" link line below the CTA was deleted — the "Renew Now" button is now the only CTA. `tally-rental-expiry-actual.html`: the renew-button image alt changed from "RENEW NOW & SAVE ₹900" to just "RENEW NOW". The only remaining offer wording anywhere is **10% off on an annual subscription**, which is a percentage, not a price. |
| **Sign-off** | Both expiry templates now end "Warm regards, **Team Sarvadnya**" instead of "Team Tally" — it is our email to our customer. The actual-eDM reference file header records this as an explicit deviation from the source. |
| **Facebook** | Previous ruling refined: the owner wants the **icon tag present but unlinked**. Restored the 20px `facebook.png` image (signature + branded expiry) and the 18px flaticon image (Diwali) inside the Facebook `<td>`, with **no `<a>` / no href** in all three files. Still no Twitter/X (no URL exists). |
| **Docs** | `email-templates/README.md` gained "No prices — 10% only", "Facebook icon kept, never linked" and "Sign-off" sections; file table updated with the new constraints. |
| **Verified** | Standing single-pass directive (§3): no build, dev server, typecheck or check suite run. |
