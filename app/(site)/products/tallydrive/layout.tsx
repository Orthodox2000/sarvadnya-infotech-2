import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Back Up Tally With TallyDrive",
  description: "TallyDrive backs up your TallyPrime data to a secure cloud vault, AES-256 encrypted, with instant 1-click restore.",
  path: "/products/tallydrive",
  keywords: ["tallydrive", "tally backup", "tally cloud backup", "tally data recovery", "tallydrive restore"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
