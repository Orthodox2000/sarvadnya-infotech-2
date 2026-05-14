import HomeHero from './components/HomeHero'
import CertifiedPartners from './components/CertifiedPartners'
import QuickAccessHub from './components/QuickAccessHub'
import HomeStat from './components/HomeStat'
import CustomerReviews from './components/CustomerReviews'
import FAQ from './components/faq'
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <HomeHero />
      <CertifiedPartners />
      <QuickAccessHub />
      <HomeStat />
      <CustomerReviews />
      <FAQ />
      <Footer />
    </main>
  );
}
