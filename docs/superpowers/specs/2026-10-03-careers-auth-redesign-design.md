# Careers Auth Redesign — Full Design Spec
**Date:** 2026-10-03
**Approach:** Architectural (no implementation yet)
**Scope:** Public repo + sarvadnya-advanced (admin) repo per request

> This spec covers DB schemas, APIs, pages, components, resume-per-user, internal upgrade openings, admin, security, animations (prefers-reduced-motion), migration notes, file-by-file changes, and the clarifying Q&A requested.

## 1. Problem statement recap
The user wants: login = email+password. Design full careers auth redesign with:
- DB schemas (users, auth_sessions, careers extensions, job_applications changes)
- API routes, pages, components (ID card, redesigned opening cards, auth forms)
- resume-per-user (one stored, update replaces+deletes old)
- internal upgrade openings with level/stages
- admin user management + careers extensions
- security (bcrypt, httpOnly sessions, rate limits)
- animations (prefers-reduced-motion)
- migration notes, and file-by-file changes for public repo + advanced repo
- Save to `docs/superpowers/specs/2026-10-03-careers-auth-redesign-design.md` and output full content
- Answer remaining clarifying questions (resume storage Mega vs Blob, session revocability, internal visibility, ID card mobile placement, resume deletion details, admin scope, card redesign style, animations, decomposition) in a short Q&A block with recommended answers (default to safe choices)

## 2. Core assumptions (architectural)
- Auth is careers-scoped (separate from site admin). Career users (`role: 'candidate'|'internal'|...`) vs admin (`role: 'admin'`).
- Login = email + password only (no OTP/Social unless specified). Email normalized (lowercased, trimmed).
- Sessions httpOnly, SameSite=Lax, Secure in prod, rotation on login/logout, device list optional.
- Resume: one per user (latest). “Replace” means upload new → overwrite stored blob/Mega object, delete old object (best-effort). 
- Internal upgrade openings: openings marked internal, visible only to authenticated internal/candidate-with-internal-access, with level/stages fields.
- Public repo has careers UI+auth; advanced (admin) has user management + careers extensions.

### 2.1 Q&A (clarifying) — recommended answers
**Q: Resume storage Mega vs Blob**
A: Prefer **Vercel Blob** as primary (owned, chunked upload path exists, easier lifecycle/delete old). Keep **Mega.nz upload path optional/behind flag** (MEGA_ENABLED) to avoid external dependency coupling; on replace: fetch old resumeUrl, delete old blob/Mega object (best-effort, non-blocking), store new. Default safe: Blob (matches chunkUpload). 

**Q: Session revocability**
A: Per-session tokens (auth_sessions) with `revokedAt`, `expiresAt`, `userAgent`, `ip` (hashed or masked). Logout revokes current; “logout all devices” revokes all user sessions. Idle timeout + absolute expiry. 

**Q: Internal visibility**
A: Openings `visibility: 'public'|'internal'`. Authenticated users with `internal=true` or `role='internal'` see internal; public see public only. URLs remain same, UI gated server-side.

**Q: ID card mobile placement**
A: Mobile: sticky top bar (right side / in header actions) compact, tap to expand modal/drawer. Desktop: sidebar/profile chip or top-right avatar. Avoid blocking Apply CTA.

**Q: Resume deletion details**
A: On replace: identify old object (extract key/blob path or store `resumeKey`), `delete` old (best-effort, log failures), write new, update user.careers.resumeUrl/resumeKey. On account delete (if allowed): delete stored resume. Orphan cleanup rare (best-effort). 

**Q: Admin scope**
A: Advanced repo: users list/search, role/toggle internal, view resumes, manage careers extensions (internal openings, levels/stages), applications linked to users. Public repo: candidate auth/profile only.

