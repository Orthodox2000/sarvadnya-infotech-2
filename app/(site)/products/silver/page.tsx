'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../../../components/Footer';
import UnifiedContactModal, { FormType } from '../../../components/UnifiedContactModal';

// CHANGE: 2026-09-16 — replaced inline brand styles with Tailwind token classes, added stacked mobile pricing cards, focus-visible rings, and readability font-size bumps.

type PricingRow =
  | { product: string; validity: string; base: string; gst: string; total: string }
  | {
      product: string;
      validity: string;
      base: string;
      gst: string;
      total: string;
      strike: string;
      discount: string;
      save: string;
    };

const pricingRows: PricingRow[] = [
  {
    product: 'TallyPrime Single User',
    validity: 'Lifetime',
    base: '22,500',
    gst: '4,050',
    total: '26,550/-',
  },
  {
    product: 'TSS Single User (1 Year)',
    validity: '1 Year',
    base: '4,500',
    gst: '810',
    total: '5,310/-',
  },
  {
    product: 'TSS Single User (2 Years)',
    validity: '2 Years',
    base: '8,100',
    gst: '1,458',
    total: '8,496/-',
    strike: '9,558',
    discount: '10% OFF',
    save: 'You save 1,062/-',
  },
];

const features = [
  { title: 'Automated Tax Compliance', desc: 'Generate tax-ready invoices and automated return files tailored to your local tax laws (like VAT or GST) instantly, keeping you penalty-free.' },
  { title: 'Effortless Inventory Tracking', desc: 'Always know exactly what\'s in your shop or warehouse. Track stock levels, set reorder alerts, and monitor your most profitable items.' },
  { title: 'Instant Business Insights', desc: 'Stop waiting for the accountant. See your daily cash flow, pending payments, and profit margins with a single click.' },
  { title: 'Complete Data Privacy', desc: 'Your financial data stays securely on your own local machine. You are in total control of who sees your business numbers.' },
  { title: 'Grows With Your Business', desc: 'Start small with one user. When you\'re ready to expand, easily upgrade to a multi-user setup without re-entering any of your old data.' },
  { title: 'Cloud Backup Ready', desc: 'Easily pair Silver with TallyDrive to ensure your daily work is automatically saved to the cloud for ultimate peace of mind.' },
];

const faqs: { q: string; a: string; cta?: { label: string; type: string } | { label: string; href: string } }[] = [
  {
    q: 'Who is this version actually for?',
    a: 'It is built for small business owners, freelancers, and small shop owners who only need one user to access the accounting system at a time.',
    cta: { label: 'Get Silver Now', type: 'quote' },
  },
  {
    q: 'Does it handle my local taxes and e-invoicing?',
    a: 'Yes. TallyPrime Silver automatically calculates your local taxes (such as VAT or GST) on every bill and generates ready-to-file returns to keep you 100% compliant.',
  },
  {
    q: 'What if I hire more staff and need them to use Tally too?',
    a: 'No problem! You can easily upgrade your license to TallyPrime Gold (our multi-user version) later. All your data moves over automatically with zero hassle.',
    cta: { label: 'Explore Gold', href: '/products/gold' },
  },
  {
    q: 'Do I need a powerful computer or fast internet?',
    a: 'Not at all. Silver runs beautifully on standard Windows laptops and desktops. Plus, since it stores data locally, you can keep billing your customers even if your internet goes down.',
  },
  {
    q: 'Will I get help if I get stuck?',
    a: 'Absolutely. We are always available for telephonic support to help you with installation and initial setup. For advanced or ongoing assistance, you can opt for remote paid services or paid support. For regular, worry-free support, our AMC plan gives you priority troubleshooting, health checks, and unlimited remote help.',
    cta: { label: 'Get Support', type: 'support' },
  },
];

const navSections = [
  { id: 'overview', label: 'Product Information' },
  { id: 'features', label: 'Features' },
  { id: 'faqs', label: 'FAQ' },
  { id: 'pricing', label: 'Pricing' },
];

