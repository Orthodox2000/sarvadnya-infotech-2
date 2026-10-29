import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Access TallyPrime From Anywhere",
  description: "Run TallyPrime on AWS, Oracle Cloud or Windows Server. Affordable plans, daily backups, AES-256 encryption.",
  path: "/cloud/tallycloudaccess",
  keywords: ["tally cloud access", "tallyprime cloud", "tally on cloud", "tally cloud", "tally cloud server", "tally aws oracle cloud"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}