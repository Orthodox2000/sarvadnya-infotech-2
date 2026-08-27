import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "Terms & Conditions",
  description: "The terms and conditions governing use of the Sarvadnya Infotech LLP website, Tally customization, implementation, and support services.",
  path: "/terms",
  keywords: ["terms and conditions", "terms of use", "sarvadnya terms", "tally terms"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
