import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Master TallyPrime With Tutorials",
  description: "Professional guides, webinars and technical documentation to master TallyPrime and scale your business.",
  path: "/tutorials",
  keywords: ["tally tutorials", "learn tally", "tallyprime training", "tally videos", "tally guides"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
