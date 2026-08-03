# Project Documentation & Architecture 

## Technical Architecture

### 1. Framework & Core Technologies
- **Next.js 16 (React 19):** Utilizing the latest App Router and React Compiler capabilities.
- **Tailwind CSS 4:** For high-performance, utility-first styling.
- **TypeScript:** Strict typing across the codebase for reliability.
- **MongoDB:** Backend data persistence (as seen in `lib/mongodb.ts`).

### 2. Performance Engineering (Optimized for Low-End Systems)
The application implements several advanced optimization strategies to ensure smooth 60fps rendering even on resource-constrained devices:

- **Visibility-Aware Rendering:**
    - Components like `HomeHero`, `CustomerReviews`, and `FAQ` use `IntersectionObserver` to halt animations and transitions when off-screen.
    - **Tab Visibility Management:** The Page Visibility API is used to detect when a user leaves the tab. All animations and timers are paused and "soft reset" upon return to prevent animation stacking and "catch-up" flashes.
    - `content-visibility: auto` is applied globally to skip the rendering of non-visible sections.
- **Computational Efficiency:**
    - **Memoization:** Critical UI components (`Productbar`, `CustomerReviews`, `FAQ`) are wrapped in `React.memo` and use `useCallback` to prevent redundant main-thread work.
    - **Resource Management:** Background scripts (like the `swirl.js` canvas effect) use `Float32Array` for memory-efficient particle management and reduce complexity automatically on mobile devices.
- **Load Timing:**
    - **Lazy Loading:** Non-critical components like `QuickSupportModal` are loaded using `next/dynamic` only when requested.
    - **Image Optimization:** Extensive use of `next/image` with proper `sizes` and `priority` attributes to minimize Layout Shift (CLS).

### 3. Key Components Catalog

| Component | Responsibility | Performance Features |
| :--- | :--- | :--- |
| `HomeHero` | Primary landing content with dynamic slide themes. | `IntersectionObserver` pauses, visibility-aware typing effect. |
| `Productbar` | Apple-style navigation for deep-diving into products. | Memoized icons, `useCallback` click handlers, backdrop-blur. |
| `CustomerReviews` | Displays verified social proof. | Staggered entrance animations, memoized star ratings. |
| `CertifiedPartners` | Showcases network reliability. | Automated Rise-up animations, lazy-loaded partner logos. |
| `FAQ` | Dynamic accordion with keyword search. | `useMemo` for search filtering, partial list rendering (Expandable). |
| `QuickSupportModal` | AI-powered sales consultant chatbot (Ask Sara). | Groq API with local fallback, stop/interrupt, typewriter, voice, tutorials. |

### 4. AI Chatbot Architecture (Sara)

| File | Role |
| :--- | :--- |
| `app/api/chat/route.ts` | Server-side API. Calls Groq SDK with multi-key rotation, 25s timeout, bulletproof think-tag cleanup. System prompt defines Sara as a senior sales consultant with full product catalog. |
| `app/components/QuickSupportModal.tsx` | Floating button chat UI. AI API call with local keyword fallback. Stop/interrupt button during typewriter. Input stays focused. 20-40 char chunks at 5-8ms. |
| `lib/sara-topics.ts` | Shared knowledge base. 7 topic trees with follow-ups, `matchTopic()` keyword scorer, `getFallbackResponse()` with 20+ contextual patterns. Used by both Ask Sara and Learn Sara. |
| `app/(site)/learn-sara/page.tsx` | Full-page Sara chatbot. Imports from `lib/sara-topics.ts`. Local keyword matching, no API calls. |

### 5. Chunked Upload System (Vercel Large-Payload Compatibility)

Vercel serverless functions reject request bodies over ~4.5 MB, so all uploads are split into small chunks and reassembled in Vercel Blob.

**Flow:** Files ≤ 3 MB upload in a single `multipart/form-data` POST. Larger files are sliced into 2 MB chunks client-side; each chunk is stored as a temp blob part (`sarvadnya-uploads/_chunks/{uploadId}/part-NNNNN.ext`), and the final chunk streams all parts back into one assembled file server-side, deletes the temp parts, and removes the replaced `oldUrl` blob.

| File | Role |
| :--- | :--- |
| `lib/uploadClient.ts` | Client helper `uploadFileChunked({ file, type, name, oldUrl, endpoint, onProgress })`. Slices large files into 2 MB chunks, sends sequentially with `uploadId`/`chunkIndex`/`totalChunks`, returns `{ url }`. |
| `lib/chunkUpload.ts` | Shared server handler. Single-chunk = direct `put`. Multi-chunk = `put` parts (`allowOverwrite: true`), then on final chunk `list` + sort + stream-concat into `sarvadnya-{type}-{name}-{timestamp}{ext}` via `@vercel/blob`, `del` parts + old blob. Guards: 3 MB/chunk, 200 chunks max. Node runtime, `maxDuration = 60`. |
| `app/api/admin/upload/chunk/route.ts` | Admin-protected chunk endpoint used by all 5 admin image uploads (settings, partners, pages, modules, learning). |
| `app/api/upload/chunk/route.ts` | Public (rate-limited) chunk endpoint used by the career resume upload. |
| `app/api/admin/upload/route.ts` | Legacy single-shot endpoint. Kept for backward compatibility; admin pages no longer call it. |

