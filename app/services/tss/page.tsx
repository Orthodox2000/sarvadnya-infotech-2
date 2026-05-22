'use client';

import { useState } from 'react';
import Image from 'next/image';
import Footer from '../../components/Footer';
import UnifiedContactModal, { FormType } from '../../components/UnifiedContactModal';

export default function TSSPage() {
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean; type: FormType; service: string}>({
    isOpen: false,
    type: 'enquire',
    service: 'Tally Software Service (TSS) Renewal'
  });

  const openModal = (type: FormType, service: string = 'TSS Renewal') => {
    setModalConfig({ isOpen: true, type, service });
  };

  const tssFeatures = [
    {
      title: "Statutory Updates",
      desc: "Latest statutory changes including GST, TDS, and other tax laws to keep you compliant.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Remote Access",
      desc: "Securely access your Tally data from anywhere via a web browser or mobile device.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    },
    {
      title: "Data Synchronization",
      desc: "Synchronize data across multiple locations seamlessly with Tally.NET services.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      title: "Product Releases",
      desc: "Instant access to all latest product enhancements and major releases of TallyPrime.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      )
    }
  ];

  const deliverableList = [
    "Latest Statutory Updates (GST/TDS)",
    "Remote Access via Browser/Mobile",
    "Data Synchronization",
    "Bank Reconciliation (Auto)",
    "Latest Product Releases"
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
              src="/tss-icon.png" 
              alt="Cinematic TSS Renewal" 
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
              Stay Updated
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
              Tally Software Service <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7338a0] to-indigo-400">(TSS) Renewal</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl leading-relaxed mb-8">
              Keep your Tally always up-to-date with the latest statutory changes, product enhancements, and remote access features.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => openModal('enquire')}
                className="px-8 py-3 bg-[#7338a0] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-900/20"
              >
                Renew Now
              </button>
              <button 
                onClick={() => openModal('callback')}
                className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tssFeatures.map((f, i) => (
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
            <div className="aspect-[4/3] rounded-[32px] overflow-hidden relative shadow-2xl bg-slate-100/50">
              <Image 
                src="/tssgold.png" 
                alt="TSS Renewal" 
                fill 
                className="object-contain p-4"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[200px] hidden md:block">
              <div className="text-3xl font-black text-[#7338a0] mb-1">100%</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Compliance with Latest Statutory Laws</div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-[#0f0529] mb-6 leading-tight">
              Why Renew <br />TSS?
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Statutory Compliance",
                  a: "Stay worry-free about changing tax laws. TSS ensures your Tally is always compliant with GST, TDS, and other regulations."
                },
                {
                  q: "Business Productivity",
                  a: "Access features like automated bank reconciliation and remote data access to speed up your business operations."
                },
                {
                  q: "Enhanced Security",
                  a: "Regular product updates provide the latest security patches and data encryption to keep your financial records safe."
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

      {/* Core Deliverables Section */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-[#0f0529] mb-4">Core Deliverables</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">What you get when you renew your Tally Software Service subscription.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliverableList.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-bold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-indigo-600 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7338a0] to-indigo-800" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Ready to Stay Ahead?</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
              Renew your TSS today and unlock the full potential of TallyPrime with the latest features and compliance updates.
            </p>
            <button 
              onClick={() => openModal('enquire')}
              className="px-12 py-5 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl"
            >
              Renew Subscription
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
