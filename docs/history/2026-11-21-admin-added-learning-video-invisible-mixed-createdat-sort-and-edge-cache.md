# 2026-11-21 — Admin-added learning video invisible: mixed `createdAt` sort + 1-hour edge cache

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"i also added a video thru admin about bank import tool but it doesn't appear on frontend."* |
| **Diagnosis (read-only, no writes)** | Queried the live `learning_content` collection through both local `.env` configs. The video **was** in the frontend's DB (`sarvadnya.zvdcpsj.mongodb.net`, db `test`), `_id 6b0162f40d5782aed9f14129`, created `2026-11-21T09:23:00.537Z`, title *"Automatic Entry through 'Bank Statement Import Tool' in Tally"*, `type:'video'`, `folder:'General'`. It was **not** in the admin repo's local/stale cluster (`ac-1nfykty-*.3frndqv` / `sarvadnya-infotech`) — so this was **not** the well-known two-cluster drift (§16 of the nested docs); the production admin and frontend do share the good cluster. |
| **Root cause 1 — BSON type ordering** | The new row's `createdAt` is an **ISO string**, while all six older rows hold a real **BSON Date**. MongoDB orders String **below** Date, so `find({}).sort({ createdAt: -1 })` returned the brand-new video **7th of 7** — *last*, not first. The frontend page renders in the order returned, so it looked absent. |
| **Root cause 2 — CDN cache** | `ff96b6e` (2026-11-20) added `PUBLIC_API_CACHE` (`s-maxage=3600`, `stale-while-revalidate=86400`) to `/api/tutorials` in **both** `app/api/tutorials/route.ts` and the `next.config.js` exact-path allowlist. Even after a sort fix the CDN would serve the pre-edit list for up to an hour. |
| **Fix 1 — sort** | `lib/mongodb-utils.ts` → `fetchTutorials()` no longer sorts in Mongo. It fetches all rows, normalises `createdAt` to an epoch number (handles `Date`, ISO string, missing/invalid → `0`) and sorts in JS **before** `serializeData()`. Newest-first now holds for either stored shape; no data migration. |
| **Fix 2 — cache** | `app/api/tutorials/route.ts` now returns `Cache-Control: no-store` (dropped the `PUBLIC_API_CACHE` import), and `/api/tutorials` was removed from the `next.config.js` allowlist so the global `/api/:path*` `no-store` rule wins. The feed has 7 rows — a fresh read per load is negligible. Add Learning content is now visible on the next page load. |
| **Not changed** | `app/(site)/tutorials/page.tsx` (only the earlier click-to-play work) and the nested admin repo (its `addTutorial()` already writes `createdAt: new Date()`; the string shape came from the deployed write path, and the frontend fix tolerates it). No DB write, no migration, no credentials changed. |
| **Verified** | Read-only live DB diagnostics confirmed the row's presence, its BSON `createdAt` type and its 7-of-7 position. Standing single-pass directive (root AGENTS §3): no build, dev server, typecheck or test suite run. |

---

## Same-day follow-up — cluster mapping refined (2026-11-21, later in session)

The table above says "the production admin and frontend do share the good cluster". That is true **only of the custom domain**; the bare Vercel aliases do not. Measured with fresh (`x-vercel-cache: MISS`, `Cache-Control: no-store`) GETs:

| Endpoint | `learning_content` rows | Bank video present? | Cluster |
| :--- | ---: | :--- | :--- |
| `https://www.sarvadnyainfotech.com/api/tutorials` **(the site the owner uses)** | 8 → 7 before this follow-up | ✅ yes (last, before the sort fix deployed) | root `.env` → `sarvadnya.zvdcpsj.mongodb.net` / `test` |
| `https://sarvadnya-infotech.vercel.app/api/tutorials` | 6 | ❌ | stale cluster |
| `https://advanced-sarvadnya.vercel.app/api/tutorials` | 6 | ❌ | stale cluster, same 6 `_id`s as above |

- The 6 base `_id`s are **identical** in both clusters; only the root `test` cluster held the bank video. The two `.env` files genuinely point at different Atlas projects (`sarvadnya.zvdcpsj.mongodb.net` / `test` vs `ac-1nfykty-*.3frndqv` / `sarvadnya-infotech`) — the well-known two-cluster drift **is** real, it just doesn't affect the custom domain.
- Committed `fetchTutorials()` has **no limit/filter**, so a 7-row cluster must return 7 rows. The aliases returning 6 is proof they read the other cluster, not a caching or sort artefact.
- **Practical rule:** write learning content to the **root `.env` cluster**. Calling `POST /api/tutorials` on the deployed admin alias writes to the stale 6-row cluster and will never appear on `www.sarvadnyainfotech.com`. This is why the second tutorial was inserted through a locally-started admin server with `MONGODB_URI` overridden to the root cluster — see [the MP4 follow-up](2026-11-21-learning-hub-local-mp4-tutorial-native-player.md).
