'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer';
import UnifiedContactModal, { FormType } from '../components/UnifiedContactModal';

interface ServicePopupProps {
  isOpen: boolean;
  onClose: () => void;
  service: any | null;
  onEnquire: (title: string) => void;
}

const ServiceDetailPopup = ({ isOpen, onClose, service, onEnquire }: ServicePopupProps) => {
  if (!isOpen || !service) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 md:p-10 max-w-2xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors" onClick={onClose}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl relative overflow-hidden shadow-inner border border-slate-100">
            <Image 
              src={service.image} 
              alt={service.title} 
              fill 
              className="object-cover"
            />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[8px] font-black uppercase tracking-wider border border-slate-100 mb-1 inline-block">
              {service.tag}
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-[#0f0529] leading-tight">{service.title}</h3>
          </div>
        </div>

        <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-8 pb-6 border-b border-slate-100 italic">
          "{service.detailedDesc}"
        </p>

        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#7338a0] flex items-center gap-2">
            <span className="h-0.5 w-6 bg-[#7338a0]/20" />
            Core Deliverables
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {service.features.map((f: string, i: number) => (
              <li key={i} className="text-[12px] font-bold text-slate-700 flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="leading-snug">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => {
              onEnquire(service.title);
              onClose();
            }}
            className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#7338a0] transition-all shadow-lg"
          >
            Request Priority Service
          </button>
          <button 
            className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
            onClick={onClose}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ServicesPage() {
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean; type: FormType; service: string}>({
    isOpen: false,
    type: 'general',
    service: ''
  });

  const openModal = (type: FormType, service: string = '') => {
    setModalConfig({ isOpen: true, type, service });
  };

  const supportServices = [
    {
      title: "Corporate Training",
      simpleDesc: "Master-level TallyPrime skills for your workforce.",
      detailedDesc: "Strategic training programs covering advanced statutory features, audit trails, and management reporting to maximize productivity.",
      features: [
        "GST/TDS Statutory mastery",
        "Advanced MIS Reporting",
        "Audit Trail implementation",
        "Automated BRS workflows",
        "Multi-company management",
        "Security configuration"
      ],
      image: "/assets/images/1524178232363-1fb2b075b655.jpg",
      color: "#6366f1",
      tag: "Training"
    },
    {
      title: "System Design",
      simpleDesc: "Architecting Tally for peak business performance.",
      detailedDesc: "Complete audit and architecture of your Tally environment to optimize data flow, enhance security, and ensure scalability.",
      features: [
        "Process flow mapping",
        "COA structural design",
        "Inventory flow mapping",
        "Data security strategy",
        "User role definition",
        "Voucher numbering setup"
      ],
      image: "/assets/images/1504384308090-c894fdcc538d.jpg",
      color: "#8b5cf6",
      tag: "Design"
    },
    {
      title: "Data Integration",
      simpleDesc: "Seamless connectivity with CRM, ERP & E-commerce.",
      detailedDesc: "Break data silos with bidirectional sync between Tally and your custom apps using advanced API and XML techniques.",
      features: [
        "Real-time API sync",
        "Excel bulk migration",
        "CRM & Marketplace sync",
        "Database bridge development",
        "Automated data scheduling",
        "Error validation logic"
      ],
      image: "/assets/images/1451187580459-43490279c0fa.jpg",
      color: "#06b6d4",
      tag: "Integration"
    },
    {
      title: "TSS Renewal",
      simpleDesc: "Latest statutory & product updates.",
      detailedDesc: "Keep your Tally always up-to-date with the latest statutory changes, product enhancements, and remote access features.",
      features: [
        "Latest Statutory Updates (GST/TDS)",
        "Remote Access via Browser/Mobile",
        "Data Synchronization",
        "Bank Reconciliation (Auto)",
        "Latest Product Releases",
        "Tally.NET Services"
      ],
      image: "/assets/images/1552664730-d307ca884978.jpg",
      color: "#f59e0b",
      tag: "Renewal",
      link: "/services/tss"
    },
    {
      title: "TDL Customization",
      simpleDesc: "Bespoke modules tailored to your unique logic.",
      detailedDesc: "Development of custom TDL modules, invoice formats, and specialized reports integrated directly into Tally.",
      features: [
        "Industry module design",
        "Customized Invoices",
        "Field-level validations",
        "Analytical reports",
        "Digital Signatures",
        "Email/SMS automation"
      ],
      image: "/assets/images/1461749280684-dccba630e2f6.jpg",
      color: "#10b981",
      tag: "TDL"
    },
    {
      title: "Tally on Mobile",
      simpleDesc: "Real-time decision making at your fingertips.",
      detailedDesc: "Secure mobile solutions to view outstandings, sales reports, and inventory status directly on your smartphone.",
      features: [
        "Live Sales Dashboards",
        "WhatsApp sharing",
        "Ageing & Alert sync",
        "End-to-end encryption",
        "Customer info on the go",
        "Stock status tracking"
      ],
      image: "/assets/images/1512941937669-90a1b58e7e9c.jpg",
      color: "#f43f5e",
      tag: "Mobile"
    },
    {
      title: "AMC Services",
      simpleDesc: "Priority technical support with zero downtime.",
      detailedDesc: "Your safety net for troubleshooting, data recovery, and regular health checkups to ensure business continuity.",
      features: [
        "15-min response SLA",
        "Priority troubleshooting",
        "System health audits",
        "Data recovery experts",
        "Unlimited remote support",
        "Quarterly health checks"
      ],
      image: "/assets/images/1581091226825-a6a2a5aee158.jpg",
      color: "#4f46e5",
      tag: "Support",
      link: "/services/amc"
    },
    {
      title: "Tally on WhatsApp",
      simpleDesc: "Automated document sharing via WhatsApp.",
      detailedDesc: "Integrate Tally with WhatsApp to send invoices, reminders, and reports instantly to your customers.",
      features: [
        "Automated PDF Sharing",
        "Payment Reminders",
        "Ledger Queries",
        "Bulk Marketing",
        "24/7 Availability",
        "Secure Integration"
      ],
      image: "/tally2whatsapp.png",
      color: "#25d366",
      tag: "WhatsApp",
      link: "/services/tally-on-whatsapp"
    }
  ];

  const getServiceLink = (title: string) => {
    switch (title) {
      case "TSS Renewal": return "/services/tss";
      case "AMC Services": return "/services/amc";
      case "Corporate Training": return "/services/corporate-training";
      case "TDL Customization": return "/services/tdl";
      case "Tally on Mobile": return "/services/mobile-app-biz";
      case "Tally on WhatsApp": return "/services/tally-on-whatsapp";
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900">
      <ServiceDetailPopup 
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        service={selectedService}
        onEnquire={(title) => openModal('enquire', title)}
      />

      {/* Centered Tighter Hero Section */}
      <section className="bg-[#0f0529] pt-8 pb-8 md:pt-12 md:pb-12 px-6 text-center relative overflow-hidden flex flex-col items-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-500 blur-[100px]" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[9px] font-bold uppercase tracking-widest mb-6">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#7338a0]"></span>
            Expert Partner Ecosystem
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
            Support and Services
          </h1>
          <p className="text-white/40 text-[10px] md:text-sm max-w-xl mx-auto leading-relaxed font-medium mb-10">
            Certified technical expertise to architect and support your TallyPrime environment for maximum business impact.
          </p>

          {/* Global View Toggle */}
          <div className="flex justify-center">
            <div className="bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md flex gap-1">
              <button 
                onClick={() => setViewMode('simple')}
                className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'simple' ? 'bg-[#7338a0] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                Simple
              </button>
              <button 
                onClick={() => setViewMode('detailed')}
                className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'detailed' ? 'bg-[#7338a0] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                Detailed
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid with Conditional Card Styles */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportServices.map((s) => (
            viewMode === 'simple' ? (
              /* Simple Mode: Immersive Full Card Image */
              <div 
                key={s.title} 
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 flex flex-col border border-white/10 h-[280px]"
              >
                <div className="absolute inset-0 z-0">
                  <Image src={s.image} alt={s.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-500" />
                </div>
                <div className="relative z-10 flex flex-col h-full p-5 text-white">
                  <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white/60 text-[7px] font-black uppercase tracking-wider w-fit mb-auto">
                    {s.tag}
                  </span>
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-sm font-black text-white mb-1 leading-tight">{s.title}</h3>
                    <p className="text-white/70 text-[10px] font-medium leading-relaxed line-clamp-2 mb-4">{s.simpleDesc}</p>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {getServiceLink(s.title) ? (
                        <Link href={getServiceLink(s.title)!} className="flex-1 py-1.5 bg-white text-black rounded-lg font-bold text-[8px] uppercase tracking-wider hover:bg-indigo-400 hover:text-white transition-all shadow-lg flex items-center justify-center">
                          Details
                        </Link>
                      ) : (
                        <button onClick={() => setSelectedService(s)} className="flex-1 py-1.5 bg-white text-black rounded-lg font-bold text-[8px] uppercase tracking-wider hover:bg-indigo-400 hover:text-white transition-all shadow-lg">Details</button>
                      )}
                      <button onClick={() => openModal('enquire', s.title)} className="flex-1 py-1.5 bg-[#7338a0] text-white rounded-lg font-bold text-[8px] uppercase tracking-wider hover:bg-indigo-600 transition-all shadow-lg">Enquire</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Detailed Mode: Regular Long Card (White Background) */
              <div 
                key={s.title} 
                className="group relative bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full min-h-[420px]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl relative overflow-hidden shadow-inner border border-slate-100 transition-transform duration-500 group-hover:scale-110">
                    <Image src={s.image} alt={s.title} fill className="object-cover" />
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[7px] font-black uppercase tracking-wider border border-slate-100">
                    {s.tag}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 mb-2 group-hover:text-[#7338a0] transition-colors leading-tight">{s.title}</h3>
                <p className="text-slate-500 text-[10px] font-medium leading-relaxed mb-6 border-l-2 pl-3 border-slate-100 italic">
                  "{s.detailedDesc}"
                </p>
                <div className="space-y-4 mb-6">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#7338a0]">Technical Scope</p>
                  <ul className="space-y-2">
                    {s.features.map((f, i) => (
                      <li key={i} className="text-[10px] font-bold text-slate-700 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-50 flex gap-2">
                  {getServiceLink(s.title) && (
                    <Link href={getServiceLink(s.title)!} className="flex-1 py-2 bg-indigo-50 text-[#7338a0] rounded-lg font-bold text-[8px] uppercase tracking-wider hover:bg-indigo-100 transition-all shadow-sm flex items-center justify-center">
                      Full Details
                    </Link>
                  )}
                  <button onClick={() => openModal('enquire', s.title)} className="flex-1 py-2 bg-slate-900 text-white rounded-lg font-bold text-[8px] uppercase tracking-wider hover:bg-[#7338a0] transition-all shadow-md">
                    Enquire Now
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      </section>

      {/* Compact Stats Banner */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 bg-[#0f0529] text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#7338a0] rounded-full blur-[100px] opacity-10 -mr-32 -mt-32" />
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { val: "15+", label: "Years Exp." },
              { val: "2000+", label: "Clients" },
              { val: "15min", label: "Response" },
              { val: "100%", label: "Certified" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-xl md:text-3xl font-black text-white mb-0.5">{stat.val}</div>
                <div className="text-[10px] font-bold text-indigo-400/50 uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
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
