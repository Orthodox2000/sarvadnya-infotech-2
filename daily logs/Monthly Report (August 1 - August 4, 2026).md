# Monthly Report (August 1 — August 4, 2026)

**Period:** 4 working days — Aug 1, 3, 4
**Version:** v1.1.4xx

---

## Progress Snapshot

| Metric | Value |
|--------|-------|
| Working days | 4 (Aug 1, 3, 4) |
| Files touched | 25+ |
| Public pages | 101 static routes build-clean |
| Build status | TypeScript clean, `next build` 101/101 |
| Commits | `07bbb22` (Aug 1) · `81fefa5`/`e0707a6` (Aug 3) |

---

## Key Updates (by day)

| Date | Focus | Highlights |
|------|-------|-----------|
| Aug 1 | Sara AI — Gemini primary + voice I/O | Gemini Flash primary provider (Groq fallback), Ask Sara voice *input*, Learn Sara voice *output* (read-aloud), shared `SaraText` renderer, strict tutorial matching, sales prompt tightened to 1-3 sentence hard-sell, 30+ pattern local fallback, prod BLOB_READ_WRITE_TOKEN diagnosis |
| Aug 3 | Email system refactor — direct inline send | Removed cron/queue dependency; `sendEmailDirect()` sends via Resend inline with `jobKey` exactly-once dedupe; Mongo ledger keeps retries; vercel.json cron removed |
| Aug 4 | Email per-page routing + Contact redesign + HRMS pricing | Unified per-page recipient editor, inline sidebar forms destination-aware, full `/contact` redesign, HRMS pricing → Contact Sales card, destination-aware email test |

---

## Progress Table — Area / Work Done / Status

| # | Area | Work Done | Status |
|---|------|-----------|--------|
| 1 | AI Provider | Gemini Flash (`gemini-3.5-flash-lite`) primary; Groq rotation fallback; `openai/gpt-oss-20b` search model | Done |
| 2 | Voice I/O | Ask Sara speech-to-text input (Web Speech API); Learn Sara read-aloud Summary/Full with mute | Done |
| 3 | Chat UX | Shared `SaraText` renderer; typewriter 20-40 char chunks; stop/interrupt; strict tutorial suggestions | Done |
| 4 | Sales AI | 1-3 sentence always-end-at-a-product replies; 3-beat formula; per-mode token budgets | Done |
| 5 | Fallback KB | `getFallbackResponse()` 30+ patterns; friendlier tone | Done |
| 6 | Email Delivery | Direct inline send via `sendEmailDirect()`; exactly-once `jobKey` dedupe; no cron | Done |
| 7 | Email Ledger | `email_queue` repurposed as send ledger; backoff retry (5 attempts); 30-day TTL | Done |
| 8 | Email Routing | Per-page destinations (categories: products/services/cloud/modules/others); `contact` + `find-solution` added | Done |
| 9 | Admin Email UI | Merged dual editor into one "Recipients by Page" grid, category-grouped; "Retry Failed Sends" | Done |
| 10 | Inline Forms | `/api/contact` destination-aware (body/Referer → `sendEmailDirect`, requestId dedupe, rate limit) | Done |
| 11 | Contact Page | Full redesign: settings-driven client component, URL prefill, embedded map in green card, bottom social grid, Playfair font | Done |
| 12 | HRMS Pricing | "View Price" table → Contact Sales card (matches Server page) | Done |
| 13 | Email Test | `tss-renewal` asserted against per-page destination map (not legacy form-type map) | Done |
| 14 | Prod Fix | `BLOB_READ_WRITE_TOKEN` diagnosis documented; `Permissions-Policy: microphone` removed | Done |

---

## Build Status

| Check | Result |
|-------|--------|
| `tsc --noEmit` | Clean |
| `next build` | 101/101 static pages, 0 errors |
| Email test | Destination-aware; `tss-renewal` now covered via per-page map |

---

## Next Steps

| Priority | Item |
|----------|------|
| High | Commit + push accumulated stack (contact redesign, email routing, HRMS pricing, workflow, daily logs) |
| Medium | Fill per-page recipient grid for remaining destinations in `/admin/email-config` |
| Low | `HomeHero.tsx:488` brand image alt still "NoSky Node" (rename to Backup for Tally) |
