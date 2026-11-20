# 31. 2026-10-26 — GSC structured-data cleanup + a line-by-line factual audit of all 22 news posts and all 16 Tally Insights lessons

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

**Owner:** GSC reported structured-data issues on `/products/tallydrive`, `/services/tss` and `/products/silver` — fix them, and the content must be **"100% factual and correct"** (no invented facts, no guessed menu paths). Audit scope was set to the **widest** option: every news post + every lesson, not just the three flagged pages. Two standing constraints shaped everything: **the return policy is never published** (licences are returnable in limited cases, no time limit, no cooling-off — internal knowledge only, never frontend copy or a customer email), and **a validator warning is never permission to invent a fact**.

#### 31.1 Every GSC item → its resolution

| GSC item | Verdict | Why |
| :--- | :--- | :--- |
| `hasMerchantReturnPolicy` | **Omitted permanently** | Licences *are* returnable, but with no time limit and no cooling-off, and the policy may not be published. `MerchantReturnNotPermitted` would be **false**; `merchantReturnDays` has **no honest value**. The cost is only a GSC *recommendation* (merchant listing), **never an error** — price snippets keep working. |
| `shippingDetails` | **Omitted permanently** | Every sellable item is a digital licence/subscription delivered by email. There is nothing physical to describe. |
| `priceValidUntil` | **Omitted pending the pricing window** | A date is never guessed. Deferred with the Part C pricing discussion. |
| `itemCondition` | **Added** | `https://schema.org/NewCondition` on **every** Offer — recommended, true for licence sales, zero risk. |
| **Offer/Product mismatch** on `/products/tallydrive` | **Fixed** | The Product node said *TallyDrive Cloud Backup* while its only Offer sold *Extra Storage*. The only priced row on that page **is** the storage pack — the 1 GB single-user / 3 GB multi-user allowance is **free with an active TSS** and is described on-page as "Included with TSS", never sold. The node now describes exactly what the Offer sells: `TallyDrive Extra Storage (10 GB)`, sku `tallydrive-extra-storage-1yr`, `itemOffered` = `TallyDrive Extra Storage (10 GB, 1 Year)`. |
| **Six indistinguishable Offers** on `/services/tss` | **Fixed** | Each Offer now carries `itemOffered` with the plan's own name, resolved from the **same `lib/prices-catalog.mjs` row** the pricing table renders — markup and table cannot drift. |
| `aggregateRating` on `/products/silver` | **Left out deliberately** | The `4.8/120` figure on that page belongs to **other** products in the "Most Popular Software" sidebar block; Silver is not in that list and has no rating of its own. Marking it up would be fabricated social proof. **Blocked on the owner confirming the 120 reviews are about Silver specifically AND the rating being visibly displayed on `/products/silver`** — neither is true today. |
| TSS marked up as a service | **Keeps `Product`** | TSS is a Tally **product** that delivers a service — fixed price, fixed duration, SKU-like identity. Re-typing it would lose the price rich result for no gain. |

Built-HTML end state (verified in the isolated build, **zero forbidden fields on every page**):

| Page | Product | Offers | Rating |
| :--- | :--- | ---: | :--- |
| `/products/tallydrive` | TallyDrive Extra Storage (10 GB) | 1 @ 1200, `itemOffered` present | none |
| `/products/silver` | TallyPrime Silver (Single User) | 1 @ 26550 | none |
| `/products/gold` | TallyPrime Gold (Multi-User) | 1 @ 79650 | 4.8 / 120 |
| `/products/server` | TallyPrime Server (Client-Server) | **0** (page shows no price — "Contact Sales") | 4.7 / 85 |
| `/services/tss` | Tally Software Services | 6, each with `itemOffered` | none |

The rationale for the three permanent omissions lives in a **comment block directly above `productJsonLd()` in `lib/seo.ts`**, precisely because an absent field otherwise looks like an oversight in code review.

