'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UnifiedContactModal, { FormType } from './UnifiedContactModal';

interface HeroContent {
  badge: string;
  titleText: string;
  description: string;
  image: string;
}

const HERO_CONTENT: HeroContent = {
  badge: "Certified Tally Partner · Trusted Since 2008",
  titleText: "Tally that works as hard as your business.",
  description: "We don't just implement software; we clear the path for your growth. Maximize your Tally investment with certified experts who care about your bottom line as much as you do.",
  image: "/certified partner person.png",
};

const QUICK_ACCESS_CARDS = [
  {
    title: "Tally Products",
    description: "Explore TallyPrime Products, Licensing, and specialized business modules.",
    shortDesc: "TallyPrime products & licensing",
    href: "/products",
    img: "/PartnerBrands/Tally-Software.png"
  },
  {
    title: "Cloud Access",
    description: "Secure, 24/7 remote access with Official AWS and Backup for Tally infrastructure.",
    shortDesc: "AWS & Backup for Tally cloud access",
    href: "/cloud",
    img: "/tally on cloud.png"
  },
  {
    title: "Customizations",
    description: "Industry-specific TDL solutions tailored to your unique business logic.",
    shortDesc: "TDL solutions for you",
    href: "/modules",
    img: "/customization icon.png"
  },
  {
    title: "HRMS",
    description: "Human Resource Management System — payroll, attendance, employee lifecycle.",
    shortDesc: "Payroll, attendance & more",
    href: "/hrms",
    img: "/hrms.png"
  }
];

const HIGHLIGHT_WORDS = ['your', 'business', 'certified', 'partner', 'trusted', 'msme', 'smarter'];

