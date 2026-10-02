# Nested Admin Repo — `sarvadnya-advanced/`

> Created: 2026-10-02
> Purpose: explain the admin deployment that now lives inside this repo's working
> directory, why it is gitignored rather than a submodule, and the rules for editing it.

---

## 1. What it is

`advanced-sarvadnya` is **not a separate application**. It is a **fork of this repository**.

```
sarvadnya-infotech  (THIS repo — the public site)
  origin: Orthodox2000/sarvadnya-infotech.git
  app/(site)/      41 pages        PUBLIC SITE — deployed to Vercel
  app/api/         public routes
  app/admin/       ABSENT          physically removed; 0 files tracked in git
  lib/admin-auth.ts ABSENT         removed with the panel

sarvadnya-advanced/  (nested here — the admin panel)
  origin: ankit-sarvadnya/advanced-sarvadnya.git
  app/admin/       18 pages         LIVE admin panel
  app/api/admin/   21 routes        LIVE admin API
  proxy.ts         admin route guard (/admin + /api/admin)
  lib/admin-auth.ts                auth: hardcoded creds + ADMIN_ACCESS_KEY
  .github/workflows/email-retry.yml  the email-retry drain
  app/(site)/      40 pages         present but unused by the panel
```

Page counts are `page.tsx` files. Counting `*.tsx` overstates them: `app/admin/` is 20 `.tsx`
(18 pages + `layout.tsx` + `AdminSidebar.tsx`), and this repo's `app/(site)/` is 77 `.tsx` across
41 pages and 36 nested `layout.tsx` files. The nested repo has exactly one fewer site page than
this one — `app/(site)/news/[slug]/page.tsx`.

### ⚠️ `proxy.ts` exists in BOTH repos — and this one is a dormant admin guard

`proxy.ts` in this repo is **byte-identical** to the nested repo's (`md5 11cfb425…`): a full
admin guard with `x-admin-key` / `admin_key` / `__admin_token` checks and
`pathname.startsWith('/admin') || pathname.startsWith('/api/admin')`.

It is **inert today** and that is not an accident. Next.js 15.5.19 — the version
`package-lock.json` pins and Vercel installs — defines only `MIDDLEWARE_FILENAME`
(166 references, re-verified 2026-10-02); there is no `PROXY_FILENAME` (0 references), so
`proxy.ts` is not a file Next 15 recognises at all. An earlier version of this doc said
15.5.26, which came from reading a `node_modules` that had drifted ahead of the lockfile. The file that actually runs is `middleware.ts`, which is the legacy
WordPress-redirect + CORS layer and contains **no admin logic**.

**`proxy.ts` is the Next.js 16 name for `middleware.ts`.** Upgrading to Next 16 therefore
activates this dormant admin guard in the *public frontend* deployment — in a repo whose
admin panel has been deliberately removed. If a Next 16 upgrade is ever planned, delete
this repo's `proxy.ts` (or re-scope it) first, and confirm the build still emits
`ƒ Middleware` as expected.

Both `.env` files point at the **same MongoDB**. That is the intended architecture:
**one database, two deployments — the admin panel writes, the public site reads.**
A content edit made in the admin panel appears on the public site immediately, with no
deploy in between.

Authority for this split, on both sides:
- `docs/ADMIN-VS-FRONTEND-ISOLATION.md` (this repo)
- `sarvadnya-advanced/ADMIN-ISOLATION.md` (nested repo)

## 2. Why it is gitignored, not a submodule

`/sarvadnya-advanced/` is in this repo's `.gitignore`.

A **submodule** would make this repo hold a *gitlink* — a mode-`160000` entry pointing
at a commit in the admin fork's history. A stray `git add -A` without the ignore rule
would record exactly that, publishing a reference to an **admin deployment into the
public frontend repo's tree**. A gitignore makes the nested repo completely invisible
here: separate repo, separate origin, separate history, zero coupling.

`sarvadnya-advanced/` has its own `.git/`, its own `origin`, and its own `.gitignore`
(which keeps its `.env*`, `node_modules`, `.next`, `.gemini/`, `.vscode/` and
`certificates` out of *its* history). Those never leak here either, because the
folder-level ignore covers the whole subtree.

Verify at any time:

```bash
git check-ignore -v sarvadnya-advanced          # -> .gitignore:NN:/sarvadnya-advanced/
git status --porcelain | grep -c sarvadnya-advanced   # -> 0
git log --all --oneline -- sarvadnya-advanced        # -> empty
```

## 3. Why `tsconfig.json` excludes it — the `@/` alias trap

