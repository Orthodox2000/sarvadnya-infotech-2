# 2026-11-25 — Batched `/api/identify` beacons: fewer Fluid invocations, identical visitor totals

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)
>
> Operational context: [docs/HIGH-TRAFFIC-CPU-RUNBOOK.md](../HIGH-TRAFFIC-CPU-RUNBOOK.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner confirmed `VISITOR_ENRICHMENT=0` was added in Vercel and asked for the batched beacon implementation described in the previous analysis, plus documentation and a push to `origin`. |
| **Cause** | `VisitorProvider` sent one POST to `/api/identify` per path (10 s throttle). It was the largest Fluid Active CPU bucket in the 7-day report: 37 invocations / 7 s (~189 ms each). Each call paid a Mongo upsert even when several paths arrived in quick succession. |
| **Client change** | `app/components/VisitorProvider.tsx` now buffers `{path, at}` pairs and sends **one** POST per 30 s window (or at 30 buffered paths), with a `pagehide` / hidden-tab `keepalive` flush. The old hidden-tab "park one path" logic is gone; background-tab visits stay in the same buffer. UTM, referrer, title, screen and section-view capture are unchanged. |
| **Server change** | `lib/visitors.ts` — `TrackPayload.paths?` is sanitized (30 items max, 500-char paths, client timestamps clamped to the last 30 days / +60 s). `recordVisitor()` performs **one** upsert: `$inc: { visitCount: N, pageViews: N }`, `$push: { paths: { $each: paths, $slice: -30 } }`, `entryPath` from the first path and `lastPath` from the last. The single `path` field is still accepted, so old clients and any direct callers keep working. |
| **What stays identical** | Visitor count, `pageViews`, `visitCount`, path list (max 30), UTM attribution, bot/ignored-IP/rate-limit guards, and the `VISITOR_ENABLED` / `VISITOR_ENRICHMENT` kill-switches. Totals match the old per-path behaviour because the counters increment by the batch size. |
| **What changes** | `/api/identify` invocation count falls in proportion to batching (a 5-page visit in one window becomes 1 call instead of up to 5). Per-path timestamps now come from the client clock, clamped server-side. Ledger freshness moves from ~10 s to ~30 s or tab close. A abrupt tab kill before flush can lose the last buffered paths; `keepalive` covers normal close/navigation. |
| **Not changed** | `VISITOR_ENRICHMENT` was already set by the owner; the env var was not read or modified. No Vercel config, plan, crawler rules or other routes were touched. |
| **Verification** | None run (single-pass directive in `AGENTS.md` §3; owner did not ask for build/lint/tests). Manual review only. Confirm in the Vercel path table after deploy that `/api/identify` invocations drop while the visitor ledger still shows the expected ~70 visitors. |
