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
    <div className="min-h-screen bg-slate-50">
      {/* Compact Cinematic Hero Section */}
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
              src="/whatsappintegration.png" 
              alt="Cinematic Tally on WhatsApp" 
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
              Instant Communication
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
              Tally on <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7338a0] to-indigo-400">WhatsApp Integration</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl leading-relaxed mb-8">
              Connect with your customers where they are. Automate your document sharing and communication directly from TallyPrime to WhatsApp for faster responses and better service.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => openModal('enquire')}
                className="px-8 py-3 bg-[#7338a0] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-900/20"
              >
                Get Started Now
              </button>
              <button 
                onClick={() => openModal('callback')}
                className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center"
              >
                View Live Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whatsappFeatures.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#7338a0] flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-base font-black text-[#0f0529] mb-2">{f.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[16/7] rounded-[32px] overflow-hidden relative shadow-2xl bg-slate-100/50">
              <Image 
                src="/tally2whatsapp.png" 
                alt="Tally on WhatsApp" 
                fill 
                className="object-contain p-4"
              />
            </div>            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[200px] hidden md:block">
              <div className="text-3xl font-black text-[#7338a0] mb-1">3x</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Faster Payment Collections via WhatsApp Reminders</div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-4xl font-black text-[#0f0529] mb-6 leading-tight">
              Why WhatsApp <br />Integration?
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Increased Accessibility",
                  a: "WhatsApp is used by everyone. Reach your customers on the platform they use most frequently."
                },
                {
                  q: "Reduced Paper Costs",
                  a: "Go green and save costs by sharing digital copies instead of printing and couriering physical documents."
                },
                {
                  q: "Improved Customer Trust",
                  a: "Verified business communication build trust and provides customers with a history of their transactions."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    0{i + 1}
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
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Revolutionize Your Communication</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
              Ready to integrate WhatsApp with your TallyPrime? Join 500+ businesses using our automation tool.
            </p>
            <button
              onClick={() => openModal('enquire')}
              className="px-12 py-5 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl"
            >
              Enable WhatsApp Now
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
