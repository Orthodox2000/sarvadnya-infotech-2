import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
export const metadata = seoMetadata({
  title: "Renew Tally Software Service (TSS)",
  description: "Don't let your E-invoicing and GST features expire. Renew your TSS to keep 1-click E-way bills, auto bank reconciliation, and tax compliance.",
  path: "/services/tss",
  keywords: ["tss renewal", "tally software service", "tally renewal", "e-invoicing", "gst", "e-way bill"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
