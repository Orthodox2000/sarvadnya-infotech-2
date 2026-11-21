# 2026-11-20 — Shared email header/footer brought in line with the current brand; every template trigger on current routes

Back to [docs/HISTORY.md](../HISTORY.md).

## Owner request

> "now u have footer example and header from previous version of email. we do not mention
> any name in footer template but use that to create rest of templates consistent with
> current branding and ensure website template triffers are updated to new routes and all"

Clarified on the same turn:

- **Template scope** — the *shared `.mjs` templates* only (`email-brand.mjs`, inherited by
  auto-reply, careers and internal form copy). Standalone HTML files stay as-is.
- **Triggers/routes** — "all templates and emails trigger properly and doesn't depend on
  old placement and routes."

## What changed

### `email-templates/email-brand.mjs`
- `renderBrandHeader()` — removed the `Tally Certified Partner · Trusted Since 2008`
  tagline so the masthead is logo + wordmark, matching `license-expiry-email.html` and
  `email-signature.html`. The logo is now wrapped in a link to `company.website` (root),
  with `text-decoration:none` inline.
- `renderBrandFooter()` — legal link set copied from the signature footer example:
  Privacy Policy, Terms &amp; Conditions, EULA, Careers, Contact. Every href is
  `${company.website}<path>` (fallback `https://sarvadnyainfotech.com`), so no template
  depends on an old placement or a retired route. No individual's name is ever rendered;
  the only name is the company in `© 2026 <company>. All rights reserved.`, exactly as in
  the signature footer example. "no name in footer" was interpreted as no *person's*
  name — the footer example itself carries the company name.

### `email-templates/email-autoreply.mjs`, `email-templates/email-careers.mjs`
- Replaced the dynamic `The ${esc(comp.name)} Team` sign-off with the fixed
  **Team Sarvadnya**, matching the expiry template and the standing brand rule. The old
  partner-branded sign-off is never rendered.

### `lib/email-otp.ts`
- Dropped the tagline paragraph from the inline OTP header; the wordmark-only masthead is
  now consistent with every other email. OTP mail deliberately keeps its own minimal
  template — it must not be routed through the shared/global-CC path.

### Documentation
- `email-templates/README.md`: shared masthead/footer row, new "One header/footer, current
  routes only" section, sign-off section now covers transactional templates.
- Daily log §21 and tracker row 147.

## Verification (static only)

Rendered the header, footer, client auto-reply and all five careers templates through
Node and asserted:

- logo links to site root; no tagline rendered anywhere; no old partner sign-off;
  "Team Sarvadnya" present; no individual name in footer/sign-off;
- all five legal routes present in footer and every footer link carries inline
  `text-decoration:none`; no rupee/price strings;
- expiry template: exactly one `Renew Now` CTA button → `/products`, greeting merge field
  `$contact_first_name$`, support link → `/contact`, no embedded style block;
- signature: no embedded style tag, white/left/borderless, Facebook unlinked, no Twitter/X;
- every footer route exists under `app/(site)/`;
- no trigger imports from the old `lib/email-*.mjs` placement — all resolve inside
  `email-templates/`.

All checks passed. Per the standing single-pass directive (AGENTS.md §3), **no build, dev
server, typecheck or check suite was run**.
