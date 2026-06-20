'use client';

import { useState } from 'react';
import Footer from '../components/Footer';
import UnifiedContactModal, { FormType } from '../components/UnifiedContactModal';
import Link from 'next/link';

export default function ProductsPage() {
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean; type: FormType; service: string; details: string}>({
    isOpen: false,
    type: 'general',
    service: '',
    details: ''
  });

  const openModal = (type: FormType, service: string = '', details: string = '') => {
    setModalConfig({ isOpen: true, type, service, details });
  };

  const products = [
    {
      name: "TallyPrime Silver",
      type: "Essential",
      price: "Single User",
      summary: "Perfect for sole proprietors and small businesses, TallyPrime Silver offers complete accounting, inventory, and compliance management on a single computer.",
      color: "#0371a3",
      link: "/products/silver"
    },
    {
      name: "TallyPrime Gold",
      type: "Professional",
      price: "Multi-User",
      summary: "The industry standard for growing businesses. Allows unlimited users on a local network (LAN) and concurrent access to data.",
      color: "#0371a3",
      popular: true,
      link: "/products/gold"
    },
    {
      name: "TallyPrime Server",
      type: "Enterprise",
      price: "Large Business",
      summary: "Enterprise-class product that provides high data concurrency and security for organizations with large user bases.",
      color: "#0371a3",
      link: "/products/server"
    }
  ];

  return (
    <div className="min-h-screen bg-[#ecf5fa]">
      {/* Hero Section (Radiant Sky Theme) */}
      <section className="bg-white relative pt-12 pb-16 md:pt-20 md:pb-24 px-6 overflow-hidden border-b border-[#0371a3]/10"> 
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-white/40 blur-[130px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-sky-200/30 blur-[110px] -ml-24 -mb-24" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-500/20 text-yellow-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
            Official TallyPrime Partner
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] via-[#4b91ca] to-[#0371a3] drop-shadow-[0_2px_15px_rgba(0,171,228,0.2)]">TallyPrime</span> <br />
            Editions & Licensing
          </h1>
          <p className="text-slate-600/80 text-sm md:text-xl max-w-xl mx-auto leading-relaxed font-semibold">
            Choose the right edition of TallyPrime designed to scale with your business complexity and user requirements.
          </p>
        </div>
      </section>

      {/* Comparison Grid */}
      <section id="compare" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p) => (
            <div 
              key={p.name} 
              className={`relative bg-white rounded-[32px] p-8 border border-slate-100 flex flex-col shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden`}
              style={p.popular ? { borderColor: p.color } : {}}
            >
              {p.popular && (
                <div className="absolute top-6 right-6 bg-[#0371a3] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">{p.type} Edition</span>
                <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-[#0371a3] transition-colors">{p.name}</h3>
                <div className="text-[#0371a3] font-bold text-sm">{p.price}</div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">{p.summary}</p>

              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => openModal('enquire', p.name)}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0371a3] transition-all shadow-md"
                >
                  Get License
                </button>
                <Link 
                  href={p.link}
                  className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100 block text-center"
                >
                  Know More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TallyDrive Detailed Features Section */}
      <section id="tallydrive" className="py-24 px-6 bg-white border-y border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-sky-50/50 -skew-x-12 transform translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0371a3]/10 text-[#0371a3] text-[10px] font-black uppercase tracking-widest mb-6">
                Integrated Cloud Backup
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                Secure Your Data with <br />
                <span className="text-[#0371a3]">TallyDrive v7.0</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-10 font-medium max-w-2xl">
                TallyDrive is the official encrypted cloud backup solution for TallyPrime. It ensures your business data is always safe, accessible, and recoverable, protecting you against hardware failure and ransomware.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Automated Scheduling", desc: "Set it once and forget it. Backups run automatically without manual intervention.", icon: (
                    <svg className="w-6 h-6 text-[#0371a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )},
                  { title: "Military-Grade Encryption", desc: "AES-256 bit encryption ensures your financial data remains private and secure.", icon: (
                    <svg className="w-6 h-6 text-[#0371a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )},
                  { title: "Instant Restoration", desc: "Download and restore your data in minutes in case of local system failure.", icon: (
                    <svg className="w-6 h-6 text-[#0371a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )},
                  { title: "Ransomware Protection", desc: "Secure cloud vault prevents unauthorized access and data corruption.", icon: (
                    <svg className="w-6 h-6 text-[#0371a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-[#ecf5fa] rounded-2xl border border-sky-100 hover:shadow-xl hover:shadow-sky-900/5 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm mb-4">
                      {item.icon}
                    </div>
                    <h4 className="font-black text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-bold">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full lg:max-w-md">
              <div className="bg-white rounded-[2.5rem] p-10 text-slate-900 relative overflow-hidden shadow-2xl border border-slate-100">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0371a3]/5 blur-[80px]" />
                
                <h3 className="text-2xl font-black mb-8 relative z-10 border-b border-slate-100 pb-4">TallyDrive Tiers</h3>
                <div className="space-y-6 relative z-10">
                  <div className="pb-6 border-b border-slate-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-lg text-slate-900">Basic Edition</span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">Free for Silver</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">Daily automated backups for single-user businesses. 1GB Secure Storage.</p>
                  </div>
                  <div className="pb-6 border-b border-slate-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-lg text-[#0371a3]">Professional</span>
                      <span className="px-2 py-1 bg-[#0371a3]/10 text-[#0371a3] rounded text-[9px] font-black uppercase tracking-widest">Free for Gold</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">Hourly incremental backups for multi-user networks. 5GB Secure Storage.</p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-lg text-slate-900">Enterprise</span>
                      <span className="px-2 py-1 bg-slate-900 text-white rounded text-[9px] font-black uppercase tracking-widest">Included in Server</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">Real-time sync and version control. Unlimited companies. 25GB+ Storage.</p>
                  </div>
                </div>

                <button 
                  onClick={() => openModal('callback', 'TallyDrive Upgrade')}
                  className="mt-10 w-full py-4 bg-[#0371a3] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg"
                >
                  Consult Backup Strategy
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UnifiedContactModal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        type={modalConfig.type}
        prefillService={modalConfig.service}
        prefillDetails={modalConfig.details}
      />
      <Footer />
    </div>
  );
}
