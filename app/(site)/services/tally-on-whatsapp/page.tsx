'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, MessageSquare, Send, BellRing, Megaphone, Users, ShieldCheck, Activity } from 'lucide-react';
import Footer from '../../../components/Footer';
import UnifiedContactModal, { FormType } from '../../../components/UnifiedContactModal';

const features = [
  {
    icon: Send,
    title: 'Send Invoices in 1 Click',
    description: 'Say goodbye to WhatsApp Web. Share professional PDF invoices, receipts, and delivery notes instantly without ever leaving your Tally screen.',
  },
  {
    icon: BellRing,
    title: 'Polite Payment Reminders',
    description: 'Recover stuck payments effortlessly. Send automated, professional reminders with exact outstanding amounts to ensure you get paid on time.',
  },
  {
    icon: Users,
    title: '24/7 Customer Ledger Access',
    description: 'Stop answering "what is my balance?" calls. Let your customers securely check their own ledgers anytime by simply messaging your business number.',
  },
  {
    icon: Megaphone,
    title: 'Bulk Festival & Offer Messaging',
    description: 'Send personalized Diwali greetings or bulk discount offers to your entire Tally contact list in one click—without getting your number blocked.',
  },
];

const technicalAssistance = [
  {
    title: 'Send Instantly on Save',
    description: "The moment you press 'Save' on a sales voucher, the invoice is already on your customer's phone.",
  },
  {
    title: 'Smart Personalization',
    description: "Messages automatically include the customer's name, invoice number, and exact due amount. No copy-pasting required.",
  },
  {
    title: 'Official & Ban-Proof',
    description: 'Powered by the official WhatsApp API. Your account stays secure, professional, and safe from unexpected bans.',
  },
  {
    title: 'Single Central Number',
    description: 'Let your entire billing team send documents from one official business number instead of their personal phones.',
  },
];

