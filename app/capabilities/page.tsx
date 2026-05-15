'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { capabilityCategories } from '../../lib/capabilities';
import Footer from '../components/Footer';

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
    <div className="min-h-screen bg-slate-50/50">
      {/* Compact Hero Section */}
      <section className="relative pt-8 pb-12 md:pt-8 md:pb-16 px-6 bg-[#0f0529]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-indigo-500 blur-[100px] rounded-full" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[9px] font-black uppercase tracking-widest mb-4">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#7338a0]"></span>
              Professional Feature Guide
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
              TallyPrime <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7338a0] to-indigo-300">Core Capabilities</span>
            </h1>
            <p className="text-white/50 text-xs md:text-sm max-w-lg leading-relaxed font-medium">
              A deep-dive into the technical and functional architecture that powers modern business accounting. Optimized for performance and statutory compliance.
            </p>
          </div>
          
          <div className="hidden lg:flex items-center gap-4">
             <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                <div className="text-2xl font-black text-white">500+</div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Built-in Features</div>
             </div>
             <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                <div className="text-2xl font-black text-white">100%</div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Compliance Rate</div>
             </div>
          </div>
        </div>
      </section>

      {/* Modern Compact Navigator */}
      <nav className="sticky top-[127px] z-[45] bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex items-center gap-6 min-w-max">
            {capabilityCategories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => scrollToSection(cat.id)}
                  className={`py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2
                    ${activeTab === cat.id 
                      ? 'border-[var(--active-color)] text-[var(--active-color)] opacity-100' 
                      : 'border-transparent text-slate-400 hover:text-slate-600 opacity-70'}`}
                  style={{ '--active-color': cat.color } as any}
                >
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
                className="mb-6 p-6 md:p-8 rounded-[2rem] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                style={{ backgroundColor: cat.bgLight, borderColor: `${cat.color}20` }}
              >
                <div className="flex items-center gap-6">
                  <div>
                    <h2 className="text-xl md:text-3xl font-black text-slate-900 leading-tight" style={{ color: cat.color }}>
                      {cat.title}
                    </h2>
                    <p className="text-slate-500 text-[11px] md:text-sm font-bold uppercase tracking-widest mt-1 opacity-70">
                      Module Details & Integration Logic
                    </p>
                  </div>
                </div>
                <div className="max-w-md">
                   <p className="text-slate-600 text-xs md:text-sm font-medium leading-relaxed italic">
                     "{cat.description}"
                   </p>
                </div>
              </div>

              {/* Denser Grid of Detailed Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {cat.features.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="group p-5 rounded-2xl bg-white border border-slate-100 hover:border-[var(--accent-color)]/30 hover:shadow-lg transition-all duration-300 flex flex-col"
                    style={{ '--accent-color': cat.color } as any}
                  >
                    <div className="flex items-center justify-between mb-3">
                       <div 
                        className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] shadow-sm"
                        style={{ backgroundColor: cat.color }}
                       >
                         {idx + 1}
                       </div>
                       <div className="h-0.5 w-8 bg-slate-50 group-hover:w-12 transition-all duration-300" style={{ backgroundColor: `${cat.color}20` }} />
                    </div>
                    <h4 className="font-black text-slate-900 text-[15px] mb-2 leading-tight group-hover:text-[var(--accent-color)] transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action - Compact */}
      <section className="py-16 px-6">
         <div className="max-w-4xl mx-auto rounded-[3rem] p-8 md:p-12 bg-[#0f0529] text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7338a0] blur-[100px] opacity-20 -mr-32 -mt-32" />
            <div className="relative z-10">
               <h2 className="text-2xl md:text-4xl font-black mb-4">Experience the Full Suite</h2>
               <p className="text-white/50 text-xs md:text-sm mb-10 max-w-lg mx-auto leading-relaxed">
                  Every capability described above is built directly into TallyPrime. Let our experts guide you through the implementation best suited for your business.
               </p>
               <div className="flex flex-wrap justify-center gap-4">
                  <Link 
                    href="/demo"
                    className="px-8 py-3 bg-[#7338a0] text-white rounded-2xl font-bold text-xs hover:bg-[#4a2574] transition-all shadow-xl shadow-indigo-500/20"
                  >
                    Request Live Demo
                  </Link>
                  <Link 
                    href="/contact"
                    className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-xs hover:bg-white/10 transition-all"
                  >
                    Consult an Expert
                  </Link>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
}
