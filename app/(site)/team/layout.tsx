import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Meet Your Tally Support Team",
  description: "The people behind Sarvadnya Infotech — a team that simplifies business technology and builds lasting relationships.",
  path: "/team",
  keywords: ["sarvadnya infotech team", "tally consultants", "tally experts", "tally support team"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
