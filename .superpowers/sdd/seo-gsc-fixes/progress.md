# SDD ledger — plan: docs/superpowers/plans/2026-09-07-seo-gsc-fixes.md

## Pre-flight conflict scan (2026-09-07)

| Row | Tasks sharing file/interface | Finding |
|---|---|---|
| 1 | Task 1 files vs Task 2 files | Disjoint sets (product-nav/Footer/QuickAccessHubDemo/ModuleCard/modules-page vs seo.ts/search/learn-sara/demo/theme-settings/sitemap). Clean. |
| 2 | Task 3 (www→non-www) vs Task 5 (410 layer) | Both target `middleware.ts` if Task 3 uses the middleware route. Ruling: Task 3 primary was Vercel console (unexecutable by a subagent) — I choose the in-repo middleware route so the plan is fully executable; run Task 3 then Task 5 sequentially over the same file. Cost if wrong: www 301 adds edge compute; Vercel platform redirect could replace it later. |
| 3 | Task 4 (`next.config.js`) | Appends to existing `redirects()` (has `/cloud/nosky`); no collision with new sources. Clean. |
| 4 | Task 2 (`lib/seo.ts`) | User's pending CONTACT_SUFFIX work committed separately as `ec024f0` (user-approved) before this plan started. BASE for Task 1 = `ec024f0`. |
| 5 | Workspace | Working directly on `main` in the user's own checkout (no worktree — machine is RAM-constrained, AGENTS.md §9; user's established workflow). Noted; no separate branch. |

Task 1: minor (deferred): modules/page.tsx hash-scroll effect won't re-fire on in-SPA hash change — acceptable; module deep-links are entry URLs, not in-app navigation.
Task 1: Ruling (scope) — implementer converted ALL `/modules?` deep-links (siblings, dynamic `?id=${m.id}` templates, search API) not just cf-agencies. Correct: the crawlable pattern is the defect, not one URL; behavior-preserving (page ignored query params); Step-4 acceptance demanded it. Cost if wrong: none — fragments are inert client-side.

Task 1: complete (commits ec024f0..16702a4, review clean; 1 deferred minor)
Task 2: complete (commits 16702a4..7e96d13, review clean)
Task 3: complete (commits 7e96d13..5716bfe, review clean)

## PAUSED by user 2026-09-07 (new keyword-attraction requirement)
Tasks 4 (legacy-WP 301s in next.config.js) and 5 (legacy-WP 410s in middleware) are NOT yet implemented; Task 6 (deploy+GSC) manual. Resume from Task 4 when instructed. Task 1's deferred minor still open at final review.

## Outside-plan work: keyword-attraction (completed 2026-09-07) — resumed from brainstorming, user picked "Blog extension + meta CTR"
- `scripts/seed_news.mjs` +6 new keyword-targeted posts (tally-5-star-partner-mumbai, tally-partner-near-me, tally-hrms-software, tally-tss-expiry-meaning, tally-cloud-access, cbd-belapur-it-companies-list) then retitled 3 weak posts for exact-match+CTR (tally-dealers-mumbai, tally-erp9-add-ons, tally-partner-mumbai). ASCII-only content; skipped `sarvadnya-explores` (1 impression - negligible).
- Seeded to production MongoDB: inserted 6, updated 3, skipped 7, total news = 19. Verified all 9 slugs/titles in DB + `npm run typecheck` clean. AGENTS.md news row updated (16 seeded / 19 live).
- USER CORRECTION 2026-09-07: company is a **3 star** Tally partner. Seed re-run: `tally-5-star-partner-mumbai` repositioned honestly ("3 Star vs 5 Star, What the Certification Means", states our tier plainly, no 5-star claim) and `tally-3-star-partner-mumbai` CTA now names the 3 star credential. Verified in DB (updated: 2).
- Not committed yet. No app source changed (DB content only), deploy = next build/deploy.