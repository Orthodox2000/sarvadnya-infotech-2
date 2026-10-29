import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Run TallyPrime on AWS Cloud",
  description: "Work from any laptop with no server to maintain. Free setup, automatic backups, AES-256 encryption.",
  path: "/cloud/aws",
  keywords: ["tally on aws", "tallyprime aws cloud", "tally cloud", "tally aws cloud", "tally cloud server"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}