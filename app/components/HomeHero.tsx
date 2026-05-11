'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import QuickSupportModal from './QuickSupportModal';

const heroContents = [
  {
    badge: "Upgraded to Tally 7.0",
    titleText: "Expert Consultation & Services",
    gradient: "from-violet-600 to-indigo-600",
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
    badge: "Priority Support",
    titleText: "Annual Maintenance Contracts",
    gradient: "from-blue-600 to-cyan-600",
    description: "Minimize downtime and maximize productivity with our priority troubleshooting and regular health checks.",
    image: "/sa.png",
    features: [
      { text: "On-Site & Remote Support" },
      { text: "Priority Troubleshooting" },
      { text: "Data Backup Assistance" },
      { text: "Unlimited Query Resolution" }
    ],
    ctaPrimary: { text: "Learn About AMC", href: "/products" }
  },
  {
    badge: "Vertical Solutions",
    titleText: "Custom Tally Modules",
    gradient: "from-emerald-600 to-teal-600",
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const current = heroContents[currentIndex];

  // Typing effect logic
  useEffect(() => {
    let i = 0;
    const textToType = current.titleText;

    setIsTyping(true);
    setDisplayText('');
    
    const typingTimeout = setTimeout(() => {
      const typingInterval = setInterval(() => {
        setDisplayText(textToType.slice(0, i + 1));
        i++;
        if (i >= textToType.length) {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 50);

      return () => clearInterval(typingInterval);
    }, 100); // Start almost immediately (100ms)

    return () => clearTimeout(typingTimeout);
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroContents.length);
        setIsTransitioning(false);
      }, 1000);
    }, 10000); // 10 second delay

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative h-[70dvh] md:h-[85dvh] w-full overflow-hidden bg-white">
      <QuickSupportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Background Image Container - Dynamic & Animated */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 aspect-[16/9] w-full max-w-3xl h-1/2 md:h-[55dvh] z-0 transition-all duration-700 ease-in-out
        ${isTransitioning ? 'opacity-0 translate-y-12 scale-95 blur-sm' : 'opacity-90 translate-y-0 scale-100 blur-0'}`}>
        <Image
          src={current.image}
          alt="Sarvadnya Background"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full w-full flex-col items-center px-6">
        {/* Radial Gradient for text visibility */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[70%] bg-[radial-gradient(circle_at_top,rgba(255,255,255,1)_0%,rgba(255,255,255,0.9)_50%,rgba(255,255,255,0)_100%)] pointer-events-none" />

        <div className="relative z-20 mt-[30px] w-full max-w-4xl flex flex-col items-center text-center">
          
          {/* Static Global Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 border border-indigo-100 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Upgraded to Tally 7.0</span>
          </div>

          {/* Static Heading - Smaller */}
          <p className="font-sans text-[11px] md:text-[14px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Why Choose Sarvadnya Infotech LLP?
          </p>

          {/* Dynamic Content Area - Staggered with delay-250ms */}
          <div className={`flex flex-col items-center w-full transition-all duration-700 delay-[250ms] ease-in-out
            ${isTransitioning ? 'opacity-0 translate-y-12 blur-sm' : 'opacity-100 translate-y-0 blur-0'}`}>
            
            {/* Typing Sub-title - Large & Animated */}
            <h2 className="font-sans text-[24px] md:text-[42px] lg:text-[48px] font-black leading-[1.1] tracking-tight min-h-[2.2em] md:min-h-[1.2em] mb-2 overflow-visible">
              <span className={`inline-block bg-clip-text text-transparent bg-gradient-to-r ${current.gradient} px-4 py-2 -mx-4`}>
                {displayText}
              </span>
              <span className={`inline-block w-[3px] h-[0.9em] ml-1 bg-indigo-600 align-middle ${isTyping ? 'opacity-100' : 'animate-pulse'}`}></span>
            </h2>
            
            <p className="max-w-2xl mx-auto text-[12px] md:text-base font-medium leading-relaxed text-slate-700 mb-4">
              {current.description}
            </p>

            {/* Tick-marked Features */}
            <div className="mt-4 flex flex-row flex-wrap justify-center gap-x-8 gap-y-4 w-full">
              {current.features.map((feature, i) => (
                <div key={feature.text} className="flex items-center gap-2.5 group animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-both" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[11px] md:text-[14px] font-bold text-[#0f0529] whitespace-nowrap tracking-tight">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center gap-3">
              <Link
                href={current.ctaPrimary.href}
                className="group relative flex h-9 md:h-11 items-center justify-center overflow-hidden rounded-full bg-[#7338a0] px-8 md:px-10 text-[10px] md:text-xs font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <span className="relative z-10">{current.ctaPrimary.text}</span>
                <div className="absolute inset-0 z-0 translate-y-full bg-[#4a2574] transition-transform group-hover:translate-y-0" />
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex h-9 md:h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-6 md:px-8 text-[10px] md:text-xs font-bold text-[#0f0529] transition-all hover:bg-slate-50 active:scale-95"
              >
                Request Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
