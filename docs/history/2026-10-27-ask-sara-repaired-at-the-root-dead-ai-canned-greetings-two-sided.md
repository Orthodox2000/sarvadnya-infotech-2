# 33. 2026-10-27 — Ask Sara repaired at the root (dead AI + canned greetings) · two-sided transcripts · chat drafts gated on a real email · GSC failed-index cleanup

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

**Owner:** *"how r u"*, *"what?"*, *"i dont ge tit"* → Sara answered with a **product catalogue dump** instead of a human reply; the chat was **dead** for real questions and the owner asked to *"revert to previous version"*; the admin transcript view showed **user turns with no answer next to them**; *"form draft too triggers automatically form ask sara even no actual email is found, ensure proper regex matching exist before triggering form draft from ask sara"*; *"also enure sitemap is accurate as it gave lot of faield index on Examples"*; *"remove unwanted scripts and prep to push at end"*, then *"Commit + push to both remotes"*.

**The "revert" was done surgically, not with `git revert`** — the suspect commits also carried the verified TSS/payroll facts (§31) and the `/shop` wiring, so undoing them would have re-introduced disinformation. The real failure was two independent defects, each fatal on its own.

#### 33.1 Why the chat was dead — two defects that masked each other

| Defect | Measured evidence | Fix |
| :--- | :--- | :--- |
| **Gemini authenticated with the wrong header** | `callGemini()` treated anything not starting `AIza` as an OAuth2 access token. Google now issues keys in an **`AQ.`** format, so every request went out as `Authorization: Bearer AQ.…` → **401** "Request had invalid authentication credentials". Measured with the project's own key: `x-goog-api-key: AQ.…` → **200**, `Authorization: Bearer AQ.…` → **401**. | **Only a `ya29.` prefix is an OAuth token.** Everything else (`AIza`, `AQ.`, default) goes in `x-goog-api-key`. A **prefix** test, never "anything that is not AIza". |
| **Groq 413 on its own prompt** | With Gemini skipped, Groq was the only provider left — and its free tier is a hard **8,000 tokens-per-minute** ceiling on the **whole request**, while the sales system prompt had grown to **44,466 chars (~10,300 tokens)** → `413 Request too large`. Key rotation cannot help (both keys share one org). | Prompt shrunk by shrinking the **generator**, not the prose (see 33.2). |

Gemini 401 + Groq 413 = *"AI service temporarily unavailable"* on every non-cached question, and the **local keyword fallback** answered instead — which is 33.3's defect, so greetings hit product rows.

#### 33.2 Prompt shrink — 34,256 → 11,568 chars, with no sellable knowledge lost

Sara's product knowledge is **generated** from `lib/sara-catalog.mjs` (single source of truth since §28), so only the generator changed:

| Block | Before | After |
| :--- | ---: | ---: |
| `buildCatalogPromptBlock()` | **34,256** chars | **11,568** chars |
| Guides block | 5,066 | 5,066 (unchanged) |
| Full sales system prompt | **44,466** (~10.3k tokens) | **21,778** (~5,100–5,445 tokens) |
| Learn system prompt | 16,352 | 16,352 (unchanged) |

- **Products / cloud / services / modules** keep their one-line value statement (what a visitor acts on).
- **Add-ons (20)** are **link-only** via new `catalogueLinkLine()` (`name + [[Open|/addons#id]]`).
- **Shop (107 items)** no longer ships 107 descriptions (that alone was ~25,500 chars). It ships one shop line, the **10 featured** items **with** deep links, and the other **97** as per-collection **name lists** — so Sara can still name the exact item. `group` and `featured` were threaded through `SHOP_ITEMS` for this.

Measured after: `openai/gpt-oss-120b` → **200** (`prompt_tokens 5091`, `completion_tokens 146`); `openai/gpt-oss-20b` → **200**.

**Learn mode** requested **8,192** completion tokens, which alone exceeds the 8,000 TPM ceiling → now **2,048** (120b) / **1,536** (20b). Sales mode unchanged (1,536 / 768).

**History is trimmed by token budget, not turn count.** `messages.slice(-MAX_HISTORY_TURNS)` (24 turns) is not a budget — 24 real turns pushed the request back over the wall. New `trimHistory(messages, budgetTokens)`:

