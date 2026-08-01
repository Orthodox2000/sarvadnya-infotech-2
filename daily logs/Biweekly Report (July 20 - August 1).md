# Biweekly Report (July 20 - August 1, 2026)

## Summary
This period delivered a major product restructure (unified Tally Cloud Access page, "Do More with Tally" navigation, TallyPrime Server rewrite), the first-ever voice-enabled AI chatbot (Gemini primary provider with voice input/output), a complete TSS Renewal business feature, a production-breaking upload fix for Vercel, and a stateless admin-auth rewrite. 50+ files modified across 8 working days.

## Changes from Last Report (June 22 - July 4)
- **Scope:** Expanded from green rebrand + caching removal → product architecture restructure + full AI chatbot voice upgrade
- **New Pages:** `/cloud/tallycloudaccess` (unified AWS+Windows cloud page) and `/do-more` created — prior period created 0 pages
- **AI Provider:** Upgraded from Groq-only → **Gemini Flash primary with Groq fallback** + voice input/output (prior period had no voice, Groq-only)
- **Business Features:** TSS Renewal system (forms + MongoDB + admin dashboard) — prior period had none
- **Infrastructure:** Stateless HMAC cookie admin auth replacing in-memory sessions; chunked uploads for Vercel Blob — prior period removed caching instead
- **Branding/Content:** NoSky → "Backup for TallyPrime" rebrand, global "Bank-Level/Bank-Grade" → AES-256 terminology, "OTU HRplus" references removed from HRMS

## Highlights
- **Product Restructure (20-21):** Unified Tally Cloud Access page merged AWS Cloud + Windows VM content; new "Do More with Tally" section and page; Editions page trimmed to Silver/Gold/Server; TallyPrime Server fully rewritten against the official Tally FAQ (multi-threaded architecture, 100-150 users, corrects "physical server" misconception).
- **Content Accuracy Overhaul (21):** HRMS de-branded from OTU HRplus; NoSky rebranded to "Backup for TallyPrime"; all 11 "Bank-Level/Bank-Grade" claims replaced with AES-256 across 7 files.
- **AMC Template & Service Pages (22):** AMC hero/features/zero-friction/CTA sections compacted to a lighter template with floating lucide icons; Corporate Training page migrated onto the same structure; new `bounce-slow` / `float` CSS animations.
- **Sara AI Upgrade (27-28, 1):** Shared knowledge base, AI sales-consultant prompt, dual Learn/Ask modes, teaching fallbacks, and finally **Gemini Flash as primary provider** with Web Speech API voice input (Ask Sara) and speech-synthesis read-aloud (Learn Sara).
- **New Business Feature (28):** TSS Renewal — 3 form variants on live pages, MongoDB `tss_renewals` collection, admin dashboard with approve/reject/delete.
- **Production Fix (31):** Chunked upload system (2-3 MB slices, server-side Blob assembly) solved Vercel's ~4.5 MB payload limit for admin images and career resumes; fixed corrupted Groq model names that had broken `/api/chat` with 503s.
- **Voice + Sales Polish (1):** Shared `SaraText` renderer, strict full-match tutorial suggestions, Search model → `openai/gpt-oss-20b`, 1-3 sentence "always sell" sales prompt with per-mode token budgets, 30+ pattern fallback.

## Workstream Breakdown

### Product Architecture (July 20-21)
- `app/(site)/cloud/tallycloudaccess/page.tsx` created — merged AWS + Windows VM into one page (12 features, 9 FAQs, NA pricing, sticky nav, sidebar quote form)
- `app/(site)/do-more/page.tsx` created — "Do More with Tally" 4-solution grid (TallyCloud Access, TallyDrive, HRMS, TallyCapital)
- `lib/product-nav.ts` restructured — Editions (Gold/Silver/Server) + new Do More section; `Backup for TallyPrime` added
- TallyCapital refinements (lending-partner carousel, MSME heading)
- TallyPrime Server complete rewrite; Editions page trimmed to 3 columns

### Content Accuracy (July 21)
- HRMS: all OTU HRplus references removed; renamed "HRMS Solution"
- NoSky → "Backup for TallyPrime" rebrand; incremental backups + AES-256 language
- Global "Bank-Level/Bank-Grade" → "AES-256 Encryption" (11 instances, 7 files)

### Service Template (July 22)
- AMC page compaction (hero graphic, 4-card features, zero-friction split, CTA sizing)
- Corporate Training migrated to AMC structure; `bounce-slow`/`float` animations added to globals.css

### AI Chatbot Foundation (July 27-28)
- `lib/sara-topics.ts` shared knowledge base (20+ patterns); Sara as senior sales consultant
- Typewriter/scroll/stop-button performance fixes; bulletproof `<think>` cleanup; sitemap +8 routes
- Learn vs Ask dual-mode split; 16 teaching patterns; TSS Renewal system + FAQ ERP notice

### Email & Auth (July 29)
- Email system built (cPanel PHP + SMTP) → diagnosed Gmail silent-drop → removed entirely (5 files, nodemailer dropped)
- Admin auth → stateless `__admin_token` HMAC cookies; `no-store` on 401

### Production Reliability (July 31)
- Chunked upload system (`lib/chunkUpload.ts` / `lib/uploadClient.ts`); all 5 admin uploads + resume path migrated; `lib/mega.ts` buffer signature
- Tally-on-WhatsApp + TDL pages rebuilt on AMC template; compact search no-results
- Fixed `llopenai/...` / `ama-3.3-70b-...` corrupted model names → `/api/chat` 503 resolution

### Voice & Gemini (August 1)
- Gemini Flash primary + Groq fallback, multi-key rotation, 24-turn history trim, shared `cleanContent()`
- `SaraText` shared renderer; Ask Sara voice input; Learn Sara read-aloud (Summary/Full) + mute
- Strict tutorial matching; Search model → `openai/gpt-oss-20b`; sales prompt 3-beat tightening; 30+ pattern fallback

## Files Modified
50+ files across cloud/product pages, service pages, chatbot components, API routes, lib utilities, admin pages, sitemap, and configuration.

## Build Status
Stable — TypeScript-clean builds verified at each stage (last: commit `07bbb22`, Aug 1).
