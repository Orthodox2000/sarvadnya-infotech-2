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
        <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-8 pb-6 border-b border-slate-100">
          {details.shortDescription}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-4 flex items-center gap-2">
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
            <h4 className="text-xs font-black uppercase tracking-widest text-rose-600 mb-4 flex items-center gap-2">
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

        <div className="mt-8 pt-8 border-t border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            Frequent Use Cases
          </h4>
          <div className="flex flex-wrap gap-2">
            {details.useCases.map((u, i) => (
              <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-lg border border-indigo-100">
                {u}
              </span>
            ))}
          </div>
        </div>

        <button className="mt-10 w-full py-4 bg-[#0f0529] text-white rounded-2xl font-bold hover:bg-black transition-colors" onClick={onClose}>Got it, thanks</button>
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
      color: "#6366f1",
      borderWeight: "border",
      details: {
        shortDescription: "Perfect for sole proprietors and small businesses, TallyPrime Silver offers complete accounting, inventory, and compliance management on a single computer.",
        benefits: [
          "Complete GST compliance including e-invoicing",
          "Comprehensive inventory management",
          "Lifetime license with easy upgrades",
          "Seamless data synchronization"
        ],
        limitations: [
          "Single user only at a time",
          "Installation limited to one PC",
          "No concurrent multi-user access"
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
      color: "#7338a0",
      popular: true,
      borderWeight: "border-4",
      details: {
        shortDescription: "The industry standard for growing businesses. Allows unlimited users on a local network (LAN) and concurrent access to data.",
        benefits: [
          "Unlimited users on the same LAN",
          "Multi-currency and multi-company support",
          "Advanced reporting and bank reconciliation",
          "Remote access via web browser"
        ],
        limitations: [
          "Performance depends on local network speed",
          "Requires local server infrastructure",
          "Higher initial investment than Silver"
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
      color: "#ec4899",
      borderWeight: "border",
      details: {
        shortDescription: "Enterprise-class product that provides high data concurrency and security for organizations with large user bases.",
        benefits: [
          "Zero waiting time for data access",
          "High-speed performance even with 50+ users",
          "Enhanced data security and audit controls",
          "Real-time monitoring of user activities"
        ],
        limitations: [
          "Requires robust server hardware",
          "Needs professional implementation",
          "Significant investment for large-scale operations"
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
    <div className="min-h-screen bg-slate-50/50">
      <DescriptionPopup 
        isOpen={!!activePopup} 
        onClose={() => setActivePopup(null)} 
        title={activePopup?.title || ''} 
        details={activePopup?.details || null} 
      />

      {/* Hero Section */}
      <section className="bg-[#0f0529] pt-12 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500 blur-[120px] rounded-full -ml-64 -mt-64" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#7338a0] blur-[120px] rounded-full -mr-64 -mb-64" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-widest mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7338a0]"></span>
            Official TallyPrime Partner
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            TallyPrime <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-[#7338a0]">Editions & Licensing</span>
          </h1>
          <p className="text-white/40 text-sm md:text-lg max-w-xl mx-auto leading-relaxed font-medium">
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
                <div className="absolute top-6 right-6 bg-[#7338a0] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">{p.type} Edition</span>
                <h3 className="text-2xl font-black text-[#0f0529] mb-1">{p.name}</h3>
                <div className="text-[#7338a0] font-bold text-sm">{p.price}</div>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {p.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                      <svg className="w-3 h-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className="w-full py-4 bg-[#0f0529] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#7338a0] transition-all shadow-lg"
                >
                  Get License Now
                </button>
                <button 
                  onClick={() => setActivePopup({ title: p.name, details: p.details })}
                  className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
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
