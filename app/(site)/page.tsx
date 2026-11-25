import HomeHero from '../components/HomeHero'
import CertifiedPartners from '../components/CertifiedPartners'
import CustomerReviews from '../components/CustomerReviews'
import FAQ from '../components/faq'
import Footer from '../components/Footer'
import { seoMetadata, localBusinessJsonLd } from "@/lib/seo";
// CHANGE: 2026-11-25 — CPU mitigation: homepage content is a committed snapshot, not a DB
// read. The four former calls (getPartners/getReviews/getContent/getSettings) ran on every
// request and were followed by client /api/* re-fetches on hydration.
import {
  STATIC_HOME_FAQ,
  STATIC_PARTNERS,
  STATIC_REVIEWS,
  STATIC_SITE_SETTINGS,
} from '@/lib/static-site-content';

// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — description now leads with the action and fits the 160-char display limit
// incl. CONTACT_SUFFIX (the old one was 183 chars and was being truncated). Title unchanged: on a
// branded query "Sarvadnya Infotech LLP — Tally Certified Partner Since 2008" is the strongest hook.
export const metadata = seoMetadata({
  title: "Sarvadnya Infotech LLP — Tally Certified Partner Since 2008",
  description: "Buy TallyPrime, renew TSS or move Tally to cloud — certified partner since 2008, 1,500+ businesses served.",
  path: "/",
  keywords: ["sarvadnya infotech", "tally certified partner", "tally partner", "tallyprime", "tally on cloud", "tally on whatsapp", "tallydrive"],
});

export default function Home() {
  // CHANGE: 2026-11-25 — the previous parallel DB fetch is deliberately disabled:
  //   const [partnersData, reviewsData, faqData, settingsData] = await Promise.all([
  //     getPartners('brand'), getReviews(), getContent('home_faq'), getSettings()
  //   ]);
  //   const siteSettings = normaliseSettings(settingsData);
  // It cost four live-cluster reads per homepage view; the committed snapshot below is
  // byte-for-byte the same public content (see lib/static-site-content.ts).
  const partnersData = STATIC_PARTNERS;
  const reviewsData = STATIC_REVIEWS;
  const faqData = STATIC_HOME_FAQ;
  const siteSettings = STATIC_SITE_SETTINGS;

  return (
    <main className="bg-[linear-gradient(90deg,_rgba(249,251,245,1)_0%,_rgba(244,242,234,1)_53%,_rgba(238,236,223,1)_100%)] ">
      {/* CHANGE: 2026-08-27 — LocalBusiness structured data for local/AI indexing. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }} />
      {/* CHANGE: 2026-09-11 — VideoObject structured data removed: the hero video is a background/decorative element, not a watch page, so Google flags "Video isn't on a watch page". See videoJsonLd removal in lib/seo.ts. */}
      <HomeHero emailCopy backgroundVideoMobile="/sarvadnya-mobile.mp4" backgroundVideoDesktop="/sarvadnya trial 2.mp4"/>
      <CertifiedPartners initialData={partnersData} />
  
      <CustomerReviews initialData={reviewsData} />
      <FAQ initialData={faqData} initialSettings={siteSettings} />
      <Footer settings={siteSettings} />
    </main>
  );
}
