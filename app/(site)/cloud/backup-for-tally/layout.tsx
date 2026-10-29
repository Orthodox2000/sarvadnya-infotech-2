import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Back Up Tally Automatically",
  description: "Automated TallyPrime backup with centralised management and 1-click restore. Protect your books from data loss.",
  path: "/cloud/backup-for-tally",
  keywords: ["backup for tally", "tally cloud backup", "tally backup", "tally data backup", "disaster recovery tally", "tallydrive backup"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}