'use client';

import { useState } from 'react';
import Image from 'next/image';
import Footer from '../../../components/Footer';
import UnifiedContactModal, { FormType } from '../../../components/UnifiedContactModal';

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
      title: "Send Invoices in 1 Click",
      desc: "Say goodbye to WhatsApp Web. Share professional PDF invoices, receipts, and delivery notes instantly without ever leaving your Tally screen.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      )
    },
    {
      title: "Polite Payment Reminders",
      desc: "Recover stuck payments effortlessly. Send automated, professional reminders with exact outstanding amounts to ensure you get paid on time.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "24/7 Customer Ledger Access",
      desc: "Stop answering \"what is my balance?\" calls. Let your customers securely check their own ledgers anytime by simply messaging your business number.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    },
    {
      title: "Bulk Festival & Offer Messaging",
      desc: "Send personalized Diwali greetings or bulk discount offers to your entire Tally contact list in one click—without getting your number blocked.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.167a2.405 2.405 0 00-1.492-1.492l-6.167-2.147a1.76 1.76 0 01.592-3.417h13.358z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(90deg,rgba(249,251,245,1)_0%,rgba(244,242,234,1)_53%,rgba(238,236,223,1)_100%)] text-slate-900">
      {/* Compact Cinematic Hero Section (Themed Hero) */}
      <section className="bg-[linear-gradient(90deg,rgba(249,251,245,1)_0%,rgba(244,242,234,1)_53%,rgba(238,236,223,1)_100%)] relative overflow-hidden flex items-center min-h-[200px] md:min-h-[350px] border-b border-[#4A6E62]/10">
        {/* Cinematic Image Side - Hidden on mobile, full height on desktop */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-5/9 z-0">
          <div className="relative h-full w-full">
            <Image 
              src="/tally2whatsapp.png" 
              alt="Cinematic Tally on WhatsApp" 
              fill 
              className="object-cover"
              priority
            />
            {/* Cinematic Overlay - Fades image into the light background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F6F6EE] via-[#F4F2EA]/80 to-transparent" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 relative z-10 py-12 ">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/40 border border-[#4A6E62]/10 text-[#4A6E62] text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <span className="flex h-1 w-1 rounded-full bg-[#4A6E62]"></span>
               Instant Communication
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
             WhatsApp Invoicing{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#316852] via-[#5D887A] to-[#4A6E62]">Directly From Tally</span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed mb-8 font-semibold">
              Stop downloading PDFs, saving phone numbers, and juggling WhatsApp Web. Send invoices, ledgers, and payment reminders to your client&apos;s WhatsApp the exact second you hit &apos;Save&apos; in Tally.
            </p>
            <div className="flex flex-wrap gap-4">
               <button 
                  onClick={() => openModal('enquire')}
                  className="px-8 py-4 bg-[#316852] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#5D887A] transition-all shadow-xl shadow-[#4A6E62]/20"
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
          <h2 className="text-3xl md:text-5xl font-black text-slate-black mb-4">Why MSMEs Upgrade to WhatsApp Billing</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Save hours of manual data entry, cut printing costs, and give your customers a modern buying experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whatsappFeatures.map((feature, i) => (
            <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#30962E]/10 text-[#4A6E62] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-12 px-6 ">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video bg-white">
             <div className="relative h-full w-full">
                <Image 
                  src="/tallytowa.png" 
                  alt="WhatsApp Integration View" 
                  fill 
                  className="object-fill"
                />
             </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Professional, Fast, and{' '}<span className="text-[#4A6E62]">100% Automated.</span></h2>
            <div className="space-y-6">
              {[
                { title: "Send Instantly on Save", desc: "The moment you press 'Save' on a sales voucher, the invoice is already on your customer's phone." },
                { title: "Smart Personalization", desc: "Messages automatically include the customer's name, invoice number, and exact due amount. No copy-pasting required." },
                { title: "Official & Ban-Proof", desc: "Powered by the official WhatsApp API. Your account stays secure, professional, and safe from unexpected bans." },
                { title: "Single Central Number", desc: "Let your entire billing team send documents from one official business number instead of their personal phones." }
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
      <section className="bg-[#4A6E62] py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Stop Printing. Start Collecting Faster.</h2>
          <p className="text-emerald-100 text-sm mb-8 max-w-md mx-auto">
            Join smart businesses that have eliminated paper printing and accelerated their cash flow with our automated WhatsApp integration.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => openModal('callback')}
              className="px-7 py-3.5 bg-white text-[#4A6E62] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all"
            >
              Get Now
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
