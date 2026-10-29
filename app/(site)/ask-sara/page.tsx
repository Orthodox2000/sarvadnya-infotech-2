import { redirect } from 'next/navigation';
import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
export const metadata = seoMetadata({
  title: "Ask Sara — Free Tally AI Assistant",
  description: "Ask Sara about TallyPrime products, services and pricing. A free AI assistant that answers any time, on any device, with no signup.",
  path: "/ask-sara",
  keywords: ["ask sara", "sara chatbot", "tally ai assistant", "tally support"],
  // CHANGE: 2026-10-29 — redirect stub: no sales tail on a page that never renders (see lib/seo.ts).
  contactSuffix: false,
});

export default function AskSaraPage() {
  // Redirect to home with the ask-sara trigger
  redirect('/?ask-sara=true');
}
