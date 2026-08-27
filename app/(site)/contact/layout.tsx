import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "Contact Us",
  description: "Have questions about Tally? Need a custom module? Our team is here to help you optimize your business workflows.",
  path: "/contact",
  keywords: ["contact sarvadnya", "tally support", "tally partner contact", "tally enquiry"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