#### 31.2 NEW guard — `scripts/schema-audit.mjs`

Static, dependency-free, no network, no build: **`npm run check:schema`**, and the **third** entry in `test:all` (`h1` → `seo` → **`schema`** → `insights-svg` → …). Seven rule groups: one Product builder only (`lib/seo.ts`) · `itemCondition` on every Offer · the three omitted fields appear **nowhere** in `app/` or `lib/` (comment-stripped, so the explanatory comment is allowed) · `aggregateRating` **allowlist only** (gold 4.8/120, server 4.7/85) with the numbers matching **and** being visible on that product's page · silver/tallydrive/tss **forbidden** from `aggregateRating` · `/products/server` must emit **no** Offer while every priced page must emit one · prices must derive from `payablePaise / 100` (no literals), TallyDrive's node name must match its Offer, TSS Offers must carry `itemOffered`, `sku`s unique.

**Negative-controlled** (a guard that has never failed is not a guard): injected `hasMerchantReturnPolicy` → **FAIL**; gave Silver an `aggregateRating` + a hardcoded `26550` → **4 FAILs**; both restored → **PASS**. Writing it surfaced one real edge case — the first version demanded the TallyDrive node name be a *prefix* of the Offer name and failed on the legitimate duration qualifier, so it now compares names with **parentheticals stripped**.

#### 31.3 The factual audit — four unverified TSS claims, removed everywhere

The same four claims were repeated across the **entire** TSS cluster (news, lessons, Sara, the AI prompt): a **"roughly 15 days before expiry"** window · **"2 Years = 10% discount"** · **"one extra month of validity"** for renewing early · the new date **"syncing back into Tally automatically"**. **None of the four are published by Tally:** `Alt+R (Manage TSS Renewal)` simply *appears* "when your TSS renewal is due", the duration choice is 1 or 2 years with **no advertised discount**, and the licence must be **updated** from `Manage License` before the new end date shows. All four are now gone from every surface.

**8 of 22 news posts rewritten** (the other 14 were read and left unchanged; none added, none removed):

| Slug | Chars | Corrected |
| :--- | ---: | :--- |
| `how-to-renew-tally-tss-offline` | 1725 → 2526 | Serial number now from `F1 (Help) > Settings > License > Manage License` (was "F1 > About" — the product-info screen, **not** the licence screen); post-payment licence-update step; ERP 9 closure; bonus-validity claim removed; **also fixed a non-ASCII em dash in the description**, which has corrupted this seed before. |
| `tally-tss-expiry-meaning` | 1544 → 2794 | Correct plural product name; real Manage License path; **rental vs perpetual** split added (the old "Tally keeps working" answer was only true for perpetual — a **rental** licence *does* stop when its own period ends); ERP 9 closure. |
| `how-to-check-tss-expiry-date-tallyprime` | 1376 → 1854 | Expiry is at `F1 > Settings > License > Manage License`, not "Help > About"; Alt+R appears on the Gateway once renewal is due; the date only moves after the licence is updated. |
| `tally-tss-renewal-2026` | 1442 → 2871 | All four claims removed; ERP 9 discontinuation (**16 August 2026**) given its own section with the free-upgrade condition (**TSS active on or after 9 November 2020**). |
| `tallydrive-cloud-backup` | 1411 → 2242 | Free allowance vs paid pack separated — the page implied the whole product was a purchase. |
| `how-to-lock-data-in-tallyprime` | 3037 → 4226 | User Access Control is `Alt+K (Company) > Alter` then `F12 > Use User Access Control = Yes` (**not** a standalone menu); cut-off date + "Days Allowed for Back Dated Vouchers"; separate `Alt+K > Password Policy`; `F12 > Set Edit Log Applicability` (2.1+); TallyVault stated as unrecoverable. |
| `how-to-add-gst-number-in-tally-erp-9` | 2269 → 3100 | GST needs `F11: Features > F3: Statutory & Taxation` with **both** GST = Yes **and** "Set/alter GST details" = Yes — the second is what opens the GST Details screen, and the old post omitted it. Company GSTIN, state-code check, party-ledger GST details added. |
| `tally-5-star-partner-mumbai` | 2492 → 3274 | Tiers corrected to Tally's own wording: exactly **two** Certified tiers (**3-Star**, **5-Star**); **Associate** partners only make the product available and do not implement/train/support; **GVLA** is a separate Government/Very-Large-Account segment, **not** a rung above 5-Star. The old post described a ladder that does not exist. |

