'use client';

import HomeHero from '../components/HomeHero';
import Footer from '../components/Footer';
import CertifiedPartners from '../components/CertifiedPartners';
import HomeStat from '../components/HomeStat';
import CustomerReviews from '../components/CustomerReviews';
import FAQ from '../components/faq';
import QuickAccessHubDemo from '../components/QuickAccessHubDemo';

const demoHeroData = [
  {
    badge: "Upgraded to latest Tally version",
    titleText: "Trusted Tally Partner in Navi Mumbai",
    colorFrom: "#232F3E",
    colorTo: "#00ABE4",
    description: "Beyond Software Sales — Guiding You to Maximize Your Tally Investment with Certified Support.",
    image: "/sa2.png",
    layout: "standard" as const,
    features: [
      { text: "TallyPrime v7.0 Ready" },
      { text: "Certified Expert Support" },
      { text: "Custom Module Design" },
      { text: "Seamless Data Integrity" }
    ],
    ctaPrimary: { text: "Explore Capabilities", href: "/products" }
  },
  {
    badge: "Support Excellence",
    titleText: "90% First-Call Resolution for Tally",
    colorFrom: "#232F3E",
    colorTo: "#00ABE4",
    description: "15min Avg. Response Time | 5000+ Queries Resolved | 99% Client Satisfaction. Reliable support that keeps your business running smoothly.",
    image: "/support.png",
    layout: "standard" as const,
    features: [
      { text: "Certified Technical Experts" },
      { text: "Dedicated Account Managers" },
      { text: "On-site & Remote Assistance" },
      { text: "15min Avg. Response" }
    ],
    ctaPrimary: { text: "Get Support", href: "/contact" }
  },
  {
    badge: "Certified Cloud Solutions",
    titleText: "Reliable Cloud & Zero-Loss Backup",
    colorFrom: "#232F3E",
    colorTo: "#00ABE4",
    description: "Modernize your TallyPrime experience with our certified cloud solutions. From Official AWS hosting to automated TallyDrive backups.",
    image: "/hero/dedicated-to-cloud-hosting.jpg",
    layout: "ecosystem" as const,
    features: [
      { text: "Official AWS Hosting" },
      { text: "NoSky Cloud Performance" },
      { text: "24/7 Remote Access" },
      { text: "Automated Server Backup" }
    ],
    ctaPrimary: { text: "View Cloud Plans", href: "/cloud" }
  }
];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* High-Impact Creative Hero Section with Factual DB Content */}
      <HomeHero initialData={demoHeroData} variant="creative" />

      <CertifiedPartners />
      <QuickAccessHubDemo />
      <HomeStat />
      <CustomerReviews />
      <FAQ />
      <Footer />
    </main>
  );
}
