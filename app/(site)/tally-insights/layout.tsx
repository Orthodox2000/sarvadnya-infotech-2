import { seoMetadata } from "@/lib/seo";

export const metadata = seoMetadata({
  title: "Tally Insights – Tally Prime & ERP 9 Knowledge Hub",
  description:
    "Tally Insights: section-wise guides, shortcuts, setup, GST, bank reconciliation, payroll, integration and compliance. Product-focused for B2B teams.",
  path: "/tally-insights",
  keywords: [
    "tally insights",
    "learn tally prime",
    "tally prime guide",
    "tally erp 9 vs tally prime",
    "tally shortcuts",
    "tally gst guide",
    "tally integration",
    "tally knowledge hub"
  ]
});

export default function TallyInsightsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
