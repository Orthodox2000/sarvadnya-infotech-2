import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title (adds a "60 seconds" promise already implied by the
// wizard) + tightened description for CTR.
export const metadata = seoMetadata({
  title: "Find Your Tally Setup in 60 Seconds",
  description: "Answer a few questions and we recommend the right Tally edition, cloud setup or module for your business.",
  path: "/find-solution",
  keywords: ["find solution", "tally recommendation", "business consultation", "tally setup", "tally advisor"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
