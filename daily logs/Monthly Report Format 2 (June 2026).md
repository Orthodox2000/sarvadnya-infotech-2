# Monthly Report — June 2026

## Summary Index

---

### 1. Reporting Period
> June 1 – July 4, 2026 Performance Report & July 2026 Planning

---

### 2. Key Achievements

| Category | What Was Done | Why | Impact |
|----------|--------------|-----|--------|
| **New Routes** | Created `/colour`, `/cloud/aws`, `/cloud/windows`, `/cloud/nosky`, `/products/tallydrive` | Business needed dedicated pages for each product/service | 5 new standalone pages live |
| **Product Independence** | Removed all cross-edition upgrade links from Silver, Gold, Server | Products should stand on their own without confusion | 4 product pages cleaner, no cross-references |
| **Brand Rebrand** | Global blue to green switch across 23+ files | Client requested green brand identity | Consistent green theme everywhere |
| **Brand Icons** | Replaced letter placeholders with actual brand images | Professional look — letters looked like placeholders | 10+ pages now show real logos |
| **AI Model Upgrade** | Chat to `openai/gpt-oss-120b`, Search to `qwen/qwen3-32b`, added `<think>` stripping | Older models weren't powerful enough | Smarter AI responses, no reasoning leak |
| **Voice Engine** | Migrated `MediaRecorder` to `recorder-js` | Safari/iOS recording was completely broken | Voice works across all browsers now |
| **API Security** | Created `admin-auth.ts`, `api-security.ts`, login route, env docs | No authentication or input validation existed | Admin login + sanitization in place |
| **Rate Limiting** | 60 req/min per IP in `proxy.ts`, deleted `middleware.ts` | No protection against API abuse | Backend is now rate-limited |
| **MongoDB Tuning** | Pool 10 to 25, timeouts tightened | Traffic spikes were bottlenecking on 10 connections | Better performance under load |
| **Chat Resilience** | 25s timeout, response cache, model fallback (70B to 8B) | Chat API could hang for 60+ seconds with no fallback | No more hanging requests |
| **Search Optimization** | Static page matching, reduced AI calls, result caching | Every search triggered an expensive AI call | Faster results, lower cost |
| **Asset Compression** | `TallyCertificate.png` 2.0MB to 440KB | Large file was slowing page load | 78% smaller, faster load |
| **Typing Animation** | Letter-by-letter pop animation for Ask Sara | Chat felt static and boring | More engaging user experience |
| **SupportButton** | Redesigned pills to right-edge vertical tabs | Floating pills were overlapping page content | Clean UI, no overlap on mobile |
| **HomeHero** | Fixed mobile height, padding, arrow spacing | Hero was too tall and content was off-center on phones | Proper fit on mobile screens |
| **Overflow Fix** | Removed `overflow-x: clip` from html/body | Was cutting off fixed-position buttons like WhatsApp/Ask Sara | All floating buttons now visible |
| **QuickAccessHub** | Added `overflow-hidden` to section | Decorative glow was extending past viewport on hover | No more horizontal scrollbar on homepage |
| **Productbar** | Fixed scroll-hide using threshold-based scroll detection | Hide/show was janky/jittery on mobile touch | Smooth hide/show on scroll |
| **Search Bugfix** | Title equality to substring check for "no exact match" | Warning was showing even when results contained the search word | Accurate warning messages |
| **Navbar Radius** | All buttons + searchbar `rounded-full` to `rounded-lg` | Pill shapes looked unprofessional | Squarish, clean look across all nav elements |
| **Smart Suggest** | Added SVG star icon + "Smart Suggest" label to nav | Brand wanted an AI-finder link with visual icon | Visual star icon + always visible at lg breakpoint |
| **SearchBar UX** | +25% width, mobile visibility, focus-only "Search" submit button | Users didn't know Enter submits; missing on mobile | Clickable Search text appears on focus, slides in from left |
| **Careers Theme** | Green font/border (`#316852`), white bg, `border-[0.5px]` | Stand out as secondary CTA with brand alignment | Matches site green theme, thinner refined border |
| **Green Theme — Services** | `#0371a3` to `#316852`, `#00ABE4` to `#1e4d3a` across entire page | Services page was missed in initial rebrand | Consistent green throughout |
| **Green Theme — Contact** | Same replacement + form focus rings, gradients, shadows | Contact page was still using old blue scheme | Full green theme across form, map, social sections |
| **Productbar Scroll** | Removed conflicting `wheel` handler, kept only `scroll` with 30px threshold | Two handlers competed causing jittery hide/show | Clean 2-state, no jitter |
| **Typing Speed Fix** | `letterPop` 300ms to 120ms; device-aware reveal (mobile 15ms/3chunk, desktop 10ms/4chunk) | Slow on desktop, too fast on mobile | Balanced across all devices |
| **Prompt Injection** | Regex pattern detection (server + client) + SECURITY directive in system prompt | User extracted system prompt via chat injection | Injection attempts blocked with polite redirect |

