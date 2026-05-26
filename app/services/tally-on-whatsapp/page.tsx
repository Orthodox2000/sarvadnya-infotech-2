'use client';

import { useState } from 'react';
import Image from 'next/image';
import Footer from '../../components/Footer';
import UnifiedContactModal, { FormType } from '../../components/UnifiedContactModal';

export default function TallyOnWhatsappPage() {
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: FormType; service: string }>({
    isOpen: false,
    type: 'enquire',
    service: 'Tally on WhatsApp Integration'
  });

  const openModal = (type: FormType, service: string = 'Tally on WhatsApp') => {
    setModalConfig({ isOpen: true, type, service });
  };

  const whatsappFeatures = [
    {
      title: "Automated PDF Sharing",
      desc: "Instantly share invoices, ledgers, and reports as professional PDFs directly on customer WhatsApp.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      )
    },
    {
      title: "Payment Reminders",
      desc: "Schedule and send automated payment reminders to improve cash flow and reduce outstandings.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Interactive Ledger Bot",
      desc: "Allow customers to query their own outstanding balances and ledger statements via WhatsApp 24/7.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    },
    {
      title: "Bulk Marketing",
      desc: "Send promotional offers and greetings to your entire customer base with personalized messaging.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.167a2.405 2.405 0 00-1.492-1.492l-6.167-2.147a1.76 1.76 0 01.592-3.417h13.358z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Compact Cinematic Hero Section (Themed Hero) */}
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
              src="/tally2whatsapp.png" 
              alt="Cinematic Tally on WhatsApp" 
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
              Instant Communication
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
              Tally on <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] via-[#00ABE4] to-[#0371a3]">WhatsApp Integration</span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed mb-8 font-semibold">
              Connect with your customers where they are. Automate your document sharing and communication directly from TallyPrime to WhatsApp for faster responses and better service.
            </p>
            <div className="flex flex-wrap gap-4">
               <button 
                  onClick={() => openModal('enquire')}
                  className="px-8 py-4 bg-[#0371a3] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00ABE4] transition-all shadow-xl shadow-[#0371a3]/20"
               >
                  Get Integration Now
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Communication at Scale</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Leverage the power of the world's most popular messaging app directly within your accounting software.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whatsappFeatures.map((feature, i) => (
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

      {/* Showcase Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video bg-white p-8">
             <div className="relative h-full w-full">
                <Image 
                  src="/whatsappintegration.png" 
                  alt="WhatsApp Integration View" 
                  fill 
                  className="object-contain"
                />
             </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Zero Manual Effort. <br /><span className="text-[#0371a3]">Full Automation.</span></h2>
            <div className="space-y-6">
              {[
                { title: "Direct from Vouchers", desc: "Send invoices immediately after saving the voucher in Tally." },
                { title: "Personalized Messaging", desc: "Automatic customer name and amount insertion in messages." },
                { title: "Secure API Access", desc: "Official WhatsApp Cloud API for verified and safe communication." },
                { title: "Multi-User Support", desc: "Allow multiple Tally users to send messages from a single number." }
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
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#25d366]/20 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Boost Your Collection Rate</h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto font-medium">Businesses using Tally-WhatsApp integration report 30% faster payment collections.</p>
            <button 
              onClick={() => openModal('callback')}
              className="px-10 py-4 bg-[#25d366] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#25d366]/20"
            >
              Start Automated Reminders
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
