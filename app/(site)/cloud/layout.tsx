import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "Tally Cloud Access & Backup Solutions",
  description: "Access TallyPrime from anywhere, on any device, powered by AWS, Oracle Cloud, and Windows Server. TallyCloudAccess, Backup for Tally & more with affordable pricing.",
  path: "/cloud",
  keywords: ["tally on cloud", "tally cloud", "tally cloud access", "cloud backup for tally", "tally aws", "tally windows cloud"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}