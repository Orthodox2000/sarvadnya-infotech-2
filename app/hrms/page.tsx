'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer';
import UnifiedContactModal, { FormType } from '../components/UnifiedContactModal';

const BRAND_PRIMARY = '#316852';
const BRAND_SECONDARY = '#1e4d3a';

const features = [
  { title: 'Employee Master', desc: 'Centralised employee database with documents, contacts, and role management.' },
  { title: 'Payroll Processing', desc: 'Automated salary, deductions, and compliance calculations every cycle.' },
  { title: 'Attendance & Time', desc: 'Track check-in, shifts, leave, and overtime with integrated reports.' },
  { title: 'Statutory Compliance', desc: 'Auto-generated PF, ESI, PT, and LWF returns with year-end forms.' },
  { title: 'Expense & Reimbursement', desc: 'Manage travel, conveyance, and business expense claims seamlessly.' },
  { title: 'Reports & Dashboards', desc: 'Real-time HR analytics, headcount, cost-to-company, and attrition views.' },
];

const faqs = [
  {
    q: 'What is an HRMS and why does my business need one?',
    a: 'HRMS (Human Resource Management System) automates employee lifecycle management — from onboarding and payroll to attendance and compliance. It eliminates spreadsheets, reduces errors, and keeps you compliant with Indian statutory regulations.',
  },
  {
    q: 'Is OTU HRplus integrated with TallyPrime?',
    a: 'Yes. OTU HRplus integrates seamlessly with TallyPrime, ensuring your payroll and financial data stay in sync. No duplicate data entry required.',
  },
  {
    q: 'Can HRMS handle statutory compliance like PF, ESI, and PT?',
    a: 'Absolutely. A modern HRMS auto-generates PF returns, ESI challans, PT returns, LWF forms, and Form 16 — all with the latest regulatory updates built in.',
  },
  {
    q: 'How many employees can an HRMS support?',
    a: 'HRMS solutions scale from 10 to 10,000+ employees. Whether you are a small business or a growing enterprise, the platform adapts to your headcount.',
  },
  {
    q: 'Do employees get self-service access?',
    a: 'Yes. Employees can view payslips, apply for leave, submit expense claims, and update their profiles through a mobile-friendly self-service portal.',
  },
];

const navSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'faqs', label: 'FAQ' },
  { id: 'pricing', label: 'Pricing' },
];

