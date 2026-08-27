# Admin Panel vs Frontend Isolation — Deployment Guide

> Created: 2026-08-26
> Purpose: Document what each deployment (frontend-only / admin-only) requires, what's missing, email API safety, and auth handling.

---

## 1. Architecture Overview

Both deployments share the **same MongoDB database**. Changes made in the admin deployment (content updates, image uploads, submission management, email config) instantly appear on the frontend deployment via shared DB reads.

```
┌─────────────────────┐         ┌─────────────────────┐
│   FRONTEND DEPLOY   │         │   ADMIN DEPLOY      │
│   (Public Site)     │         │   (Admin Panel)     │
│                     │         │                     │
│  app/(site)/ pages  │         │  app/admin/ pages   │
│  Public API routes  │         │  Admin API routes   │
│  Email form routes  │         │  Email queue admin  │
│  Sara chatbot       │         │  Upload management  │
│  Visitor tracking   │         │  Settings editor    │
└─────────┬───────────┘         └─────────┬───────────┘
          │                               │
          └───────────┬───────────────────┘
                      │
              ┌───────▼───────┐
              │   MongoDB     │
              │  (Shared DB)  │
              └───────────────┘
```

---

## 2. Frontend Deployment — What It Has

### Pages (30+ routes in `app/(site)/`)
| Page | Route | Status |
|------|-------|--------|
| Home | `/` | ✅ Working |
| About | `/about` | ✅ Working (reads `/api/content` + `/api/admin/partners`) |
| Team | `/team` | ✅ Working (reads `/api/content` + `/api/admin/partners`) |
| Products (5) | `/products/*` | ✅ Working |
| Services (6) | `/services/*` | ✅ Working |
| Cloud (4) | `/cloud/*` | ✅ Working |
| Modules | `/modules` | ✅ Working |
| Addons | `/addons` | ✅ Working (static data) |
| Careers | `/careers` | ⚠️ Reads from `/api/admin/careers` |
| Contact | `/contact` | ✅ Working |
| Demo | `/demo` | ✅ Working |
| News | `/news` | ✅ Working |
| Search | `/search` | ✅ Working |
| Tutorials | `/tutorials` | ✅ Working |
| Learn Sara | `/learn-sara` | ✅ Working (local, no API) |
| Ask Sara | `/ask-sara` | ✅ Working |
| HRMS | `/hrms` | ✅ Working |
| Report Problem | `/report-problem` | ✅ Working |
| Legal pages (3) | `/terms`, `/privacy`, `/eula` | ✅ Working |

### Public API Routes (kept)
| Route | Methods | Purpose | Auth |
|-------|---------|---------|------|
| `/api/settings` | GET | Public site settings | None (public) |
| `/api/content` | GET | Page content sections | None (public) |
| `/api/modules` | GET | Tally modules catalog | None (public) |
| `/api/news` | GET | News listings | None (public) |
| `/api/tutorials` | GET | Learning content | None (public) |
| `/api/search` | GET | Site-wide search | None (public) |
| `/api/chat` | POST | Sara AI chatbot | None (public) |
| `/api/email/submit` | POST | Contact form submissions | Rate-limited |
| `/api/contact` | POST | Sidebar form submissions | Rate-limited |
| `/api/email/diagnostic` | GET | Email diagnostics | None |
| `/api/identify` | POST | Visitor tracking | Rate-limited |
| `/api/tss-renewal` | POST | TSS renewal forms | Rate-limited |
| `/api/problem-reports` | POST | Bug reports | Rate-limited |
| `/api/upload/chunk` | POST | Career resume upload | Rate-limited |
| `/api/careers/apply` | POST | Job applications | None |
| `/api/health` | GET | Health check | None |
| `/api/ai/strategic-insight` | POST | AI insights | None |

