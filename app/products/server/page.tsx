'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import UnifiedContactModal, { FormType } from '../../components/UnifiedContactModal';

type ModalConfig = {
  isOpen: boolean;
  type: FormType;
  service: string;
  details: string;
};

type IconName = 'users' | 'shield' | 'logs' | 'branches' | 'speed' | 'storage' | 'compare' | 'handoff';

const buildContactHref = (service: string, message: string) =>
  `/contact?service=${encodeURIComponent(service)}&message=${encodeURIComponent(message)}`;

function FeatureIcon({ name }: { name: IconName }) {
  const common = 'w-6 h-6';

  switch (name) {
    case 'users':
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-1a4 4 0 00-4-4h-1m0 5H7m10 0v-1a4 4 0 00-4-4H11a4 4 0 00-4 4v1m10 0H7m4-11a4 4 0 100-8 4 4 0 000 8zm6 3a3 3 0 10-6 0 3 3 0 006 0zm-12 0a3 3 0 116 0 3 3 0 01-6 0z" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3l7 3v5c0 5-3.1 9.4-7 11-3.9-1.6-7-6-7-11V6l7-3z" />
        </svg>
      );
    case 'logs':
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      );
    case 'branches':
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 5a3 3 0 100 6 3 3 0 000-6zm12 0a3 3 0 100 6 3 3 0 000-6zM6 13a3 3 0 100 6 3 3 0 000-6zm12 0a3 3 0 100 6 3 3 0 000-6zM9 8h6M9 16h6M12 11v2" />
        </svg>
      );
    case 'speed':
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 'storage':
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7l8-4 8 4-8 4-8-4zm0 0v10l8 4 8-4V7M12 11v10" />
        </svg>
      );
    case 'compare':
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M4 8h6M4 16h6M14 8h6M14 16h6" />
        </svg>
      );
    case 'handoff':
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h10m0 0-4-4m4 4-4 4m6-7h2a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
        </svg>
      );
    default:
      return null;
  }
}

const serverHighlights = [
  {
    title: 'Concurrent work for larger teams',
    desc: 'Keep finance, sales, dispatch, and management on the same live data set without the stop-start friction of a single desktop workflow.',
    icon: 'users' as IconName,
  },
  {
    title: 'Hidden data folders',
    desc: 'Protect sensitive company data from accidental local exposure while still giving the right people the access they need.',
    icon: 'shield' as IconName,
  },
  {
    title: 'Advanced user logs',
    desc: 'See who changed what and when, making internal reviews, audits, and handovers easier to manage.',
    icon: 'logs' as IconName,
  },
  {
    title: 'Branch-ready control',
    desc: 'Centralize company data for multi-branch teams while keeping access clean, fast, and consistent.',
    icon: 'branches' as IconName,
  },
  {
    title: 'High-speed shared access',
    desc: 'Designed for heavier workloads where many users need to search, view, and post transactions at the same time.',
    icon: 'speed' as IconName,
  },
  {
    title: 'Enterprise backup readiness',
    desc: 'Pair the server edition with enterprise-grade backup planning and TallyDrive storage for stronger continuity.',
    icon: 'storage' as IconName,
  },
];

const sharedCapabilities = [
  'Same familiar TallyPrime accounting and inventory workflows used in Silver and Gold.',
  'GST-ready billing, reporting, and compliance processes with minimal retraining.',
  'Direct migration path from existing TallyPrime data and day-to-day processes.',
  'Access to the same support ecosystem: TSS, training, AMC, and implementation help.',
];

const serverDifferentiators = [
  'Built for higher concurrency when many users must work in parallel.',
  'Centralized control for multiple teams, branches, or departments.',
  'Hidden data folders and stronger data governance for sensitive records.',
  'Detailed user activity logs for accountability and internal audit comfort.',
  'Better fit for enterprise storage and backup planning, including TallyDrive Enterprise.',
];

const editionCards = [
  {
    name: 'Silver',
    badge: 'Single User',
    summary: 'Best when one owner or one operator handles accounting, inventory, and compliance from a single machine.',
    fit: 'Simple, focused, and ideal for solo operations.',
    link: '/products/silver',
  },
  {
    name: 'Gold',
    badge: 'Multi-User LAN',
    summary: 'Best when a growing team needs simultaneous access on a local network with shared business data.',
    fit: 'A strong step up for collaborative office teams.',
    link: '/products/gold',
  },
  {
    name: 'Server',
    badge: 'Enterprise Control',
    summary: 'Best when many users, multiple departments, or branch teams need fast shared access with tighter control.',
    fit: 'The enterprise layer that adds scale, visibility, and governance.',
    link: '/products/server',
    featured: true,
  },
];

const useCases = [
  {
    title: 'Distribution and wholesale',
    desc: 'Operations that have order entry, dispatch, billing, and collections happening at the same time across one central dataset.',
  },
  {
    title: 'Multi-branch head office',
    desc: 'Companies that need one source of truth for head office, stores, and regional branches without data duplication.',
  },
  {
    title: 'Audit-sensitive finance teams',
    desc: 'Teams that want advanced user logs and cleaner accountability for month-end closing and internal review.',
  },
  {
    title: 'Shared service centers',
    desc: 'Departments that process high volumes of vouchers, approvals, and reporting requests for multiple businesses or divisions.',
  },
];

