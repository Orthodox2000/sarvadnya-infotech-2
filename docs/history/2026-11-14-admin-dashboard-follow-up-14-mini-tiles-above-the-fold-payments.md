# 2026-11-14 — Admin dashboard follow-up: 14 mini tiles above the fold, payments & careers moved to the bottom

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask (follow-up to the entry above)** | Owner: *"also lot of important info is in below scroll, i dontt want payment or candidate on top, else ensure all stats are smaller on top without scroll on desktop."* |
| **What was still wrong** | The six-tile KPI row was denser but still dropped half the stats below the fold, and the row was led by **Revenue / Orders today** — i.e. payment numbers sat in the first thing an operator sees. Careers numbers (job applications, candidate accounts) were in the bottom card, but the recent-activity order still put **orders above leads**. |
| **Headline row rebuilt (`sarvadnya-advanced/app/admin/page.tsx`)** | `StatCard` (icon + value + label + hint) replaced by **`StatTile`** — value + label only, no icon, no hint — in `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7`, so **14 tiles render as two rows on a desktop**. The 14 are all non-financial: Leads 24h · Leads 7d · Submissions · Bug reports 24h · Bug reports · TSS pending · TSS renewals · Visitors 24h · Unique visitors · Chats 24h · Transcripts · Drafts 24h · Form drafts · FAQ entries. |
| **Payments & careers removed from the top** | Orders total · Awaiting payment · Paid orders · Revenue collected · Job applications · Candidate accounts no longer appear in the headline grid. They live in a single bottom card retitled **"Payments & careers"** (was "All totals"), `MiniStat` label · value · hint rows in two columns. |
| **Page order now** | Compact header (system chip + Refresh + the `Updated 18:32` caption) → **14-tile stats grid** → **Recent leads (2/3) + Needs attention (1/3)** → **Recent orders (2/3) + Payments & careers (1/3)**. Payment content is the last thing on the page and leads come before orders, so nothing financial is above the fold. |
| **Signal colour** | `warn` prop on `StatTile`: **TSS pending**, **Bug reports · 24h** and **Leads · 24h** render amber (`text-amber-700`) when non-zero, so the ones that need action read differently from the ones that don't. |
| **Dead code removed** | The `ICONS` map kept 11 glyphs after the tiles lost their icons — trimmed to the two still used (Refresh spinner, error-banner warning). File is now **660 lines** (was 790 before the two passes, 707 after the first). |
| **Kept unchanged** | `app/api/admin/stats/route.ts` — presentation-only, no API/DB/schema change. `visitorsLast24h` still windows on `lastSeen` (§22.2), Site Visitors is still unique humans (§20). |
| **Verified** | `npx tsc --noEmit` exit 0. No build, no dev server, no browser probe (§3 single-turn mode). |
| **Push** | Nested repo → `sarvadnyawebteam/sarvadnya-backend` `main`; this repo → `origin` (`sarvadnyawebteam/sarvadnya-live`) **and** `secondary` (`Orthodox2000/sarvadnya-infotech-2`). |