**5 of 16 Tally Insights lessons corrected:**

| Lesson | Was | Now |
| :--- | :--- | :--- |
| `tally-prime-shortcuts-complete-list` | Two keys simply wrong (`F1` to switch companies, `Ctrl+F` for search) and the note vouchers swapped. | `F3` switches open companies · `Alt+F` find bar · `Ctrl+F` autofill voucher · `Ctrl+N` calculator · `Ctrl+G` Switch To · Debit Note `Alt+F5` / Credit Note `Alt+F6`. Verified against Tally's official reference; the full official list renders as searchable tables. |
| company creation | Implied a non-existent entry path. | `Alt+K (Company)`, with `F3` / `Alt+F3` / `Ctrl+F3` explained in an FAQ. |
| payroll | Described a "Payroll Features" screen that does not exist, and framed payroll as needing an add-on. | Payroll is **native**: `F11 > Show more features > Maintain Payroll`; Employee Group / Employee / Pay Head / Salary Details masters; Attendance voucher; Payroll `Ctrl+F4`. An HRMS is only for self-service/biometric/HR workflows — **not** for calculating salary. |
| TSS / licensing | Same four unverified claims. | Manage License paths, licence-update step, ERP 9 closure, no bonus validity, rental distinction. |
| offline TSS renewal | Same. | Same corrections + the serial-number source. |

Lesson bodies stay **ASCII-only**, `bodyMd` literals stay **double-quoted**.

#### 31.4 Sara (Ask + Learn) and the chat system prompt

The same four claims were live in the assistant, so a customer could be told them **in chat**. Corrected in `app/api/chat/route.ts` (TSS block now forbids day counts/discounts/bonus months, adds the licence-update step, the 16 Aug 2026 ERP 9 closure and the rental distinction), in `lib/sara-topics.ts` (TSS topic + both follow-ups + both teaching fallbacks; the payroll fallback now points at `Maintain Payroll`; the reports fallback uses `Alt+F12` filter / `Alt+F` find; the shortcut fallback corrected; a literal `\-` escape typo in the journal answer fixed), and the **HRMS fallback pattern was narrowed** from `payroll|salary|employee|attendance` to genuine HR-process terms so a payroll question can no longer be answered with an HRMS sales pitch. `scripts/sara-topics-test.mjs` gained a **"TSS facts (verified against TallyHelp)"** section → **49/49** (was 37), so this drift class now fails the suite instead of reaching a customer.

#### 31.5 Seeded + verified live

`seed_news.mjs` compares `content`, `description`, `date`, `title`, `tags` and `faqs`, so all 8 rewrites propagate: **inserted 0, updated 8, skipped 14, removed 0, total 25 docs** on cluster `sarvadnya.zvdcpsj.mongodb.net` / db **`test`** (re-confirmed by reading the **old live wording** out of that DB and matching it to the live site before seeding). Live on `sarvadnyainfotech.com`: "extra validity" **0 occurrences** (was present pre-seed) · "16 August 2026" present · "Manage License" present · "update the licence" ×3 · NewsArticle JSON-LD present · FAQPage present where `faqs` exist and **correctly absent** on the offline post, which has none by design. `npm run test:news-verify` → **16/16**.

#### 31.6 Verification

