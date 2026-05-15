'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import Footer from '../components/Footer';
import CertifiedPartners from '../components/CertifiedPartners';
import HomeStat from '../components/HomeStat';
import CustomerReviews from '../components/CustomerReviews';
import FAQ from '../components/faq';
import QuickReference from '../components/QuickReference';
import { usePathname } from 'next/navigation';
import UnifiedContactModal, { FormType } from '../components/UnifiedContactModal';

const replicaHeroContents = [
  {
    badge: "Upgraded to Tally 7.0",
    titleText: "Trusted Tally Partner in Navi Mumbai",
    colorFrom: "#4f46e5", // Indigo
    colorTo: "#7c3aed",   // Violet
    description: "Beyond Software Sales — Guiding You to Maximize Your Tally Investment with Certified Support.",
    image: "/sa.png",
    features: [
      { text: "TallyPrime v7.0 Ready" },
      { text: "Certified Expert Support" },
      { text: "Custom Module Design" },
      { text: "Seamless Data Integrity" }
    ],
    ctaPrimary: { text: "Compare Features", href: "/products#compare" }
  },
  {
    badge: "Support Excellence",
    titleText: "90% First-Call Resolution",
    colorFrom: "#f97316", // Orange
    colorTo: "#e11d48",   // Rose
    description: "15min Avg. Response Time | 5000+ Queries Resolved | 99% Client Satisfaction. Reliable support that keeps your business running smoothly.",
    image: "/sa.png",
    features: [
      { text: "Certified Technical Experts" },
      { text: "Dedicated Account Managers" },
      { text: "On-site & Remote Assistance" },
      { text: "15min Avg. Response" }
    ],
    ctaPrimary: { text: "Get Support", href: "/contact" }
  },
  {
    badge: "Certified Expertise",
    titleText: "Why Choose Certified Partner?",
    colorFrom: "#2563eb", // Blue
    colorTo: "#0891b2",   // Cyan
    description: "Experience unparalleled reliability with Tally Certified Partners. We ensure your business software is always optimized, secure, and compliant.",
    image: "/certified.png",
    features: [
      { text: "Authorized Sales & Service" },
      { text: "Certified Technical Team" },
      { text: "Deep Industry Knowledge" },
      { text: "Priority Support Access" }
    ],
    ctaPrimary: { text: "Verify Certification", href: "/contact" }
  },
  {
    badge: "Vertical Solutions",
    titleText: "Custom Tally Modules",
    colorFrom: "#059669", // Emerald
    colorTo: "#0d9488",   // Teal
    description: "Tailored solutions built directly into Tally to optimize your unique industry workflows and reporting.",
    image: "/sa.png",
    features: [
      { text: "Industry-Specific Logic" },
      { text: "Automated Reporting" },
      { text: "Reduced Manual Entry" },
      { text: "Scalable Add-ons" }
    ],
    ctaPrimary: { text: "View Modules", href: "/products#modules" }
  }
];

