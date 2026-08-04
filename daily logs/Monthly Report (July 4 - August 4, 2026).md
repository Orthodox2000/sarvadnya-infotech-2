# Monthly Report (July 4 — August 4, 2026)

**Period:** 14 working days — Jul 4, 7, 9, 13, 15, 20, 21, 27, 28, 29, 31, Aug 1, 3, 4
**Version:** v1.1.389 → v1.1.4xx

---

## Progress Snapshot

| Metric | Value |
|--------|-------|
| Working days | 14 |
| Files touched | 90+ |
| New pages / routes | 6 (`/do-more`, `/cloud/tallycloudaccess`, `/admin/tss-renewals`, `/learn-sara`, `/cloud/backup-for-tally` rename, chunk upload API routes) |
| Build status | TypeScript clean, `next build` 101/101 static pages |
| Key releases | Tally Cloud Access page · TSS Renewal system · Chunked uploads · Direct-send email · Contact redesign |

---

## Key Updates (by day)

| Date | Focus | Highlights |
|------|-------|-----------|
| Jul 4 | Nav + green theme + security | Navbar squarish buttons, Smart Solutions icon, SearchBar width/submit, Productbar wheel-handler fix, services/contact green conversion, typing speed, prompt-injection protection |
| Jul 7 | HomeHero overhaul | bg.png background, QuickAccess cards in hero, refined palette, 13 route-group import-path fixes (build-blocking) |
| Jul 9 | Visual overhaul | Hero carousel disabled + height cut, navbar/productbar gradients, Cloud + Products page remakes (cardbg/mobilebg), 3 new assets |
| Jul 13 | Learn Sara chatbot | `lib/tutorial-matcher.ts` (synonym engine), full chat redesign, tutorial suggestions, animation softening |
| Jul 15 | MSME copy overhaul | All 6 service pages + AWS + Windows Cloud + 4 product pages reworded, unified green CTAs, footer logo |
| Jul 20 | Product restructuring | Tally Cloud Access page (merges AWS + Windows VM), Do More nav section, TallyPrime Server rewrite, TallyCapital polish |
| Jul 21 | Content accuracy | Editions page, `/do-more` page, HRMS de-branding, NoSky → Backup for TallyPrime, AES-256 terminology, Server rewrite |
| Jul 27 | Sara overhaul | `lib/sara-topics.ts`, sales-consultant prompt, typewriter perf fix, stop/interrupt, 8 sitemap routes |
| Jul 28 | Sara split + TSS | Learn/Ask dual mode, TSS Renewal CRUD system (form/API/admin), FAQ ERP notice |
| Jul 29 | Email experiment + auth | Built+diagnosed+removed SMTP/cPanel email, stateless HMAC admin auth |
| Jul 31 | Chunked uploads | 4.5 MB Vercel limit solved, AMC-template service pages, Groq model 503 fix |
| Aug 1 | Gemini + voice | Gemini Flash primary, Ask Sara voice input, Learn Sara voice output, SaraText renderer, sales tightening |
| Aug 3 | Direct email send | `sendEmailDirect()` inline, exactly-once dedupe, cron removed |
| Aug 4 | Email routing + redesign | Per-page recipient editor, `/contact` redesign, HRMS pricing → Contact Sales, destination-aware email test |

---

## Progress Table — Area / Work Done / Status

| # | Area | Work Done | Status |
|---|------|-----------|--------|
| 1 | Product Pages | Tally Cloud Access page created (merges AWS + Windows VM, 12 features, 9 FAQs); TallyPrime Server full rewrite; Editions page (Silver/Gold/Server only) | Done |
| 2 | Do More Hub | New `/do-more` page with 4 solution cards (Cloud Access, TallyDrive, HRMS, TallyCapital); product-nav restructured | Done |
| 3 | Copy Overhaul | 6 service + 2 cloud + 4 product pages reworded for MSME (plain language, benefit-first CTAs); unified green CTA theme | Done |
| 4 | Content Accuracy | NoSky → Backup for TallyPrime rebrand; 11× Bank-Level/Bank-Grade → AES-256; HRMS OTU HRplus references removed | Done |
| 5 | Sara AI | Shared knowledge base (`lib/sara-topics.ts`); Gemini Flash primary (Groq fallback); Learn/Ask dual mode; sales 3-beat prompt; 30+ fallback patterns | Done |
| 6 | Voice I/O | Ask Sara speech-to-text input; Learn Sara read-aloud Summary/Full with mute | Done |
| 7 | Chat Performance | Typewriter 20-40 char chunks @ 5-8ms, no per-char spans, stop/interrupt, scroll polling 300ms | Done |
| 8 | Tutorial Matcher | `lib/tutorial-matcher.ts` — 13 synonym groups, scored matching, strict full-match mode | Done |
| 9 | TSS Renewal | Full CRUD system: form (3 variants), API endpoints, `tss_renewals` collection, admin dashboard | Done |
| 10 | Uploads | Chunked upload system (3 MB/chunk, 200 chunks) solving Vercel's 4.5 MB body limit; career resume via Mega | Done |
| 11 | Email Delivery | Direct inline send (`sendEmailDirect()`), `jobKey` exactly-once dedupe, send ledger, no cron | Done |
| 12 | Email Routing | Per-page destinations grouped by category; `/api/contact` destination-aware; merged admin "Recipients by Page" editor | Done |
| 13 | Contact Page | Full redesign: settings-driven, URL prefill, embedded map, bottom social grid, Playfair font | Done |
| 14 | HRMS Pricing | "View Price" table → Contact Sales card (matches Server page) | Done |
| 15 | Admin Auth | In-memory Map → stateless HMAC cookie tokens (24hr, httpOnly, secure) | Done |
| 16 | Security | Prompt-injection regex (server+client) + system-prompt directive; green theme; rate limiting 60 req/min | Done |
| 17 | Email Test | `tss-renewal` asserted against per-page destination map (not legacy form-type map) | Done |
| 18 | Prod Fixes | Groq corrupted model names → 503 fixed; `BLOB_READ_WRITE_TOKEN` diagnosis; `microphone` policy removed | Done |

---

## Build Status

| Check | Result |
|-------|--------|
| `tsc --noEmit` | Clean (verified most days) |
| `next build` | 101/101 static pages, 0 errors (final; grew from 87 → 96 → 101 routes across month) |
| Email test | Destination-aware; `tss-renewal` now covered via per-page map |
| Sara test | 503s fixed; Ask + Learn modes return 200 live |

---

## Next Steps

| Priority | Item |
|----------|------|
| High | Commit + push accumulated stack (contact redesign, email routing, HRMS pricing, workflow, daily logs) |
| Medium | Fill per-page recipient grid for remaining destinations in `/admin/email-config` |
| Medium | Add `tss-renewal` recipients via admin grid (test asserts it via `diag.destinations`) |
| Low | `HomeHero.tsx:488` brand image alt still "NoSky Node" (rename to Backup for Tally) |
