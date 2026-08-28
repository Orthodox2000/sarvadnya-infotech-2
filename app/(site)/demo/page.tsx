import HomeHero from '../../components/HomeHero'
import CertifiedPartners from '../../components/CertifiedPartners'
import CustomerReviews from '../../components/CustomerReviews'
import FAQ from '../../components/faq'
import Footer from '../../components/Footer'
import { getContent, getPartners, getReviews, getSettings } from '@/lib/mongodb-utils'
import { seoMetadata } from "@/lib/seo";

// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "Demo — Sarvadnya Infotech LLP",
  description: "Tally that works as hard as your business — certified Tally partner trusted by 1,500+ MSMEs. A design-review preview of the Sarvadnya Infotech homepage.",
  path: "/demo",
  keywords: ["sarvadnya infotech", "tally partner", "tallyprime", "demo"],
});

// CHANGE: 2026-08-25 — /demo is an exact duplicate of the homepage with all visual fixes applied.
// Used for design review and A/B comparison against the production homepage.

export default async function DemoPage() {
  const [partnersData, reviewsData, faqData, settingsData] = await Promise.all([
    getPartners('brand'),
    getReviews(),
    getContent('home_faq'),
    getSettings()
  ]);

  return (
    <main className="bg-white">
      <HomeHero emailCopy backgroundVideoMobile="/sarvadnya-mobile.mp4" backgroundVideoDesktop="/sarvadnya trial 2.mp4" />
      <CertifiedPartners initialData={partnersData} />
      <CustomerReviews initialData={reviewsData} />
      <FAQ initialData={faqData} initialSettings={settingsData} />
      <Footer settings={settingsData} />
    </main>
  );
}
