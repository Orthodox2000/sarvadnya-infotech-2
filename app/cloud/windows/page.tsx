'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import UnifiedContactModal, { FormType } from '../../components/UnifiedContactModal';

type IconName = 'monitor' | 'printer' | 'grid' | 'settings' | 'signal' | 'sliders';

function FeatureIcon({ name }: { name: IconName }) {
  const common = 'w-6 h-6';
  const iconColor = "text-[#0371a3]";
  switch (name) {
    case 'monitor':
      return (
        <svg className={`${common} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'printer':
      return (
        <svg className={`${common} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      );
    case 'grid':
      return (
        <svg className={`${common} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case 'settings':
      return (
        <svg className={`${common} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'signal':
      return (
        <svg className={`${common} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.14 0M4.929 8.93a15 15 0 0114.142 0" />
        </svg>
      );
    case 'sliders':
      return (
        <svg className={`${common} ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      );
    default:
      return null;
  }
}

const features = [
  { title: 'Native Desktop Feel', desc: 'A dedicated Windows virtual machine that keeps the familiar desktop workflow your team already knows.', icon: 'monitor' as IconName },
  { title: 'Direct Printer Access', desc: 'Print directly from the VM to local printers, making it practical for office environments.', icon: 'printer' as IconName },
  { title: 'Office Integration', desc: 'Seamlessly work with Excel, Word, and other Microsoft tools alongside TallyPrime.', icon: 'grid' as IconName },
  { title: 'Full Admin Control', desc: 'Customise the VM environment to match your IT policies and business preferences.', icon: 'settings' as IconName },
  { title: 'Remote Desktop Access', desc: 'Access the Windows desktop from anywhere using standard remote desktop protocols.', icon: 'signal' as IconName },
  { title: 'Custom VM Sizing', desc: 'Right-sized virtual machine resources based on your team size and workload.', icon: 'sliders' as IconName },
];

const benefits = [
  'Feels close to a local Windows desktop',
  'Useful for printer-heavy office workflows',
  'Good fit for Excel-based reporting tasks',
  'Customisable to your IT preferences',
  'No dedicated hardware required',
  'Familiar environment reduces training time',
];

const useCases = [
  'Teams that rely on desktop add-ons and peripherals',
  'Companies with printer-based invoice and report workflows',
  'IT-managed business environments needing central control',
  'Power users who prefer native Windows tools',
  'Offices transitioning from local servers to cloud access',
];

export default function WindowsVMPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<FormType>('quote');
  const [modalService, setModalService] = useState('Windows VM');
  const [modalDetails, setModalDetails] = useState('');

  const openModal = (type: FormType, service = 'Windows VM', details = '') => {
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
          href: '/contact?service=Windows%20VM&message=Please%20share%20pricing%20and%20deployment%20details%20for%20Windows%20VM.',
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
              Native desktop
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6">
              Windows <span className="text-[#e2e8f0]">VM</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 max-w-3xl leading-relaxed font-medium mb-8">
              A dedicated Windows virtual machine for teams that want the familiar desktop feel with remote access and full peripheral support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => openModal('quote', 'Windows VM', 'Please share pricing, sizing guidance, and setup details for Windows VM.')}
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
              What Windows VM includes
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              The desktop experience, now remote.
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
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Why teams choose Windows VM</h2>
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
                When Windows VM is the right choice
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
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">How can we help with Windows VM?</h2>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
              We can help you get started with a Windows VM for your TallyPrime setup.
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
                        onClick={() => openModal(button.type as FormType, 'Windows VM')}
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
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">Predictable pricing for dedicated VMs.</h2>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
              Windows VM pricing is based on the resources allocated. Contact us for a quote tailored to your team.
            </p>
          </div>

          <div className="grid xl:grid-cols-[1fr_1.35fr] gap-6">
            <div className="grid gap-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Structure</div>
                <p className="text-sm leading-relaxed text-slate-700">
                  Dedicated Windows VM with remote desktop access, peripheral support, and custom sizing.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Best fit</div>
                <p className="text-sm leading-relaxed text-slate-700">
                  Office teams that rely on desktop tools, printers, and a familiar Windows environment.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Next step</div>
                <p className="text-sm leading-relaxed text-slate-700">
                  Tell us about your current setup, peripheral needs, and team size for a custom VM recommendation.
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
                    <td className="px-5 py-4 font-black text-slate-900">Windows VM</td>
                    <td className="px-5 py-4 text-sm text-slate-600">Dedicated desktop-style remote access</td>
                    <td className="px-5 py-4 text-sm font-black text-[#0371a3]">Dedicated VM quote</td>
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
