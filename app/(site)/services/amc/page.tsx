'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Headset, ShieldCheck, Clock, Activity } from 'lucide-react';
import Footer from '../../../components/Footer';
import UnifiedContactModal, { FormType } from '../../../components/UnifiedContactModal';

const features = [
  {
    icon: Headset,
    title: 'Priority Troubleshooting',
    description: 'Get 15-minute response SLA for critical business-halting issues. Our dedicated team ensures your operations resume without delay.',
  },
  {
    icon: CheckCircle2,
    title: 'On-Site & Remote Support',
    description: 'Flexible support options including unlimited remote sessions and scheduled on-site visits for complex issues.',
  },
  {
    icon: ShieldCheck,
    title: 'Data Backup & Recovery',
    description: 'Expert assistance in setting up robust data backup routines and emergency data recovery when you need it most.',
  },
  {
    icon: Clock,
    title: 'Regular Health Checks',
    description: 'Quarterly audits of your Tally data and system configuration to ensure peak performance and compliance.',
  },
];

const technicalAssistance = [
  {
    title: 'Unlimited Remote Support',
    description: 'No limits on how many times you can call us for help. Our team is always ready to resolve your issues remotely.',
  },
  {
    title: 'Priority Response',
    description: 'AMC customers always get jumped to the front of the queue. Critical issues receive immediate attention.',
  },
  {
    title: 'On-Site Visits',
    description: 'Scheduled visits for complex issues that need in-person attention from our certified Tally experts.',
  },
  {
    title: 'Data Recovery Support',
    description: 'Advanced data recovery services included in case of system failure, corruption, or accidental deletion.',
  },
];

export default function AMCLandingPage() {
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: FormType; service: string }>({
    isOpen: false,
    type: 'enquire',
    service: 'Tally Annual Maintenance Contract (AMC)',
  });

  const openModal = (type: FormType, service: string = 'Tally AMC') => {
    setModalConfig({ isOpen: true, type, service });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-slate-800 antialiased overflow-hidden">

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-8 lg:pt-2  overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-[#1A4731]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

            {/* Hero Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-[#1A4731]/10 shadow-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold tracking-widest text-[#1A4731] uppercase">Support Excellence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-5xl font-extrabold text-slate-900 leading-[1.15] mb-6">
                Tally <span className="text-[#1A4731] relative whitespace-nowrap">
                  AMC
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-400/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span><br /><span className="text-[35px]">
                  Annual Maintenance Contract </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                Minimize downtime and maximize productivity with our priority troubleshooting and regular health checks. Your safety net for continuous business operations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-bold rounded-2xl shadow-xl text-white bg-[#1A4731] hover:bg-[#113021] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                  Enquire Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Hero Abstract Graphic */}
            <div className="relative h-[400px] lg:h-[500px] w-full flex items-center justify-center perspective-1000">
              <div className="relative w-full max-w-md aspect-square">
                {/* Main Document Plate */}
                <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-white/60 transform rotate-[-3deg] transition-transform duration-700 hover:rotate-0 flex flex-col p-8 z-10 overflow-hidden">

                  <Image
                    src="/amc.png"
                    alt="AMC Support in action"
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
                  <Headset className="w-8 h-8 text-white" />
                </div>

                <div className="absolute -left-8 bottom-24 bg-white p-5 rounded-2xl shadow-lg border border-slate-100 z-20 animate-float">
                  <ShieldCheck className="w-10 h-10 text-emerald-500" />
                </div>

                <div className="absolute top-0 left-12 bg-amber-100 p-4 rounded-xl shadow-md z-0 transform -rotate-12">
                  <Clock className="w-6 h-6 text-amber-600" />
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
            <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Why Choose Our AMC?</h2>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Comprehensive support coverage specifically designed to keep your Tally environment healthy, compliant, and running at peak performance.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(26,71,49,0.12)] hover:border-emerald-200 hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden flex flex-col "
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

      {/* --- ZERO FRICTION DETAILS SECTION --- */}
      <section className="py-2 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-[2rem] p-6 md:p-8 lg:p-10  relative overflow-hidden">

            {/* Background Accent Lines */}
            <svg className="absolute right-0 top-0 text-emerald-50/50 w-1/2 h-full transform translate-x-1/3" viewBox="0 0 100 100" preserveAspectRatio="none" fill="currentColor">
              <polygon points="0,100 100,0 100,100" />
            </svg>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">

              {/* Left: Enhanced Illustration Card */}
              <div className="order-2 lg:order-1 relative rounded-[2rem] overflow-hidden   aspect-[4/3] flex items-center justify-center  group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.9),transparent)]"></div>

                {/* Abstract UI Composition */}
                <div className="relative w-full h-full flex items-center justify-center p-8 perspective-1000">

                  {/* Floating Notification */}
                  <div className="absolute top-1/4 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white z-20 flex items-center gap-3 animate-float transform -rotate-6 group-hover:rotate-0 transition-transform duration-700">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Headset className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="h-2 w-16 bg-slate-200 rounded-full mb-2"></div>
                      <div className="h-2 w-10 bg-slate-200 rounded-full"></div>
                    </div>
                  </div>

                  {/* Main Dashboard Panel */}
                  <div className="relative z-10 w-64 h-72 bg-white/80 backdrop-blur-lg rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/60 p-6 flex flex-col transform group-hover:-translate-y-2 transition-transform duration-700">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/amc.png"
                          alt="AMC Support in action"
                          fill
                          className="object-cover"
                        /> 
                      </div>
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                        <Activity className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>

                    {/* Simulated Data Rows */}
                    <div className="flex-1 w-full space-y-5">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-xl flex-shrink-0 ${i === 0 ? 'bg-emerald-100' : 'bg-slate-100'}`}></div>
                          <div className="flex-1">
                            <div className="h-2.5 w-full bg-slate-100 rounded-full mb-2"></div>
                            <div className={`h-2.5 rounded-full ${i === 0 ? 'w-3/4 bg-emerald-200' : 'w-1/2 bg-slate-100'}`}></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Status indicator */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Healthy</div>
                    </div>
                  </div>

                  {/* Back decorative card */}
                  <div className="absolute right-12 bottom-1/4 w-48 h-56 bg-slate-800 rounded-3xl shadow-2xl rotate-12 opacity-90 blur-[1px] group-hover:rotate-6 transition-transform duration-700"></div>

                </div>
              </div>

              {/* Right: Content & List */}
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] font-bold tracking-wide text-emerald-800 uppercase">Seamless Support</span>
                </div>

                <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">
                  Zero-Friction Technical <span className="text-[#1A4731]">Assistance</span>
                </h2>

                <p className="text-slate-600 text-sm mb-6 font-medium">
                  No long hold times, no complicated ticketing systems—just fast, effective solutions from Tally experts.
                </p>

                <div className="space-y-2">
                  {technicalAssistance.map((item, index) => (
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
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready for Priority Support?</h2>
          <p className="text-emerald-100/80 text-lg mb-10 max-w-4xl mx-auto font-medium">
            Join 1500+ businesses who trust Sarvadnya Infotech for their daily Tally operations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openModal('callback')}
              className="px-5 py-2.5 bg-white text-[#1A4731] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-50 hover:shadow-xl transition-all duration-300"
            >
              Get a Callback
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
