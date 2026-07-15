'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "../../components/Footer";
import UnifiedContactModal, { FormType } from "../../components/UnifiedContactModal";

const TAG_STYLES: Record<string, { bg: string; txt: string }> = {
  green: { bg: '#dcf0e0', txt: '#2b6338' },
  blue: { bg: '#E0EDE6', txt: '#3D5E52' },
  purple: { bg: '#dcd1f3', txt: '#4f3183' },
  yellow: { bg: '#f6e4bd', txt: '#85601c' },
};

const cards = [
  {
    name: 'Tally on AWS Cloud',
    icon: (
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20 text-white text-[10px] font-black tracking-wider">AWS</span>
    ),
    link: '/cloud/aws',
    features: [
      '100% remote access to your Tally from any device, anywhere in the world.',
      'Perfect for growing businesses that want bank-level security without buying expensive office servers.',
    ],
    tags: [
      { label: 'WORK FROM ANYWHERE', color: 'purple' },
      { label: 'ZERO HARDWARE', color: 'green' },
      { label: 'BANK-LEVEL SECURITY', color: 'blue' },
      { label: 'AUTO BACKUPS', color: 'yellow' },
    ],
  },
  {
    name: 'Windows Cloud Desktop',
    icon: (
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
        <svg className="w-5 h-5 text-white" viewBox="0 0 88 88" fill="currentColor">
          <path d="M0 12.402l35.687-4.86.016 34.423-35.67.203v-29.766zm35.67 33.529l.016 34.453-35.687-4.906v-29.75l35.67.203zm4.326-39.011l47.988-6.92v40.09l-47.988.246v-33.416zm47.988 37.52v40.165l-47.988-6.942v-33.454l47.988.231z"/>
        </svg>
      </span>
    ),
    link: '/cloud/windows',
    features: [
      'A complete, private Windows computer hosted securely on the internet.',
      'Perfect for teams who want to run Tally, use Excel side-by-side, and print to their local office printer.',
    ],
    tags: [
      { label: 'NATIVE DESKTOP', color: 'green' },
      { label: 'LOCAL PRINTING', color: 'blue' },
      { label: 'EXCEL INTEGRATION', color: 'yellow' },
      { label: 'EASY TO USE', color: 'purple' },
    ],
  },
  {
    name: 'NoSky Backup',
    icon: (
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
      </span>
    ),
    link: '/cloud/nosky',
    features: [
      'A silent, automatic safety net that backs up your Tally data every single day.',
      'Perfect for owners who want to stop worrying about computer crashes, hardware theft, or ransomware.',
    ],
    tags: [
      { label: '100% AUTOMATIC', color: 'blue' },
      { label: 'RANSOMWARE PROOF', color: 'green' },
      { label: '1-CLICK RESTORE', color: 'purple' },
      { label: 'SECURE VAULT', color: 'yellow' },
    ],
  },
];

