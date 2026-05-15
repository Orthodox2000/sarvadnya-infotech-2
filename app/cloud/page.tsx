'use client';

import { useState } from 'react';
import Footer from '../components/Footer';
import UnifiedContactModal, { FormType } from '../components/UnifiedContactModal';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  details: {
    shortDescription: string;
    benefits: string[];
    limitations: string[];
    useCases: string[];
  } | null;
}

const DescriptionPopup = ({ isOpen, onClose, title, details }: PopupProps) => {
  if (!isOpen || !details) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 md:p-10 max-w-2xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-900" onClick={onClose}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <h3 className="text-2xl md:text-3xl font-black mb-4 text-[#0f0529]">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-8 pb-6 border-b border-slate-100 italic">
          {details.shortDescription}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Key Benefits
            </h4>
            <ul className="space-y-3">
              {details.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Limitations
            </h4>
            <ul className="space-y-3">
              {details.limitations.map((l, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                  <svg className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button className="mt-10 w-full py-4 bg-[#0f0529] text-white rounded-2xl font-bold hover:bg-black transition-colors" onClick={onClose}>Got it, thanks</button>
      </div>
    </div>
  );
};

export default function CloudPage() {
  const [activePopup, setActivePopup] = useState<{title: string, details: any} | null>(null);
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean; type: FormType; service: string}>({
    isOpen: false,
    type: 'enquire',
    service: ''
  });

  const openModal = (type: FormType, service: string = '') => {
    setModalConfig({ isOpen: true, type, service });
  };

  const cloudProducts = [
    {
      name: "AWS Cloud Server",
      type: "Official Cloud",
      price: "Official Tally & AWS",
      features: ["Highest Data Security", "AWS Global Infrastructure", "Automatic Backups", "Remote Access", "Scalable Storage"],
      color: "#FF9900",
      details: {
        shortDescription: "The official collaboration between Tally Solutions and Amazon Web Services for a secure and highly available environment.",
        benefits: [
          "Industry-leading security standards",
          "Highly reliable AWS global infrastructure",
          "Fully managed backups and recovery",
          "Seamless scalability as you grow"
        ],
        limitations: [
          "Higher cost compared to local hosting",
          "Requires consistent internet connectivity",
          "Dependency on AWS service regions"
        ],
        useCases: [
          "Enterprises with strict security needs",
          "Rapidly scaling businesses",
          "Multi-location organizations",
          "Remote-first companies"
        ]
      }
    },
    {
      name: "Windows VM",
      type: "Native Experience",
      price: "Dedicated VM",
      features: ["Native Desktop Feel", "Direct Printer Access", "MS Office Integration", "Full Admin Control", "Custom VM Specs"],
      color: "#0078D4",
      details: {
        shortDescription: "Host Tally on a dedicated Windows Virtual Machine for a native desktop experience accessible from anywhere.",
        benefits: [
          "Familiar Windows desktop interface",
          "Native integration with MS Office tools",
          "Direct local printer and hardware access",
          "Full control over VM specifications"
        ],
        limitations: [
          "Requires RDP setup and management",
          "Windows licensing costs apply",
          "More complex user management"
        ],
        useCases: [
          "Businesses using specialized Windows add-ons",
          "Teams requiring full desktop environments",
          "IT-managed business environments",
          "Power users of Excel-to-Tally tools"
        ]
      }
    },
    {
      name: "NoSky Backup",
      type: "Data Protection",
      price: "Secured Cloud",
      features: ["Ransomware Protection", "Incremental Backups", "AES-256 Encryption", "One-Click Restore", "Scheduled Tasks"],
      color: "#10b981",
      details: {
        shortDescription: "NoSky Backup is an enterprise-grade cloud backup solution specifically optimized for Tally and business documents.",
        benefits: [
          "Automated protection against ransomware",
          "Incremental sync saves bandwidth",
          "Centralized monitoring and alerts",
          "Easy restoration to any device"
        ],
        limitations: [
          "Initial sync requires high upload speed",
          "Storage-based pricing tiers",
          "Version history limits apply"
        ],
        useCases: [
          "Critical Financial Record Security",
          "Disaster Recovery Planning",
          "Audit Compliance",
          "Peace of Mind for Business Owners"
        ]
      }
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <DescriptionPopup 
        isOpen={!!activePopup} 
        onClose={() => setActivePopup(null)} 
        title={activePopup?.title || ""} 
        details={activePopup?.details || null} 
      />

      {/* Hero Section */}
      <section className="bg-[#0f0529] pt-12 pb-16 md:pt-20 md:pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-500 blur-[100px]" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-widest mb-6">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#7338a0]"></span>
            Next-Gen Cloud Infrastructure
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Cloud Solutions
          </h1>
          <p className="text-white/40 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Experience Tally solutions with official AWS infrastructure and professional Windows cloud management.
          </p>
        </div>
      </section>

      {/* Cloud Products Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {cloudProducts.map((p) => (
            <div key={p.name} 
                 className="relative p-8 rounded-3xl transition-all duration-300 flex flex-col border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:border-[#7338a0]/30">
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: p.color }}>{p.type}</p>
                <h3 className="text-2xl font-bold mb-2 leading-tight text-[#0f0529]">{p.name}</h3>
                <button onClick={() => setActivePopup({title: p.name, details: p.details})} className="text-[10px] font-bold text-[#7338a0] hover:underline whitespace-nowrap">Learn More →</button>
              </div>
              
              <div className="mb-6 pb-6 border-b border-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Core Features</p>
                <ul className="space-y-3">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm text-slate-600 leading-tight">
                      <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <button 
                  onClick={() => openModal('enquire', p.name)}
                  className="w-full py-4 rounded-xl font-bold transition-all text-sm bg-[#0f0529] text-white hover:bg-black shadow-lg"
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Cloud? Banner */}
      <section className="py-20 px-6 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-black text-[#0f0529] mb-6">Why move Tally to Cloud?</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              Transform your accounting from a local dependency to a global asset. Cloud hosting ensures your data is accessible 24/7, highly secured, and automatically backed up.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { title: "24/7 Access", desc: "Work from home or site" },
                { title: "Zero IT Cost", desc: "No local server needed" },
                { title: "Data Security", desc: "Encrypted AWS vault" },
                { title: "Auto Backup", desc: "Zero data loss risk" }
              ].map((item, i) => (
                <div key={i}>
                  <h4 className="font-bold text-[#7338a0] text-sm mb-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full bg-slate-50 rounded-[2.5rem] p-12 border border-slate-100 text-center">
            <div className="text-5xl mb-6">🚀</div>
            <h3 className="text-xl font-bold mb-4 text-[#0f0529]">Ready to Transition?</h3>
            <p className="text-slate-500 text-sm mb-8">Schedule a technical consultation to assess your cloud readiness.</p>
            <button 
              onClick={() => openModal('callback', 'Cloud Consultation')}
              className="px-8 py-4 bg-[#7338a0] text-white rounded-full font-bold hover:shadow-2xl transition-all"
            >
              Consult an Expert
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
