# Admin Isolation — Frontend Deployment

> Created: 2026-08-26

## What Changed

This is the **frontend-only** deployment. Admin panel code has been isolated.

### Renamed to `.bak` (preserved, not deleted)
| Original Path | Renamed To | Purpose |
|---------------|-----------|---------|
| `app/admin/` | `app/admin.bak/` | 19 admin pages + layout + sidebar |
| `app/api/admin/` | `app/api/admin.bak/` | 19 admin API route directories |
| `lib/admin-auth.ts` | `lib/admin-auth.ts.bak` | Auth library (token, session, validation) |
| `scripts/bootstrap.mjs` | `scripts/bootstrap.mjs.bak` | DB seeding script |

### Created (new public routes)
| File | Purpose |
|------|---------|
| `app/api/reviews/route.ts` | GET-only reviews (replaces admin route) |
| `app/api/partners/route.ts` | GET-only partners (replaces admin route) |
| `app/api/careers/route.ts` | GET-only careers (replaces admin route) |

### Modified (frontend components updated)
| File | Change |
|------|--------|
| `app/components/CustomerReviews.tsx` | `/api/admin/reviews` → `/api/reviews` |
| `app/(site)/about/page.tsx` | `/api/admin/partners?type=about` → `/api/partners?type=about` |
| `app/(site)/team/page.tsx` | `/api/admin/partners?type=team` → `/api/partners?type=team` |
| `app/(site)/careers/page.tsx` | `/api/admin/careers` → `/api/careers` |

### Write Methods Stripped (commented out)
| Route | Removed |
|-------|---------|
| `app/api/content/route.ts` | POST (unauthenticated write — security improvement) |
| `app/api/modules/route.ts` | POST, PUT, DELETE |
| `app/api/tutorials/route.ts` | POST, PUT, DELETE |

### Untouched (email APIs safe)
- `app/api/email/submit/route.ts` — form submission email trigger ✅
- `app/api/contact/route.ts` — sidebar form email trigger ✅
- `app/api/tss-renewal/route.ts` — TSS form email trigger ✅
- `app/api/problem-reports/route.ts` — bug report email trigger ✅
- `lib/email-queue.ts` — `sendEmailDirect()` ✅
- `lib/email.ts` — email config + templates ✅

## To Restore Admin Panel

```powershell
# Restore admin directories
Rename-Item -LiteralPath "app\admin.bak" -NewName "admin"
Rename-Item -LiteralPath "app\api\admin.bak" -NewName "admin"
Rename-Item -LiteralPath "lib\admin-auth.ts.bak" -NewName "admin-auth.ts"
Rename-Item -LiteralPath "scripts\bootstrap.mjs.bak" -NewName "bootstrap.mjs"
```

## Documentation

See `docs/ADMIN-VS-FRONTEND-ISOLATION.md` for full details on:
- Admin panel requirements
- Email API safety analysis
- Auth handling
- Deployment checklist
