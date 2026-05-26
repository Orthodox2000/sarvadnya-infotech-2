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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 max-w-2xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto border border-slate-100" onClick={e => e.stopPropagation()}>
        <button className="absolute top-6 right-6 text-slate-400 hover:text-[#0371a3] transition-colors" onClick={onClose}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-2xl relative overflow-hidden shadow-xl border border-slate-100 flex-shrink-0">
            <Image 
              src={service.image} 
              alt={service.title} 
              fill 
              className="object-cover"
            />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-[#dff0f5] text-[#0371a3] text-[9px] font-black uppercase tracking-widest border border-[#0371a3]/10 mb-2 inline-block">
              {service.tag}
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight tracking-tight">{service.title}</h3>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8">
          <p className="text-slate-600 leading-relaxed text-sm md:text-base italic font-medium">
            "{service.detailedDesc}"
          </p>
        </div>

        <div className="space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0371a3] flex items-center gap-2">
            <span className="h-px w-8 bg-[#0371a3]/20" />
            Core Deliverables
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {service.features.map((f: string, i: number) => (
              <li key={i} className="text-[12px] font-bold text-slate-700 flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-50 shadow-sm hover:border-[#0371a3]/20 transition-colors">
                <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="leading-tight">{f}</span>
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
            className="flex-1 py-4 bg-[#0371a3] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00ABE4] transition-all shadow-xl shadow-[#0371a3]/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            Request Priority Service
          </button>
          <button 
            className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 transition-all"
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
      image: "/trainning.png",
      color: "#0371a3",
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
      image: "/amc2.png",
      color: "#0371a3",
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
      image: "/ba.png",
      color: "#0371a3",
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
      image: "/tssgold.png",
      color: "#0371a3",
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
      image: "/TDLandCustom.jpg",
      color: "#0371a3",
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
      image: "/ba.png",
      color: "#0371a3",
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
      image: "/amc.png",
      color: "#0371a3",
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
      color: "#0371a3",
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
    <div className="min-h-screen bg-white text-slate-900">
      <ServiceDetailPopup 
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        service={selectedService}
        onEnquire={(title) => openModal('enquire', title)}
      />

      {/* Radiant Sky Hero Section */}
      <section className="bg-[#dff0f5] pt-12 pb-16 md:pt-20 md:pb-24 px-6 text-center relative overflow-hidden flex flex-col items-center">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'url(/bgggg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        <div className="max-w-4xl mx-auto relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 border border-[#0371a3]/10 text-[#0371a3] text-[9px] font-black uppercase tracking-widest mb-8 backdrop-blur-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#0371a3] animate-pulse"></span>
            Expert Partner Ecosystem
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            Support and <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] to-[#00ABE4]">Services</span>
          </h1>
          <p className="text-slate-600 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-semibold mb-12">
            Certified technical expertise to architect and support your TallyPrime environment for maximum business impact and seamless compliance.
          </p>

          {/* Global View Toggle */}
          <div className="flex justify-center">
            <div className="bg-white/50 p-1.5 rounded-2xl border border-white/80 backdrop-blur-md flex gap-1.5 shadow-sm">
              <button 
                onClick={() => setViewMode('simple')}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'simple' ? 'bg-[#0371a3] text-white shadow-xl shadow-[#0371a3]/20' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Simple
              </button>
              <button 
                onClick={() => setViewMode('detailed')}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'detailed' ? 'bg-[#0371a3] text-white shadow-xl shadow-[#0371a3]/20' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Detailed
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid with Conditional Card Styles */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportServices.map((s) => (
            viewMode === 'simple' ? (
              /* Simple Mode: Immersive Full Card Image */
              <div 
                key={s.title} 
                className="group relative rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col border border-slate-100 h-[320px] bg-slate-100"
              >
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={s.image} 
                    alt={s.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                </div>
                <div className="relative z-10 flex flex-col h-full p-6 text-white">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[8px] font-black uppercase tracking-widest w-fit mb-auto">
                    {s.tag}
                  </span>
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-base font-black text-white mb-2 leading-tight tracking-tight">{s.title}</h3>
                    <p className="text-white/80 text-[11px] font-medium leading-relaxed line-clamp-2 mb-6">{s.simpleDesc}</p>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {getServiceLink(s.title) ? (
                        <Link href={getServiceLink(s.title)!} className="flex-1 py-2 bg-white text-slate-900 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-[#0371a3] hover:text-white transition-all shadow-lg flex items-center justify-center">
                          Details
                        </Link>
                      ) : (
                        <button onClick={() => setSelectedService(s)} className="flex-1 py-2 bg-white text-slate-900 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-[#0371a3] hover:text-white transition-all shadow-lg">Details</button>
                      )}
                      <button onClick={() => openModal('enquire', s.title)} className="flex-1 py-2 bg-[#00ABE4] text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-[#0371a3] transition-all shadow-lg">Enquire</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Detailed Mode: Regular Long Card (White Background) */
              <div 
                key={s.title} 
                className="group relative bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full min-h-[460px]"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl relative overflow-hidden shadow-lg border border-slate-50 transition-transform duration-500 group-hover:scale-110">
                    <Image 
                      src={s.image} 
                      alt={s.title} 
                      fill 
                      className="object-cover" 
                      sizes="48px"
                    />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-50 text-[#0371a3] text-[8px] font-black uppercase tracking-widest border border-slate-100">
                    {s.tag}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-[#0371a3] transition-colors leading-tight tracking-tight">{s.title}</h3>
                <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-[#0371a3] mb-6">
                  <p className="text-slate-600 text-[11px] font-semibold leading-relaxed italic">
                    "{s.detailedDesc}"
                  </p>
                </div>
                <div className="space-y-4 mb-8">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0371a3]">Technical Scope</p>
                  <ul className="space-y-2.5">
                    {s.features.map((f, i) => (
                      <li key={i} className="text-[11px] font-bold text-slate-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto pt-6 border-t border-slate-50 flex gap-3">
                  {getServiceLink(s.title) && (
                    <Link href={getServiceLink(s.title)!} className="flex-1 py-3 bg-[#dff0f5] text-[#0371a3] rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-[#ccebf5] transition-all shadow-sm flex items-center justify-center">
                      Full Details
                    </Link>
                  )}
                  <button onClick={() => openModal('enquire', s.title)} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-[#0371a3] transition-all shadow-md">
                    Enquire Now
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      </section>

      {/* Professional Brand Footer Banner */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto rounded-[3.5rem] p-12 bg-slate-900 text-white text-center relative overflow-hidden shadow-2xl">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0371a3]/20 rounded-full blur-[100px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00ABE4]/10 rounded-full blur-[100px] -ml-48 -mb-48" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-12 tracking-tight">Verified Expertise. <span className="text-[#00ABE4]">Guaranteed Results.</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12 border-t border-white/10 pt-12">
              {[
                { val: "15+", label: "Years Exp." },
                { val: "2000+", label: "Clients" },
                { val: "15min", label: "Response" },
                { val: "100%", label: "Certified" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-4xl font-black text-white mb-2">{stat.val}</div>
                  <div className="text-[10px] font-black text-sky-400 uppercase tracking-[0.3em]">{stat.label}</div>
                </div>
              ))}
            </div>
            <button 
               onClick={() => openModal('general')}
               className="px-12 py-5 bg-[#00ABE4] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-[#00ABE4]/20"
            >
               Talk to our Technical Team
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
