import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
// CHANGE: 2026-11-03 — GSC 28d: /tutorials 20 impressions, 0 clicks. "Master TallyPrime With
// Tutorials" is not what anyone types; "tally tutorials" / "learn tally" are.
export const metadata = seoMetadata({
  title: "Tally Tutorials: Learn TallyPrime",
  description: "Step-by-step TallyPrime guides, webinars and technical documentation from a certified Tally partner.",
  path: "/tutorials",
  keywords: ["tally tutorials", "learn tally", "tallyprime training", "tally videos", "tally guides"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
