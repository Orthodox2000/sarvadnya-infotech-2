import HomeHero from './components/HomeHero'
import CertifiedPartners from './components/CertifiedPartners'
import HomeStat from './components/HomeStat'
import CustomerReviews from './components/CustomerReviews'
import FAQ from './components/faq'
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <HomeHero />   
      <HomeStat />     
      
      
      <CustomerReviews />
      <CertifiedPartners />
      <FAQ />  
      <Footer />
    </main>
  );
}
