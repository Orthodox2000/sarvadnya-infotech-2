'use client';

import { useState, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../../../components/Footer';
import UnifiedContactModal, { FormType } from '../../../components/UnifiedContactModal';

const BRAND_PRIMARY = '#316852';
const BRAND_SECONDARY = '#1e4d3a';

const fundingOptions = [
  {
    title: 'Unsecured Business Loans',
    limit: 'Up to ₹75 Lakhs',
    desc: 'Fast, collateral-free funding for growing businesses that need working capital without risking assets.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Loan Against Property (LAP)',
    limit: 'Up to ₹15 Crores',
    desc: 'Unlock the value of your property to fund business expansion or manage working capital needs.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    title: 'CGTMSE Loans',
    limit: 'Government-Backed',
    desc: 'Government-backed credit guarantee scheme designed for eligible MSMEs — no collateral required.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: 'Professional Loans (CA)',
    limit: 'Tailored Financing',
    desc: 'Specialised financing for practising Chartered Accountants to grow their practice.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    name: 'Mrs Manasa M',
    company: 'Param Marketing',
    quote: "TallyCapital's smooth online process and quick disbursement has helped our business grow. Their supportive field team made the experience seamless, helping us get the funds we needed without any hassle.",
  },
  {
    name: 'Mrs Jayalakshmi Ganesh',
    company: 'DataAegis Software Private Limited',
    quote: "TallyCapital has made digital lending super quick and easy, saving our valuable time. The entire process was seamless, and their supportive field team ensured a smooth experience. It's been great for my business growth!",
  },
];

const lenderPartners = [
  { name: 'Axis Bank', logo: '/lenders/axis.png' },
  { name: 'Bajaj Finserv', logo: '/lenders/bajaj-finserv.svg' },
  { name: 'Credit Saison', logo: '/lenders/credit-saison.png' },
  { name: 'FlexiLoans', logo: '/lenders/flexiloans.png' },
  { name: 'GetVantage', logo: '/lenders/getvantage.png' },
  { name: 'Hero FinCorp', logo: '/lenders/hero-fincorp.png' },
  { name: 'Indifi', logo: '/lenders/indifi.svg' },
  { name: 'Kotak Bank', logo: '/lenders/kotak.svg' },
  { name: 'L&T Finance', logo: '/lenders/lt-finance.svg' },
  { name: 'South Indian Bank', logo: '/lenders/south-indian-bank.png' },
];

const faqs = [
  {
    q: 'What exactly is a business loan?',
    a: 'It is a lump sum of cash provided by a lender to help you buy inventory, upgrade machinery, or manage daily working capital so you can grow your business faster.',
  },
  {
    q: 'What is an "unsecured" business loan?',
    a: 'It means you get funding without having to pledge your home, property, or machinery as security. It is a fast, safe way to get cash based entirely on the health of your business.',
  },
  {
    q: 'Who is eligible to apply?',
    a: 'If you are currently using Tally software to maintain your business books, you already have a massive head start! You are eligible to use TallyCapital to instantly check your loan options.',
  },
  {
    q: 'Do I need to provide collateral or a guarantor?',
    a: 'Not for unsecured loans! TallyCapital offers collateral-free options, meaning you don\'t have to risk your personal or business assets to get the money you need.',
  },
];

const steps = [
  { title: "Click 'Check Eligibility'", desc: 'Press Alt + 9 in TallyPrime to instantly see if you pre-qualify.' },
  { title: 'Compare Real Offers', desc: 'Review rates from multiple lenders and pick the best fit.' },
  { title: 'Upload Basic KYC', desc: '100% digital. No printing massive ledgers or physical files.' },
  { title: 'Receive Your Funds', desc: 'Get money directly in your business account in 72 hours.' },
];

export default function TallyCapitalPage() {
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: FormType; service: string; details: string }>({
    isOpen: false,
    type: 'quote',
    service: 'TallyCapital',
    details: '',
  });
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeFeature, setActiveFeature] = useState(0);

  const openModal = (type: FormType, service = 'TallyCapital', details = '') => {
    setModalConfig({ isOpen: true, type, service, details });
  };

  const whyFeatures = [
    {
      title: '60-Second Eligibility Check',
      desc: "Don't wait weeks for a 'maybe'. Because your books are maintained on Tally, the system calculates your pre-qualified loan amount in under a minute.",
    },
    {
      title: 'Free Credit Health Report',
      desc: 'Pull your detailed business credit report for free. See exactly what the banks see, and get actionable insights on how to improve your score to get better interest rates.',
    },
    {
      title: '100% Digital & Paperless',
      desc: 'Apply for Term Loans, LAP, or CGTMSE without ever stepping foot inside a bank branch. The financial data lenders need is securely synced straight from your Tally software.',
    },
    {
      title: 'Repay on Your Exact Terms',
      desc: "Never get locked into a bad deal. Use our built-in EMI calculator to pick flexible repayment tenures (from 12 to 84 months) that perfectly match your business's cash flow.",
    },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(90deg,rgba(249,251,245,1)_0%,rgba(244,242,234,1)_53%,rgba(238,236,223,1)_100%)] text-slate-900 font-sans">
      {/* Breadcrumb */}
      {/* <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="py-2.5">
            <ul className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <li><Link href="/" className="hover:text-[#316852] transition-colors">Home</Link></li>
              <li className="text-slate-300 mx-0.5">/</li>
              <li><Link href="/products" className="hover:text-[#316852] transition-colors">Products</Link></li>
              <li className="text-slate-300 mx-0.5">/</li>
              <li className="text-slate-800 font-semibold">TallyCapital</li>
            </ul>
          </div>
        </div>
      </div> */}

      {/* ===== SECTION 1: HERO — The Loan Hook ===== */}
      <div className="bg-[url('/mobilebg.png')] md:bg-[url('/cardbg.png')] bg-cover bg-center bg-no-repeat">
        <section className="relative z-10 pt-10 pb-10 md:pt-12 md:pb-12 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Left: Copy */}
            <div className=" lg:ml-10">
              <div className="flex items-start gap-4mb-5">
                <div className="w-24 h-24 shrink-0 rounded-xl border border-slate-200 bg-white flex items-center justify-center shadow-sm p-2">
                  <Image src="/tallycapital.png" alt="TallyCapital" width={64} height={64} className="object-contain" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-[3.2rem] font-black text-[#316852] tracking-tight leading-[1.1] mb-2 ml-4">
                    TallyCapital
                  </h1>
                  <p className="text-lg md:text-xl ml-4 font-bold text-gray-700 tracking-tight leading-snug">
                    Financing Solution
                    Integrated within TallyPrime
                  </p>
                </div>
              </div>

              <p className="text-gray-600 text-sm md:text-base mt-3 mb-5 leading-relaxed font-medium italic">
                Access TallyCapital directly from your trusted TallyPrime platform.
              </p>

              <ul className="space-y-2.5 mb-6">
                {[
                  'Get pre-qualified offers based on your Tally books',
                  'Compare rates from India\'s top lenders instantly',
                  'Access unsecured loans with zero branch visits',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND_PRIMARY}18` }}>
                      <svg className="w-3 h-3" fill={BRAND_PRIMARY} viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => openModal('quote', 'TallyCapital', 'I want to check my TallyCapital loan eligibility.')}
                  className="px-7 py-3.5 bg-[#1A4731] hover:bg-[#123323] text-white font-bold rounded-lg transition-all text-sm tracking-wide shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  Check My Eligibility Now
                </button>
                <a
                  href="https://tallycapital.tallysolutions.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 bg-white hover:bg-gray-50 text-[#1A4731] border border-[#C5DACF] font-bold rounded-lg transition-all text-sm tracking-wide text-center hover:shadow-md"
                >
                  Visit TallyCapital Website
                </a>
              </div>
            </div>

            {/* Right: The Credit Hook — Secondary Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="px-6 py-4" style={{ backgroundColor: BRAND_SECONDARY }}>
                <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">Free Credit Check</p>
                <h2 className="text-xl font-black text-white leading-tight">
                  Know Exactly What Lenders See Before You Apply.
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-600 font-medium mb-5 leading-relaxed">
                  Your credit health is the key to business growth. Check it for free before applying for any loan.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    'Check your Business Credit Score for FREE',
                    'Get expert insights to improve your rating',
                    'See pre-qualified offers in under 2 minutes',
                    'Funds disbursed in as little as 72 hours*',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND_PRIMARY}18` }}>
                        <svg className="w-3 h-3" fill={BRAND_PRIMARY} viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                      </span>
                      <span className="text-sm text-slate-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ===== LENDING PARTNERS ===== */}
      <section className="py-10 w-full">
        <div className="text-center mb-6 px-6">
          <h2 className="text-xl md:text-3xl font-black text-slate-900">
            Trusted by India&apos;s Top Lenders to Fund Your Growth
          </h2>
        </div>
        <div className="relative">
          {/* Left fade gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #f5f7fa, transparent)' }} />
          {/* Right fade gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #f5f7fa, transparent)' }} />
          <div className="overflow-hidden py-6">
            <div className="flex gap-8 animate-[scroll-left_30s_linear_infinite] w-max hover:[animation-play-state:paused]">
              {[...lenderPartners, ...lenderPartners].map((partner, i) => (
                <div
                  key={`${partner.name}-${i}`}
                  className="shrink-0 flex items-center justify-center w-40 h-16 px-4 rounded-xl hover:shadow-md transition-all duration-300"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={140}
                    height={50}
                    className="object-contain w-auto h-full opacity-90 hover:opacity-100 transition-opacity duration-300"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`
          @keyframes scroll-left {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ===== SECTION 2: WHY MSMEs PREFER TALLYCAPITAL + HOW IT WORKS ===== */}
      <section className="py-10 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#316852]/10 text-[#316852] text-[10px] font-black uppercase tracking-widest mb-4">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#316852] animate-pulse"></span>
            Why TallyCapital?
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 leading-tight">
            Why MSMEs Prefer TallyCapital ?
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-3xl mx-auto leading-relaxed font-medium">
            Skip the branch visits, long waits, and endless paperwork. The everyday financial records you already maintain in Tally contain exactly what lenders need to approve your loan — giving you faster funding with zero hassle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          {/* Left: Common Benefits */}
          <div className="flex flex-col">
            <div className="space-y-4 flex-1">
              {whyFeatures.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-200 p-5 cursor-pointer group"
                  onMouseEnter={() => setActiveFeature(i)}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300"
                      style={{
                        backgroundColor: activeFeature === i ? BRAND_PRIMARY : `${BRAND_PRIMARY}15`,
                        color: activeFeature === i ? '#fff' : BRAND_PRIMARY,
                      }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-[13px] text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: How It Works */}
          <div className="bg-[linear-gradient(135deg,#f0f7f3_0%,#f9faf8_100%)] rounded-2xl border border-[#316852]/10 p-6 md:p-8 flex flex-col">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-1">How it <span className="text-[#316852]">works</span></h3>
            <p className="text-xs text-slate-500 font-medium mb-6">4 simple steps from your Tally screen to your bank account.</p>

            <div className="flex flex-col items-center flex-1">
              {steps.map((step, i) => (
                <Fragment key={i}>
                  <div className="group w-full bg-white rounded-xl p-4 border border-slate-200 hover:shadow-md hover:border-[#316852]/30 transition-all duration-300 relative">
                    <div className="flex items-start gap-4">
                      <div
                        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-md transition-all duration-300 group-hover:scale-110"
                        style={{ backgroundColor: BRAND_PRIMARY }}
                      >
                        {i + 1}
                      </div>
                      <div className="pt-1">
                        <h4 className="text-sm font-bold text-slate-900 mb-0.5">{step.title}</h4>
                        <p className="text-[12px] text-slate-500 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                    {i < 3 && (
                      <div className="absolute left-1/2 -bottom-4 -translate-x-1/2 z-10">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                          <svg className="w-4 h-4 text-[#316852]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  {i < 3 && <div className="w-px h-4 bg-[#316852]/15" />}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: FUNDING OPTIONS ===== */}
      <section className="py-8 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#316852]/10 text-[#316852] text-[10px] font-black uppercase tracking-widest mb-4">
            Funding Options
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 leading-tight">
            More Funding Options, Tailored to Your Needs
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            An exclusive lending solution, powered by Tally — offering business loans tailored to meet your diverse needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fundingOptions.map((option) => (
            <div key={option.title} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: BRAND_PRIMARY }}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-black text-slate-900">{option.title}</h3>
                    <span className="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider" style={{ backgroundColor: `${BRAND_PRIMARY}12`, color: BRAND_PRIMARY }}>
                      {option.limit}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{option.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 4: YOUR TALLY IS NOW YOUR UNFAIR ADVANTAGE + VIDEO ===== */}
      <section className="py-4 px-6 bg-[linear-gradient(90deg,rgba(249,251,245,1)_0%,rgba(244,242,234,1)_53%,rgba(238,236,223,1)_100%)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-5 leading-tight">
              Your Tally Software is Now Your{' '}
              <span className="text-[#316852]">Financial Unfair Advantage</span>
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6 font-medium">
              Lenders love data, and because you already maintain your books on Tally, lenders already trust your business. TallyCapital turns your everyday accounting software into a fast-track pass for business funding — giving you faster approvals, better rates, and zero hassle.
            </p>

            <ul className="space-y-3 mb-6">
              {[
                '1-Click access directly inside TallyPrime',
                'Unlock unsecured loans to improve cash flow immediately',
                'Forces top lenders to compete for your business',
                '100% secure, transparent, and private data handling',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND_PRIMARY}18` }}>
                    <svg className="w-3 h-3" fill={BRAND_PRIMARY} viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                  </span>
                  <span className="text-sm text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg group cursor-pointer relative">
            <a
              href="https://www.youtube.com/watch?v=4LJa6iKgrpE"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative aspect-video"
            >
              <Image
                src="https://img.youtube.com/vi/4LJa6iKgrpE/maxresdefault.jpg"
                alt="TallyCapital Overview"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-[#316852] ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: CUSTOMER TESTIMONIALS ===== */}
      <section className="py-16 px-6" style={{ backgroundColor: BRAND_SECONDARY }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
              Customer Stories
            </h2>
            <p className="text-white/60 text-sm md:text-base font-medium">Real businesses. Real growth. Zero hassle.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <svg className="w-8 h-8 text-white mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
                </svg>
                <p className="text-white text-sm md:text-base leading-relaxed mb-6 font-medium italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-white/60 text-xs font-medium">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: SARVADNYA INFOTECH ABOUT ===== */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-10 bg-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center p-2" style={{ backgroundColor: '#1a2332' }}>
                  <Image src="/logo.png" alt="Sarvadnya Infotech" width={56} height={56} className="object-contain" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">Sarvadnya Infotech</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Certified Tally Partner</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-3">About Us</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                We have been authorised Tally Partners for over 20 years, helping businesses across India to set up, manage, and grow with TallyPrime. As a certified TallyCapital partner, we now bring you seamless access to business financing — right from within the software you already use every day.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Whether you need guidance on getting started with TallyCapital or want to explore your loan options, our team is here to help.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-[#316852] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm text-slate-600 font-medium">+91 98213 09060</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[#316852] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-slate-600 font-medium">123, Business Center, Main Road, Pune - 411001</span>
                </div>
              </div>

              <button
                onClick={() => openModal('callback', 'TallyCapital', 'I want guidance on getting started with TallyCapital.')}
                className="mt-6 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:scale-[1.02]"
                style={{ backgroundColor: BRAND_PRIMARY }}
              >
                Get Help from Our Team
              </button>
            </div>

            <div className="p-8 md:p-10 flex flex-col justify-center" style={{ backgroundColor: '#1a2332' }}>
              <h3 className="text-lg font-black text-white mb-6">Why Choose Sarvadnya Infotech LLP?</h3>
              <div className="space-y-6">
                {[
                  { icon: '✓', text: 'Over 20 years as Certified Tally Partner' },
                  { icon: '✓', text: 'Certified TallyCapital partner' },
                  { icon: '✓', text: 'End-to-end setup & financing guidance' },
                  { icon: '✓', text: 'Trusted by businesses across India' },
                  { icon: '✓', text: 'Seamless access to business financing from TallyPrime' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: BRAND_PRIMARY }}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium text-white/80">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 7: TALLYCAPITAL WEBSITE LINKS ===== */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            <div className="w-16 h-16 shrink-0 rounded-xl border border-slate-200 bg-white flex items-center justify-center shadow-sm p-2">
              <Image src="/tallycapital.png" alt="TallyCapital" width={48} height={48} className="object-contain" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Explore TallyCapital</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Access all features on the official TallyCapital portal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Credit Score', desc: 'Check your business credit score for free', href: 'https://tallycapital.tallysolutions.com/credit-score' },
              { label: 'Loan Eligibility', desc: 'See if you pre-qualify in 2 minutes', href: 'https://tallycapital.tallysolutions.com/loan-eligibility-calculator' },
              { label: 'TallyCapital Add-on', desc: 'Install directly inside TallyPrime', href: 'https://tallycapital.tallysolutions.com/add-on' },
              { label: 'FAQs', desc: 'Answers to common financing questions', href: 'https://tallycapital.tallysolutions.com/frequently-asked-questions/' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-slate-200 hover:border-[#316852]/30 hover:shadow-md transition-all group"
              >
                <p className="text-sm font-bold text-slate-900 group-hover:text-[#316852] transition-colors flex items-center gap-1.5">
                  {link.label}
                  <svg className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{link.desc}</p>
              </a>
            ))}
          </div>

          <a
            href="https://tallycapital.tallysolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
            style={{ backgroundColor: BRAND_PRIMARY }}
          >
            Visit TallyCapital Website
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-500 font-medium">Quick answers about TallyCapital financing</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-0 divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 p-6">
          {faqs.map((faq, idx) => (
            <div key={idx}>
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex items-center justify-between w-full py-4 text-left transition-colors"
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
                <div className="pb-4 text-sm text-slate-600 leading-relaxed pr-8">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
          <div className="pt-4 text-center">
            <a
              href="https://tallycapital.tallysolutions.com/frequently-asked-questions/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-[#316852] hover:underline"
            >
              Have more questions? Visit TallyCapital FAQ →
            </a>
          </div>
        </div>
      </section>

      <UnifiedContactModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        type={modalConfig.type}
        prefillService={modalConfig.service}
        prefillDetails={modalConfig.details}
      />
      <Footer />
    </div>
  );
}
