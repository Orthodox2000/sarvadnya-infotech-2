'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
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
  features: HeroFeature[];
  ctaPrimary: HeroCTA;
}

const DEFAULT_HERO = [
    {
      "badge": "TallyPrime 7.0 Now Available",
      "titleText": "Business Management — Simply Done with TallyPrime 7.0",
      "colorFrom": "#4f46e5",
      "colorTo": "#7c3aed",
      "description": "Experience the next level of business automation with PrimeBanking, TallyDrive, and SmartFind. Run your business like a pro with Sarvadnya Infotech LLP.",
      "image": "/sa.png",
      "features": [
        { "text": "PrimeBanking Payments" },
        { "text": "TallyDrive Cloud Backup" },
        { "text": "SmartFind Global Search" },
        { "text": "Bharat Connect Plug-in" }
      ],
      "ctaPrimary": { "text": "Explore v7.0 Features", "href": "/products" }
    }
];

export default function HomeHero({ initialData }: { initialData?: HeroContent[] }) {
  const [heroContents, setHeroContents] = useState<HeroContent[]>(initialData || DEFAULT_HERO);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;
    const fetchHero = async () => {
      try {
        const data = await fetchWithCache('/api/content?section=home_hero');
        if (Array.isArray(data) && data.length > 0) {
          // Append branding to each title if not already present
          const brandedData = data.map((item: HeroContent) => ({
            ...item,
            titleText: item.titleText.includes('Why Choose Sarvadnya Infotech LLP?') 
              ? item.titleText 
              : `${item.titleText.replace(/[?]+$/, '')} - Why Choose Sarvadnya Infotech LLP?`
          }));
          setHeroContents(brandedData);
        }
      } catch (err) {
        console.error('Failed to fetch hero content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, [initialData]);

  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: FormType; service: string; details: string }>({
    isOpen: false,
    type: 'general',
    service: '',
    details: ''
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [gridSize, setGridSize] = useState(40);

  useEffect(() => {
    const handleResize = () => {
      setGridSize(window.innerWidth >= 1024 ? 40 : 25);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (heroContents.length <= 1) return;
    
    let interval: NodeJS.Timeout;

    const startInterval = () => {
      interval = setInterval(() => {
        if (document.hidden) return; // Don't trigger if tab is hidden
        setIsTransitioning(true);
        setDisplayText(''); // Clear text immediately on exit
        
        setTimeout(() => {
          setActiveIndex((prev) => (prev + 1) % heroContents.length);
          // Give React a frame to mount the new key before starting entrance
          setTimeout(() => {
            setIsTransitioning(false);
          }, 50);
        }, 1500);
      }, 10000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(interval);
      } else {
        startInterval();
      }
    };

    startInterval();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [heroContents]);

  const current = heroContents[activeIndex] || DEFAULT_HERO[0];

  useEffect(() => {
    if (!current?.titleText || isTransitioning) return;
    
    // Delay typing start until fade-in is partially complete
    const delayTimer = setTimeout(() => {
      setIsTyping(true);
      let i = 0;
      const text = current.titleText;
      setDisplayText('');
      
      const timer = setInterval(() => {
        setDisplayText(text.slice(0, i));
        i++;
        if (i > text.length) {
          clearInterval(timer);
          setIsTyping(false);
        }
      }, 80); 
      
      return () => clearInterval(timer);
    }, 800);
    
    return () => clearTimeout(delayTimer);
  }, [current?.titleText, isTransitioning]);

  return (
    <main className="relative w-full overflow-hidden bg-[#fafafa] min-h-[500px] md:min-h-[650px] lg:min-h-[600px] lg:-mt-6 flex items-center">
      {/* Background Image Preloader (Hidden) */}
      <div className="absolute -z-[100] invisible h-0 w-0 overflow-hidden pointer-events-none">
        {heroContents.map((content, idx) => (
          <Image 
            key={`preload-${idx}`}
            src={content.image || "/BG3-1.png"} 
            alt="preload" 
            fill
            priority
          />
        ))}
      </div>

      {/* Interactive Background */}
      <div className="absolute inset-0 z-0">
        {/* <div 
          className="absolute inset-0 transition-all duration-[2000ms] ease-out"
          style={{ 
            background: `
              radial-gradient(circle at 20% 30%, ${current.colorFrom || '#4f46e5'}15 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, ${current.colorTo || '#7c3aed'}15 0%, transparent 50%),
              linear-gradient(to bottom, #0f0529, #1a0b45)
            ` 
          }}
        /> */}
        
        <div className="absolute inset-0 opacity-50">
          <ShapeGrid 
            speed={0.25}
            squareSize={gridSize}
            direction="diagonal"
            borderColor={current.colorFrom || '#8515f6'}
            hoverFillColor={current.colorTo || '#6302c4'}
            shape="hexagon"
            hoverTrailAmount={4}
            enableColorFlow={true}
          />
        </div>
        </div>

      <div className="w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
          
          {/* Content Side */}
          <div 
            key={`content-${activeIndex}`} 
            className="lg:justify-self-end w-full lg:max-w-[640px] px-6 lg:px-12 py-12 lg:py-20 space-y-5 md:space-y-8 min-h-[300px] md:min-h-[400px] flex flex-col justify-center"
          >
            <div className={`inline-flex items-center gap-2 px-3 rounded-full bg-indigo-50 border border-indigo-100 backdrop-blur-sm w-fit transition-all duration-[1200ms] delay-[100ms]
              ${isTransitioning ? 'opacity-0 translate-y-4 scale-95 blur-sm' : 'opacity-100 translate-y-0 scale-100 blur-0'}`}
            >
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                {current.badge}
              </span>
            </div>

            <div className={`relative min-h-[90px] md:min-h-[160px] transition-all duration-[1200ms] delay-[300ms]
              ${isTransitioning ? 'opacity-0 translate-y-4 scale-[0.98] blur-sm' : 'opacity-100 translate-y-0 scale-100 blur-0'}`}
            >
              {/* Invisible placeholder to maintain height */}
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight invisible">
                {current.titleText}
              </h1>
              {/* Actual typed text */}
              <h1 className="absolute top-0 left-0 text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight w-full">
                {displayText.split(' ').map((word, i) => (
                  <span key={i} className={i > 2 ? "text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500" : ""}>
                    {word}{' '}
                  </span>
                ))}
                {isTyping && <span className="inline-block w-1 h-8 md:h-12 bg-indigo-600 ml-1 animate-pulse" />}
              </h1>
            </div>

            <p className={`text-sm md:text-lg text-slate-600 max-w-xl leading-relaxed font-medium min-h-[60px] transition-all duration-[1200ms] delay-[500ms]
              ${isTransitioning ? 'opacity-0 translate-y-4 blur-sm' : 'opacity-100 translate-y-0 blur-0'}`}
            >
              {current.description}
            </p>

            <div className={`grid grid-cols-2 gap-4 transition-all duration-[1200ms] delay-[700ms]
              ${isTransitioning ? 'opacity-0 translate-y-4 blur-sm' : 'opacity-100 translate-y-0 blur-0'}`}
            >
              {(current.features || []).map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <svg className="w-3 h-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{f.text}</span>
                </div>
              ))}
            </div>

            <div className={`flex flex-wrap gap-4 transition-all duration-[1200ms] delay-[900ms]
              ${isTransitioning ? 'opacity-0 translate-y-4 blur-sm' : 'opacity-100 translate-y-0 blur-0'}`}
            >
              <Link 
                href={current.ctaPrimary?.href || '/products'}
                className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/40 transition-all hover:scale-[1.05] active:scale-95"
              >
                <span className="relative z-10">{current.ctaPrimary?.text || 'Explore'}</span>
                <div className="absolute inset-0 z-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0 bg-white/10" />
              </Link>
              
              <button 
                onClick={() => setModalConfig({ isOpen: true, type: 'demo', service: 'TallyPrime', details: 'Requesting a personalized demo' })}
                className="group px-8 py-4 rounded-2xl bg-slate-100 text-slate-900 font-black text-xs uppercase tracking-widest shadow-sm transition-all hover:bg-slate-200 hover:scale-[1.05] active:scale-95 border border-slate-200"
              >
                Request Free Demo
              </button>
            </div>
          </div>

          {/* Visual Side */}
          <div 
            key={`visual-${activeIndex}`} 
            className={`relative hidden lg:block w-full transition-all duration-[1500ms] ease-in-out
              ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}
          >
             <div className="relative z-10 aspect-square w-full group">
                {/* Immersive Background Image */}
                <div className="absolute inset-0 rounded-l-[3rem] overflow-hidden border-l border-slate-200 shadow-2xl shadow-indigo-500/10 isolate transform-gpu">
                  <Image 
                    src={current.image || "/BG3-1.png"} 
                    alt={current.titleText} 
                    fill 
                    priority
                    className="object-cover transition-transform duration-[3000ms] group-hover:scale-110" 
                  />
                  {/* Premium Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0529] via-transparent to-transparent opacity-10" />
                  <div className="absolute inset-0 bg-[#0f0529]/5 backdrop-blur-[0.5px]" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-start">
                  <div className="w-fit">
                    <div className="relative group/text p-4 rounded-2xl overflow-hidden transition-all duration-500">
                      {/* Subtle backplate for legibility */}
                      <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/40 to-transparent backdrop-blur-sm" />
                      
                      <div className="relative z-10 space-y-3">
                        <div className="h-1 w-12 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                        <h3 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight [text-shadow:0_4px_12px_rgba(0,0,0,0.5)]">
                          {current.badge}
                          {current.badge.includes('7.0') && !current.badge.includes('Upgraded to Tally 7.0') && (
                            <>
                              <span className="text-indigo-400 mx-2">|</span> 
                              <span className="text-white/90">Upgraded to Tally 7.0</span>
                            </>
                          )}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Corner Decoration */}
                <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-white/20 rounded-tr-2xl" />
                <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-white/20 rounded-bl-2xl" />
             </div>
          </div>

        </div>
      </div>

      <UnifiedContactModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        type={modalConfig.type}
        prefillService={modalConfig.service}
        prefillDetails={modalConfig.details}
      />
    </main>
  );
}
