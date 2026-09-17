import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-09-17 — keywords refreshed for the new Sales/Marketing/CRE openings.
export const metadata = seoMetadata({
  title: "Careers at Sarvadnya Infotech",
  description: "We're on a journey to empower SMEs with cutting-edge Tally and Cloud solutions. If you're passionate about technology and problem-solving, we'd love to have you on board.",
  path: "/careers",
  keywords: ["sarvadnya careers", "business development jobs mumbai", "marketing jobs navi mumbai", "customer relations jobs", "join sarvadnya"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
