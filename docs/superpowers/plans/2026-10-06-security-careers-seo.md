# Security Hardening + Careers Admin Accounts + SEO — Implementation Plan (2026-10-06)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or superpowers:subagent-driven-development) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** (1) Close two unauthenticated admin PII endpoints live on the public site and give the nested admin deployment a working auth guard; (2) rebuild the `/careers` loading state so it shows proper content-shaped skeletons instead of a flash of light-blue boxes; (3) ship a career candidate Accounts management page in the nested admin panel (list/view/edit/delete + job visibility toggle); (4) add internal cross-linking between products/services/news/modules and run a technical SEO verification pass; (5) run the deferred news DB seed.

**Architecture:** The two stray routes (`app/api/admin/careers/users`, `app/api/admin/careers/[id]/visibility`) are deleted from the frontend repo and re-created inside `sarvadnya-advanced` behind a guard merged into the nested repo's **live** `middleware.ts` (Next 15 reads `middleware.ts`; both repos' `proxy.ts` is dormant — upgrading Next to activate it is forbidden, see AGENTS §10). The frontend additionally blocks `/admin` + `/api/admin` at middleware level as defense-in-depth (it has no admin surface at all). Nested admin deployment gets noindex three ways (robots.txt disallow-all, `X-Robots-Tag` header, root-layout `robots: {index:false}`). The Accounts page follows nested-admin conventions (no per-route auth — the middleware guard covers `/api/admin/*`; sidebar entry added). Careers skeleton fixes are verified with Puppeteer request-interception tests holding the two `/api/*` loading calls so the loading state is deterministic. SEO work is static internal-link assertions + live HTTPS/sitemap/canonical probes producing a findings report.

**Spec:** design approved in conversation (owner answered clarifying questions: news = run seed; admin page = career candidate accounts; SEO = option 3 internal linking + technical verification; admin deployment stays separate/unlinked/noindex; nothing pushed without go-ahead). No separate spec file — rulings made from the conversation are provisional per executing-plans.

## Global Constraints

- **NO PUSHES** to `origin` or `new-origin` without explicit owner go-ahead (commits only). Nested repo commits are local too.
- **Nested commits:** `git -C sarvadnya-advanced -c user.name="ankit-sarvadnya" -c user.email="ankit@tallycertified.com" commit -m "…"` (that repo has no configured identity).
- **Frontend commits:** repo has no configured identity either — use the same explicit `-c user.name="ankit-sarvadnya" -c user.email="ankit@tallycertified.com"` flags (matches recent history on both).
- `// CHANGE: 2026-10-06 — <reason>` inline comments on non-obvious edits (AGENTS: Document All Changes).
- Teal `#006569` brand; WhatsApp `#25D366` untouched; `green-*`/`emerald-*` stay retired; ASCII-only if the news seed file is touched.
- **Never run `npm run dev` and `npm run build` at the same time** (AGENTS §9). Dev servers spawned by tests must be killed before any build.
- **Local runs hit the PRODUCTION database.** Writes from test code: only clearly-marked test documents with guaranteed cleanup (try/finally); form endpoints gated by the IP ignore-list as usual.
- **Next stays 15.5.19.** `proxy.ts` is dormant by design; do not upgrade Next to "activate" it (AGENTS §10 landmine).
- Verify after every frontend task: `npm run typecheck` (exit 0), `npx tsc --noEmit --listFiles | grep -c sarvadnya-advanced` → 0, `npm run check:demo` → PASS.
- Verify after every nested task: nested typecheck passes; `git -C sarvadnya-advanced status --porcelain` shows only intended files.
- Mobile-first: any UI verified at 360px minimum.

## Review Focus

- Auth guard must not break nested admin login (`POST /api/admin/login` must pass without a session cookie) or the existing CORS middleware.
- No test may leave documents in production collections; no push; no Next upgrade.
- Frontend middleware admin-block must not match legit routes (e.g. `/administrator` false positives — segment-exact check).
- Skeleton test must assert deterministic loading state via request interception, not timing sleeps.

---

