'use client';

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Footer from "../components/Footer";

const DEFAULTS = {
  hero_title: 'Meet the Experts Behind Your Success',
  hero_quote: '"At Sarvadnya Infotech, our strength lies in our unity and our shared passion for simplifying business technology. We don\'t just solve problems; we build lasting relationships with our clients."',
  hero_image: '',
  culture_title: 'Our Employee Culture',
  culture_items: [
    { title: 'Constant Innovation', desc: 'We encourage our team to stay ahead of the curve with regular training and certifications.' },
    { title: 'Collaborative Spirit', desc: 'Success is a team effort. We foster an environment where every voice matters.' },
    { title: 'Client-First Mindset', desc: 'Our team\'s primary goal is to ensure client satisfaction through efficient support.' }
  ],
  testimonial: '"Working at Sarvadnya Infotech LLP has been an incredible journey of growth. The leadership truly cares about our professional development and work-life balance."',
  testimonial_author: 'JD',
  testimonial_role: 'Senior Tally Consultant'
};

export default function TeamPage() {
  const [content, setContent] = useState<any>(DEFAULTS);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
    fetchTeam();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content?section=team');
      const data = await response.json();
      if (data && !data.error) {
        setContent({ ...DEFAULTS, ...data });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeam = async () => {
    try {
      const response = await fetch('/api/admin/partners?type=team');
      const data = await response.json();
      if (Array.isArray(data)) {
        setTeamMembers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero: Team Photo & Common Message (Themed Hero) */}
      <section className="bg-[#f0f8fa] py-20 px-6 sm:px-12 lg:px-24 relative overflow-hidden flex flex-col items-center border-b border-white/5">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'url(/bgggg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-0 right-0 w-[70%] h-[70%] bg-white/10 blur-[130px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-sky-200/20 blur-[110px] -ml-24 -mb-24" />
        </div>

        <div className="mx-auto max-w-7xl relative z-10 w-full flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-2 backdrop-blur-sm">
              <span className="flex h-0.5 w-0.5 rounded-full bg-slate-400"></span>
              Our Family
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
              Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] via-[#4b91ca] to-[#0371a3] drop-shadow-[0_2px_15px_rgba(0,171,228,0.3)]">Experts</span><br/>
              Behind Your Success
            </h1>
            <p className="text-lg md:text-xl text-slate-600/80 font-medium leading-relaxed italic border-l-4 border-[#0371a3] pl-6 max-w-2xl mx-auto lg:mx-0">
              {content.hero_quote}
            </p>
          </div>
          <div className="flex-1 w-full max-w-2xl">
            <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-sm shadow-2xl border border-slate-200 flex items-center justify-center p-2">
              <div className="w-full h-full rounded-[2rem] overflow-hidden">
                {content.hero_image ? (
                  <img src={content.hero_image} className="w-full h-full object-cover" alt="Team Hero" />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                    <div className="text-center p-8 opacity-20 text-[#0371a3]">
                      <svg className="w-24 h-24 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-sm font-black uppercase tracking-widest">Main Team Photo</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Team Grid */}
      {teamMembers.length > 0 && (
        <section className="py-24 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto animate-rise-up" style={{ animationDelay: '200ms' }}>
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">The A-Team</h2>
             <p className="text-slate-500 font-bold text-sm">Expert consultants and support staff dedicated to your success.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-12">
            {teamMembers.map((member, idx) => (
              <div key={member._id} className="group flex flex-col items-center text-center">
                 <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden bg-white shadow-lg border border-slate-100 mb-8 group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                    <img src={member.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={member.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0371a3]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <h4 className="font-black text-slate-900 text-xl mb-1 leading-tight group-hover:text-[#0371a3] transition-colors">{member.name}</h4>
                 <p className="text-[10px] sm:text-xs font-black text-[#0371a3] uppercase tracking-[0.2em] opacity-80">{member.description || 'Expert Consultant'}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Employee Culture Description */}
      <section className="py-24 bg-slate-50/50 border-y border-slate-100 animate-rise-up" style={{ animationDelay: '300ms' }}>
        <div className="px-6 sm:px-12 lg:px-24 max-w-5xl mx-auto text-center space-y-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{content.culture_title || 'Our Employee Culture'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(content.culture_items || []).map((item: any, idx: number) => (
              <div key={idx} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div className="w-14 h-14 bg-slate-50 group-hover:bg-[#E9F1FA] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#0371a3] transition-colors">
                  {idx === 0 ? (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ) : idx === 1 ? (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <h3 className="font-black text-slate-900 text-lg mb-2 tracking-tight">{item.title}</h3>
                <p className="text-sm text-slate-500 font-bold leading-relaxed opacity-80">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto pt-8">
            {content.culture_description || 'At Sarvadnya, we believe that a happy team leads to happy clients. Our culture is built on transparency, continuous learning, and a deep-rooted commitment to excellence in the Tally ecosystem.'}
          </p>
        </div>
      </section>

      {/* Team Review Section */}
      <section className="py-12 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto animate-rise-up" style={{ animationDelay: '400ms' }}>
        <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0371a3]/30 rounded-full -mr-24 -mt-24 blur-[80px]" />
          <div className="relative z-10 max-w-2xl mx-auto text-center lg:text-left">
            <h2 className="text-xl md:text-2xl font-black mb-6 tracking-tight text-[#0371a3]">What our team says</h2>
            <blockquote className="text-lg md:text-xl font-medium leading-tight opacity-95 mb-6 italic">
              {content.testimonial}
            </blockquote>
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-sm border border-white/10 backdrop-blur-sm">
                {content.testimonial_author.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-center lg:text-left">
                <p className="font-black text-base tracking-tight">{content.testimonial_role}</p>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{content.testimonial_author}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
