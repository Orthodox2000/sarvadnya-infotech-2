'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface HubCard {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

const HUB_CARDS: HubCard[] = [
  {
    title: "Tally Products",
    description: "Explore TallyPrime Editions, Licensing, and specialized business modules.",
    href: "/products",
    color: "bg-[#0371a3]",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  {
    title: "Cloud Products",
    description: "Secure, 24/7 remote access with Official AWS and NoSky infrastructure.",
    href: "/cloud",
    color: "bg-[#0371a3]",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    )
  },
  {
    title: "Customizations",
    description: "Industry-specific TDL solutions tailored to your unique business logic.",
    href: "/modules",
    color: "bg-[#0371a3]",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a2 2 0 002 2h1a2 2 0 110 4h-1a2 2 0 00-2 2v1a2 2 0 11-4 0V4z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    title: "Our Services",
    description: "AMC, Corporate Training, WhatsApp Sync, and Expert Technical Support.",
    href: "/services",
    color: "bg-[#0371a3]",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
];

export default function QuickAccessHub({ initialData, initialModules, initialSettings }: { initialData?: any, initialModules?: any[], initialSettings?: any }) {
  const [isVisible, setIsVisible] = useState(false);
  const [cards, setCards] = useState<HubCard[]>(HUB_CARDS);

  useEffect(() => {
    if (initialData?.content?.cards) {
        setCards(initialData.content.cards);
    }
  }, [initialData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        },
        { threshold: 0.1 }
    );

    const section = document.getElementById('quick-access-hub');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="quick-access-hub" className="w-full bg-white py-16 md:py-24 px-5 border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Centered & Clean */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-[1000ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0371a3] block mb-4">
            Ecosystem Directory
          </span>
          <h2 className="text-3xl lg:text-5xl font-black text-[#232F3E] tracking-tighter mb-4 leading-tight">
            Quick Access <span className="text-sky-400">Hub</span>
          </h2>
          <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed opacity-80">
            A unified dashboard designed for professional business management, instant access, and technical excellence.
          </p>
        </div>

        {/* 4 Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <Link 
              key={idx} 
              href={card.href}
              className={`group relative flex flex-col bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm transition-all duration-[1000ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:shadow-2xl hover:shadow-[#0371a3]/10 hover:-translate-y-2 hover:border-[#0371a3]/30
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.color} text-white mb-8 shadow-lg shadow-black/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                {card.icon}
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <h3 className="text-xl font-black text-[#232F3E] tracking-tight mb-3 group-hover:text-[#0371a3] transition-colors uppercase text-[15px]">
                  {card.title}
                </h3>
                <p className="text-[13px] text-slate-500 font-bold leading-relaxed opacity-70">
                  {card.description}
                </p>
              </div>

              {/* Action Indicator */}
              <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#0371a3] transition-colors">
                Explore Page
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>

              {/* Decorative Subtle Background Glow */}
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#E9F1FA] rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
            </Link>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className={`mt-20 text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
           <Link 
            href="/contact"
            className="inline-flex h-14 px-12 items-center justify-center rounded-full bg-[#0371a3] text-white font-black text-[11px] uppercase tracking-wider border border-transparent hover:bg-white hover:text-[#0371a3] hover:border-[#0371a3] transition-all duration-500 ease-in-out hover:scale-[1.05] active:scale-95 shadow-2xl shadow-[#0371a3]/20"
          >
            Request Professional Consultation
          </Link>
        </div>

      </div>
    </section>
  );
}
