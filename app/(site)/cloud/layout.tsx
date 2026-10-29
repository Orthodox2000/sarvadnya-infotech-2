import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Move Tally to Cloud, Work Anywhere",
  description: "Run TallyPrime on AWS, Oracle Cloud or Windows Server. Access from any device, with daily backups included.",
  path: "/cloud",
  keywords: ["tally on cloud", "tally cloud", "tally cloud access", "cloud backup for tally", "tally aws", "tally windows cloud"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}