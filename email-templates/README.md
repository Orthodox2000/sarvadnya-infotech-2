# Email templates

One home for every email template used by Sarvadnya Infotech. Everything here is
**template/rendering code only** — sending, queueing and retrying still live in
`lib/email.ts`, `lib/email-queue.ts` and `lib/email-otp.ts`.

| File | What it is |
| :--- | :--- |
| `email-signature.html` | Standalone copy/paste Gmail/Outlook signature. Not imported by the app — open it in a browser and paste the table into the mail client. Per-sender `[bracketed]` placeholders stay as-is. |
| `license-expiry-email-copy-paste.html` | **Browser copy/paste version** of `license-expiry-email.html` for manual sending: open in a browser, Ctrl+A / Ctrl+C, paste into Gmail/Outlook compose. Uses the owner-supplied grey `#f3f4f6` full-width shell + 600px white card; all styling inline (no `<style>` block) so it survives the paste. **Square corners throughout** — no `border-radius` on the card, inner bands or CTA. Inner cell has 40px top/bottom padding for breathing room. Same copy, 10% only, "Team Sarvadnya", unlinked Facebook icon. |
| `diwali-email.html` | Diwali greeting email added by the owner as `test.html` on 2026-11-20 and renamed to a descriptive name. 480px banner + greeting, `$contact_first_name$` merge field, real social icons. |
| `license-expiry-email.html` | Our branded TallyPrime **rental licence expiring today** reminder (owner-supplied copy, 2026-11-20). 600px desktop / 100% mobile table, **4px corners** and 18px white spacer rows above the masthead and below the legal band, brand masthead + contact, single "Renew Now" CTA to `/products`, sign-off "Team Sarvadnya". **No prices** — only the 10% annual-subscription offer. Merge field: the recipient name in the greeting. |
| `tally-rental-expiry-actual.html` | Copy of the **actual Tally eDM** the owner pasted on 2026-11-20. Wording, order, colours and vtrack links retained; Gmail proxy URLs/attributes stripped, mobile sizing added, and owner corrections applied — no ₹900 in the button alt, sign-off "Team Sarvadnya". Reference copy — our send-ready version is `license-expiry-email.html`. |
| `email-autoreply.mjs` + `.d.mts` | Client "thank you" auto-reply (`buildClientAutoreplyHtml`, `DEFAULT_COMPANY`, `CLIENT_AUTOREPLY_SUBJECT`). |
| `email-brand.mjs` + `.d.mts` | Shared masthead/footer (`renderBrandHeader`, `renderBrandFooter`, `brandLogoSrc`) used by every transactional template. **The only place the email masthead/footer may be defined.** |
| `email-careers.mjs` + `.d.mts` | Careers mail: job application (company + candidate), saved resume (company + candidate), account-created welcome. |

## Conventions (unchanged by the 2026-11-20 move)

- Pure ESM `.mjs`, zero dependencies, inline CSS only (Gmail/Outlook-safe), hand-written
  `.d.mts` siblings so both `next build` and plain `node scripts/*.mjs` can import them.
- The logo is **caller-resolved** — `{ cid }` for live sends, `{ data }` for the offline
  preview, `{ url }` as hosted fallback. Templates never touch the filesystem or network.
- Import from app code as `@/email-templates/<name>.mjs`; from scripts in `scripts/` as
  `../email-templates/<name>.mjs`.

## Hosted images are deliberately NOT moved

`email-signature.html` points at absolute URLs (`/email-signature/...`,
`/TallyCertificate.png`). Those files must stay under `public/` to be served, so they
remain in `public/email-signature/` and `public/`. The `next.config.js` CORP/CORS rules
for those paths are unchanged. Generated previews stay in `public/email/` and are
regenerated with `npm run preview:email`.

## No prices — 10% only

Owner ruling, 2026-11-20: *"do not mention prices just 10% never mention 900rs save etc."*
No template in this folder may contain `₹900`, "save ₹900" or any other price. The only
offer stated is **10% off on an annual subscription**. In `license-expiry-email.html`
the separate "RENEW NOW & SAVE ₹900" line was removed entirely — the "Renew Now" button
above it is the only CTA. The actual Tally eDM button's alt text was changed from
"RENEW NOW & SAVE ₹900" to just "RENEW NOW". Do not reintroduce the price.

## Facebook icon kept, never linked

Owner ruling, 2026-11-20 (corrected the same day): *"add facebook tag in social media,
just dont link facebook."* The Facebook **image tag** is present in `email-signature.html`,
`license-expiry-email.html` and `diwali-email.html`, but its `<td>` contains **no `<a>` and
no href**. Do not "fix" it by putting the old `facebook.com/sarvadnyainfotech` URL back.
The actual Tally eDM never contained Facebook.

Twitter/X is also absent — no profile URL exists in this repo or `.env`.

## Sign-off

All expiry templates sign off as **"Team Sarvadnya"**, never "Team Tally", even though
the original Tally eDM said "Team Tally". It is our email to our customer.

## Scope note

A Diwali **email** template does now exist: `diwali-email.html` (the owner's `test.html`).
The other Diwali-named files (`public/diwali template 2026.png`, `public/diwali.png`,
`public/videos/team-diwali-2026.mp4`) are site artwork/media, not email templates, and
were left where they are.

The nested `sarvadnya-advanced/` admin repo keeps its own drifted copies under its
own `lib/`; they were **not** touched by this move.
