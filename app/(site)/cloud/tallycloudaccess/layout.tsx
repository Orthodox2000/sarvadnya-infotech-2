import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-11-03 — GSC 28d: 317 impressions (plus 57 on the www variant), 0 clicks, position
// 4.5. The visible query IS the product phrase — "tallycloudaccess" (372 impressions, position
// 3.6, 0 clicks) and "tally cloud access" (179, 0) — but the Oct-29 title ("Access TallyPrime
// From Anywhere") contained neither, so a searcher who typed the product name never saw it in
// the snippet. Query first, action second.
export const metadata = seoMetadata({
  title: "Tally Cloud Access: Run TallyPrime Anywhere",
  description: "Tally Cloud Access on AWS, Oracle or Windows Server: same TallyPrime screens from any device, daily backups.",
  path: "/cloud/tallycloudaccess",
  keywords: ["tally cloud access", "tallycloudaccess", "tallyprime cloud", "tally on cloud", "tally cloud", "tally cloud server", "tally aws oracle cloud"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}