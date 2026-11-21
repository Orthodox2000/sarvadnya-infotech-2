# 2026-11-20 — teal background, name placeholder, new copy above the CTA

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"I said teal background not gray and use placeholder in place of name and update content above renew now button"* — then supplied four new body paragraphs verbatim. |
| **Background** | `#f4f4f4` → **`#E8F0F0`** in both the `<body>` and the outer table's `bgcolor` / `background-color`. The classic Tally structure, white card and `1pt solid #dddddd` border are unchanged. |
| **Merge field** | `Hello Mr. Tejas Pasnani,` → `Hello $contact_first_name$,`. Used the same `$contact_first_name$` field as `diwali-email.html` rather than inventing a new token. |
| **New copy** | The four paragraphs above "Renew Now" are now the owner's exact wording: thank-you for relying on TallyPrime / daily billing, stock and accounting; rental licence expiring today with no mid-day pause; annual subscription gives an extra 10% off for a full year without frequent renewals; automatic future renewals with adjust-or-cancel anytime from My Subscriptions. Existing teal `<strong>` emphasis kept on "Your rental license is expiring today!" and "10% off". |
| **Unchanged** | Eyebrow and H1, `/products` CTA, `/contact` support link, "Team Sarvadnya" sign-off, sender block, five social icons (Facebook unlinked), legal band. No prices — 10% only. |
| **Copy/paste file** | `license-expiry-email-copy-paste.html` not touched — still has `#eef3f3`, the literal name and the previous body copy. Say the word if it should track these changes. |
| **Verified** | Static checks pass (teal, no gray, placeholder, all four paragraphs, old copy gone, structure and safety rules). Standing single-pass directive (§3): no build, dev server, typecheck or check suite run. |
