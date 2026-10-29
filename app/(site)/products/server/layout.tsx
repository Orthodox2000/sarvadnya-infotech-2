import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Get TallyPrime Server for Your Team",
  description: "Enterprise-grade, multi-threaded data management with true concurrent access, zero downtime and full audit control.",
  path: "/products/server",
  keywords: ["tallyprime server", "tally server", "tally enterprise", "tally audit trail", "tally TVU", "tally concurrent access"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
