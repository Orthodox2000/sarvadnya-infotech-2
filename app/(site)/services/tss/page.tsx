'use client';

import { useState } from 'react';
import Image from 'next/image';
import Footer from '../../../components/Footer';
import UnifiedContactModal, { FormType } from '../../../components/UnifiedContactModal';
import TssRenewalForm from '../../../components/TssRenewalForm';

export default function TSSPage() {
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean; type: FormType; service: string}>({
    isOpen: false,
    type: 'enquire',
    service: 'Tally Software Service (TSS) Renewal'
  });

  const openModal = (type: FormType, service: string = 'TSS Renewal') => {
    setModalConfig({ isOpen: true, type, service });
  };

  const tssFeatures = [
    {
      title: "Connected GST & E-Invoicing",
      desc: "Generate E-invoices and E-way bills instantly. Push your GSTR-1 directly to the tax portal without manual JSON uploads.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Web & Mobile Reports",
      desc: "Traveling? View your live dashboards, outstanding balances, and inventory directly on any smartphone or web browser securely.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    },
    {
      title: "CA & Branch Sync",
      desc: "Stop emailing backup files. Automatically sync your live data between your warehouses, branch offices, and your Chartered Accountant.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      title: "Free Upgrades & New Features",
      desc: "Get every new TallyPrime feature, performance boost, and security patch automatically—absolutely free of cost with your active TSS.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      )
    }
  ];

  const deliverableList = [
    "1-Click E-Invoicing & E-Way Bills",
    "Direct GST Portal Integration",
    "Free Upgrades to Every New Tally Version",
    "Secure Branch & CA Data Sync",
    "View Live Reports on Any Web Browser"
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(90deg,rgba(249,251,245,1)_0%,rgba(244,242,234,1)_53%,rgba(238,236,223,1)_100%)] text-slate-900">
      {/* Cinematic Hero Section (Themed Hero) */}
      <section className="bg-[linear-gradient(90deg,rgba(249,251,245,1)_0%,rgba(244,242,234,1)_53%,rgba(238,236,223,1)_100%)] relative overflow-hidden flex items-center min-h-[200px] md:min-h-[350px] border-b border-[#006569]/10">
        {/* Cinematic Image Side - Hidden on mobile, full height on desktop */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 z-0">
          <div className="relative h-full w-full">
            <Image 
              src="/tss-icon.png" 
              alt="Cinematic TSS Renewal" 
              fill 
              className="object-cover"
              priority
            />
            {/* Cinematic Overlay - Fades image into the light background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5F4EC]/20 via-[#EEECDF]/50 to-transparent" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full px-6 relative z-10 py-12">
          <div className="max-w-2xl lg:pr-6">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/40 border border-[#006569]/10 text-[#006569] text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <span className="flex h-0.5 w-0.5 rounded-full bg-[#006569]"></span>
               Software Continuity
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
              Renew Your {' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006569] via-[#006569] to-[#006569]">Tally Software Service (TSS)</span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed mb-8 font-semibold">
              Don&apos;t let your E-invoicing and GST features expire. Renew your TSS today to keep generating 1-click E-way bills, auto-reconcile your bank statements, and stay perfectly compliant with the latest tax laws.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => openModal('quote')}
                className="px-8 py-4 bg-[#006569] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#006569] transition-all shadow-xl shadow-[#006569]/20"
              >
                Get Renewal Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">What Do You Lose If TSS Expires?</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">An active TSS subscription is the engine that keeps your daily accounting automated and error-free.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tssFeatures.map((feature, i) => (
            <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#E5F4F4] text-[#006569] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-6 bg-[linear-gradient(90deg,rgba(249,251,245,1)_0%,rgba(244,242,234,1)_53%,rgba(238,236,223,1)_100%)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video bg-white">
             <Image 
                src="/tssgold.png" 
                alt="TSS Benefits Overview" 
                fill 
                className="object-fill"
             />
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Included in Your {' '}<span className="text-[#006569]">TSS Renewal ! </span></h2>
            <div className="space-y-4">
              {deliverableList.map((benefit, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="font-bold text-slate-700 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-[#006569] pl-4">
              "An active TSS subscription is the difference between a smooth, automated audit and a stressful, manual tax season."
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">TSS Pricing</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">All plans include 18% GST. Choose the plan that fits your team size.</p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Validity</th>
                <th className="px-6 py-4">Base Price (INR)</th>
                <th className="px-6 py-4">GST 18% (INR)</th>
                <th className="px-6 py-4">Total (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4 font-bold text-slate-900">TSS Single User (1 Year)</td>
                <td className="px-6 py-4 text-slate-600">1 Year</td>
                <td className="px-6 py-4 text-slate-600">4,500</td>
                <td className="px-6 py-4 text-slate-600">810</td>
                <td className="px-6 py-4 font-bold text-[#006569]">5,310/-</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4 font-bold text-slate-900">TSS Single User (2 Years)</td>
                <td className="px-6 py-4 text-slate-600">2 Years</td>
                <td className="px-6 py-4 text-slate-600">8,100</td>
                <td className="px-6 py-4 text-slate-600">1,458</td>
                <td className="px-6 py-4">
                  <span className="text-slate-400 line-through mr-1.5">9,558</span>
                  <span className="font-bold text-teal-600">8,496/-</span>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 ml-2 text-[10px] font-bold bg-teal-50 text-teal-600 border border-teal-200">10% OFF</span>
                  <p className="text-[10px] text-teal-600 mt-0.5 font-medium">You save 1,062/-</p>
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4 font-bold text-slate-900">TSS Multi User (1 Year)</td>
                <td className="px-6 py-4 text-slate-600">1 Year</td>
                <td className="px-6 py-4 text-slate-600">13,500</td>
                <td className="px-6 py-4 text-slate-600">2,430</td>
                <td className="px-6 py-4 font-bold text-[#006569]">15,930/-</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4 font-bold text-slate-900">TSS Multi User (2 Years)</td>
                <td className="px-6 py-4 text-slate-600">2 Years</td>
                <td className="px-6 py-4 text-slate-600">24,300</td>
                <td className="px-6 py-4 text-slate-600">4,374</td>
                <td className="px-6 py-4">
                  <span className="text-slate-400 line-through mr-1.5">28,674</span>
                  <span className="font-bold text-teal-600">25,488/-</span>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 ml-2 text-[10px] font-bold bg-teal-50 text-teal-600 border border-teal-200">10% OFF</span>
                  <p className="text-[10px] text-teal-600 mt-0.5 font-medium">You save 3,186/-</p>
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4 font-bold text-slate-900">TSS Auditor (1 Year)</td>
                <td className="px-6 py-4 text-slate-600">1 Year</td>
                <td className="px-6 py-4 text-slate-600">6,750</td>
                <td className="px-6 py-4 text-slate-600">1,215</td>
                <td className="px-6 py-4 font-bold text-[#006569]">7,965/-</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900">TSS Auditor (2 Years)</td>
                <td className="px-6 py-4 text-slate-600">2 Years</td>
                <td className="px-6 py-4 text-slate-600">12,150</td>
                <td className="px-6 py-4 text-slate-600">2,187</td>
                <td className="px-6 py-4">
                  <span className="text-slate-400 line-through mr-1.5">14,337</span>
                  <span className="font-bold text-teal-600">12,744/-</span>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 ml-2 text-[10px] font-bold bg-teal-50 text-teal-600 border border-teal-200">10% OFF</span>
                  <p className="text-[10px] text-teal-600 mt-0.5 font-medium">You save 1,593/-</p>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <p className="text-[11px] text-slate-500 text-center">Prices are inclusive of 18% GST. Contact our sales team for more price options.</p>
          </div>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-4">
          {[
            { plan: 'TSS Single User (1 Year)', validity: '1 Year', base: '4,500', gst: '810', total: '5,310/-' },
            { plan: 'TSS Single User (2 Years)', validity: '2 Years', base: '8,100', gst: '1,458', total: '8,496/-', originalTotal: '9,558', discount: '10% OFF', save: '1,062/-' },
            { plan: 'TSS Multi User (1 Year)', validity: '1 Year', base: '13,500', gst: '2,430', total: '15,930/-' },
            { plan: 'TSS Multi User (2 Years)', validity: '2 Years', base: '24,300', gst: '4,374', total: '25,488/-', originalTotal: '28,674', discount: '10% OFF', save: '3,186/-' },
            { plan: 'TSS Auditor (1 Year)', validity: '1 Year', base: '6,750', gst: '1,215', total: '7,965/-' },
            { plan: 'TSS Auditor (2 Years)', validity: '2 Years', base: '12,150', gst: '2,187', total: '12,744/-', originalTotal: '14,337', discount: '10% OFF', save: '1,593/-' },
          ].map((row, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">{row.plan}</h3>
                {row.discount && (
                  <span className="shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-teal-50 text-teal-600 border border-teal-200">{row.discount}</span>
                )}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Validity</span><span className="text-slate-600 font-semibold">{row.validity}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Base Price</span><span className="text-slate-600 font-semibold">₹{row.base}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">GST 18%</span><span className="text-slate-600 font-semibold">₹{row.gst}</span></div>
                <div className="flex justify-between items-center border-t border-slate-100 pt-2 mt-2">
                  <span className="text-slate-400 font-medium">Total</span>
                  <div className="text-right">
                    {row.originalTotal && <span className="text-slate-400 line-through mr-1.5">₹{row.originalTotal}</span>}
                    <span className="font-bold text-[#006569] text-base">₹{row.total}</span>
                  </div>
                </div>
                {row.save && <p className="text-[10px] text-teal-600 font-medium text-right">You save ₹{row.save}</p>}
              </div>
            </div>
          ))}
          <p className="text-[11px] text-slate-500 text-center pt-2">Prices are inclusive of 18% GST.</p>
        </div>
      </section>

      {/* Renewal Form Section */}
      <section className="bg-[#006569] py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Renew Your TSS Now</h2>
            <p className="text-teal-100 text-sm max-w-md mx-auto">
              Enter your serial number and details below. Our team will process your renewal immediately.
            </p>
          </div>
          <TssRenewalForm variant="inline" source="tss-page" />
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-[#045A57] py-10 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-teal-100 text-sm mb-6">Have questions? Need help finding your serial number?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => openModal('callback')}
              className="px-7 py-3.5 bg-white text-[#006569] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-teal-50 transition-all"
            >
              Request Callback
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
