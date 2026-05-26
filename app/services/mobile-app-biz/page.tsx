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
              src="/ba.png" 
              alt="Cinematic Tally on Mobile" 
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
            <div className="flex items-center gap-4 mb-6">
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/40 border border-[#0371a3]/10 text-[#0371a3] text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                <span className="flex h-0.5 w-0.5 rounded-full bg-[#0371a3]"></span>
                Mobile Intelligence
              </div>
              <div className="h-8 w-px bg-[#0371a3]/20" />
              <div className="relative h-8 w-24">
                 <Image 
                    src="/PartnerBrands/BizAnalyst.png" 
                    alt="Biz Analyst Logo" 
                    fill
                    className="object-contain"
                 />
              </div>
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
              Tally on <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] via-[#00ABE4] to-[#0371a3]">Mobile Dashboard</span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed mb-8 font-semibold">
              Bring your office in your pocket. Access critical business data, track sales performance, and send outstanding reminders instantly from anywhere.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => openModal('demo')}
                className="px-8 py-4 bg-[#0371a3] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00ABE4] transition-all shadow-xl shadow-[#0371a3]/20"
              >
                Request Free Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Powerful Features</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Modern analytical tools designed for business owners who are always on the move.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mobileFeatures.map((feature, i) => (
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

      {/* Analytics Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[3/4] max-w-md mx-auto">
            <Image 
              src="/biz-analyst-tally-mobile-app.jpg" 
              alt="Mobile App Analytics" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Data-Driven <br /><span className="text-[#0371a3]">Decision Making</span></h2>
            <div className="space-y-6">
              {[
                { title: "Sales Analysis", desc: "Track top customers, items, and sales trends over any period." },
                { title: "Inventory Control", desc: "Check stock levels and godown-wise inventory on the fly." },
                { title: "Outstanding Reports", desc: "View party-wise outstandings and ageing analysis instantly." },
                { title: "Secure & Offline", desc: "Your data is encrypted and accessible even without internet." }
              ].map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{benefit.title}</h4>
                    <p className="text-slate-500 text-sm font-medium">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-6">
               <button 
                  onClick={() => openModal('quote')}
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0371a3] transition-all shadow-lg"
               >
                  Get Pricing Plans
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0371a3]/20 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Experience the Freedom</h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto font-medium">Join thousands of business owners who manage their Tally from their smartphones.</p>
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
