import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "Do More with Tally",
  description: "Powerful solutions built for TallyPrime to enhance your business — cloud access, TallyDrive backup, HRMS, and TallyCapital financing.",
  path: "/do-more",
  keywords: ["do more with tally", "tally cloud access", "tallydrive", "tally hrms", "tallycapital"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
