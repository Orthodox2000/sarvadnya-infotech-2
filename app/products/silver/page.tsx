'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import UnifiedContactModal, { FormType } from '../../components/UnifiedContactModal';

type IconName = 'shield' | 'box' | 'logs' | 'trending' | 'cloud';

function FeatureIcon({ name }: { name: IconName }) {
  const common = 'w-6 h-6';
  const iconColor = "text-[#0371a3]";
  switch (name) {
    case 'shield':
      return (
        <svg className={`${common} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3l7 3v5c0 5-3.1 9.4-7 11-3.9-1.6-7-6-7-11V6l7-3z" />
        </svg>
      );
    case 'box':
      return (
        <svg className={`${common} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
    case 'logs':
      return (
        <svg className={`${common} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'trending':
      return (
        <svg className={`${common} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    case 'cloud':
      return (
        <svg className={`${common} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      );
    default:
      return null;
  }
}

const features = [
  { title: 'GST Compliance', desc: 'GST-ready billing, returns, and e-invoicing for day-to-day work.', icon: 'shield' as IconName },
  { title: 'Inventory Management', desc: 'Track stock and valuation on one simple workstation.', icon: 'box' as IconName },
  { title: 'Financial Reporting', desc: 'Get quick reports for cash flow, sales, and purchases.', icon: 'logs' as IconName },
  { title: 'Security Protocols', desc: 'Keep your company data protected on the local machine.', icon: 'shield' as IconName },
  { title: 'Scalable Foundation', desc: 'Clean, efficient workflows designed for single-user accounting operations.', icon: 'trending' as IconName },
  { title: 'Cloud Integration', desc: 'Pair Silver with TallyDrive and other backup options.', icon: 'cloud' as IconName },
];

const useCases = [
  'Sole proprietors who handle accounting themselves',
  'Small retailers that want a simple and dependable setup',
  'Freelancers and service businesses with one active user',
  'Businesses that want a dedicated single-user accounting setup',
];

const upgradePath = [
  {
    title: 'Silver foundation',
    desc: 'Built for one user on one machine with the core accounting and inventory workflow.',
  },
  {
    title: 'Gold expands access',
    desc: 'Gold adds shared access and is designed for teams that need the same company data on one network.',
  },
  {
    title: 'Server adds control',
    desc: 'Server adds stronger monitoring and access management for larger multi-user environments.',
  },
];

const pricingRows = [
  {
    plan: 'TallyPrime Silver',
    bestFor: 'One user on one workstation',
    price: 'Contact for pricing',
  },
  {
    plan: 'TallyPrime Gold',
    bestFor: 'Shared teams on one local network',
    price: 'Contact for pricing',
  },
  {
    plan: 'TallyPrime Server',
    bestFor: 'Larger teams needing tighter control',
    price: 'Contact for pricing',
  },
];

export default function TallySilverPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<FormType>('quote');
  const [modalService, setModalService] = useState('TallyPrime Silver');
  const [modalDetails, setModalDetails] = useState('');

  const openModal = (type: FormType, service = 'TallyPrime Silver', details = '') => {
    setModalType(type);
    setModalService(service);
    setModalDetails(details);
    setIsModalOpen(true);
  };

  const ctaGroups = [
    {
      title: 'Sales and Demo',
      buttons: [
        { label: 'Get Price', type: 'quote' as FormType },
        { label: 'Book Demo', type: 'demo' as FormType },
        {
          label: 'Contact Sales',
          href: '/contact?service=TallyPrime%20Silver&message=Please%20share%20pricing%20and%20setup%20details%20for%20TallyPrime%20Silver.',
        },
      ],
    },
    {
      title: 'Compare and Explore',
      buttons: [
        { label: 'Compare Editions', href: '/products#compare' },
        { label: 'Find Solution', href: '/find-solution' },
        { label: 'Browse Tutorials', href: '/tutorials' },
      ],
    },
    {
      title: 'Support and Setup',
      buttons: [
        { label: 'Technical Support', type: 'support' as FormType },
        { label: 'AMC Services', href: '/services/amc' },
        { label: 'Corporate Training', href: '/services/corporate-training' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3fafc] text-slate-900 font-sans">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0371a3] to-[#00ABE4] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_32%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80 text-[10px] font-black uppercase tracking-[0.25em] mb-6 backdrop-blur-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-white" />
              Single-user edition
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6">
              TallyPrime <span className="text-[#c0c0c0]">Silver</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 max-w-3xl leading-relaxed font-medium mb-8">
              Silver is the dedicated single-user edition for solo accountants and small retailers. It covers core accounting, inventory, GST, and reporting on one machine.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() =>
                  openModal(
                    'quote',
                    'TallyPrime Silver',
                    'Please share pricing, deployment guidance, and setup details for TallyPrime Silver.'
                  )
                }
                className="px-8 py-4 bg-white text-[#0371a3] rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] transition-transform shadow-xl"
              >
                Enquire Now
              </button>
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-2xl border border-white/20 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-colors text-center"
              >
                Get Price
              </button>
            </div>
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Users', value: '1' },
                { label: 'Focus', value: 'Simple' },
                { label: 'Access', value: 'Local' },
                { label: 'Setup', value: 'Standalone' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/8 backdrop-blur-sm p-4">
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
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[#0371a3] text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm">
              What Silver includes
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Core features for one-person operations.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-lg bg-[#f3fafc] text-[#0371a3] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <FeatureIcon name={feature.icon} />
                </div>
                <h3 className="text-sm font-black text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-slate-100 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f9ff] border border-[#0371a3]/15 text-[#0371a3] text-[10px] font-black uppercase tracking-[0.2em] mb-5">
              Best fit
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">When Silver is the right choice</h2>
            <ul className="space-y-3">
              {useCases.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
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

          <div className="bg-slate-900 text-white rounded-[2rem] p-7 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#00ABE4]/15 rounded-full blur-[80px] -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/75 text-[10px] font-black uppercase tracking-[0.2em] mb-5">
                Upgrade path
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">
                Gold and Server build on Silver.
              </h2>
              <div className="space-y-4">
                {upgradePath.map((item) => (
                  <div key={item.title} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#00ABE4] mb-2">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-white/85">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] p-7 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-8">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0371a3] mb-3">Help Menu</div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">How can we help with TallyPrime Silver?</h2>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
              We can compare Silver, Gold, and Server for your team and point you to the right next step.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {ctaGroups.map((group) => (
              <div key={group.title} className="space-y-4">
                <h3 className="font-black text-slate-900">{group.title}</h3>
                <div className="flex flex-col gap-2">
                  {group.buttons.map((button) =>
                    'type' in button ? (
                      <button
                        key={button.label}
                        onClick={() => openModal(button.type as FormType, 'TallyPrime Silver')}
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

        <section id="pricing" className="bg-white rounded-[2rem] p-7 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-8">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0371a3] mb-3">Pricing</div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">Silver is built for single-user operations.</h2>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
              Silver covers core accounting, inventory, GST, and reporting for one user on one machine.
            </p>
          </div>

          <div className="grid xl:grid-cols-[1fr_1.35fr] gap-6">
            <div className="grid gap-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Structure</div>
                <p className="text-sm leading-relaxed text-slate-700">
                  Core accounting, inventory, GST, and reporting for one person on one machine.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Best fit</div>
                <p className="text-sm leading-relaxed text-slate-700">
                  Sole owners, freelancers, and small retailers who want a simple setup.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Upgrade path</div>
                <p className="text-sm leading-relaxed text-slate-700">
                  Move to Gold for shared office access or Server for stronger control.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-[1.5rem] border border-slate-100">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    <th className="px-5 py-4">Plan</th>
                    <th className="px-5 py-4">Best for</th>
                    <th className="px-5 py-4">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingRows.map((row, index) => (
                    <tr key={row.plan} className={index < pricingRows.length - 1 ? 'border-b border-slate-100' : ''}>
                      <td className="px-5 py-4 font-black text-slate-900">{row.plan}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{row.bestFor}</td>
                      <td className="px-5 py-4 text-sm font-black text-[#0371a3]">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <UnifiedContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        prefillService={modalService}
        prefillDetails={modalDetails}
      />
    </div>
  );
}