- walks **newest → oldest** keeping what fits `GROQ_INPUT_TOKEN_BUDGET = 6_200`,
- `estimateTokens = ceil(chars / 4)` + 4 tokens per-message overhead,
- **always keeps the last turn**, **never starts on an assistant turn**,
- the budget is what is *left* after the system prompt: `Math.max(600, 6_200 − estimateTokens(systemPrompt))`.

A 413 is still **not retried** (pointless across keys) and surfaces as HTTP 503 — the thing to watch if the prompt ever grows again.

#### 33.3 The offline fallback answered greetings with product rows (substring matching)

`scoreItem()` matched **substrings**: `"how r u"` scored **7** against *"Show last purchase cost in sales"* (the label "Show" contains "how"), and `"i dont ge tit"` matched the `tit` inside `quan**tit**y`. Fixed four ways:

1. **Word boundaries, not substrings** — `escapeRe()` + a cached `boundaryCache` regex per needle (`(^|[^a-z0-9])needle([^a-z0-9]|$)`).
2. **`STOPWORDS`** drops question/grammar words (`how`, `what`, `is`, `the`, `you`, `get`, `give`, `hmm`, `thanks`, …) before scoring.
3. **A whole-word NAME hit is worth 6** (the `minScore` threshold); a detail-only hit stays **2**. At 5 the exact noun in a product title (*"batch expiry report"*) fell one point short and the fallback stayed silent.
4. **`singular()`** so `report`/`reports`, `invoice`/`invoices` match each other.

Measured after — all **0** (the fallback now stays out of the way and the AI answers): `how r u`, `what?`, `i dont ge tit`, `hello`, `hi`, `thanks`, `ok`, `hmm`. Still matching with no regression: `what is tss` → TSS Renewal + 2 guides; `do you have container handling` → shop item + module. `npm run test:sara-catalog` → **37/37**.

#### 33.4 Transcripts are now two-sided

Assistant turns were appended in only *some* paths — the inline `fetch('/api/chats/append', …)` was copy-pasted, and these paths forgot it entirely: the **catch branch** (the offline / AI-error fallback, where the visitor read a real answer but nothing was saved), **follow-up buttons** (`handleFollowUp`), the **injection guard** reply, and the whole **lead-capture Q&A**.

There is now **one** helper — `appendTranscript(role, text, topic)` — plus `sayInChat()` which types and records in one call, wired into: AI success, the empty-clean branch, the catch/fallback, follow-ups, the injection guard, capture-stage user answers, and every capture/confirm/edit/error message. Fire-and-forget, skipped until `/api/chats/start` resolved the `chatId` so appends never race the start.

Headless proof `/tmp/opencode/verify-chat-transcript.cjs` → **13/13** (Puppeteer, spoofed public `x-forwarded-for`, doc deleted after): 4 alternating turns, no empty turn, real answers, `endedAt`/`endedReason` stamped on close.

#### 33.5 Chat drafts now require a real email

Root cause: the chat tracker was started with **no fields**, and `flush('unload')` **bypasses** the "nothing changed" early return — so every modal close and page hide POSTed `fields: {}` and the admin screen gained a blank, unreachable row. A chat has no form to recover, so a draft without a contact is noise, not a lead.

**New `lib/draft-contact.mjs` + `.d.mts`** — pure ESM, zero deps (house pattern: `rating-summary.mjs`, `sara-guard.mjs`, `careers-referral.mjs`), imported by **both** the browser tracker and the server route so they cannot disagree:

| Export | Meaning |
| :--- | :--- |
| `EMAIL_PATTERN` / `isValidEmail(v)` | Stricter than `[^\s@]+@[^\s@]+\.[^\s@]{2,}` (which accepted `a@b.c#`, `a@b..com`, `.a@b.com`, `a@-b.com`) |
| `findEmail(fields)` | Scans **values**, not key names (trackers name the field differently) |
| `hasValidEmail(fields)` | Boolean form |
| `isChatEntryPoint(p)` | `ask-sara` / `learn-sara` |
| `shouldCaptureDraft(entryPoint, fields)` | The single gate: chat → needs a valid email; everything else → unchanged |