const ctaGroups = [
  {
    title: 'Sales and Demo',
    buttons: [
      {
        label: 'Request Enterprise Quote',
        type: 'quote' as FormType,
        service: 'TallyPrime Server',
        details: 'Need pricing for high-concurrency users, secure data access, and enterprise deployment.',
      },
      {
        label: 'Book Live Demo',
        type: 'demo' as FormType,
        service: 'TallyPrime Server Demo',
        details: 'Show how Server improves multi-user work, security, and audit visibility.',
      },
      {
        label: 'Talk to an Architect',
        type: 'callback' as FormType,
        service: 'TallyPrime Server Consultation',
        details: 'Need help deciding if Server is the right step up from Silver or Gold.',
      },
      {
        label: 'Open Contact Form',
        href: buildContactHref(
          'TallyPrime Server',
          'Please guide me on enterprise deployment, user control, and branch access.'
        ),
      },
    ],
  },
  {
    title: 'Compare Editions',
    buttons: [
      { label: 'Compare with Silver', href: '/products/silver' },
      { label: 'Compare with Gold', href: '/products/gold' },
      { label: 'View all Editions', href: '/products#compare' },
      { label: 'Find the Right Plan', href: '/find-solution' },
    ],
  },
  {
    title: 'Implementation',
    buttons: [
      {
        label: 'Server Support',
        type: 'support' as FormType,
        service: 'TallyPrime Server Support',
        details: 'Need help with deployment, access control, or performance tuning.',
      },
      { label: 'AMC Services', href: '/services/amc' },
      { label: 'Tally Customization', href: '/services/tdl' },
      { label: 'Cloud Backup', href: '/cloud' },
      { label: 'TSS Renewal', href: '/services/tss' },
    ],
  },
  {
    title: 'Learning and Onboarding',
    buttons: [
      { label: 'Corporate Training', href: '/services/corporate-training' },
      { label: 'Browse Tutorials', href: '/tutorials' },
      { label: 'Search Help', href: '/search' },
      {
        label: 'Contact Us Directly',
        href: buildContactHref(
          'TallyPrime Server',
          'I want help with migration, deployment, and team onboarding.'
        ),
      },
    ],
  },
];