### Task 1: Frontend security — delete stray admin routes, block admin paths in middleware, fix `/api/careers/list` leak

**Files:** `app/api/admin/careers/users/route.ts` (delete), `app/api/admin/careers/[id]/visibility/route.ts` (delete), `middleware.ts` (add admin block), `app/api/careers/list/route.ts` (filter hidden), `scripts/frontend-admin-surface-test.mjs` (new), `scripts/security-audit.mjs` (honest checks — replace dormant-proxy.ts claims with middleware checks), `AGENTS.md` (note the removal).

- [ ] **RED:** create `scripts/frontend-admin-surface-test.mjs` asserting: (a) no `app/api/admin/**` route files exist; (b) `middleware.ts` source contains a segment-exact admin block for `/admin` and `/api/admin`; (c) `app/api/careers/list/route.ts` filters `visible: { $ne: false }`. Run it → **fails** (routes exist, no block, no filter).
- [ ] Confirm no callers of the two routes (done earlier: zero grep hits) and no frontend UI calls `/api/careers/list` (careers client fetches `/api/careers/visible` only).
- [ ] Delete both stray admin route files (whole `app/api/admin/` tree if empty after).
- [ ] Add middleware block before CORS logic: `pathname === '/admin' || pathname.startsWith('/admin/') || pathname === '/api/admin' || pathname.startsWith('/api/admin/')` → `404` JSON for API paths, `404` response for pages (frontend has no admin surface — do not reveal). CHANGE comment.
- [ ] Fix `/api/careers/list`: add `visible: { $ne: false }` to the query (keep the seed-if-empty behavior). CHANGE comment.
- [ ] Update `scripts/security-audit.mjs` "Middleware & Auth" section: it currently checks `proxy.ts` contents and passes while the file is dormant — change to check `middleware.ts` contains the admin block; keep proxy.ts checks as warnings labeled dormant.
- [ ] **GREEN:** `node scripts/frontend-admin-surface-test.mjs` → all pass. Gates: `npm run typecheck` → 0, `npx tsc --noEmit --listFiles | grep -c sarvadnya-advanced` → 0, `npm run check:demo` → PASS, `node scripts/security-audit.mjs` → no new failures.
- [ ] Runtime probe: start `npm run dev` (background), `curl -s -o /dev/null -w "%{http_code}" localhost:3000/api/admin/careers/users` → **404** (was 200), same for the visibility PATCH → 404, `curl localhost:3000/api/careers/list` → only visible jobs (no `"visible":false` entries). Kill the dev server.
- [ ] `AGENTS.md`: short CHANGE note that the two stray routes were removed from the frontend (they belong to the nested admin repo).
- [ ] **Commit** frontend: `security: remove unauthenticated admin careers routes, block /admin at middleware, filter hidden jobs from /api/careers/list`

**Expected:** frontend test script exits 0 with all assertions green; prod-equivalent local probe shows 404 for both admin paths and no hidden jobs in `/api/careers/list`; typecheck 0; `check:demo` PASS.

---

### Task 2: Nested admin guard — merge `proxy.ts` into live `middleware.ts` + noindex the admin deployment

**Files:** `sarvadnya-advanced/middleware.ts` (merge guard + CORS), `sarvadnya-advanced/proxy.ts` (delete after merge), `sarvadnya-advanced/app/robots.ts` (disallow all), `sarvadnya-advanced/app/layout.tsx` (root noindex metadata), `sarvadnya-advanced/scripts/admin-guard-test.mjs` (new), `sarvadnya-advanced/AGENTS.md`/isolation doc note.

