# 2026-11-28 — Ask Sara answers in depth and knows which page the visitor is on

Owner directive (owner transcript 28/11/2026, 13:45–13:46):

> "ask sara isnt providing solution but just looping in short answers summary" …
> "alwasy provie deep answers and understand which apge they aree on, so you can summariese conant exactly on that"

The live transcript that triggered it: a visitor typed **"full"** and got *"Sure! What would you like a brief summary of—our product lineup, a specific service, or something else?"*, then **"full"** again got *"Sure! Would you like a quick overview of our key offerings or a detailed list…?"*, and **"no need just shut up"** got a contact CTA. Two defects at once: (1) the prompt forced a 1–3 sentence + ask-first reply on every turn, and (2) the chat had no idea which page the visitor was reading, so an unqualified "full" had nothing to refer to.

**This reverses the 2026-11-28 morning ruling ("Ask Sara is the SHORT-ANSWER assistant; Learn Sara is the DETAILED AI TEACHER") recorded in [the earlier session](2026-11-28-news-refresh-sara-teaching-and-chat-continuity.md).** Learn Sara's detailed teaching mode is unchanged; Ask Sara now answers in depth too.

## Changes

| File | Change |
| :--- | :--- |
| `app/components/SupportButton.tsx` | Passes `pagePath={pathname}` into `QuickSupportModal`. `usePathname()` was already present for the homepage promo, so no new hook. |
| `app/components/QuickSupportModal.tsx` | New optional `pagePath` prop + `getCurrentPageText()` helper. At **send time** (an event handler, never during render — no hydration risk) it reads the visible text of `document.querySelector('main')` (fallback `document.body`), normalises whitespace and caps it at 3,000 chars. Both fields are added to the `/api/chat` POST body. |
| `app/api/chat/route.ts` | New `buildPageContextBlock(pagePath, pageContent)` appends a `CURRENT PAGE` section to the system prompt: URL path + verbatim visible text, with rules to treat short follow-ups ("full", "more", "summary", "go on") as requests about **that** page, to summarise only what is actually on it, to answer in depth with plain headings, never to ask "what would you like a summary of?", and to fall back to the site map/catalogue when page text is unavailable. The block is empty for direct API callers that send no context, so older callers are unaffected. Server caps the text again at 3,000 chars. |
| `app/api/chat/route.ts` (prompt) | Removed the `VERY SHORT / 1–3 sentences` rule; first-turn answers now aim for 200–600 words with real structure. `ASK BEFORE YOU TELL` is scoped to **custom work and quotes only** — the literal header is retained for the guard regression suite. "Single vague replies" now point at CURRENT PAGE instead of asking another question. `SALES MINDSET` no longer stops after three short beats. |
| `app/api/chat/route.ts` (tokens) | `geminiMaxTokens` for sales 1,024 → 2,048 so a page summary can finish. Groq ceilings unchanged — its 8,000 TPM wall is already tight with the generated catalogue. |
| `app/api/chat/route.ts` (`finalizeReply`) | Passes the new `allowDepth: true` guard option on both provider branches. |
| `lib/sara-guard.mjs` / `.d.mts` | `applyConsultantGuard()` gained opt-in `allowDepth`; when true it skips the `soft-length-nudge` that appended "Want me to walk you through it step by step?" to long answers. Off by default, so the offline topic fallback and `scripts/sara-guard-test.mjs` keep their original contract. All hard rules (no code, discovery for custom builds, discount neutrality, off-topic no-pitch, shortcut sanitising) are untouched. |

## Notes / deliberately not done

- No page-text scraping on the server and no hand-maintained per-page summary map — the DOM is the only faithful source of "content exactly on that page" and cannot drift from what the visitor sees.
- `<main>` is used when present; most site pages have one (home, products, tutorials, about, learn-sara, tools, checkout). Pages without one fall back to body text, which includes the chrome — harmless for a summary and still page-specific.
- The nested `sarvadnya-advanced/` fork was **not** touched (separate repo, separate rules, CRLF chat route). Its Ask Sara is still the short-answer behaviour and would need a hand-port if that deployment ever wants the same change.
- No lint/build/test was run — owner working mode is single-turn code generation, verification only on explicit request.

## Verification TODO (when the owner asks)

- `npm run test:sara-guard`, `npm run typecheck`, then a live chat probe on a content-rich page (e.g. `/products/gold`): open Sara, send "full" → expect one deep summary of the Gold page with no "what would you like a summary of?" question; send "tike" → expect a page-grounded answer, not a generic "let me know what you'd like help with".
