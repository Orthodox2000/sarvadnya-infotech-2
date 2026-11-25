# Email templates

One home for every email template used by Sarvadnya Infotech. Everything here is
**template/rendering code only** — sending, queueing and retrying still live in
`lib/email.ts`, `lib/email-queue.ts` and `lib/email-otp.ts`.

| File | What it is |
| :--- | :--- |
| `email-signature.html` | Standalone copy/paste Gmail/Outlook signature. Not imported by the app — open it in a browser and paste the table into the mail client. Per-sender `[bracketed]` placeholders stay as-is. Same **classic Tally table settings** as the expiry email (2026-11-20) but **white background and left aligned** (owner correction): full-width `#FFFFFF` outer table with **real 24px spacer rows and 12px gutter cells** (2026-11-20 scrollbar fix — never put padding on the 100%-width cell), and a borderless white `width="100%" align="left"` / `width:100%` card (**2026-11-25:** the 600px cap was dropped so the footer fills the desktop width instead of cutting off at 600px). No `<style>` block and no `overflow-x:hidden` on `<body>`; all 27 links carry inline `text-decoration:none`. Internal two-column layout, strips, icons and placeholders unchanged; the "Tally Certified Partner · Trusted Since 2008" text line was dropped (certificate image keeps it in `alt`). **2026-11-25:** heading is "Our Services", and all 17 site links carry the short `?utm_source=email_footer` tag (external social/Maps/tel/mailto links left untagged). |
| `license-expiry-email-copy-paste.html` | **Browser copy/paste version** of `license-expiry-email.html` for manual sending: open in a browser, Ctrl+A / Ctrl+C, paste into Gmail/Outlook compose. Uses the owner's **Gmail-safe** `#eef3f3` shell: outer table `border-collapse:collapse` with explicit **top and bottom spacer rows** (`height="32"`, `height/line-height:32px`, `&nbsp;`) — Gmail drops vertical padding on pasted wrappers, so real spacer rows force the gap. The content `<td>` keeps only `padding-left/right:16px`; the 600px white card keeps `border-radius:6px` and its content cell keeps `padding:32px 24px`. All styling inline (no `<style>` block) so it survives the paste; nested masthead/sender/legal/CTA bands stay flat. Same copy, 10% only, "Team Sarvadnya", unlinked Facebook icon. |
| `diwali-email.html` | Diwali greeting email added by the owner as `test.html` on 2026-11-20 and renamed to a descriptive name. 480px banner + greeting, `$contact_first_name$` merge field, real social icons. |
| `license-expiry-email.html` | Our branded TallyPrime **rental licence expiring today** reminder (owner-supplied copy, 2026-11-20). **classic Tally table pattern, no `<style>` block**: full-width teal `#E8F0F0` outer table, a `<td align="center" valign="top" style="padding:24px 12px;">` supplying the top/bottom gap, and a centred white card with `width="600"` + `style="max-width:600px;width:100%;"` and a `1pt solid #dddddd` border. No `nowrap`; every `<a>` carries inline `text-decoration:none` because the global `<style>` block was removed and Gmail would otherwise underline links. Brand masthead + contact, single "Renew Now" CTA to `/products`, sign-off "Team Sarvadnya". **No prices** — only the 10% annual-subscription offer. Merge field: `$contact_first_name$` in the greeting (same token as `diwali-email.html`); the four body paragraphs are the owner's supplied expiry copy. |
| `tally-rental-expiry-actual.html` | Copy of the **actual Tally eDM** the owner pasted on 2026-11-20. Wording, order, colours and vtrack links retained; Gmail proxy URLs/attributes stripped, mobile sizing added, and owner corrections applied — no ₹900 in the button alt, sign-off "Team Sarvadnya". Reference copy — our send-ready version is `license-expiry-email.html`. |
| `email-autoreply.mjs` + `.d.mts` | Lead acknowledgement receipt (`buildClientAutoreplyHtml`, `DEFAULT_COMPANY`, `CLIENT_AUTOREPLY_SUBJECT`). **2026-11-21:** echoes the lead's Name, Email, Contact, Product, Date and Message; left-aligned classic table structure; signed and footed by the **Sarvadnya Web Team**. |
| `email-brand.mjs` + `.d.mts` | Shared masthead/footer (`renderBrandHeader`, `renderBrandFooter`, `brandLogoSrc`) used by every transactional template. **The only place the email masthead/footer may be defined.** Since 2026-11-20 the masthead is the logo (linked to `company.website` root) + wordmark only — the "Tally Certified Partner · Trusted Since 2008" tagline was dropped to match the expiry email and signature. The footer carries the automated-note, `© 2026 <company>. All rights reserved.` and the signature's legal link set — Privacy Policy, Terms &amp; Conditions, EULA, Careers, Contact — all built from `company.website`, so no template depends on an old placement or retired route. It never names an individual. **2026-11-21:** both renderers accept `align:'left'` (default `'center'`), used by the acknowledgement receipt to match the left-aligned signature structure. |
| `email-careers.mjs` + `.d.mts` | Careers mail: job application (company + candidate), saved resume (company + candidate), account-created welcome. |

