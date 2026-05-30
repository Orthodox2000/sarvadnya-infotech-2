'use client';

import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import UnifiedContactModal, { FormType } from '../components/UnifiedContactModal';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  details: {
    shortDescription: string;
    benefits: string[];
    whatYouGet: string[];
    useCases: string[];
  } | null;
}

const DescriptionPopup = ({ isOpen, onClose, title, details }: PopupProps) => {
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

  if (!isOpen || !details) return null;
  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 md:p-10 max-w-2xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-900" onClick={onClose}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <h3 className="text-2xl md:text-3xl font-black mb-4 text-slate-900">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-8 pb-6 border-b border-slate-100 italic font-medium">
          {details.shortDescription}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#0371a3] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ABE4]"></span>
              Key Benefits
            </h4>
            <ul className="space-y-3">
              {details.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                  <svg className="w-4 h-4 text-[#0371a3] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              What You Get
            </h4>
            <ul className="space-y-3">
              {details.whatYouGet.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                  <svg className="w-4 h-4 text-[#00ABE4] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#0371a3] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ABE4]"></span>
            Frequent Use Cases
          </h4>
          <div className="flex flex-wrap gap-2">
            {details.useCases.map((u, i) => (
              <span key={i} className="px-3 py-1.5 bg-sky-50 text-[#0371a3] text-[11px] font-bold rounded-lg border border-sky-100">
                {u}
              </span>
            ))}
          </div>
        </div>

        <button className="mt-10 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-[#0371a3] transition-colors" onClick={onClose}>Got it, thanks</button>
      </div>
    </div>
  );
};

export default function ProductsPage() {
  const [activePopup, setActivePopup] = useState<{title: string, details: any} | null>(null);
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean; type: FormType; service: string; details: string}>({
    isOpen: false,
    type: 'general',
    service: '',
    details: ''
  });

  const openModal = (type: FormType, service: string = '', details: string = '') => {
    setModalConfig({ isOpen: true, type, service, details });
  };

  const products = [
    {
      name: "TallyPrime Silver",
      type: "Essential",
      price: "Single User",
      features: ["v7.0 Core Engine", "Standalone PC Access", "GST Ready", "E-Invoicing", "Inventory Mgmt"],
      color: "#0371a3",
      borderWeight: "border",
      details: {
        shortDescription: "Perfect for sole proprietors and small businesses, TallyPrime Silver offers complete accounting, inventory, and compliance management on a single computer.",
        benefits: [
          "Complete GST compliance including e-invoicing",
          "Comprehensive inventory management",
          "Lifetime license with easy upgrades",
          "Seamless data synchronization"
        ],
        whatYouGet: [
          "Single User License (Perpetual)",
          "GST/E-Way Bill Modules",
          "TallyDrive (v7.0) Basic",
          "SmartFind Global Search"
        ],
        useCases: [
          "Sole Proprietorships",
          "Freelancers",
          "Small Retail Shops",
          "Individual Professionals"
        ]
      }
    },
    {
      name: "TallyPrime Gold",
      type: "Professional",
      price: "Multi-User",
      features: ["v7.0 Core Engine", "Unlimited LAN Users", "Remote Access", "Consolidated Reports", "Multi-Currency"],
      color: "#0371a3",
      popular: true,
      borderWeight: "border-2",
      details: {
        shortDescription: "The industry standard for growing businesses. Allows unlimited users on a local network (LAN) and concurrent access to data.",
        benefits: [
          "Unlimited users on the same LAN",
          "Multi-currency and multi-company support",
          "Advanced reporting and bank reconciliation",
          "Remote access via web browser"
        ],
        whatYouGet: [
          "Multi-User License (Unlimited LAN)",
          "PrimeBanking (Integrated BRS)",
          "Bharat Connect Plug-in",
          "Remote Edit & View Capability"
        ],
        useCases: [
          "Growing SMEs",
          "Manufacturing Units",
          "Wholesale Traders",
          "Companies with multiple departments"
        ]
      }
    },
    {
      name: "TallyPrime Server",
      type: "Enterprise",
      price: "Large Business",
      features: ["v7.0 Core Engine", "High Speed Concurrency", "Zero Waiting Time", "Secure Data Vault", "Admin Control"],
      color: "#0371a3",
      borderWeight: "border",
      details: {
        shortDescription: "Enterprise-class product that provides high data concurrency and security for organizations with large user bases.",
        benefits: [
          "Zero waiting time for data access",
          "High-speed performance even with 50+ users",
          "Enhanced data security and audit controls",
          "Real-time monitoring of user activities"
        ],
        whatYouGet: [
          "Enterprise Data Management",
          "Hidden Data Folders for Security",
          "Real-time Concurrent Access",
          "Advanced User Activity Logs"
        ],
        useCases: [
          "Large Enterprises",
          "High Transaction Volume Businesses",
          "Organizations requiring high data security",
          "Multi-branch operations"
        ]
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#ecf5fa]">
      <DescriptionPopup 
        isOpen={!!activePopup} 
        onClose={() => setActivePopup(null)} 
        title={activePopup?.title || ''} 
        details={activePopup?.details || null} 
      />

      {/* Hero Section (Radiant Sky Theme) */}
      <section className="bg-white relative pt-12 pb-16 md:pt-20 md:pb-24 px-6 overflow-hidden border-b border-[#0371a3]/10"> 

        {/* Background Effects */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-white/40 blur-[130px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-sky-200/30 blur-[110px] -ml-24 -mb-24" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-500/20 text-yellow-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
            Official TallyPrime Partner
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] via-[#4b91ca] to-[#0371a3] drop-shadow-[0_2px_15px_rgba(0,171,228,0.2)]">TallyPrime</span> <br />
            Editions & Licensing
          </h1>
          <p className="text-slate-600/80 text-sm md:text-xl max-w-xl mx-auto leading-relaxed font-semibold">
            Choose the right edition of TallyPrime designed to scale with your business complexity and user requirements.
          </p>
        </div>
      </section>

      {/* Comparison Grid */}
      <section id="compare" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p) => (
            <div 
              key={p.name} 
              className={`relative bg-white rounded-[32px] p-8 ${p.borderWeight} border-slate-100 flex flex-col shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden`}
              style={p.popular ? { borderColor: p.color } : {}}
            >
              {p.popular && (
                <div className="absolute top-6 right-6 bg-[#0371a3] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">{p.type} Edition</span>
                <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-[#0371a3] transition-colors">{p.name}</h3>
                <div className="text-[#0371a3] font-bold text-sm">{p.price}</div>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {p.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-sky-50 transition-colors shrink-0">
                      <svg className="w-3 h-3 text-[#0371a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-slate-600">{f}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => openModal('enquire', p.name)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0371a3] transition-all shadow-lg"
                >
                  Get License Now
                </button>
                <button 
                  onClick={() => setActivePopup({ title: p.name, details: p.details })}
                  className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
                >
                  View Full Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <UnifiedContactModal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        type={modalConfig.type}
        prefillService={modalConfig.service}
        prefillDetails={modalConfig.details}
      />
      <Footer />
    </div>
  );
}
