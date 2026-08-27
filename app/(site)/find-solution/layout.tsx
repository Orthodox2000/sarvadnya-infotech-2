import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "Find Your Tally Solution",
  description: "Answer a few focused questions and we will recommend the most suitable Tally setup for your business.",
  path: "/find-solution",
  keywords: ["find solution", "tally recommendation", "business consultation", "tally setup", "tally advisor"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