## Conventions (unchanged by the 2026-11-20 move)

- Pure ESM `.mjs`, zero dependencies, inline CSS only (Gmail/Outlook-safe), hand-written
  `.d.mts` siblings so both `next build` and plain `node scripts/*.mjs` can import them.
- The logo is **caller-resolved** — `{ url }` for the hosted company mark used by the
  acknowledgement, `{ cid }` for the inline certificate banner in the other transactional
  templates, `{ data }` for the offline preview. Templates never touch the filesystem or
  network. CHANGE: 2026-11-23 — the thank-you/receipt now uses `/logo.png` at 64×64,
  not the Tally certificate banner at 240×51, and carries **no global CC**.
- Import from app code as `@/email-templates/<name>.mjs`; from scripts in `scripts/` as
  `../email-templates/<name>.mjs`.

## Hosted images are deliberately NOT moved

`email-signature.html` points at absolute URLs (`/email-signature/...`,
`/TallyCertificate.png`); the acknowledgement points at `/logo.png`. Those files must stay
under `public/` to be served, so they remain in `public/email-signature/` and `public/`.
The `next.config.js` CORP/CORS rules cover those paths, including `/logo.png` since
2026-11-23. Generated previews stay in `public/email/` and are regenerated with
`npm run preview:email` (set `PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome` on this box).

## No prices — 10% only

Owner ruling, 2026-11-20: *"do not mention prices just 10% never mention 900rs save etc."*
No template in this folder may contain `₹900`, "save ₹900" or any other price. The only
offer stated is **10% off on an annual subscription**. In `license-expiry-email.html`
the separate "RENEW NOW & SAVE ₹900" line was removed entirely — the "Renew Now" button
above it is the only CTA. The actual Tally eDM button's alt text was changed from
"RENEW NOW & SAVE ₹900" to just "RENEW NOW". Do not reintroduce the price.

## No horizontal scrollbar in the received email

Owner, 2026-11-20: *"email signature i still get scroll bar for some reason"* — seen as a
**horizontal bar at the bottom of the received mail**.

- Cause: the full-width outer table's cell carried `padding:24px 12px`. Outlook's Word
  renderer adds a cell's padding to a `width="100%"` table, so the received message was
  `100% + 24px` wide and the client drew a permanent horizontal scrollbar. Mail clients
  also strip `<body>` styles, so the old `overflow-x:hidden` never helped pasted mail.
- Fix: the 24px top/bottom gaps are **real spacer rows**
  (`<td height="24" style="height:24px;line-height:24px;font-size:0;">&nbsp;</td>`) and the
  12px side gutters are dedicated `width="12"` cells around a nested 100%-width table.
  No percentage-width cell has padding any more.
- `overflow-x:hidden` was removed from `<body>` too: on `<body>` alone CSS forces
  `overflow-y` to compute to `auto`, making the body a scroll container. Measured in Chrome
  at 280–1440 px: zero overflowing elements, card still at left 12px / top 24px and now
  fluid to the available width on desktop (600px cap removed 2026-11-25), 27 links and
  10 images intact.
