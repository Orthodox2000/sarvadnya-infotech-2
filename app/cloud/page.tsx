'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '../components/Footer';
import UnifiedContactModal, { FormType } from '../components/UnifiedContactModal';

type CloudSolution = {
  id: string;
  title: string;
  badge: string;
  summary: string;
  features: string[];
};

const cloudSolutions: CloudSolution[] = [
  {
    id: 'aws',
    title: 'AWS Cloud Server',
    badge: 'Official cloud',
    summary: 'Hosted Tally on AWS for 24/7 remote access with managed backups.',
    features: ['AWS infrastructure', 'Auto backups', 'Remote access', 'Scalable'],
  },
  {
    id: 'windows',
    title: 'Windows VM',
    badge: 'Native desktop',
    summary: 'A dedicated Windows VM with familiar desktop feel and remote access.',
    features: ['Native desktop', 'Printer access', 'Office integration', 'Admin control'],
  },
  {
    id: 'backup',
    title: 'NoSky Backup',
    badge: 'Data protection',
    summary: 'Encrypted backup and quick recovery with scheduled protection.',
    features: ['AES-256 encryption', 'Scheduled tasks', 'One-click restore', 'Incremental'],
  },
];

const solutionThemes = [
  { strip: 'bg-[#f59e0b]', badge: 'bg-amber-50 text-amber-700 border-amber-200', cardBg: 'bg-[#fffbeb]', border: 'border-amber-200', tagBorder: 'border-amber-200 text-amber-700' },
  { strip: 'bg-[#0371a3]', badge: 'bg-[#f0f9ff] text-[#0371a3] border-[#0371a3]/20', cardBg: 'bg-[#f0f9ff]', border: 'border-[#0371a3]/20', tagBorder: 'border-[#0371a3]/15 text-[#0371a3]' },
  { strip: 'bg-[#22c55e]', badge: 'bg-green-50 text-green-700 border-green-200', cardBg: 'bg-[#f0fdf4]', border: 'border-green-200', tagBorder: 'border-green-200 text-green-700' },
];

