import dynamic from 'next/dynamic'
import HomeHero from './components/HomeHero'

// Dynamic imports for content to improve initial load time
const CertifiedPartners = dynamic(() => import('./components/CertifiedPartners'), {
  loading: () => <div className="w-full h-64 bg-[#290f4d] animate-pulse" />
})

const QuickAccessHub = dynamic(() => import('./components/QuickAccessHub'), {
  loading: () => <div className="w-full h-64 bg-slate-50 animate-pulse" />
})

const HomeStat = dynamic(() => import('./components/HomeStat'), {
  loading: () => <div className="w-full h-32 bg-white animate-pulse" />
})

const CustomerReviews = dynamic(() => import('./components/CustomerReviews'), {
  loading: () => <div className="w-full h-96 bg-slate-50 animate-pulse" />
})

const FAQ = dynamic(() => import('./components/faq'), {
  loading: () => <div className="w-full h-96 bg-white animate-pulse" />
})

const Footer = dynamic(() => import('./components/Footer'), {
  loading: () => <div className="w-full h-64 bg-[#0a041a] animate-pulse" />
})

export default function Home() {
  return (
    <main>
      <HomeHero />
      <CertifiedPartners />
      <QuickAccessHub />
      <CustomerReviews />
      <HomeStat />
      <FAQ />
      <Footer />
    </main>
  );
}
