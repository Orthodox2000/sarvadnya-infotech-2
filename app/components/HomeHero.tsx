'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import UnifiedContactModal, { FormType } from './UnifiedContactModal';
import { fetchWithCache } from '@/lib/client-api';

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
      "badge": "Upgraded to Tally 7.0",
      "titleText": "Trusted Tally Partner in Navi Mumbai",
      "colorFrom": "#4f46e5",
      "colorTo": "#7c3aed",
      "description": "Beyond Software Sales — Guiding You to Maximize Your Tally Investment with Certified Support.",
      "image": "/sa.png",
      "features": [
        { "text": "TallyPrime v7.0 Ready" },
        { "text": "Certified Expert Support" },
        { "text": "Custom Module Design" },
        { "text": "Seamless Data Integrity" }
      ],
      "ctaPrimary": { "text": "Explore Capabilities", "href": "/products" }
    }
];

export default function HomeHero() {
  const [heroContents, setHeroContents] = useState<HeroContent[]>(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await fetchWithCache('/api/content?section=home_hero');
        if (Array.isArray(data) && data.length > 0) {
          setHeroContents(data);
        }
      } catch (err) {
        console.error('Failed to fetch hero content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

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
    <main className="relative w-full overflow-hidden bg-slate-950 min-h-[500px] md:min-h-[600px] max-h-[100dvh] flex items-center">
      {/* Background with Animated Gradients */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-40 transition-colors duration-[1500ms]"
          style={{ 
            background: `radial-gradient(circle at 50% 50%, ${current.colorFrom || '#4f46e5'}33 0%, transparent 70%)` 
          }}
        />
        <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center mix-blend-overlay opacity-20" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Content Side */}
          <div 
            key={`content-${activeIndex}`} 
            className="space-y-5 md:space-y-8 min-h-[300px] md:min-h-[400px] flex flex-col justify-center"
          >
            <div className={`inline-flex items-center gap-2 px-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm w-fit transition-all duration-[1200ms] delay-[100ms]
              ${isTransitioning ? 'opacity-0 translate-y-4 scale-95 blur-sm' : 'opacity-100 translate-y-0 scale-100 blur-0'}`}
            >
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                {current.badge}
              </span>
            </div>

            <div className={`relative min-h-[90px] md:min-h-[160px] transition-all duration-[1200ms] delay-[300ms]
              ${isTransitioning ? 'opacity-0 translate-y-4 scale-[0.98] blur-sm' : 'opacity-100 translate-y-0 scale-100 blur-0'}`}
            >
              {/* Invisible placeholder to maintain height */}
              <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight invisible">
                {current.titleText}
              </h1>
              {/* Actual typed text */}
              <h1 className="absolute top-0 left-0 text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight w-full">
                {displayText.split(' ').map((word, i) => (
                  <span key={i} className={i > 2 ? "text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50" : ""}>
                    {word}{' '}
                  </span>
                ))}
                {isTyping && <span className="inline-block w-1 h-8 md:h-12 bg-indigo-500 ml-1 animate-pulse" />}
              </h1>
            </div>

            <p className={`text-sm md:text-lg text-slate-400 max-w-xl leading-relaxed font-medium min-h-[60px] transition-all duration-[1200ms] delay-[500ms]
              ${isTransitioning ? 'opacity-0 translate-y-4 blur-sm' : 'opacity-100 translate-y-0 blur-0'}`}
            >
              {current.description}
            </p>

            <div className={`grid grid-cols-2 gap-4 transition-all duration-[1200ms] delay-[700ms]
              ${isTransitioning ? 'opacity-0 translate-y-4 blur-sm' : 'opacity-100 translate-y-0 blur-0'}`}
            >
              {(current.features || []).map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-300">{f.text}</span>
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
                className="group px-8 py-4 rounded-2xl bg-white text-[#0f0529] font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:bg-slate-50 hover:scale-[1.05] active:scale-95"
              >
                Request Free Demo
              </button>
            </div>
          </div>

          {/* Visual Side */}
          <div 
            key={`visual-${activeIndex}`} 
            className={`relative hidden lg:block transition-all duration-[1500ms] ease-in-out
              ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}
          >
             {/* Dynamic Float Background */}
             <div className="absolute -inset-10 bg-indigo-500/10 blur-[100px] rounded-full animate-pulse" />
             
             <div className="relative z-10 aspect-square w-full max-w-[500px] mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-[3rem] rotate-3 scale-95" />
                <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                   <div className="p-8 h-full flex flex-col items-center justify-center text-center space-y-6">
                      <div className="relative w-64 h-64 transition-transform duration-700 hover:scale-110">
                        <Image 
                          src={current.image} 
                          alt="Tally Solution" 
                          fill 
                          priority
                          className="object-contain drop-shadow-[0_20px_50px_rgba(79,70,229,0.3)]" 
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Certified Tally Partner</p>
                        <p className="text-white/60 text-xs font-medium">Verified Solutions & Expert Support Since 2008</p>
                      </div>
                   </div>
                </div>
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
