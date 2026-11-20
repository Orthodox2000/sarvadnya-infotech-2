# 34. 2026-10-29 — metadata rewritten for clicks + claude-seo P0, then Ask Sara's answer quality enforced in **code**

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

**Owner:** *"run the claude-seo review and act on it"* · metadata is fine on **coverage** but weak on **clicks** · on `CONTACT_SUFFIX`: *"take your own decision, we dont need same content on every, we can keep on contact section and other important pages but optimise for max output and performance"* · the chat is still not **"valuable and human"** — no nonsense, no confusion, no forced pitching · **visible page copy must not change and nothing may be invented**.

Three commits:

| Commit | What | Pushed |
| :--- | :--- | :--- |
| `75a6886` | `seo: action-led titles/descriptions site-wide + claude-seo P0 adoption` (57 files) | **yes** — `origin` + `secondary` |
| `36c5031` | `ui: finalize ask-sara rules and view-price/tallydrive tweaks` (2 files, owner-authored, in flight) | **yes** — `origin` + `secondary` |
| `2989c1c` | `fix(chat): enforce answer quality in code, not just in the prompt` (3 files, +311/−12) | **no** — committed only, awaiting authorisation |

#### 34.1 Why the metadata was rewritten at all

The pages already ranked and already had descriptions — and still earned very few clicks. A title that **names the page** (`TallyPrime Gold`) competes with a dozen identical titles; a title that **states the offer** (`Buy TallyPrime Gold — Multi-User`) tells a searcher the result is the thing they wanted. That is the entire rationale, and it is why the rewrite is **verb-led rather than keyword-stuffed**.

**43 pages rewritten.** `/privacy`, `/terms` and `/eula` **deliberately keep plain descriptive titles** — a sales verb on a policy page reads wrong exactly where a visitor is checking whether we are legitimate.

#### 34.2 `seoMetadata()` gained `contactSuffix` (default `true`)

Every description used to carry the same phone/location tail. That is worth its characters on a commercial page (it answers *"are you reachable / are you near me"* in the SERP) and is wasted on a reference surface, where those characters should carry the actual answer.

- `contactSuffix: false` on **17 call sites**: `learn-sara/[topic]`, `tally-insights/[section]`, `tally-insights/[section]/[lesson]`, `news/[slug]`, `/news`, `/learn-sara`, `/tally-insights`, `/tools`, `/tools/tss-expiry-checker`, `/privacy`, `/terms`, `/eula`, `/search`, `/ask-sara`, `/theme-settings`, `learn-sara/chat`.
- Rendered reality today: **32 pages keep the CTA tail, 13 opt out** — printed on every `check:seo` run so the decision stays visible instead of becoming folklore.
- `scripts/seo-audit.mjs` is **suffix-aware per call**, so `DESC_MAX = 160` is measured against what actually renders. Without that, an opted-out page would be checked against a longer string than it ships and the guard would go quietly wrong.

#### 34.3 `localBusinessJsonLd()` — three additions, two deliberate omissions

Added `sameAs` (the four verified socials already in `orgJsonLd`), `foundingDate: 2008` and `hasMap`.

**Not added: `geo` (lat/lng) and `openingHoursSpecification`.** There are no verified coordinates and no verified hours. A guessed pin sends a customer to the wrong building; guessed hours create a support call at the wrong time. Both are worse than the omission, and Google treats neither as an error. Owner-supplied values are a two-line addition.

#### 34.4 claude-seo P0, adopted

