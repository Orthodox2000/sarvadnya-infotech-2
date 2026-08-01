# Weekly Report (July 27 - August 1, 2026)

## Summary
This week was dominated by the Sara AI chatbot: a complete overhaul (27th), a dual-mode Learn/Ask split plus a new TSS Renewal business feature (28th), an email-system-then-removal experiment and a stateless admin-auth rewrite (29th), the Vercel chunked-upload system with AMC-template service pages (31st), and finally Gemini Flash as primary AI provider with full voice input/output (1st). 30+ files touched across 5 working days.

## Highlights
- **Sara AI Upgrade:** Gemini Flash (`gemini-3.5-flash-lite`) became the primary AI provider with Groq rotation as automatic fallback; a shared `SaraText` renderer was extracted and used across both chat surfaces.
- **Voice Everywhere:** Ask Sara gained speech-to-text voice *input* (Web Speech API); Learn Sara gained voice *output* (read-aloud Summary/Full) with mute toggle and auto-play.
- **Proactive Sales Personality:** The sales system prompt was tightened to 1-3 sentence replies that always end at a product, with a 3-beat formula and per-mode token budgets; the local fallback knowledge base grew to 30+ patterns.
- **New Business Feature:** TSS Renewal system — 3 form variants, MongoDB storage, and a full admin dashboard (approve/reject/delete).
- **Production Fix:** Chunked upload system solved Vercel's ~4.5 MB request-body limit for all admin image uploads and the career resume path.
- **Bug Fix:** Corrupted Groq model names (`llopenai/...`, `ama-3.3-70b-...`) fixed — production `/api/chat` had been returning 503.
- **Infrastructure:** Admin auth rewritten from an in-memory Map to stateless HMAC cookie tokens.

## Workstream Breakdown

### July 27 — Sara AI Chatbot Overhaul
- Shared knowledge base extracted to `lib/sara-topics.ts` (20+ patterns) used by both Ask Sara and Learn Sara.
- System prompt rewrote Sara as a proactive "senior sales consultant" with the full 20+ item product catalog.
- Performance: typewriter switched to 20-40 char chunks at 5-8ms, per-character `<span>` rendering removed, scroll polling 100→300ms.
- Stop/interrupt button (AbortController), input focus retention, `overflow-wrap-anywhere`, bulletproof `<think>` cleanup, 8 missing routes added to sitemap.

### July 28 — Dual-Mode Split + TSS Renewal System
- Learn Sara (teaching) vs Ask Sara (sales) split with `mode` param on `/api/chat`; 16 teaching fallback patterns.
- **TSS Renewal System:** `TssRenewalForm` (default/compact/inline), POST/GET/PATCH/DELETE endpoints, `tss_renewals` MongoDB collection, admin dashboard page, dashboard stat, FAQ pinned "IMPORTANT" ERP renewal notice.

### July 29 — Email Experiment + Auth Rewrite
- Built a dual-path email system (cPanel PHP mailer + nodemailer SMTP), diagnosed Gmail silently dropping SMTP mail, then **removed it entirely** per user decision (5 files deleted, nodemailer dependency dropped).
- Admin auth converted from in-memory Map to stateless `__admin_token` HMAC cookies; `no-store` on proxy 401.

### July 31 — Chunked Uploads + AMC Template + 503 Fix
- **Chunked upload system:** `lib/chunkUpload.ts` + `lib/uploadClient.ts` split large files into 2-3 MB chunks reassembled server-side in Vercel Blob; wired into all 5 admin image uploads and the career resume (via `lib/mega.ts` buffer upload).
- Search no-results state compacted; Tally-on-WhatsApp and TDL pages rebuilt on the AMC template.
- Fixed production-breaking 503s: corrupted Groq model names restored to `openai/gpt-oss-120b` / `llama-3.3-70b-versatile`.

### August 1 — Gemini Primary + Voice I/O + Sales Tightening
- Gemini Flash primary with Groq fallback, multi-key rotation for both, `MAX_HISTORY_TURNS` trimming, shared `cleanContent()`.
- New `SaraText` component; voice input (Ask Sara) and voice output (Learn Sara); strict tutorial matching; Search API model → `openai/gpt-oss-20b`.
- Sales prompt tightened to 1-3 sentence hard-selling replies with per-mode token budgets; fallback expanded to 30+ patterns.

## Files Modified
30+ files across `app/api/chat`, `lib/sara-topics`, `lib/tutorial-matcher`, `lib/chunkUpload`, `lib/uploadClient`, `lib/mega`, `lib/admin-auth`, `app/components` (QuickSupportModal, JobApplicationModal, TssRenewalForm, SaraText), 5 admin pages, 2 service pages, admin settings, and the learn-sara route.

## Build Status
TypeScript clean — verified builds on 27th, 29th, 31st and 1st (commit `07bbb22`). Lint skipped (interactive config).
