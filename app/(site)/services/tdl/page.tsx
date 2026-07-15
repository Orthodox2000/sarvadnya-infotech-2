'use client';

import { useState } from 'react';
import Image from 'next/image';
import Footer from '../../../components/Footer';
import UnifiedContactModal, { FormType } from '../../../components/UnifiedContactModal';

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
      title: "Custom Invoice Formats",
      desc: "Add your logo, payment QR codes, bank details, and specific terms & conditions to make your bills look 100% professional.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Auto-Calculated Reports",
      desc: "Stop exporting to Excel. Get custom sales commission, pending order, or profit reports generated instantly inside Tally.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Connect Tally to Anything",
      desc: "Link Tally with your CRM, e-commerce store (Amazon/Shopify), or custom billing software so data flows automatically.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      )
    },
    {
      title: "Security & Error Controls",
      desc: "Add strict approval workflows, block users from changing backdated entries, and stop billing errors before they happen.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(90deg,rgba(249,251,245,1)_0%,rgba(244,242,234,1)_53%,rgba(238,236,223,1)_100%)] text-slate-900">
      {/* Cinematic Hero Section (Themed Hero) */}
      <section className="bg-[linear-gradient(90deg,rgba(249,251,245,1)_0%,rgba(244,242,234,1)_53%,rgba(238,236,223,1)_100%)] relative overflow-hidden flex items-center min-h-[200px] md:min-h-[350px] border-b border-[#4A6E62]/10">
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
            {/* Cinematic Overlay - Fades image into the light background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F6F5EE] via-[#F4F2EA]/80 to-transparent" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full px-6 relative z-10 py-12 md:py-16">
          <div className="max-w-2xl lg:pr-8">
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/40 border border-[#4A6E62]/10 text-[#4A6E62] text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <span className="flex h-0.5 w-0.5 rounded-full bg-[#4A6E62]"></span>
               Tailored Excellence
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
              Make Tally Work{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A6E62] via-[#5D887A] to-[#4A6E62]">Exactly The Way You Want</span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed mb-8 font-semibold">
              Don&apos;t change your business to fit Tally. Let us change Tally to fit your business. We build custom invoice formats, automated reports, and security controls to save you hours of manual work.
            </p>
            <div className="flex flex-wrap gap-4">
               <button 
                  onClick={() => openModal('enquire')}
                  className="px-8 py-4 bg-[#4A6E62] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#5D887A] transition-all shadow-xl shadow-[#4A6E62]/20"
               >
                  Discuss Your Requirement
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">What Can We Build For You?</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">We eliminate repetitive data entry and build the features Tally forgot to include.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tdlFeatures.map((feature, i) => (
            <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#E8F0EB] text-[#4A6E62] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 px-6 ">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video bg-white">
             <Image 
                src="/sa3.png" 
                alt="TDL Customization Workflow" 
                fill 
                className="object-fill"
             />
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">How We Build{' '}<br /><span className="text-[#4A6E62]">Your Custom Solution</span></h2>
            <div className="space-y-4">
              {[
                { step: "01", title: "We Understand Your Problem", desc: "You tell us exactly where your team is wasting time or what report you are missing." },
                { step: "02", title: "We Show You a Mockup", desc: "We design the new invoice or report layout and get your exact approval before we start working." },
                { step: "03", title: "We Build & Test", desc: "Our experts write the code safely, ensuring your existing accounting data is never disturbed." },
                { step: "04", title: "Live Setup & Training", desc: "We install the customization directly on your system and train your team on how to use it." }
              ].map((item, i) => (
                <div key={i} className="flex gap-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-2xl font-black text-[#4A6E62]/20">{item.step}</span>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#4A6E62] py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Stop Managing Data in Excel.</h2>
          <p className="text-emerald-100 text-sm mb-8 max-w-md mx-auto">
            Tell us what you want Tally to do. If it saves you time and prevents errors, we can build it.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => openModal('callback')}
              className="px-7 py-3.5 bg-white text-[#4A6E62] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all"
            >
              Get Customization Pricing
            </button>
            <button
              onClick={() => openModal('enquire')}
              className="px-7 py-3.5 bg-white/10 border border-white/20 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              Contact Us
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
