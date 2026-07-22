'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, BookOpen, Award, Target, Calendar } from 'lucide-react';
import Footer from '../../../components/Footer';
import UnifiedContactModal, { FormType } from '../../../components/UnifiedContactModal';

const features = [
  {
    icon: BookOpen,
    title: 'Customized Curriculum',
    description: 'Training modules tailored specifically to your industry and business processes.',
  },
  {
    icon: Award,
    title: 'Certified Experts',
    description: 'Learn from Tally-certified professionals with years of implementation experience.',
  },
  {
    icon: Target,
    title: 'Hands-on Workshops',
    description: 'Practical sessions using real-world scenarios to ensure immediate skill application.',
  },
  {
    icon: Calendar,
    title: 'Flexible Scheduling',
    description: 'On-site or virtual training sessions scheduled at your team\'s convenience.',
  },
];

const trainingTopics = [
  {
    title: 'Advanced GST & TDS',
    description: 'Master complex tax scenarios and compliance workflows.',
  },
  {
    title: 'MIS & Management Reporting',
    description: 'Generate actionable insights for better business decisions.',
  },
  {
    title: 'Inventory & Cost Centers',
    description: 'Optimize stock control and track departmental expenses.',
  },
  {
    title: 'E-Invoicing & Payroll',
    description: 'Stay compliant with auto-generated invoices and salary management.',
  },
];

export default function CorporateTrainingPage() {
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: FormType; service: string }>({
    isOpen: false,
    type: 'enquire',
    service: 'Corporate Training',
  });

  const openModal = (type: FormType, service: string = 'Corporate Training') => {
    setModalConfig({ isOpen: true, type, service });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-slate-800 antialiased overflow-hidden">

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-8 lg:pt-2 overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-[#1A4731]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

            {/* Hero Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-[#1A4731]/10 shadow-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold tracking-widest text-[#1A4731] uppercase">Knowledge Empowerment</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-5xl font-extrabold text-slate-900 leading-[1.15] mb-6">
                Tally <span className="text-[#1A4731] relative whitespace-nowrap">
                  Corporate Training
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-400/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>  
                </span> 
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                Empower your team with expert knowledge. Our customized training programs help you master advanced Tally features and optimize business workflows.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-bold rounded-2xl shadow-xl text-white bg-[#1A4731] hover:bg-[#113021] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                  Schedule Training
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Hero Abstract Graphic */}
            <div className="relative h-[400px] lg:h-[500px] w-full flex items-center justify-center perspective-1000">
              <div className="relative w-2/3 max-w-md aspect-square">
                {/* Main Document Plate */}
                <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-white/60 transform rotate-[-3deg] transition-transform duration-700 hover:rotate-0 flex flex-col p-8 z-10 overflow-hidden">

                  <Image
                    src="/trainning.png"
                    alt="Corporate Training"
                    fill
                    className="object-cover"
                  />

                  {/* Decorative stamp */}
                  <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full border-4 border-emerald-100 flex items-center justify-center opacity-40 transform rotate-12">
                    <div className="w-20 h-20 rounded-full border border-dashed border-emerald-300 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -right-6 top-12 bg-[#1A4731] p-5 rounded-2xl shadow-xl z-20 animate-bounce-slow transform rotate-[10deg]">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>

                <div className="absolute -left-8 bottom-24 bg-white p-5 rounded-2xl shadow-lg border border-slate-100 z-20 animate-float">
                  <Award className="w-10 h-10 text-emerald-500" />
                </div>

                <div className="absolute top-0 left-12 bg-amber-100 p-4 rounded-xl shadow-md z-0 transform -rotate-12">
                  <Calendar className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-8 relative overflow-hidden bg-gradient-to-b from-[#FDFBF7] to-white border-t border-slate-100">
        {/* Subtle dot pattern background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-80 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Master TallyPrime</h2>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Strategic learning paths designed to bridge the skill gap and drive business efficiency.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(26,71,49,0.12)] hover:border-emerald-200 hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden flex flex-col"
                >
                  {/* Subtle top glow on hover */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-[#1A4731] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out"></div>

                  {/* Decorative background glow */}
                  <div className="absolute -right-12 -top-12 w-40 h-40 bg-emerald-50/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl z-0 pointer-events-none"></div>

                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 flex items-center justify-center mb-4 group-hover:bg-emerald-50 group-hover:border-emerald-200 group-hover:shadow-lg group-hover:shadow-emerald-100 transition-all duration-500">
                      <Icon className="w-5 h-5 text-slate-700 group-hover:text-[#1A4731] transition-colors duration-500" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-[#1A4731] transition-colors duration-300">{feature.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-xs font-medium flex-1">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- CURRICULUM DETAILS SECTION --- */}
      <section className="py-2 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-[2rem] p-6 md:p-8 lg:p-10 relative overflow-hidden">

            {/* Background Accent Lines */}
            <svg className="absolute right-0 top-0 text-emerald-50/50 w-1/2 h-full transform translate-x-1/3" viewBox="0 0 100 100" preserveAspectRatio="none" fill="currentColor">
              <polygon points="0,100 100,0 100,100" />
            </svg>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">

              {/* Left: Training Image */}
              <div className="order-2 lg:order-1 relative rounded-[2rem] overflow-hidden aspect-[4/3] border border-white shadow-lg">
                <Image
                  src="/tra.jpg"
                  alt="Training Session"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Right: Content & List */}
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-4">
                  <Target className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] font-bold tracking-wide text-emerald-800 uppercase">Comprehensive Curriculum</span>
                </div>

                <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">
                  Comprehensive Training <span className="text-[#1A4731]">Curriculum</span>
                </h2>

                <p className="text-slate-600 text-sm mb-6 font-medium">
                  Master every aspect of TallyPrime with our structured training modules designed for real-world application.
                </p>

                <div className="space-y-2">
                  {trainingTopics.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start group p-2.5 md:p-3 rounded-xl hover:bg-white hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] border border-transparent hover:border-slate-100 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 mt-0.5 relative">
                        <CheckCircle2 className="relative w-4 h-4 md:w-5 md:h-5 text-[#1A4731] bg-white rounded-full" strokeWidth={2.5} />
                      </div>
                      <div className="ml-2.5 md:ml-3">
                        <h4 className="text-sm font-bold text-slate-900 mb-0.5 group-hover:text-[#1A4731] transition-colors">{item.title}</h4>
                        <p className="text-slate-500 text-xs leading-relaxed font-medium">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1A4731] py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Invest in Your Team&apos;s Growth</h2>
          <p className="text-emerald-100/80 text-lg mb-10 max-w-4xl mx-auto font-medium">
            Schedule a consultation to design a training program that fits your company&apos;s specific needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openModal('callback')}
              className="px-5 py-2.5 bg-white text-[#1A4731] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-50 hover:shadow-xl transition-all duration-300"
            >
              Consult an Expert
            </button>
            <button
              onClick={() => openModal('enquire')}
              className="px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-all duration-300"
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
