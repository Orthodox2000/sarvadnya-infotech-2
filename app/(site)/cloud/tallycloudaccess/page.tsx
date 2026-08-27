'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../../../components/Footer';
import UnifiedContactModal, { FormType } from '../../../components/UnifiedContactModal';
const BRAND_PRIMARY = '#006569';
const BRAND_SECONDARY = '#045A57';

const cloudPartners = [
  { name: 'AWS', logo: '/PartnerBrands/AWS.png' },
  { name: 'Oracle Cloud', logo: '/PartnerBrands/Oracle-Cloud.svg' },
  { name: 'Windows Server', logo: '/PartnerBrands/Windows-Server.svg' },
];

const plans = [
  {
    name: 'Basic',
    users: '1 User',
    price: 'NA',
    period: '',
    desc: 'Perfect for solo founders and sole proprietors who need secure, anywhere access to their business data.',
    features: [
      'Single user access',
      'TallyPrime Silver features',
      'Automatic daily backups',
      '24/7 cloud access',
      'Email support',
    ],
  },
  {
    name: 'Standard',
    users: 'Up to 5 Users',
    price: 'NA',
    period: '',
    desc: 'Ideal for small teams who want to collaborate in real-time without maintaining an office server.',
    features: [
      'Up to 5 concurrent users',
      'TallyPrime Gold features',
      'Automatic daily backups',
      '24/7 cloud access',
      'Priority support',
      'Setup assistance',
    ],
    popular: true,
  },
  {
    name: 'Professional',
    users: '10+ Users',
    price: 'NA',
    period: '',
    desc: 'Built for growing businesses and enterprises that need a fully managed, scalable cloud environment.',
    features: [
      'Unlimited users',
      'TallyPrime Server features',
      'Automatic daily backups',
      '24/7 cloud access',
      'Dedicated account manager',
      'Setup & migration',
      'Custom integrations',
    ],
  },
];

const coreFeatures = [
  { title: 'Access From Anywhere', desc: 'Log in from any laptop, desktop, Mac, or tablet with internet. Your TallyPrime data is always available — whether you are at home, office, or traveling.' },
  { title: 'Works on Any Device', desc: 'Use a web browser, Windows client, Mac client, or Linux client. Even old laptops work perfectly since all processing happens on powerful cloud servers.' },
  { title: 'Full Desktop Experience', desc: 'Need Excel, Word, or other Windows apps alongside Tally? Get a complete Windows desktop in the cloud with printing, scanners, and USB support.' },
  { title: 'Setup & Migration', desc: 'Sarvadnya experts set up everything and migrate your existing company data. No IT team needed — we handle it all.' },
  { title: '99.99% Uptime', desc: 'Enterprise-grade cloud infrastructure ensures your TallyPrime is available whenever you need it. No downtime, no disruptions.' },
  { title: 'Print Invoices Locally', desc: 'Print Tally bills and reports directly to your office printer from the cloud. Works with local printers, scanners, and USB devices.' },
];

