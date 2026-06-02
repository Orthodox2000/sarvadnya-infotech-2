'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UnifiedContactModal, { FormType } from './UnifiedContactModal';
import { fetchWithCache } from '@/lib/client-api';
import ShapeGrid from './ShapeGrid';

interface HeroCTA {
  text: string;
  href: string;
}

interface HeroFeature {
  text: string;
}

interface HeroContent {
  badge: string;
  titleText: string;
  colorFrom: string;
  colorTo: string;
  description: string;
  image: string;
  layout?: 'standard' | 'ecosystem';
  features: HeroFeature[];
  ctaPrimary: HeroCTA;
  sub1Img?: string;
  sub2Img?: string;
}

const DEFAULT_HERO: HeroContent[] = [
    {
      "badge": "15+ Years of Excellence",
      "titleText": "Navi Mumbai's Premier Tally Solutions Partner",
      "colorFrom": "#232F3E",
      "colorTo": "#00ABE4",
      "description": "Join 1,500+ enterprises scaling with the gold standard of automation. 15 years of certified excellence, delivering nationwide support and innovation.",
      "image": "/sa2.png",
      "layout": "standard",
      "features": [
        { "text": "Certified Tally Expertise" },
        { "text": "1,500+ Active Clients" },
        { "text": "Pan-India Remote Support" },
        { "text": "Custom TDL Solutions" }
      ],
      "ctaPrimary": { "text": "Why Choose Us", "href": "/about" },
      "sub1Img": "/hero/tssgold.png",
      "sub2Img": "/hero/hero-main.png"
    },
    {
      "badge": "TallyPrime 7.0 Now Available",
      "titleText": "Revolutionizing Business with Smart Tally Automation",
      "colorFrom": "#232F3E",
      "colorTo": "#00ABE4",
      "description": "Unleash TallyPrime 7.0 with PrimeBanking and SmartFind. We build the financial engine that turns your accounting into a growth machine.",
      "image": "/sa2.png",
      "layout": "standard",
      "features": [
        { "text": "PrimeBanking Payments" },
        { "text": "TallyDrive Cloud Backup" },
        { "text": "SmartFind Global Search" },
        { "text": "Bharat Connect Plug-in" }
      ],
      "ctaPrimary": { "text": "Know More", "href": "/about" },
      "sub1Img": "/hero/tssgold.png",
      "sub2Img": "/hero/hero-main.png"
    },
    {
      "badge": "Certified Cloud Solutions",
      "titleText": "Tally on Cloud: Absolute Freedom.",
      "colorFrom": "#232F3E",
      "colorTo": "#00ABE4",
      "description": "Your office, now in your pocket. Secure AWS-powered hosting with 100% uptime and zero-loss military encryption for your business data.",
      "image": "/hero/dedicated-to-cloud-hosting.jpg",
      "layout": "ecosystem",
      "features": [
        { "text": "Official AWS Hosting" },
        { "text": "NoSky Cloud Performance" },
        { "text": "24/7 Remote Access" },
        { "text": "Automated Server Backup" }
      ],
      "ctaPrimary": { "text": "View Cloud Plans", "href": "/cloud" }
    },
    {
      "badge": "Industry Leading Support",
      "titleText": "Instant Solutions. Zero Downtime.",
      "colorFrom": "#232F3E",
      "colorTo": "#00ABE4",
      "description": "Stop waiting for answers. Our 90% First Call Resolution standard means your technical hurdles disappear before you hang up.",
      "image": "/trainning.png",
      "layout": "standard",
      "features": [
        { "text": "Instant Remote Support" },
        { "text": "Expert TDL Debugging" },
        { "text": "Data Recovery Services" },
        { "text": "90% FCR Track Record" }
      ],
      "ctaPrimary": { "text": "Get Priority Support", "href": "/contact" },
      "sub1Img": "/PartnerBrands/Tally-Software.png",
      "sub2Img": "/sa2.png"
    },
    {
      "badge": "Smart Business Integration",
      "titleText": "WhatsApp Sync: Real-Time Growth.",
      "colorFrom": "#232F3E",
      "colorTo": "#00ABE4",
      "description": "Bridge the gap between accounting and communication. Send invoices and collection alerts directly to your customers instantly.",
      "image": "/sa3.png",
      "layout": "standard",
      "features": [
        { "text": "Automated PDF Sending" },
        { "text": "Real-time Notifications" },
        { "text": "Customer Support Sync" },
        { "text": "Bulk Report Sharing" }
      ],
      "ctaPrimary": { "text": "Get WhatsApp Sync", "href": "/services/whatsapp" },
      "sub1Img": "/hero/hero-sub1.png",
      "sub2Img": "/TDLandCustom.jpg"
    }
];

