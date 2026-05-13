'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import UnifiedContactModal, { FormType } from './UnifiedContactModal';

const heroContents = [
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

export default function HomeHero() {
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean; type: FormType; service: string; details: string}>({
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

  const current = heroContents[currentIndex];

  const openModal = (type: FormType, service: string = '', details: string = '') => {
    setModalConfig({ isOpen: true, type, service, details });
  };

  // Tab Visibility Detection to prevent animation stacking
  useEffect(() => {
    const handleVisibilityChange = () => {
      const hidden = document.hidden;
      setIsTabFocused(!hidden);
      
      if (!hidden) {
        // Soft reset: trigger a re-type when coming back to tab
        setDisplayText('');
        setIsTyping(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Intersection Observer to stop animations when not visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    const element = document.getElementById('home-hero');
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Typing effect logic
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
        setCurrentIndex((prev) => (prev + 1) % heroContents.length);
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
    <main 
      id="home-hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative h-[50dvh] md:h-[75dvh] w-full overflow-hidden transition-colors duration-1000 bg-[var(--background-color)] shadow-sm"
      style={{ 
        '--hero-text-from': current.colorFrom, 
        '--hero-text-to': current.colorTo 
      } as React.CSSProperties}
    >
      <div className="content--canvas absolute inset-0 z-[1] pointer-events-none" />
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

      {/* Background Image Container - Dynamic & Animated */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 aspect-[6/5] md:aspect-[16/9] w-full max-w-5xl h-[45dvh] md:h-[55dvh] z-[2] transition-all duration-700 ease-in-out
        ${isTransitioning ? 'opacity-0 translate-y-12 scale-95 blur-sm' : 'opacity-60 md:opacity-90 translate-y-0 scale-100 blur-0'}`}>
        <Image
          src={current.image}
          alt="Sarvadnya Background"
          fill
          className="object-contain"
          priority
        />
        {/* Mobile-only gradient overlay to improve text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background-color)] via-[var(--background-color)]/40 to-transparent md:hidden" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full w-full flex-col items-center px-6">
        {/* Radial Gradient for text visibility */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[90%] md:h-[80%] pointer-events-none" 
          style={{ 
            background: 'radial-gradient(circle at top, var(--background-color) 0%, rgba(252, 250, 255, var(--hero-gradient-opacity, 0.7)) 60%, rgba(252, 250, 255, 0) 100%)'
          }}
        />

        <div className="relative z-20 mt-[20px] md:mt-[30px] w-full max-w-4xl flex flex-col items-center text-center">
          
          {/* Static Global Badge */}
          <div 
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 border mb-4 md:mb-6 transition-all duration-1000 bg-[var(--background-color)] shadow-sm"
            style={{ borderColor: `${current.colorFrom}33` }}
          >
            <span 
              className="flex h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: current.colorFrom }}
            ></span>
            <span 
              className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-colors duration-1000"
              style={{ color: current.colorFrom }}
            >
              {current.badge}
            </span>
          </div>

          {/* Static Heading - Smaller */}
          <p className="font-sans text-[10px] md:text-[14px] font-bold uppercase tracking-widest text-slate-400 mb-1 md:mb-2">
            Why Choose Sarvadnya Infotech LLP?
          </p>

          {/* Dynamic Content Area - Staggered with delay-250ms */}
          <div className={`flex flex-col items-center w-full transition-all duration-700 delay-[250ms] ease-in-out
            ${isTransitioning ? 'opacity-0 translate-y-12 blur-sm' : 'opacity-100 translate-y-0 blur-0'}`}>
            
            {/* Typing Sub-title - Large & Animated */}
            <h2 className="font-sans text-[22px] md:text-[42px] lg:text-[48px] font-black leading-[1.1] tracking-tight min-h-[3.3em] md:min-h-[1.5em] mb-1 md:mb-2 overflow-visible">
              <span 
                className="inline-block px-4 py-2 -mx-4 text-highlight-gradient"
              >
                {displayText}
              </span>
              <span 
                className={`inline-block w-[3px] h-[0.9em] ml-1 align-middle transition-colors duration-1000 ${isTyping ? 'opacity-100' : 'animate-pulse'}`}
                style={{ backgroundColor: current.colorFrom }}
              ></span>
            </h2>
            
            <p className="max-w-2xl mx-auto text-[11px] md:text-base font-medium leading-relaxed text-slate-700 mb-3 md:mb-4">
              {current.description}
            </p>

            {/* Tick-marked Features */}
            <div className="mt-2 md:mt-4 flex flex-row flex-wrap justify-center gap-x-6 md:gap-x-8 gap-y-3 md:gap-y-4 w-full">
              {current.features.map((feature, i) => (
                <div key={feature.text} className="flex items-center gap-2 md:gap-2.5 group animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-both" style={{ animationDelay: `${i * 100}ms` }}>
                  <div 
                    className="flex-shrink-0 w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center shadow-sm transition-colors duration-1000"
                    style={{ backgroundColor: current.colorFrom }}
                  >
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[10px] md:text-[14px] font-bold text-[#0f0529] whitespace-nowrap tracking-tight">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 md:mt-10 flex justify-center gap-3">
              <Link
                href={current.ctaPrimary.href}
                className="group relative flex h-9 md:h-12 w-32 md:w-44 items-center justify-center overflow-hidden rounded-full text-[9px] md:text-xs font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: current.colorFrom }}
              >
                <span className="relative z-10">{current.ctaPrimary.text}</span>
                <div 
                  className="absolute inset-0 z-0 translate-y-full transition-transform group-hover:translate-y-0" 
                  style={{ backgroundColor: current.colorTo }}
                />
              </Link>
              <Link
                href="/contact"
                className="flex h-9 md:h-11 w-32 md:w-44 items-center justify-center rounded-full border border-slate-200 bg-[var(--background-color)] text-[9px] md:text-xs font-bold text-[#0f0529] transition-all hover:bg-slate-50 active:scale-95 shadow-sm"
              >
                Request Call
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
