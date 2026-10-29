import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Do More With Tally: Cloud & HRMS",
  description: "Cloud access, TallyDrive backup, HRMS and TallyCapital financing — add-ons that extend what TallyPrime does.",
  path: "/do-more",
  keywords: ["do more with tally", "tally cloud access", "tallydrive", "tally hrms", "tallycapital"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