**Q: Card redesign style**
A: Modern, accessible (teal #006569), elevation subtle, badges (Internal/Level/Stages), animated reveal with reduced-motion guard. Keep existing brand, improve hierarchy.

**Q: Animations**
A: Use transform/opacity only, IntersectionObserver, pause off-screen, `prefers-reduced-motion: reduce` disables/replaces with fade.

**Q: Decomposition**
A: Phased: schemas/migrations → auth API/pages → resume-per-user → internal+levels/stages → ID card + redesigned cards → admin → tests/docs.

## 3. DB Schemas (MongoDB)
Collections: `users`, `auth_sessions`, `careers` (extensions), `job_applications` (changes)

### 3.1 users
```ts
{
  _id, email (unique, lowercase), passwordHash (bcrypt), 
  name, phone, experience, 
  careers: { resumeUrl, resumeName, resumeKey, updatedAt, size },
  role: 'candidate'|'internal'|'admin',
  internal: boolean, // internal access
  emailVerifiedAt?, status:'active'|'blocked',
  lastLoginAt?, createdAt, updatedAt
}
```
Indexes: `{email:1 unique}`, `{role:1}`, `{internal:1}`

### 3.2 auth_sessions
```ts
{
  _id, userId, sessionToken (opaque), 
  userAgent, ipHash, expiresAt, revokedAt, lastUsedAt,
  createdAt
}
```
Indexes: `{sessionToken:1 unique}`, `{userId:1}`, `{expiresAt:1} (TTL)`, `{revokedAt:1}`

### 3.3 careers (openings) extensions
Add: `visibility: 'public'|'internal'`, `level?: string` (e.g. L1–L5/Junior–Lead), `stages?: string[]` (interview stages), `internalOnly?: boolean`, `upgradeFor?: string[]`

### 3.4 job_applications changes
Add: `userId?: ObjectId` (link to user), `resumeStoredByUser?: boolean`, keep `resume_url` legacy or prefer user.resumeUrl? Also `appliedVia:'public'|'auth'`

## 4. APIs (routes)
Public: `/api/auth/signup`, `/login`, `/logout`, `/me`, `/sessions`, `/careers/resume` (upload/replace/delete), `/careers/apply` (auth-aware). Admin (advanced): `/api/admin/users`, `/api/admin/users/[id]`, careers extensions.

## 5. Pages/Components
Pages: `/careers/login`, `/careers/signup`, `/careers/profile` (ID card + resume). Components: `AuthForms`, `CareersAuthGate`, `IdCard`, `OpeningCard` (redesigned), `ResumeManager`.

## 6. Resume-per-user
One stored. On replace: read old key, upload new to Blob/Mega, delete old (best-effort), set user.careers to new. Max 5MB PDF, validate.

## 7. Internal upgrade openings + level/stages
Job type extended; UI filters by auth+internal; admin CRUD with visibility/level/stages.

## 8. Admin (advanced repo)
User management grid, toggle internal/role/block, view linked applications+resume, careers extensions editor.

## 9. Security
bcrypt 12+, httpOnly Secure SameSite sessions (7–30d), rotation, rate limits (login/signup/apply), CSRF-lite, sanitize, validate PDFs.

## 10. Animations (prefers-reduced-motion)
Respect `prefers-reduced-motion: reduce`: disable transforms, use opacity/fades, skip stagger, IntersectionObserver pause unchanged.

## 11. Migration notes
Non-destructive: add fields optional, backfill `job_applications.userId` later, sessions new, users new. Seed unchanged.

## 12. File-by-file (high level)
Public: `lib/auth/*`, `app/(site)/careers/(auth)/*`, `app/api/auth/*`, `app/components/careers/*`, update `actions/careers.ts`, `JobApplicationModal`, `careers/page.tsx`.
Advanced: `app/admin/users/*`, `app/api/admin/users/*`, careers admin extensions.

## 13. Q&A block (as requested)
(Full answers above)

## 14. Notes
No implementation. Spec is traceable, safe defaults, backwards compatible.
---

*End of spec.*
