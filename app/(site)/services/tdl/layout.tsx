import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
export const metadata = seoMetadata({
  title: "TDL Customization for Tally",
  description: "Don't change your business to fit Tally. We build custom invoice formats, automated reports, and security controls to save you hours of manual work.",
  path: "/services/tdl",
  keywords: ["tdl customization", "tally customization", "custom invoice formats", "tally reports", "tally development"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
