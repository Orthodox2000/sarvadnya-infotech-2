### Task 3: www → non-www canonicalization (middleware 301)

**Why:** GSC reports `www.sarvadnyainfotech.com` redirect/duplicate rows. `SITE_URL` is the bare domain `https://sarvadnyainfotech.com`. One host must win. Fixes the `http://www.` and `http://` "Page with redirect" rows and dedupes www vs apex.

**Decision (controller ruling, from pre-flight scan):** uses the **in-repo middleware route** (the plan's primary was a Vercel console setting, which cannot be executed in-repo — the middleware route is the executable equivalent).

**Files:**
- Modify: `middleware.ts`

**Current state of `middleware.ts`:** has CORS logic for `/api/*` only (origin allowlist `ALLOWED_ORIGINS`, `CORS_HEADERS`, `isLocalhost()`, `config.matcher = ['/api/:path*']`). All of that stays unchanged — you ADD a www→apex redirect branch and WIDEN the matcher.

**Implementation:**

- [ ] Step 1: Add a www→apex 301 branch at the TOP of `middleware()`:
```ts
// CHANGE: 2026-09-07 — canonicalize www → apex (SITE_URL is the bare domain) so Google indexes one host.
const CANONICAL_HOST = 'sarvadnyainfotech.com';
const WWW_HOST = 'www.sarvadnyainfotech.com';
```
In `middleware()`:
```ts
const { pathname, search } = request.nextUrl;
if (request.nextUrl.hostname === WWW_HOST && !pathname.startsWith('/api/')) {
  return NextResponse.redirect(new URL(pathname + search, `https://${CANONICAL_HOST}`), 301);
}
```
(`/api/*` is excluded so cross-origin CORS callers and same-origin fetches keep working; the origin allowlist already includes www.)

- [ ] Step 2: Widen `config.matcher` so the middleware also runs on all page routes (it does nothing for apex hosts beyond pass-through, so this is the mechanism that lets a www request for ANY page be redirected). Keep `/api/:path*`; add the Next.js-documented "everything except static" pattern:
```ts
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon\\.ico).*)',
  ],
};
```
The trailing `.*` handles non-API, non-`_next`, non-`favicon.ico` paths. Static assets (public images/videos) may incur a trivial pass-through edge run — acceptable.

- [ ] Step 3: Verify:
  - `npm run typecheck` — clean.
  - Reasoning check (no server needed): `middleware()` for a request with `request.nextUrl.hostname === 'www.sarvadnyainfotech.com'`, `pathname === '/modules'`, `search === ''` returns a `NextResponse.redirect` with status 301 and target `https://sarvadnyainfotech.com/modules`. For the apex host it falls through to the existing CORS branch unchanged. For `/api/x` on www host it falls through (no redirect) to CORS.
- [ ] Step 4: Commit (short lowercase subject, repo style).

**Do not** touch the CORS branch or any other logic. Add a `// CHANGE: 2026-09-07 — <reason>` comment referencing this change.