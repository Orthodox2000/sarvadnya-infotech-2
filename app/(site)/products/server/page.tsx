'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../../../components/Footer';
import UnifiedContactModal, { FormType } from '../../../components/UnifiedContactModal';

const BRAND_PRIMARY = '#006569';
const BRAND_SECONDARY = '#045A57';

const features = [
  { title: 'True Concurrent Access', desc: 'Unlike Gold\'s folder-sharing model, TallyPrime Server provides true server-based data management. Every user gets their own thread with equal priority — requests are processed in parallel, not in queues, so no one ever waits for another user.' },
  { title: 'Zero System Downtime', desc: 'Run backups, generate massive financial reports, or perform year-end processes while the rest of your team continues billing. No one has to stop working — ever.' },
  { title: 'Advanced Monitoring & Control', desc: 'Administrators get a dedicated console to monitor active users, view real-time activity, and manage data access. You see exactly who is doing what, and can intervene instantly if needed.' },
  { title: 'Data Reliability', desc: 'Data consistency is maintained even if network connectivity is lost or a client system crashes. The crash is isolated to that client — no other user or the server data is affected.' },
  { title: 'Data Security by Design', desc: 'TallyPrime Server hides your physical data files completely. Employees only need the server name to log in, preventing unauthorized copying or theft of your financial records.' },
  { title: 'Simple to Deploy', desc: 'Quick one-step installation that takes less than an hour on any existing computer in your network. No dedicated physical server required — and no training needed for your team.' },
];

const faqs: { q: string; a: string; cta?: { label: string; type: string } | { label: string; href: string } }[] = [
  {
    q: 'What is TallyPrime Server?',
    a: 'TallyPrime Server is an enterprise-class product that converts peer-to-peer data access (like Gold\'s folder-sharing model) to true server-based data management. It enhances concurrency, delivers faster performance with multi-threaded architecture, provides a detailed activity log, and strengthens data security by hiding physical data files.',
    cta: { label: 'Get a Custom Quote', type: 'quote' },
  },
  {
    q: 'How is TallyPrime Server different from TallyPrime Gold?',
    a: 'TallyPrime Gold uses folder sharing for multiple users — which works well on a LAN but has limitations. Server provides true concurrent access with multi-threaded architecture, hides data files for security, gives administrators real-time monitoring and a complete activity log. If Gold is your multi-user accounting tool, Server is the infrastructure upgrade that enhances concurrency and data security.',
    cta: { label: 'See Products', href: '/products' },
  },
  {
    q: 'I use TallyPrime Gold on a LAN — how many users can I have?',
    a: 'TallyPrime Gold supports unlimited users on a Local Area Network (LAN). There is no hard user limit when all your employees are on the same office network. The limitation only appears when you move to virtual environments or need enterprise-level performance.',
    cta: { label: 'View Gold Pricing', href: '/products/gold' },
  },
  {
    q: 'What about Cloud, RDP, or Citrix? Are there limits?',
    a: 'Yes. If you use TallyPrime Gold in a virtual environment (Cloud, RDP, or Citrix), Tally limits you to 10 free Tally Virtual Users (TVUs). If you need more than 10 virtual users, you must purchase additional TVU subscription packs from Tally.',
    cta: { label: 'Explore Cloud Solutions', href: '/cloud' },
  },
  {
    q: 'What is a Tally Virtual User (TVU)?',
    a: 'A TVU is a license required when TallyPrime is accessed through virtual desktops like Cloud, RDP, or Citrix — instead of a direct LAN connection. Each concurrent virtual connection consumes one TVU slot. TallyPrime Gold comes with 10 free TVUs; additional slots require a paid subscription.',
  },
  {
    q: 'Do I need a physical server to use TallyPrime Server?',
    a: 'No. TallyPrime Server is a software product installed on any existing computer in your network. It does not require a dedicated physical server — a standard office PC with a good network connection is sufficient.',
  },
  {
    q: 'What happens if a client system crashes?',
    a: 'Since TallyPrime Server manages data on the server side with multi-threaded architecture, a client crash has no impact on other users or the server data. The affected user simply reconnects and continues — no data loss, no disruption to the rest of the team.',
  },
  {
    q: 'How does TallyPrime Server improve concurrency?',
    a: 'TallyPrime Server uses multi-threaded architecture to process every user\'s request in parallel — eliminating blocking and task queuing. Combined with enhanced data security through hidden data files and a complete activity log, it delivers enterprise-grade performance for growing businesses.',
    cta: { label: 'Get Expert Advice', type: 'quote' },
  },
];

