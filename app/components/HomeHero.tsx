'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface HeroSlide {
  badge: string;
  titleText: string;
  description: string;
  image: string;
  features: { text: string }[];
  ctaPrimary: { text: string; href: string };
}

const DEFAULT_HERO: HeroSlide[] = [
  {
    badge: "3 Star Tally Partner",
    titleText: "Fueling MSME Ambition Through Smarter Tally Systems",
    description: "We don't just implement software; we clear the path for your growth. Maximize your Tally investment with certified experts who care about your bottom line as much as you do.",
    image: "/certified partner person.png",
    features: [{ text: "Certified Tally Expertise" }, { text: "1,500+ Active Clients" }, { text: "Pan-India Remote Support" }],
    ctaPrimary: { text: "Why Choose Us", href: "/about" }
  },
  {
    badge: "TallyPrime 7.1 Available",
    titleText: "Revolutionizing Business with Smart Tally Automation",
    description: "Unleash TallyPrime 7.1 with PrimeBanking and SmartFind. We build the financial engine that turns your accounting into a growth machine.",
    image: "/sa2.png",
    features: [{ text: "PrimeBanking Payments" }, { text: "TallyDrive Cloud Backup" }, { text: "SmartFind Search" }],
    ctaPrimary: { text: "Know More", href: "/about" }
  },
  {
    badge: "Certified Cloud Solutions",
    titleText: "Tally on Cloud: Absolute Business Freedom",
    description: "Your office, now in your pocket. Secure hosting with 100% uptime and zero-loss encryption for your business data.",
    image: "/hero/dedicated-to-cloud-hosting.jpg",
    features: [{ text: "Official Secure Hosting" }, { text: "High Performance Nodes" }, { text: "24/7 Remote Access" }],
    ctaPrimary: { text: "View Cloud Plans", href: "/cloud" }
  }
];

const HIGHLIGHT_WORDS = ["smarter", "tally", "systems", "revolutionizing", "automation", "absolute", "freedom", "growth", "business"];

export default function HomeHero({ initialData, variant = 'standard' }: { initialData?: HeroSlide[], variant?: string }) {
  const [slides] = useState<HeroSlide[]>(DEFAULT_HERO);
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const current = slides[index];

  const totalSlides = slides.length;

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalSlides);
    }, 15000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  useEffect(() => {
    const text = current.titleText;
    let i = 0;
    setDisplayText('');
    setIsTyping(true);
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    typingIntervalRef.current = setInterval(() => {
      setDisplayText(text.slice(0, i));
      i++;
      if (i > text.length) { clearInterval(typingIntervalRef.current!); setIsTyping(false); }
    }, 120);

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, [index, current.titleText]);

  const goPrev = () => setIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goNext = () => setIndex((prev) => (prev + 1) % totalSlides);

  return (
    <main className="relative min-h-[550px] md:min-h-[620px] bg-[#F8FAFC] flex items-center p-4 md:p-8 lg:p-10 overflow-hidden font-sans">
      {/* Corner Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#0371a3]/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00ABE4]/10 rounded-full blur-[128px]" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#0371a3]/5 rounded-full blur-[128px]" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

        {/* Left Content */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0371a3]/10 border border-[#0371a3]/20 text-[#0371a3] text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#0371a3] animate-pulse" />
            {current.badge}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight w-full min-h-[120px] md:min-h-[160px]">
            {displayText.split(' ').map((word, i) => (
              <span key={i} className={HIGHLIGHT_WORDS.includes(word.replace(/[^a-z]/g, '').toLowerCase()) ? "text-[#00ABE4]" : "text-[#232F3E]"}>
                {word}{' '}
              </span>
            ))}
            {isTyping && <span className="inline-block w-1 h-8 md:h-10 ml-1 bg-[#00ABE4] animate-pulse" />}
          </h1>

          <p className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed font-medium">
            {current.description}
          </p>

          {/* Tickmark Features */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
            {current.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00ABE4] shrink-0" />
                <span className="text-sm font-bold text-slate-700">{f.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start pt-4">
            <Link
              href="/contact"
              className="px-8 py-4 bg-[#0371a3] text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-[#00ABE4] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#0371a3]/20 text-center"
            >
              Explore Solutions
            </Link>
            <Link
              href={current.ctaPrimary.href}
              className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-[#232F3E] font-black uppercase tracking-[0.2em] text-xs rounded-xl transition-all text-center"
            >
              {current.ctaPrimary.text}
            </Link>
          </div>

          {/* Slide Indicators */}
          {totalSlides > 1 && (
            <div className="flex items-center gap-3 pt-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === index ? 'w-8 bg-[#0371a3]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Visual */}
        <div className="lg:col-span-5 hidden lg:flex justify-center items-center">
          {index === 0 ? (
            <div className="relative w-full max-w-[500px]">
              <img
                src={current.image}
                alt={current.badge}
                className="w-full h-auto"
              />
            </div>
          ) : (
            <div className="relative w-full max-w-[450px] aspect-square">
              <div className="absolute inset-0 bg-white shadow-2xl rounded-[2rem] border border-slate-100 p-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                  <img
                    src={current.image}
                    alt={current.badge}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-slate-600 border border-slate-200 shadow-lg hover:bg-white hover:scale-110 active:scale-90 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-slate-600 border border-slate-200 shadow-lg hover:bg-white hover:scale-110 active:scale-90 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </main>
  );
}
