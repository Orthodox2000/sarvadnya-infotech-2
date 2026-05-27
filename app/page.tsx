import HomeHero from './components/HomeHero'
import CertifiedPartners from './components/CertifiedPartners'
import QuickAccessHub from './components/QuickAccessHub'
import CustomerReviews from './components/CustomerReviews'
import HomeStat from './components/HomeStat'
import FAQ from './components/faq'
import Footer from './components/Footer'
import { getContent, getPartners, getReviews, getModules, getSettings } from '@/lib/mongodb-utils'

export default async function Home() {
  // Fetch all data in parallel on the server
  const [
    heroData,
    partnersData,
    hubData,
    reviewsData,
    statsData,
    faqData,
    modulesData,
    settingsData
  ] = await Promise.all([
    getContent('home_hero'),
    getPartners('brand'),
    getContent('home_quick_access'),
    getReviews(),
    getContent('home_stats'),
    getContent('home_faq'),
    getModules(),
    getSettings()
  ]);

  return (
    <main className="bg-white">
      <HomeHero initialData={heroData} />
      <CertifiedPartners initialData={partnersData} />
      <QuickAccessHub initialData={hubData} initialModules={modulesData} initialSettings={settingsData} />
      <CustomerReviews initialData={reviewsData} />
      <HomeStat initialData={statsData} />
      <FAQ initialData={faqData} initialSettings={settingsData} />
      <Footer settings={settingsData} />
    </main>
  );
}
