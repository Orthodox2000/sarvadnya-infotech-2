'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import UnifiedContactModal, { FormType } from '../../components/UnifiedContactModal';

type IconName = 'server' | 'refresh' | 'signal' | 'database' | 'shield' | 'headset';

function FeatureIcon({ name }: { name: IconName }) {
  const common = 'w-6 h-6';
  const iconColor = "text-[#0371a3]";
  switch (name) {
    case 'server':
      return (
        <svg className={`${common} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      );
    case 'refresh':
      return (
        <svg className={`${common} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    case 'signal':
      return (
        <svg className={`${common} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.14 0M4.929 8.93a15 15 0 0114.142 0" />
        </svg>
      );
    case 'database':
      return (
        <svg className={`${common} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={`${common} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3l7 3v5c0 5-3.1 9.4-7 11-3.9-1.6-7-6-7-11V6l7-3z" />
        </svg>
      );
    case 'headset':
      return (
        <svg className={`${common} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728M8.464 15.536a5 5 0 010-7.072M15.536 8.464a5 5 0 010 7.072M12 12h.01" />
        </svg>
      );
    default:
      return null;
  }
}

const features = [
  { title: 'AWS Infrastructure', desc: 'Hosted on official AWS cloud infrastructure for strong uptime and broad availability.', icon: 'server' as IconName },
  { title: 'Automatic Backups', desc: 'Managed backup and recovery planning so your data stays protected without manual effort.', icon: 'refresh' as IconName },
  { title: 'Remote Access', desc: 'Approved users can access TallyPrime from anywhere, enabling distributed team workflows.', icon: 'signal' as IconName },
  { title: 'Scalable Storage', desc: 'Easily scale your storage and compute resources as your team and data grow.', icon: 'database' as IconName },
  { title: 'Encrypted Data', desc: 'Data is encrypted at rest and in transit, keeping financial records secure.', icon: 'shield' as IconName },
  { title: 'Professional Support', desc: 'Implementation and ongoing support from certified Tally partners.', icon: 'headset' as IconName },
];

const benefits = [
  'Strong uptime and broad cloud availability',
  'Managed backup and recovery planning',
  'Easy to scale as your team grows',
  'Works well for distributed teams',
  'No local server maintenance required',
  'Pay for what you use model',
];

const useCases = [
  'Businesses that want hosted TallyPrime access from different locations',
  'Teams that prefer a managed cloud environment over on-premise servers',
  'Owners who want secure access without maintaining a local server room',
  'MSMEs planning for growth and business continuity',
  'Organisations with multiple branches needing unified data access',
];

export default function AWSCloudPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<FormType>('quote');
  const [modalService, setModalService] = useState('AWS Cloud Server');
  const [modalDetails, setModalDetails] = useState('');

  const openModal = (type: FormType, service = 'AWS Cloud Server', details = '') => {
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
          href: '/contact?service=AWS%20Cloud%20Server&message=Please%20share%20pricing%20and%20deployment%20details%20for%20AWS%20Cloud%20Server.',
        },
      ],
    },
    {
      title: 'Support and Setup',
      buttons: [
        { label: 'Technical Support', type: 'support' as FormType },
        { label: 'Backup Guidance', type: 'quote' as FormType },
        { label: 'Corporate Training', href: '/services/corporate-training' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3fafc] text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0371a3] to-[#0f172a] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(0,171,228,0.1),_transparent_32%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80 text-[10px] font-black uppercase tracking-[0.25em] mb-6 backdrop-blur-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-white" />
              Official cloud
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6">
              AWS <span className="text-[#e2e8f0]">Cloud Server</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 max-w-3xl leading-relaxed font-medium mb-8">
              Hosted TallyPrime on AWS for MSMEs that want 24/7 access, managed backup flow, and reliable remote work without maintaining local servers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => openModal('quote', 'AWS Cloud Server', 'Please share pricing, deployment guidance, and setup details for AWS Cloud Server.')}
                className="px-8 py-4 bg-white text-[#0371a3] rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] transition-transform shadow-xl"
              >
                Enquire Now
              </button>
              <a
                href="#pricing"
                className="px-8 py-4 rounded-2xl border border-white/20 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-colors text-center"
              >
                Get Price
              </a>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        <section>
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[#0371a3] text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm">
              What AWS Cloud includes
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Enterprise infrastructure, MSME simplicity.
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
              Key benefits
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Why teams choose AWS Cloud</h2>
            <ul className="space-y-3">
              {benefits.map((item) => (
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
                Best fit
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">
                When AWS Cloud is the right choice
              </h2>
              <div className="space-y-4">
                {useCases.map((item) => (
                  <div key={item} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-sm leading-relaxed text-white/85">{item}</p>
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
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">How can we help with AWS Cloud Server?</h2>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
              We can help you get started with AWS Cloud Server for your TallyPrime setup.
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
                        onClick={() => openModal(button.type as FormType, 'AWS Cloud Server')}
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
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">Simple pricing for cloud hosting.</h2>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
              AWS Cloud Server pricing depends on your deployment size and usage pattern. Contact us for a custom quote.
            </p>
          </div>

          <div className="grid xl:grid-cols-[1fr_1.35fr] gap-6">
            <div className="grid gap-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Structure</div>
                <p className="text-sm leading-relaxed text-slate-700">
                  Fully managed AWS-hosted TallyPrime with encrypted storage and remote access.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Best fit</div>
                <p className="text-sm leading-relaxed text-slate-700">
                  MSMEs that want secure remote access to TallyPrime without on-premise server maintenance.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Next step</div>
                <p className="text-sm leading-relaxed text-slate-700">
                  Share your current setup and team size. We will match the right cloud configuration.
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
                  <tr>
                    <td className="px-5 py-4 font-black text-slate-900">AWS Cloud Server</td>
                    <td className="px-5 py-4 text-sm text-slate-600">Hosted TallyPrime with cloud availability</td>
                    <td className="px-5 py-4 text-sm font-black text-[#0371a3]">Contact for pricing</td>
                  </tr>
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