export default function TallyOnWhatsappPage() {
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: FormType; service: string }>({
    isOpen: false,
    type: 'enquire',
    service: 'Tally on WhatsApp Integration',
  });

  const openModal = (type: FormType, service: string = 'Tally on WhatsApp') => {
    setModalConfig({ isOpen: true, type, service });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-slate-800 antialiased overflow-hidden">

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-8 lg:pt-2  overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-[#006569]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

            {/* Hero Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-[#006569]/10 shadow-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span className="text-xs font-bold tracking-widest text-[#006569] uppercase">Instant Communication</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-5xl font-extrabold text-slate-900 leading-[1.15] mb-6">
                WhatsApp <span className="text-[#006569] relative whitespace-nowrap">
                  Invoicing
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-teal-400/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span><br /><span className="text-[35px]">
                  Directly From Tally </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                Stop downloading PDFs, saving phone numbers, and juggling WhatsApp Web. Send invoices, ledgers, and payment reminders to your client&apos;s WhatsApp the exact second you hit &apos;Save&apos; in Tally.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => openModal('enquire')}
                  className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-bold rounded-2xl shadow-xl text-white bg-[#006569] hover:bg-[#045A57] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  Get Now
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
                    src="/tallytowa.png"
                    alt="WhatsApp Integration in action"
                    fill
                    className="object-cover"
                  />

                  {/* Decorative stamp */}
                  <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full border-4 border-teal-100 flex items-center justify-center opacity-40 transform rotate-12">
                    <div className="w-20 h-20 rounded-full border border-dashed border-teal-300 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-teal-400" />
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -right-6 top-12 bg-[#006569] p-5 rounded-2xl shadow-xl z-20 animate-bounce-slow transform rotate-[10deg]">
                  <Send className="w-8 h-8 text-white" />
                </div>

                <div className="absolute -left-8 bottom-24 bg-white p-5 rounded-2xl shadow-lg border border-slate-100 z-20 animate-float">
                  <MessageSquare className="w-10 h-10 text-teal-500" />
                </div>

                <div className="absolute top-0 left-12 bg-amber-100 p-4 rounded-xl shadow-md z-0 transform -rotate-12">
                  <BellRing className="w-6 h-6 text-amber-600" />
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
            <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Why MSMEs Upgrade to WhatsApp Billing</h2>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Save hours of manual data entry, cut printing costs, and give your customers a modern buying experience.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(0,101,105,0.12)] hover:border-teal-200 hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden flex flex-col "
                >
                  {/* Subtle top glow on hover */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-[#006569] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out"></div>

                  {/* Decorative background glow */}
                  <div className="absolute -right-12 -top-12 w-40 h-40 bg-teal-50/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl z-0 pointer-events-none"></div>

                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 flex items-center justify-center mb-4 group-hover:bg-teal-50 group-hover:border-teal-200 group-hover:shadow-lg group-hover:shadow-teal-100 transition-all duration-500">
                      <Icon className="w-5 h-5 text-slate-700 group-hover:text-[#006569] transition-colors duration-500" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-[#006569] transition-colors duration-300">{feature.title}</h3>
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
            <svg className="absolute right-0 top-0 text-teal-50/50 w-1/2 h-full transform translate-x-1/3" viewBox="0 0 100 100" preserveAspectRatio="none" fill="currentColor">
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
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="h-2 w-16 bg-slate-200 rounded-full mb-2"></div>
                      <div className="h-2 w-10 bg-slate-200 rounded-full"></div>
                    </div>
                  </div>

                  {/* Main WhatsApp Panel */}
                  <div className="relative z-10 w-64 h-72 bg-white/80 backdrop-blur-lg rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/60 p-6 flex flex-col transform group-hover:-translate-y-2 transition-transform duration-700">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-teal-600" />
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100">
                        <Activity className="w-4 h-4 text-teal-600" />
                      </div>
                    </div>

                    {/* Simulated Chat Bubbles */}
                    <div className="flex-1 w-full space-y-5">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className={`flex items-center gap-2 ${i === 2 ? 'justify-end' : ''}`}>
                          <div className={`rounded-2xl p-2.5 flex-shrink-0 ${i === 2 ? 'bg-teal-100' : 'bg-slate-100'}`}>
                            <div className="h-2 w-14 bg-slate-200 rounded-full mb-1.5"></div>
                            <div className="h-2 w-10 bg-slate-200 rounded-full"></div>
                          </div>
                          {i === 2 && (
                            <svg className="w-3 h-3 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Status indicator */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
                      </div>
                      <div className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-full">Delivered</div>
                    </div>
                  </div>

                  {/* Back decorative card */}
                  <div className="absolute right-12 bottom-1/4 w-48 h-56 bg-slate-800 rounded-3xl shadow-2xl rotate-12 opacity-90 blur-[1px] group-hover:rotate-6 transition-transform duration-700"></div>

                </div>
              </div>

              {/* Right: Content & List */}
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-100 mb-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span className="text-[10px] font-bold tracking-wide text-teal-800 uppercase">WhatsApp Native</span>
                </div>

                <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">
                  Professional, Fast, and <span className="text-[#006569]">100% Automated</span>
                </h2>

                <p className="text-slate-600 text-sm mb-6 font-medium">
                  No more copy-pasting, no more WhatsApp Web—every document lands on your customer&apos;s phone the second you hit Save in Tally.
                </p>

                <div className="space-y-2">
                  {technicalAssistance.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start group p-2.5 md:p-3 rounded-xl hover:bg-white hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] border border-transparent hover:border-slate-100 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 mt-0.5 relative">
                        <CheckCircle2 className="relative w-4 h-4 md:w-5 md:h-5 text-[#006569] bg-white rounded-full" strokeWidth={2.5} />
                      </div>
                      <div className="ml-2.5 md:ml-3">
                        <h4 className="text-sm font-bold text-slate-900 mb-0.5 group-hover:text-[#006569] transition-colors">{item.title}</h4>
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
      <section className="bg-[#006569] py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Stop Printing. Start Collecting Faster.</h2>
          <p className="text-teal-100/80 text-lg mb-10 max-w-4xl mx-auto font-medium">
            Join smart businesses that have eliminated paper printing and accelerated their cash flow with our automated WhatsApp integration.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openModal('callback')}
              className="px-5 py-2.5 bg-white text-[#006569] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-teal-50 hover:shadow-xl transition-all duration-300"
            >
              Get Now
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
