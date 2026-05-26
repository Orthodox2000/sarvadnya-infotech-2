'use client';

import { useState } from 'react';
import Image from 'next/image';
import Footer from '../../components/Footer';
import UnifiedContactModal, { FormType } from '../../components/UnifiedContactModal';

export default function TDLPage() {
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean; type: FormType; service: string}>({
    isOpen: false,
    type: 'enquire',
    service: 'TDL Customization'
  });

  const openModal = (type: FormType, service: string = 'TDL Customization') => {
    setModalConfig({ isOpen: true, type, service });
  };

  const tdlFeatures = [
    {
      title: "Custom Invoice Design",
      desc: "Get professionally designed invoice formats that match your brand identity and requirements.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Advanced Reporting",
      desc: "Development of specialized reports that Tally doesn't provide out-of-the-box.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Module Integration",
      desc: "Seamlessly integrate third-party applications or custom modules with your Tally data.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      )
    },
    {
      title: "Workflow Automation",
      desc: "Automate repetitive data entry tasks and business processes using custom TDL logic.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
              src="/TDLandCustom.jpg" 
              alt="Cinematic Tally Development" 
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
              Tailored Excellence
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
              TDL & Custom <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] via-[#00ABE4] to-[#0371a3]">Development</span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed mb-8 font-semibold">
              Make Tally work exactly the way your business does. Our expert TDL developers create custom solutions to bridge the gap between standard features and your unique needs.
            </p>
            <div className="flex flex-wrap gap-4">
               <button 
                  onClick={() => openModal('enquire')}
                  className="px-8 py-4 bg-[#0371a3] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00ABE4] transition-all shadow-xl shadow-[#0371a3]/20"
               >
                  Consult a Developer
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Unlimited Possibilities</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">From simple invoice formatting to complex industry-specific modules, we build it all.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tdlFeatures.map((feature, i) => (
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

      {/* Process Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video bg-white">
             <Image 
                src="/tallycustomization.png" 
                alt="TDL Customization Workflow" 
                fill 
                className="object-contain p-8"
             />
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Our Development <br /><span className="text-[#0371a3]">Lifecycle</span></h2>
            <div className="space-y-4">
              {[
                { step: "01", title: "Requirement Analysis", desc: "We sit with you to understand your specific business logic and pain points." },
                { step: "02", title: "Prototype Design", desc: "Create a mock-up of the report or feature for your initial approval." },
                { step: "03", title: "Core Development", desc: "Expert TDL coding adhering to Tally's best practices for data integrity." },
                { step: "04", title: "UAT & Deployment", desc: "Testing the module with your live data and final implementation." }
              ].map((item, i) => (
                <div key={i} className="flex gap-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-2xl font-black text-[#0371a3]/20">{item.step}</span>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0371a3]/20 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Have a Unique Requirement?</h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto font-medium">If you can imagine it, we can build it in Tally. Let's discuss your custom module today.</p>
            <button 
              onClick={() => openModal('callback')}
              className="px-10 py-4 bg-[#00ABE4] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#00ABE4]/20"
            >
              Get a Callback
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