export default function TallySilverPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<FormType>('quote');
  const [modalService, setModalService] = useState('TallyPrime Silver');
  const [modalDetails, setModalDetails] = useState('');
  const [activeNav, setActiveNav] = useState('overview');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [stickyNav, setStickyNav] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

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

  const openModal = (type: FormType, service = 'TallyPrime Silver', details = '') => {
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
          service: 'TallyPrime Silver',
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
          service: 'TallyPrime Silver',
          formType: 'callback',
          description: 'Requesting a call back for TallyPrime Silver pricing.',
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
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ol className="flex items-center gap-1.5 py-2.5 text-xs font-medium text-slate-500">
            <li><Link href="/" className="hover:text-[#006569] transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]">Home</Link></li>
            <li className="text-slate-300" aria-hidden="true">/</li>
            <li><Link href="/products" className="hover:text-[#006569] transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]">Products</Link></li>
            <li className="text-slate-300" aria-hidden="true">/</li>
            <li className="text-slate-800 font-semibold" aria-current="page">TallyPrime Silver</li>
          </ol>
        </div>
      </nav>

      {/* Product Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="size-16 sm:size-18 shrink-0 rounded-xl border border-slate-200 bg-white flex items-center justify-center shadow-sm p-2.5">
              <Image src="/PartnerBrands/Tally-Software.png" alt="TallyPrime Silver" width={48} height={48} className="object-contain" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">TallyPrime Silver</h1>
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider border bg-[#006569]/10 border-[#006569]/25 text-[#006569]">
                  <span className="size-1.5 rounded-full bg-[#006569]" aria-hidden="true" />
                  Single-User
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed max-w-3xl">
                Everything you need as a small business for billing, inventory, and tax compliance. Simple to learn, works on any laptop, and your data stays 100% private on your own computer.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex flex-col gap-2 shrink-0">
              <button
                onClick={() => openModal('demo', 'TallyPrime Silver')}
                className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all bg-[#006569] hover:bg-[#045A57] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2"
              >
                Get Now
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-[#006569] text-[#006569] transition-all hover:bg-[#006569]/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2"
              >
                Get Pricing
              </button>
            </div>
          </div>
        </div>

        {/* Mobile action buttons */}
        <div className="md:hidden flex gap-2 px-4 pb-4">
          <button
            onClick={() => openModal('demo', 'TallyPrime Silver')}
            className="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all bg-[#006569] hover:bg-[#045A57] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2"
          >
            Get Now
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-[#006569] text-[#006569] transition-all hover:bg-[#006569]/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {navSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`relative shrink-0 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] ${
                  activeNav === section.id ? 'text-[#006569]' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {section.label}
                {activeNav === section.id && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006569]"
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ========== LEFT CONTENT (9/12) ========== */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">

            {/* Overview */}
            <section id="overview" className="scroll-mt-16 bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">What is TallyPrime Silver?</h2>
              <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                <p>
                  Running a small business is hard enough without struggling with complicated accounting software.
                  TallyPrime Silver is built specifically for small business owners, freelancers, and small retailers.
                  It gives you everything you need to manage your invoicing, track your stock, and generate tax
                  returns — all safely stored on your own computer.
                </p>
                <p>
                  There are no complex network setups or confusing IT requirements. You just install it and start
                  billing immediately. And the best part? When your business grows and you hire more staff, your
                  Silver data seamlessly upgrades to our multi-user Gold product without losing a single invoice.
                </p>
              </div>
              {/* Hero stats from original */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Users', value: '1 User' },
                  { label: 'Focus', value: 'Easy Billing' },
                  { label: 'Data', value: '100% Private' },
                  { label: 'Setup', value: 'Instant' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-[#006569]/15 p-3 text-center bg-[#006569]/5"
                  >
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</div>
                    <div className="text-lg font-black mt-0.5 text-[#006569]">{stat.value}</div>
                  </div>
                ))}
              </div>
            </section>



            {/* Features */}
            <section id="features" className="scroll-mt-16 bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Why MSME Owners Love TallyPrime Silver</h2>
              <p className="text-sm text-slate-500 mb-5">
                All the billing, inventory, and compliance tools a solo business needs — without the complexity.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-lg border border-slate-100 p-4 bg-[#006569]/5 hover:shadow-sm hover:border-[#006569]/20 transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="size-2 rounded-full shrink-0 bg-[#006569]"
                        aria-hidden="true"
                      />
                      <h3 className="text-sm font-bold text-slate-900">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* When Silver is the right choice + Upgrade path */}
            <section className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">TallyPrime Silver is right fit when:</h2>
                <ul className="space-y-3">
                  {[
                    'You manage all your business billing and accounting by yourself on one computer.',
                    'You want a simple, one-time setup without needing to hire an IT networking expert.',
                    'You are tired of generating invoices manually and calculating taxes on calculators.',
                    'You need a reliable system that works perfectly even if your internet goes down.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span
                        className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#006569]/15"
                        aria-hidden="true"
                      >
                        <svg className="size-2.5 text-[#006569]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Compatible Systems</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Supported OS</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Windows 7', 'Windows 8', 'Windows 10', 'Windows 11'].map((os) => (
                        <span key={os} className="inline-flex rounded-md px-2.5 py-1 text-xs font-medium border border-[#006569]/25 bg-[#006569]/5 text-[#006569]">
                          {os}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Devices</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Desktop', icon: 'M4 7v10h16V7H4zm2 2h12v6H6V9z' },
                        { label: 'Laptop', icon: 'M4 6h16v10H4V6zm2 2h12v6H6V8zm4 8v2h4v-2' },
                      ].map((device) => (
                        <span key={device.label} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200">
                          <svg className="size-3.5 text-slate-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d={device.icon} />
                          </svg>
                          {device.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faqs" className="scroll-mt-16 bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">TallyPrime Silver FAQs</h2>
              <p className="text-sm text-slate-500 mb-5">Frequently asked questions about TallyPrime Silver.</p>
              <div className="space-y-0 divide-y divide-slate-100">
                {faqs.map((faq, idx) => {
                  const open = openFaq === idx;
                  return (
                    <div key={idx}>
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? null : idx)}
                        aria-expanded={open}
                        aria-controls={`faq-panel-${idx}`}
                        className="flex items-center justify-between w-full py-3.5 text-left transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
                      >
                        <h3 className="text-sm font-bold text-slate-900 pr-4">{faq.q}</h3>
                        <span
                          className={`shrink-0 size-5 rounded-full flex items-center justify-center transition-transform duration-200 ${
                            open ? 'bg-[#006569] rotate-45 text-white' : 'bg-slate-100 text-slate-400'
                          }`}
                          aria-hidden="true"
                        >
                          <svg className="size-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                          </svg>
                        </span>
                      </button>
                      {open && (
                        <div id={`faq-panel-${idx}`} className="pb-3.5 text-sm text-slate-600 leading-relaxed pr-8">
                          {faq.a}
                          {faq.cta && (
                            <div className="mt-3">
                              {'href' in faq.cta && faq.cta.href ? (
                                <a
                                  href={faq.cta.href}
                                  className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all bg-[#006569] hover:bg-[#045A57] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2"
                                >
                                  {faq.cta.label}
                                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                  </svg>
                                </a>
                              ) : 'type' in faq.cta ? (
                                <button
                                  type="button"
                                  onClick={() => openModal((faq.cta as { type: string }).type as FormType, 'TallyPrime Silver')}
                                  className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all bg-[#006569] hover:bg-[#045A57] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2"
                                >
                                  {faq.cta.label}
                                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                  </svg>
                                </button>
                              ) : null}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Still not satisfied? */}
            <section className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
              <div className="text-center mb-5">
                <h2 className="text-lg font-bold text-slate-900">Not sure which version you need?</h2>
                <p className="text-sm text-slate-500 mt-1">Tell us a bit about your business, and our experts will help you choose the right Tally setup.</p>
              </div>
              <form onSubmit={handleInquirySubmit} className="max-w-xl mx-auto space-y-3">
                <div>
                  <label htmlFor="inquiry-name" className="sr-only">Your Name</label>
                  <input
                    id="inquiry-name"
                    type="text"
                    placeholder="Your Name *"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-[#006569] focus:ring-2 focus:ring-[#006569]/20 placeholder:text-slate-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="inquiry-contact" className="sr-only">Email or Phone</label>
                  <input
                    id="inquiry-contact"
                    type="text"
                    placeholder="Email or Phone *"
                    value={inquiryContact}
                    onChange={(e) => setInquiryContact(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-[#006569] focus:ring-2 focus:ring-[#006569]/20 placeholder:text-slate-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="inquiry-msg" className="sr-only">Describe your requirement</label>
                  <textarea
                    id="inquiry-msg"
                    placeholder="Describe your requirement *"
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-[#006569] focus:ring-2 focus:ring-[#006569]/20 placeholder:text-slate-400 resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={inquiryLoading}
                  className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all bg-[#006569] hover:bg-[#045A57] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2"
                >
                  {inquiryLoading ? 'Sending...' : 'Get Expert Advice'}
                </button>
                {inquiryStatus && (
                  <p
                    role="status"
                    className={`text-xs text-center leading-relaxed font-medium ${
                      inquiryStatus.type === 'success' ? 'text-teal-600' : 'text-red-500'
                    }`}
                  >
                    {inquiryStatus.text}
                  </p>
                )}
              </form>
            </section>

            {/* Pricing - Hidden reveal */}
            <section id="pricing" className="scroll-mt-16 bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">TallyPrime Silver Pricing</h2>
              <p className="text-sm text-slate-500 mb-5">Final pricing for TallyPrime Silver (Single User) including 18% GST.</p>
              <button
                type="button"
                onClick={() => setShowPricing(!showPricing)}
                aria-expanded={showPricing}
                aria-controls="pricing-panel"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all bg-[#006569] hover:bg-[#045A57] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2"
              >
                {showPricing ? 'Hide Pricing' : 'View Price'}
                <svg className={`size-3.5 transition-transform duration-200 ${showPricing ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showPricing && (
                <div id="pricing-panel" className="mt-5">
                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                          <th scope="col" className="px-4 py-3">Product / Service</th>
                          <th scope="col" className="px-4 py-3">Validity</th>
                          <th scope="col" className="px-4 py-3">Base Price (INR)</th>
                          <th scope="col" className="px-4 py-3">GST 18% (INR)</th>
                          <th scope="col" className="px-4 py-3">Total (INR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pricingRows.map((row) => (
                          <tr key={row.product} className="border-b border-slate-100 last:border-0">
                            <td className="px-4 py-3 font-bold text-slate-900">{row.product}</td>
                            <td className="px-4 py-3 text-slate-600">{row.validity}</td>
                            <td className="px-4 py-3 text-slate-600">{row.base}</td>
                            <td className="px-4 py-3 text-slate-600">{row.gst}</td>
                            <td className="px-4 py-3">
                              {'strike' in row ? (
                                <>
                                  <span className="text-slate-400 line-through mr-1.5">{row.strike}</span>
                                  <span className="font-bold text-teal-600">{row.total}</span>
                                  <span className="inline-flex items-center rounded-full px-2 py-0.5 ml-2 text-[10px] font-bold bg-teal-50 text-teal-600 border border-teal-200">{row.discount}</span>
                                  <p className="text-xs text-teal-600 mt-0.5 font-medium">{row.save}</p>
                                </>
                              ) : (
                                <span className="font-bold text-[#006569]">{row.total}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile stacked cards */}
                  <div className="sm:hidden space-y-3">
                    {pricingRows.map((row) => (
                      <div key={row.product} className="rounded-lg border border-slate-200 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold text-slate-900">{row.product}</p>
                          <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500">{row.validity}</span>
                        </div>
                        <dl className="mt-3 grid grid-cols-3 gap-2">
                          <div className="rounded-lg bg-slate-50 px-2 py-2 text-center">
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Base</dt>
                            <dd className="text-sm font-bold text-slate-800 mt-0.5">{row.base}</dd>
                          </div>
                          <div className="rounded-lg bg-slate-50 px-2 py-2 text-center">
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">GST 18%</dt>
                            <dd className="text-sm font-bold text-slate-800 mt-0.5">{row.gst}</dd>
                          </div>
                          <div className="rounded-lg bg-teal-50 px-2 py-2 text-center border border-teal-100">
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Total</dt>
                            <dd className="text-sm font-bold text-[#006569] mt-0.5">
                              {'strike' in row ? (
                                <>
                                  <span className="block text-[11px] text-slate-400 line-through">{row.strike}</span>
                                  <span>{row.total}</span>
                                </>
                              ) : (
                                row.total
                              )}
                            </dd>
                          </div>
                        </dl>
                        {'strike' in row && (
                          <div className="mt-2 flex items-center justify-between">
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-teal-50 text-teal-600 border border-teal-200">{row.discount}</span>
                            <p className="text-xs text-teal-600 font-medium">{row.save}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 mt-3">
                    <p className="text-xs text-slate-500">
                      Prices are inclusive of 18% GST. Contact our sales team for more price options.
                    </p>
                    <button
                      type="button"
                      onClick={() => openModal('quote', 'TallyPrime Silver', 'Please share pricing details for TallyPrime Silver.')}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all bg-[#006569] hover:bg-[#045A57] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2"
                    >
                      Get Custom Quote
                      <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </section>

          </div>

          {/* ========== RIGHT SIDEBAR (3/12) ========== */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">

            {/* Get Best Quote */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 bg-[#045A57]">
                <h3 className="text-sm font-bold text-white">Get Best Quote for TallyPrime Silver</h3>
                <p className="text-sm text-white/80 mt-1 leading-relaxed">
                  Tell us about your business and we will recommend the perfect setup for you.
                </p>
              </div>
              <form onSubmit={handleSidebarSubmit} className="p-5 space-y-3">
                <div>
                  <label htmlFor="quote-name" className="sr-only">Name</label>
                  <input
                    id="quote-name"
                    type="text"
                    placeholder="Name *"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-[#006569] focus:ring-2 focus:ring-[#006569]/20 placeholder:text-slate-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="quote-email" className="sr-only">Business Email</label>
                  <input
                    id="quote-email"
                    type="email"
                    placeholder="Business Email *"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-[#006569] focus:ring-2 focus:ring-[#006569]/20 placeholder:text-slate-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="quote-phone" className="sr-only">Phone Number</label>
                  <input
                    id="quote-phone"
                    type="tel"
                    placeholder="Phone Number *"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-[#006569] focus:ring-2 focus:ring-[#006569]/20 placeholder:text-slate-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all bg-[#006569] hover:bg-[#045A57] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2"
                >
                  {formLoading ? 'Sending...' : 'Request a Call Back'}
                </button>
                {formMsg && (
                  <p
                    role="status"
                    className={`text-xs text-center leading-relaxed font-medium ${
                      formMsg.type === 'success' ? 'text-teal-600' : 'text-red-500'
                    }`}
                  >
                    {formMsg.text}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
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
                    className="flex items-center gap-3 group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
                  >
                    <div
                      className="size-9 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 bg-[#006569]"
                      aria-hidden="true"
                    >
                      {item.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-700 group-hover:text-[#006569] transition-colors truncate">
                        {item.name}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <svg className="size-3" viewBox="0 0 20 20" fill="#f59e0b" aria-hidden="true">
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
                className="block mt-4 pt-3 border-t border-slate-100 text-xs font-bold uppercase tracking-wider text-center text-[#006569] hover:text-[#045A57] transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
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
                      className="block text-sm text-slate-600 hover:text-[#006569] transition-colors py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() => openModal(link.type!, 'TallyPrime Silver')}
                      className="block w-full text-left text-sm text-slate-600 hover:text-[#006569] transition-colors py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
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