- **Client** (`lib/draft-tracker.ts`): gate runs **before** the unload/blur bypass, on the merged `{...lastSent, ...pending}` view, so a field cleared later cannot resurrect an old contact.
- **Server** (`app/api/drafts/flush/route.ts`): the same gate, so a stale cached client — or a direct POST — still cannot write the row.
- **Non-chat drafts stay ungated**: a form draft is progressive by design; gating it on a finished email would stop it capturing anything.
- `QuickSupportModal` now calls `onInput('name'|'email'|'phone')` at the capture stages (the tracker was never fed at all — the other half of the empty drafts) and reuses `isValidEmail()`.
- `app/(site)/learn-sara/chat/page.tsx` — the tracker was **removed entirely**; that screen has no form.

**Two real defects the runtime probe caught (both in the *caller*, not the module):**

1. **The diff flush silently dropped a field.** The tracker POSTs only the **diff** after the first flush, so `{name,email}` then `{phone}` arrives with **no email**; the gate refused it and the phone was lost. Fix: when the diff alone is refused, the route reads the stored doc and re-checks `{...carried, ...f}` — **only on refusal**, so an ordinary form draft still costs one write and no read.
2. **`$set:{fields:f}` replaced the whole object** on every flush, so progressively captured sets kept only the newest. Now merged as dotted `fields.<key>` paths, with field **key names** sanitised (`[^A-Za-z0-9_]` → `_`, 64 chars) because a key like `a.b` / `$x` becomes a Mongo path once merged.

Runtime proof `/tmp/opencode/verify-draft-gate.cjs` → **20/20** (spoofed `203.0.113.77`): 5 no-email/junk posts → `{ok:true, skipped:'no_contact'}`, **0 docs**; valid email → 1 merged doc, `status:'active'`, 30-day `expiresAt`; diff flush keeps name+email **and gains** phone; a non-chat `contact` draft is **not** gated; dotted/dollar keys sanitised. Cleanup: 3 probe docs deleted, 0 `zz-test` remain; live check `drafts` last 45 min = **0**, total = **0**.

`npm run test:draft-contact` → **23/23** (20 core + **3 wiring assertions** that pin the callers, since the merge defect lived in a caller). **Negative-controlled:** reverting `{...carried, ...f}` to `f` makes the wiring assertion FAIL; restoring PASSes. Last entry in `test:all`.

#### 33.6 GSC failed indexing — the double-slash JSON-LD URLs

`articleJsonLd()` prefixes `/news/` onto its `slug` (articles originally lived only there). The Tally Insights lesson page passed its **full path** as `slug`, so it emitted `…/news//tally-insights/<section>/<lesson>` — a double slash and a URL that never existed. **That is why `/sitemap.xml` was clean while GSC was not**: the sitemap builds from `getAllLessonSlugs()`, the JSON-LD did not.

1. `articleJsonLd({ slug?, path? })` — **`path` wins over `slug`** and is used verbatim; `slug` stays the default for `/news`.
2. The lesson page passes `path:`.
3. `next.config.js` gains `/news/tally-insights/:path*` → `/tally-insights/:path*` (**permanent**; Next emits **308**) so an already-crawled variant collapses onto the real page instead of 404ing.
4. `/author/` added to `middleware.ts` `GONE_PREFIXES` — another WordPress archive artifact on the GSC list; nothing serves `/author/*`, so **410 Gone** is the honest answer, not a redirect chain.

Sitemap re-checked: **104 `<loc>`**, **0** occurrences of `sarvadnyainfotech.com//`.

#### 33.7 og:image was missing on 48 pages (a suppression bug)

Next.js: a page-level `openGraph` object **without `images` REPLACES** the file-based `app/opengraph-image.tsx` instead of merging. `seoMetadata()` returns an explicit `openGraph`, so `og:image` was present on `/demo` and `/cart` (no `openGraph` at all) and **absent on all 48 `seoMetadata()` pages** — the 2026-10-12 share card had been inert site-wide.

