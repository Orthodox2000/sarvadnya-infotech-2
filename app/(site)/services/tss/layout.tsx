import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-10-29 — title already action-first (the renew-intent query is the whole point of this
// page). Description now fronts the expiry risk and fits the 160-char display limit incl. suffix.
export const metadata = seoMetadata({
  title: "Renew Tally Software Services (TSS)",
  description: "Don't let e-invoicing and GST features expire. Renew TSS to keep e-way bills, bank reconciliation and compliance.",
  path: "/services/tss",
  keywords: ["tss renewal", "tally software service", "tally renewal", "e-invoicing", "gst", "e-way bill"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