- [ ] Read nested repo's own `AGENTS.md` + `GEMINI.md` (AGENTS §10 rule 1) before editing.
- [ ] Re-read both `sarvadnya-advanced/middleware.ts` (CORS-only) and `sarvadnya-advanced/proxy.ts` (guard: `isAdminRequest` header/cookie + `verifyAdminToken` HMAC-ish token, rate limit, security headers, content-type validation) and the nested login flow (`/api/admin/login` sets `__admin_token` cookie via `lib/admin-auth.ts`).
- [ ] **RED:** create `sarvadnya-advanced/scripts/admin-guard-test.mjs` — behavioral unit tests importing `../middleware.ts` (Node 24 native TS stripping; fallback if `next/server` import fails: spawn nested dev server + curl). Cases: (1) `GET /api/admin/careers/users` no creds → **401**; (2) same with `x-admin-key: <ADMIN_ACCESS_KEY from .env>` → passes (NextResponse.next); (3) valid `__admin_token` cookie → passes; (4) `POST /api/admin/login` without creds → **passes** (login must not be blocked); (5) allowed-origin `OPTIONS /api/careers/contact` → 204 with `Access-Control-Allow-Origin` (CORS preserved); (6) non-admin `GET /api/contact` → passes with CORS headers. Run → **fails** (guard missing).
- [ ] Merge: port `isAdminRequest`/`verifyAdminToken`/rate-limit/content-type/security-headers logic from `proxy.ts` into `middleware.ts`, running **admin guard first** (401 on API, allow pages to pass — nested admin layout handles page session redirects client-side), then existing CORS logic. Preserve: login passthrough, `x-admin-key`/`admin_key`/`__admin_token` accepts, 60/min rate limit for non-admin APIs, `Content-Type` check on POST/PUT/PATCH.
- [ ] Extend matcher to `['/admin/:path*', '/api/admin/:path*', '/api/:path*']` (proxy.ts matcher).
- [ ] **Ruling:** keep proxy.ts's fail-open when `ADMIN_ACCESS_KEY` unset? Decide after checking deployment reality — nested `.env` has the key; prefer **fail-closed** for `/api/admin/*` if login uses the same env (it does: `createToken()` returns '' without it, so login already can't work without the key → fail-closed cannot lock out a working setup). Record ruling in ledger. Apply fail-closed.
- [ ] Delete `sarvadnya-advanced/proxy.ts` after merge (Next 15 ignores it; leaving both files confuses the Next 16 migration). Update nested AGENTS doc.
- [ ] **Noindex (3 layers):** `app/robots.ts` → `{rules: {userAgent:'*', disallow:'/'}}`, drop sitemap line; `middleware.ts` adds `X-Robots-Tag: noindex, nofollow` to every response; `app/layout.tsx` metadata → `robots: { index: false, follow: false }` (check layout is a server component with existing metadata first). Replace `app/sitemap.ts` with an empty array if trivially safe (or leave + robots disallow-all; note ruling).
- [ ] **GREEN:** `node scripts/admin-guard-test.mjs` (from `sarvadnya-advanced/`) → all pass. Nested typecheck (find its script: `npm run typecheck` or `npx tsc --noEmit`) → 0 errors.
- [ ] Runtime confirmation (if unit-test path used): spawn `npm run dev -w nested` on a free port, curl `/api/admin/prices` → 401 bare / 200 with header, `curl -I` any path shows `X-Robots-Tag`. Kill server.
- [ ] **Commit nested** with explicit identity: `security: merge proxy.ts admin guard into live middleware, noindex admin deployment`

**Expected:** guard test 6/6 green; login flow unaffected; CORS headers still present on non-admin API responses; nested typecheck 0; `proxy.ts` gone from nested; three noindex layers in place.

---

### Task 3: `/careers` loading state — reproduce the flash, rebuild content-shaped skeletons

**Files:** `app/(site)/careers/careers-client.tsx` (skeleton blocks ~L206-254 + `mounted` opacity gating), `app/components/careers/AuthForms.tsx` + `OpeningRow.tsx` (shapes to mirror), `scripts/careers-loading-test.mjs` (new, committed).