---

### 3. Test Scripts Added

| Script | What It Does | Lines |
|--------|-------------|-------|
| `scripts/test_api.mjs` | Basic GET test to `/api/content?section=home_faq` — checks status + response body | 25 |
| `scripts/api-test.mjs` | Full API test suite: tests 12+ endpoints (content, modules, settings, partners, news, tutorials, search chat, admin auth) with pass/fail reporting | 156 |
| `scripts/qa_test.mjs` | QA smoke tests across 5 core endpoints using curl, outputs pass/fail per endpoint | 47 |
| `scripts/perf_test.mjs` | Latency benchmark: measures response time in ms for 5 endpoints | 31 |

**Total test coverage:** 4 scripts, ~260 lines — covers API routes, response status, and basic performance timing.

---

### 4. Security Additions

| File | What It Does |
|------|-------------|
| `lib/admin-auth.ts` | Token generation/verification, admin cookie management (24hr expiry, httpOnly, secure, sameSite) |
| `lib/api-security.ts` | Input sanitization, email/phone/ObjectId validation, required field checks, script tag stripping |
| `app/api/admin/login/route.ts` | POST endpoint — accepts API key, validates against `ADMIN_ACCESS_KEY` env var, sets admin session cookie |
| `app/api/chat/route.ts` | Added `INJECTION_PATTERNS` regex detection (8 patterns), SECURITY directive in system prompt, polite redirect on injection |
| `.env.example` | Documented `ADMIN_ACCESS_KEY` with generation command |
| `README.md` | Updated with setup instructions and security documentation |

**Chat Prompt Injection Protection:** Server-side regex catches "ignore previous", "reveal prompt", "act as", "pretend", "forget instructions", "new prompt" patterns. Client-side same check before sending. System prompt has explicit SECURITY directive refusing to reveal/modify/ignore instructions.

---

### 5. Pending Activities

| Priority | Item | Details |
|----------|------|---------|
| High | Zero test coverage | 4 test scripts exist but no CI integration, no unit tests for components |
| High | Caching re-implementation | Current no-cache setup is slow — need smart cache with admin purge button |
| High | Mobile edge-case bugs | Productbar, hero buttons, support buttons still have device-specific issues |
| Medium | Image optimization | 10+ product images still uncompressed, no automated pipeline |
| Medium | Admin panel polish | Forms lack validation feedback and mobile responsiveness |
| Medium | Security hardening | 4 security files + chat injection added but not integrated across all API routes |
| Low | Accessibility audit | No screen reader, contrast, or focus state testing done |
| Low | Performance budget | No Lighthouse targets or regression monitoring in place |

---

### 6. Observations

- **Mobile traffic is growing** — more users on phones than desktops, but bugs on mobile are harder to catch
- **Full cache removal was too aggressive** — responses are always fresh but noticeably slower; need a middle ground
- **Green rebrand is visually clean** but some blue edge-cases may remain in overlooked components
- **Test scripts exist but aren't automated** — they require a running server and manual invocation
- **Overflow fix had side effects** — removing `overflow-x: clip` fixed buttons but exposed other layout shifts
- **Chat injection is now blocked** — server + client regex prevents system prompt extraction

---

### 7. Challenges

| Challenge | Impact |
|-----------|--------|
| Balancing freshness vs speed after cache removal | Users wait longer for data |
| Mobile bugs hard to reproduce consistently | Fixes take longer to validate |
| Zero automated test coverage | Every deploy risks regressions |
| New AI models (gpt-oss-120b) cost more per request | Higher operational cost |
| Security files added but not integrated everywhere | Partial protection only |
| 4 test scripts but no CI pipeline | Tests exist but nobody runs them regularly |

---

### 8. Action Plan for July 2026

| Week | Focus |
|------|-------|
| Week 1 (July 5-11) | Re-implement smart caching (stale-while-revalidate) across 10 high-traffic API routes |
| Week 2 (July 12-18) | Write automated unit tests for 5 core API routes + 5 key components |
| Week 3 (July 19-25) | Full mobile QA pass across 10+ device/browser combos; fix remaining layout bugs |
| Week 4 (July 26-31) | Accessibility audit, image compression pass, CI pipeline for test scripts |

---

### 9. Focus for July 2026

- [ ] Re-implement caching with admin-panel purge button
- [ ] Write tests for 5 core API routes and 5 key components
- [ ] Set up CI pipeline to run test scripts automatically
- [ ] Complete mobile QA pass: Productbar, hero, support buttons
- [ ] Compress remaining 10+ uncompressed product images
- [x] Integrate security — chat injection protection added (server + client)
- [ ] Conduct accessibility audit (contrast, focus, screen readers)
- [ ] Set Lighthouse performance budget with regression alerts
