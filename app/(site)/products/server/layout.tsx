import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "TallyPrime Server — Enterprise Tally Software",
  description: "TallyPrime Server brings enterprise-grade, multi-threaded data management to Tally — true concurrent access, zero downtime, and full audit control.",
  path: "/products/server",
  keywords: ["tallyprime server", "tally server", "tally enterprise", "tally audit trail", "tally TVU", "tally concurrent access"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
