# 2026-11-02 — Modules: individual pages, "More Details" → real routes, CTR-focused SEO + sitemap, modal commented

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Area | Detail |
| :--- | :--- |
| **Per-module routes** | New `app/(site)/modules/[slug]/page.tsx` (`slug = module.id\|\|_id`, `force-dynamic`, `generateStaticParams`). Hero with module image, breadcrumb, suited-for, demo/video/brochure, video block, brochure flow, **`ContainerSimulator.tsx`** (3-screen TallyPrime mock), pillars/features/steps/benefits/FAQs, CTA, related modules. JSON-LD: **BreadcrumbList + FAQPage**. `generateMetadata` uses `seoMetadata()` with module image (OG+Twitter). |
| **Content** | `lib/module-details.ts`: `CONTAINER_HANDLING` curated from `public/brochures/container-handling-module-brochure.pdf` (Rs. 18,000, 6 FAQs, simulator). `detailFromModule()` fallback for DB-only modules + new **`META_OVERRIDES`** + word-boundary `clampDescription()` / `metaTitleFor()`. |
| **Components** | `app/components/modules/{ContainerSimulator,ModuleVideo,ModuleCta}.tsx`. `ModuleVideo` poster-first `youtube-nocookie`. `ModuleCta` price toggle + `UnifiedContactModal destination="modules"` + WhatsApp/phone. |
| **Link migration** | `lib/modules.ts` `moduleHref()`. `ModuleCard` → **`<Link>` "More Details"** (was modal). `app/(site)/modules/page.tsx` drops `ModuleModal` state/import. `lib/product-nav.ts`, `Footer`, `app/api/search/route.ts`, `lib/sara-catalog.mjs`, `lib/sara-topics.ts` → `/modules/<id>`. |
| **Sitemap / CSP** | `app/sitemap.ts` adds each module with `lastModified` from `updatedAt`/`createdAt`, dedup, **priority 0.8**. `next.config.js` `frame-src` allows `youtube.com`/`youtube-nocookie.com`. |
| **CTR SEO** | `/modules` listing title → `TallyPrime Industry Modules — Add Billing, LR & More`; its description and every module description were trimmed so copy + the 38-char contact suffix stays **<= 160** (container 116+38=154, listing 120+38=158, CFA 147, society 156, agent 138, transport 143, garment 149). Individual modules get action titles + outcome descriptions from their own DB copy. `check:seo` reports only the known brand-truncation WARN. |
| **Modal** | `app/components/ModuleModal.tsx` **commented out, not deleted** per request, with header explaining retirement/restoration. |