`tsconfig.json` lists `sarvadnya-advanced` in `exclude`, alongside the existing
`cpanel-landing` entry. This is **not** cosmetic. Measured on 2026-10-02, without it:

| Metric | Without `exclude` | With `exclude` |
| :-- | --: | --: |
| Files in `tsc` program | 1003 | 836 |
| Files from the nested repo | **167** | **0** |
| `error TS` reported | **10** (all foreign, 0 in this repo) | **0** |

(1003 − 167 = 836 — the program shrank by exactly the nested tree.)

`include` is `["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts",
".next/dev/types/**/*.ts", "**/*.mts"]` — recursive from this repo's root — so a nested
`.tsx` anywhere below it is pulled into this repo's typecheck.

The dangerous part is not the error count, it is the resolution. This repo's
`compilerOptions.paths` is:

```jsonc
"paths": { "@/*": ["./*"] }
```

`./*` is relative to **this** repo's root. So when a nested admin route does
`import { x } from '@/lib/admin-auth'`, TypeScript resolves `@/` against **this**
repo — where `lib/admin-auth.ts` **does not exist**, because it was deliberately deleted
along with the admin panel. Observed errors included:

```
sarvadnya-advanced/app/api/admin/login/route.ts(2,68):
  error TS2307: Cannot find module '@/lib/admin-auth'
sarvadnya-advanced/app/admin/email-config/page.tsx(4,53):
  error TS2305: Module '"@/lib/form-destinations"' has no exported member 'KNOWN_DESTINATION_KEYS'
```

That second one is the real trap. The obvious way to "fix" it is to **add
`KNOWN_DESTINATION_KEYS` to this repo's `lib/form-destinations.ts`** — which would
corrupt the public frontend deployment, on the frontend's live `EMAIL_DESTINATION_RECIPIENTS`
routing, to satisfy an admin build this repo does not own. The `exclude` entry is what
stops that from ever being tempting.

## 4. Rules for editing the nested repo

1. **It has its own instructions.** `sarvadnya-advanced/AGENTS.md` (17 KB) and
   `sarvadnya-advanced/GEMINI.md` (151 KB) govern work done there. They are not the
   same documents as this repo's `AGENTS.md`, and they describe a different deployment.
   Read the nested one before editing nested code.
2. **Commits belong to the nested repo.** Anything under `sarvadnya-advanced/` is
   committed in *its* git repo, on *its* branch. It can never appear in a commit here.
   **The nested repo has NO configured git identity** — `user.name` and `user.email` are both
   unset and there is no global config, so a plain `git commit` there fails with
   `Author identity unknown`. Pass it explicitly rather than writing config:
   ```bash
   git -C sarvadnya-advanced -c user.name="ankit-sarvadnya" \
                               -c user.email="ankit@tallycertified.com" commit -m "..."
   ```
   (`ankit-sarvadnya <ankit@tallycertified.com>` is that repo's most recent commit author.)
3. **Never push either repo without being asked.** Nesting does not authorise a push.
4. **The forks have already drifted** — this repo is `1.1.390`, the nested one `1.1.389`.
   A change to shared code (`lib/email.ts`, `lib/mongodb.ts`, `lib/visitors.ts`,
   `app/(site)/`, `next.config.js`) exists in only one repo until it is **ported by hand**.
   Check which side you are on before assuming a fix is present.
5. **`app/(site)/` and `app/components/` were deliberately left in the nested repo.**
   `docs/ADMIN-VS-FRONTEND-ISOLATION.md` §8 lists removing them as an open checklist
   item. It is unstarted: some admin screens may import those components, so deletion
   needs its own build verification rather than an assumption.
6. **Known bloat** (not addressed): the nested repo tracks a 75 MB `public/` (incl. an
   11 MB `.mp4`) and 16 MB of `snapshots/`. It also has no `.gitattributes` and
   `core.autocrlf` unset, which is why its working tree drifted to CRLF wholesale.

## 5. Verify after any change here

```bash
# the nested repo must be invisible to this one
git check-ignore -v sarvadnya-advanced
git status --porcelain | grep -c sarvadnya-advanced     # 0

# the nested repo must be healthy on its own
git -C sarvadnya-advanced status --porcelain            # empty
git -C sarvadnya-advanced remote get-url origin

# this repo's typecheck must not see the nested repo
npm run typecheck                                        # exit 0
npx tsc --noEmit --listFiles | grep -c 'sarvadnya-advanced'   # 0
```

---

*Last Updated: 2026-10-02*