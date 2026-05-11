'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '../components/Footer';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const DescriptionPopup = ({ isOpen, onClose, title, content }: PopupProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-900" onClick={onClose}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h3 className="text-2xl font-bold mb-4 text-[#0f0529]">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm">{content}</p>
        <button className="mt-8 w-full py-3 bg-[#7338a0] text-white rounded-xl font-bold" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default function ProductsPage() {
  const [activePopup, setActivePopup] = useState<{title: string, content: string} | null>(null);

  const products = [
    {
      name: "TallyPrime Silver",
      type: "Essential",
      price: "Single User",
      features: ["v7.0 Core Engine", "Standalone PC Access", "GST Ready", "E-Invoicing", "Inventory Mgmt"],
      color: "#6366f1",
      borderWeight: "border",
      details: "Perfect for sole proprietors and small businesses, TallyPrime Silver offers complete accounting, inventory, and compliance management on a single computer. Includes seamless e-invoicing and auto-GST reconciliation features."
    },
    {
      name: "TallyPrime Gold",
      type: "Professional",
      price: "Multi-User",
      features: ["v7.0 Core Engine", "Unlimited LAN Users", "Remote Access", "Consolidated Reports", "Multi-Currency"],
      color: "#7338a0",
      popular: true,
      borderWeight: "border-4",
      details: "The industry standard for growing businesses. Allows unlimited users on a local network (LAN) and concurrent access to data. Gold edition provides advanced reporting, multi-currency support, and remote data access via browser."
    },
    {
      name: "TallyPrime Server",
      type: "Enterprise",
      price: "Large Business",
      features: ["v7.0 Core Engine", "High Speed Concurrency", "Zero Waiting Time", "Secure Data Vault", "Admin Control"],
      color: "#ec4899",
      borderWeight: "border",
      details: "Enterprise-class product that provides high data concurrency and security. It eliminates data access bottlenecks for multiple users and offers administrative control for data security and monitoring."
    }
  ];

  const cloudProducts = [
    {
      name: "Tally on AWS",
      type: "Official Cloud",
      price: "Official Tally & AWS",
      features: ["Highest Data Security", "AWS Global Infrastructure", "Automatic Backups", "24/7 Remote Access", "Scalable Storage"],
      color: "#FF9900",
      borderWeight: "border",
      details: "The official collaboration between Tally Solutions and Amazon Web Services. Provides an incredibly secure environment with managed infrastructure, ensuring your Tally is always available with the reliability of AWS."
    },
    {
      name: "Tally on Windows",
      type: "Native Experience",
      price: "Dedicated VM",
      features: ["Native Desktop Feel", "Direct Printer Access", "MS Office Integration", "Full Admin Control", "Custom VM Specs"],
      color: "#0078D4",
      borderWeight: "border",
      details: "Host Tally on a dedicated Windows Virtual Machine. Ideal for businesses that require full integration with other Windows applications and a familiar desktop interface accessible via RDP from anywhere."
    },
    {
      name: "Hybrid Tally Cloud",
      type: "Flexible Mode",
      price: "Local + Remote",
      features: ["Offline Work Mode", "Real-time Syncing", "Secure Data Mirroring", "Low Internet Usage", "Disaster Recovery"],
      color: "#10b981",
      borderWeight: "border",
      details: "Get the speed of local Tally with the accessibility of the cloud. Your data stays on your local server but is mirrored to a secure cloud instance for remote access and real-time offsite backup."
    }
  ];

  const verticalModules = [
    { title: "C&F Agencies", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800", details: "Manage container tracking, agent commissions, and shipping documentation directly within Tally. Optimized for the complex billing cycles of C&F agents.", gridSpan: "md:col-span-2 md:row-span-1" },
    { title: "Transport", image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800", details: "Monitor fuel expenses, trip sheets, and vehicle maintenance schedules. Includes automated driver commission and trip-wise P&L reporting.", gridSpan: "md:col-span-1 md:row-span-2" },
    { title: "Garments", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800", details: "Advanced inventory management allowing you to track stock by size, color, and fabric types. Perfect for retail and wholesale garment traders.", gridSpan: "md:col-span-1 md:row-span-1" },
    { title: "Societies", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", details: "Automated maintenance bill generation for co-operative housing societies. Includes receipt tracking, penalty calculation, and audit reports.", gridSpan: "md:col-span-1 md:row-span-1" },
    { title: "Sales & Commission", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800", details: "Define multi-level commission rules based on product categories, sales volume, or payment realization dates. Automate complex payout calculations.", gridSpan: "md:col-span-2 md:row-span-1" },
    { title: "Excel to Tally", image: "https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80&w=800", details: "Seamlessly import thousands of masters, ledgers, and vouchers from any Excel sheet to TallyPrime without data errors.", gridSpan: "md:col-span-1 md:row-span-1" },
    { title: "Business Boosters", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", details: "A collection of productivity-enhancing modules designed to bridge functional gaps and streamline your daily accounting operations.", gridSpan: "md:col-span-1 md:row-span-1" }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <DescriptionPopup 
        isOpen={!!activePopup} 
        onClose={() => setActivePopup(null)} 
        title={activePopup?.title || ""} 
        content={activePopup?.content || ""} 
      />

      {/* 1. TallyPrime Editions */}
      <section id="compare" className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-4 border border-blue-100">
            All editions upgraded to Tally 7.0
          </div>
          <h1 className="text-4xl font-black mb-4 text-[#0f0529]">TallyPrime Editions</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm">
            Discover the power of the new **v7.0 core engine**. Scalable accounting for every stage of your business growth.
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 gap-1.5 md:gap-8 items-stretch py-4 md:py-8">
          {products.map((p) => (
            <div key={p.name} 
                 className={`relative p-2 md:p-8 rounded-xl md:rounded-3xl transition-all duration-300 flex flex-col ${p.borderWeight === 'border-4' ? 'border-2 md:border-4' : 'border'} ${p.popular ? 'border-[#7338a0] bg-slate-50/80 shadow-2xl md:scale-105 z-10' : 'border-slate-200 bg-white shadow-sm'} hover:shadow-xl`}>
              {p.popular && (
                <div className="absolute -top-2 md:-top-4 left-1/2 -translate-x-1/2 bg-[#7338a0] text-white text-[6px] md:text-[10px] font-black px-1.5 md:px-4 py-0.5 md:py-1.5 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap">Most Popular</div>
              )}
              <div className="mb-2 md:mb-8">
                <p className="text-[6px] md:text-xs font-bold uppercase tracking-widest mb-1" style={{ color: p.color }}>{p.type}</p>
                <h3 className="text-[9px] md:text-2xl font-bold mb-0.5 leading-tight">{p.name}</h3>
                <button onClick={() => setActivePopup({title: p.name, content: p.details})} className="text-[5px] md:text-[10px] font-bold text-[#7338a0] hover:underline">Full Details →</button>
              </div>
              <ul className="space-y-1 md:space-y-4 mb-3 md:mb-10 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-0.5 md:gap-3 text-[7px] md:text-sm text-slate-600 leading-tight">
                    <svg className="w-1.5 h-1.5 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-1.5 md:py-4 rounded-lg md:rounded-xl font-bold transition-all text-[7px] md:text-sm ${p.popular ? 'bg-[#7338a0] text-white shadow-md' : 'border border-slate-200 hover:bg-slate-50'}`}>Request Quote</button>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Specialized Custom Modules */}
      <section id="modules" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4 text-[#0f0529]">Specialized Custom Modules</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm">
              Industry-specific logic built directly into your Tally and Cloud environment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px] md:auto-rows-[220px]">
            {verticalModules.map((m) => (
              <div 
                key={m.title} 
                className={`relative group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-default ${m.gridSpan}`}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${m.image})` }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
                
                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col h-full justify-end p-6">
                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <h4 className="font-bold text-xl text-white mb-2">{m.title}</h4>
                    <p className="text-[11px] md:text-[12px] text-white/0 group-hover:text-white/90 leading-relaxed transition-all duration-500 delay-100 line-clamp-3">
                      {m.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Cloud Managed Services */}
      <section id="cloud" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4 text-[#0f0529]">Cloud Managed Services</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm">
            Experience Tally solutions with official AWS infrastructure and professional Windows cloud management.
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-8 items-stretch">
          {cloudProducts.map((p) => (
            <div key={p.name} 
                 className={`relative p-2.5 md:p-8 rounded-xl md:rounded-3xl transition-all duration-300 flex flex-col border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:border-[#7338a0]/30`}>
              <div className="mb-3 md:mb-8">
                <p className="text-[7px] md:text-xs font-bold uppercase tracking-widest mb-1" style={{ color: p.color }}>{p.type}</p>
                <h3 className="text-[10px] md:text-2xl font-bold mb-0.5 leading-tight">{p.name}</h3>
                <button onClick={() => setActivePopup({title: p.name, content: p.details})} className="text-[6px] md:text-[10px] font-bold text-slate-400 hover:text-[#7338a0] hover:underline whitespace-nowrap">Learn More →</button>
              </div>
              <ul className="space-y-1.5 md:space-y-4 mb-4 md:mb-10 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-1 md:gap-3 text-[8px] md:text-sm text-slate-600 leading-tight">
                    <svg className="w-2 h-2 md:w-5 md:h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2 md:py-4 rounded-lg md:rounded-xl font-bold transition-all text-[8px] md:text-sm border border-slate-200 hover:bg-[#7338a0] hover:text-white hover:border-[#7338a0]`}>Get Started</button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Upgrade & Migration Assistance */}
      <section className="py-20 px-6 bg-[#0f0529] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Expert Upgrade & Migration Assistance</h2>
          <p className="text-white/70 mb-10 text-sm leading-relaxed">
            Planning to upgrade to **TallyPrime 7.0** or renew your **TSS (Tally Software Service)**? 
            Our certified experts provide end-to-end assistance in data migration, ensuring zero data loss and 
            seamless transition from older versions like Tally.ERP 9.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl mb-2">🔄</div>
              <h4 className="font-bold text-sm mb-1">TSS Renewal</h4>
              <p className="text-[10px] text-white/40">Latest Statutory & Features</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl mb-2">🚚</div>
              <h4 className="font-bold text-sm mb-1">Data Migration</h4>
              <p className="text-[10px] text-white/40">From ERP 9 to Prime 7.0</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl mb-2">🛡️</div>
              <h4 className="font-bold text-sm mb-1">Backup Solutions</h4>
              <p className="text-[10px] text-white/40">Secure Offsite Mirroring</p>
            </div>
          </div>
          <button className="mt-12 px-10 py-4 bg-emerald-500 text-white rounded-full font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
            Talk to Migration Expert
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