export default function CloudPage() {
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: FormType; service: string; details: string }>({
    isOpen: false,
    type: 'enquire',
    service: '',
    details: '',
  });

  const openModal = (type: FormType, service: string = '', details: string = '') => {
    setModalConfig({ isOpen: true, type, service, details });
  };

  const ctaGroups = [
    {
      title: 'Sales & Expert Advice',
      buttons: [
        { label: 'Request Quote', type: 'quote' as FormType },
        { label: 'Book Demo', type: 'demo' as FormType },
        {
          label: 'Contact Sales',
          href: '/contact?service=Cloud%20Solutions&message=Please%20share%20deployment%20details%20and%20setup%20options%20for%20cloud%20solutions.',
        },
      ],
    },
    {
      title: 'Technical Support',
      buttons: [
        { label: 'Technical Support', type: 'support' as FormType },
        { label: 'Talk to Consultant', type: 'callback' as FormType },
        { label: 'Corporate Training', href: '/services/corporate-training' },
      ],
    },
    {
      title: 'Quick Links',
      buttons: [
        { label: 'Find My Solution', href: '/find-solution' },
        { label: 'Explore Options', href: '#compare' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f5ef] font-sans antialiased">

      <div className="bg-[url('/mobilebg.png')] md:bg-[url('/cardbg.png')] bg-cover bg-center bg-no-repeat">
        {/* Header */}
        <section className="relative z-10 pt-16 pb-6 md:pt-8 md:pb-8 px-6 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-[2.75rem] font-extrabold tracking-tight mb-4 text-[#1a1c20]">
            Tally Cloud &amp; Backup Solutions
          </h1>
          <p className="text-[1.05rem] text-[#4a4d50] leading-relaxed font-medium max-w-2xl">
            Get the freedom to work from anywhere and the peace of mind that your data is safe. No expensive office servers, no complex IT headaches—just your business, always online.
          </p>
        </section>

        {/* Cards Grid */}
        <section className="relative z-10 px-6 pb-16 md:pb-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 items-stretch">
            {cards.map((card) => (
              <div
                key={card.name}
                className="bg-white rounded-[24px] flex flex-col shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden transition-transform duration-300 hover:-translate-y-1 border border-gray-100"
              >
                {/* Header Gradient */}
                <div className="bg-gradient-to-r from-[#2d6a46] to-[#428f81] px-5 py-3.5 h-[58px] flex items-center justify-between relative overflow-hidden">
                  <h2 className="text-[1.1rem] font-bold text-white tracking-wide relative z-10">{card.name}</h2>
                  <div className="relative z-10 scale-[0.85] origin-right">{card.icon}</div>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-[0.65rem] font-bold tracking-[0.1em] text-black uppercase mb-2">INCLUDES</h3>

                  <ul className="space-y-2 mb-3 flex-grow">
                    {card.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-[12px] text-gray-800 leading-[1.5]">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {card.tags.map((tag) => {
                      const s = TAG_STYLES[tag.color] || TAG_STYLES.green;
                      return (
                        <span
                          key={tag.label}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-wide"
                          style={{ backgroundColor: s.bg, color: s.txt }}
                        >
                          {tag.label}
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => openModal('quote', card.name, card.features[0])}
                      className="flex-1 bg-[#2e6b4b] hover:bg-[#225239] text-white text-[0.65rem] font-bold py-2 px-2 rounded-full transition-colors shadow-sm text-center"
                    >
                      REQUEST QUOTE
                    </button>
                    <Link
                      href={card.link}
                      className="flex-1 border-[1.5px] border-gray-300 bg-white text-gray-800 hover:bg-gray-50 text-[0.65rem] font-bold py-2 px-2 rounded-full transition-colors text-center"
                    >
                      KNOW MORE
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Why Cloud Section */}
      <section className=" bg-[linear-gradient(90deg,rgba(249,251,245,1)_0%,rgba(244,242,234,1)_53%,rgba(238,236,223,1)_100%)] py-20 px-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#316852]/10 text-[#316852] text-[10px] font-black uppercase tracking-widest mb-6">
            WHY GO CLOUD?
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 leading-tight">
            Why small businesses are moving to the cloud
          </h2>
          <p className="text-slate-500 text-sm md:text-base mb-2 max-w-3xl leading-relaxed">
            Stop spending thousands on heavy server computers, UPS batteries, and paying IT guys to fix them. Moving your Tally to the cloud gives you instant freedom and absolute peace of mind.
          </p>
          <p className="text-slate-500 text-sm md:text-base mb-8 max-w-3xl leading-relaxed">
            Whether you want to check reports from home, connect a new branch office, or just sleep well knowing your data is safe from a hard drive crash—our cloud solutions make it completely effortless.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Work From Anywhere', desc: 'Log in securely from your laptop, Mac, or tablet at home or while traveling.' },
              { title: 'Total Data Safety', desc: 'Bank-level security protects your business from physical theft and viruses.' },
              { title: 'Zero IT Headaches', desc: 'No expensive hardware to buy, maintain, upgrade, or replace.' },
              { title: 'Easy Team Sync', desc: 'Connect branch offices instantly so everyone bills on the same live data.' },
            ].map((item) => (
              <div key={item.title} className="p-5 bg-white rounded-2xl border border-slate-200">
                <h3 className="font-black text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-semibold">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Menu Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-8">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#316852] mb-3">HELP MENU</div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">Not sure which cloud setup you need?</h2>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
              Every business is different. You don&apos;t have to be a tech expert—tell us how your team works, and we&apos;ll recommend the perfect, cost-effective setup.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {ctaGroups.map((group) => (
              <div key={group.title} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#316852]" />
                  <h3 className="font-black text-slate-900 text-sm">{group.title}</h3>
                </div>
                <div className="flex flex-col gap-1.5">
                  {group.buttons.map((button) =>
                    'type' in button ? (
                      <button
                        key={button.label}
                        onClick={() => openModal(button.type as FormType, 'Cloud Consultation')}
                        className="text-left text-sm text-slate-600 hover:text-[#316852] transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-50"
                      >
                        {button.label}{' ->'}
                      </button>
                    ) : (
                      <Link
                        key={button.label}
                        href={button.href}
                        className="text-left text-sm text-slate-600 hover:text-[#316852] transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-50"
                      >
                        {button.label}{' ->'}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NoSky Backup Section */}
      {/* <section className="py-20 px-6  bg-[linear-gradient(90deg,rgba(249,251,245,1)_0%,rgba(244,242,234,1)_53%,rgba(238,236,223,1)_100%)]border-y border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#316852]/5 -skew-x-12 transform translate-x-1/2" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#316852]/10 text-[#316852] text-[10px] font-black uppercase tracking-widest mb-6">
              Secure cloud backup
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
              Secure Your Data with <br />
              <span className="text-[#316852]">NoSky Backup</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8 font-medium max-w-2xl">
              NoSky Backup provides secure cloud storage for TallyPrime company backups. It stores backups online, helps protect against local system failures, and supports automatic scheduling.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: 'Automatic backups',
                  desc: 'Schedule regular backups even when TallyPrime is not running.',
                },
                {
                  title: 'Encrypted backup',
                  desc: 'Use a Backup Password and Recovery Key to protect your backups.',
                },
                {
                  title: 'Restore data',
                  desc: 'Restore the latest backup or any previous version stored on cloud.',
                },
              ].map((item) => (
                <div key={item.title} className="p-5 bg-[#f0f7f3] rounded-2xl border border-[#316852]/10">
                  <h4 className="font-black text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-semibold">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-7 md:p-8 text-slate-900 relative overflow-hidden shadow-xl border border-slate-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#316852]/5 blur-[80px]" />

            <h3 className="text-2xl font-black mb-6 relative z-10 border-b border-slate-100 pb-4">Storage with active TSS</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="block font-black text-slate-900">Single-User TallyPrime</span>
                  <span className="text-xs text-slate-500 font-medium">Free storage with active TSS</span>
                </div>
                <span className="font-black text-[#316852]">1 GB</span>
              </div>
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="block font-black text-slate-900">Multi-User TallyPrime</span>
                  <span className="text-xs text-slate-500 font-medium">Free storage with active TSS</span>
                </div>
                <span className="font-black text-[#316852]">3 GB</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#f0f7f3] border border-[#316852]/10">
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  Use the backup management report to monitor, download, and delete company backups, and manage storage and user rights.
                </p>
              </div>
            </div>

            <button
              onClick={() => openModal('callback', 'NoSky Backup')}
              className="mt-8 w-full py-4 bg-[#316852] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#1e4d3a] transition-all shadow-lg"
            >
              Consult Backup Strategy
            </button>
          </div>
        </div>
      </section> */}

      <UnifiedContactModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        type={modalConfig.type}
        prefillService={modalConfig.service}
        prefillDetails={modalConfig.details}
      />

      <Footer />
    </div>
  );
}
