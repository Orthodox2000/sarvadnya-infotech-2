import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "TallyDrive Cloud Backup",
  description: "TallyDrive automatically backs up your TallyPrime accounting data to a secure cloud vault. AES-256 encrypted with instant 1-click restore.",
  path: "/products/tallydrive",
  keywords: ["tallydrive", "tally backup", "tally cloud backup", "tally data recovery", "tallydrive restore"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
