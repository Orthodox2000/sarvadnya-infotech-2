import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-10-05 — keywords now include the candidate-portal terms the redesigned page targets
// ("candidate login", "create account"), since sign-in is now visible on /careers itself.
// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-09-17 — keywords refreshed for the new Sales/Marketing/CRE openings.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Apply for Tally & Cloud Jobs",
  description: "Join our Tally and cloud team in CBD Belapur. Open roles in sales, support and marketing — apply online today.",
  path: "/careers",
  keywords: ["sarvadnya careers", "business development jobs mumbai", "marketing jobs navi mumbai", "customer relations jobs", "join sarvadnya", "candidate login", "careers portal"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
