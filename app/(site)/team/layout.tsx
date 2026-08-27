import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "Our Team",
  description: "At Sarvadnya Infotech, our strength lies in our unity and our shared passion for simplifying business technology. We don't just solve problems; we build lasting relationships with our clients.",
  path: "/team",
  keywords: ["sarvadnya infotech team", "tally consultants", "tally experts", "tally support team"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
