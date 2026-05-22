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
    <main className="min-h-screen bg-[var(--background-color)]">
      {/* Hero: Team Photo & Common Message */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto animate-rise-up">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-sm font-bold uppercase tracking-wider">
              Our Family
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--heading-color)] leading-tight">
              {content.hero_title}
            </h1>
            <p className="text-xl text-[var(--para-color)] font-medium leading-relaxed italic border-l-4 border-[var(--primary-color)] pl-6">
              {content.hero_quote}
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden bg-white shadow-2xl border-4 border-white">
              {content.hero_image ? (
                <img src={content.hero_image} className="w-full h-full object-cover" alt="Team Hero" />
              ) : (
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                  <div className="text-center p-8 opacity-20">
                    <svg className="w-24 h-24 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm font-black uppercase tracking-widest">Main Team Photo Slot</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Team Grid */}
      {teamMembers.length > 0 && (
        <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto animate-rise-up" style={{ animationDelay: '200ms' }}>
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-3xl md:text-5xl font-black text-[var(--heading-color)]">The A-Team</h2>
             <p className="text-[var(--para-color)] opacity-60 font-medium">Expert consultants and support staff dedicated to your success.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10">
            {teamMembers.map((member, idx) => (
              <div key={member._id} className="group flex flex-col items-center text-center">
                 <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden bg-white shadow-xl border-4 border-white mb-6 group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                    <img src={member.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={member.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-color)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <h4 className="font-black text-[var(--heading-color)] text-lg mb-1 leading-tight group-hover:text-[var(--primary-color)] transition-colors">{member.name}</h4>
                 <p className="text-[10px] sm:text-xs font-bold text-[var(--primary-color)] uppercase tracking-[0.2em] opacity-70">{member.description || 'Expert Consultant'}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Employee Culture Description */}
      <section className="py-20 bg-white animate-rise-up" style={{ animationDelay: '300ms' }}>
        <div className="px-6 sm:px-12 lg:px-24 max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--heading-color)]">{content.culture_title || 'Our Employee Culture'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(content.culture_items || []).map((item: any, idx: number) => (
              <div key={idx} className="p-8 rounded-3xl bg-[var(--background-color)] border border-[var(--primary-color)]/5">
                <div className="w-12 h-12 bg-[var(--primary-color)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--primary-color)]">
                  {idx === 0 ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ) : idx === 1 ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--para-color)] opacity-70">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-lg text-[var(--para-color)] opacity-90 leading-relaxed max-w-3xl mx-auto pt-6">
            {content.culture_description || 'At Sarvadnya, we believe that a happy team leads to happy clients. Our culture is built on transparency, continuous learning, and a deep-rooted commitment to excellence in the Tally ecosystem.'}
          </p>
        </div>
      </section>

      {/* Team Review Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto animate-rise-up" style={{ animationDelay: '400ms' }}>
        <div className="bg-[var(--heading-color)] rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary-color)]/20 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-black mb-8">What our team says</h2>
            <blockquote className="text-2xl md:text-3xl font-medium leading-tight opacity-90">
              {content.testimonial}
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold">
                {content.testimonial_author.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold">{content.testimonial_role}</p>
                <p className="text-sm opacity-60">{content.testimonial_author}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
