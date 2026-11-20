# 2026-11-14 — Admin dashboard readjusted: important numbers first, dead modules removed

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"the new dashboard for admin is good but all important stats are below and have to scroll and too much unwanted modules and few stats are ahead, readjust it."* |
| **What was wrong** | The 2026-11-13 remake was vertically ordered backwards. Order was: 4 tall KPI cards → a 4-row "Needs attention" list (with a description line each) + a **System health** card → **three 5-card groups = 15 tiles** of lifetime totals (which repeated Orders / Visitors / Revenue that were already at the top) → then recent orders + recent leads → then a Quick-links footer. Everything that changes daily sat three screens down, and the page had six modules for data that fits in two. |
| **Fix (`sarvadnya-advanced/app/admin/page.tsx`)** | Reordered to: header → **one dense six-tile KPI row** (Revenue · New leads 24h · Orders today · TSS pending · Visitors 24h · Chats 24h — no duplicates, each still a link) → **Recent orders (2/3) + Needs attention (1/3)** → **Recent leads (2/3) + All totals (1/3)**. |
| **Removed** | `System health` panel (the header chip already carries service, database and version; the timestamp moved under the header), the **Quick-links footer** (the sidebar is the navigation), and the three 5-card lifetime groups (`MetricGroup`) — their unique numbers collapsed into one compact **"All totals"** list of label · value · hint rows. |
| **Tightened** | KPI tiles are horizontal (icon · value · label · hint) at `text-base sm:text-lg`, grid `grid-cols-2 sm:grid-cols-3 xl:grid-cols-6`; header title `text-3xl → text-2xl` and the subtitle removed; page spacing `space-y-6 → space-y-4`; recent-activity rows `px-4 py-3 → px-3 py-2.5`. "Needs attention" now **filters out zero-count rows**, drops the per-row description, and shows "Nothing needs attention right now." instead of a list of four zeros. |
| **"Last updated" on the Refresh control (owner follow-up)** | The timestamp used to be its own line under the header. It is now a **caption under the Refresh button** (`Updated 18:32`, or `Not updated yet` before the first fetch), rendered as a sibling `<span>` of the `<button>` so the text is not clickable and stays plain status text for screen readers. The separate line was deleted, so the header block got shorter again. |
| **Kept unchanged** | Data layer (`app/api/admin/stats/route.ts`) — pure presentation change, no API/DB/schema touch. `visitorsLast24h` still windows on `lastSeen` (§22.2) and Site Visitors is still unique humans (§20); `formatRelative`, status badges and the error/retry banner are unchanged. |
| **Verified** | `npx tsc --noEmit` exit 0. No build, no dev server, no browser probe (owner's single-turn mode, §3). No commits, no pushes. |
| **If it still runs long** | The only remaining candidates for removal are the "All totals" card and the two recent-activity panels — both are now at the bottom, so nothing important is hidden. |