- [x] Read `systematic-debugging` skill. Reproduce first: Puppeteer with request interception **holding** `/api/auth/careers/me` and `/api/careers/visible` until released; capture frames + screenshots at 360/768/1440; identify exactly what "flashes light blue boxes" is (`bg-slate-100` #f1f5f9 auth bars? unstyled pre-hydration paint? opacity-gate fade?). Record root cause in ledger with evidence before fixing.
- [x] **RED:** `scripts/careers-loading-test.mjs` asserts while calls are held: (a) skeleton elements present with `aria-busy`; (b) openings placeholders are **row-shaped** (≥3 child placeholders per row, heights within ~20px of final `OpeningRow` measured after release); (c) auth card placeholders shaped like the form (title + 2 field-height boxes + button-height box); (d) after release, final content row heights ≈ skeleton heights (no big layout jump). Run → **fails** on current code.
- [x] Fix: rebuild both skeletons to mirror final layout dims using brand-neutral tint (teal-family light `#E5F4F4`/`#F1F5F9` decision after repro screenshots — owner dislikes "light blue boxes"), remove/reduce the `mounted` opacity flash if repro shows it as the cause, keep visibility-aware pause + reduced-motion behavior intact.
- [x] **GREEN:** loading test passes at 360/768/1440; screenshots saved for owner review; normal (unthrottled) load shows no flash (manual Puppeteer frame sweep).
- [x] Gates: `npm run typecheck`, `npm run check:demo`, 360px no horizontal overflow, hydration errors = 0.
- [x] **Commit:** `fix: careers page content-shaped loading skeletons (no light-blue flash)`

**Expected:** deterministic test holds the API calls and shows proper shaped skeletons; released swap has no layout jump; zero hydration errors.

---

### Task 4: Nested admin — career candidate Accounts (APIs + page + visibility toggle)

**Files:** `sarvadnya-advanced/app/api/admin/careers/users/route.ts` (GET list, ported+extended with search), `…/users/[id]/route.ts` (GET detail, PATCH edit, DELETE), `…/[id]/visibility/route.ts` (PATCH, ported), `sarvadnya-advanced/app/admin/accounts/page.tsx` (new), `app/admin/careers/*` (add visibility toggle UI), `app/admin/AdminSidebar.tsx` (Accounts entry), ported `lib` helpers as needed (careers-users collection access — find collection name in frontend `lib/careers-auth.ts` first), `sarvadnya-advanced/scripts/accounts-admin-test.mjs` (new).

- [ ] Read nested `AGENTS.md`/`GEMINI.md` conventions; inspect an existing admin page (e.g. `app/admin/payments/page.tsx`) for table/edit-modal patterns; inspect frontend `lib/careers-auth.ts` for the users collection name + `sessions` collection (delete account must also drop its sessions).
- [ ] **RED:** `sarvadnya-advanced/scripts/accounts-admin-test.mjs` — spawns nested dev server (free port), then: `GET users` bare → 401 (guard), with `x-admin-key` → 200 array; **CRUD cycle with a marked test doc** (`email: "__e2e_test__@example.com"`, fullName `E2E Test Account`) created via direct DB insert in the test, then PATCH name/phone → 200 + verified in DB, PATCH invalid ObjectId → 400/404 (not 200), DELETE → 200, verify gone, finally-cleanup removes any residue even on failure; visibility: create test job doc, PATCH visibility false → hidden from `/api/careers/list`, true → visible, delete test job. Run → **fails** (routes don't exist).
- [ ] Implement APIs: GET list (plain array like the ported one, optional `q` search on name/email), GET/PATCH/DELETE by id (PATCH editable: `fullName`, `phone`, `email` — validate shape; email is login identity, validate non-empty/unique-lite), DELETE removes account doc + its session docs; resume blob deletion best-effort (skip silently if it fails). No per-route auth calls (nested convention — middleware guard covers it). CHANGE comments.
- [ ] Port visibility route (same path/semantics as frontend one removed in Task 1).
- [ ] **Accounts page** `/admin/accounts` matching nested admin styling: searchable table (name, email, phone, resume link, created), row click → detail/edit panel (fullName, phone, email save), delete with typed-confirm, resume opens in new tab. Sidebar entry "Accounts" (check icon import pattern). Noindex metadata inherited from Task 2 root layout.
- [ ] **Visibility toggle UI** on the nested careers admin page: a toggle button per job calling PATCH visibility; optimistic or refetch pattern consistent with existing pages.
- [ ] **GREEN:** `node scripts/accounts-admin-test.mjs` → all pass; nested typecheck → 0; page renders at 360px (Puppeteer screenshot) with sidebar entry present; **`git -C sarvadnya-advanced status --porcelain`** shows only intended files.
- [ ] **Commit nested** (explicit identity): `feat: career candidate accounts admin (list/edit/delete) + job visibility toggle`

**Expected:** test doc CRUD cycle verified and cleaned (final DB has no `__e2e_test__` docs — assert in test teardown); 401 on bare admin calls proves Task 2 guard covers new routes; Accounts page + sidebar + toggle live.

---

### Task 5: SEO — internal cross-linking + technical verification report

**Files:** `app/(site)/products/silver/page.tsx`, `gold`, `tallydrive`, `services/tss` (+ possibly modules/careers), `scripts/seo-links-test.mjs` (new), findings in final report.

- [ ] Read `seo-audit` skill. Inventory: which priced/service pages lack links to `/news` articles and to each other; confirm existing cross-links (ProductBar deep links, news related-posts, FAQ).
- [ ] Add a compact "Related reading" / context strip to `/products/silver`, `/products/gold`, `/products/tallydrive`, `/services/tss`: 2-3 links to **currently-live** news articles (DB-driven via `getNews()` filtered by keywords, or curated hrefs to live slugs — choose after checking page is a server component and how news is fetched; if client component, curated static hrefs to confirmed-live slugs). Include link to `/news` hub. Also ensure `/news` hub links back to product/service hubs (check article CTA — likely already does).
- [ ] **Test:** `scripts/seo-links-test.mjs` — static assertions: each target page source contains ≥1 `/news` href and ≥1 cross-link to another commercial page; all referenced slugs exist in `scripts/seed_news.mjs` data (or DB); no `http://` internal hrefs anywhere in `app/`.
- [ ] **Technical verification (live probes + static checks):** HTTPS 308/307 + HSTS (re-run curls), sitemap 200 + sample URL 200s, canonical present on homepage/product/news samples, robots.txt contents, JSON-LD inventory (Organization/LocalBusiness/FAQ/NewsArticle), title/description uniqueness scan across key pages, `X-Robots-Tag` absent on frontend (belongs to nested only).
- [ ] Run `npm run typecheck` + `npm run check:demo`.
- [ ] **Commit:** `feat: internal cross-links between products/services/news + SEO verification script`

**Expected:** test script green; findings report (what passed, what fixed, what needs post-deploy live re-check since changes aren't deployed yet) prepared for final message.

---

### Task 6: News seed + final validation

**Files:** `scripts/seed_news.mjs` (run, not edit), `scripts/news-seed-verify.mjs` (new, small).

- [ ] Check Mongo reachability (5s connect with `MONGODB_URI` from `.env`). If unreachable → **report honestly, do not fake**; leave task open in ledger with reason (owner may be off-VPN).
- [ ] Run `node scripts/seed_news.mjs`; capture output.
- [ ] Verify: `node scripts/news-seed-verify.mjs` asserts `tallyprime-international-licenses` slug exists in the `news` collection and total count ≥ 19 (read-only query).
- [ ] Live probe: `curl https://sarvadnyainfotech.com/news` contains the slug (site is force-dynamic → no deploy needed for DB-only changes).
- [ ] **Final gates (all):** frontend `npm run typecheck` + `npx tsc --noEmit --listFiles | grep -c sarvadnya-advanced` → 0 + `npm run check:demo` + `npm run test:cart` + `npm run test:order-status` + `npm run test:sara-local` + `node scripts/security-audit.mjs`; nested typecheck; both working trees show only intended changes; `git status` clean of debris (probe scripts go to `/tmp/opencode/`).
- [ ] **Final commit** if seed added a verify script.
- [ ] **STOP — do not push.** Ask owner: push both remotes? push nested? (Production probes of Task 1/2 fixes only go green after deploy.)

**Expected:** seed output confirms upsert of the international-licenses post; live /news shows it; all gates green; zero uncommitted unintended files; no pushes made.
