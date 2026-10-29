import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Get a Tally AMC — Zero Downtime",
  description: "Priority troubleshooting and regular health checks so Tally keeps running. The safety net for daily operations.",
  path: "/services/amc",
  keywords: ["tally amc", "tally annual maintenance contract", "tally support", "amc services", "data backup", "priority troubleshooting"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
