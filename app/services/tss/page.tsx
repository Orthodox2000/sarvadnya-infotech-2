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
    <div className="min-h-screen bg-white text-slate-900">
      {/* Cinematic Hero Section (Themed Hero) */}
      <section className="bg-[#dff0f5] relative overflow-hidden flex items-center min-h-[200px] md:min-h-[350px] border-b border-[#0371a3]/10">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'url(/bgggg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        {/* Cinematic Image Side - Hidden on mobile, full height on desktop */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 z-0">
          <div className="relative h-full w-full">
            <Image 
              src="/tssgold.png" 
              alt="Cinematic TSS Renewal" 
              fill 
              className="object-cover"
              priority
            />
            {/* Cinematic Overlay - Fades image into the light background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#dff0f5] via-[#dff0f5]/60 to-transparent" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full px-6 relative z-10 py-12 md:py-16">
          <div className="max-w-2xl lg:pr-12">
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/40 border border-[#0371a3]/10 text-[#0371a3] text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <span className="flex h-0.5 w-0.5 rounded-full bg-[#0371a3]"></span>
              Software Continuity
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
              Tally Software <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] via-[#00ABE4] to-[#0371a3]">Service (TSS)</span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed mb-8 font-semibold">
              Don't miss out on the latest features and statutory compliance. Renew your TSS to unlock a world of remote access and seamless updates.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => openModal('quote')}
                className="px-8 py-4 bg-[#0371a3] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00ABE4] transition-all shadow-xl shadow-[#0371a3]/20"
              >
                Renew TSS Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Why Renew TSS?</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Access a suite of advanced features designed to enhance your TallyPrime experience and business productivity.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tssFeatures.map((feature, i) => (
            <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#dff0f5] text-[#0371a3] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video bg-white">
             <Image 
                src="/tss-icon.png" 
                alt="TSS Benefits Overview" 
                fill 
                className="object-contain p-12"
             />
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Comprehensive Product <br /><span className="text-[#0371a3]">Capabilities</span></h2>
            <div className="space-y-4">
              {deliverableList.map((benefit, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="font-bold text-slate-700 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-[#0371a3] pl-4">
              "TSS is not an expense; it's an investment in keeping your business compliant and technologically current."
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0371a3]/20 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Stay Current. Stay Compliant.</h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto font-medium">Renewal takes less than 5 minutes. Protect your statutory compliance and product features today.</p>
            <button 
              onClick={() => openModal('callback')}
              className="px-10 py-4 bg-[#00ABE4] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#00ABE4]/20"
            >
              Consult an Expert
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
