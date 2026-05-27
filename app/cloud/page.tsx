'use client';

import { useState } from 'react';
import Image from 'next/image';
import Footer from '../components/Footer';
import UnifiedContactModal, { FormType } from '../components/UnifiedContactModal';
import CloudBackupSection from '../components/CloudBackupSection';

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
  if (!isOpen || !details) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 md:p-10 max-w-2xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-900" onClick={onClose}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <h3 className="text-2xl md:text-3xl font-black mb-4 text-slate-900">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-8 pb-6 border-b border-slate-100 italic font-medium">
          {details.shortDescription}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0371a3] mb-4 flex items-center gap-2">
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
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
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

        <button className="mt-10 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-[#0371a3] transition-colors" onClick={onClose}>Got it, thanks</button>
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
      color: "#0371a3",
      details: {
        shortDescription: "The official collaboration between Tally Solutions and Amazon Web Services for a secure and highly available environment.",
        benefits: [
          "Industry-leading security standards",
          "Highly reliable AWS global infrastructure",
          "Fully managed backups and recovery",
          "Seamless scalability as you grow"
        ],
        whatYouGet: [
          "Official AWS Infrastructure",
          "Encrypted Data Vault",
          "24/7 Availability Guarantee",
          "Professional Technical Support"
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
      color: "#00ABE4",
      details: {
        shortDescription: "Host Tally on a dedicated Windows Virtual Machine for a native desktop experience accessible from anywhere.",
        benefits: [
          "Familiar Windows desktop interface",
          "Native integration with MS Office tools",
          "Direct local printer and hardware access",
          "Full control over VM specifications"
        ],
        whatYouGet: [
          "Dedicated Windows Resource",
          "Multi-user RDP Access",
          "Office 365 Ready Environment",
          "Local Peripheral Support"
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
        whatYouGet: [
          "End-to-End AES-256 Encryption",
          "Automated Scheduler",
          "Point-in-Time Recovery",
          "Email Status Reports"
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
    <div className="min-h-screen bg-white">
      <DescriptionPopup 
        isOpen={!!activePopup} 
        onClose={() => setActivePopup(null)} 
        title={activePopup?.title || ""} 
        details={activePopup?.details || null} 
      />

      {/* Hero Section (Radiant Sky Theme) */}
      <section className="bg-[#f2fcff] relative overflow-hidden flex items-center min-h-[300px] md:min-h-[450px] border-b border-[#0371a3]/10">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'url(/bgggg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        {/* Cinematic Image Side (Intelligent Fit) */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 z-0">
          <div className="relative h-full w-full bg-white/20">
            {/* Blurred Backdrop */}
            <Image 
              src="/hero/dedicated-to-cloud-hosting.jpg" 
              alt="Cloud Backdrop" 
              fill 
              className="object-cover opacity-30 blur-2xl"
            />
            {/* Full-Fill Foreground Image */}
            <div className="absolute inset-0">
              <Image 
                src="/hero/dedicated-to-cloud-hosting.jpg" 
                alt="Sarvadnya Cloud Hosting" 
                fill 
                className="object-cover transition-transform duration-[10000ms] hover:scale-110"
                priority
              />
            </div>
            {/* Cinematic Overlay - Soft transition to image */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#f2fcff] via-[#f2fcff]/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent z-10" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full px-6 relative z-10 py-12 md:py-20">
          <div className="max-w-2xl lg:pr-12 text-left">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 text-[#0371a3] text-[10px] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-sm">
              <span className="flex h-1 w-1 rounded-full bg-[#0371a3]"></span>
              Next-Gen Cloud Infrastructure
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
              Cloud Solutions
            </h1>
            <p className="text-slate-600/80 text-sm md:text-xl max-w-2xl leading-relaxed font-semibold mb-8">
              Experience Tally solutions with official AWS infrastructure and professional Windows cloud management.
            </p>
            <div className="flex flex-wrap gap-4">
               <button 
                onClick={() => openModal('callback', 'Cloud Consultation')}
                className="px-8 py-4 bg-[#0371a3] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00ABE4] transition-all shadow-xl shadow-[#0371a3]/20"
              >
                Consult Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud Products Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {cloudProducts.map((p) => (
            <div key={p.name} 
                 className="group relative p-8 rounded-3xl transition-all duration-300 flex flex-col border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:border-[#0371a3]/30">
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: p.color }}>{p.type}</p>
                <h3 className="text-2xl font-black mb-4 leading-tight text-slate-900 group-hover:text-[#0371a3] transition-colors">{p.name}</h3>
                <button 
                  onClick={() => setActivePopup({title: p.name, details: p.details})} 
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-sky-50 hover:border-[#0371a3]/30 transition-all group/btn"
                >
                  View Full Details
                  <svg className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform text-[#0371a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6 pb-6 border-b border-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Core Features</p>
                <ul className="space-y-3">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm text-slate-600 font-medium leading-tight">
                      <svg className="w-5 h-5 text-[#0371a3] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <button 
                  onClick={() => openModal('enquire', p.name)}
                  className="w-full py-4 rounded-xl font-bold transition-all text-sm bg-slate-900 text-white hover:bg-[#0371a3] shadow-lg shadow-slate-100"
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Cloud? Banner */}
      <section className="py-24 px-6 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">Why move Tally <br />to Cloud?</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-10 font-medium">
              Transform your accounting from a local dependency to a global asset. Cloud hosting ensures your data is accessible 24/7, highly secured, and automatically backed up.
            </p>
            <div className="grid grid-cols-2 gap-8">
              {[
                { title: "24/7 Access", desc: "Work from home or site" },
                { title: "Zero IT Cost", desc: "No local server needed" },
                { title: "Data Security", desc: "Encrypted AWS vault" },
                { title: "Auto Backup", desc: "Zero data loss risk" }
              ].map((item, i) => (
                <div key={i} className="group">
                  <h4 className="font-black text-[#0371a3] text-base mb-1 group-hover:text-[#00ABE4] transition-colors">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.15em]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full bg-white rounded-[3rem] p-12 border border-slate-100 text-center shadow-xl shadow-sky-900/5 relative overflow-hidden">
            {/* Subtle decorative glow */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-sky-50 blur-[100px] pointer-events-none opacity-50"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-4xl animate-bounce">🚀</span>
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-900">Ready to Transition?</h3>
              <p className="text-slate-500 text-base mb-10 font-medium">Schedule a technical consultation to assess your cloud readiness and business needs.</p>
              <button 
                onClick={() => openModal('callback', 'Cloud Consultation')}
                className="group px-10 py-5 bg-[#0371a3] text-white rounded-2xl font-bold hover:bg-[#00ABE4] hover:shadow-2xl hover:shadow-sky-900/20 transition-all flex items-center gap-3 mx-auto"
              >
                Consult Our Team
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud Comparison Table */}
      <section className="py-24 px-6 max-w-7xl mx-auto overflow-x-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Cloud Infrastructure Comparison</h2>
          <p className="text-slate-500 font-bold max-w-2xl mx-auto">Choose the foundation that best fits your organizational workflow and security requirements.</p>
        </div>
        <table className="w-full border-collapse bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 min-w-[800px]">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-8 text-left font-black uppercase tracking-widest text-[10px]">Infrastructure Detail</th>
              <th className="p-8 text-center font-black uppercase tracking-widest text-[10px]">AWS Cloud Server</th>
              <th className="p-8 text-center font-black uppercase tracking-widest text-[10px]">Windows Dedicated VM</th>
              <th className="p-8 text-center font-black uppercase tracking-widest text-[10px]">NoSky Backup Node</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { label: "Deployment Type", aws: "Public Cloud (Shared/Reserved)", vm: "Private Virtual Instance", nosky: "Storage optimized Node" },
              { label: "OS Environment", aws: "Standard Windows Server", vm: "Full Windows 10/11 Desktop", nosky: "Hardened Backup OS" },
              { label: "Auto-Scalability", aws: "On-Demand (Elastic)", vm: "Fixed (Upgrade Manual)", nosky: "Fixed Storage Quota" },
              { label: "Remote Protocol", aws: "RDP over HTTPS", vm: "Direct RDP / VPN", nosky: "HTTPS Sync Client" },
              { label: "Primary Use Case", aws: "High-Traffic Multi-User", vm: "Native Apps & Add-ons", nosky: "Disaster Recovery" },
              { label: "Security Layer", aws: "AWS IAM & Security Groups", vm: "Windows Defender & Firewall", nosky: "AES-256 Client-Side" }
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="p-6 text-slate-900 font-black text-sm border-r border-slate-50">{row.label}</td>
                <td className="p-6 text-center text-slate-600 text-sm font-medium">{row.aws}</td>
                <td className="p-6 text-center text-slate-600 text-sm font-medium">{row.vm}</td>
                <td className="p-6 text-center text-slate-600 text-sm font-medium">{row.nosky}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Cloud & Backup Ecosystem Section */}
      <CloudBackupSection />

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