- **`public/llms.txt`** — an LLM/answer-engine index (products, services, cloud, catalogue, free content, company, notes). Verified serving `200` as `text/plain`.
- **`app/robots.ts`** — private paths extracted into **one** `PRIVATE_PATHS` list and repeated per crawler group (search crawlers **and** AI/answer engines), plus `host`. Every group repeats the **same** disallow list, so nothing currently allowed can become disallowed by this edit. AI crawlers are deliberately welcomed; `CCBot`/`Bytespider` deliberately not listed.
- **`app/layout.tsx`** — `lang="en-IN"` (the business is Indian; bare `en` tells a crawler nothing).
- **NEW `scripts/alt-audit.mjs`** — `npm run check:alt`, dependency-free, wired into `test:all` immediately after `h1-audit`. Flags a **missing** alt, a **generic** alt (`image`, `logo`) and a **filename** alt; `alt=""` is a valid decorative image. Current run: **164 `.tsx` files, 64 image tags, 3 empty (decorative), 17 dynamic — PASS**. One real fix fell out: the `/tutorials` card fallback `alt="Logo"` became `alt="" aria-hidden="true"`, because the card's `h3` already announces the title and a screen reader was hearing the card twice.
- **⚠️ Build fix found while validating:** `app/(site)/shop/shop-browser.tsx` imported `isGatewayConfigured` from `@/lib/cart/payment`. That module pulls `node:crypto` and the Razorpay SDK, so `next build` failed with `UnhandledSchemeError: Reading from node:crypto`. It could never have worked at runtime either — the function reads `RAZORPAY_KEY_ID`, not a `NEXT_PUBLIC_` variable, so in a browser it is always `false`. Static **"Get Quote"** restored; the owner's "Best Seller" badge repositioning kept. **A server helper is not automatically usable from a client component, and the failure only appears at build time.**

#### 34.5 13 lesson `seoTitles` shortened (titles > 60 chars: 38 → 25)

`seoMetadata()` appends `" | Sarvadnya Infotech LLP"` (**25 characters**), so a lesson title longer than ~35 characters of body renders a `<title>` Google truncates. The 13 were **rewritten, not truncated** (a cut-off title reads broken), and each is deliberately different from its section title so two URLs cannot compete with the same `<title>`.

After the sweep **25 titles still render > 60 characters and all 25 are `/news` posts**. Those are long-tail keyword targets stored in **MongoDB**, so fixing them needs a `scripts/seed_news.mjs` production run — an owner call, not something to do unilaterally. **Left open, deliberately.**

#### 34.6 The chat problem — prove it, then fix it

Prompt rules had already failed once (the TDL guard, §28). Twice more they failed here. So: **build a behavioural battery first**, then fix only what it can demonstrate.

`/tmp/opencode/verify-chat-quality.mjs` — **22 cases** against a local production build (`next start -p 3311`):

| Group | Cases | What it must prove |
| :--- | :--- | :--- |
| A casual | `hi`, `how r u`, `what?` | warm and human, **not** a catalogue dump |
| B gibberish | `i dont ge tit`, `asdkjhqw` | asks, does not guess |
| C product | TSS, Gold price, duplicate-purchase add-on, TallyDrive | facts are real |
| D business problem | outstanding payments, stock across 3 godowns | a real product **and** a question |
| E code trap | `can you draft tdl` ×2, `write me a python script` | no code, ever |
| F off-topic | prime minister, poem about rain | decline gracefully, **no pitch** |
| G TSS facts | when to renew, 2-year discount, ERP 9 | no invented windows/discounts/bonus months |
| H hinglish | `bhai tally ka price kya hai` | an answer, not a crash |
| I learn mode | company creation, `write a tdl for me` | teaches, does not write code |
| J multi-turn | renew TSS → "how do i do that offline" | the second answer uses the first turn |

Assertions cover only **hard** rules (code markers, a product button on an off-topic answer, a percentage on a discount answer, duplicate CTAs). Judgement quality is printed raw for a human — *"is this a good answer"* is not something a regex should pretend to settle.

#### 34.7 Five defects the battery found, and how each was closed

