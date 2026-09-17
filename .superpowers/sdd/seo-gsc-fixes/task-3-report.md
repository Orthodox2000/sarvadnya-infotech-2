## Task 3 — www → apex canonicalization (middleware 301)

**Status:** DONE

### What was implemented

Added a www→non-www 301 redirect at the top of `middleware()` in `middleware.ts` and widened `config.matcher` to cover all page routes (not just `/api/*`).

**Exact changes (single file: `middleware.ts`):**

1. **Constants** (line 38-40): `CANONICAL_HOST = 'sarvadnyainfotech.com'` and `WWW_HOST = 'www.sarvadnyainfotech.com'` with `// CHANGE: 2026-09-07` comment.
2. **Redirect branch** (line 43-46): At the top of `middleware()`, before CORS logic — if hostname is `WWW_HOST` and pathname is not `/api/*`, return `NextResponse.redirect(...)` with status 301 to `https://sarvadnyainfotech.com`.
3. **Widened matcher** (line 65-69): Added `'/((?!_next/static|_next/image|favicon\\.ico).*)'` alongside existing `'/api/:path*'`.
4. **CORS branch**: Untouched — byte-identical to before.

### Logic trace

| Request | hostname | pathname | Branch taken |
|---------|----------|----------|-------------|
| `www.sarvadnyainfotech.com/modules` | `WWW_HOST` | `/modules` (not `/api/`) | **301 →** `https://sarvadnyainfotech.com/modules` |
| `www.sarvadnyainfotech.com/api/data` | `WWW_HOST` | `/api/data` | Falls through to CORS (excluded by `!pathname.startsWith('/api/')`) |
| `sarvadnyainfotech.com/about` | `CANONICAL_HOST` | `/about` | Falls through to CORS / pass-through |
| `sarvadnyainfotech.com/api/x` | `CANONICAL_HOST` | `/api/x` | Falls through to CORS branch unchanged |

### Tests & verification

- `npm run typecheck` (`tsc --noEmit`) — **clean, zero errors**.
- Manual reasoning trace confirms all 4 cases above behave correctly.

### Self-review findings

- No issues. The redirect branch is at the top of `middleware()` so it fires before CORS logic — correct for edge execution order.
- `/api/*` exclusion prevents redirect loops for cross-origin API callers that may send `Origin: www.sarvadnyainfotech.com`.
- Matcher pattern `'/((?!_next/static|_next/image|favicon\\.ico).*)'` follows Next.js documented pattern for static-asset exclusion.
- The existing CORS allowlist already includes `https://www.sarvadnyainfotech.com` (line 17), so same-origin `/api/*` calls from www are unaffected.

### Concerns

None.