export default function HRMSPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<FormType>('quote');
  const [modalService, setModalService] = useState('HRMS');
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

  const openModal = (type: FormType, service = 'HRMS', details = '') => {
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
          service: 'HRMS',
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
          service: 'HRMS',
          formType: 'callback',
          description: 'Requesting a call back for HRMS pricing.',
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
    <div className="min-h-screen bg-[#f5f7fa] text-slate-900 font-sans">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="py-2.5">
            <ul className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <li><Link href="/" className="hover:text-[#316852] transition-colors">Home</Link></li>
              <li className="text-slate-300 mx-0.5">/</li>
              <li className="text-slate-800 font-semibold">Human Resource Management System</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Product Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-start gap-5">
            {/* Logo */}
            <div className="w-[72px] h-[72px] shrink-0 rounded-xl border border-slate-200 bg-white flex items-center justify-center shadow-sm p-2.5">
              <Image src="/hrms.png" alt="HRMS" width={48} height={48} className="object-contain" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">Human Resource Management System</h1>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border"
                  style={{
                    backgroundColor: `${BRAND_PRIMARY}10`,
                    borderColor: `${BRAND_PRIMARY}25`,
                    color: BRAND_PRIMARY,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND_PRIMARY }} />
                  HRMS
                </span>
              </div>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1.5"></div>
              <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed max-w-3xl">
                A complete Human Resource Management System to manage payroll, attendance, employee lifecycle,
                statutory compliance, and more — on a single integrated platform designed for Indian businesses.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex flex-col gap-2 shrink-0">
              <button
                onClick={() => openModal('demo', 'HRMS')}
                className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:scale-[1.02]"
                style={{ backgroundColor: BRAND_PRIMARY }}
              >
                Get Demo
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
            onClick={() => openModal('demo', 'HRMS')}
            className="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all"
            style={{ backgroundColor: BRAND_PRIMARY }}
          >
            Get Demo
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
          stickyNav ? 'sticky top-0 z-[100] shadow-sm' : ''
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
              <h2 className="text-lg font-bold text-slate-900 mb-3">What is an HRMS?</h2>
              <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                <p>
                  A Human Resource Management System (HRMS) is a unified platform that automates and streamlines
                  your entire employee lifecycle — from onboarding and payroll to attendance tracking, expense
                  management, and statutory compliance. It eliminates manual spreadsheets, reduces errors, and
                  gives you real-time visibility into your workforce.
                </p>
                <p>
                  Designed for Indian businesses, a modern HRMS handles complex statutory requirements like PF,
                  ESI, PT, LWF, and Form 16 generation automatically. With employee self-service portals, your
                  team can access payslips, apply for leave, and submit claims — all from their phone.
                </p>
              </div>
              {/* Hero stats */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Scope', value: 'Full Lifecycle' },
                  { label: 'Compliance', value: 'Auto' },
                  { label: 'Access', value: 'Web + Mobile' },
                  { label: 'Integrates', value: 'TallyPrime' },
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
              <h2 className="text-lg font-bold text-slate-900 mb-1">Key Features of HRMS</h2>
              <p className="text-sm text-slate-500 mb-5">
                Powerful features that make HRMS the backbone of modern people management. Packed with everything you need to run your HR operations smoothly.
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

            {/* OTU HRplus Reference */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 p-1.5 bg-white border border-slate-200 shadow-sm">
                  <Image src="/uploads/brand-otu-hrplus-1779435427064.png" alt="OTU HRplus" width={44} height={44} className="object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">We recommend OTU HRplus</h3>
                  <p className="text-[13px] text-slate-600 mt-1 leading-relaxed">
                    OTU HRplus is our recommended HRMS solution — it offers seamless TallyPrime integration,
                    automated compliance, and employee self-service. Built for Indian businesses, it handles
                    everything from payroll to statutory returns in one platform.
                    <Link href="https://otuhrplus.com/" target="_blank" rel="noopener noreferrer" className="font-bold ml-1 hover:underline" style={{ color: BRAND_PRIMARY }}>Learn more →</Link>
                  </p>
                </div>
              </div>
            </div>

            {/* When HRMS is the right choice + Compatible Systems */}
            <section className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">When HRMS is the right choice</h2>
                <ul className="space-y-3">
                  {[
                    'You are still managing payroll in spreadsheets',
                    'Your team has grown beyond 10 employees',
                    'You need auto-generated PF, ESI, and PT returns',
                    'You want employees to access payslips and apply for leave online',
                    'You need real-time headcount and cost reports',
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
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Platform</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Web Browser', 'Mobile App', 'Desktop'].map((p) => (
                        <span key={p} className="inline-flex rounded-md px-2.5 py-1 text-[12px] font-medium border" style={{ borderColor: `${BRAND_PRIMARY}25`, backgroundColor: `${BRAND_PRIMARY}06`, color: BRAND_PRIMARY }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Integrations</h3>
                    <div className="flex flex-wrap gap-2">
                      {['TallyPrime', 'Email', 'Biometric Devices', 'Bank Files'].map((item) => (
                        <span key={item} className="inline-flex rounded-md px-2.5 py-1 text-[12px] font-medium border" style={{ borderColor: `${BRAND_PRIMARY}25`, backgroundColor: `${BRAND_PRIMARY}06`, color: BRAND_PRIMARY }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Supported</h3>
                    <div className="flex flex-wrap gap-2">
                      {['PF', 'ESI', 'PT', 'LWF', 'Form 16'].map((item) => (
                        <span key={item} className="inline-flex rounded-md px-2.5 py-1 text-[12px] font-medium text-slate-600 bg-slate-50 border border-slate-200">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faqs" className="scroll-mt-16 bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">HRMS FAQs</h2>
              <p className="text-sm text-slate-500 mb-5">Frequently asked questions about Human Resource Management System.</p>
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
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Still not satisfied? */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="text-center mb-5">
                <h2 className="text-lg font-bold text-slate-900">Still not satisfied?</h2>
                <p className="text-sm text-slate-500 mt-1">Tell us your requirements and we will find the right HRMS solution for you.</p>
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
                  {inquiryLoading ? 'Sending...' : 'Submit Requirement'}
                </button>
                {inquiryStatus && (
                  <p
                    className={`text-[11px] text-center leading-relaxed font-medium ${
                      inquiryStatus.type === 'success' ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {inquiryStatus.text}
                  </p>
                )}
              </form>
            </section>

            {/* Pricing */}
            <section id="pricing" className="scroll-mt-16 bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">HRMS Pricing</h2>
              <p className="text-sm text-slate-500 mb-5">View pricing plans for HRMS.</p>
              <button
                type="button"
                onClick={() => setShowPricing(!showPricing)}
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:scale-[1.02]"
                style={{ backgroundColor: BRAND_PRIMARY }}
              >
                {showPricing ? 'Hide Pricing' : 'View Price'}
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${showPricing ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showPricing && (
                <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="px-4 py-3">Plan</th>
                        <th className="px-4 py-3">Validity</th>
                        <th className="px-4 py-3">Price (INR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="px-4 py-3 font-bold text-slate-900">Starter</td>
                        <td className="px-4 py-3 text-slate-600">Per Month</td>
                        <td className="px-4 py-3 font-bold" style={{ color: BRAND_PRIMARY }}>Starter Plan — Contact Sales</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="px-4 py-3 font-bold text-slate-900">Business</td>
                        <td className="px-4 py-3 text-slate-600">Per Month</td>
                        <td className="px-4 py-3 font-bold" style={{ color: BRAND_PRIMARY }}>Business Plan — Contact Sales</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-900">Enterprise</td>
                        <td className="px-4 py-3 text-slate-600">Custom</td>
                        <td className="px-4 py-3 font-bold" style={{ color: BRAND_PRIMARY }}>Enterprise Plan — Contact Sales</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
                    <p className="text-[11px] text-slate-500">
                      Prices are subject to change. Contact our sales team for the latest pricing and discounts.
                    </p>
                    <button
                      type="button"
                      onClick={() => openModal('quote', 'HRMS', 'Please share pricing details for HRMS.')}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: BRAND_PRIMARY }}
                    >
                      Get Custom Quote
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
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
              <div className="px-5 py-4 text-white" style={{ backgroundColor: BRAND_SECONDARY }}>
                <h3 className="text-sm font-bold">Get Best Quote for HRMS</h3>
                <p className="text-[12px] text-white/75 mt-1 leading-relaxed">
                  Connect with our experts to get the best quote for your business.
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
                      formMsg.type === 'success' ? 'text-emerald-600' : 'text-red-500'
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
                  { name: 'Cloud AWS', slug: '/cloud/aws', rating: '4.6', reviews: '65' },
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
                      <p className="text-sm font-bold text-slate-700 group-hover:text-[#316852] transition-colors truncate">
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
                  { label: 'TallyPrime Products', href: '/products' },
                  { label: 'Book a Demo', type: 'demo' as FormType },
                  { label: 'Technical Support', type: 'support' as FormType },
                  { label: 'Cloud Solutions', href: '/cloud' },
                  { label: 'Custom Modules', href: '/modules' },
                ].map((link) =>
                  'href' in link ? (
                    <Link
                      key={link.label}
                      href={link.href!}
                      className="block text-sm text-slate-600 hover:text-[#316852] transition-colors py-1"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() => openModal(link.type!, 'HRMS')}
                      className="block w-full text-left text-sm text-slate-600 hover:text-[#316852] transition-colors py-1"
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
