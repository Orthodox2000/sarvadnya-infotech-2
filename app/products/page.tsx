'use client';

import { useState } from 'react';
import Footer from '../components/Footer';
import UnifiedContactModal, { FormType } from '../components/UnifiedContactModal';
import Link from 'next/link';

type ComparisonCard = {
  name: string;
  type: string;
  summary: string;
  includes: string;
  tags: string[];
  link: string;
  cardClass: string;
  stripClass: string;
};

export default function ProductsPage() {
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean; type: FormType; service: string; details: string}>({
    isOpen: false,
    type: 'general',
    service: '',
    details: ''
  });

  const openModal = (type: FormType, service: string = '', details: string = '') => {
    setModalConfig({ isOpen: true, type, service, details });
  };

  const products: ComparisonCard[] = [
    {
      name: "TallyPrime Silver",
      type: "For one user",
      summary: "Core accounting, inventory, GST, and reporting for one workstation.",
      includes: "Best for a single owner or operator who manages everything alone.",
      tags: ["1 user", "Single PC"],
      cardClass: "bg-white border-slate-200",
      stripClass: "bg-slate-200",
      link: "/products/silver"
    },
    {
      name: "TallyPrime Gold",
      type: "For shared teams",
      summary: "All Silver features plus shared LAN access for teams working on the same data.",
      includes: "Best for small offices where sales, accounts, and purchase teams share one company file.",
      tags: ["Silver included", "Shared LAN"],
      cardClass: "bg-[#f8fbff] border-sky-200",
      stripClass: "bg-sky-200",
      link: "/products/gold"
    },
    {
      name: "TallyPrime Server",
      type: "For bigger teams",
      summary: "All Gold and Silver features plus faster shared access, tighter control, and user logs.",
      includes: "Best for larger MSMEs that need more control across users and branches.",
      tags: ["Gold included", "Access logs"],
      cardClass: "bg-white border-slate-200",
      stripClass: "bg-slate-300",
      link: "/products/server"
    },
    {
      name: "TallyDrive",
      type: "Cloud backup",
      summary: "Automated encrypted cloud backups for TallyPrime with scheduling, restore, and management.",
      includes: "Best for any TallyPrime user who wants automatic, encrypted backup protection.",
      tags: ["AES-256", "Scheduled"],
      cardClass: "bg-white border-slate-200",
      stripClass: "bg-[#00ABE4]",
      link: "/products/tallydrive"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f2f1f0]">
      {/* Hero Section (Radiant Sky Theme) */}
      <section className="bg-white relative pt-12 pb-16 md:pt-20 md:pb-24 px-6 overflow-hidden border-b border-[#0371a3]/10"> 
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
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-10">
          TallyPrime Edition Comparison
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {products.map((p) => (
            <div
              key={p.name}
              className={`relative overflow-hidden rounded-[1.5rem] border p-4 md:p-[18px] flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 ${p.cardClass} min-h-[19rem] md:min-h-[20.5rem]`}
            >
              <div className={`absolute inset-x-0 top-0 h-1 ${p.stripClass}`} />

              <div className="relative mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                  {p.type}
                </span>
                <h3 className="mt-3 text-lg md:text-xl font-black text-slate-900 tracking-tight">
                  {p.name}
                </h3>
                <p className="mt-2 text-[13px] leading-snug text-slate-600">
                  {p.summary}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3 mb-3.5">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">
                  Includes
                </div>
                <p className="text-[13px] text-slate-700 leading-snug">
                  {p.includes}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex gap-3">
                <button
                  onClick={() => openModal('quote', p.name, p.summary)}
                  className="flex-1 rounded-xl bg-[#0371a3] py-2.5 text-[10px] font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#00ABE4]"
                >
                  Request Quote
                </button>
                <Link
                  href={p.link}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-center text-[10px] font-black uppercase tracking-[0.14em] text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Know More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TallyDrive Detailed Features Section */}
      <section id="tallydrive" className="py-20 px-6 bg-white border-y border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-sky-50/60 -skew-x-12 transform translate-x-1/2" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0371a3]/10 text-[#0371a3] text-[10px] font-black uppercase tracking-widest mb-6">
              Secure cloud backup
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
              Secure Your Data with <br />
              <span className="text-[#0371a3]">TallyDrive</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8 font-medium max-w-2xl">
              TallyDrive is TallyPrime&apos;s secure cloud storage for company backups. It stores backups online, helps protect against local system failures, and supports automatic scheduling.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: 'Automatic backups',
                  desc: 'Schedule regular backups to TallyDrive, even when TallyPrime is not running.',
                },
                {
                  title: 'Encrypted backup',
                  desc: 'Use a Backup Password and Recovery Key to protect your backups.',
                },
                {
                  title: 'Restore data',
                  desc: 'Restore the latest backup or any previous version stored on TallyDrive.',
                },
              ].map((item) => (
                <div key={item.title} className="p-5 bg-[#ecf5fa] rounded-2xl border border-sky-100">
                  <h4 className="font-black text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-semibold">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-7 md:p-8 text-slate-900 relative overflow-hidden shadow-xl border border-slate-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0371a3]/5 blur-[80px]" />

            <h3 className="text-2xl font-black mb-6 relative z-10 border-b border-slate-100 pb-4">Storage with active TSS</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="block font-black text-slate-900">Single-User TallyPrime</span>
                  <span className="text-xs text-slate-500 font-medium">Free storage with active TSS</span>
                </div>
                <span className="font-black text-[#0371a3]">1 GB</span>
              </div>
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="block font-black text-slate-900">Multi-User TallyPrime</span>
                  <span className="text-xs text-slate-500 font-medium">Free storage with active TSS</span>
                </div>
                <span className="font-black text-[#0371a3]">3 GB</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#f0f9ff] border border-[#0371a3]/10">
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  Use the TallyDrive Management report to monitor, download, and delete company backups, and manage storage and user rights.
                </p>
              </div>
            </div>

            <button 
              onClick={() => openModal('callback', 'TallyDrive Backup')}
              className="mt-8 w-full py-4 bg-[#0371a3] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#00ABE4] transition-all shadow-lg"
            >
              Consult Backup Strategy
            </button>
          </div>
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
