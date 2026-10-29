import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-09-07 — JS-only shell, noindex to clear GSC "not indexed" rows.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR. The page stays noindex
// (a search results page should not be indexed); this is purely for shares and the browser tab.
export const metadata = seoMetadata({
  title: "Search Tally Products & Guides",
  description: "Search Tally products, services, add-ons, modules, tutorials and guides across the Sarvadnya Infotech website.",
  path: "/search",
  keywords: ["sarvadnya search", "site search", "search tally", "tally search"],
  noindex: true,
  // CHANGE: 2026-10-29 — noindex utility: no sales tail needed (see lib/seo.ts `contactSuffix`).
  contactSuffix: false,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
