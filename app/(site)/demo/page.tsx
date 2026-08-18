'use client';

// CHANGE: 2026-08-18 — Added video background preview on /demo via HomeHero backgroundVideo prop.
// All original content, layout, and components kept exactly as-is.

import { useState } from "react";
import HomeHero from "../../components/HomeHero";
import Footer from "../../components/Footer";
import CertifiedPartners from "../../components/CertifiedPartners";
import HomeStat from "../../components/HomeStat";
import CustomerReviews from "../../components/CustomerReviews";
import FAQ from "../../components/faq";
import QuickAccessHubDemo from "../../components/QuickAccessHubDemo";
import UnifiedContactModal from "../../components/UnifiedContactModal";

const demoHeroData = [
  {
    badge: "Upgraded to latest Tally version",
    titleText: "Trusted Tally Partner in Navi Mumbai",
    colorFrom: "#232F3E",
    colorTo: "#00ABE4",
    description: "Beyond Software Sales — Guiding You to Maximize Your Tally Investment with Certified Support.",
    image: "/certified partner person.png",
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
      { text: "Backup for Tally Cloud Performance" },
      { text: "24/7 Remote Access" },
      { text: "Automated Server Backup" }
    ],
    ctaPrimary: { text: "View Cloud Plans", href: "/cloud" }
  }
];

export default function DemoPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <div className="pt-0">
      <HomeHero hero={demoHeroData[0]} emailCopy backgroundVideo="/sarvadnya trial 2.mp4" />
      </div>

      <CertifiedPartners />
      <QuickAccessHubDemo />
      <HomeStat />
      <CustomerReviews />
      <FAQ />

      {/* Enquiry Form CTA — opens the enquiry form; submissions are saved + emailed internally */}
      <section className="w-full bg-[#006569] py-16 md:py-20 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.25em] mb-4 border border-white/20">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-300 animate-pulse"></span>
            Enquiry Form
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight mb-3">
            See Sarvadnya Solutions In Action
          </h2>
          <p className="text-sm md:text-base text-teal-100/90 font-medium leading-relaxed max-w-xl mx-auto mb-8">
            Open the enquiry form, fill in your details, and send a copy of your request straight to our team.
          </p>
          <button
            type="button"
            data-testid="open-demo-form"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex h-14 px-12 items-center justify-center rounded-full bg-white text-[#045A57] font-black text-[11px] uppercase tracking-widest hover:bg-teal-50 hover:scale-105 transition-all active:scale-95 shadow-2xl shadow-black/20"
          >
            Open Enquiry Form
            <svg className="w-4 h-4 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </section>

      <Footer />
      <UnifiedContactModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        type="demo"
        emailCopy
        prefillService="Enquiry Request"
      />
    </main>
  );
}
