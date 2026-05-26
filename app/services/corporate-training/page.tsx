'use client';

import { useState } from 'react';
import Image from 'next/image';
import Footer from '../../components/Footer';
import UnifiedContactModal, { FormType } from '../../components/UnifiedContactModal';

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
              src="/trainning.png" 
              alt="Cinematic Corporate Training" 
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
              Knowledge Empowerment
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
              Tally Corporate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] via-[#00ABE4] to-[#0371a3]">Training Programs</span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed mb-8 font-semibold">
              Empower your team with expert knowledge. Our customized training programs help you master advanced Tally features and optimize business workflows.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => openModal('enquire')}
                className="px-8 py-4 bg-[#0371a3] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00ABE4] transition-all shadow-xl shadow-[#0371a3]/20"
              >
                Schedule Training
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Master TallyPrime</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Strategic learning paths designed to bridge the skill gap and drive business efficiency.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainingFeatures.map((feature, i) => (
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

      {/* Topics Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-square lg:aspect-auto lg:h-[600px]">
            <Image 
              src="/public/assets/images/1524178232363-1fb2b075b655.jpg" 
              alt="Training Session" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Comprehensive Training <br /><span className="text-[#0371a3]">Curriculum</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                "Advanced GST & TDS",
                "MIS & Management Reporting",
                "Cost Center Management",
                "Inventory Control",
                "Audit Trail & Security",
                "Multi-Currency Accounting",
                "E-Invoicing & E-Way Bill",
                "Payroll Management"
              ].map((topic, i) => (
                <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-[#00ABE4]" />
                  <span className="font-bold text-slate-700 text-sm">{topic}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-[#0371a3] pl-4">
              "Training isn't just about learning buttons; it's about understanding business logic through the lens of TallyPrime."
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0371a3]/20 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Invest in Your Team's Growth</h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto font-medium">Schedule a free consultation to design a training program that fits your company's specific needs.</p>
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