`typecheck` **exit 0** · `check:h1` / `check:seo` / `check:schema` / `check:insights-svg` / `check:demo` **PASS** (only pre-existing SEO description-length warnings) · `security:check` **ALL CHECKS PASSED** · `npm run build` **exit 0** in the isolated copy **`/tmp/opencode/build-check-1026`** (never in the working repo — §9) with the built HTML inspected per page · suites green: sara-local **49/49**, sara-guard **51/51**, sara-catalog **37/37**, cart **32/32**, order-status **36/36**, dates **9/9**, payments **45/45**, payments-gateway **26/26**, seo-links **18/18**, referral **19/19**, news-verify **16/16** · `test:all` stopped once at the **known deployed-site LLM flake** ("Off-syllabus TSS content leaked into a stock answer"), then `test:sara` passed **19/19** on retry — the documented §18 non-determinism, unrelated to this work.

#### 31.7 Found but NOT changed — owner decision needed

**Three legacy news documents have no `slug` field at all.** They are pre-seed admin-added rows that `scripts/seed_news.mjs` **cannot manage** (it upserts by slug), so this audit could not correct them and no seed run will ever touch them:

| Title | Problem |
| :--- | :--- |
| *ERP 9 is set to change significantly from 1st July 2026* | Now **actively wrong**: urges "Renew now at existing rates or pay almost double later… Current Renewal (Till 30 June 2026)" — but TSS renewal on Tally.ERP 9 was **discontinued for all customers from 16 August 2026**, so there is no renewal left to buy at any rate. **This is the one that needs action.** |
| *New TallyPrime v7.0 Released with Advanced AI Features!* | Unverifiable marketing copy (AI cash-flow prediction, auto expense categorisation). Not contradicted as such, but not something we can stand behind. |
| *Upcoming Webinar: Optimizing Your Supply Chain…* | Dated August 2026, points at `/tutorials` — an expired announcement. |

They also carry no `seoTitle`, `tags` or `faqs`, and their URLs derive from the title. Options: **delete**, **rewrite as proper seed posts**, or **leave** — the owner's call.

#### 31.8 Don't break

- The three omitted Offer fields are **decisions, not TODOs**. Read the comment block above `productJsonLd()` in `lib/seo.ts` before "fixing" a GSC recommendation, and keep `check:schema` green.
- `aggregateRating` may only exist where the page **visibly** shows that product's **own** rating (gold 4.8/120, server 4.7/85 — the only two).
- `/products/server` must never gain an Offer while the page shows no price.
- Prices in markup must always derive from `payablePaise / 100` — the same server-authoritative figure the page renders.
- TSS facts have exactly one correct form and are **pinned** in `scripts/sara-topics-test.mjs`. If Tally publishes a change, update the fact **and** the assertions together.
- News seed content stays **ASCII-only** — a non-ASCII description has silently corrupted this file before.
- The **return policy stays unpublished** — never in frontend copy, never in an email, never in structured data.

#### 31.9 Still open

1. **Silver `aggregateRating`** — only mark it up if the owner confirms the 120 reviews are genuinely about Silver *and* the rating is displayed on `/products/silver`.
2. **`shippingDetails` / `priceValidUntil`** — deferred with the Part C pricing discussion.
3. **Sara as an SEO/backlink asset** — plan proposed, awaiting answers: one real URL per Sara topic with `/learn-sara` flipped off `noindex`, one genuinely useful free tool (recommended: **TSS expiry checker**), optionally an embeddable widget. Explicitly **not** doing: indexing individual AI answers (thin, unstable content that would compete with the curated lessons). Sequencing is deliberate — correctness first, then indexable pages.
4. **The owner's pasted audit was truncated** at "…enabling security for an existing company is done via" — any tail findings are not covered.
5. **The nested admin cluster** (`ac-1nfykty…`) was **not** seeded (cosmetic parity only — the nested repo has no `app/(site)/` for this content).
6. **Not committed, not pushed** — awaiting authorisation.
