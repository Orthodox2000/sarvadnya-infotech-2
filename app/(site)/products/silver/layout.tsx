import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "TallyPrime Silver — Single User Tally Software",
  description: "TallyPrime Silver for one user — billing, inventory, and tax compliance with your data kept 100% private on your own computer.",
  path: "/products/silver",
  keywords: ["tallyprime silver", "tally single user", "tally for small business", "tally billing software", "tallyprime price"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
