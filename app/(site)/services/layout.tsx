import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Get Expert Tally Services",
  description: "Certified technical expertise to architect, run and support your TallyPrime environment for maximum impact.",
  path: "/services",
  keywords: ["tally services", "tallyprime", "tally support", "amc", "tdl customization", "corporate training"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
