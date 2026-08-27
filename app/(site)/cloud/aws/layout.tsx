import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "TallyPrime on AWS Cloud",
  description: "Run TallyPrime on AWS Cloud — work from any laptop, on any device, without maintaining a server. Free setup, automatic backups, AES-256 encryption & unlimited users.",
  path: "/cloud/aws",
  keywords: ["tally on aws", "tallyprime aws cloud", "tally cloud", "tally aws cloud", "tally cloud server"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}