import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Check TallyCapital Loan Eligibility",
  description: "MSME business loans inside TallyPrime. Compare lender offers, check eligibility in 60 seconds, get funds in 72 hours.",
  path: "/products/tallycapital",
  keywords: ["tallycapital", "tally business loan", "msme loan", "unsecured business loan", "tally capital financing"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