const faqs = [
  {
    q: 'What is TallyPrime Cloud Access?',
    a: 'TallyPrime Cloud Access lets you run TallyPrime on secure cloud servers and access it from any laptop, desktop, or tablet with internet. You get the same TallyPrime experience — but without needing a server in your office.',
  },
  {
    q: 'How is this different from installing Tally on my computer?',
    a: 'When you install Tally locally, you can only work from that one computer. With Cloud Access, your Tally runs on a powerful cloud server, so you can log in from anywhere — home, office, while traveling, or from a branch office.',
  },
  {
    q: 'Do I need a powerful laptop to use it?',
    a: 'Not at all. Since the heavy processing happens on cloud servers, even a basic laptop with 2 Mbps internet works perfectly. You can also use a Mac, tablet, or web browser.',
  },
  {
    q: 'Can I print invoices from the cloud?',
    a: 'Yes. You can print directly to your office printer. The Windows Cloud Desktop option also supports scanners, USB devices, and all peripherals you use at your office.',
  },
  {
    q: 'Is my financial data safe in the cloud?',
    a: 'Absolutely. Your data is encrypted with AES-256 encryption. Regular automatic backups are included. Even if your laptop breaks, gets stolen, or crashes, your data remains safe and accessible from any other device.',
  },
  {
    q: 'Can I use Excel and Tally together?',
    a: 'Yes. The Windows Cloud Desktop option gives you a full Windows environment where you can run TallyPrime, Microsoft Excel, Word, and any other software side-by-side — just like sitting at your office desk.',
  },
  {
    q: 'What infrastructure providers do you use?',
    a: 'We partner with leading cloud infrastructure providers including AWS (Amazon Web Services), Oracle Cloud Infrastructure (OCI), and Windows Server to deliver reliable, secure, and high-performance cloud access.',
  },
  {
    q: 'How do I get started?',
    a: 'Simply contact our team. We will set up everything — cloud server, TallyPrime installation, data migration, and user accounts. You just log in and start working. Setup support is included.',
  },
  {
    q: 'Can I migrate my existing data to the cloud?',
    a: 'Yes. Our team will move all your existing company data, settings, and configurations to the cloud. You will not lose a single invoice, report, or entry.',
  },
];

const compatibleSystems = {
  access: ['Web Browser (RDP/HTML5)', 'Windows Client', 'Mac Client', 'Linux Client', 'Tablets'],
  peripherals: ['Local Printers', 'Scanners', 'USB Devices', 'Barcode Readers'],
};

const navSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'plans', label: 'Plans & Pricing' },
  { id: 'compatibility', label: 'Compatibility' },
  { id: 'faqs', label: 'FAQ' },
];