| # | Defect | Fix |
| :--- | :--- | :--- |
| **I2** | **The same question and the same button, twice.** The TDL reply carried the discovery question + CTA, and the guard appended a *second* block with both, because `hasDiscoveryQuestion()` counted only a literal `?` — and the reply asked *"Tell me what you are trying to achieve on your screen"*, a question **without** a question mark. | Widened the definition (`INFO_REQUEST_RE`: *tell me*, *let me know*, *share*, *describe*, *which screen/version/edition*, *how many users/companies/godowns*…) + new `hasCtaButton()`, so an appended block never repeats a button the reply already renders. |
| **F1/F2** | **An off-topic answer ended with a product button.** *"who is the prime minister of india"* → *"That would be Narendra Modi."* + **Explore TallyInsights**; a poem about rain → **Explore TallyDrive**. Nothing kills a conversation faster than a poem followed by an advert. | `isOffTopicQuery()` + `stripCtaButtons()`: a purely off-topic answer **keeps its words and loses the button**. A `BUSINESS_CONTEXT_RE` override keeps genuine questions safe — *"how do i show capital of the firm in the balance sheet"* contains the off-topic token "capital of" but is an accounting question, and a wrong strip would cost a real lead its CTA. |
| **G1** | **An invented TSS lead time.** The answer said to renew "a few days before expiry"/"15 days before" — a window Tally does not publish (removed from the knowledge base §31). | The prompt bans **every** lead-time window (not just the number) and states the correct WHEN wording: renew when `Alt+R` appears, i.e. when renewal is due. |
| **G2** | **A discount we do deny and do not deny.** Asked *"is there a 10% discount if i pay for 2 years"*, Sara answered *"We do not offer a flat 10% multi-year discount"* — **while `/services/tss` shows `10% OFF` on the 2-year rows** (`lib/prices-catalog.mjs`: `discountRupees` 1062 / 3186, `discountLabel: '10% OFF'` on `tss-single-2yr` / `tss-multi-2yr`, rendered 6× live). A later run had the model **denying** it. | Enforced in code and **neutral**: point at the live pricing table, neither promise nor deny, never state a percentage (`buildDiscountReply`, action `pricing-redirect`). A 2-year term exists only for TSS on our list, so a "pay for 2 years" question routes to TSS pricing even when the word TSS is absent; the generic branch points at `/products`; a **custom-build request is excluded** — "discount on my TDL project" belongs in the brief, not a price list. |
| **D2** | **A self-contradicting edition.** "Stock across 3 godowns" was answered with Gold (correct for multi-user) while the reply implied a single-user assumption. | The prompt gained an **EDITION LOGIC** block (Silver = single user, Gold = multi-user, Server = client-server) with the instruction to ask the user count **first**. Post-fix reply asks *"How many people handle your inventory entries across these locations?"* and recommends Gold. |

#### 34.8 Why this had to be code, not another prompt bullet

Every one of the defects was **already against a written prompt rule**. Two of them (F1's button, G2's denial) survived a **prompt-only** fix and only changed once a deterministic gate was added.

> A prompt is a request. A gate is enforcement.

Same reasoning as §28: the model can drift, the gate cannot, and the rule becomes testable **without an LLM**. The guard runs on every reply in **both** provider branches before it leaves the server and logs `[chat] consultant guard: <action>`.

`applyConsultantGuard()` actions: `none` | `blocked-code` | `added-discovery` | `soft-length-nudge` | `pricing-redirect` | `stripped-offtopic-cta`.

#### 34.9 Guard suite 51 → 68 assertions, negative-controlled

