# 2026-11-20 (browser copy/paste variant) — licence-expiry email for manual sending

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner supplied a grey `#f3f4f6` full-width outer table with a centred 600px white card (`1px solid #e5e7eb`, `border-radius:6px`) and asked to *"create similar copy and paste version of template for browser sending"* with the existing header/heading/body pasted in. |
| **New file** | **`email-templates/license-expiry-email-copy-paste.html`** — uses the owner's outer shell verbatim and pastes in all of `license-expiry-email.html`'s content: brand masthead, heading, five body paragraphs, "Renew Now" CTA, help/sign-off, contact block + social icons, legal band. |
| **Copy/paste safe** | Every style is **inline** — no `<style>` block and no CSS classes — so a browser Select-All → Copy → paste into Gmail/Outlook keeps the design. Images stay absolute hosted URLs (data URIs are stripped by Gmail). Recipient name in the greeting is the merge field. |
| **Rules honoured** | Owner-verbatim copy; **10% only, no prices**; sign-off **"Team Sarvadnya"**; "Renew Now" to `/products` is the only CTA; Facebook icon present with **no href**. |
| **Square corners** | Follow-up: *"no curvy ends of email main container"*. Removed `border-radius` from the main white card **and** the nested masthead, sender, legal and CTA blocks — zero rounded corners anywhere in this copy/paste file. |
| **Verified** | Standing single-pass directive (§3): no build, dev server, typecheck or check suite run. |