export default function TallyCloudAccessPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<FormType>('quote');
  const [modalService, setModalService] = useState('Tally Cloud Access');
  const [modalDetails, setModalDetails] = useState('');
  const [activeNav, setActiveNav] = useState('overview');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [stickyNav, setStickyNav] = useState(false);
  const [activePlan, setActivePlan] = useState<number | null>(null);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryContact, setInquiryContact] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const openModal = (type: FormType, service = 'Tally Cloud Access', details = '') => {
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
          service: 'Tally Cloud Access',
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
          service: 'Tally Cloud Access',
          formType: 'callback',
          description: 'Requesting a call back for Tally Cloud Access pricing.',
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
              <li><Link href="/" className="hover:text-[#006569] transition-colors">Home</Link></li>
              <li className="text-slate-300 mx-0.5">/</li>
              <li><Link href="/cloud" className="hover:text-[#006569] transition-colors">Cloud</Link></li>
              <li className="text-slate-300 mx-0.5">/</li>
              <li className="text-slate-800 font-semibold">Tally Cloud Access</li>
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
              <Image src="/tally%20on%20cloud.png" alt="Cloud Access" width={48} height={48} className="object-contain" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">TallyPrime Cloud Access</h1>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border"
                  style={{
                    backgroundColor: `${BRAND_PRIMARY}10`,
                    borderColor: `${BRAND_PRIMARY}25`,
                    color: BRAND_PRIMARY,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND_PRIMARY }} />
                  All-In-One Cloud
                </span>
              </div>
              <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed max-w-3xl">
                Access TallyPrime from anywhere, on any device — powered by AWS, Oracle Cloud, and Windows Server infrastructure.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex flex-col gap-2 shrink-0">
              <button
                onClick={() => openModal('demo', 'Tally Cloud Access')}
                className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:scale-[1.02]"
                style={{ backgroundColor: BRAND_PRIMARY }}
              >
                Get Now
              </button>
              <button
                onClick={() => scrollToSection('plans')}
                className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all hover:scale-[1.02]"
                style={{ borderColor: BRAND_PRIMARY, color: BRAND_PRIMARY }}
              >
                View Plans
              </button>
            </div>
          </div>
        </div>

        {/* Mobile action buttons */}
        <div className="md:hidden flex gap-2 px-6 pb-4">
          <button
            onClick={() => openModal('demo', 'Tally Cloud Access')}
            className="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all"
            style={{ backgroundColor: BRAND_PRIMARY }}
          >
            Get Now
          </button>
          <button
            onClick={() => scrollToSection('plans')}
            className="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all"
            style={{ borderColor: BRAND_PRIMARY, color: BRAND_PRIMARY }}
          >
            View Plans
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
              <h2 className="text-lg font-bold text-slate-900 mb-3">What is TallyPrime Cloud Access?</h2>
              <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                <p>
                  Running TallyPrime on your office computer means you can only work from one place. If that computer crashes, breaks, or gets stolen, your data is at risk. TallyPrime Cloud Access solves all of this.
                </p>
                <p>
                  Your TallyPrime runs on powerful, secure cloud servers managed by industry leaders like <strong>Amazon Web Services (AWS)</strong>, <strong>Oracle Cloud Infrastructure (OCI)</strong>, and <strong>Windows Server</strong>. You simply log in from any laptop, desktop, Mac, or tablet with internet and start working. Your data is always safe, always backed up, and accessible from anywhere in the world.
                </p>
                <p>
                  Whether you need a lightweight cloud workspace or a full Windows desktop with Excel, printing, and peripheral support — we have the right cloud plan for your business with <strong>affordable pricing</strong>.
                </p>
              </div>
              {/* Hero stats */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Pricing', value: 'Affordable' },
                  { label: 'Access', value: '24/7' },
                  { label: 'Security', value: 'AES-256' },
                  { label: 'Uptime', value: '99.99%*' },
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
              <p className="text-[9px] text-slate-400 mt-1.5">*Uptime as claimed by respective cloud host platforms.</p>
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Powered By</p>
                <div className="flex items-center gap-4 flex-wrap">
                  {cloudPartners.map((partner) => (
                    <div key={partner.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
                      {partner.logo ? (
                        <Image src={partner.logo} alt={partner.name} width={24} height={24} className="object-contain" />
                      ) : (
                        <span className="w-6 h-6 rounded flex items-center justify-center text-[8px] font-black text-white" style={{ backgroundColor: BRAND_PRIMARY }}>
                          {partner.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-700">{partner.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features */}
            <section id="features" className="scroll-mt-16 bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Why MSMEs Love Cloud Access</h2>
              <p className="text-sm text-slate-500 mb-5">
                Everything your business needs to work from anywhere — cloud workspace, full desktop, or both.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {coreFeatures.map((feature) => (
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

            {/* When Cloud Access is the right choice + Compatible Systems */}
            <section id="compatibility" className="scroll-mt-16 grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">It&apos;s time to move to the cloud if:</h2>
                <ul className="space-y-3">
                  {[
                    'You want to access TallyPrime from home, office, or while traveling.',
                    'You are tired of maintaining a server and worrying about data backups.',
                    'Your laptop broke or got stolen and you lost days of work.',
                    'You have multiple locations or a work-from-home team.',
                    'Your team uses Excel or Word alongside Tally every day.',
                    'You need to print invoices and reports to your office printer.',
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
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Access Methods</h3>
                    <div className="flex flex-wrap gap-2">
                      {compatibleSystems.access.map((os) => (
                        <span key={os} className="inline-flex rounded-md px-2.5 py-1 text-[12px] font-medium border" style={{ borderColor: `${BRAND_PRIMARY}25`, backgroundColor: `${BRAND_PRIMARY}06`, color: BRAND_PRIMARY }}>
                          {os}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Peripherals</h3>
                    <div className="flex flex-wrap gap-2">
                      {compatibleSystems.peripherals.map((device) => (
                        <span key={device} className="inline-flex rounded-md px-2.5 py-1 text-[12px] font-medium text-slate-600 bg-slate-50 border border-slate-200">
                          {device}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Plans & Pricing */}
            <section id="plans" className="scroll-mt-16 bg-white rounded-xl border border-slate-200 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Simple Cloud Pricing</h2>
                <p className="text-sm text-slate-500">Pay a simple monthly fee per user. No server costs, no IT team needed, no surprises.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan, idx) => (
                  <div
                    key={plan.name}
                    className={`relative rounded-xl border p-5 transition-all duration-300 cursor-pointer ${
                      plan.popular
                        ? 'border-[#006569] shadow-lg ring-1 ring-[#006569]/20'
                        : 'border-slate-200 hover:border-[#006569]/30 hover:shadow-md'
                    }`}
                    style={{
                      backgroundColor: activePlan === idx ? `${BRAND_PRIMARY}05` : plan.popular ? `${BRAND_PRIMARY}08` : 'transparent',
                    }}
                    onMouseEnter={() => setActivePlan(idx)}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md" style={{ backgroundColor: BRAND_PRIMARY }}>
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="mb-4">
                      <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{plan.users}</p>
                    </div>
                    <div className="mb-4">
                      <span className="text-2xl font-black" style={{ color: BRAND_PRIMARY }}>{plan.price}</span>
                      <span className="text-xs text-slate-500 font-medium">{plan.period}</span>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed mb-4">{plan.desc}</p>
                    <ul className="space-y-2 mb-5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-[12px] text-slate-600">
                          <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill={BRAND_PRIMARY}>
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => openModal('quote', `Tally Cloud Access - ${plan.name}`, `Interested in the ${plan.name} plan (${plan.users}). Please share details.`)}
                      className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:scale-[1.01]"
                      style={{
                        backgroundColor: plan.popular ? BRAND_PRIMARY : 'transparent',
                        color: plan.popular ? '#fff' : BRAND_PRIMARY,
                        border: plan.popular ? 'none' : `1px solid ${BRAND_PRIMARY}`,
                      }}
                    >
                      Get Started
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-4 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  All plans include managed cloud hosting, automatic daily backups, TSS (Tally Software Services), and setup support. Prices shown are indicative. Contact our sales team for the latest pricing, enterprise discounts, and custom configurations.
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section id="faqs" className="scroll-mt-16 bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Cloud Access FAQs</h2>
              <p className="text-sm text-slate-500 mb-5">Common questions about TallyPrime Cloud Access.</p>
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
                <h2 className="text-lg font-bold text-slate-900">Not sure which cloud setup fits you?</h2>
                <p className="text-sm text-slate-500 mt-1">Tell us how your team works and we will recommend the best cloud plan for your business.</p>
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
                      inquiryStatus.type === 'success' ? 'text-teal-600' : 'text-red-500'
                    }`}
                  >
                    {inquiryStatus.text}
                  </p>
                )}
              </form>
            </section>

          </div>

          {/* ========== RIGHT SIDEBAR (3/12) ========== */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">

            {/* Get Best Quote */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 text-white" style={{ backgroundColor: BRAND_SECONDARY }}>
                <h3 className="text-sm font-bold">Get Best Quote for Cloud Access</h3>
                <p className="text-[12px] text-white/75 mt-1 leading-relaxed">
                  Tell us your team size and we will recommend the perfect cloud setup for your business.
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

            {/* Most Popular Products */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Most Popular Products</h3>
              <div className="space-y-4">
                {[
                  { name: 'TallyPrime Gold', slug: '/products/gold', rating: '4.8', reviews: '120' },
                  { name: 'TallyPrime Server', slug: '/products/server', rating: '4.7', reviews: '85' },
                  { name: 'Tally on WhatsApp', slug: '/services/tally-on-whatsapp', rating: '4.9', reviews: '200' },
                  { name: 'Backup for Tally', slug: '/cloud/backup-for-tally', rating: '4.6', reviews: '55' },
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
                  { label: 'Cloud Solutions Guide', href: '/cloud' },
                  { label: 'Get Now', type: 'demo' as FormType },
                  { label: 'Technical Support', type: 'support' as FormType },
                  { label: 'Cloud Backup', href: '/cloud/backup-for-tally' },
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
                      onClick={() => openModal(link.type!, 'Tally Cloud Access')}
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
