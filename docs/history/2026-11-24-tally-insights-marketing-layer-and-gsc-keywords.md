# 2026-11-24 — Tally Insights: marketing layer + GSC-driven keywords

## Why

The owner: "all insight are just content and not marketing ... for excel import focus on
negative of direct tally import and how our module is good, rest all just tell why our product
is better and why our services and contacting us is better than google searching, also improve
SEO, keywords and tags" using the 2026-11-24 GSC workbook as reference.

## Grounding

No invented product facts. The Excel copy describes limits of Tally's own import screen (column
mapping, rejected-row log, Excel date/number formatting, duplicate masters) and points at the
**Data Integration** service that already exists on `/services` — features "Excel bulk
migration", "Error validation logic", "Automated data scheduling" and secure API bridges. A
dedicated "Excel to Tally Import" module does **not** ship (entry is commented out in
`lib/modules.ts` and `scripts/seed_modules.mjs`), so no module was claimed to exist. The
generic "why us" copy reuses claims already published site-wide: Tally Certified Partner since
2008, 1500+ businesses, CBD Belapur / Navi Mumbai, TallyPrime / cloud / TSS / TDL / training.

## Changes

- `lib/learn-tally-curriculum.ts` (Excel lesson) — added "Where a direct Excel import goes wrong"
  and "How our integration team handles it" sections before the XML API section; rewrote the
  lesson's `modulePromo` to "Stop Fighting Excel Imports"; expanded `seoDescription` and
  keywords with `excel to tally import`, `import excel to tally prime`, `excel import in tally`,
  `tally excel import`.
- `app/(site)/tally-insights/[section]/[lesson]/page.tsx` — the curated `modulePromo` field had
  existed since 2026-10 but was never rendered; it now renders as a text-only card (badge,
  title, body, one link). The generic CTA became an explicit "Why not just search this on Google?"
  comparison with two links (`/contact`, `/services`). No images, no forms, no new element-swap
  logic — hydration-safe.
- `app/(site)/tally-insights/[section]/page.tsx` — one grounded "Got the steps. Need it working
  in your Tally?" strip per section with the same two links.
- `app/globals.css` — new text-only `.docs-promo`, `.docs-section-help`, `.docs-cta-actions`,
  `.docs-cta-link-secondary` styles in the teal brand scale, `flex-wrap` and `min-width: 0` so
  they stay safe at 360px and do not reintroduce the overlap.
- GSC keyword additions drawn from the workbook's high-impression / low-click queries:
  shortcut variants (`tally prime short cut keys`, `shortcut keys of tally prime`,
  `tally prime shortcut keys list`), voucher variants (`types of voucher`, `types of vouchers`,
  `voucher types`, `how many types of vouchers in tally`, `types of accounting voucher`), TSS
  variants (`tss verify`, `verify tss`, `tss checker`, `tss full form`, `tallycloud access`),
  and `ledger master in tally prime`. Section and lesson-level `seoDescription` values now lead
  with the searcher's own phrasing.

## Notes

- The Excel lesson bodyMd is a single long double-quoted line (ASCII-only convention); edits
  stayed inside that line with `\n\n` paragraph breaks.
- Dev server was restarted by PID-safe path (`./node_modules/.bin/next dev --turbopack -p 3000`)
  after the earlier restart attempt failed with 127 (bare `next` was not on PATH). One HTTP
  200 probe of the integration lesson confirmed the new copy and classes render. No build,
  typecheck, `check:*` suite or full browser hydration probe was run (standing single-pass §3).
- Not committed or pushed. Nested admin fork untouched.
