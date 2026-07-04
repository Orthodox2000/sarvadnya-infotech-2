# Monthly Report (June 1 — July 4, 2026)

**Version:** v1.1.330 → v1.1.402+

---

## What Got Done

| Area | What Changed | Why | Impact |
|------|-------------|-----|--------|
| Voice Engine | Switched to `recorder-js`, fixed hook crash, added mic status badges | Safari/iOS recording was broken | Voice features now work across all browsers |
| Consultation | Documented full flow in `CONSULTATION_FLOW.md`, added AI strategic insights | Needed a clear blueprint for the Find Solution tool | Devs can now understand/maintain the 4-phase flow |
| Product Pages | 5 new routes (`/colour`, `/cloud/aws`, `/cloud/windows`, `/cloud/nosky`, `/products/tallydrive`) | Business needed dedicated pages for each offering | Customers can now see each product separately |
| Cross-Edition Links | Removed all upgrade/comparison references from Silver, Gold, Server | Products should stand on their own | Cleaner independent product pages |
| Caching | Removed all caching (client, server, CDN) | Every request must return fresh data | Slower but always accurate responses |
| Rate Limiting | Added 60 req/min per IP via proxy.ts | Prevent API abuse | API is now protected from spam |
| MongoDB | Pool 10→25, timeouts tightened | Traffic spikes were bottlenecking on 10 connections | Better performance under load |
| Brand Colors | Changed ALL blue (`#00ABE4`) to green (`#316852`) across 23+ files | Client requested green theme | Consistent brand identity everywhere |
| Navbar | Switched from dark navy to off-white theme | Too dark/harsh for a professional brand | Cleaner, more modern look |
| SupportButton | Converted pills to vertical tabs on right edge | Floating pills were overlapping content | Cleaner UI, no overlap |
| Hero Section | Fixed mobile height, padding, arrow spacing | Hero was too tall on mobile | Fits properly on phone screens |
| Overflow | Removed `overflow-x: clip` from html/body | Was cutting off fixed-position buttons | WhatsApp/Ask Sara buttons now visible |
| AI Models | Upgraded to `openai/gpt-oss-120b` + `qwen/qwen3-32b`, added `<think>` stripping | Older models weren't powerful enough | Smarter responses, no reasoning leak |
| Typing Animation | Added letter-by-letter pop animation to Ask Sara | Chat felt static/boring | More engaging chat experience |
| Asset Optimization | Compressed `TallyCertificate.png` 2.0MB → 440KB | File was loading slow | 78% smaller, faster page load |
| QuickAccessHub | Fixed right-side overflow (added `overflow-hidden`) | Decorative glow was causing horizontal scrollbar | No more right-side scroll on homepage |
| Productbar | Fixed scroll-hide for mobile touch | Hide/show was janky on phones | Smooth hide/show on scroll |
| Navbar Radius | All buttons + searchbar `rounded-full` to `rounded-lg` | Pill shapes looked unprofessional | Squarish clean look |
| Smart Suggest | SVG star icon + label added to nav; visibility fixed to lg breakpoint | Brand wanted an AI-finder with visual icon | Visible on all desktop sizes |
| SearchBar | +25% width, mobile menu drawer integration, focus-only "Search" submit button | Users didn't know Enter submits; missing on mobile | Clickable Search text, works everywhere |
| Careers Button | Green font/border, white bg, `border-[0.5px]` | Stand out with brand alignment | Matches green theme |
| Services/Contact Pages | Full green theme conversion (`#0371a3` to `#316852`, `#00ABE4` to `#1e4d3a`) | Pages were missed in initial rebrand | Consistent green everywhere |
| Productbar Scroll | Removed conflicting wheel handler | Two handlers caused jittery toggle | Clean 2-state, no jitter |
| Typing Speed | `letterPop` 300ms to 120ms; device-aware reveal timing | Slow on desktop, fast on mobile | Balanced across all devices |
| Prompt Injection | Regex patterns (server+client) + SECURITY directive in system prompt | User extracted prompt via injection | Injections blocked with polite redirect |

---

## Files Changed (by Area)

```
Product pages (new):  5 files   — /colour, 3 cloud sub-pages, TallyDrive
Product pages (edit): 4 files   — Silver, Gold, Server, Products hub
Cloud pages (edit):   2 files   — Cloud hub, cloud sub-pages
Components:           14+ files — HomeHero, Navbar, Footer, SupportButton, Productbar, SearchBar, QuickSupportModal etc.
API routes:           7 files   — chat (injection security), search, settings, content, news, strategic-insight, admin/login
Config:               3 files   — proxy.ts, next.config.js, lib/mongodb.ts
Assets:               1 file    — TallyCertificate.png
Security:             2 files   — lib/admin-auth.ts, lib/api-security.ts
Documentation:        3 files   — CONSULTATION_FLOW.md, daily logs, .env.example
```

---

## Future Changes Needed

| Priority | What | Why |
|----------|------|-----|
| High | Re-enable caching properly | Current no-cache setup is slow for repeat visitors — need smart cache with admin-panel purge button |
| High | Fix remaining mobile layout issues | Productbar, hero buttons, and support buttons still have edge-case bugs on small screens |
| Medium | Add loading/skeleton states | Pages render empty while data fetches — users see blank screens |
| Medium | Admin panel polish | Forms are functional but rough — needs better validation feedback and mobile support |
| Medium | Write tests | Zero test coverage — risky to deploy without automated checks |
| Low | Image optimization | Several product images are still large/uncompressed — should automate compression |
| Low | Accessibility audit | Need to check contrast, focus states, screen reader support |
| Low | Performance budget | Set targets for Lighthouse scores and monitor regressions |
