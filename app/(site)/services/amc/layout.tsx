import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
export const metadata = seoMetadata({
  title: "Tally AMC — Annual Maintenance Contract",
  description: "Minimize downtime and maximize productivity with priority troubleshooting and regular health checks. Your safety net for continuous business operations.",
  path: "/services/amc",
  keywords: ["tally amc", "tally annual maintenance contract", "tally support", "amc services", "data backup", "priority troubleshooting"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
