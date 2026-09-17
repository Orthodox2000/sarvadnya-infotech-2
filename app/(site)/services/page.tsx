'use client';

import { useState, useEffect } from 'react';
import Footer from "../../components/Footer";
import UnifiedContactModal, { FormType } from "../../components/UnifiedContactModal";
import TssRenewalForm from "../../components/TssRenewalForm";

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
      <div className="bg-[linear-gradient(135deg,rgba(249,251,245,0.98)_0%,rgba(244,242,234,0.98)_53%,rgba(238,236,223,0.98)_100%)] rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto border border-[#E5E2D9]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-6 right-6 text-slate-400 hover:text-[#006569] transition-colors" onClick={onClose}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="flex items-center gap-5 mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${service.iconBg} text-white shadow-lg`}>
             {service.icon}
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 block mb-1.5">
              {service.tag}
            </span>
            <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 leading-tight tracking-tight">{service.title}</h3>
          </div>
        </div>

        <div className="bg-white/70 p-6 rounded-2xl border border-[#006569]/10 mb-8">
          <p className="text-slate-600 leading-relaxed text-sm md:text-base font-normal">
            "{service.detailedDesc}"
          </p>
        </div>

        <div className="space-y-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#006569] flex items-center gap-2">
            <span className="h-px w-6 bg-[#006569]/20" />
            Core Deliverables
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {service.features.map((f: string, i: number) => (
              <li key={i} className="text-[13px] font-normal text-slate-600 flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-100">
                <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="leading-snug">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {service.title === 'TSS Renewal' && (
          <div className="mt-6">
            <TssRenewalForm variant="compact" source="services-page" />
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => {
              onEnquire(service.title);
              onClose();
            }}
            className="flex-1 py-4 bg-[#006569] text-white rounded-xl font-semibold text-sm hover:bg-[#045A57] transition-all duration-300 shadow-lg shadow-[#006569]/10"
          >
            Request Priority Service
          </button>
          <button 
            className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-xl font-semibold text-sm hover:bg-slate-50 hover:text-slate-900 transition-all duration-300"
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
      simpleDesc: "Advanced certification programs designed to transform your accounting staff into TallyPrime power users. We focus on statutory compliance and high-efficiency workflows.",
      detailedDesc: "Our Corporate Training is a strategic investment in your human capital. We move beyond basic entries to teach advanced statutory features, audit trails, and complex management reporting. The program includes hands-on workshops on multi-company management and security configurations, ensuring your team can maximize TallyPrime's potential to drive business growth.",
      features: ["GST/TDS Statutory mastery", "Advanced MIS Reporting", "Audit Trail implementation", "Automated BRS workflows", "Multi-company management", "Security configuration"],
      tag: "Training",
      iconBg: "bg-[#006569]",
      link: "/services/corporate-training",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: "Data Integration",
      simpleDesc: "Eliminate manual data entry with bidirectional sync between Tally and your CRM, ERP, or E-commerce platforms using secure API bridges.",
      detailedDesc: "Break down data silos across your organization. We architect custom integration layers that allow real-time data flow between TallyPrime and external applications. Whether it is syncing sales from Shopify, leads from Salesforce, or payroll from an external HRMS, our integration services ensure data integrity and eliminate the risk of human error.",
      features: ["Real-time API sync", "Excel bulk migration", "CRM & Marketplace sync", "Database bridge development", "Automated data scheduling", "Error validation logic"],
      tag: "Integration",
      iconBg: "bg-[#045A57]",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      title: "TSS Renewal",
      simpleDesc: "Ensure zero-day access to the latest statutory updates and product enhancements with priority Tally Software Services (TSS) management.",
      detailedDesc: "TSS is the heartbeat of your Tally ecosystem. We handle the entire renewal lifecycle, ensuring you never miss a critical statutory update or a new product feature. Beyond renewal, we help you activate and utilize Tally.NET services for remote access and synchronized data, keeping your business compliant and agile.",
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
      simpleDesc: "Bespoke business logic developed via Tally Definition Language (TDL) to automate your unique industry workflows and reporting.",
      detailedDesc: "Every business has a unique DNA. We build custom TDL modules that extend Tally's core functionality to match your specific operational needs. From specialized invoice formats and field-level validations to complex analytical reports, we ensure Tally works exactly the way your business does, not the other way around.",
      features: ["Industry module design", "Customized Invoices", "Field-level validations", "Analytical reports", "Digital Signatures", "Email/SMS automation"],
      tag: "TDL",
      iconBg: "bg-[#006569]",
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
      simpleDesc: "Enterprise-grade mobile dashboards providing real-time visibility into sales, outstandings, and inventory from any device.",
      detailedDesc: "Empower your leadership with data-driven decision making on the go. Our mobile solutions bridge the gap between the office and the field, allowing secure access to critical Tally reports. With end-to-end encryption and real-time sync, you can monitor business health and approve transactions without being tied to a desk.",
      features: ["Live Sales Dashboards", "WhatsApp sharing", "Ageing & Alert sync", "End-to-end encryption", "Customer info on the go", "Stock status tracking"],
      tag: "Mobile",
      iconBg: "bg-[#045A57]",
      link: "/services/mobile-app-biz",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "AMC Services",
      simpleDesc: "Premium annual maintenance contracts ensuring 99.9% uptime with priority technical support and proactive system health audits.",
      detailedDesc: "Our AMC is more than just a support contract; it is a business continuity guarantee. We provide a rigorous safety net involving 15-minute response SLAs, unlimited remote troubleshooting, and quarterly health checkups. From emergency data recovery to performance tuning, we ensure your Tally environment remains stable and secure. With each AMC period, your team naturally becomes more proficient — gaining deeper Tally knowledge and stronger command over your accounts through ongoing expert interactions.",
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
      simpleDesc: "Automated document delivery and customer communication integrated directly with your TallyPrime data for instant engagement.",
      detailedDesc: "Transform your customer experience by automating the flow of invoices, payment reminders, and ledger statements via WhatsApp. By integrating Tally with the world's most popular messaging app, you reduce payment cycles and improve transparency, all while maintaining a professional and secure communication channel.",
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

  // CHANGE: 2026-09-17 — redesign: lighter professional look. Replaced font-black / 9px
  // tracking-widest endless badges with Playfair display heading, normal-weight slate text,
  // hairline borders, quieter labels, teal-primary actions, and a light CTA panel (the old
  // dark slate-900 block read heavy; removed the green/teal glow deco).
  return (
    <div className="min-h-screen bg-[#FCFBF9] text-slate-900">
      <ServiceDetailPopup 
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        service={selectedService}
        onEnquire={(title) => openModal('enquire', title)}
      />

      {/* Header Section */}
      <section className="bg-white border-b border-slate-100 pt-16 pb-16 md:pt-20 md:pb-20 px-6 text-center relative overflow-hidden flex flex-col items-center">
        <div className="max-w-4xl mx-auto relative z-10 w-full">
          <div className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#006569] mb-6">
            <span className="h-px w-8 bg-[#006569]/30" />
            Tally Services
            <span className="h-px w-8 bg-[#006569]/30" />
          </div>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 mb-6 leading-tight tracking-tight">
            Expert Tally <span className="text-[#006569]">Services</span>
          </h1>
          <p className="text-slate-500 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
            Certified technical expertise to architect and support your TallyPrime environment for maximum business impact and seamless compliance.
          </p>
          <p className="mt-8 text-sm font-semibold text-slate-400">
            Trusted by 1,500+ Indian businesses since 2008
          </p>
        </div>
      </section>

      {/* Service Grid */}
      <section className="py-16 md:py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
          {supportServices.map((s) => (
            <div 
              key={s.title} 
              className="group relative bg-white rounded-2xl p-6 md:p-7 border border-slate-200/60 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-lg hover:shadow-slate-900/5 transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.iconBg} text-white mb-7 shadow-md`}>
                {s.icon}
              </div>

              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 block mb-2.5">
                  {s.tag}
                </span>
                <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-3 leading-snug group-hover:text-[#006569] transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-500 font-normal leading-relaxed">
                  {s.simpleDesc}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                <button 
                  onClick={() => setSelectedService(s)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#006569] hover:text-[#045A57] transition-colors"
                >
                  View Details
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
                <button 
                  onClick={() => openModal('enquire', s.title)}
                  className="px-5 py-2.5 bg-[#006569] text-white rounded-xl text-sm font-semibold hover:bg-[#045A57] transition-colors shadow-sm"
                >
                  Enquire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-6xl mx-auto rounded-[2.5rem] border border-teal-100 bg-[#E5F4F4] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#B8DEDE]/40 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#033B38] mb-5 tracking-tight">
              Need a Custom Solution?
            </h2>
            <p className="text-slate-600 font-normal mb-10 max-w-2xl mx-auto leading-relaxed">
              Our technical architects are ready to design a personalized TallyPrime environment tailored to your specific industry requirements.
            </p>
            <button 
               onClick={() => openModal('general')}
               className="px-10 py-4 bg-[#006569] text-white rounded-xl font-semibold text-sm hover:bg-[#045A57] transition-colors shadow-lg shadow-[#006569]/15"
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