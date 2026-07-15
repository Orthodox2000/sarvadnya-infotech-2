'use client';

import { useState } from 'react';
import Image from 'next/image';
import Footer from '../../../components/Footer';
import UnifiedContactModal, { FormType } from '../../../components/UnifiedContactModal';

export default function CorporateTrainingPage() {
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean; type: FormType; service: string}>({
    isOpen: false,
    type: 'enquire',
    service: 'Corporate Training'
  });

  const openModal = (type: FormType, service: string = 'Corporate Training') => {
    setModalConfig({ isOpen: true, type, service });
  };

  const trainingFeatures = [
    {
      title: "Customized Curriculum",
      desc: "Training modules tailored specifically to your industry and business processes.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: "Certified Experts",
      desc: "Learn from Tally-certified professionals with years of implementation experience.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Hands-on Workshops",
      desc: "Practical sessions using real-world scenarios to ensure immediate skill application.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      )
    },
    {
      title: "Flexible Scheduling",
      desc: "On-site or virtual training sessions scheduled at your team's convenience.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
              src="/trainning.png" 
              alt="Cinematic Corporate Training" 
              fill 
              className="object-cover"
              priority
            />
            {/* Cinematic Overlay - Fades image into the light background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5F3EC] via-[#F4F2EA]/80 to-transparent" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full px-6 relative z-10 py-12 ">
          <div className="max-w-4xl ">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/40 border border-[#4A6E62]/10 text-[#4A6E62] text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <span className="flex h-0.5 w-0.5 rounded-full bg-[#4A6E62]"></span>
              Knowledge Empowerment
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
              Tally Corporate{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A6E62] via-[#5D887A] to-[#4A6E62]">Training Programs</span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed mb-8 font-semibold">
              Empower your team with expert knowledge. Our customized training programs help you master advanced Tally features and optimize business workflows.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => openModal('enquire')}
                className="px-8 py-4 bg-[#4A6E62] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#5D887A] transition-all shadow-xl shadow-[#4A6E62]/20"
              >
                Schedule Training
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-black mb-4">Master TallyPrime</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Strategic learning paths designed to bridge the skill gap and drive business efficiency.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainingFeatures.map((feature, i) => (
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

      {/* Topics Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video max-w-lg mx-auto w-full">
            <Image 
              src="/tra.jpg" 
              alt="Training Session" 
              fill 
              className="object-fill"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Comprehensive Training <span className="text-[#4A6E62]">Curriculum</span></h2>
            <div className="space-y-6">
              {[
                { title: "Advanced GST & TDS", desc: "Master complex tax scenarios and compliance workflows." },
                { title: "MIS & Management Reporting", desc: "Generate actionable insights for better business decisions." },
                { title: "Inventory & Cost Centers", desc: "Optimize stock control and track departmental expenses." },
                { title: "E-Invoicing & Payroll", desc: "Stay compliant with auto-generated invoices and salary management." }
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
                  Get Training Quote
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#4A6E62] py-14 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Invest in Your Team&apos;s Growth</h2>
          <p className="text-emerald-100 text-sm mb-8 max-w-xl mx-auto">
            Schedule a consultation to design a training program that fits your company&apos;s specific needs.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => openModal('callback')}
              className="px-7 py-3.5 bg-white text-[#4A6E62] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all"
            >
              Consult an Expert
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
