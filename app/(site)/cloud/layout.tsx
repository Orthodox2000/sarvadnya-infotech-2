import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
// CHANGE: 2026-11-03 — GSC 28d: /cloud 68 impressions, 1 click, position 5.2. "Move Tally to
// Cloud, Work Anywhere" is a verb phrase no searcher types; the hub now leads with
// "Tally on Cloud", the head term, and lets the child page own "tally cloud access".
export const metadata = seoMetadata({
  title: "Tally on Cloud: Hosting & Access",
  description: "Run TallyPrime on AWS, Oracle or Windows Server and open it from any device, with daily backups.",
  path: "/cloud",
  keywords: ["tally on cloud", "tally cloud", "tally cloud access", "cloud backup for tally", "tally aws", "tally windows cloud"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}