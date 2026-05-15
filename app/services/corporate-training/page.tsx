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
              src="/assets/images/1504384308090-c894fdcc538d.jpg" 
              alt="Cinematic Corporate Training" 
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
              Knowledge Empowerment
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
              Tally Corporate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7338a0] to-indigo-400">Training Programs</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl leading-relaxed mb-8">
              Empower your team with expert knowledge. Our customized training programs help you master advanced Tally features and optimize business workflows.
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
          {trainingFeatures.map((f, i) => (
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
                src="/assets/images/1504384308090-c894fdcc538d.jpg" 
                alt="Corporate Training" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[200px] hidden md:block">
              <div className="text-3xl font-black text-[#7338a0] mb-1">95%</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Increase in Team Productivity Post-Training</div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-[#0f0529] mb-6 leading-tight">
              Why Choose Our <br />Training Services?
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Expert-Led Sessions",
                  a: "Our trainers are industry veterans who bring real-world problem-solving skills to the classroom."
                },
                {
                  q: "Focus on Practical Usage",
                  a: "We move beyond theory to show exactly how Tally can solve your specific business challenges."
                },
                {
                  q: "Post-Training Support",
                  a: "30 days of complimentary support to help your team implement what they've learned."
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
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Elevate Your Team's Skills</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
              Ready to transform how your business uses Tally? Book a free consultation for a customized training plan.
            </p>
            <button 
              onClick={() => openModal('enquire')}
              className="px-12 py-5 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl"
            >
              Request Training Proposal
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
