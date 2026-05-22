'use client';

import { useState } from 'react';
import Image from 'next/image';
import Footer from '../../components/Footer';
import UnifiedContactModal, { FormType } from '../../components/UnifiedContactModal';

export default function TDLPage() {
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean; type: FormType; service: string}>({
    isOpen: false,
    type: 'enquire',
    service: 'TDL Customization'
  });

  const openModal = (type: FormType, service: string = 'TDL Customization') => {
    setModalConfig({ isOpen: true, type, service });
  };

  const tdlFeatures = [
    {
      title: "Custom Invoice Design",
      desc: "Get professionally designed invoice formats that match your brand identity and requirements.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Advanced Reporting",
      desc: "Development of specialized reports that Tally doesn't provide out-of-the-box.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Module Integration",
      desc: "Seamlessly integrate third-party applications or custom modules with your Tally data.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      )
    },
    {
      title: "Workflow Automation",
      desc: "Automate repetitive data entry tasks and business processes using custom TDL logic.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Cinematic Hero Section */}
      <section className="bg-[#0f0529] relative overflow-hidden flex items-center min-h-[200px] md:min-h-[300px]">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#7338a0] blur-[120px] rounded-full -ml-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600 blur-[120px] rounded-full -ml-64 -mb-64" />
        </div>

        {/* Cinematic Image Side - Hidden on mobile, full height on desktop */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 z-0">
          <div className="relative h-full w-full">
            <Image 
              src="/TDLandCustom.jpg" 
              alt="Cinematic Tally Development" 
              fill 
              className="object-cover"
              priority
            />
            {/* Cinematic Overlay - Fades image into the dark background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0529] via-[#0f0529]/40 to-transparent" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full px-6 relative z-10 py-8 md:py-12">
          <div className="max-w-2xl lg:pr-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-widest mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7338a0]"></span>
              Tailored Excellence
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
              TDL & Custom <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7338a0] to-indigo-400">Development</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl leading-relaxed mb-8">
              Make Tally work exactly the way your business does. Our expert TDL developers create custom solutions to bridge the gap between standard features and your unique needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => openModal('enquire')}
                className="px-8 py-3 bg-[#7338a0] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-900/20"
              >
                Request Customization
              </button>
              <a 
                href="tel:+919923942204"
                className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center"
              >
                Consult an Expert
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tdlFeatures.map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#7338a0] flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-lg font-black text-[#0f0529] mb-3">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[4/3] rounded-[32px] overflow-hidden relative shadow-2xl">
              <Image 
                src="/tallycustomization.png" 
                alt="TDL Development" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[200px] hidden md:block">
              <div className="text-3xl font-black text-[#7338a0] mb-1">500+</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Custom TDL Projects Successfully Delivered</div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-[#0f0529] mb-6 leading-tight">
              Why Choose Our <br />TDL Services?
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Domain Expertise",
                  a: "We don't just write code; we understand accounting and business logic to build functional solutions."
                },
                {
                  q: "Scalable Development",
                  a: "Our TDL modules are built to handle large data volumes without compromising Tally's performance."
                },
                {
                  q: "Seamless Upgrades",
                  a: "We ensure your customizations remain compatible with future TallyPrime releases and updates."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    0{i+1}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#0f0529] mb-1">{item.q}</h4>
                    <p className="text-slate-600 leading-relaxed text-xs md:text-sm">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-indigo-600 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7338a0] to-indigo-800" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Build Your Dream Tally</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
              If you can imagine it, we can build it in Tally. Let's discuss your unique requirements today.
            </p>
            <button 
              onClick={() => openModal('enquire')}
              className="px-12 py-5 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl"
            >
              Request a Demo
            </button>
          </div>
        </div>
      </section>

      <UnifiedContactModal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        type={modalConfig.type}
        prefillService={modalConfig.service}
      />
      <Footer />
    </div>
  );
}