`lib/seo.ts` now declares `images` (1200×630, `/opengraph-image`, alt kept in sync with `app/opengraph-image.tsx`), mirrors it into `twitter.images` (`summary_large_image`), and takes an optional `image` param — `/news/[slug]` passes `item.coverImage`. Local paths resolve against `metadataBase`; absolute URLs pass through.

Verified: `og:image = https://sarvadnyainfotech.com/opengraph-image`, width 1200, on `/`, `/services/tss`, `/products/silver`, `/news/tally-tss-expiry-meaning`, `/tally-insights/gst-compliance/tally-gst`.

#### 33.8 Guards extended — both negative-controlled

- **`scripts/seo-audit.mjs`** new rule 7: `seoMetadata()` must declare `images` in **both** `openGraph` and `twitter`, `card: summary_large_image`, `OG_IMAGE_PATH = '/opengraph-image'`. Writing it surfaced a real false positive in the audit itself — it scanned **raw source**, so a comment that merely *mentioned* `seoMetadata()` was parsed as a call with empty arguments and reported a correct page as broken. Fixed with new **`stripComments()`** — quote-aware (a `//` inside `'https://…'` is not a comment) and **length-preserving** so the existing offset logic is unchanged. → `check:seo` **PASS, 49 calls**.
- **`scripts/schema-audit.mjs`** new rule group 10: no `articleJsonLd()` call may pass a `slug` containing a slash, and `lib/seo.ts` must expose `path`. → `check:schema` **PASS, 9 groups, 2 call sites**.

#### 33.9 Verification

| Check | Result |
| :--- | :--- |
| `npm run typecheck` | exit 0 |
| `check:h1` / `check:seo` / `check:schema` / `check:insights-svg` / `check:demo` | PASS |
| `security:check` | ALL CHECKS PASSED |
| `test:sara-local` / `test:sara-guard` / `test:sara-catalog` / `test:ratings` / `test:draft-contact` | 49/49 · 51/51 · 37/37 · 18/18 · 23/23 |
| `npm run build` | **exit 0**, run **standalone** (after `rm -rf .next`, no dev/start server) — "Compiled successfully in 37.0s", **171/171** static pages |
| `/api/chat` "how r u" / "what?" / "i dont ge tit" / "hello" | 200, real answers, no catalogue dump |
| learn mode | 200 with a clarifying question |
| `/sitemap.xml` | 104 `<loc>`, 0 double-slash |
| `/news/tally-insights/…` | **308** → real lesson URL |
| draft gate probe / transcript probe | 20/20 · 13/13 |

#### 33.10 Don't break

- **Gemini auth is a prefix test on `ya29.`** — never "anything that is not `AIza`". Google's `AQ.` keys are API keys and belong in `x-goog-api-key`.
- **`GROQ_INPUT_TOKEN_BUDGET` is a hard ceiling, not a target.** The shop ships names + 10 links on purpose; re-adding 107 descriptions re-breaks every Groq request.
- **`lib/draft-contact.mjs` is the only place "valid email" is defined** — do not reintroduce a local regex in the modal, the tracker or the route.
- **The server gate must merge the STORED fields before refusing** — the tracker posts diffs; without the merge later fields are silently lost.
- **Non-chat drafts stay ungated** — a form draft is progressive by design.
- **`articleJsonLd()` takes `path` for non-`/news` articles**; a slash inside `slug` now fails `check:schema`.
- **`seoMetadata()` must declare `images`** — an explicit `openGraph` without it suppresses the file-based share card on every page.
- **`stripComments()` must stay length-preserving** in `seo-audit.mjs` — the offset logic depends on it.

#### 33.11 Not done, deliberately

- **The nested admin repo (`sarvadnya-advanced/`) was NOT touched.** Nothing there was required for this to hold on the public site, and the fork's `app/(site)/` surface is unused. Its copies of `lib/seo.ts`, `app/api/chat/route.ts` and `QuickSupportModal.tsx` therefore carry the **old** behaviour and must be **hand-ported** (§10 rule 4) — never copied; that fork's chat route is CRLF.
- **No `next dev` ran during build verification** (§9 hazard): the build ran standalone after stopping `next start` **by PID**.
