'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Footer from "../components/Footer";

const DEFAULTS = {
  hero_title: 'SARVADNYA INFOTECH LLP',
  hero_subtitle: 'Your Trusted Solution Partner',
  hero_description: 'Since 2008, Sarvadnya Infotech LLP, a Certified Tally Partner, has served over 1,500 satisfied clients with top-quality Tally Software solutions and services. We are renowned for transparent consultancy and tailored solutions that drive business growth, delivered swiftly by our expert team who understand client needs and pain points.',
  hero_image: '',
  partner1_name: 'Suman Sawant',
  partner1_quote: 'Suman brings extensive industry experience. Passionate about finance and technology, she helps businesses adopt the right systems for efficient financial management and automates manual processes. She also lectures on Tally technology for ICAI audits.',
  partner1_image: '',
  partner2_name: 'Mr. Madhukar Sawant',
  partner2_quote: 'Madhukar specializes in guiding businesses through seamless technology adoption. His personalized approach ensures solutions aligned with client goals, enhancing efficiency and productivity.',
  partner2_image: '',
  gallery_badge: 'Inside Sarvadnya',
  gallery_title: 'Our Workspace & Culture',
  gallery_description: 'A glimpse into our daily operations and the environment where excellence is crafted.',
};

export default function AboutPage() {
  const [content, setContent] = useState<any>(DEFAULTS);
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
    fetchGallery();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content?section=about');
      const data = await response.json();
      if (data && !data.error) {
        setContent({ ...DEFAULTS, ...data });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/admin/partners?type=about');
      const data = await response.json();
      if (Array.isArray(data)) {
        setGallery(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background-color)]">
      {/* Segment 1: Company Information */}
      <section className="pt-6 pb-12 px-6 sm:px-10 lg:px-20 max-w-6xl mx-auto animate-rise-up">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-5">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--heading-color)] leading-tight">
              {content.hero_title} <br/>
              <span className="text-[var(--primary-color)] text-xl md:text-2xl">{content.hero_subtitle}</span>
            </h1>
            <p className="text-base text-[var(--para-color)] opacity-90 leading-relaxed whitespace-pre-wrap">
              {content.hero_description}
            </p>
          </div>
          <div className="flex-1 w-full max-w-sm">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-xl border border-[var(--primary-color)]/20 flex items-center justify-center">
              {content.hero_image ? (
                <img src={content.hero_image} className="w-full h-full object-cover" alt="About Hero" />
              ) : (
                <div className="text-[var(--primary-color)] opacity-20 text-center p-6">
                  <svg className="w-20 h-20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-xs font-medium uppercase tracking-widest">Company Office / Team Photo</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Segment 2: Partner Statement 1 - Suman Sawant */}
      <section className="py-16 bg-white animate-rise-up" style={{ animationDelay: '200ms' }}>
        <div className="px-6 sm:px-10 lg:px-20 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1 space-y-5">
              <div className="inline-block px-3 py-1 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-xs font-bold uppercase tracking-wider">
                Leadership
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading-color)]">
                {content.partner1_name}, <span className="text-[var(--primary-color)]">Partner</span>
              </h2>
              <blockquote className="text-base text-[var(--para-color)] border-l-4 border-[var(--primary-color)] pl-5 py-1.5 leading-relaxed">
                "{content.partner1_quote}"
              </blockquote>
            </div>
            <div className="flex-1 w-full max-w-xs">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-[var(--background-color)] shadow-lg border border-[var(--primary-color)]/10 flex items-center justify-center group">
                {content.partner1_image ? (
                  <img src={content.partner1_image} className="w-full h-full object-cover" alt={content.partner1_name} />
                ) : (
                  <div className="text-[var(--primary-color)] opacity-30 text-center transition-transform group-hover:scale-110">
                    <svg className="w-16 h-16 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">{content.partner1_name} Photo</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Segment 3: Partner Statement 2 - Mr. Madhukar Sawant */}
      <section className="py-16 animate-rise-up" style={{ animationDelay: '400ms' }}>
        <div className="px-6 sm:px-10 lg:px-20 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-5">
              <div className="inline-block px-3 py-1 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-xs font-bold uppercase tracking-wider">
                Strategic Vision
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading-color)]">
                {content.partner2_name}, <span className="text-[var(--primary-color)]">Partner</span>
              </h2>
              <blockquote className="text-base text-[var(--para-color)] border-l-4 border-[var(--primary-color)] pl-5 py-1.5 leading-relaxed">
                "{content.partner2_quote}"
              </blockquote>
            </div>
            <div className="flex-1 w-full max-w-xs">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-lg border border-[var(--primary-color)]/10 flex items-center justify-center group">
                {content.partner2_image ? (
                  <img src={content.partner2_image} className="w-full h-full object-cover" alt={content.partner2_name} />
                ) : (
                  <div className="text-[var(--primary-color)] opacity-30 text-center transition-transform group-hover:scale-110">
                    <svg className="w-16 h-16 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">{content.partner2_name} Photo</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Gallery Section */}
      {gallery.length > 0 && (
        <section className="py-20 px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto animate-rise-up" style={{ animationDelay: '500ms' }}>
           <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                 <div className="inline-block px-3 py-1 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-[10px] font-black uppercase tracking-widest mb-4">
                    {content.gallery_badge || 'Inside Sarvadnya'}
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black text-[var(--heading-color)] leading-tight">
                    {content.gallery_title || 'Our Workspace & Culture'}
                 </h2>
              </div>
              <p className="text-[var(--para-color)] opacity-60 font-medium max-w-sm">
                {content.gallery_description || 'A glimpse into our daily operations and the environment where excellence is crafted.'}
              </p>
           </div>
           
           <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {gallery.map((item, idx) => (
                <div key={item._id} className="relative group rounded-3xl overflow-hidden shadow-lg border border-slate-100 break-inside-avoid transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                   <img src={item.imageUrl} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" alt={item.name} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                      <h4 className="text-white font-bold text-lg">{item.name}</h4>
                      {item.description && <p className="text-white/70 text-xs mt-1">{item.description}</p>}
                   </div>
                </div>
              ))}
           </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