const VISUAL_SCHEMES = [
  {
    main: "scale-105 -rotate-2 -translate-x-2 hover:rotate-0",
    sub1: "rotate-6 -translate-y-8 hover:rotate-0",
    sub2: "-rotate-6 translate-x-8 hover:rotate-0",
    logo: "rotate-12 translate-y-6 hover:rotate-0",
    sub1Img: "/hero/hero-sub1.png",
    sub2Img: "/hero/hero-sub2.png"
  },
  {
    main: "scale-100 rotate-2 translate-x-2 hover:rotate-0",
    sub1: "-rotate-12 translate-y-8 hover:rotate-0",
    sub2: "rotate-12 -translate-x-8 hover:rotate-0",
    logo: "-rotate-12 -translate-y-6 hover:rotate-0",
    sub1Img: "/hero/tssgold.png",
    sub2Img: "/hero/brand-nosky-1779439419186.webp"
  },
  {
    main: "scale-110 rotate-0 translate-y-2 hover:scale-100",
    sub1: "rotate-3 -translate-x-12 -translate-y-4 hover:rotate-0",
    sub2: "-rotate-3 translate-x-12 translate-y-4 hover:rotate-0",
    logo: "rotate-0 translate-x-6 hover:scale-110",
    sub1Img: "/PartnerBrands/Tally-Software.png",
    sub2Img: "/hero/tssgold.png"
  },
  {
    main: "scale-105 rotate-1 translate-x-1 hover:rotate-0",
    sub1: "rotate-12 translate-x-8 hover:rotate-0",
    sub2: "-rotate-12 -translate-y-8 hover:rotate-0",
    logo: "rotate-6 -translate-x-6 hover:rotate-0",
    sub1Img: "/hero/brand-nosky-1779439419186.webp",
    sub2Img: "/hero/hero-sub1.png"
  },
  {
    main: "scale-100 -rotate-1 -translate-y-1 hover:scale-105",
    sub1: "-rotate-6 -translate-x-8 hover:rotate-0",
    sub2: "rotate-6 translate-y-8 hover:rotate-0",
    logo: "-rotate-3 translate-x-4 hover:rotate-0",
    sub1Img: "/hero/hero-sub2.png",
    sub2Img: "/PartnerBrands/Tally-Software.png"
  }
];

