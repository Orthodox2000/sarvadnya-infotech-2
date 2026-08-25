import HomeHero from '../../components/HomeHero'
import CertifiedPartners from '../../components/CertifiedPartners'
import CustomerReviews from '../../components/CustomerReviews'
import FAQ from '../../components/faq'
import Footer from '../../components/Footer'
import { getContent, getPartners, getReviews, getSettings } from '@/lib/mongodb-utils'

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
      <HomeHero emailCopy backgroundVideo="/sarvadnya trial 2.mp4" />
      <CertifiedPartners initialData={partnersData} />
      <CustomerReviews initialData={reviewsData} />
      <FAQ initialData={faqData} initialSettings={settingsData} />
      <Footer settings={settingsData} />
    </main>
  );
}
