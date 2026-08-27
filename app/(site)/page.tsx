import HomeHero from '../components/HomeHero'
import CertifiedPartners from '../components/CertifiedPartners'
import CustomerReviews from '../components/CustomerReviews'
import FAQ from '../components/faq'
import Footer from '../components/Footer'
import { getContent, getPartners, getReviews, getSettings } from '@/lib/mongodb-utils'
import { seoMetadata, localBusinessJsonLd } from "@/lib/seo";

// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
export const metadata = seoMetadata({
  title: "Sarvadnya Infotech LLP — Certified Tally Partner Since 2008",
  description: "Certified Tally Partner trusted by 1500+ MSMEs. TallyPrime (Silver, Gold, Server), Tally on Cloud, AMC, Tally on WhatsApp, TallyDrive cloud backup, HRMS, TDL customization & corporate training.",
  path: "/",
  keywords: ["sarvadnya infotech", "certified tally partner", "tally partner", "tallyprime", "tally on cloud", "tally on whatsapp", "tallydrive"],
});

export default async function Home() {
  // Fetch all data in parallel on the server
  const [
    partnersData,
    reviewsData,
    faqData,
    settingsData
  ] = await Promise.all([
    getPartners('brand'),
    getReviews(),
    getContent('home_faq'),
    getSettings()
  ]);

  return (
    <main className="bg-white">
      {/* CHANGE: 2026-08-27 — LocalBusiness structured data for local/AI indexing. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }} />
      <HomeHero emailCopy backgroundVideo="/sarvadnya trial 2.mp4"/>
      <CertifiedPartners initialData={partnersData} />
  
      <CustomerReviews initialData={reviewsData} />
      <FAQ initialData={faqData} initialSettings={settingsData} />
      <Footer settings={settingsData} />
    </main>
  );
}
