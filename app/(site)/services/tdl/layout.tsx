import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Get Custom TDL Built for Your Tally",
  description: "Custom invoice formats, automated reports and security controls that save hours of manual work in Tally.",
  path: "/services/tdl",
  keywords: ["tdl customization", "tally customization", "custom invoice formats", "tally reports", "tally development"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
