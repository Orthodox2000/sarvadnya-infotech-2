'use client';

import { useState } from 'react';
import Footer from '../components/Footer';
import UnifiedContactModal, { FormType } from '../components/UnifiedContactModal';

export default function ServicesPage() {
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean; type: FormType; service: string}>({
    isOpen: false,
    type: 'general',
    service: ''
  });

  const openModal = (type: FormType, service: string = '') => {
    setModalConfig({ isOpen: true, type, service });
  };

  const services = [
    {
      title: "TSS Renewal",
      desc: "Renew your Tally Software Service (TSS) to get the latest product updates, statutory changes (GST/VAT), and remote access capabilities.",
      features: ["Latest product releases", "Statutory updates", "Remote data access", "Data synchronization"],
      icon: (
        <svg className="w-8 h-8 text-[#7338a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      title: "Support (AMC)",
      desc: "Get peace of mind with our Annual Maintenance Contract. Our certified experts provide priority troubleshooting and regular system health checks.",
      features: ["Priority technical support", "On-site & remote visits", "Data backup assistance", "Quarterly health checks"],
      icon: (
        <svg className="w-8 h-8 text-[#7338a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: "TDL Customization",
      desc: "Tailor TallyPrime to your specific business needs. We develop specialized solutions using TDL to automate unique workflows and reporting.",
      features: ["Custom invoice formats", "Specific report development", "Workflow automation", "Third-party integration"],
      icon: (
        <svg className="w-8 h-8 text-[#7338a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="bg-[#0f0529] py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] opacity-10 -ml-48 -mt-48" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Expert Services for <br /><span className="text-indigo-400">Your Business Growth</span></h1>
          <p className="text-slate-400 text-lg">
            From technical support to specialized TDL customizations, we ensure your Tally ecosystem 
            runs flawlessly so you can focus on what matters most.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s) => (
            <div key={s.title} className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col hover:shadow-2xl transition-all duration-500 group">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <h3 className="text-2xl font-black text-[#0f0529] mb-4">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">{s.desc}</p>
              
              <ul className="space-y-3 mb-10 flex-1">
                {s.features.map((f, i) => (
                  <li key={i} className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#7338a0]" />
                    {f}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => openModal('enquire', s.title)}
                className="w-full py-4 bg-[#7338a0] text-white rounded-2xl font-bold hover:bg-[#0f0529] transition-all shadow-lg shadow-indigo-100"
              >
                Enquire Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-20 px-6 bg-[#0f0529] text-white overflow-hidden relative">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#7338a0] rounded-full blur-[80px] opacity-20 -mr-32 -mb-32" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6">Certified Tally Expertise</h2>
          <p className="text-indigo-200/70 mb-10 leading-relaxed">
            As a certified partner, we bring years of experience in helping businesses 
            digitize their accounting and compliance workflows with TallyPrime.
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            <span className="text-xs font-black uppercase tracking-widest">Official Partner</span>
            <span className="text-xs font-black uppercase tracking-widest">Certified Support</span>
            <span className="text-xs font-black uppercase tracking-widest">TDL Specialists</span>
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