export default function TallyServerPage() {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    type: 'quote',
    service: 'TallyPrime Server',
    details: '',
  });

  const openModal = (type: FormType, service = 'TallyPrime Server', details = '') => {
    setModalConfig({
      isOpen: true,
      type,
      service,
      details,
    });
  };

  return (
    <div className="min-h-screen bg-[#f3fafc] text-slate-900 font-sans">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0371a3] via-[#025b8a] to-[#131921] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(0,171,228,0.2),_transparent_30%)]" />
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-white/10 rounded-full blur-[130px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[32rem] h-[32rem] bg-[#00ABE4]/20 rounded-full blur-[120px] -ml-32 -mb-32" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/85 text-[10px] font-black uppercase tracking-[0.25em] mb-6 backdrop-blur-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#00ABE4] animate-pulse" />
              Enterprise Edition
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6">
              TallyPrime Server
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed font-medium mb-8">
              The server edition keeps the same familiar TallyPrime workflow as Silver and Gold, but adds enterprise-level concurrency,
              tighter data control, and audit-friendly visibility for larger teams.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() =>
                  openModal(
                    'quote',
                    'TallyPrime Server',
                    'Need enterprise pricing, deployment guidance, and a comparison with Silver or Gold.'
                  )
                }
                className="px-8 py-4 bg-white text-[#0371a3] rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] transition-transform shadow-xl"
              >
                Request Quote
              </button>
              <button
                onClick={() =>
                  openModal(
                    'demo',
                    'TallyPrime Server',
                    'Please show how Server handles multiple teams, branch access, and secure data control.'
                  )
                }
                className="px-8 py-4 bg-[#00ABE4] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] transition-transform shadow-xl shadow-[#00ABE4]/20"
              >
                Book Demo
              </button>
              <Link
                href="/products#compare"
                className="px-8 py-4 rounded-2xl border border-white/20 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-colors text-center"
              >
                Compare Editions
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Concurrent users', value: '50+' },
                { label: 'Data control', value: 'Centralized' },
                { label: 'Audit visibility', value: 'Advanced logs' },
                { label: 'Backup planning', value: 'Enterprise ready' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/12 bg-white/8 backdrop-blur-sm p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/55">{stat.label}</div>
                  <div className="mt-2 text-xl md:text-2xl font-black text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        <section>
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0371a3] mb-3">Why Server</div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
                Built for teams that have outgrown a desktop-only workflow.
              </h2>
            </div>
            <Link
              href={buildContactHref(
                'TallyPrime Server',
                'I need help deciding whether my team is ready for Server.'
              )}
              className="hidden md:inline-flex px-5 py-3 rounded-full bg-white border border-slate-100 text-slate-700 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:text-[#0371a3] hover:border-[#0371a3]/20 transition-colors"
            >
              Open Contact Form
            </Link>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {serverHighlights.map((item) => (
              <article
                key={item.title}
                className="group bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#f3fafc] text-[#0371a3] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <FeatureIcon name={item.icon} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f9ff] border border-[#00ABE4]/15 text-[#0371a3] text-[10px] font-black uppercase tracking-[0.2em] mb-5">
              Same Foundation
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-6">What Server shares with Silver and Gold</h2>
            <ul className="space-y-4">
              {sharedCapabilities.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-700">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#00ABE4]/15 rounded-full blur-[90px] -mr-20 -mt-20" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-5 border border-white/10">
                Unique to Server
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-6">What makes it different</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {serverDifferentiators.map((item) => (
                  <div key={item} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 h-5 w-5 rounded-full bg-[#00ABE4]/20 text-[#00ABE4] flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <p className="text-sm leading-relaxed text-white/85">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
          <div className="grid lg:grid-cols-3 gap-6">
            {editionCards.map((card) => (
              <article
                key={card.name}
                className={`rounded-[2rem] p-7 border flex flex-col ${
                  card.featured
                    ? 'border-[#0371a3] shadow-2xl shadow-sky-100'
                    : 'border-slate-100 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">
                      {card.badge}
                    </div>
                    <h3 className="text-2xl font-black tracking-tight text-slate-900">{card.name}</h3>
                  </div>
                  {card.featured && (
                    <span className="px-3 py-1 rounded-full bg-[#0371a3] text-white text-[10px] font-black uppercase tracking-[0.2em]">
                      Recommended
                    </span>
                  )}
                </div>

                <p className="text-slate-600 leading-relaxed mb-5">{card.summary}</p>
                <p className="text-sm font-bold text-[#0371a3] mb-8">{card.fit}</p>

                <div className="mt-auto">
                  <Link
                    href={card.link}
                    className={`inline-flex w-full justify-center py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-colors ${
                      card.featured
                        ? 'bg-[#0371a3] text-white hover:bg-[#00ABE4]'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Know More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f9ff] border border-[#00ABE4]/15 text-[#0371a3] text-[10px] font-black uppercase tracking-[0.2em] mb-5">
              Unique Use Cases
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-6">Where Server shines the most</h2>
            <div className="space-y-4">
              {useCases.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-slate-50 border border-slate-100 p-5 hover:border-[#0371a3]/15 transition-colors"
                >
                  <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0371a3] to-[#131921] text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.14),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(0,171,228,0.2),_transparent_30%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-5">
                Upgrade Signal
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-4">
                Already on Silver or Gold?
              </h2>
              <p className="text-white/80 leading-relaxed mb-8">
                Server is usually the next step when your team needs the same trusted TallyPrime environment, but with stronger control,
                more visibility, and a better fit for heavier shared workloads.
              </p>

              <div className="space-y-4">
                {[
                  'Your team is waiting on one another to finish tasks in the same company data.',
                  'You need better visibility into who updated records and when.',
                  'Multiple departments or branches must work from the same source of truth.',
                  'Sensitive ledgers or company data need stricter internal control.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/8 border border-white/10 p-4">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00ABE4]/20 text-[#00ABE4]">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <p className="text-sm leading-relaxed text-white/90">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() =>
                    openModal(
                      'callback',
                      'TallyPrime Server',
                      'Please call back with a deployment plan for our current Silver or Gold environment.'
                    )
                  }
                  className="flex-1 py-4 rounded-xl bg-white text-[#0371a3] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#00ABE4] hover:text-white transition-colors"
                >
                  Request Callback
                </button>
                <Link
                  href={buildContactHref(
                    'TallyPrime Server',
                    'I want to discuss migration from Silver or Gold to Server.'
                  )}
                  className="flex-1 py-4 rounded-xl border border-white/15 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-colors text-center"
                >
                  Contact Team
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-8">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0371a3] mb-3">Help Menu</div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">How can we help with Server?</h2>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
              Use the buttons below to jump straight to the right team, the right service, or the right form. Every contact action
              either opens the shared `/api/contact` form or sends users to a real site page.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {ctaGroups.map((group) => (
              <div key={group.title} className="space-y-4">
                <h3 className="font-black text-slate-900">{group.title}</h3>
                <div className="flex flex-col gap-2">
                  {group.buttons.map((button) =>
                    'type' in button ? (
                      <button
                        key={button.label}
                        onClick={() =>
                          openModal(
                            button.type as FormType,
                            button.service ?? 'TallyPrime Server',
                            button.details ?? ''
                          )
                        }
                        className="text-left text-sm text-slate-600 hover:text-[#0371a3] transition-colors py-1"
                      >
                        {button.label}{' ->'}
                      </button>
                    ) : (
                      <Link
                        key={button.label}
                        href={button.href}
                        className="text-left text-sm text-slate-600 hover:text-[#0371a3] transition-colors py-1"
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

      <Footer />

      <UnifiedContactModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        type={modalConfig.type}
        prefillService={modalConfig.service}
        prefillDetails={modalConfig.details}
      />
    </div>
  );
}