### New Public API Routes (created during isolation)
| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/reviews` | GET | Customer reviews (replaces admin route) |
| `/api/partners` | GET | Partner/team data (replaces admin route) |
| `/api/careers` | GET | Job listings (replaces admin route) |

### Admin Code (commented out, pending removal)
| Directory/File | Status | Notes |
|----------------|--------|-------|
| `app/admin/` | 🔒 Commented out | 19 files — admin pages, layout, sidebar |
| `app/api/admin/` | 🔒 Commented out | 19 route directories — all admin API endpoints |
| `lib/admin-auth.ts` | 🔒 Commented out | Auth library (token, session, validation) |
| `scripts/bootstrap.mjs` | 🔒 Commented out | DB seeding script |

### Write Methods Stripped from Public APIs
| Route | Removed | Kept |
|-------|---------|------|
| `/api/content` | POST | GET |
| `/api/modules` | POST, PUT, DELETE | GET |
| `/api/tutorials` | POST, PUT, DELETE | GET |

---

## 3. Admin Deployment — What It Needs

### Required Pages
| Page | Route | Purpose |
|------|-------|---------|
| Login | `/admin/login` | Admin authentication |
| Dashboard | `/admin` | System health, collection counts |
| Submissions | `/admin/submissions` | View/manage form submissions |
| Visitors | `/admin/visitors` | Visitor tracking data |
| Email Config | `/admin/email-config` | Email routing + send ledger |
| Problem Reports | `/admin/problem-reports` | Bug report management |
| TSS Renewals | `/admin/tss-renewals` | TSS renewal management |
| Careers | `/admin/careers` | Job listing CRUD |
| Career Responses | `/admin/careers/responses` | Job application viewer |
| Modules | `/admin/modules` | Module CRUD + image upload |
| Learning | `/admin/learning` | Tutorial CRUD |
| FAQ | `/admin/faq` | FAQ management |
| Reviews | `/admin/reviews` | Review management |
| News | `/admin/news` | News CRUD |
| Pages | `/admin/pages` | Page image management |
| Partners | `/admin/partners` | Partner/team image management |
| Settings | `/admin/settings` | Global settings editor |
| Palette | `/admin/palette` | Theme palette editor |

### Required API Routes
| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/admin/login` | POST | Authentication |
| `/api/admin/logout` | POST | Session clear |
| `/api/admin/session` | GET | Session check |
| `/api/admin/settings` | GET, POST | Settings CRUD |
| `/api/admin/stats` | GET | Dashboard stats |
| `/api/admin/submissions` | GET, DELETE | Submission management |
| `/api/admin/visitors` | GET | Visitor data |
| `/api/admin/careers` | GET, POST, DELETE | Job CRUD |
| `/api/admin/applications` | GET | Application management |
| `/api/admin/modules/reorder` | POST | Module reorder |
| `/api/admin/news` | GET, POST, PUT, DELETE | News CRUD |
| `/api/admin/partners` | GET, POST, PATCH, DELETE | Partner CRUD |
| `/api/admin/reviews` | GET, POST, PUT, PATCH, DELETE | Review CRUD |
| `/api/admin/theme` | POST | Theme updates |
| `/api/admin/upload` | POST | Legacy file upload |
| `/api/admin/upload/chunk` | POST | Chunked file upload |
| `/api/admin/email/queue` | GET | Send ledger stats |
| `/api/admin/email/process` | POST | Retry failed sends |
| `/api/admin/bootstrap` | GET | DB seeding |

### Required Libraries
| File | Purpose |
|------|---------|
| `lib/admin-auth.ts` | Auth (login, token, session, `isRequestAuthorized`) |
| `lib/mongodb-utils.ts` | All DB operations |
| `lib/chunkUpload.ts` | File upload assembly |
| `lib/email-queue.ts` | Email send + retry |
| `lib/email.ts` | Email config + templates |
| `lib/uploadClient.ts` | Client-side chunk upload |

### Optional: Keep Frontend Pages in Admin?
Currently **no** — admin deployment is admin-only. If you want to preview the site from admin, the frontend pages would need to be included.

---

## 4. Email API — Safety Analysis

### Email Triggers: Fully Independent of Admin Routes

All email sends happen through **public form endpoints** that call `sendEmailDirect()` directly:

```
User Form Submission
  → /api/email/submit  (or /api/contact, /api/tss-renewal, /api/problem-reports)
    → sendEmailDirect()  [lib/email-queue.ts]
      → resolveRecipients()  [lib/email.ts] — reads from MongoDB settings
      → sendInternalFormCopy()  [lib/email.ts] — sends via Resend SDK
    → Saved to email_queue collection (dedup by jobKey)
```

**No admin route dependency.** Email triggers work in both deployments.

### Email Retry Mechanism: Admin-Only

| Component | Location | Works in Frontend? |
|-----------|----------|-------------------|
| `POST /api/admin/email/process` | Admin API route | ❌ No (removed) |
| GitHub Actions workflow | `.github/workflows/email-retry.yml` | ❌ Will 404/401 |
| Admin "Retry Failed Sends" button | `app/admin/email-config/page.tsx` | ❌ No (removed) |

**Impact:** Emails that fail on first attempt (Resend outage, rate limit) stay `failed` in the ledger with no automatic retry in the frontend deployment. The admin deployment handles retries.