const ECOSYSTEM_SCHEMES = [
  {
    main: "-rotate-3 translate-x-2 translate-y-2",
    aws: "rotate-6 translate-x-0 translate-y-0",
    nosky: "-rotate-2 translate-x-0 translate-y-0"
  },
  {
    main: "rotate-3 -translate-x-2 -translate-y-2",
    aws: "-rotate-6 -translate-x-2 translate-y-2",
    nosky: "rotate-6 translate-x-2 -translate-y-2"
  }
];
//cahnge this for hero text bg colour
const processHeroData = (data: any[]): HeroContent[] => {
  return data.map((item) => {
    const title = (item.titleText || '').toLowerCase();
    const isCloud = title.includes('cloud');
    const isSupport = title.includes('Solution') || title.includes('Downtime')  ;
    const isTraining = title.includes('train') || title.includes('master');
    const isWhatsApp = title.includes('whatsapp') || title.includes('automation') || title.includes('custom') || title.includes('module');
    
    const baseTitle = (item.titleText || '').split(' - ')[0].trim();
    
    let sub1Img = "/hero/hero-sub1.png";
    let sub2Img = "/hero/hero-sub2.png";
    let mainImg = item.image;

    if (!mainImg || mainImg === '/sa.png') {
        mainImg = isCloud ? "/hero/dedicated-to-cloud-hosting.jpg" : "/sa2.png";
    }
    
    if (isSupport) {
      sub1Img = "/PartnerBrands/Tally-Software.png";
      sub2Img = "/sa2.png";
      mainImg = "/support.png"; 
    } else if (isTraining) {
      sub1Img = "/PartnerBrands/Tally-Software.png";
      sub2Img = "/sa2.png";
      mainImg = "/trainning.png";
    } else if (isWhatsApp) {
      mainImg = "/sa3.png";
      sub1Img = "/hero/hero-sub1.png";
      sub2Img = "/TDLandCustom.jpg";
    } else if (!isCloud) { 
      mainImg = "/sa2.png";
      sub1Img = "/hero/tssgold.png";
      sub2Img = "/hero/hero-main.png";
    }

    return {
      ...item,
      titleText: baseTitle || (isCloud ? "Reliable Cloud & Zero-Loss Backup" : "Why Choose Certified Partner?"),
      image: mainImg,
      layout: (isCloud ? 'ecosystem' : 'standard') as 'standard' | 'ecosystem',
      colorFrom: '#232F3E',
      colorTo: '#00ABE4',
      sub1Img,
      sub2Img,
      ctaPrimary: (!isCloud && !isSupport && !isTraining && !isWhatsApp) 
        ? { text: "Know More", href: "/about" } 
        : item.ctaPrimary
    };
  });
};

