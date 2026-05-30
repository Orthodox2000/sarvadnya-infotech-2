'use client';

import { useState, useEffect } from 'react';
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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !service) return null;
  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 max-w-2xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto border border-slate-100" onClick={e => e.stopPropagation()}>
        <button className="absolute top-6 right-6 text-slate-400 hover:text-[#0371a3] transition-colors" onClick={onClose}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="flex items-center gap-5 mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${service.iconBg} text-white shadow-xl`}>
             {service.icon}
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-slate-50 text-[#0371a3] text-[9px] font-black uppercase tracking-widest border border-slate-100 mb-2 inline-block">
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
            className="flex-1 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black border border-transparent hover:border-black transition-all duration-500 shadow-xl"
          >
            Request Priority Service
          </button>
          <button 
            className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 transition-all duration-500"
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
      features: ["GST/TDS Statutory mastery", "Advanced MIS Reporting", "Audit Trail implementation", "Automated BRS workflows", "Multi-company management", "Security configuration"],
      tag: "Training",
      iconBg: "bg-[#0371a3]",
      link: "/services/corporate-training",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: "Data Integration",
      simpleDesc: "Seamless connectivity with CRM, ERP & E-commerce.",
      detailedDesc: "Break data silos with bidirectional sync between Tally and your custom apps using advanced API and XML techniques.",
      features: ["Real-time API sync", "Excel bulk migration", "CRM & Marketplace sync", "Database bridge development", "Automated data scheduling", "Error validation logic"],
      tag: "Integration",
      iconBg: "bg-[#00ABE4]",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      title: "TSS Renewal",
      simpleDesc: "Latest statutory & product updates.",
      detailedDesc: "Keep your Tally always up-to-date with the latest statutory changes, product enhancements, and remote access features.",
      features: ["Latest Statutory Updates", "Remote Access via Browser", "Data Synchronization", "Bank Reconciliation (Auto)", "Latest Product Releases", "Tally.NET Services"],
      tag: "Renewal",
      iconBg: "bg-[#131921]",
      link: "/services/tss",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      title: "TDL Customization",
      simpleDesc: "Bespoke modules tailored to your unique logic.",
      detailedDesc: "Development of custom TDL modules, invoice formats, and specialized reports integrated directly into Tally.",
      features: ["Industry module design", "Customized Invoices", "Field-level validations", "Analytical reports", "Digital Signatures", "Email/SMS automation"],
      tag: "TDL",
      iconBg: "bg-[#0371a3]",
      link: "/services/tdl",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a2 2 0 002 2h1a2 2 0 110 4h-1a2 2 0 00-2 2v1a2 2 0 11-4 0V4z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Tally on Mobile",
      simpleDesc: "Real-time decision making at your fingertips.",
      detailedDesc: "Secure mobile solutions to view outstandings, sales reports, and inventory status directly on your smartphone.",
      features: ["Live Sales Dashboards", "WhatsApp sharing", "Ageing & Alert sync", "End-to-end encryption", "Customer info on the go", "Stock status tracking"],
      tag: "Mobile",
      iconBg: "bg-[#00ABE4]",
      link: "/services/mobile-app-biz",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "AMC Services",
      simpleDesc: "Priority technical support with zero downtime.",
      detailedDesc: "Your safety net for troubleshooting, data recovery, and regular health checkups to ensure business continuity.",
      features: ["15-min response SLA", "Priority troubleshooting", "System health audits", "Data recovery experts", "Unlimited remote support", "Quarterly health checks"],
      tag: "Support",
      iconBg: "bg-[#131921]",
      link: "/services/amc",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Tally on WhatsApp",
      simpleDesc: "Automated document sharing via WhatsApp.",
      detailedDesc: "Integrate Tally with WhatsApp to send invoices, reminders, and reports instantly to your customers.",
      features: ["Automated PDF Sharing", "Payment Reminders", "Ledger Queries", "Bulk Marketing", "24/7 Availability", "Secure Integration"],
      tag: "WhatsApp",
      iconBg: "bg-[#25D366]",
      link: "/services/tally-on-whatsapp",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <ServiceDetailPopup 
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        service={selectedService}
        onEnquire={(title) => openModal('enquire', title)}
      />

      {/* Clean Header Section */}
      <section className="bg-white pt-12 pb-16 md:pt-20 md:pb-24 px-6 text-center relative overflow-hidden flex flex-col items-center">
        <div className="max-w-4xl mx-auto relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 border border-[#0371a3]/10 text-[#0371a3] text-[9px] font-black uppercase tracking-widest mb-8 backdrop-blur-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#0371a3] animate-pulse"></span>
            Professional Support Directory
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            Expert Tally <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] to-[#00ABE4]">Services</span>
          </h1>
          <p className="text-slate-600 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-semibold mb-0">
            Certified technical expertise to architect and support your TallyPrime environment for maximum business impact and seamless compliance.
          </p>
        </div>
      </section>

      {/* Icon-Driven Service Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportServices.map((s) => (
            <div 
              key={s.title} 
              className="group relative bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-[#0371a3]/10 transition-all duration-500 flex flex-col h-full hover:-translate-y-2"
            >
              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${s.iconBg} text-white mb-8 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                {s.icon}
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#0371a3] block mb-3 opacity-60">
                  {s.tag}
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-[#0371a3] transition-colors leading-tight">
                  {s.title}
                </h3>
                <p className="text-[13px] text-slate-500 font-bold leading-relaxed opacity-70 mb-8">
                  {s.simpleDesc}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                 <button 
                  onClick={() => setSelectedService(s)}
                  className="w-full py-3.5 bg-slate-50 text-[#0371a3] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0371a3] hover:text-white transition-all duration-500 flex items-center justify-center gap-2"
                >
                  View Details
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
                <button 
                  onClick={() => openModal('enquire', s.title)}
                  className="w-full py-3.5 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black border border-transparent hover:border-black transition-all duration-500 shadow-sm"
                >
                  Enquire Now
                </button>
              </div>

              {/* Decorative Subtle Background Glow */}
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#E9F1FA] rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto rounded-[3.5rem] p-12 bg-slate-900 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0371a3]/20 rounded-full blur-[100px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00ABE4]/10 rounded-full blur-[100px] -ml-48 -mb-48" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tight">Need a <span className="text-[#00ABE4]">Custom Solution?</span></h2>
            <p className="text-slate-400 font-bold mb-12 max-w-2xl mx-auto leading-relaxed">
              Our technical architects are ready to design a personalized TallyPrime environment tailored to your specific industry requirements.
            </p>
            <button 
               onClick={() => openModal('general')}
               className="px-12 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00ABE4] hover:text-white transition-all duration-500 shadow-xl"
            >
               Request Professional Consultation
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