**Recommendation:** Delete `.github/workflows/email-retry.yml` from the frontend repo (it's useless without admin routes). Or keep it and accept it will log errors until the admin deployment is set up.

### Email Collections Written
| Collection | Written By | Read By |
|------------|-----------|---------|
| `email_queue` | `sendEmailDirect()` (both deployments) | Admin API (`/api/admin/email/*`) |
| `form_submissions` | Form endpoints (both deployments) | Admin API (`/api/admin/submissions`) |
| `settings` | Admin settings API | Public settings API + email config |

---

## 5. Auth Handling — What Requires Session/Admin Permission

### Currently Protected (with auth)
| Route | Auth Method | Notes |
|-------|------------|-------|
| `/api/admin/email/queue` | `isRequestAuthorized()` | Header, cookie, or session |
| `/api/admin/email/process` | `isRequestAuthorized()` | Header, cookie, or session |
| `/api/admin/login` | N/A (creates session) | Hardcoded credentials |
| `/api/admin/session` | Cookie check | Verifies `__admin_token` |
| `/api/admin/logout` | N/A (clears cookie) | — |

### Currently UNPROTECTED (no auth check!)
| Route | Risk | Notes |
|-------|------|-------|
| `/api/admin/settings` | 🔴 HIGH | Anyone can read/write all settings |
| `/api/admin/stats` | 🟡 MEDIUM | Exposes collection counts |
| `/api/admin/submissions` | 🔴 HIGH | Anyone can read/delete submissions |
| `/api/admin/careers` | 🔴 HIGH | Anyone can create/edit/delete jobs |
| `/api/admin/partners` | 🔴 HIGH | Anyone can create/edit/delete partners |
| `/api/admin/reviews` | 🔴 HIGH | Anyone can create/edit/delete reviews |
| `/api/admin/news` | 🔴 HIGH | Anyone can create/edit/delete news |
| `/api/admin/modules/reorder` | 🟡 MEDIUM | Anyone can reorder modules |
| `/api/admin/theme` | 🟡 MEDIUM | Anyone can change theme |
| `/api/admin/upload` | 🔴 HIGH | Anyone can upload files |
| `/api/admin/upload/chunk` | 🔴 HIGH | Anyone can chunk-upload files |
| `/api/admin/visitors` | 🟡 MEDIUM | Exposes visitor data |
| `/api/admin/applications` | 🔴 HIGH | Anyone can view applications |
| `/api/content` POST | 🔴 HIGH | Anyone can overwrite content (no auth) |

**Critical:** The public `/api/content` POST endpoint has NO authentication — anyone can overwrite any content section in MongoDB. This is a security vulnerability that should be fixed.

### Frontend Public Routes (intentionally no auth)
All `/api/*` non-admin routes are intentionally public — they serve the public website. They use rate limiting but not auth.

---

## 6. Differences Between Deployments

| Feature | Frontend | Admin |
|---------|----------|-------|
| Public pages | ✅ 30+ routes | ❌ None |
| Admin pages | 🔒 Commented out | ✅ 19 routes |
| Public API (GET) | ✅ All working | ✅ All working |
| Public API (write) | 🔒 POST/PUT/DELETE stripped | ✅ Full CRUD |
| Admin API | 🔒 Commented out | ✅ Full CRUD |
| Email form submission | ✅ Direct send | ✅ Direct send |
| Email retry | ❌ No mechanism | ✅ `/api/admin/email/process` |
| Auth system | 🔒 Commented out | ✅ Cookie-based |
| File upload (resume) | ✅ Public chunked upload | ✅ Admin chunked upload |
| Visitor tracking | ✅ `/api/identify` | ✅ `/api/admin/visitors` |
| Settings API | ✅ GET only | ✅ GET + POST |

---

## 7. What's Missing from Frontend Deployment

| Item | Impact | Fix |
|------|--------|-----|
| No admin panel | Expected | By design |
| No email retry mechanism | Failed sends stay `failed` | Admin deployment handles retries |
| No `/api/admin/*` routes | Expected | By design — public routes serve frontend |
| No `lib/admin-auth.ts` | Expected | By design — no auth needed on frontend |
| No `scripts/bootstrap.mjs` | Can't seed DB from frontend | Admin deployment seeds DB |

---

## 8. Deployment Checklist

### Frontend Deployment
- [x] Admin pages commented out
- [x] Admin API routes commented out
- [x] Admin auth library commented out
- [x] Public API write methods stripped (commented out)
- [x] New public routes created (`/api/reviews`, `/api/partners`, `/api/careers`)
- [x] Frontend components updated to use public routes
- [x] Email form endpoints untouched
- [x] Build passes
- [ ] Remove `app/admin/` directory (after confirmation)
- [ ] Remove `app/api/admin/` directory (after confirmation)
- [ ] Remove `lib/admin-auth.ts` (after confirmation)
- [ ] Delete `.github/workflows/email-retry.yml` (if present)

### Admin Deployment (separate repo)
- [ ] Remove `app/(site)/` directory (frontend pages)
- [ ] Remove `app/components/` (frontend components)
- [ ] Keep all `app/admin/` pages
- [ ] Keep all `app/api/admin/` routes
- [ ] Keep all `app/api/` public routes (admin may need to read them)
- [ ] Keep `lib/admin-auth.ts`
- [ ] Add auth to unprotected admin API routes (security fix)
- [ ] Set up `.github/workflows/email-retry.yml`
- [ ] Configure `ADMIN_ACCESS_KEY` env var
- [ ] Configure MongoDB connection string (same DB as frontend)
- [ ] Configure Resend API key
- [ ] Configure Vercel Blob token

---

*Last Updated: 2026-08-26*