export default function HomeHero({ initialData, variant = 'standard' }: { initialData?: HeroContent[], variant?: 'standard' | 'radiant' | 'creative' }) {
  const [heroContents, setHeroContents] = useState<HeroContent[]>(processHeroData(initialData || DEFAULT_HERO));
  const [stableIndex, setStableIndex] = useState(0); 
  const [isExiting, setIsExiting] = useState(false); 
  const [isEntering, setIsEntering] = useState(false); 
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [gridSize, setGridSize] = useState(40);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialData) return;
    const fetchHero = async () => {
      try {
        const data = await fetchWithCache('/api/content?section=home_hero');
        if (Array.isArray(data) && data.length > 0) {
          setHeroContents(processHeroData(data));
        }
      } catch (err) { console.error('Failed to fetch hero content:', err); }
    };
    fetchHero();
  }, [initialData]);

  useEffect(() => {
    const handleResize = () => setGridSize(window.innerWidth >= 1024 ? 40 : 25);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (heroContents.length <= 1) return;
    const runCarousel = () => {
      timerRef.current = setTimeout(() => {
        if (document.hidden) { runCarousel(); return; }
        setIsExiting(true);
        setIsEntering(false);
        setTimeout(() => {
          setStableIndex((prev) => (prev + 1) % heroContents.length);
          setTimeout(() => {
            setIsExiting(false);
            setIsEntering(true);
            runCarousel();
          }, 150);
        }, 800);
      }, 7050); 
    };
    const initialEntry = setTimeout(() => setIsEntering(true), 100);
    runCarousel();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); clearTimeout(initialEntry); };
  }, [heroContents.length]);

  const current = heroContents[stableIndex] || DEFAULT_HERO[0];

  useEffect(() => {
    if (!current?.titleText || !isEntering || isExiting) { setDisplayText(''); return; }
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    const startTyping = () => {
      setIsTyping(true);
      let i = 0;
      const text = current.titleText;
      setDisplayText('');
      typingIntervalRef.current = setInterval(() => {
        setDisplayText(text.slice(0, i));
        i++;
        if (i > text.length) { if (typingIntervalRef.current) clearInterval(typingIntervalRef.current); setIsTyping(false); }
      }, 40); 
    };
    const initialDelay = setTimeout(startTyping, 700);
    return () => { clearTimeout(initialDelay); if (typingIntervalRef.current) clearInterval(typingIntervalRef.current); };
  }, [stableIndex, isEntering, isExiting, current.titleText]);

  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: FormType; service: string; details: string }>({ isOpen: false, type: 'general', service: '', details: '' });

  const scheme = {
    ...VISUAL_SCHEMES[stableIndex % VISUAL_SCHEMES.length],
    sub1Img: (current as any).sub1Img || VISUAL_SCHEMES[stableIndex % VISUAL_SCHEMES.length].sub1Img,
    sub2Img: (current as any).sub2Img || VISUAL_SCHEMES[stableIndex % VISUAL_SCHEMES.length].sub2Img
  };
  const ecoScheme = ECOSYSTEM_SCHEMES[stableIndex % ECOSYSTEM_SCHEMES.length];

  const getAnimationClasses = (delayClass: string) => {
    if (isExiting) return 'opacity-0 translate-y-4 blur-sm transition-all duration-[800ms]';
    if (!isEntering) return 'opacity-0 translate-y-4 blur-sm';
    const motionPaths = ['translate-y-0', '-translate-x-0', 'translate-x-0', 'scale-100'];
    const initialStates = ['translate-y-8', '-translate-x-12', 'translate-x-12', 'scale-90'];
    const pathIdx = stableIndex % motionPaths.length;
    const isActive = isEntering && !isExiting;
    return `transition-all duration-[1000ms] ${delayClass} ${isActive ? `opacity-100 ${motionPaths[pathIdx]} blur-0` : `opacity-0 ${initialStates[pathIdx]} blur-sm`}`;
  };

  const getVariantBg = () => {
    return 'bg-[linear-gradient(45deg,hsla(221,83%,53%,1)_0%,hsla(192,91%,36%,1)_100%)]';
  };

  return (
    <>
    <main className={`relative w-full overflow-hidden opacity-80 md:opacity-90 transition-all duration-1000 ${getVariantBg()} min-h-[550px] md:min-h-[700px] lg:min-h-[650px] lg:-mt-10 flex items-start`}>
      <div className="absolute -z-[100] invisible h-0 w-0 overflow-hidden pointer-events-none">
        {heroContents.map((content, idx) => (
          <div key={`preload-wrap-${idx}`} className="relative h-1 w-1">
            <Image key={`preload-${idx}`} src={content.image} alt="preload" fill priority sizes="1px" />
          </div>
        ))}
      </div>
      
      <div className="absolute inset-0 z-0 overflow-hidden">
        {variant === 'creative' ? (
          <>
            <div className="absolute top-[-15%] left-[-15%] w-[70%] h-[70%] rounded-full blur-[140px] animate-[pulse_10s_infinite]" style={{ backgroundColor: `rgba(255,255,255,0.2)` }} />
            <div className="absolute bottom-[-15%] right-[-15%] w-[70%] h-[70%] rounded-full blur-[140px] animate-[pulse_12s_infinite_2s]" style={{ backgroundColor: `rgba(255,255,255,0.1)` }} />
            
            <div className="absolute top-[18%] left-[8%] w-24 h-24 bg-white/20 backdrop-blur-xl border border-white/20 rounded-3xl rotate-12 animate-[bounce_10s_infinite] shadow-xl z-10 hidden lg:block" />
            <div className="absolute bottom-[22%] right-[38%] w-20 h-20 bg-white/20 backdrop-blur-lg border border-white/20 rounded-full -rotate-12 animate-[bounce_12s_infinite_1s] shadow-xl z-10 hidden lg:block" />
          </>
        ) : (
          <>
            <div className={`absolute inset-0 opacity-[0.2] pointer-events-none`} style={{ backgroundImage: 'url("/bgggg.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
            <div className={`absolute inset-0 opacity-40`}>
              <ShapeGrid speed={0.25} squareSize={gridSize} direction="diagonal" borderColor={'rgba(255,255,255,0.2)'} hoverFillColor={'#70f2f2'} shape="hexagon" hoverTrailAmount={4} enableColorFlow={true} />
            </div>
          </>
        )}

        {variant === 'creative' && (
           <div className="absolute inset-0 opacity-20">
              <ShapeGrid speed={0.15} squareSize={gridSize} direction="diagonal" borderColor={'rgba(255,255,255,0.3)'} hoverFillColor={'#70f2f2'} shape="hexagon" hoverTrailAmount={2} enableColorFlow={true} />
           </div>
        )}
      </div>

      <div className="w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div key={`content-${stableIndex}`} className="lg:col-span-6 lg:justify-self-end w-full px-6 lg:px-12 pt-12 lg:pt-16 pb-12 lg:pb-24 space-y-5 lg:space-y-5 min-h-[350px] md:min-h-[450px] flex flex-col justify-start relative z-30">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/30 backdrop-blur-md w-fit ${getAnimationClasses('delay-0')} bg-white/20`}>
              <span className={`flex h-2 w-2 rounded-full animate-pulse bg-white`} />
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] text-white`}>{current.badge}</span>
            </div>
            
            <div className={`${getAnimationClasses('delay-100')}`}>
               <p className={`text-[10px] font-black uppercase tracking-[0.3em] -mb-1 text-white/90`}>Why Choose Sarvadnya Infotech LLP?</p>
            </div>

            <div className={`relative min-h-[80px] md:min-h-[140px] lg:mt-[-5px] ${getAnimationClasses('delay-200')}`}>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.15] tracking-tight invisible">{current.titleText}</h1>
              <h1 className="absolute top-0 left-0 text-3xl md:text-5xl font-black text-white leading-[1.15] tracking-tight w-full drop-shadow-lg flex flex-wrap items-baseline">
                {displayText.split(' ').map((word, i, arr) => {
                  const cleanWord = word.replace(/[.,%]/g, '').toLowerCase();
                  const titleLower = (current.titleText || '').toLowerCase();
                  const isCloudSlide = titleLower.includes('cloud');
                  const isDemoSlide = titleLower.includes('demo') || titleLower.includes('future') || titleLower.includes('witness');
                  const isModuleSlide = titleLower.includes('module');
                  
                  let isHighlight = false;
                  if (isCloudSlide) {
                    isHighlight = cleanWord === 'backup' || cleanWord === 'reliable';
                  } else if (isDemoSlide) {
                    isHighlight = cleanWord === 'automation' || cleanWord === 'future' || cleanWord === 'witness' || cleanWord === 'explore' || cleanWord === 'business' || cleanWord === 'modules';
                  } else if (isModuleSlide) {
                    isHighlight = cleanWord === 'modules' || cleanWord === 'custom' || cleanWord === 'tally';
                  } else {
                    isHighlight = word.includes('90%') || cleanWord === 'certified' || cleanWord === 'partner' || cleanWord === 'trusted';
                  }

                  const shouldBreak = isModuleSlide && cleanWord === 'modules';
                  
                  return (
                    <span key={i} className="contents">
                      {shouldBreak && <div className="basis-full h-0" />}
                      <span className={isHighlight ? "text-transparent bg-clip-text bg-gradient-to-r from-[#70f2f2] via-white to-[#70f2f2] animate-shimmer inline-block" : ""}>
                        {word}&nbsp;
                      </span>
                    </span>
                  );
                })}
                {isTyping && <span className={`inline-block w-1 h-7 md:h-10 ml-0.5 animate-pulse bg-white`} />}
              </h1>
            </div>

            <p className={`text-sm md:text-lg text-white/90 max-w-4xl leading-relaxed font-semibold min-h-[50px] lg:-mt-6 ${getAnimationClasses('delay-300')}`}>{current.description}</p>
            
            <div className={`grid grid-cols-2 gap-5 ${getAnimationClasses('delay-500')}`}>
              {(current.features || []).map((f, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className={`h-7 w-7 rounded-xl flex items-center justify-center border border-white/20 transition-transform group-hover:scale-110 shrink-0 bg-white/20`}>
                    <svg className={`w-4 h-4 text-[#70f2f2]`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className={`text-sm font-black text-white/90 group-hover:text-[#70f2f2] transition-colors`}>{f.text}</span>
                </div>
              ))}
            </div>

            <div className={`flex flex-wrap gap-4 pt-2 ${getAnimationClasses('delay-700')}`}>
              <Link href={current.ctaPrimary?.href || '/products'} className={`group relative overflow-hidden px-7 py-3.5 rounded-xl bg-white text-[#232F3E] font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 ease-in-out hover:scale-[1.05] active:scale-95 shadow-xl`}>
                <span className="relative z-10">{current.ctaPrimary?.text || 'Explore'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#70f2f2]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
              <button 
                onClick={() => setModalConfig({ isOpen: true, type: 'demo', service: 'TallyPrime', details: 'Requesting a personalized demo' })} 
                className={`group px-7 py-3.5 rounded-xl bg-transparent font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 ease-in-out text-white hover:bg-white/10 hover:scale-[1.05] active:scale-95 border border-white/30`}
              >
                Request Demo
              </button>
            </div>
          </div>

          <div key={`visual-${stableIndex}`} className="lg:col-span-6 relative hidden lg:flex items-center justify-center w-full px-8 xl:px-16 lg:-mt-16 z-10">
             <div className="relative w-full max-w-[640px] aspect-square group">
                {variant === 'creative' && (
                  <div className="absolute -inset-10 rounded-full blur-[80px] animate-pulse" style={{ background: `linear-gradient(to top right, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.2))` }} />
                )}
                
                {current.layout === 'ecosystem' ? (
                   <div className="relative w-full h-full scale-[1.0]">
                    <div className={`absolute top-[10%] left-[15%] w-[75%] aspect-square rounded-[3.5rem] overflow-hidden border border-[#232F3E]/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] z-30 transform bg-white
                      ${isExiting ? 'opacity-0 scale-90 translate-y-12 transition-all duration-[800ms]' : isEntering ? `opacity-100 transition-all duration-[1200ms] ${ecoScheme.main}` : 'opacity-0 translate-y-4'}`}>
                       <Image src={current.image} alt="Main" fill className="object-cover opacity-20 blur-xl scale-110" sizes="(max-width: 1024px) 100vw, 540px" />
                       <div className="absolute inset-0 relative w-full h-full"><Image src={current.image} alt="Ecosystem" fill className="object-contain p-8" sizes="(max-width: 1024px) 100vw, 540px" /></div>
                    </div>
                    <div className={`absolute top-[-8%] right-[-5%] w-[45%] aspect-square rounded-[2rem] overflow-hidden border border-slate-200/50 shadow-2xl z-50 bg-white p-4
                      ${isExiting ? 'opacity-0 translate-x-12 -translate-y-12 transition-all duration-[800ms]' : isEntering ? `opacity-100 transition-all duration-[1000ms] delay-200 ${ecoScheme.aws}` : 'opacity-0 translate-y-4'}`}>
                      <Image src="/hero/AWS.png" alt="AWS Infrastructure" fill className="object-contain p-4" sizes="200px" />
                    </div>
                    <div className={`absolute bottom-[-8%] left-[-5%] w-[40%] aspect-square rounded-[2rem] overflow-hidden border border-slate-200/50 shadow-2xl z-40 bg-[#232F3E] p-4
                      ${isExiting ? 'opacity-0 -translate-x-12 translate-y-12 transition-all duration-[800ms]' : isEntering ? `opacity-100 flex items-center justify-center transition-all duration-[1000ms] delay-400 ${ecoScheme.nosky}` : 'opacity-0 translate-y-4'}`}>
                       <div className="relative w-full h-full"><Image src="/hero/brand-nosky-1779439419186.webp" alt="NoSky Node" fill className="object-contain" sizes="250px" /></div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full scale-[0.8]">
                    <div className={`absolute top-[10%] right-0 w-[80%] aspect-square rounded-[4rem] overflow-hidden border-2 border-white shadow-[0_50px_100px_-20px_rgba(3,113_163,0.4)] z-40 transform bg-white
                        ${isExiting ? 'opacity-0 scale-90 translate-y-12 transition-all duration-[800ms]' : isEntering ? `opacity-100 transition-all duration-[1200ms] ${scheme.main}` : 'opacity-0 translate-y-4'}`}>
                      <Image src={current.image} alt="Backdrop" fill className="object-cover opacity-30 blur-2xl scale-110" sizes="(max-width: 1024px) 100vw, 540px" />
                      <div className="absolute inset-0 relative w-full h-full"><Image src={current.image} alt={current.titleText} fill priority className="object-contain p-10" sizes="(max-width: 1024px) 100vw, 540px" /></div>
                    </div>
                    <div className={`absolute top-[-10%] left-0 w-[50%] aspect-square rounded-[2.5rem] overflow-hidden border border-slate-200/50 shadow-2xl z-50 bg-white
                        ${isExiting ? 'opacity-0 -translate-x-12 -translate-y-12 transition-all duration-[800ms]' : isEntering ? `opacity-100 transition-all duration-[1400ms] delay-200 ${scheme.sub1}` : 'opacity-0 translate-y-4'}`}>
                      <Image src={scheme.sub1Img} alt="Enterprise Logic" fill className="object-cover opacity-10 blur-lg" sizes="250px" />
                      <div className="absolute inset-0 relative w-full h-full"><Image src={scheme.sub1Img} alt="Tally ERP" fill className="object-contain" sizes="250px" /></div>
                    </div>
                    <div className={`absolute bottom-[-10%] left-[-10%] w-[45%] aspect-square rounded-[2rem] overflow-hidden border border-white/80 shadow-2xl z-30 bg-white
                        ${isExiting ? 'opacity-0 -translate-x-16 translate-y-16 transition-all duration-[800ms]' : isEntering ? `opacity-100 transition-all duration-[1600ms] delay-400 ${scheme.sub2}` : 'opacity-0 translate-y-4'}`}>
                      <Image src={scheme.sub2Img} alt="Analytics View" fill className="object-cover opacity-10 blur-md" sizes="200px" />
                      <div className="absolute inset-0 relative w-full h-full"><Image src={scheme.sub2Img} alt="Business Data" fill className="object-contain" sizes="200px" /></div>
                    </div>
                  </div>
                )}
                
                <div className={`absolute bottom-[5%] right-[-5%] w-[30%] h-[30%] rounded-[2rem] overflow-hidden border-2 border-white shadow-2xl z-50 scale-[0.8] bg-white p-6
                  ${isExiting ? 'opacity-0 translate-x-20 scale-50 transition-all duration-[800ms]' : isEntering ? `opacity-100 transition-all duration-[1800ms] delay-600 ${scheme.logo}` : 'opacity-0 translate-y-4'}`}>
                  <Image src="/logo.svg" alt="Logo" fill className="object-contain" sizes="200px" style={{ filter: 'invert(31%) sepia(94%) saturate(1131%) hue-rotate(167deg) brightness(91%) contrast(98%)' }} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
    <UnifiedContactModal isOpen={modalConfig.isOpen} onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))} type={modalConfig.type} prefillService={modalConfig.service} prefillDetails={modalConfig.details} />
    </>
  );
}