const navSections = [
  { id: 'overview', label: 'Product Information' },
  { id: 'features', label: 'Features' },
  { id: 'faqs', label: 'FAQ' },
  { id: 'pricing', label: 'Pricing' },
];

export default function TallyServerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<FormType>('quote');
  const [modalService, setModalService] = useState('TallyPrime Server');
  const [modalDetails, setModalDetails] = useState('');
  const [activeNav, setActiveNav] = useState('overview');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [stickyNav, setStickyNav] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryContact, setInquiryContact] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const openModal = (type: FormType, service = 'TallyPrime Server', details = '') => {
    setModalType(type);
    setModalService(service);
    setModalDetails(details);
    setIsModalOpen(true);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryContact || !inquiryMsg) {
      setInquiryStatus({ type: 'error', text: 'Please fill all required fields.' });
      return;
    }
    setInquiryLoading(true);
    setInquiryStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inquiryName,
          email: inquiryContact,
          contact: inquiryContact,
          service: 'TallyPrime Server',
          formType: 'inquiry',
          description: inquiryMsg,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setInquiryStatus({ type: 'success', text: 'Thank you! We will get back to you soon.' });
      setInquiryName('');
      setInquiryContact('');
      setInquiryMsg('');
    } catch {
      setInquiryStatus({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setInquiryLoading(false);
    }
  };

  const handleSidebarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPhone) {
      setFormMsg({ type: 'error', text: 'Please fill all required fields.' });
      return;
    }
    setFormLoading(true);
    setFormMsg(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          contact: formPhone,
          service: 'TallyPrime Server',
          formType: 'callback',
          description: 'Requesting a call back for TallyPrime Server pricing.',
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setFormMsg({ type: 'success', text: 'Thank you! We will call you back shortly.' });
      setFormName('');
      setFormEmail('');
      setFormPhone('');
    } catch {
      setFormMsg({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const navEl = navRef.current;
      if (navEl) {
        const navTop = navEl.getBoundingClientRect().top;
        setStickyNav(navTop <= 0);
      }

      const scrollY = window.scrollY + 120;
      for (let i = navSections.length - 1; i >= 0; i--) {
        const el = document.getElementById(navSections[i].id);
        if (el && el.offsetTop <= scrollY) {
          setActiveNav(navSections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#C0C0C0]/15 text-slate-900 font-sans">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="py-2.5">
            <ul className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <li><Link href="/" className="hover:text-[#006569] transition-colors">Home</Link></li>
              <li className="text-slate-300 mx-0.5">/</li>
              <li><Link href="/products" className="hover:text-[#006569] transition-colors">Products</Link></li>
              <li className="text-slate-300 mx-0.5">/</li>
              <li className="text-slate-800 font-semibold">TallyPrime Server</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Product Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-start gap-5">
            {/* Logo */}
            <div className="w-18 h-18 shrink-0 rounded-xl border border-slate-200 bg-white flex items-center justify-center shadow-sm p-2.5">
              <Image src="/PartnerBrands/Tally-Software.png" alt="TallyPrime Server" width={48} height={48} className="object-contain" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">TallyPrime Server</h1>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border"
                  style={{
                    backgroundColor: `${BRAND_PRIMARY}10`,
                    borderColor: `${BRAND_PRIMARY}25`,
                    color: BRAND_PRIMARY,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND_PRIMARY }} />
                  Enterprise Product
                </span>
              </div>
              <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed max-w-3xl">
                The ultimate enterprise product for growing businesses. Convert peer-to-peer folder sharing into true server-based data management — with enhanced concurrency, zero downtime, complete activity log, and advanced administrative control.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex flex-col gap-2 shrink-0">
              <button
                onClick={() => openModal('demo', 'TallyPrime Server')}
                className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:scale-[1.02]"
                style={{ backgroundColor: BRAND_PRIMARY }}
              >
                Get Now
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all hover:scale-[1.02]"
                style={{ borderColor: BRAND_PRIMARY, color: BRAND_PRIMARY }}
              >
                Get Pricing
              </button>
            </div>
          </div>
        </div>

        {/* Mobile action buttons */}
        <div className="md:hidden flex gap-2 px-6 pb-4">
          <button
            onClick={() => openModal('demo', 'TallyPrime Server')}
            className="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all"
            style={{ backgroundColor: BRAND_PRIMARY }}
          >
            Get Now
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all"
            style={{ borderColor: BRAND_PRIMARY, color: BRAND_PRIMARY }}
          >
            Get Pricing
          </button>
        </div>
      </div>

      {/* Sticky Navigation */}
      <div
        ref={navRef}
        className={`bg-white border-b border-slate-200 transition-all duration-200 ${
          stickyNav ? 'sticky top-0 z-100 shadow-sm' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {navSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="relative shrink-0 px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors"
                style={{ color: activeNav === section.id ? BRAND_PRIMARY : '#64748b' }}
              >
                {section.label}
                {activeNav === section.id && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: BRAND_PRIMARY }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ========== LEFT CONTENT (9/12) ========== */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">

            {/* Overview */}
            <section id="overview" className="scroll-mt-16 bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">What is TallyPrime Server?</h2>
              <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                <p>
                  TallyPrime Server is an enterprise-class software that converts peer-to-peer data access to server-based data management. It provides TallyPrime Gold users the necessary power and control for their growing business needs.
                </p>
                <p>
                  It is a simple-to-deploy product that provides concurrent, fast and secure access to Tally data along with advanced monitoring and administrative control. Businesses experience increased productivity, better utilisation of man-hours, enhanced speed of operations and superior business performance.
                </p>
                <p>
                  If your business has outgrown a standard LAN and requires enterprise-grade data handling, upgrading to TallyPrime Server architecture delivers enhanced concurrency, superior speed, and robust data security — something no folder-sharing model can achieve.
                </p>
              </div>
              {/* Hero stats */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Architecture', value: 'Multi-Threaded' },
                  { label: 'Concurrency', value: 'Multi-Threaded' },
                  { label: 'Security', value: 'Data Vault' },
                  { label: 'Setup', value: '< 1 Hour' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border p-3 text-center"
                    style={{
                      backgroundColor: `${BRAND_PRIMARY}06`,
                      borderColor: `${BRAND_PRIMARY}15`,
                    }}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</div>
                    <div className="text-lg font-black mt-0.5" style={{ color: BRAND_PRIMARY }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Features */}
            <section id="features" className="scroll-mt-16 bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Key Features of TallyPrime Server</h2>
              <p className="text-sm text-slate-500 mb-5">
                Smarter monitoring, zero interruptions, and total data control for your growing team.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-lg border border-slate-100 p-4 hover:shadow-sm transition-shadow"
                    style={{ backgroundColor: `${BRAND_PRIMARY}03` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: BRAND_PRIMARY }}
                      />
                      <h3 className="text-sm font-bold text-slate-900">{feature.title}</h3>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* When Server is the right choice + Compatible Systems */}
            <section className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Is TallyPrime Server right for your business?</h2>
                <ul className="space-y-3">
                  {[
                    'Your team has outgrown TallyPrime Gold and you need 10+ users performing operations simultaneously.',
                    'You use Cloud, RDP, or Citrix and have hit the 10 free TVU limit.',
                    'You need true concurrent access — no queuing, no blocking, no waiting.',
                    'You want administrators to monitor who is doing what in real time.',
                    'You need to run backups or reports without stopping your team from billing.',
                    'Your business spans multiple branches and you need massive data handling.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span
                        className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${BRAND_PRIMARY}15` }}
                      >
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill={BRAND_PRIMARY}>
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Compatible Systems</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Supported OS</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Windows Server 2016+', 'Windows 10 Pro', 'Windows 11 Pro'].map((os) => (
                        <span key={os} className="inline-flex rounded-md px-2.5 py-1 text-[12px] font-medium border" style={{ borderColor: `${BRAND_PRIMARY}25`, backgroundColor: `${BRAND_PRIMARY}06`, color: BRAND_PRIMARY }}>
                          {os}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Network Setup</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Local Area Network (LAN)', 'VPN for Branch Offices'].map((net) => (
                        <span key={net} className="inline-flex rounded-md px-2.5 py-1 text-[12px] font-medium text-slate-600 bg-slate-50 border border-slate-200">
                          {net}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Virtual Environments</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Cloud (TVU Required)', 'RDP (TVU Required)', 'Citrix (TVU Required)'].map((env) => (
                        <span key={env} className="inline-flex rounded-md px-2.5 py-1 text-[12px] font-medium border" style={{ borderColor: '#d9770625', backgroundColor: '#d9770606', color: '#d97706' }}>
                          {env}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faqs" className="scroll-mt-16 bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">TallyPrime Server FAQs</h2>
              <p className="text-sm text-slate-500 mb-5">Frequently asked questions about upgrading to the Server product.</p>
              <div className="space-y-0 divide-y divide-slate-100">
                {faqs.map((faq, idx) => (
                  <div key={idx}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="flex items-center justify-between w-full py-3.5 text-left transition-colors"
                    >
                      <h3 className="text-sm font-bold text-slate-900 pr-4">{faq.q}</h3>
                      <span
                        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-200"
                        style={{
                          backgroundColor: openFaq === idx ? BRAND_PRIMARY : '#f1f5f9',
                          transform: openFaq === idx ? 'rotate(45deg)' : 'rotate(0deg)',
                        }}
                      >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill={openFaq === idx ? '#fff' : '#94a3b8'}>
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                      </span>
                    </button>
                    {openFaq === idx && (
                      <div className="pb-3.5 text-sm text-slate-600 leading-relaxed pr-8">
                        {faq.a}
                        {faq.cta && (
                          <div className="mt-3">
                            {'href' in faq.cta && faq.cta.href ? (
                              <a
                                href={faq.cta.href}
                                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:scale-[1.02]"
                                style={{ backgroundColor: BRAND_PRIMARY }}
                              >
                                {faq.cta.label}
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </a>
                            ) : 'type' in faq.cta ? (
                              <button
                                type="button"
                                onClick={() => openModal((faq.cta as { type: string }).type as FormType, 'TallyPrime Server')}
                                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:scale-[1.02]"
                                style={{ backgroundColor: BRAND_PRIMARY }}
                              >
                                {faq.cta.label}
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </button>
                            ) : null}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Still not satisfied? */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="text-center mb-5">
                <h2 className="text-lg font-bold text-slate-900">Want to test the power of Server?</h2>
                <p className="text-sm text-slate-500 mt-1">Tell us about your team size, and we can set up a trial of TallyPrime Server to prove how fast your system can be.</p>
              </div>
              <form onSubmit={handleInquirySubmit} className="max-w-xl mx-auto space-y-3">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 bg-slate-50"
                  style={{ '--tw-ring-color': BRAND_PRIMARY } as React.CSSProperties}
                  required
                />
                <input
                  type="text"
                  placeholder="Email or Phone *"
                  value={inquiryContact}
                  onChange={(e) => setInquiryContact(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 bg-slate-50"
                  style={{ '--tw-ring-color': BRAND_PRIMARY } as React.CSSProperties}
                  required
                />
                <textarea
                  placeholder="Describe your requirement *"
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 bg-slate-50 resize-none"
                  style={{ '--tw-ring-color': BRAND_PRIMARY } as React.CSSProperties}
                  required
                />
                <button
                  type="submit"
                  disabled={inquiryLoading}
                  className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:scale-[1.01] disabled:opacity-60"
                  style={{ backgroundColor: BRAND_PRIMARY }}
                >
                  {inquiryLoading ? 'Sending...' : 'Get Expert Advice'}
                </button>
                {inquiryStatus && (
                  <p
                    className={`text-[11px] text-center leading-relaxed font-medium ${
                      inquiryStatus.type === 'success' ? 'text-teal-600' : 'text-red-500'
                    }`}
                  >
                    {inquiryStatus.text}
                  </p>
                )}
              </form>
            </section>

            {/* Pricing - Contact Sales */}
            <section id="pricing" className="scroll-mt-16 bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">TallyPrime Server Pricing</h2>
              <p className="text-sm text-slate-500 mb-5">Enterprise-grade performance for medium and large businesses.</p>
              <div className="rounded-lg border border-slate-200 p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${BRAND_PRIMARY}10` }}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={BRAND_PRIMARY} strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Contact Sales for Pricing</h3>
                <p className="text-sm text-slate-500 mb-4 max-w-md mx-auto">
                  TallyPrime Server pricing varies based on your infrastructure and team size. Get in touch with our enterprise team for a custom quote.
                </p>
                <button
                  type="button"
                  onClick={() => openModal('quote', 'TallyPrime Server', 'Please share pricing details for TallyPrime Server.')}
                  className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: BRAND_PRIMARY }}
                >
                  Contact Sales
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </section>

          </div>

          {/* ========== RIGHT SIDEBAR (3/12) ========== */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">

            {/* Get Best Quote */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 text-white" style={{ backgroundColor: BRAND_SECONDARY }}>
                <h3 className="text-sm font-bold">Upgrade Your Infrastructure</h3>
                <p className="text-[12px] text-white/75 mt-1 leading-relaxed">
                  Connect with our certified enterprise team to discuss network deployment, data migration, and branch syncing.
                </p>
              </div>
              <form onSubmit={handleSidebarSubmit} className="p-5 space-y-3">
                <input
                  type="text"
                  placeholder="Name *"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 bg-slate-50"
                  style={{ '--tw-ring-color': BRAND_PRIMARY } as React.CSSProperties}
                  required
                />
                <input
                  type="email"
                  placeholder="Business Email *"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 bg-slate-50"
                  style={{ '--tw-ring-color': BRAND_PRIMARY } as React.CSSProperties}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 bg-slate-50"
                  style={{ '--tw-ring-color': BRAND_PRIMARY } as React.CSSProperties}
                  required
                />
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:scale-[1.01] disabled:opacity-60"
                  style={{ backgroundColor: BRAND_PRIMARY }}
                >
                  {formLoading ? 'Sending...' : 'Request a Call Back'}
                </button>
                {formMsg && (
                  <p
                    className={`text-[11px] text-center leading-relaxed font-medium ${
                      formMsg.type === 'success' ? 'text-teal-600' : 'text-red-500'
                    }`}
                  >
                    {formMsg.text}
                  </p>
                )}
                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                  By submitting, you agree to our Terms of Use and Privacy Policy.
                </p>
              </form>
            </div>

            {/* Most Popular Software */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Most Popular Software</h3>
              <div className="space-y-4">
                {[
                  { name: 'TallyPrime Gold', slug: '/products/gold', rating: '4.8', reviews: '120' },
                  { name: 'TallyPrime Server', slug: '/products/server', rating: '4.7', reviews: '85' },
                  { name: 'Tally on WhatsApp', slug: '/services/tally-on-whatsapp', rating: '4.9', reviews: '200' },
                  { name: 'Tally Cloud Access', slug: '/cloud/tallycloudaccess', rating: '4.8', reviews: '85' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.slug}
                    className="flex items-center gap-3 group"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                      style={{ backgroundColor: BRAND_PRIMARY }}
                    >
                      {item.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-700 group-hover:text-[#006569] transition-colors truncate">
                        {item.name}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="#f59e0b">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {item.rating}
                        <span className="text-slate-300">({item.reviews} reviews)</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/products"
                className="block mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold uppercase tracking-wider text-center"
                style={{ color: BRAND_PRIMARY }}
              >
                View All Products
              </Link>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: 'Tally Products', href: '/products' },
                  { label: 'Get Now', type: 'demo' as FormType },
                  { label: 'Technical Support', type: 'support' as FormType },
                  { label: 'AMC Services', href: '/services/amc' },
                  { label: 'Corporate Training', href: '/services/corporate-training' },
                ].map((link) =>
                  'href' in link ? (
                    <Link
                      key={link.label}
                      href={link.href!}
                      className="block text-sm text-slate-600 hover:text-[#006569] transition-colors py-1"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() => openModal(link.type!, 'TallyPrime Server')}
                      className="block w-full text-left text-sm text-slate-600 hover:text-[#006569] transition-colors py-1"
                    >
                      {link.label}
                    </button>
                  )
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

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
