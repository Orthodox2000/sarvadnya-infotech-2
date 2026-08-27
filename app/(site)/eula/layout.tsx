import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "End-User License Agreement",
  description: "The End-User License Agreement (EULA) governing your use of software, custom TDL modules, mobile applications, and cloud services provided by Sarvadnya Infotech LLP.",
  path: "/eula",
  keywords: ["eula", "end user license agreement", "software license", "tally license"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
