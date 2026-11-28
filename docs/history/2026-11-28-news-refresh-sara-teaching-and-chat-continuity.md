# 2026-11-28 — News refresh, action-first titles/tags, detailed Learn Sara, chat continuity

Owner directives handled in this session:

- "update the news" in **both** surfaces: the teal ticker (`STATIC_NEWS`) and the seeded `/news` articles.
- "remoe gnric, how to attach data, dms etc as bst performaing so keep them" — retire the generic
  partner/city/list posts; keep the how-to, attach-data and document-management posts.
- Bank Import / Excel-to-Tally: "just news and link to it" — news articles linking to the existing
  `/shop` deep links; **no** new `/tools` or service cards.
- "titles/tags audit all adn update" — action-oriented titles/tags on the news seed, service cards,
  shop and Learn Sara metadata.
- Learn Sara is "full on course provider ai assisted teaching" and replies "in education mode in details";
  Ask Sara stays short. Ask Sara defects: "after 4 message, reply drop" and "laods for long time".
- "leaving page changes to enw caht on same sesion fix it".

## News

- `scripts/seed_news.mjs`: `posts` is now `ALL_POSTS.filter(...)` with `REMOVED_NEWS_SLUGS` holding the
  ten retired generic partner/city/list slugs. They are also appended to `REMOVE_SLUGS`, so the next
  seed deletes the documents from the live collection as well as hiding them from the seed.
- Two new grounded posts: `bank-statement-import-tallyprime` → `/shop#excel-bank-statement-import`
  and `excel-to-tally-import-vouchers-masters` → `/shop?group=excel`. Both are ASCII-only and reuse
  the shop deep links already present in `SiteChrome`; no new tool/service page was created.
- `lib/news-utils.ts`: `RETIRED_NEWS_SLUGS` expanded to all ten slugs. Every entry has a matching 301
  in `next.config.js`; the old `/news/it-companies-in-belapur` → `/news/cbd-belapur-it-companies-list`
  and `/small-add-ons-in-tally-erp-9` → `/news/tally-erp9-add-ons` 301s were repointed because their
  targets were retired (now `/news` and `/shop`).
- `scripts/update-news-seo.mjs`: removed the two retired slugs from its `SLUGS` list so its
  "slug must exist in the seed" preflight still passes.
- `lib/static-site-content.ts`: the two retired posts in `STATIC_NEWS` were replaced by the two new
  import posts. The ticker and `/news` are separate surfaces; both are now refreshed.

**Live effect:** the article `<title>`/description values live in MongoDB. Running
`node scripts/seed_news.mjs` (and, for the retitled survivors, `node scripts/update-news-seo.mjs --apply`)
is what pushes them to production; editing the seed alone does not change live metadata.

## Sara: education mode vs short answers

- `app/api/chat/route.ts`: `LEARN_SYSTEM_PROMPT` now teaches in full on the first reply (orientation,
  numbered steps, worked example, watch-out, check question) instead of asking the visitor to say
  "detailed" first. Setup assumptions are stated inline; the correction question moved to the end.
  `SALES_SYSTEM_PROMPT` is unchanged — Ask Sara remains 1–3 sentences. `applyConsultantGuard()` is
  still applied by `finalizeReply()` in both the Gemini and Groq branches.
- `lib/sara-topics.ts`: `getTeachingFallbackResponse()` builds a complete lesson from the same
  `matchTopic()` data the written guides render, so a provider timeout no longer reads as the lesson
  stopping. Off-syllabus questions get a learning structure rather than a bare question.

## Latency and "reply drops after four messages"

- The route used one `TIMEOUT_MS = 30_000` per key with sequential rotation. Now one provider attempt
  gets 12 s (`PROVIDER_TIMEOUT_MS`) and the whole request gets 20 s (`REQUEST_DEADLINE_MS`), after
  which key rotation stops and the deterministic fallback answers.
- The Groq 6200-token history budget was applied to **both** providers, so a detailed lesson lost its
  own earlier steps after a few turns. Gemini now gets `GEMINI_HISTORY_TOKEN_BUDGET = 12_000`; Groq
  keeps its hard ceiling and its trimmed history.
- Learn Sara's client aborts `/api/chat` at 18 s so the input can never stay disabled indefinitely;
  its artificial typing delay is now capped at 900 ms. Ask Sara's known-answer typing delay dropped
  from 2 s to 600 ms.

## Chat continuity

- `app/(site)/learn-sara/chat/page.tsx` stores `{sessionId, chatId, messages}` in `sessionStorage`.
  On return in the same browser session the same transcript is restored instead of a new chat.
- `/api/chats/end` is no longer called on React unmount (that was the "leaving page starts a new chat"
  bug). It fires on `pagehide`, i.e. a real document unload. `handleReset` clears the visible lesson
  but keeps `chatIdRef`, so the admin transcript stays one conversation.

## Title/tag audit

- Service cards in `app/(site)/services/page.tsx` renamed to action-first titles and task tags
  (e.g. "TSS Renewal" → "Renew TSS and Restore Connected Features", tag "Renew TSS").
- `/shop` metadata title "Find TallyPrime TDLs & Importers" plus a `bank statement import` keyword.
- `/learn-sara` metadata and on-page copy now spell out the split: Ask Sara = short answer, Learn
  Sara = full AI-led lesson; chat CTA renamed "Start a lesson".

## Verification (owner requested on 2026-11-28)

- `npm run typecheck`, `npm run build`, `npm run test:all` (all 25 chained suites), the static guards
  (`check:h1`, `check:alt`, `check:seo`, `check:schema`, `check:dms-prices`, `check:insights-svg`,
  `check:demo`, `check:modules`, `security:check`) and `npm run check:demo-guard` all pass. `check:seo`
  reports three pre-existing length warnings on `/cloud/tallycloudaccess`, `/modules` and `/products`
  titles; no failure.
- A Puppeteer sweep at 360, 1024 and 1280 px found **0 horizontal overflow** and **0 desktop-nav
  overlaps** on `/`, `/news`, `/services`, `/shop` and `/learn-sara`; one H1 per page; expected
  action-first copy present. A fallback-font pass (all text forced to Arial) at 1024 / 1152 / 1280 px
  also measured 5 nav items, 0 overlaps and 0 overflow. Screenshots are in `/tmp/opencode/ui-*.png`.
  The only clipped strings are the intentional `truncate` testimonial names on the homepage.
- Browser probes with all write endpoints stubbed confirmed Ask Sara returns a reply within ~200 ms
  for five consecutive questions (no fourth-message drop), and Learn Sara restores the same lesson
  after leaving via the close link and returning: one `/api/chats/start`, zero `/api/chats/end`, one
  `/api/chat` call.
- `node scripts/seed_news.mjs` was applied to the live cluster: 2 posts inserted, 10 retired slugs
  deleted, 18 unchanged. `npm run test:news-verify` then exposed a stale exact-string assertion
  (the canonical post now says "There is no conversion step" instead of the old combined sentence);
  the verifier was aligned with the seed and now passes 31/31.
- **Deployment caveat:** the production domain is still serving the previous Vercel deployment
  (`7418139`), so the new news slugs are in MongoDB but `/news/<new-slug>` still 404s publicly until
  the current code is deployed or the `news` cache tag is revalidated. No push or deploy was made.
