# Sarvadnya Infotech LLP - Project Lifecycle Master Documentation
**Reporting Period:** May 6, 2026 – June 17, 2026  
**Final Application Version:** v1.1.380  
**Status:** ARCHITECTURE CODIFIED / DEPLOYMENT READY

---

## 1. Executive Summary
This document provides a comprehensive historical and technical record of the Sarvadnya Infotech LLP web platform's development. Over the past 40 days, the project has evolved from a static business site into a high-performance, AI-driven enterprise portal. Key milestones include the integration of the **GroqCloud Strategic Unit**, a sophisticated **TallyDrive Cloud Backup** showcase, and a multi-step **Consultation Engine**.

---

## 2. Progress Documentation (Versioning History)

### Phase 1: Foundation & Brand Identity (v1.1.0 – v1.1.150)
*   **Architectural Setup:** Migrated to Next.js 16 with Turbopack for sub-minute builds.
*   **Branding Synchronization:** Finalized the "Radiant Sky" palette (Electric Blue #00ABE4 / Midnight Blue #232F3E).
*   **Content Migration:** Moved image storage from MongoDB binary to local `/public/uploads` for optimized loading.
*   **SEO & Governance:** Deployed production-grade `sitemap.ts` and `robots.ts`.

### Phase 2: AI & Interactive Intelligence (v1.1.151 – v1.1.340)
*   **Ask Sara Assistant:** Integrated GroqCloud (Llama 3.3 70B) for real-time, context-aware Tally support.
*   **Search Engine:** Developed an AI-powered search results page with navigation buttons (`[[Label|URL]]`).
*   **Admin Dashboard:** Created a high-fidelity panel for managing Modules, Careers, News, and Global Settings.

### Phase 3: Strategic Consultation & TallyDrive (v1.1.341 – v1.1.373)
*   **Find Solution Engine:** Launched a branching logic questionnaire at `/find-solution` to generate personalized strategic roadmaps.
*   **TallyDrive Integration:** Deployed a detailed cloud backup showcase with tiered pricing (Basic, Pro, Enterprise) and high-contrast professional UI.
*   **Visual Snapshot System:** Implemented an automated Puppeteer engine for 1440p high-fidelity design reviews.

### Phase 4: Reliability Hardening & Logic Codification (v1.1.374 – v1.1.380)
*   **AI Voice Restoration (TTS):** Re-implemented the Text-to-Speech system for "Ask Sara" with persistent audio modes and markdown-clean buffers.
*   **Chat Stability & UX:** Integrated intelligent retry logic for "Failed to fetch" errors and smart focus/scroll-lock mechanisms for seamless interaction.
*   **Form Constraint Hardening:** Implemented global numeric validation for phone fields across all contact and application touchpoints.
*   **Consultation Logic Documentation:** Codified the entire `/find-solution` strategic flow, including questionnaire tree mapping and industry-specific triggers, into the project's technical core.

---

## 3. Daily Log Highlights (Recent)

| Date | Key Accomplishments | Version |
| :--- | :--- | :--- |
| **August 14** | Module Catalog Rebuild (official 6 modules, MSME tone), Single-Price Model + View Price addition-game reveal, YouTube Global Link, Production module-image fix, Site Dead-Code Cleanup. | v1.1.390 |
| **June 18** | Consultation Logic Codification, Form Hardening, Chat UX Smart Interaction. | v1.1.380 |
| **June 17** | AI Voice Restoration (TTS), TallyDrive UI Polishing, Chat Stability. | v1.1.376 |
| **June 3** | Automated Visual Capture (Puppeteer), Total Content Extraction (Soft Copy), Final Security Audit. | v1.1.370 |
| **May 30** | Solution Finder High-Density UI, Emerald Branding CTAs, Adaptive Nav. | v1.1.280 |

---

## 4. Excel Progress Tracker (CSV Data)

```csv
Date,Version,Module,Activity,Status
2026-05-06,v1.1.16,Core,Project Initialization & Folder Structure,Complete
2026-05-11,v1.1.41,AI,GroqCloud Llama 3.3 Integration,Complete
2026-05-18,v1.1.144,Branding,Radiant Sky Palette Synchronization Site-Wide,Complete
2026-05-22,v1.1.200,Hero,Multi-Layout Mosaic Engine (Standard/Ecosystem),Complete
2026-06-03,v1.1.370,QA,Automated Snapshots & Total Site Soft Copy,Complete
2026-06-17,v1.1.376,Chat,AI Voice Restoration (TTS) & API Stability,Complete
2026-06-18,v1.1.380,Core,Consultation Logic Codification & Form Hardening,Complete
2026-08-03,v1.1.389,Email,Async Email Queue + Per-Form Recipient Config (Exactly-Once),Complete
2026-08-14,v1.1.390,Modules,Module Catalog Rebuild + Single-Price Reveal Game + YouTube Global Link + Dead-Code Cleanup,Complete
```

---

## 5. Weekly Executive Summary (June 11 – June 18)

**Weekly Focus: Reliability, Accessibility & Logic Codification**

*   **Logic Sovereignty:** Completed the formal documentation of the **Consultation Engine logic**. This ensures the strategic branching and product mapping used in `/find-solution` are codified for long-term auditability.
*   **Interactive Accessibility:** Restored the **AI Voice Engine (TTS)**. By focusing exclusively on Text-to-Speech vocalization, we provided a hands-free "read-back" experience for Sara's replies without the hardware complexities of microphone input.
*   **Resilience & Stability:** Hardened the Chat API with intelligent retries and enhanced the UI with smart scroll-locking, ensuring "Ask Sara" remains robust under varying network conditions.
*   **Data Integrity:** Implemented strict numeric validation across all global forms, significantly reducing lead quality issues by stripping invalid characters from phone fields in real-time.

---

## 6. Technical Architecture Overview
- **Frontend:** Next.js 16 (App Router), Tailwind CSS 4, Framer Motion.
- **Backend:** MongoDB (Official Driver), Next.js Server Actions.
- **AI Stack:** GroqCloud (llama-3.3-70b-versatile).
- **Tools:** Puppeteer (Visual QA), Vercel Blob (Asset Management).

---

## 7. Email Notification System (v1.1.389)
An internal copy of every web form submission (Quote, Enquiry, Support, Callback, Demo, General) is delivered via **Resend** **directly (inline)** on submission. The public endpoint sanitizes, validates, saves, and sends the email synchronously within the request; the MongoDB `email_queue` collection acts as a send ledger for dedupe + retries. No queue drain, `after()`, or Vercel cron is required for delivery.

### Key design decisions
- **Why direct, not cron/queue:** Vercel's Hobby plan allows only 2 cron jobs at a minimum frequency of once/day, so scheduled/queue-drain sending is impossible. Direct inline sending means delivery never depends on a scheduler. Failed sends are recorded in the ledger with a `nextRetryAt` and retried from the admin panel or an optional external scheduler.
- **Per-page destinations (single routing model):** every page's form — the `UnifiedContactModal` (destination = prop ?? `getDestinationFromPath(route)` → `/api/email/submit`) and the inline sidebar forms (→ `/api/contact`, destination resolved server-side from the body `destination` or the `Referer` URL) — routes to its page destination. Recipients resolve destination-first from the admin-editable `EMAIL_DESTINATION_RECIPIENTS` map — **opt-in**, a page with no configured recipient saves the submission but sends no email (only `demo` is pre-wired) — then per-form-type `EMAIL_FORM_RECIPIENTS` (legacy, submissions with no page destination), then `RESEND_INTERNAL_TO`. Clients can never influence recipients. Destinations are grouped into categories (`products`/`services`/`cloud`/`modules`/`others`) in the admin UI.
- **Exactly-once delivery:** the client generates a `requestId` per modal open; `sendEmailDirect()` claims the ledger slot by unique `jobKey = requestId` (upsert) — the first caller sends, any retried/duplicate POST returns `deduped: true` and never fires a second email.
- **Retries:** `processEmailQueue()` atomically claims `pending`/`failed` jobs with backoff `min(30s·2ⁿ, 4h)`, `maxAttempts` 5, stale `processing` auto-reset, and a TTL index purging terminal jobs after 30 days (bounded memory).
- **Scheduler auth:** the process route accepts the admin session or an external scheduler (verifies `Authorization: Bearer <CRON_SECRET>` when set, else the `x-vercel-cron-schedule` + `vercel-cron/*` user-agent signature).
- **Security:** admin email endpoints are protected by both the proxy and a route-level `isRequestAuthorized()` check (header `x-admin-key`, `admin_key` cookie, or session token) — defense-in-depth against a misconfigured proxy.
- **Seed data:** `EMAIL_FORM_RECIPIENTS` + `RESEND_SENDER_EMAIL` are seeded only-if-missing by `scripts/bootstrap.mjs` / `/api/admin/bootstrap`, so admin edits persist.

| File | Role |
| :--- | :--- |
| `lib/email-queue.ts` | MongoDB `email_queue` send ledger: `sendEmailDirect()` (claim + inline Resend send + record), `processEmailQueue()` (retry), stats. |
| `lib/email.ts` | Resend config, per-page + per-form recipient resolution, masked diagnostic, HTML template. |
| `app/api/email/submit/route.ts` | Public direct-send endpoint (rate-limited): sanitize → validate → save → send inline. Returns `{ ok, saved, sent, deduped, jobId }`. |
| `app/api/admin/email/process/route.ts` | Admin-only retry drain (manual + external scheduler). |
| `app/api/admin/email/queue/route.ts` | Admin-only ledger stats + recent sends (recipients masked). |
| `app/admin/email-config/page.tsx` | Merged single editor: sender address + "Recipients by Page" grouped by enquiry category (sorted per page, page paths shown, one receiver input each → `EMAIL_DESTINATION_RECIPIENTS`, opt-in) + send-ledger panel + "Retry Failed Sends". Legacy per-form-type editor removed from UI (server fallback remains). |
| `scripts/email-test.mjs` | `npm run test:email` — SINGLE mode = exactly 1 email; `EMAIL_FULL_TEST=1` opts into extended suites. |

### Scheduling alternatives (when a time-based email is needed)
1. **Direct inline send (current)** — default; no scheduling needed for instant notifications.
2. **GitHub Actions cron** — free workflow (`schedule: '*/5 * * * *'`) calls `/api/admin/email/process?batch=10` with `CRON_SECRET`.
3. **Upstash QStash** — free-tier scheduled HTTP requests (down to per-second) hitting the same endpoint.
4. **External uptime/heartbeat monitors** (UptimeRobot, Cronitor, Google Cloud Scheduler free tier) pinging the retry endpoint periodically.

---
*End of Master Documentation*

outer), Tailwind CSS 4, Framer Motion.
- **Backend:** MongoDB (Official Driver), Next.js Server Actions.
- **AI Stack:** GroqCloud (llama-3.3-70b-versatile).
- **Tools:** Puppeteer (Visual QA), Vercel Blob (Asset Management).

---
*End of Master Documentation*

