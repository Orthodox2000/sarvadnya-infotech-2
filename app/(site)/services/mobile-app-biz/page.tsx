'use client';

import { useState } from 'react';
import Image from 'next/image';
import Footer from '../../../components/Footer';
import UnifiedContactModal, { FormType } from '../../../components/UnifiedContactModal';

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
      title: "Zero Accountant Dependency",
      desc: "View live bank balances, daily sales, and profits instantly without having to call your accounts team.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Spot Dead Stock Instantly",
      desc: "Quickly identify which products are your fast-movers and which inventory is sitting idle and blocking your cash.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "GPS Sales Tracking",
      desc: "Monitor your field team's exact locations, client check-ins, and daily order bookings in real-time to ensure productivity.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: "1-Click WhatsApp Reminders",
      desc: "Recover pending payments faster. Send polite, automated ledger reports and payment links via WhatsApp directly to clients.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(90deg,rgba(249,251,245,1)_0%,rgba(244,242,234,1)_53%,rgba(238,236,223,1)_100%)]  text-slate-900">
      {/* Cinematic Hero Section (Themed Hero) */}
      <section className="bg-white relative overflow-hidden flex items-center min-h-[200px] md:min-h-[350px] border-b border-[#4A6E62]/10">
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff] via-[#F4F2EA]/80 to-transparent" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full px-6 relative z-10 py-12 ">
          <div className="max-w-2xl lg:pr-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/40 border border-[#4A6E62]/10 text-[#4A6E62] text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                <span className="flex h-0.5 w-0.5 rounded-full bg-[#4A6E62]"></span>
                Mobile Intelligence
              </div>
              
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
              Total Control Over Your Business{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A6E62] via-[#5D887A] to-[#4A6E62]">& Cash Flow</span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed mb-8 font-semibold">
              Stop calling your accountant for reports. Access live Tally data, track your field sales team, and send WhatsApp payment reminders directly from your smartphone—anytime, anywhere.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => openModal('demo')}
                className="px-4 py-4 bg-[#4A6E62] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#5D887A] transition-all shadow-xl shadow-[#4A6E62]/20"
              >
                Get Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-black mb-4">Why MSME Owners Love Biz Analyst</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Everything you need to manage cash flow, field teams, and inventory while on the go.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mobileFeatures.map((feature, i) => (
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

      {/* Analytics Section */}
      <section className="py-8 px-6 ">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video max-w-lg mx-auto w-full">
            <Image 
              src="/biz.jpg" 
              alt="Mobile App Analytics" 
              fill 
              className="object-fill"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Your Entire Business At <span className="text-[#4A6E62]">Your Fingertips</span></h2>
            <div className="space-y-6">
              {[
                { title: "Instant Sales Analysis", desc: "Track your top-performing customers, fast-moving items, and monthly sales trends at a glance." },
                { title: "Live Inventory Control", desc: "Never lose an order. Check live godown-wise stock levels instantly while negotiating with a client." },
                { title: "Stop Bad Debts", desc: "View party-wise aging reports to see exactly who owes you money and for how many days." },
                { title: "AES-256 Encryption", desc: "Your Tally data is 100% encrypted, safely synced, and accessible even if you lose internet access." }
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
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#4A6E62] transition-all shadow-lg"
               >
              Contact Us
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#4A6E62] py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Stop Waiting for Reports. Take Control Today.</h2>
          <p className="text-emerald-100 text-sm mb-8 max-w-md mx-auto">
            Join thousands of smart business owners who use the Biz Analyst app to run their operations independently.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => openModal('callback')}
              className="px-7 py-3.5 bg-white text-[#4A6E62] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all"
            >
              Start Your Trial
            </button>
            <button
              onClick={() => openModal('enquire')}
              className="px-7 py-3.5 bg-white/10 border border-white/20 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              Get Pricing Plans
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
