'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import UnifiedContactModal, { FormType } from '../../components/UnifiedContactModal';

const features = [
  { title: "GST Compliance", desc: "Automated e-invoicing and GST return filing." },
  { title: "Inventory Management", desc: "Real-time stock tracking and valuation." },
  { title: "Financial Reporting", desc: "Instant insights into business performance." },
  { title: "Security Protocols", desc: "Advanced data encryption and backup." },
  { title: "Easy Scalability", desc: "Smooth transition to Gold/Server tiers." },
  { title: "Cloud Integration", desc: "Seamless TallyDrive backup capabilities." },
];

export default function TallySilverPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<FormType>('quote');

  const openModal = (type: FormType) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const ctaGroups = [
    { 
      title: "Sales & Demo", 
      btns: [
        { label: "Get Price", type: 'quote' as FormType },
        { label: "Get Expert Consultation", type: 'callback' as FormType },
        { label: "Request Demo", type: 'demo' as FormType },
        { label: "Contact Sales", type: 'enquire' as FormType }
      ] 
    },
    { 
      title: "Plans & Comparison", 
      btns: [
        { label: "Features List", href: "/products" },
        { label: "Pricing Plans", href: "/products" },
        { label: "Compare Editions", href: "/products" },
        { label: "Add-on Apps", href: "/modules" }
      ] 
    },
    { 
      title: "Technical Support", 
      btns: [
        { label: "Technical Support", type: 'support' as FormType },
        { label: "Maintenance Plan", href: "/services/amc" },
        { label: "Data Migration", href: "/services/tdl" },
        { label: "Security Info", href: "/cloud" }
      ] 
    },
    { 
      title: "Resources & Learning", 
      btns: [
        { label: "Download Trial", type: 'demo' as FormType },
        { label: "User Guide", href: "/tutorials" },
        { label: "Video Tutorials", href: "/tutorials" },
        { label: "FAQs", href: "/search" },
        { label: "Training", href: "/services/corporate-training" }
      ] 
    }
  ];

  return (
    <div className="min-h-screen bg-[#f3fafc] text-slate-900 font-sans">
      {/* Cinematic Hero */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#0371a3] to-[#00ABE4] text-white p-6 text-center">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
        <div className="relative z-10 max-w-4xl animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">TallyPrime Silver</h1>
          <p className="text-xl md:text-2xl font-light mb-10 opacity-90">The Premier Choice for Small Business Automation and Reliability.</p>
          <button onClick={() => openModal('quote')} className="px-10 py-4 bg-white text-[#0371a3] rounded-full font-black text-lg uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
            Enquire Now
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {/* Why Choose Section */}
        <section>
          <h2 className="text-4xl font-black text-center mb-12">Why Choose Our TallyPrime Silver?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#f3fafc] rounded-2xl mb-6 flex items-center justify-center text-[#0371a3] font-bold">Icon</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits & Use Cases Split */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-6">Benefits & Use Cases</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">TallyPrime Silver offers a robust set of tools tailored for sole proprietors and small retailers, ensuring streamlined operations and regulatory compliance.</p>
            <ul className="space-y-4 text-slate-700">
              <li className="flex items-center gap-3">✓ <span>Automated GST filing</span></li>
              <li className="flex items-center gap-3">✓ <span>Simplified Inventory tracking</span></li>
              <li className="flex items-center gap-3">✓ <span>Enhanced security & data control</span></li>
            </ul>
          </div>
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-2xl font-black mb-4">Core Capabilities</h3>
            <p className="text-slate-600 leading-relaxed italic">"Designed specifically for the unique needs of dynamic small businesses seeking reliable infrastructure."</p>
          </div>
        </section>

        {/* Target Audience & Use Cases Section */}
        <section className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
          <h2 className="text-3xl font-black mb-8">Target Audience & Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Target Audience</h4>
              <p className="text-slate-600">Sole Proprietors, Small Retailers, Freelancers, Startups.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Use Cases</h4>
              <p className="text-slate-600">Basic bookkeeping, local GST filing, single-user inventory, simple financial oversight.</p>
            </div>
          </div>
        </section>

        {/* Detailed Description */}
        <section className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
          <h2 className="text-4xl font-black mb-8">Detailed Capabilities</h2>
          <p className="text-slate-600 leading-relaxed text-lg mb-6">TallyPrime Silver serves as the backbone for businesses requiring precise financial monitoring. With its user-friendly interface, it allows for quick entry of vouchers, real-time generation of financial reports, and robust stock management. It simplifies compliance by keeping your books GST-ready at all times.</p>
          <p className="text-slate-600 leading-relaxed text-lg">Beyond standard accounting, TallyPrime Silver supports multi-currency, flexible invoicing, and deep integration with cloud backup solutions to guarantee that your business data remains secure and accessible.</p>
        </section>

        {/* CTA Sections */}
        <section className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
          <h2 className="text-3xl font-black mb-10">How can we help?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ctaGroups.map((group, i) => (
              <div key={i} className="space-y-4">
                <h4 className="font-bold text-slate-900">{group.title}</h4>
                <div className="flex flex-col gap-2">
                  {group.btns.map(btn => (
                    'type' in btn ? (
                        <button key={btn.label} onClick={() => openModal(btn.type as FormType)} className="text-left text-sm text-slate-600 hover:text-[#0371a3] transition-colors py-1">
                            {btn.label} →
                        </button>
                    ) : (
                        <Link key={btn.label} href={btn.href!} className="text-left text-sm text-slate-600 hover:text-[#0371a3] transition-colors py-1">
                          {btn.label} →
                        </Link>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
      
      <UnifiedContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type={modalType} 
      />
    </div>
  );
}
