# Biweekly Report (June 22 - July 4, 2026)

## Summary
This period focused on a major product structure expansion, global green theme rebrand, comprehensive performance/caching overhaul, AI API upgrades, and extensive mobile UI/UX refinements. The application was promoted from v1.1.380 to v1.1.402+.

## Changes from Last Report (June 15-21)
- **Scope:** Expanded from consultation engine formalization + AI strategic insights → full product independence, brand-wide green rebrand, caching removal, 5+ new routes, AI model upgrades
- **New Routes:** 5 new pages created (`/colour`, `/cloud/aws`, `/cloud/windows`, `/cloud/nosky`, `/products/tallydrive`) — 0 new routes in prior period
- **Branding:** Complete blue→green rebrand across 23+ files — prior period stayed on blue palette
- **AI:** Upgraded from `llama-3.3-70b` → `openai/gpt-oss-120b` + `<think>` stripping — prior period focused on integration, not model upgrades
- **Performance:** Caching fully disabled (was previously adding cache); API timeouts, rate limiting, pool tuning implemented
- **Mobile:** HomeHero height/padding fixed, SupportButton redesigned, overflow clipping removed site-wide
- **Pages affected:** 30+ files modified vs ~10 in prior period

## Highlights
- **Product Expansion:** Created 5 new routes (`/colour`, `/cloud/aws`, `/cloud/windows`, `/cloud/nosky`, `/products/tallydrive`). Fully rewrote Gold/Server as independent pages. Cleaned Silver of cross-edition references.
- **Green Theme Rebrand:** Replaced all blue (`#00ABE4`, `#0371a3`) with green (`#316852`, `#1e4d3a`) across 23 files — product pages, cloud pages, footer, homepage components, shared components.
- **Performance Overhaul:** Caching completely disabled (client, server, CDN), API rate limiting (60 req/min), MongoDB pool tuned (10→25), AbortController timeouts (25s), Chat/Search API resilience hardening.
- **AI Upgrades:** Models upgraded to `openai/gpt-oss-120b` and `qwen/qwen3-32b`. Regex pipeline to strip `<think>` reasoning blocks from all AI outputs.
- **UI Refinements:** SupportButton pill→tab conversion, HomeHero green/golden theme + mobile height/padding fixes, letter-by-letter typing animation for Ask Sara modal, overflow clipping removed site-wide.
- **Asset Optimization:** Compressed `TallyCertificate.png` 2.0MB → 440KB (78% reduction).

## Workstream Breakdown

### Product Structure (June 22-23)
- Product page independence — Silver cleanup, Gold/Server independent rewrites
- 5 new routes created (colour tool, AWS, Windows VM, NoSky, TallyDrive)
- Cloud hub remade as solution-based navigation
- ModuleCard redesigned to square/cute layout

### Performance & Caching (June 24)
- Client-side `fetchWithCache` → direct fetch
- Server-side `unstable_cache` / `revalidateTag` removed entirely
- CDN cache headers commented out
- Proxy consolidation (`middleware.ts` deleted → `proxy.ts`)
- Chat API: 25s timeout, response cache, model fallback, prompt trimmed
- Search API: static page matching, reduced AI dependency
- MongoDB: pool 10→25, timeouts tightened

### Brand Transformation (June 29 - July 1)
- Green theme rebrand across all product, cloud, and component files
- Navbar → off-white theme with `#316852` underlines
- Footer → dark green gradient
- Brand icons standardized (Tally, AWS, NoSky, HRMS, etc.)
- "Free Demo" → "Get Demo" across 8 pages

### Mobile & UI Fixes (July 2)
- SupportButton: pill→vertical tab style, homepage-only mobile offset
- HomeHero: mobile height fix (`min-h-[20rem]`), padding reduction, arrow spacing
- Site-wide overflow clipping removed from html/body

### AI & Animation (July 3)
- Model upgrades to `openai/gpt-oss-120b` / `qwen/qwen3-32b`
- `<think>` tag stripping across all AI routes
- Letter-by-letter typing animation for Ask Sara
- Navbar logo stabilization (hydration fix)

### UI Refinements, Green Extension & Security (July 4)
- **Navbar buttons & searchbar**: `rounded-full` to `rounded-lg` (squarish) across all nav elements
- **Smart Suggest**: Added SVG star icon + label; visibility fixed to lg breakpoint (was hidden until xl)
- **SearchBar**: +25% width increase, mobile menu drawer integration, redesigned submit button (magnifying glass + "Search" text, focus-only, slides in from left)
- **Careers button**: Green font/border (`#316852`), white bg, `border-[0.5px]` thin border
- **Palette link**: Moved to left of SearchBar in desktop nav
- **Green theme — Services page**: `#0371a3`/`#00ABE4` replaced with `#316852`/`#1e4d3a` across entire page (headers, cards, buttons, popups, contact section)
- **Green theme — Contact page**: Same replacement + form focus rings, button gradients, decorative elements
- **Productbar scroll**: Removed conflicting `wheel` listener; only scroll handler with 30px threshold (clean 2-state)
- **Typing animation speed**: `letterPop` 300ms to 120ms; device-aware reveal (mobile 15ms/3chunk, desktop 10ms/4chunk)
- **Prompt injection security**: 8 regex patterns on server + client + SECURITY directive in system prompt
- **Monthly report**: Restructured Key Achievements to 4 columns (Category, What Was Done, Why, Impact)

## Files Modified
30+ files across product pages, cloud pages, components, API routes, configuration, and assets.

## Build Status
Stable — multiple production-verified builds.
