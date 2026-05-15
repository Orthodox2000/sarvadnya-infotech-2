'use client';

import { useState } from 'react';
import Image from 'next/image';
import Footer from '../../components/Footer';
import UnifiedContactModal, { FormType } from '../../components/UnifiedContactModal';

export default function MobileAppBizPage() {
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean; type: FormType; service: string}>({
    isOpen: false,
    type: 'enquire',
    service: 'Mobile App for Tally (Biz Analyst)'
  });

  const openModal = (type: FormType, service: string = 'Mobile App for Tally') => {
    setModalConfig({ isOpen: true, type, service });
  };

  const mobileFeatures = [
    {
      title: "Real-time Data Sync",
      desc: "Access your latest Tally data on your mobile device instantly, anytime and anywhere.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Business Analytics",
      desc: "Get deep insights into your sales, purchases, and outstandings with interactive dashboards.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Sales Team Tracking",
      desc: "Monitor your sales team's performance, check-ins, and orders in real-time.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: "Outstanding Reminders",
      desc: "Send automated payment reminders to customers directly from your mobile via WhatsApp.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              src="/assets/images/1486406146926-c627a92ad1ab.jpg" 
              alt="Cinematic Tally on Mobile" 
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
            <div className="flex items-center gap-4 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7338a0]"></span>
                Mobile Intelligence
              </div>
              <div className="h-8 w-px bg-white/10" />
              <Image 
                src="/PartnerBrands/BizAnalyst.png" 
                alt="Biz Analyst Logo" 
                width={120} 
                height={30} 
                className="opacity-80 brightness-0 invert"
              />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
              Tally on Mobile <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7338a0] to-indigo-400">(Biz Analyst)</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl leading-relaxed mb-8">
              Take your business with you wherever you go. Get real-time access to your Tally data, track your sales team, and make data-driven decisions from the palm of your hand.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => openModal('enquire')}
                className="px-8 py-3 bg-[#7338a0] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-900/20"
              >
                Get Free Demo
              </button>
              <button 
                onClick={() => openModal('callback')}
                className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mobileFeatures.map((f, i) => (
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
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <div className="aspect-[16/10] rounded-[32px] overflow-hidden relative shadow-2xl bg-slate-100/50">
              <Image 
                src="/biz-analyst-tally-mobile-app.jpg" 
                alt="Mobile App for Tally" 
                fill 
                className="object-contain p-4"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 max-w-[180px] hidden md:block">
              <div className="text-2xl font-black text-[#7338a0] mb-0.5">10k+</div>
              <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Business Owners Using Biz Analyst Every Day</div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#0f0529] mb-6 leading-tight">
              Why Choose <br />Biz Analyst?
            </h2>
            <div className="space-y-5">
              {[
                {
                  q: "Data-Driven Decisions",
                  a: "Understand your business trends and identify growth opportunities with visual reports."
                },
                {
                  q: "Enhanced Sales Efficiency",
                  a: "Empower your sales team with customer history and stock availability on the go."
                },
                {
                  q: "Secure Data Access",
                  a: "Your data is encrypted and remains under your control at all times."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    0{i+1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f0529] mb-1">{item.q}</h4>
                    <p className="text-slate-600 leading-relaxed text-[11px] md:text-xs">{item.a}</p>
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
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Business in Your Pocket</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
              Ready to experience Tally on your mobile? Get started with our 7-day free trial today.
            </p>
            <button 
              onClick={() => openModal('enquire')}
              className="px-12 py-5 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl"
            >
              Request Free Setup
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
