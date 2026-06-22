'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '../components/Footer';
import UnifiedContactModal, { FormType } from '../components/UnifiedContactModal';

type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  details: {
    shortDescription: string;
    benefits: string[];
    whatYouGet: string[];
    useCases: string[];
  } | null;
};

type CloudSolution = {
  id: string;
  title: string;
  badge: string;
  summary: string;
  bestFor: string;
  features: string[];
  icon: string;
  details: {
    shortDescription: string;
    benefits: string[];
    whatYouGet: string[];
    useCases: string[];
  };
};

const DescriptionPopup = ({ isOpen, onClose, title, details }: PopupProps) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !details) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute right-4 top-4 text-slate-400 hover:text-slate-900" onClick={onClose}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-8">
          <span className="mb-4 inline-flex rounded-full border border-[#0371a3]/15 bg-[#f0f9ff] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#0371a3]">
            Cloud solution
          </span>
          <h3 className="mb-4 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">{title}</h3>
          <p className="border-l-4 border-[#0371a3] pl-5 text-sm leading-relaxed font-medium text-slate-600 italic">
            {details.shortDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0371a3]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00ABE4]" />
              Key benefits
            </h4>
            <ul className="space-y-3">
              {details.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#0371a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              What you get
            </h4>
            <ul className="space-y-3">
              {details.whatYouGet.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#00ABE4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-900">
              Use cases
            </h4>
            <ul className="space-y-3">
              {details.useCases.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button className="mt-8 w-full rounded-2xl bg-slate-900 py-4 font-bold text-white transition-colors hover:bg-[#0371a3]" onClick={onClose}>
          Got it, thanks
        </button>
      </div>
    </div>
  );
};

const cloudSolutions: CloudSolution[] = [
  {
    id: 'aws',
    title: 'AWS Cloud Server',
    badge: 'Official cloud',
    summary: 'Hosted Tally on AWS for 24/7 remote access with managed backups.',
    bestFor: 'Teams needing cloud access without local server maintenance.',
    icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    features: ['AWS infrastructure', 'Auto backups', 'Remote access', 'Scalable'],
    details: {
      shortDescription: 'The official AWS-backed cloud setup for TallyPrime users who want secure, always-available access.',
      benefits: [
        'Strong uptime and broad cloud availability',
        'Managed backup and recovery planning',
        'Easy to scale as your team grows',
        'Works well for distributed teams',
      ],
      whatYouGet: [
        'Official AWS infrastructure',
        'Encrypted data storage approach',
        'Remote access for approved users',
        'Professional implementation support',
      ],
      useCases: [
        'Businesses that want hosted access from different locations',
        'Teams that prefer a managed cloud environment',
        'Owners who want secure access without a local server room',
        'MSMEs planning for growth and continuity',
      ],
    },
  },
  {
    id: 'windows',
    title: 'Windows VM',
    badge: 'Native desktop',
    summary: 'A dedicated Windows VM with familiar desktop feel and remote access.',
    bestFor: 'Office teams using desktop tools, printers, and Microsoft integrations.',
    icon: 'M9.75 17L9 21h6l-.75-4M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    features: ['Native desktop', 'Printer access', 'Office integration', 'Admin control'],
    details: {
      shortDescription: 'A dedicated Windows VM keeps the familiar desktop workflow while making it accessible from wherever your team works.',
      benefits: [
        'Feels close to a local Windows desktop',
        'Useful for printer-heavy office work',
        'Good fit for Excel-based workflows',
        'Customisable to your IT preferences',
      ],
      whatYouGet: [
        'Dedicated Windows resources',
        'Remote desktop access',
        'Peripheral support options',
        'Custom VM sizing guidance',
      ],
      useCases: [
        'Teams that rely on desktop add-ons',
        'Companies with printer-based workflows',
        'IT-managed business environments',
        'Power users who prefer Windows tools',
      ],
    },
  },
  {
    id: 'backup',
    title: 'NoSky Backup',
    badge: 'Data protection',
    summary: 'Encrypted backup and quick recovery with scheduled protection.',
    bestFor: 'Businesses wanting practical disaster recovery and simple restore.',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    features: ['AES-256 encryption', 'Scheduled tasks', 'One-click restore', 'Incremental'],
    details: {
      shortDescription: 'NoSky Backup is designed to protect business data and simplify recovery when something goes wrong.',
      benefits: [
        'Helps reduce the risk of data loss',
        'Suitable for scheduled backup routines',
        'Recovery is easy to explain to teams',
        'Works well as a continuity layer',
      ],
      whatYouGet: [
        'Encrypted cloud backup flow',
        'Automated scheduler',
        'Restore points for recovery',
        'Status visibility for backup health',
      ],
      useCases: [
        'Owners who want regular backup protection',
        'Teams planning for recovery after a failure',
        'Businesses that must protect financial records',
        'MSMEs looking for a simple backup-first setup',
      ],
    },
  },
];

const solutionThemes = [
  { strip: 'bg-[#0371a3]', cardClass: 'bg-white border-slate-200' },
  { strip: 'bg-[#4b91ca]', cardClass: 'bg-[#f8fbff] border-sky-200' },
  { strip: 'bg-slate-400', cardClass: 'bg-white border-slate-200' },
];

const cloudUseCases = [
  {
    title: 'Multi-location work',
    desc: 'Keep users connected even when sales, accounts, and management are in different places.',
  },
  {
    title: 'Lower IT overhead',
    desc: 'Reduce the need to maintain a full on-premise server setup.',
  },
  {
    title: 'Business continuity',
    desc: 'Use backup and recovery options to stay ready for local hardware issues.',
  },
  {
    title: 'Remote supervision',
    desc: 'Let owners and managers review work without being tied to one machine.',
  },
];

export default function CloudPage() {
  const [activePopup, setActivePopup] = useState<{ title: string; details: PopupProps['details'] } | null>(null);
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
        { label: 'Cloud Backup Guidance', href: '/products#tallydrive' },
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

  const cardEnter = (i: number) =>
    `${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`;

  return (
    <div className="min-h-screen bg-[#f3fafc] text-slate-900">
      <DescriptionPopup
        isOpen={!!activePopup}
        onClose={() => setActivePopup(null)}
        title={activePopup?.title || ''}
        details={activePopup?.details || null}
      />

      <section className="bg-white relative pt-12 pb-16 md:pt-20 md:pb-24 px-6 overflow-hidden border-b border-[#0371a3]/10">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-white/40 blur-[130px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-sky-200/30 blur-[110px] -ml-24 -mb-24" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-400/10 border border-sky-500/20 text-sky-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse"></span>
            Cloud solutions
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] via-[#4b91ca] to-[#0371a3] drop-shadow-[0_2px_15px_rgba(0,171,228,0.2)]">TallyPrime</span> <br />
            Cloud & Hosting
          </h1>
          <p className="text-slate-600/80 text-sm md:text-xl max-w-4xl mx-auto leading-relaxed font-semibold">
            Host it, access it remotely, and keep it safe — cloud solutions designed for MSMEs who want TallyPrime wherever work happens.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button
              onClick={() => openModal('callback', 'Cloud Consultation', 'Please guide me on cloud setup, deployment, and access planning.')}
              className="px-8 py-4 bg-[#0371a3] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#00ABE4] transition-all shadow-lg shadow-[#0371a3]/20 active:scale-[0.97]"
            >
              Consult Our Team
            </button>
            <a
              href="#compare"
              className="px-8 py-4 rounded-2xl border border-slate-200 bg-white text-slate-700 font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all text-center active:scale-[0.97]"
            >
              Explore Options
            </a>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        <section id="compare">
          <div className={`flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="max-w-3xl">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0371a3] mb-3">Pick your cloud setup</div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                Three options, <span className="text-[#0371a3]">one right fit.</span>
              </h2>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
              Hosting, desktop VM, or backup — each built for a specific team need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
            {cloudSolutions.map((solution, i) => (
              <div
                key={solution.id}
                id={solution.id}
                className={`relative overflow-hidden rounded-[1.5rem] border p-4 md:p-[18px] flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 min-h-[19rem] md:min-h-[20.5rem] scroll-mt-24 ${solutionThemes[i].cardClass}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className={`absolute inset-x-0 top-0 h-1 ${solutionThemes[i].strip}`} />

                <div className="relative mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                    {solution.badge}
                  </span>
                  <h3 className="mt-3 text-lg md:text-xl font-black text-slate-900 tracking-tight">
                    {solution.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-snug text-slate-600">
                    {solution.summary}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3 mb-3.5">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">
                    Good for
                  </div>
                  <p className="text-[13px] text-slate-700 leading-snug">
                    {solution.bestFor}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {solution.features.slice(0, 3).map((tag) => (
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
                    onClick={() => openModal('quote', solution.title, `Please share deployment guidance for ${solution.title}.`)}
                    className="flex-1 rounded-xl bg-[#0371a3] py-2.5 text-[10px] font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#00ABE4]"
                  >
                    Enquire
                  </button>
                  <Link
                    href={`/cloud/${solution.id}`}
                    className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-center text-[10px] font-black uppercase tracking-[0.14em] text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Know More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`grid lg:grid-cols-2 gap-6 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-slate-100 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f9ff] border border-[#0371a3]/15 text-[#0371a3] text-[10px] font-black uppercase tracking-[0.2em] mb-5">
              Why cloud helps
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">
              Cloud is useful when the business cannot stay tied to one machine.
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {cloudUseCases.map((item, i) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-slate-50 border border-slate-100 p-4 transition-all duration-500 hover:border-[#0371a3]/15 hover:shadow-sm"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="w-7 h-7 rounded-lg bg-[#0371a3]/10 flex items-center justify-center text-[#0371a3] mb-2.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={
                        i === 0 ? 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' :
                        i === 1 ? 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' :
                        i === 2 ? 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' :
                        'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      } />
                    </svg>
                  </div>
                  <h3 className="mb-1.5 text-sm font-black uppercase tracking-[0.18em] text-[#0371a3]">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2rem] p-7 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#00ABE4]/15 rounded-full blur-[80px] -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0371a3]/10 rounded-full blur-[60px] -ml-12 -mb-12" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/75 text-[10px] font-black uppercase tracking-[0.2em] mb-5 w-fit">
                One platform
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4">
                Cloud works with your existing TallyPrime setup.
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-white/80 mt-auto">
                <p>
                  Whether you need hosted access, a remote desktop, or automated backup — the cloud layer fits on top of your familiar TallyPrime workflow.
                </p>
                <p>
                  Keep the same interface, same data, same processes. Just make it reachable from anywhere and safer from day to day.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={`bg-white rounded-[2rem] p-7 md:p-8 border border-slate-100 shadow-sm transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-8">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0371a3] mb-3">Help Menu</div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">How can we help with TallyPrime Cloud?</h2>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
              We can help you decide between hosting, remote desktop, and backup-first cloud setups.
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