**Resume path:** `JobApplicationModal` uploads the PDF via `/api/upload/chunk`, then passes `resumeUrl` + `resumeName` to the `submitApplication` server action, which downloads the assembled blob and forwards the buffer to `uploadToMega()` in `lib/mega.ts` (`(buffer, fileName, folderName)` signature).

**Note:** Vercel Blob's native `uploadPart` multipart was not used — it requires ≥ 5 MB parts, which conflicts with the 4.5 MB request-body limit.

### 6. Email Notification System (Resend + MongoDB Queue)

**Architecture:** Web forms that send an internal email copy (`UnifiedContactModal` → `POST /api/email/submit`) **never call Resend inline**. The public route only sanitizes → validates → saves the submission → enqueues a job → returns instantly. Actual sends happen exclusively from a background worker, so a slow/flaky email API can never slow down (or spam) the user.

**Per-page destinations:** each modal resolves a destination from the current route (`lib/form-destinations.ts`, override via the `destination` prop). Recipients resolve destination-first from the admin-editable `EMAIL_DESTINATION_RECIPIENTS` map (opt-in — a page with no configured recipient sends **no** email, only `demo` is pre-wired), then per-form-type (`EMAIL_FORM_RECIPIENTS`), then `RESEND_INTERNAL_TO`.

| File | Role |
| :--- | :--- |
| `lib/email-queue.ts` | MongoDB `email_queue` collection. `enqueueEmailJob()` upserts by unique `jobKey` (dedupe → exactly 1 email per submission). `processEmailQueue()` atomically claims due jobs (`pending`/`failed` past `nextRetryAt`) and sends via Resend; backoff `min(30s·2ⁿ, 4h)`, `maxAttempts = EMAIL_MAX_ATTEMPTS` (5). Stale `processing` jobs (>5 min) are auto-reset. Terminal jobs get `expireAt` (TTL index purges after 30 days) → bounded memory. |
| `lib/email.ts` | Config + HTML template + `sendInternalFormCopy()`. Recipients are resolved **server-side only** — destination-first (`EMAIL_DESTINATION_RECIPIENTS` per-page map, opt-in), then per-form-type (`EMAIL_FORM_RECIPIENTS` JSON in settings), then `RESEND_INTERNAL_TO`. Clients can never control recipients. `getEmailDiagnostic()` returns masked config incl. per-form + per-destination maps. |
| `app/api/email/submit/route.ts` | Public, rate-limited (~30/min/IP). Enqueues only; `after()` from `next/server` drains the queue post-response (`EMAIL_DISABLE_BACKGROUND=1` disables for tests). Returns `{ ok, saved, queued, jobId }`. |
| `app/api/admin/email/process/route.ts` | Admin-only (proxy `x-admin-key`/cookie) drain. Invoked by Vercel Cron + admin panel "Process Queue Now". |
| `app/api/admin/email/queue/route.ts` | Admin-only queue stats + recent jobs (recipients masked). |
| `app/admin/email-config/page.tsx` | Admin UI: sender address, per-form-type recipient editor (`EMAIL_FORM_RECIPIENTS` JSON), per-page destination editor (`EMAIL_DESTINATION_RECIPIENTS` JSON, opt-in), queue status panel + manual drain button. |
| `vercel.json` | 1-min Cron → `/api/admin/email/process?batch=10` with `x-admin-key: @ADMIN_ACCESS_KEY`. |
| `scripts/bootstrap.mjs` / `app/api/admin/bootstrap/route.ts` | Seed `EMAIL_FORM_RECIPIENTS` + `RESEND_SENDER_EMAIL` only if missing (`$setOnInsert` so admin edits persist). |
| `scripts/email-test.mjs` | `npm run test:email`. Default SINGLE mode = exactly 1 email. Verifies dedupe, admin-only drain, per-form recipients, fast enqueue. `EMAIL_FULL_TEST=1` opts into sanitization/concurrency/rate-limit suites. |

**Exactly-once guarantee:** the client generates a `requestId` once per modal open; the server upserts the queue job by `jobKey = requestId`, and the atomic status-filtered claim prevents concurrent double-sends. Retried/duplicate POSTs can never fire a second email. Sent/failed/dead jobs are TTL-purged.

## Developer Guidelines
- **Surgical Updates:** Always prefer targeted `replace` over complete file rewrites for existing files.
- **Accessibility:** Maintain high contrast ratios and ensure interactive elements have clear focus states.
- **Mobile First:** All new components must be verified for performance and layout on small screens (minimum 360px).
- **GPU Hints:** Use `will-change` and `translateZ(0)` sparingly for elements with complex animations.

---
*Last Updated: 2026-08-03*
