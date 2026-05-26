'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { capabilityCategories } from '@/lib/capabilities';
import Footer from '@/app/components/Footer';

export default function CapabilitiesPage() {
  const [activeTab, setActiveTab] = useState(capabilityCategories[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const sections = capabilityCategories.map(cat => document.getElementById(cat.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveTab(capabilityCategories[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 160; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Compact Hero Section (Radiant Sky Theme) */}
      <section className="bg-[#f0f8fa] relative pt-10 pb-12 md:pt-14 md:pb-16 px-6 overflow-hidden border-b border-white/5">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'url(/bgggg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        {/* Background Effects */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-white/40 blur-[130px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-sky-200/30 blur-[110px] -ml-24 -mb-24" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-left max-w-xl">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
              <span className="flex h-1 w-1 rounded-full bg-slate-400"></span>
              Feature Architecture
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-5 leading-tight tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] via-[#4b91ca] to-[#0371a3] drop-shadow-[0_2px_15px_rgba(0,171,228,0.2)]">TallyPrime</span> <br />
              Core Capabilities
            </h1>
            <p className="text-slate-600/80 text-xs md:text-lg max-w-lg leading-relaxed font-semibold">
              Technical and functional architecture optimized for high-performance accounting and statutory compliance.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-4">
             <div className="p-5 bg-white border border-slate-100 rounded-3xl text-center shadow-lg shadow-sky-900/5">
                <div className="text-3xl font-black text-slate-900">500+</div>
                <div className="text-[9px] font-black text-[#0371a3] uppercase tracking-[0.2em] mt-1.5">Capabilities</div>
             </div>
             <div className="p-5 bg-white border border-slate-100 rounded-3xl text-center shadow-lg shadow-sky-900/5">
                <div className="text-3xl font-black text-slate-900">100%</div>
                <div className="text-[9px] font-black text-[#00ABE4] uppercase tracking-[0.2em] mt-1.5">Compliance</div>
             </div>
          </div>
        </div>
      </section>

      {/* Modern Compact Navigator */}
      <nav className="sticky top-[127px] z-[45] bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex items-center gap-6 min-w-max">
            {capabilityCategories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => scrollToSection(cat.id)}
                  className={`py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2.5
                    ${activeTab === cat.id 
                      ? 'border-[#0371a3] text-[#0371a3] opacity-100' 
                      : 'border-transparent text-slate-400 hover:text-slate-600 opacity-70'}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeTab === cat.id ? '#0371a3' : '#e2e8f0' }}></span>
                  {cat.title.split(' ')[0]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* High-Fidelity Categories */}
      <section className="py-12 md:py-16 px-6 max-w-7xl mx-auto">
        <div className="space-y-16">
          {capabilityCategories.map((cat) => (
            <div key={cat.id} id={cat.id} className="scroll-mt-48 animate-in fade-in duration-700">
              {/* Category Heading Card */}
              <div 
                className="mb-6 p-6 md:p-8 rounded-[2rem] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-8"
                style={{ backgroundColor: 'white', borderColor: `${cat.color}20` }}
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg" style={{ backgroundColor: cat.color }}>
                    {cat.title.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                      {cat.title}
                    </h2>
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.25em] mt-1.5">
                      Technical Logic & Integration
                    </p>
                  </div>
                </div>
                <div className="max-w-md border-l-4 border-slate-100 pl-6">
                   <p className="text-slate-600 text-xs md:text-sm font-semibold leading-relaxed italic">
                     "{cat.description}"
                   </p>
                </div>
              </div>

              {/* Denser Grid of Detailed Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cat.features.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="group p-5 rounded-2xl bg-white border border-slate-100 hover:border-[#0371a3]/30 hover:shadow-xl transition-all duration-500 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-4">
                       <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-black shadow-md"
                        style={{ backgroundColor: cat.color }}
                       >
                         {idx + 1}
                       </div>
                       <div className="h-px w-8 bg-slate-100 group-hover:w-12 group-hover:bg-[#00ABE4] transition-all duration-500" />
                    </div>
                    <h4 className="font-black text-slate-900 text-sm mb-2 leading-tight group-hover:text-[#0371a3] transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action - Compact (High Contrast) */}
      <section className="py-20 px-6 bg-slate-950 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-[#0371a3]/10 blur-[120px] pointer-events-none transition-all duration-700"></div>
         
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="w-16 h-16 bg-[#0371a3]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#0371a3]/30">
               <svg className="w-8 h-8 text-[#00ABE4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h2 className="text-2xl md:text-4xl font-black mb-5 text-white leading-tight">Experience the Full Suite</h2>
            <p className="text-slate-400 text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed font-medium">
               Technical implementation assistance for every TallyPrime capability.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <Link 
                 href="/demo"
                 className="px-8 py-4 bg-[#0371a3] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#00ABE4] hover:shadow-xl hover:shadow-sky-900/20 transition-all flex items-center gap-2.5"
               >
                 Request Live Demo
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
               </Link>
               <Link 
                 href="/contact"
                 className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
               >
                 Consult Our Team
               </Link>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
}