function ReplicaHero() {
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: FormType; service: string; details: string }>({
    isOpen: false,
    type: 'general',
    service: '',
    details: ''
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isTabFocused, setIsTabFocused] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const current = replicaHeroContents[currentIndex];

  const openModal = (type: FormType, service: string = '', details: string = '') => {
    setModalConfig({ isOpen: true, type, service, details });
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      const hidden = document.hidden;
      setIsTabFocused(!hidden);
      if (!hidden) {
        setDisplayText('');
        setIsTyping(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    const element = document.getElementById('replica-hero');
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !isTabFocused || isPaused) return;
    let i = 0;
    const textToType = current.titleText;
    setIsTyping(true);
    setDisplayText('');
    let typingInterval: NodeJS.Timeout;
    const typingTimeout = setTimeout(() => {
      typingInterval = setInterval(() => {
        setDisplayText(textToType.slice(0, i + 1));
        i++;
        if (i >= textToType.length) {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 100);
    }, 100);
    return () => {
      clearTimeout(typingTimeout);
      if (typingInterval) clearInterval(typingInterval);
    };
  }, [currentIndex, isVisible, isTabFocused, current.titleText, isPaused]);

  useEffect(() => {
    if (!isVisible || !isTabFocused || isPaused) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % replicaHeroContents.length);
        setIsTransitioning(false);
      }, 1000);
    }, 10000);
    return () => clearInterval(timer);
  }, [isVisible, isTabFocused, isPaused]);

  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).initSwirl && isVisible && isTabFocused) {
      (window as any).initSwirl();
    }
  }, [pathname, isVisible, isTabFocused]);

  return (
    <div
      id="replica-hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative h-[50dvh] md:h-[75dvh] w-full overflow-hidden transition-colors duration-1000 bg-[#0f0529] shadow-sm"
      style={{
        '--hero-text-from': current.colorFrom,
        '--hero-text-to': current.colorTo
      } as React.CSSProperties}
    >
      <div className="content--canvas absolute inset-0 z-[1] pointer-events-none" />

      <UnifiedContactModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        type={modalConfig.type}
        prefillService={modalConfig.service}
        prefillDetails={modalConfig.details}
      />

      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 aspect-[6/5] md:aspect-[16/9] w-full max-w-5xl h-[45dvh] md:h-[55dvh] z-[2] transition-all duration-700 ease-in-out
        ${isTransitioning ? 'opacity-0 translate-y-12 scale-95 blur-sm' : 'opacity-60 md:opacity-90 translate-y-0 scale-100 blur-0'}`}>
        <Image src={current.image} alt="Replica Background" fill className="object-contain" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0529] via-[#0f0529]/40 to-transparent md:hidden" />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col items-center px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[90%] md:h-[80%] pointer-events-none"
          style={{ background: 'radial-gradient(circle at top, #0f0529 0%, rgba(17, 1, 43, 0.7) 60%, rgba(121, 120, 122, 0) 100%)' }}
        />

        <div className="relative z-20 mt-[20px] md:mt-[30px] w-full max-w-4xl flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 border mb-4 md:mb-6 transition-all duration-1000 bg-white shadow-sm" style={{ borderColor: `${current.colorFrom}33` }}>
            <span className="flex h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: current.colorFrom }}></span>
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-colors duration-1000" style={{ color: current.colorFrom }}>{current.badge}</span>
          </div>

          <p className="font-sans text-[10px] md:text-[14px] font-bold uppercase tracking-widest text-slate-400 mb-1 md:mb-2">Why Choose Sarvadnya Infotech LLP?</p>

          <div className={`flex flex-col items-center w-full transition-all duration-700 delay-[250ms] ease-in-out ${isTransitioning ? 'opacity-0 translate-y-12 blur-sm' : 'opacity-100 translate-y-0 blur-0'}`}>
            <h2 className="font-sans text-[22px] md:text-[42px] lg:text-[48px] font-black leading-[1.1] tracking-tight min-h-[2.2em] md:min-h-[1.5em] mb-1 md:mb-2 overflow-visible">
              <span className="inline-block">
                <span className="px-4 py-2 -mx-4 text-highlight-gradient">{displayText}</span>
                <span className={`inline-block w-[3px] h-[0.9em] ml-1 align-middle transition-colors duration-1000 ${isTyping ? 'opacity-100' : 'animate-pulse'}`} style={{ backgroundColor: current.colorFrom }}></span>
              </span>
            </h2>

            <p className="max-w-2xl mx-auto text-[11px] md:text-base font-medium leading-relaxed text-slate-700 mb-3 md:mb-4">{current.description}</p>

            <div className="mt-2 md:mt-4 flex flex-row flex-wrap justify-center gap-x-6 md:gap-x-8 gap-y-3 md:gap-y-4 w-full">
              {current.features.map((feature, i) => (
                <div key={feature.text} className="flex items-center gap-2 md:gap-2.5 group animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-both" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex-shrink-0 w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center shadow-sm transition-colors duration-1000" style={{ backgroundColor: current.colorFrom }}>
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-[10px] md:text-[14px] font-bold text-[#0f0529] whitespace-nowrap tracking-tight">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 md:mt-10 flex justify-center gap-3">
              <Link href={current.ctaPrimary.href} className="group relative flex h-9 md:h-12 w-32 md:w-44 items-center justify-center overflow-hidden rounded-full text-[9px] md:text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 border" style={{ backgroundColor: current.colorFrom, borderColor: current.colorFrom }}>
                <span className="relative z-10 transition-colors duration-300 group-hover:!text-[var(--hover-color)]" style={{ color: 'white', '--hover-color': current.colorFrom } as React.CSSProperties}>{current.ctaPrimary.text}</span>
                <span className="absolute inset-0 z-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0 bg-white" />
              </Link>
              <Link href="/contact" className="group relative flex h-9 md:h-11 w-32 md:w-44 items-center justify-center overflow-hidden rounded-full border transition-all active:scale-95 shadow-sm" style={{ backgroundColor: current.colorFrom, borderColor: current.colorFrom }}>
                <span className="relative z-10 text-[9px] md:text-xs font-bold transition-colors duration-300 text-white group-hover:!text-[var(--hover-color)]" style={{ '--hover-color': current.colorFrom } as React.CSSProperties}>Request Call</span>
                <span className="absolute inset-0 z-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0 bg-white" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const heroContents = [
  {
    badge: "Upgraded to Tally 7.0",
    titleText: "Trusted Tally Partner in Navi Mumbai",
    description: "Beyond Software Sales — Expert guidance for TallyPrime Silver, Gold & Server editions with certified local support.",
    image: "/sa.png",
    features: [
      { text: "TallyPrime v7.0 Ready" },
      { text: "Certified Expert Support" },
      { text: "Custom Module Design" },
      { text: "Seamless Data Integrity" }
    ],
    ctaPrimary: { text: "Compare Features", href: "/products#compare" }
  },
  {
    badge: "Support Excellence",
    titleText: "90% First-Call Resolution",
    description: "15min Avg. Response Time | 5000+ Queries Resolved | 99% Client Satisfaction. Reliable support that keeps your business running smoothly.",
    image: "/sa.png",
    features: [
      { text: "Certified Technical Experts" },
      { text: "Dedicated Account Managers" },
      { text: "On-site & Remote Assistance" },
      { text: "15min Avg. Response" }
    ],
    ctaPrimary: { text: "Get Support", href: "/contact" }
  },
  {
    badge: "Certified Expertise",
    titleText: "Why Choose Certified Partner?",
    description: "Experience unparalleled reliability with Tally Certified Partners. We ensure your business software is always optimized, secure, and compliant.",
    image: "/certified.png",
    features: [
      { text: "Authorized Sales & Service" },
      { text: "Certified Technical Team" },
      { text: "Deep Industry Knowledge" },
      { text: "Priority Support Access" }
    ],
    ctaPrimary: { text: "Partner Profile", href: "/contact" }
  },
  {
    badge: "Vertical Solutions",
    titleText: "Custom Tally Modules",
    description: "Specialized solutions for C&F Agencies, Housing Societies, Transport & Logistics, Garment Industry, Sales & Commission, Excel to Tally, and Business Boosters.",
    image: "/sa.png",
    features: [
      { text: "C&F, Society & Transport" },
      { text: "Garment & Sales Tracking" },
      { text: "Excel to Tally Import" },
      { text: "Custom Business Boosters" }
    ],
    ctaPrimary: { text: "View Modules", href: "/products#modules" }
  },
  {
    badge: "Official Tally Editions",
    titleText: "TallyPrime Silver, Gold & Server",
    description: "Choosing the right edition is crucial. We help you select and deploy the perfect TallyPrime version for your business scale.",
    image: "/sa.png",
    features: [
      { text: "Single User (Silver)" },
      { text: "Multi-User (Gold)" },
      { text: "High Performance (Server)" },
      { text: "Expert Deployment" }
    ],
    ctaPrimary: { text: "Compare Editions", href: "/products#compare" }
  }
];

export default function DemoPage() {
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: FormType; service: string; details: string }>({
    isOpen: false,
    type: 'general',
    service: '',
    details: ''
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isTabFocused, setIsTabFocused] = useState(true);

  const current = heroContents[currentIndex];

  const openModal = (type: FormType, service: string = '', details: string = '') => {
    setModalConfig({ isOpen: true, type, service, details });
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      const hidden = document.hidden;
      setIsTabFocused(!hidden);
      if (!hidden) {
        setDisplayText('');
        setIsTyping(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    const element = document.getElementById('demo-hero');
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !isTabFocused) return;
    let i = 0;
    const textToType = current.titleText;
    setIsTyping(true);
    setDisplayText('');
    let typingInterval: NodeJS.Timeout;
    const typingTimeout = setTimeout(() => {
      typingInterval = setInterval(() => {
        setDisplayText(textToType.slice(0, i + 1));
        i++;
        if (i >= textToType.length) {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 100);
    }, 100);
    return () => {
      clearTimeout(typingTimeout);
      if (typingInterval) clearInterval(typingInterval);
    };
  }, [currentIndex, isVisible, isTabFocused, current.titleText]);

  useEffect(() => {
    if (!isVisible || !isTabFocused) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroContents.length);
        setIsTransitioning(false);
      }, 1000);
    }, 10000);
    return () => clearInterval(timer);
  }, [isVisible, isTabFocused]);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).initSwirl && isVisible && isTabFocused) {
      (window as any).initSwirl();
    }
  }, [isVisible, isTabFocused]);

  return (
    <main className="min-h-screen bg-white">
      <Script src="/js/noise.min.js" strategy="afterInteractive" />
      <Script src="/js/util.js" strategy="afterInteractive" />
      <Script
        src="/js/swirl.js"
        strategy="afterInteractive"
        onLoad={() => {
          if ((window as any).initSwirl) (window as any).initSwirl();
        }}
      />


      <UnifiedContactModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        type={modalConfig.type}
        prefillService={modalConfig.service}
        prefillDetails={modalConfig.details}
      />

      <section
        id="demo-hero"
        className="relative h-[500px] md:h-[80dvh] w-full overflow-hidden transition-colors duration-1000 bg-[#0f0529] shadow-sm flex items-center"
      >
        <div className="content--canvas absolute inset-0 z-[1] pointer-events-none gpu-accelerated" />

        {/* Full Height Background Image with Transparency Gradient */}
        <div className={`absolute inset-y-0 right-0 w-full md:w-[70%] h-full z-[0] transition-all duration-1000 ease-in-out gpu-accelerated
          ${isTransitioning ? 'opacity-0 scale-105' : 'opacity-60 scale-100'}`}>
          <Image
            src={current.image}
            alt="Background"
            fill
            className="object-cover object-right md:object-right"
            priority
          />
          {/* Gradient to fade image into solid dark background on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0529] via-[#0f0529]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0529]/40 via-transparent to-[#0f0529]/40" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="max-w-2xl flex flex-col items-start text-left">

            {/* Badge - Reduced margin */}
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white-300 mb-4 border border-white/10 ">
              {current.badge}
            </div>

            {/* Title - Tighter leading and smaller font as requested */}
            <h1 className="font-sans text-[28px] md:text-[42px] lg:text-[48px] font-black leading-[1.1] tracking-tight min-h-[2.2em] md:min-h-[1.5em] mb-3 md:mb-4 text-white">
              <span className="inline-block">
                <span className="inline text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-[#7338a0]">
                  {displayText}
                </span>
                <span className="inline-block w-[2px] h-[0.9em] ml-[2px] align-middle bg-indigo-400 animate-pulse" />
              </span>
            </h1>

            {/* Description - Reduced margin */}
            <p className="max-w-xl text-[12px] md:text-[15px] font-medium leading-relaxed text-slate-400 mb-6">
              {current.description}
            </p>

            {/* Feature Ticks - Tighter gaps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-8 w-full">
              {current.features.map((feature, i) => (
                <div key={feature.text} className="flex items-center gap-2.5 animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center bg-[#7338a0]">
                    <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[11px] md:text-[13px] font-bold text-slate-200 tracking-tight">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => openModal('quote', current.titleText)}
                className="group relative flex h-10 md:h-12 w-36 md:w-48 items-center justify-center overflow-hidden rounded-full bg-[#7338a0] text-[10px] md:text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-950/40 transition-all hover:scale-105 active:scale-95 gpu-accelerated"
              >
                <span className="relative z-10">{current.ctaPrimary.text}</span>
              </button>
              <Link
                href="/contact"
                className="group relative flex h-10 md:h-12 w-36 md:w-48 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 hover:scale-105 active:scale-95 gpu-accelerated"
              >
                <span className="relative z-10">Enquire Now</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Landing Page Hero Replica</h2>
          <p className="text-slate-500 font-medium">This is an exact replica of the current landing page hero.</p>
        </div>
        <ReplicaHero />
      </div>

      <CertifiedPartners />
      <QuickReference />
      <HomeStat />
      <CustomerReviews />
      <FAQ />
      <Footer />
    </main>
  );
}
