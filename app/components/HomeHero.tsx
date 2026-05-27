'use client';

import { useState, useEffect, useRef } from 'react';
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
}

const DEFAULT_HERO: HeroContent[] = [
    {
      "badge": "TallyPrime 7.0 Now Available",
      "titleText": "Trusted Tally Partner in Navi Mumbai",
      "colorFrom": "#0371a3",
      "colorTo": "#00ABE4",
      "description": "Experience the next level of business automation with PrimeBanking, TallyDrive, and SmartFind. Run your business like a pro with Sarvadnya Infotech LLP.",
      "image": "/hero/hero-main.png",
      "layout": "standard",
      "features": [
        { "text": "PrimeBanking Payments" },
        { "text": "TallyDrive Cloud Backup" },
        { "text": "SmartFind Global Search" },
        { "text": "Bharat Connect Plug-in" }
      ],
      "ctaPrimary": { "text": "Explore v7.0 Features", "href": "/products" }
    },
    {
      "badge": "Certified Cloud Solutions",
      "titleText": "Reliable Cloud & Zero-Loss Backup",
      "colorFrom": "#131921",
      "colorTo": "#00ABE4",
      "description": "Modernize your TallyPrime experience with our certified cloud solutions. From Official AWS hosting to automated TallyDrive backups.",
      "image": "/hero/dedicated-to-cloud-hosting.jpg",
      "layout": "ecosystem",
      "features": [
        { "text": "Official AWS Hosting" },
        { "text": "NoSky Cloud Performance" },
        { "text": "24/7 Remote Access" },
        { "text": "Automated Server Backup" }
      ],
      "ctaPrimary": { "text": "View Cloud Plans", "href": "/cloud" }
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
    sub1Img: "/hero/Tally-Software.png",
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
    sub2Img: "/hero/Tally-Software.png"
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

const processHeroData = (data: any[]): HeroContent[] => {
  return data.map((item) => {
    const isCloud = (item.titleText || '').toLowerCase().includes('cloud');
    return {
      ...item,
      titleText: isCloud ? "Reliable Cloud & Zero-Loss Backup" : "Trusted Tally Partner in Navi Mumbai",
      image: item.image === '/sa.png' ? '/hero/hero-main.png' : item.image,
      layout: (isCloud ? 'ecosystem' : 'standard') as 'standard' | 'ecosystem',
      colorFrom: '#131921',
      colorTo: '#00ABE4'
    };
  });
};

export default function HomeHero({ initialData }: { initialData?: HeroContent[] }) {
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
          const brandedData = processHeroData(data);
          if (!brandedData.some(b => b.layout === 'ecosystem')) brandedData.push(DEFAULT_HERO[1]);
          setHeroContents(brandedData);
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

  const scheme = VISUAL_SCHEMES[stableIndex % VISUAL_SCHEMES.length];
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

  return (
    <main className="relative w-full overflow-hidden bg-white min-h-[500px] md:min-h-[650px] lg:min-h-[600px] lg:-mt-6 flex items-start">
      <div className="absolute -z-[100] invisible h-0 w-0 overflow-hidden pointer-events-none">
        {heroContents.map((content, idx) => (
          <Image key={`preload-${idx}`} src={content.image} alt="preload" fill priority sizes="1px" />
        ))}
      </div>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/bgggg.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
        <div className="absolute inset-0 opacity-40">
          <ShapeGrid speed={0.25} squareSize={gridSize} direction="diagonal" borderColor={'#E9F1FA'} hoverFillColor={'#00ABE4'} shape="hexagon" hoverTrailAmount={4} enableColorFlow={true} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0371a3]/5 via-transparent to-transparent" />
      </div>
      <div className="w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
          <div key={`content-${stableIndex}`} className="lg:justify-self-end w-full lg:max-w-[640px] px-6 lg:px-12 pt-8 lg:pt-8 pb-12 lg:pb-20 space-y-5 md:space-y-8 min-h-[300px] md:min-h-[400px] flex flex-col justify-start">
            <div className={`inline-flex items-center gap-2 px-3 mt-5 rounded-full bg-[#E9F1FA] border border-[#00ABE4]/20 backdrop-blur-sm w-fit ${getAnimationClasses('delay-0')}`}>
              <span className="flex h-2 w-2 rounded-full bg-[#00ABE4] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00ABE4]">{current.badge}</span>
            </div>
            <div className={`${getAnimationClasses('delay-100')}`}>
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] -mb-3">Why Choose Sarvadnya Infotech LLP?</p>
            </div>
            <div className={`relative min-h-[90px] md:min-h-[160px] lg:mt-[-20px] ${getAnimationClasses('delay-200')}`}>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight invisible">{current.titleText}</h1>
              <h1 className="absolute top-0 left-0 text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight w-full">
                {displayText.split(' ').map((word, i) => (
                  <span key={i} className={i > 2 ? "text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] to-[#00ABE4]" : ""}>{word}{' '}</span>
                ))}
                {isTyping && <span className="inline-block w-1 h-8 md:h-12 bg-[#0371a3] ml-1 animate-pulse" />}
              </h1>
            </div>
            <p className={`text-sm md:text-lg text-slate-600 max-w-xl leading-snug font-medium min-h-[60px] ${getAnimationClasses('delay-300')}`}>{current.description}</p>
            <div className={`grid grid-cols-2 gap-4 ${getAnimationClasses('delay-500')}`}>
              {(current.features || []).map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-[#E9F1FA] flex items-center justify-center border border-[#00ABE4]/20">
                    <svg className="w-3 h-3 text-[#00ABE4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{f.text}</span>
                </div>
              ))}
            </div>
            <div className={`flex flex-wrap gap-4 ${getAnimationClasses('delay-700')}`}>
              <Link href={current.ctaPrimary?.href || '/products'} className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-[#131921] text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/20 transition-all hover:scale-[1.05] active:scale-95">
                <span className="relative z-10">{current.ctaPrimary?.text || 'Explore'}</span>
                <div className="absolute inset-0 z-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0 bg-white/10" />
              </Link>
              <button onClick={() => setModalConfig({ isOpen: true, type: 'demo', service: 'TallyPrime', details: 'Requesting a personalized demo' })} className="group px-8 py-4 rounded-2xl bg-[#E9F1FA] text-[#0371a3] font-black text-xs uppercase tracking-widest shadow-sm transition-all hover:bg-[#d8e8f5] hover:scale-[1.05] active:scale-95 border border-[#00ABE4]/10">Request Free Demo</button>
            </div>
          </div>
          <div key={`visual-${stableIndex}`} className="relative hidden lg:flex items-center justify-center w-full px-4 xl:px-8">
             <div className="relative w-full max-w-[540px] aspect-square group">
                {current.layout === 'ecosystem' ? (
                  <div className="relative w-full h-full">
                    <div className={`absolute top-0 left-[5%] w-[85%] h-full rounded-[3rem] overflow-hidden border-4 border-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] z-20 transform bg-white
                      ${isExiting ? 'opacity-0 scale-90 translate-y-12 rotate-3 transition-all duration-[800ms]' : isEntering ? `opacity-100 transition-all duration-[1200ms] ${ecoScheme.main}` : 'opacity-0 translate-y-4'}`}>
                       <Image src={current.image} alt="Main" fill className="object-cover opacity-20 blur-xl scale-110" sizes="(max-width: 1024px) 100vw, 540px" />
                       <div className="absolute inset-0"><Image src={current.image} alt="Ecosystem" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 540px" /></div>
                    </div>
                    <div className={`absolute -top-4 -right-4 w-[40%] aspect-square rounded-[2rem] overflow-hidden border-2 border-white shadow-2xl z-30 bg-white p-4
                      ${isExiting ? 'opacity-0 translate-x-12 -translate-y-12 transition-all duration-[800ms]' : isEntering ? `opacity-100 transition-all duration-[1000ms] delay-200 ${ecoScheme.aws}` : 'opacity-0 translate-y-4'}`}>
                      <Image src="/hero/AWS.png" alt="AWS Infrastructure" fill className="object-contain p-4" sizes="200px" />
                    </div>
                    <div className={`absolute -bottom-8 right-8 w-[45%] h-[25%] rounded-[2rem] overflow-hidden border-2 border-white shadow-2xl z-40 bg-[#131921] p-4
                      ${isExiting ? 'opacity-0 translate-x-12 translate-y-12 transition-all duration-[800ms]' : isEntering ? `opacity-100 flex items-center justify-center transition-all duration-[1000ms] delay-400 ${ecoScheme.nosky}` : 'opacity-0 translate-y-4'}`}>
                       <div className="relative w-full h-full"><Image src="/hero/brand-nosky-1779439419186.webp" alt="NoSky Node" fill className="object-contain" sizes="250px" /></div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <div className={`absolute top-0 right-[5%] w-[65%] h-full rounded-[3rem] overflow-hidden border-2 border-white shadow-[0_40px_80px_-15px_rgba(3,113_163,0.3)] z-20 transform bg-white
                        ${isExiting ? 'opacity-0 scale-90 translate-y-12 transition-all duration-[800ms]' : isEntering ? `opacity-100 transition-all duration-[1200ms] ${scheme.main}` : 'opacity-0 translate-y-4'}`}>
                      <Image src={current.image} alt="Backdrop" fill className="object-cover opacity-20 blur-xl scale-110" sizes="(max-width: 1024px) 100vw, 540px" />
                      <div className="absolute inset-0"><Image src={current.image} alt={current.titleText} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 540px" /></div>
                    </div>
                    <div className={`absolute top-0 left-[5%] w-[45%] h-[50%] rounded-[2.5rem] overflow-hidden border border-slate-200/50 shadow-2xl z-30 bg-white
                        ${isExiting ? 'opacity-0 -translate-x-12 -translate-y-12 transition-all duration-[800ms]' : isEntering ? `opacity-100 transition-all duration-[1400ms] delay-200 ${scheme.sub1}` : 'opacity-0 translate-y-4'}`}>
                      <Image src={scheme.sub1Img} alt="Enterprise Logic" fill className="object-cover opacity-10 blur-lg grayscale" sizes="250px" />
                      <div className="absolute inset-0"><Image src={scheme.sub1Img} alt="Tally ERP" fill className="object-cover grayscale" sizes="250px" /></div>
                    </div>
                    <div className={`absolute bottom-[10%] left-0 w-[35%] h-[40%] rounded-[2rem] overflow-hidden border border-white/80 shadow-2xl z-40 bg-white
                        ${isExiting ? 'opacity-0 -translate-x-16 translate-y-16 transition-all duration-[800ms]' : isEntering ? `opacity-100 transition-all duration-[1600ms] delay-400 ${scheme.sub2}` : 'opacity-0 translate-y-4'}`}>
                      <Image src={scheme.sub2Img} alt="Analytics View" fill className="object-cover opacity-10 blur-md" sizes="200px" />
                      <div className="absolute inset-0"><Image src={scheme.sub2Img} alt="Business Data" fill className="object-cover" sizes="200px" /></div>
                    </div>
                  </div>
                )}
                <div className={`absolute bottom-[5%] right-0 w-[25%] h-[25%] rounded-[1.5rem] overflow-hidden border border-slate-200/50 shadow-xl z-50
                  ${isExiting ? 'opacity-0 translate-x-20 scale-50 transition-all duration-[800ms]' : isEntering ? `opacity-100 transition-all duration-[1800ms] delay-600 ${scheme.logo}` : 'opacity-0 translate-y-4'}`}>
                  <Image src="/hero/hero-logo.png" alt="Logo" fill className="object-contain p-4 bg-white" sizes="150px" />
                </div>
             </div>
          </div>
        </div>
      </div>
      <UnifiedContactModal isOpen={modalConfig.isOpen} onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))} type={modalConfig.type} prefillService={modalConfig.service} prefillDetails={modalConfig.details} />
    </main>
  );
}
