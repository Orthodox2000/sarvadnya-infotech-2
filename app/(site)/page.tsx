import HomeHero from '../components/HomeHero'
import CertifiedPartners from '../components/CertifiedPartners'
import CustomerReviews from '../components/CustomerReviews'
import FAQ from '../components/faq'
import Footer from '../components/Footer'
import { getContent, getPartners, getReviews, getSettings } from '@/lib/mongodb-utils'

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
      <HomeHero />
      <CertifiedPartners initialData={partnersData} />
  
      <CustomerReviews initialData={reviewsData} />
      <FAQ initialData={faqData} initialSettings={settingsData} />
      <Footer settings={settingsData} />
    </main>
  );
}
