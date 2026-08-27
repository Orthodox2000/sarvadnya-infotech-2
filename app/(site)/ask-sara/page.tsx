import { redirect } from 'next/navigation';
import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "Ask Sara — AI Assistant",
  description: "Ask Sara, Sarvadnya Infotech's AI sales consultant, about TallyPrime products, services, and pricing.",
  path: "/ask-sara",
  keywords: ["ask sara", "sara chatbot", "tally ai assistant", "tally support"],
});

export default function AskSaraPage() {
  // Redirect to home with the ask-sara trigger
  redirect('/?ask-sara=true');
}
