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
    <main className="min-h-screen bg-white text-slate-900">
      {/* Segment 1: Company Information (Themed Hero) */}
      <section className="bg-[#f0f8fa] pt-12 pb-16 px-6 sm:px-10 lg:px-20 relative overflow-hidden flex flex-col items-center border-b border-white/5">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'url(/bgggg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-0 right-0 w-[70%] h-[70%] bg-white/10 blur-[130px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-sky-200/20 blur-[110px] -ml-24 -mb-24" />
        </div>

        <div className="mx-auto max-w-6xl relative z-10 w-full flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-5">
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-2 backdrop-blur-sm">
              <span className="flex h-0.5 w-0.5 rounded-full bg-slate-400"></span>
              About Sarvadnya
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] via-[#4b91ca] to-[#0371a3] drop-shadow-[0_2px_15px_rgba(0,171,228,0.3)]">
                {content.hero_title.split(' ')[0]}
              </span>{' '}
              {content.hero_title.split(' ').slice(1).join(' ')}<br/>
              <span className="text-[#0371a3] text-xl md:text-2xl font-bold">{content.hero_subtitle}</span>
            </h1>
            <p className="text-base text-slate-600/80 leading-relaxed font-medium whitespace-pre-wrap max-w-xl">
              {content.hero_description}
            </p>
          </div>
          <div className="flex-1 w-full max-w-sm">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-2xl border border-slate-200 flex items-center justify-center">
              {content.hero_image ? (
                <img src={content.hero_image} className="w-full h-full object-cover" alt="About Hero" />
              ) : (
                <div className="text-[#0371a3] opacity-20 text-center p-6">
                  <svg className="w-20 h-20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest">Office / Team Photo</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Segment 2: Partner Statement 1 - Suman Sawant */}
      <section className="py-20 bg-white animate-rise-up" style={{ animationDelay: '200ms' }}>
        <div className="px-6 sm:px-10 lg:px-20 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1 space-y-5">
              <div className="inline-block px-3 py-1 rounded-full bg-[#E9F1FA] text-[#0371a3] text-[10px] font-black uppercase tracking-widest">
                Leadership
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                {content.partner1_name}, <span className="text-[#0371a3]">Partner</span>
              </h2>
              <blockquote className="text-base text-slate-600 border-l-4 border-[#0371a3] pl-6 py-2 leading-relaxed italic font-medium">
                "{content.partner1_quote}"
              </blockquote>
            </div>
            <div className="flex-1 w-full max-w-xs">
              <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-50 shadow-xl border border-slate-100 flex items-center justify-center group">
                {content.partner1_image ? (
                  <img src={content.partner1_image} className="w-full h-full object-cover" alt={content.partner1_name} />
                ) : (
                  <div className="text-[#0371a3] opacity-30 text-center transition-transform group-hover:scale-110">
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
      <section className="py-20 bg-slate-50/50 animate-rise-up" style={{ animationDelay: '400ms' }}>
        <div className="px-6 sm:px-10 lg:px-20 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-5">
              <div className="inline-block px-3 py-1 rounded-full bg-[#E9F1FA] text-[#0371a3] text-[10px] font-black uppercase tracking-widest">
                Strategic Vision
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                {content.partner2_name}, <span className="text-[#0371a3]">Partner</span>
              </h2>
              <blockquote className="text-base text-slate-600 border-l-4 border-[#0371a3] pl-6 py-2 leading-relaxed italic font-medium">
                "{content.partner2_quote}"
              </blockquote>
            </div>
            <div className="flex-1 w-full max-w-xs">
              <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-white shadow-xl border border-slate-100 flex items-center justify-center group">
                {content.partner2_image ? (
                  <img src={content.partner2_image} className="w-full h-full object-cover" alt={content.partner2_name} />
                ) : (
                  <div className="text-[#0371a3] opacity-30 text-center transition-transform group-hover:scale-110">
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
        <section className="py-24 px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto animate-rise-up" style={{ animationDelay: '500ms' }}>
           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                 <div className="inline-block px-3 py-1 rounded-full bg-[#E9F1FA] text-[#0371a3] text-[10px] font-black uppercase tracking-widest mb-4">
                    {content.gallery_badge || 'Inside Sarvadnya'}
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                    {content.gallery_title || 'Our Workspace & Culture'}
                 </h2>
              </div>
              <p className="text-slate-500 font-bold max-w-sm text-sm">
                {content.gallery_description || 'A glimpse into our daily operations and the environment where excellence is crafted.'}
              </p>
           </div>
           
           <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
              {gallery.map((item, idx) => (
                <div key={item._id} className="relative group rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-100 break-inside-avoid transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                   <img src={item.imageUrl} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" alt={item.name} />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0371a3]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                      <h4 className="text-white font-black text-xl mb-1 tracking-tight">{item.name}</h4>
                      {item.description && <p className="text-white/80 text-xs font-bold leading-relaxed">{item.description}</p>}
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
