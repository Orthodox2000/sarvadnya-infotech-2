'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
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

  const cloudProducts = [
    {
      name: "AWS Cloud Server",
      type: "Official Cloud",
      price: "Official Tally & AWS",
      features: ["Highest Data Security", "AWS Global Infrastructure", "Automatic Backups", "Remote Access", "Scalable Storage"],
      color: "#FF9900",
      borderWeight: "border",
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
      borderWeight: "border",
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
      borderWeight: "border",
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

  const amcProduct = {
    name: "Tally AMC Services",
    type: "Priority Support",
    price: "Annual Contract",
    features: ["On-Site & Remote Support", "Priority Troubleshooting", "Data Backup Assistance", "Unlimited Query Resolution", "Annual Health Checks"],
    color: "#7338a0",
    details: {
      shortDescription: "Minimize downtime and maximize productivity with our priority troubleshooting and regular health checks via Annual Maintenance Contracts.",
      benefits: [
        "Faster response times for critical issues",
        "Regular system health and data audits",
        "Assistance with data backup and recovery",
        "Unlimited remote and on-site support sessions"
      ],
      limitations: [
        "Requires active Tally Software Service (TSS)",
        "Limited to software-specific troubleshooting",
        "Hardware failures not included"
      ],
      useCases: [
        "Mission-critical accounting environments",
        "Businesses without in-house IT support",
        "Companies requiring regular data validation",
        "Organizations scaling their Tally usage"
      ]
    }
  };

  const verticalModules = [
    { title: "C&F Agencies", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800", details: "Manage container tracking, agent commissions, and shipping documentation directly within Tally. Optimized for the complex billing cycles of C&F agents.", gridSpan: "col-span-2 row-span-1" },
    { title: "Transport", image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800", details: "Monitor fuel expenses, trip sheets, and vehicle maintenance schedules. Includes automated driver commission and trip-wise P&L reporting.", gridSpan: "col-span-1 row-span-2" },
    { title: "Garments", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800", details: "Advanced inventory management allowing you to track stock by size, color, and fabric types. Perfect for retail and wholesale garment traders.", gridSpan: "col-span-1 row-span-1" },
    { title: "Societies", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", details: "Automated maintenance bill generation for co-operative housing societies. Includes receipt tracking, penalty calculation, and audit reports.", gridSpan: "col-span-1 row-span-1" },
    { title: "Sales & Commission", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800", details: "Define multi-level commission rules based on product categories, sales volume, or payment realization dates. Automate complex payout calculations.", gridSpan: "col-span-2 row-span-1" },
    { title: "Excel to Tally", image: "https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80&w=800", details: "Seamlessly import thousands of masters, ledgers, and vouchers from any Excel sheet to TallyPrime without data errors.", gridSpan: "col-span-1 row-span-1" },
    { title: "Business Boosters", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", details: "A collection of productivity-enhancing modules designed to bridge functional gaps and streamline your daily accounting operations.", gridSpan: "col-span-1 row-span-1" }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <DescriptionPopup 
        isOpen={!!activePopup} 
        onClose={() => setActivePopup(null)} 
        title={activePopup?.title || ""} 
        details={activePopup?.details || null} 
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
                <button onClick={() => setActivePopup({title: p.name, details: p.details})} className="text-[5px] md:text-[10px] font-bold text-[#7338a0] hover:underline">Full Details →</button>
              </div>
              <ul className="space-y-1 md:space-y-4 mb-3 md:mb-10 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-0.5 md:gap-3 text-[7px] md:text-sm text-slate-600 leading-tight">
                    <svg className="w-1.5 h-1.5 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => openModal('quote', p.name, `I am interested in ${p.name}. Please provide a quote.`)}
                className={`w-full py-1.5 md:py-4 rounded-lg md:rounded-xl font-bold transition-all text-[7px] md:text-sm shadow-sm ${p.popular ? 'bg-[#7338a0] text-white' : 'border border-slate-200 hover:bg-slate-50'}`}
              >
                Request Quote
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Specialized Custom Modules */}
      <section id="modules" className="py-20 px-4 md:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-black mb-4 text-[#0f0529]">Specialized Custom Modules</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-[11px] md:text-sm">
              Industry-specific logic built directly into your Tally and Cloud environment.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-2 md:gap-4 auto-rows-[120px] md:auto-rows-[220px]">
            {verticalModules.map((m) => (
              <div 
                key={m.title} 
                className={`relative group rounded-xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer ${m.gridSpan}`}
                onClick={() => openModal('enquire', m.title, `I want to enquire about the ${m.title} module.`)}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${m.image})` }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
                
                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col h-full justify-end p-2 md:p-6">
                  <div className="transform translate-y-2 md:translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <h4 className="font-bold text-[10px] md:text-xl text-white mb-1 md:mb-2 leading-tight">{m.title}</h4>
                    <p className="text-[8px] md:text-[12px] opacity-0 group-hover:opacity-100 text-white/90 leading-tight md:leading-relaxed transition-all duration-500 delay-100 line-clamp-2 md:line-clamp-3">
                      {m.details}
                    </p>
                    <div className="mt-2 md:mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      <span className="inline-flex items-center gap-1 bg-white text-black text-[7px] md:text-[11px] font-bold px-2 py-0.5 md:px-4 md:py-2 rounded-full group-hover:bg-[#7338a0] group-hover:text-white transition-colors shadow-lg">
                        Enquire Now
                        <svg className="w-2 h-2 md:w-3 md:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" /></svg>
                      </span>
                    </div>
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
          <h2 className="text-2xl md:text-4xl font-black mb-4 text-[#0f0529]">Cloud Managed Services</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-[11px] md:text-sm">
            Experience Tally solutions with official AWS infrastructure and professional Windows cloud management.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8 items-stretch">
          {cloudProducts.map((p) => (
            <div key={p.name} 
                 className={`relative p-2.5 md:p-8 rounded-xl md:rounded-3xl transition-all duration-300 flex flex-col border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:border-[#7338a0]/30`}>
              <div className="mb-3 md:mb-8">
                <p className="text-[7px] md:text-xs font-bold uppercase tracking-widest mb-1" style={{ color: p.color }}>{p.type}</p>
                <h3 className="text-[10px] md:text-2xl font-bold mb-0.5 leading-tight">{p.name}</h3>
                <button onClick={() => setActivePopup({title: p.name, details: p.details})} className="text-[6px] md:text-[10px] font-bold text-slate-400 hover:text-[#7338a0] hover:underline whitespace-nowrap">Learn More →</button>
              </div>
              <ul className="space-y-1.5 md:space-y-4 mb-4 md:mb-10 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-1 md:gap-3 text-[8px] md:text-sm text-slate-600 leading-tight">
                    <svg className="w-2 h-2 md:w-5 md:h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => openModal('enquire', p.name, `I am interested in ${p.name}. Please provide more details.`)}
                className={`w-full py-2 md:py-4 rounded-lg md:rounded-xl font-bold transition-all text-[8px] md:text-sm border border-slate-200 hover:bg-[#7338a0] hover:text-white hover:border-[#7338a0] shadow-sm`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Annual Maintenance Contract (AMC) */}
      <section id="amc" className="py-20 px-4 md:px-6 bg-[#fcfaff] border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-2xl shadow-indigo-100/50 border border-indigo-50/50 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-black uppercase tracking-widest mb-6 border border-indigo-100">
                <span className="flex h-2 w-2 rounded-full animate-pulse bg-indigo-500"></span>
                Priority Support
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 text-[#0f0529] leading-tight">
                Tally Annual <br className="hidden md:block" />
                <span className="text-[#7338a0]">Maintenance Contract</span>
              </h2>
              <p className="text-slate-600 text-sm md:text-lg mb-8 leading-relaxed max-w-xl">
                Beyond software sales—we ensure your Tally ecosystem runs flawlessly with priority troubleshooting, 
                regular health checks, and certified expert guidance available at your fingertips.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button 
                  onClick={() => setActivePopup({title: amcProduct.name, details: amcProduct.details})}
                  className="px-10 py-4 bg-[#7338a0] text-white rounded-full font-bold hover:bg-[#0f0529] transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
                >
                  View Details
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
                <button 
                  onClick={() => openModal('callback', 'Tally AMC', 'I want to discuss Tally AMC services for my business.')}
                  className="px-10 py-4 border border-slate-200 text-[#0f0529] rounded-full font-bold hover:bg-slate-50 transition-all"
                >
                  Request Call
                </button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {amcProduct.features.map((f, i) => (
                <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{f}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Upgrade & Migration Assistance */}
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
          <Link
            href="/contact"
            className="mt-12 px-10 py-4 bg-emerald-500 text-white rounded-full font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 inline-block"
          >
            Talk to Migration Expert
          </Link>
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