`scripts/sara-guard-test.mjs` grew from **51** to **68**: the new prompt policies (off-topic answers carry no button; the learn prompt's forced tie-back is softened so an honest answer can leave the pitch out; the TSS block bans every window and states the WHEN wording; discounts are neither promised nor denied), guard behaviour pairs (off-topic vs business-context, discount vs TSS-vs-generic branch, TDL request excluded from the discount redirect) and **the exact live replies that regressed are pinned as inputs with required outputs**.

Negative controls were **run, not assumed**: reverting the `INFO_REQUEST_RE` widening fails the two I2 assertions; disabling the off-topic strip fails F1; restoring both passes. *A guard that has never been seen to fail is not a guard.*

`scripts/sara-topics-test.mjs` was **not weakened** — its TSS-facts section and its "no `10 %` in canned answers" rule stay intact, because the canned answers must stay neutral for the same reason the AI replies now are.

#### 34.10 Verification

| Check | Result |
| :--- | :--- |
| `npm run typecheck` | exit 0 |
| `npm run build` | **exit 0**, run **standalone** after `rm -rf .next` (no dev/start server — the §9 hazard) |
| 104-URL sitemap sweep | 0 descriptions > 160 · 0 missing/duplicate titles · 0 missing `og:image` |
| `check:h1` / `check:seo` / `check:schema` / `check:alt` / `check:demo` / `check:insights-svg` | PASS |
| `security:check` | ALL CHECKS PASSED |
| `test:sara-local` / `test:sara-guard` / `test:sara-catalog` / `test:ratings` / `test:draft-contact` | 49/49 · **68/68** · 37/37 · 18/18 · 23/23 |
| 22-case battery, post-fix `next start -p 3311` | **ALL HARD CHECKS PASSED**, run **twice** |

Named post-fix replies, quoted: **F1** `Narendra Modi is the Prime Minister of India.` (no button) · **F2** the poem and nothing else · **G1** *"renew your TSS before it expires… F1: Help > Settings > License > Manage License"* · **G2** *"Our TSS pricing table answers that better than I can… [[View TSS Pricing\|/services/tss]]"* · **D2** *"How many people handle your inventory entries across these locations?"* + Gold · **I2** one discovery question, **one** CTA.

The battery is non-deterministic (it is an LLM), so it was run twice; **F1/F2/G2 are now guaranteed by code rather than by the model**, which is why they held both times.

`npm run test:all` includes `scripts/sara-test.mjs`, which calls the **deployed** site and judges the answer with another LLM — it flakes (§18 pattern) and is **not** a gate for this work.

#### 34.11 Not done, deliberately

- **`H1` (Hinglish)** — *"bhai tally ka price kya hai"* gets an English answer. Understandable and polite; not worth forcing a language detector. Noted, not changed.
- **`C2` (live prices)** — the chat cannot quote today's rupee figure: the prompt is static and prices live in MongoDB. It correctly defers to the pricing page. Real quoting needs a per-request price read; not started.
- **25 `/news` titles > 60 characters** — needs a production `seed_news.mjs` run (owner authorisation).
- **`geo` / opening hours** in `LocalBusiness` — needs verified owner data.
- **`2989c1c` is not pushed.** `75a6886` and `36c5031` are live on both remotes.

#### 34.12 Don't break

- **`seoMetadata()`'s `contactSuffix` must stay suffix-aware in `seo-audit.mjs`** — otherwise opted-out pages get checked against a longer string than they ship.
- **Never import a `lib/cart/*` or other `node:crypto`/SDK-backed module from a client component** — it builds fine in dev and dies at `next build` (`UnhandledSchemeError`). That was the `shop-browser.tsx` defect.
- **`lib/sara-guard.mjs` is the single source of "no code / ask first / no pitch off-topic / neutral discount"** — never re-implement these rules inline in the route or the topics file, and keep `applyConsultantGuard` wired into **both** provider branches.
- **`BUSINESS_CONTEXT_RE` exists so a genuine accounting question keeps its CTA.** Widening `OFF_TOPIC_RE` without it will silently strip buttons from real leads.
- **The discount answer must stay neutral** — the live `/services/tss` table really does show `10% OFF` on the 2-year rows, so neither promising nor denying in chat is honest; only the table is.
- **13 lesson `seoTitles` must stay distinct from their section titles** — two URLs with the same `<title>` compete with each other.

Ops note: `next start -p 3311` was stopped **by PID** (`60815` → `60816`), never with `pkill -f` — that pattern matched the invoking shell's own command line and killed the shell once before.
