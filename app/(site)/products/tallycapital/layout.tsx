import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "TallyCapital Business Loans — Financing Inside TallyPrime",
  description: "TallyCapital business loans for MSMEs, integrated inside TallyPrime. Compare lender offers, check eligibility in 60 seconds, and get funds in 72 hours.",
  path: "/products/tallycapital",
  keywords: ["tallycapital", "tally business loan", "msme loan", "unsecured business loan", "tally capital financing"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