- Do not "tidy" the spacer rows/gutter cells back into cell padding — that restores the
  scrollbar. The same rule applies to any other full-width email wrapper.

## Facebook icon kept, never linked

Owner ruling, 2026-11-20 (corrected the same day): *"add facebook tag in social media,
just dont link facebook."* The Facebook **image tag** is present in `email-signature.html`,
`license-expiry-email.html` and `diwali-email.html`, but its `<td>` contains **no `<a>` and
no href**. Do not "fix" it by putting the old `facebook.com/sarvadnyainfotech` URL back.
The actual Tally eDM never contained Facebook.

Twitter/X is also absent — no profile URL exists in this repo or `.env`.

## Sign-off

The expiry and careers templates sign off as **"Team Sarvadnya"**, never "Team Tally",
even though the original Tally eDM said "Team Tally". It is our email to our customer.
Transactional templates used to render `The <company> Team`; that dynamic sign-off was
replaced with the fixed "Team Sarvadnya" on 2026-11-20.

**2026-11-21 (owner):** the lead acknowledgement (`email-autoreply.mjs`) now signs off
and footers as **"Sarvadnya Web Team"** — still our firm's team, never an individual,
never a partner brand. Its `from` display name is also "Sarvadnya Web Team" and replies
go to `info@sarvadnyainfotech.com`. This is the one template with the Web Team sign-off.

## Lead acknowledgement — left-aligned, enabled, fires for every enquiry

Owner, 2026-11-21: *"send a thankyou email to people who submit their contact and query
... reply to info@sarvadnyainfotech.com and sender will be sarvadnya web team ... ensure
to use latest template structure with left aligned and proper footer from web team, also
lead who submit query also trigger email not just admin panel show"* — clarified as an
**acknowledgement receipt** showing the submitted **name, email, contact, message, date
and product**.

- The receipt uses the same left-aligned classic table shell as `email-signature.html`:
  white background, 24px spacer rows + 12px gutter cells (no padding on a 100%-width
  cell — see the scrollbar rule above), `width="600" align="left"` card, inline CSS only.
- `renderBrandHeader`/`renderBrandFooter` are called with `align:'left'`; other templates
  keep the centred default.
- The acknowledgement is **ON by default** (`AUTO_REPLY_ENABLED` defaults to `1`) and
  is **not** suppressed when a page has no internal recipient — previously such a
  submission only appeared in the admin panel. The internal copy stays opt-in; the
  acknowledgement rides the same exactly-once `jobKey` claim.
- Sender display name comes from `AUTO_REPLY_FROM_NAME` (default "Sarvadnya Web Team");
  reply-to is pinned to `info@sarvadnyainfotech.com`.

## One header/footer, current routes only

Owner, 2026-11-20: *"use the footer example and header from the previous version of email
to create rest of templates consistent with current branding and ensure website template
triggers are updated to new routes."*

- The shared `email-brand.mjs` header/footer is now the single source for the auto-reply,
  internal form copy and all careers mails; tagline removed, no individual's name in the
  footer, legal links mirroring `email-signature.html`.
- Logo and every footer link are resolved from `company.website` (falling back to
  `https://sarvadnyainfotech.com`) rather than a hard-coded path.
- All template imports resolve inside `email-templates/` — no trigger still imports from
  the old `lib/email-*.mjs` placement. Verified current routes: `/privacy`, `/terms`,
  `/eula`, `/careers`, `/contact`, `/products`, `/services`, `/hrms`,
  `/cloud/tallycloudaccess`, `/services/tss`, `/services/amc`, `/services/tdl`.
- OTP mail (`lib/email-otp.ts`) keeps its own minimal inline template: it must not go
  through the shared/global-CC path. Its wordmark-only header follows the same no-tagline
  rule.

## Scope note

A Diwali **email** template does now exist: `diwali-email.html` (the owner's `test.html`).
The other Diwali-named files (`public/diwali template 2026.png`, `public/diwali.png`,
`public/videos/team-diwali-2026.mp4`) are site artwork/media, not email templates, and
were left where they are.

The nested `sarvadnya-advanced/` admin repo keeps its own drifted copies under its
own `lib/`; they were **not** touched by this move.
