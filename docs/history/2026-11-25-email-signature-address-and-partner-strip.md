# 2026-11-25 — Email signature: two addresses, smaller partner logos, Services above logos

Back to [docs/HISTORY.md](../HISTORY.md).

## Owner requests

> "in email signature template , add current address as regd. address and new line curr.
> address as shop no.10 B, Kukreja Center, Plot no.13, sector 11, CBD Belapur, Navi Mumbai
> 400614 as 2 address lines,"

> "nextly reduce size of logos and make biz analysit as Tally on Mobile and OTU as HRMS,
> nosky as Data Backup and servicces above logos"

> "and lt footer cover full idth on 1024 on dekstops instead of 600 cutoff"

> "fianlly update all utm outbound links as email_footer or similar and smaller"

> "services update to our services"

## Changes (`email-templates/email-signature.html`)

1. **Two labelled addresses** in the brand column. The existing Vindhya Commercial
   Premises address is now prefixed with a `Regd. Address` label (its Google Maps link
   is kept); a second `Curr. Address` block carries the new office on two lines:
   `Shop No. 10 B, Kukreja Center, Plot No. 13, Sector 11,` / `CBD Belapur, Navi Mumbai 400614`.
   Labels reuse the existing 9px uppercase Contact-label styling; a 10px top padding
   on the Curr. block separates the two addresses.
2. **Partner logo strip reduced** (twice, per owner): tile height 64px → 56px → 44px,
   image height 22px → 18px → 14px, image `max-width` 46px → 38px → 30px. No hosted
   file changed.
3. **Labels renamed** without changing the linked URLs or image files:
   `Biz Analyst` → `Tally on Mobile`, `OTU` → `HRMS`, `NoSky` → `Data Backup`.
   The `public/email-signature/` folder has no replacement artwork, so only the visible
   caption changed.
4. **Order swapped**: the `Services` strip now sits **above** the `Certified Industry
   Partners` logo strip; the file's top layout comment was updated to match.
5. **600px cap removed**: the signature card went from `width="600"` /
   `max-width:600px;width:100%` to `width="100%"` / `width:100%`, so the footer spans
   the full available width at 1024px desktop (and the full mail reading pane in
   clients). Both the HTML attribute and the inline style were changed together so
   Outlook's Word renderer matches browsers. The outer shell's 24px spacer rows and
   12px gutter cells were left untouched, preserving the 2026-11-20 no-overflow fix.
6. **UTM tagging**: all 17 own-domain outbound links now carry only
   `?utm_source=email_footer` (no medium/campaign — the site is source-only, so the
   URL stays short). External social, Google Maps, `tel:` and `mailto:` links are
   deliberately untagged. `lib/utm-sources.ts` gained `email_footer` / `email-footer`
   as aliases of `email` so the source is categorised as Email rather than "Other";
   `docs/utm-links.md` documents the code.
7. **Heading rename**: the Services strip label is now "Our Services".

All edits are inline-table-only, so they survive the "paste first `<table>` to last
`</table>`" workflow described at the top of the template. No new `<style>` block, no
change to the outer shell (the 2026-11-20 scrollbar fix stays intact).