// CHANGE: 2026-08-18 — Added optional backgroundVideo prop. When set, renders a muted
// autoplaying video as the hero background instead of the static bg.png image.
export default function HomeHero({ hero = HERO_CONTENT, emailCopy = false, backgroundVideo }: { hero?: HeroContent; emailCopy?: boolean; backgroundVideo?: string }) {
  const [isEntering, setIsEntering] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typingIndexRef = useRef(0);
  const typingTextRef = useRef('');
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: FormType; service: string; details: string }>({ isOpen: false, type: 'general', service: '', details: '' });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.9;
    }
  }, [backgroundVideo]);

  useEffect(() => {
    const t = setTimeout(() => setIsEntering(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isEntering) { setDisplayText(''); return; }
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    typingIndexRef.current = 0;
    typingTextRef.current = hero.titleText;
    setIsTyping(true);
    setDisplayText('');

    const initialDelay = setTimeout(() => {
      typingIntervalRef.current = setInterval(() => {
        typingIndexRef.current++;
        if (typingIndexRef.current > typingTextRef.current.length) {
          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
          setIsTyping(false);
          return;
        }
        setDisplayText(typingTextRef.current.slice(0, typingIndexRef.current));
      }, 40);
    }, 700);

    return () => {
      clearTimeout(initialDelay);
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, [isEntering, hero.titleText]);

  const getAnimationClasses = (delayClass: string) => {
    if (!isEntering) return 'opacity-0 translate-y-4 blur-sm';
    return `transition-all duration-[1000ms] ${delayClass} opacity-100 translate-y-0 blur-0`;
  };

  const isHighlight = (cleanWord: string) => HIGHLIGHT_WORDS.includes(cleanWord);

  const isDark = !!backgroundVideo;

  return (
    <>
    <main suppressHydrationWarning className={`relative w-full ${backgroundVideo ? 'bg-transparent' : "bg-[#fbfaf8] bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat"} min-h-[18rem] sm:min-h-[22rem] md:min-h-[360px] lg:min-h-[420px] flex flex-col pb-16 lg:pb-20`}>
      {backgroundVideo && (
        <>
          <video ref={videoRef} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" style={{ opacity: 0.75 }}>
            <source src={backgroundVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none" />
        </>
      )}
      {/* Background decorative blobs — hidden when video bg */}
      {!isDark && (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-8%] w-[50%] h-[50%] rounded-full blur-[120px]" style={{ backgroundColor: 'rgba(85,130,115,0.08)' }} />
        <div className="absolute bottom-[-10%] right-[-8%] w-[50%] h-[50%] rounded-full blur-[120px]" style={{ backgroundColor: 'rgba(54,82,117,0.06)' }} />
      </div>
      )}

      {/* Hero main row */}
      <div className="relative z-10 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-0 pb-4 lg:pb-0">
          <div className="flex flex-col lg:flex-row items-center lg:mt-6 lg:pb-2 gap-6 lg:gap-12">

            {/* Left: Content */}
            <div className="w-full lg:w-1/2 space-y-2 lg:space-y-3">
              <div className={`mt-12 inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${isDark ? 'bg-white/10 border-white/20' : 'bg-white border-[#006569]/20'} shadow-sm ${getAnimationClasses('delay-0')}`}>
                <span className={`flex h-1.5 w-1.5 rounded-full ${isDark ? 'bg-teal-300' : 'bg-[#006569]'}`} />
                <span className={`text-xs font-semibold ${isDark ? 'text-teal-200' : 'text-[#006569]'}`}>{hero.badge}</span>
              </div>

              <div className={`relative min-h-[70px] md:min-h-[60px] ${getAnimationClasses('delay-200')}`}>
                <h1 className={`font-playfair text-4xl font-bold leading-tight tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} sm:text-5xl lg:text-[3.4rem] invisible`}>{hero.titleText}</h1>
                <h1 className={`absolute top-0 left-0 font-playfair text-4xl font-bold leading-tight tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} sm:text-5xl lg:text-[3.4rem] w-full flex flex-wrap items-baseline`}>
                  {displayText.split(' ').map((word, i) => {
                    const cleanWord = word.replace(/[.,%]/g, '').toLowerCase();
                    return (
                      <span key={i} className="contents">
                        <span className={isHighlight(cleanWord) ? (isDark ? "text-teal-300" : "text-[#006569]") : ""}>
                          {word}&nbsp;
                        </span>
                      </span>
                    );
                  })}
                  {isTyping && <span className={`inline-block w-1 h-8 md:h-12 ml-0.5 animate-pulse ${isDark ? 'bg-teal-300' : 'bg-[#006569]'}`} />}
                </h1>
              </div>

              <p className={`text-sm md:text-[15px] ${isDark ? 'text-white/80' : 'text-[#4a5056]'} max-w-xl leading-relaxed font-medium ${getAnimationClasses('delay-300')}`}>{hero.description}</p>

              {/* Trusted stats badges */}
               <div className={`flex flex-wrap items-center gap-2 ${getAnimationClasses('delay-700')}`}>
                <div className={`inline-flex items-center gap-2 backdrop-blur-sm px-3 py-1.5 rounded-full border shadow-sm ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/70 border-gray-200/60'}`}>
                  <svg className={`w-4 h-4 shrink-0 ${isDark ? 'text-teal-300' : 'text-[#006569]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className={`text-[11px] whitespace-nowrap ${isDark ? 'text-white/70' : 'text-gray-600'}`}><strong className={`${isDark ? 'text-white' : 'text-[#2a2d34]'} font-bold`}>15+ Years</strong> Experience</span>
                </div>
                <div className={`inline-flex items-center gap-2 backdrop-blur-sm px-3 py-1.5 rounded-full border shadow-sm ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/70 border-gray-200/60'}`}>
                  <svg className={`w-4 h-4 shrink-0 ${isDark ? 'text-teal-300' : 'text-[#006569]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <span className={`text-[11px] whitespace-nowrap ${isDark ? 'text-white/70' : 'text-gray-600'}`}><strong className={`${isDark ? 'text-white' : 'text-[#2a2d34]'} font-bold`}>150+</strong> Queries Solved Weekly</span>
                </div>
                <div className={`inline-flex items-center gap-2 backdrop-blur-sm px-3 py-1.5 rounded-full border shadow-sm ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/70 border-gray-200/60'}`}>
                  <svg className={`w-4 h-4 shrink-0 ${isDark ? 'text-teal-300' : 'text-[#006569]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className={`text-[11px] whitespace-nowrap ${isDark ? 'text-white/70' : 'text-gray-600'}`}>Trusted by <strong className={`${isDark ? 'text-white' : 'text-[#2a2d34]'} font-bold`}>1,500+ MSMEs</strong></span>
                </div>
              </div>

              <div className={`flex flex-wrap gap-3 pt-1 ${getAnimationClasses('delay-500')}`}>
                <Link href="/products" className="group relative overflow-hidden px-6 py-3 rounded-xl bg-[#006569] text-white font-bold text-xs uppercase tracking-wide transition-all duration-500 ease-in-out hover:bg-[#0aa6a6] hover:scale-[1.03] active:scale-95 shadow-md">
                  <span className="relative z-10">View Tally Products</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Link>
                <button
                  onClick={() => setModalConfig({ isOpen: true, type: 'demo', service: 'TallyPrime', details: 'Requesting a personalized demo' })}
                  className="group px-6 py-3 rounded-xl bg-[#365275] font-bold text-xs uppercase tracking-wide transition-all duration-500 ease-in-out text-white hover:bg-[#283e5a] hover:scale-[1.03] active:scale-95 shadow-md"
                >
                  Enquire Now
                </button>
              </div>

              
            </div>

            {/* Right: Image */}
            {/* <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center px-4 xl:px-8 lg:-mt-18 max-md:-mt-20 z-10">
              <div className="relative w-full max-w-[700px]">
                <div className={`relative w-full aspect-[3/4] max-h-[650px] md:h-[500px]
                  ${isEntering ? 'opacity-100 transition-all duration-1200' : 'opacity-0 translate-y-4'}`}>
                  <Image src={hero.image} alt={hero.titleText} fill priority className="mt-20 object-contain" sizes="(max-width: 1024px) 100vw, 480px" />
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Mobile: Hero Image */}
      <div className="lg:hidden relative w-full max-w-sm mx-auto px-4 -mt-4 mb-0">
        <div className="relative w-full aspect-square">
          <Image
            src={hero.image}
            alt={hero.titleText}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 0px"
          />
        </div>
      </div>

    </main>
    {/* QuickAccess Cards — straddle hero/next-section boundary.
       Negative mt pulls them up over the hero's bottom; pb on hero above makes room. */}
    <div className="relative z-30 -mt-10 lg:-mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-5">
        {QUICK_ACCESS_CARDS.map((card, idx) => (
          <Link
            key={idx}
            href={card.href}
            className="group relative bg-white rounded-xl lg:rounded-2xl p-3 lg:p-5 border border-gray-100 shadow-lg lg:shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 lg:hover:-translate-y-2 hover:border-[#006569]/30"
          >
            <div className="flex items-center gap-3 lg:block">
              <div className="w-9 h-9 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-white flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <Image src={card.img} alt={card.title} width={48} height={48} className="object-contain w-full h-full" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[11px] lg:text-base font-bold text-[#2a2d34] group-hover:text-[#006569] transition-colors leading-tight truncate">
                  {card.title}
                </h3>
                <p className="text-[10px] lg:text-xs text-gray-500 leading-tight font-medium mt-0.5">
                  <span className="lg:hidden">{card.shortDesc}</span>
                  <span className="hidden lg:inline">{card.description}</span>
                </p>
              </div>
            </div>
            <div className="mt-2 lg:mt-4 flex items-center gap-1 text-[8px] lg:text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-[#006569] transition-colors">
              Explore
              <svg className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
    <UnifiedContactModal isOpen={modalConfig.isOpen} onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))} type={modalConfig.type} prefillService={modalConfig.service} prefillDetails={modalConfig.details} emailCopy={emailCopy} />
    </>
  );
}
