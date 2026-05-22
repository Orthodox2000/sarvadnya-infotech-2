'use client';

import { useState } from 'react';
import Image from 'next/image';
import Footer from '../../components/Footer';
import UnifiedContactModal, { FormType } from '../../components/UnifiedContactModal';

export default function AMCPage() {
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean; type: FormType; service: string}>({
    isOpen: false,
    type: 'enquire',
    service: 'Tally Annual Maintenance Contract (AMC)'
  });

  const openModal = (type: FormType, service: string = 'Tally AMC') => {
    setModalConfig({ isOpen: true, type, service });
  };

  const amcFeatures = [
    {
      title: "Priority Troubleshooting",
      desc: "Get 15-minute response SLA for critical business-halting issues.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "On-Site & Remote Support",
      desc: "Flexible support options including unlimited remote sessions and scheduled on-site visits.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Data Backup & Recovery",
      desc: "Expert assistance in setting up robust data backup routines and emergency data recovery.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      )
    },
    {
      title: "Regular Health Checks",
      desc: "Quarterly audits of your Tally data and system configuration to ensure peak performance.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              src="/amc2.png" 
              alt="Cinematic Tally Support" 
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
              Support Excellence
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
              Tally Annual Maintenance <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7338a0] to-indigo-400">Contract (AMC)</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl leading-relaxed mb-8">
              Minimize downtime and maximize productivity with our priority troubleshooting and regular health checks. Your safety net for continuous business operations.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => openModal('enquire')}
                className="px-8 py-3 bg-[#7338a0] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-900/20"
              >
                Get a Quote
              </button>
              <button 
                onClick={() => openModal('callback')}
                className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center"
              >
                Request Call Back
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {amcFeatures.map((f, i) => (
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
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[4/3] rounded-[32px] overflow-hidden relative shadow-2xl">
              <Image 
                src="/amc.png" 
                alt="Tally Support" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[200px] hidden md:block">
              <div className="text-3xl font-black text-[#7338a0] mb-1">15 min</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Average Response Time for Critical Issues</div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-[#0f0529] mb-6 leading-tight">
              Why Choose Our <br />AMC Services?
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Unlimited Remote Support",
                  a: "Access our expert team as many times as you need for any query or issue, ensuring your staff is never stuck."
                },
                {
                  q: "Data Integrity & Security",
                  a: "Regular checks to ensure your data is healthy and your backup systems are working perfectly."
                },
                {
                  q: "Statutory Compliance",
                  a: "Timely assistance with GST, TDS, and other statutory updates within TallyPrime."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    0{i+1}
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
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Ready for Peace of Mind?</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
              Join 2000+ businesses who trust our AMC services for their daily accounting operations.
            </p>
            <button 
              onClick={() => openModal('enquire')}
              className="px-12 py-5 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl"
            >
              Request AMC Proposal
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