export default function CloudPage() {
  const [mounted, setMounted] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: FormType; service: string; details: string }>({
    isOpen: false,
    type: 'enquire',
    service: '',
    details: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const openModal = (type: FormType, service: string = '', details: string = '') => {
    setModalConfig({ isOpen: true, type, service, details });
  };

  const ctaGroups = [
    {
      title: 'Sales and Demo',
      buttons: [
        { label: 'Request Guidance', type: 'quote' as FormType },
        { label: 'Book Demo', type: 'demo' as FormType },
        {
          label: 'Contact Sales',
          href: '/contact?service=Cloud%20Solutions&message=Please%20share%20deployment%20details%20and%20setup%20options%20for%20cloud%20solutions.',
        },
      ],
    },
    {
      title: 'Support and Backup',
      buttons: [
        { label: 'Technical Support', type: 'support' as FormType },
        { label: 'TallyDrive Backup', href: '/products/tallydrive' },
        { label: 'Corporate Training', href: '/services/corporate-training' },
      ],
    },
    {
      title: 'Quick Links',
      buttons: [
        { label: 'Find My Solution', href: '/find-solution' },
        { label: 'Talk to Consultant', type: 'callback' as FormType },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3fafc] text-slate-900">
      <section className="bg-white relative pt-8 pb-10 md:pt-10 md:pb-12 px-6 overflow-hidden border-b border-[#0371a3]/10">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-sky-200/20 blur-[100px] -mr-24 -mt-24" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0371a3]/10 border border-[#0371a3]/20 text-[#0371a3] text-[10px] font-black uppercase tracking-[0.2em] mb-5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#0371a3]"></span>
            Cloud products
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 leading-tight tracking-tight">
            <span className="text-[#0371a3]">TallyPrime</span><br />
            Cloud & Hosting
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            Host it, access it remotely, keep it safe — independent cloud products for TallyPrime. Pick the ones you need, skip the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button
              onClick={() => openModal('callback', 'Cloud Consultation', 'Please guide me on cloud setup, deployment, and access planning.')}
              className="px-6 py-3 bg-[#0371a3] text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#00ABE4] transition-all shadow-lg shadow-[#0371a3]/20 active:scale-[0.97]"
            >
              Consult Our Team
            </button>
            <a
              href="#compare"
              className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all text-center active:scale-[0.97]"
            >
              Explore Options
            </a>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <section id="compare">
          <div className={`flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="max-w-3xl">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0371a3] mb-3">Cloud products</div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                Pick what you need, <span className="text-[#0371a3]">each works independently.</span>
              </h2>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
               Hosting, remote desktop, and backup are independent products. Mix and match freely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cloudSolutions.map((solution, i) => {
              const theme = solutionThemes[i];
              return (
                <div
                  key={solution.id}
                  id={solution.id}
                  className={`relative overflow-hidden rounded-[1.5rem] border p-6 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 scroll-mt-24 ${theme.cardBg} ${theme.border}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <div className={`absolute inset-x-0 top-0 h-1.5 ${theme.strip}`} />

                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.18em] w-fit ${theme.badge}`}>
                    {solution.badge}
                  </span>

                  <h3 className="mt-4 text-lg font-black text-slate-900 tracking-tight">
                    {solution.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {solution.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4 mb-5">
                    {solution.features.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center rounded-full border bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${theme.tagBorder}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex gap-2.5 pt-2">
                    <button
                      onClick={() => openModal('quote', solution.title, `Please share deployment guidance for ${solution.title}.`)}
                      className="flex-1 rounded-xl py-3 text-[11px] font-black uppercase tracking-[0.14em] text-white transition-all hover:shadow-md active:scale-[0.97]"
                      style={{ backgroundColor: i === 0 ? '#f59e0b' : i === 1 ? '#0371a3' : '#22c55e' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = i === 0 ? '#fbbf24' : i === 1 ? '#00ABE4' : '#4ade80' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = i === 0 ? '#f59e0b' : i === 1 ? '#0371a3' : '#22c55e' }}
                    >
                      Enquire
                    </button>
                    <Link
                      href={`/cloud/${solution.id}`}
                      className={`flex-1 rounded-xl border py-3 text-center text-[11px] font-black uppercase tracking-[0.14em] transition-colors bg-white hover:bg-slate-50 ${theme.tagBorder}`}
                    >
                      Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        <section className="bg-white rounded-[2rem] p-6 md:p-7 border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0371a3] mb-3">Why cloud</div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 mb-6">Benefits of moving to cloud</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { title: 'Access anywhere', desc: 'Work from any device, any location.' },
              { title: 'Auto backups', desc: 'Scheduled protection with easy restore.' },
              { title: 'Lower IT cost', desc: 'No server hardware or maintenance.' },
              { title: 'Team sync', desc: 'Multi-user access without VPN setups.' },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <h3 className="text-sm font-black text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`bg-white rounded-[2rem] p-7 md:p-8 border border-slate-100 shadow-sm transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-8">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0371a3] mb-3">Help Menu</div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">How can we help with TallyPrime Cloud?</h2>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
              Each product is independent — take hosting, remote desktop, backup, or any combination.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {ctaGroups.map((group) => (
              <div key={group.title} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0371a3]" />
                  <h3 className="font-black text-slate-900 text-sm">{group.title}</h3>
                </div>
                <div className="flex flex-col gap-1.5">
                  {group.buttons.map((button) =>
                    'type' in button ? (
                      <button
                        key={button.label}
                        onClick={() => openModal(button.type as FormType, 'Cloud Consultation')}
                        className="text-left text-sm text-slate-600 hover:text-[#0371a3] transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-50"
                      >
                        {button.label}{' ->'}
                      </button>
                    ) : (
                      <Link
                        key={button.label}
                        href={button.href}
                        className="text-left text-sm text-slate-600 hover:text-[#0371a3] transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-50"
                      >
                        {button.label}{' ->'}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

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
