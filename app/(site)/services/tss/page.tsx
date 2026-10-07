'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Footer from '../../../components/Footer';
import UnifiedContactModal, { FormType } from '../../../components/UnifiedContactModal';
import TssRenewalForm from '../../../components/TssRenewalForm';
import { useCart } from '@/lib/cart/store';
import { priceRowView, type PriceRowView } from '@/lib/prices';
import CartAddButton from '../../../components/cart/CartAddButton';
import SeoCrossLinks from '../../../components/SeoCrossLinks';
// CHANGE: 2026-10-07 — Product/Offer + FAQPage JSON-LD (P1 rich results, §2E + §2B). SITE_URL
// makes images absolute; builders take the SAME numbers the pricing table displays.
import { productJsonLd, faqPageJsonLd, SITE_URL } from '@/lib/seo';

// CHANGE: 2026-10-02 — DB-driven pricing (SP-1 cart build). WHY: the six TSS plans were
// static strings in JSX; they now derive from the live prices collection (with the
// lib/prices-catalog.mjs fallback) so an admin price edit reflects here too — the whole
// point of "prices dynamic from DB with identical-number fallback". TSS rows are per-row
// "Add" ONLY (no bundle) by design: renewals are bought one plan at a time.
const TSS_ROW_SLUGS = [
  'tss-single-1yr',
  'tss-single-2yr',
  'tss-multi-1yr',
  'tss-multi-2yr',
  'tss-auditor-1yr',
  'tss-auditor-2yr',
] as const;

// CHANGE: 2026-10-07 — TSS FAQ content (P1 §2B). These answers target the live search
// cluster ("tss expired in tally means", "tss full form in tally", "tss renewal means",
// "how to check tss expiry date") and are rendered BOTH as the visible accordion below and
// as FAQPage JSON-LD, so the markup always matches on-page content.
const TSS_FAQS: { q: string; a: string }[] = [
  {
    q: "What does 'TSS expired' mean in Tally?",
    a: "TSS stands for Tally Software Services, the annual subscription that keeps Tally Prime and Tally ERP 9 current with updates, statutory compliance changes and technical support. When the licence screen shows 'TSS has expired', it means that coverage has lapsed. Your software keeps working and your data stays safe, but you stop receiving updates, compliance releases and support.",
  },
  {
    q: 'What is the full form of TSS in Tally?',
    a: 'TSS stands for Tally Software Services. It is the annual subscription plan for Tally Prime and Tally ERP 9 that covers product updates, GST and statutory compliance changes, and technical support from Tally.',
  },
  {
    q: 'What does TSS renewal mean?',
    a: 'TSS renewal means paying for the next year of your Tally Software Services subscription so that updates, statutory compliance releases and technical support stay active. After renewal, your Tally licence shows the new coverage end date and you immediately receive the latest version and compliance updates.',
  },
  {
    q: 'How do I check my TSS expiry date in TallyPrime?',
    a: 'Open TallyPrime and go to the licence screen (Help > About or the Licence activation window). Your TSS coverage and its expiry date are shown there. If the date has passed, the licence screen also shows the "TSS has expired" notice, and renewal can be done quickly through a Tally partner.',
  },
  {
    q: 'Will Tally stop working when my TSS expires?',
    a: 'No. Your Tally Prime software keeps working and your data and vouchers are safe and usable even after TSS expires. What you lose is protection: no more product updates, no statutory compliance changes, and no technical support from Tally until you renew.',
  },
  {
    q: 'How do I renew an expired TSS?',
    a: 'Share your Tally serial number and unlock code with a Tally certified partner, and they will process the renewal. Once your TSS is renewed, updates and compliance releases resume immediately and your coverage end date moves forward by the renewed period.',
  },
];

export default function TSSPage() {
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean; type: FormType; service: string}>({
    isOpen: false,
    type: 'enquire',
    service: 'Tally Software Service (TSS) Renewal'
  });
  // CHANGE: 2026-10-07 — accordion state for the new TSS FAQ section (house pattern).
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // CHANGE: 2026-10-07 — live pricing rows (display strings string-for-string identical
  // to the legacy static table, per priceRowView + the cart-test page-parity assertions).
  const { resolve } = useCart();
  const pricingRows = useMemo(
    () =>
      TSS_ROW_SLUGS.flatMap((slug) => {
        const item = resolve(slug);
        return item ? [{ slug, ...priceRowView(item) }] : [];
      }),
    [resolve],
  );

  // CHANGE: 2026-10-07 — Product JSON-LD (P1 rich results). Offers = the SIX resolved plan
  // totals (incl. 18% GST) exactly as the pricing table displays them; low/high come from
  // the same source. No aggregateRating: this page shows no ratings.
  const tssLd = useMemo(() => {
    const prices = TSS_ROW_SLUGS.map((slug) => resolve(slug)).filter(Boolean);
    return productJsonLd({
      name: 'Tally Software Services (TSS) Renewal',
      description: 'TSS (Tally Software Services) is the annual subscription that keeps Tally Prime and Tally ERP 9 current with updates, statutory compliance changes and technical support.',
      url: '/services/tss',
      image: `${SITE_URL}/tss-icon.png`,
      sku: 'tss',
      offers: prices.map((item) => ({ priceRupees: (item as { payablePaise: number }).payablePaise / 100 })),
    });
  }, [resolve]);

  const openModal = (type: FormType, service: string = 'TSS Renewal') => {
    setModalConfig({ isOpen: true, type, service });
  };

  const tssFeatures = [
    {
      title: "Connected GST & E-Invoicing",
      desc: "Generate E-invoices and E-way bills instantly. Push your GSTR-1 directly to the tax portal without manual JSON uploads.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Web & Mobile Reports",
      desc: "Traveling? View your live dashboards, outstanding balances, and inventory directly on any smartphone or web browser securely.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    },
    {
      title: "CA & Branch Sync",
      desc: "Stop emailing backup files. Automatically sync your live data between your warehouses, branch offices, and your Chartered Accountant.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      title: "Free Upgrades & New Features",
      desc: "Get every new TallyPrime feature, performance boost, and security patch automatically—absolutely free of cost with your active TSS.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      )
    }
  ];

  const deliverableList = [
    "1-Click E-Invoicing & E-Way Bills",
    "Direct GST Portal Integration",
    "Free Upgrades to Every New Tally Version",
    "Secure Branch & CA Data Sync",
    "View Live Reports on Any Web Browser"
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(90deg,rgba(249,251,245,1)_0%,rgba(244,242,234,1)_53%,rgba(238,236,223,1)_100%)] text-slate-900">
      {/* CHANGE: 2026-10-07 — Product/Offer + FAQPage JSON-LD (P1 rich results). Prices come
          from the same resolve() the pricing table renders; FAQ nodes mirror the visible
          accordion below (§2B + §2E). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([tssLd, faqPageJsonLd(TSS_FAQS)]) }}
      />
      {/* CHANGE: 2026-09-11 — Hero bg replaced with solid #F1EDE5 (was the cream gradient). Image stays right-anchored
          at full height; plain #F1EDE5 fills the left so dark text stays readable. */}
      <section className="bg-[#F1EDE5] relative overflow-hidden flex items-center min-h-[200px] md:min-h-[320px] border-b border-[#006569]/10">
        {/* Cinematic Image Side - Hidden on mobile, right-anchored on md+ */}
        {/* CHANGE: 2026-09-11 — Image keeps its NATURAL 2752x1536 ratio at the hero's full height and is
            anchored RIGHT (was full-width object-cover, which cropped top/bottom). Any overflow past the
            left edge is clipped by the section's overflow-hidden. Left stays clear for the headline. */}
        <div className="hidden md:block absolute inset-y-0 right-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <Image
            src="/tss-icon.png"
            alt="Cinematic TSS Renewal"
            width={2752}
            height={1536}
            priority
            className="h-full w-auto"
          />
        </div>
        
        <div className="max-w-7xl mx-auto w-full px-6 relative z-10 py-12">
          <div className="max-w-2xl lg:pr-6">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/40 border border-[#006569]/10 text-[#006569] text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <span className="flex h-0.5 w-0.5 rounded-full bg-[#006569]"></span>
               Software Continuity
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
              Renew Your {' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006569] to-[#006569]">Tally Software Service (TSS)</span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed mb-8 font-semibold">
              Don&apos;t let your E-invoicing and GST features expire. Renew your TSS today to keep generating 1-click E-way bills, auto-reconcile your bank statements, and stay perfectly compliant with the latest tax laws.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => openModal('quote')}
                className="px-8 py-4 bg-[#006569] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#006569]/20"
              >
                Get Renewal Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">What Do You Lose If TSS Expires?</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">An active TSS subscription is the engine that keeps your daily accounting automated and error-free.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tssFeatures.map((feature, i) => (
            <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#E5F4F4] text-[#006569] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-6 bg-[linear-gradient(90deg,rgba(249,251,245,1)_0%,rgba(244,242,234,1)_53%,rgba(238,236,223,1)_100%)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video bg-white">
             <Image 
                src="/tssgold.png" 
                alt="TSS Benefits Overview" 
                fill 
                className="object-fill"
             />
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Included in Your {' '}<span className="text-[#006569]">TSS Renewal ! </span></h2>
            <div className="space-y-4">
              {deliverableList.map((benefit, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="font-bold text-slate-700 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-[#006569] pl-4">
              "An active TSS subscription is the difference between a smooth, automated audit and a stressful, manual tax season."
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">TSS Pricing</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">All plans include 18% GST. Choose the plan that fits your team size.</p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Validity</th>
                <th className="px-6 py-4">Base Price (INR)</th>
                <th className="px-6 py-4">GST 18% (INR)</th>
                <th className="px-6 py-4">Total (INR)</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {pricingRows.map((row) => (
                <tr key={row.slug} className="border-b border-slate-100 last:border-0">
                  <td className="px-6 py-4 font-bold text-slate-900">{row.product}</td>
                  <td className="px-6 py-4 text-slate-600">{row.validity}</td>
                  <td className="px-6 py-4 text-slate-600">{row.base}</td>
                  <td className="px-6 py-4 text-slate-600">{row.gst}</td>
                  <td className="px-6 py-4">
                    {'strike' in row && (
                      <span className="text-slate-400 line-through mr-1.5">{row.strike}</span>
                    )}
                    <span className="font-bold text-teal-600">{row.total}</span>
                    {'strike' in row && (
                      <>
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 ml-2 text-[10px] font-bold bg-teal-50 text-teal-600 border border-teal-200">{row.discount}</span>
                        <p className="text-[10px] text-teal-600 mt-0.5 font-medium">{row.save}</p>
                      </>
                    )}
                  </td>
                  {/* CHANGE: 2026-10-02 — per-row Add to Cart (SP-1 cart build). */}
                  <td className="px-6 py-4 align-middle">
                    <CartAddButton slug={row.slug} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <p className="text-[11px] text-slate-500 text-center">Prices are inclusive of 18% GST. Contact our sales team for more price options.</p>
          </div>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-4">
          {pricingRows.map((row) => (
            <div key={row.slug} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">{row.product}</h3>
                {'strike' in row && (
                  <span className="shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-teal-50 text-teal-600 border border-teal-200">{row.discount}</span>
                )}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Validity</span><span className="text-slate-600 font-semibold">{row.validity}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Base Price</span><span className="text-slate-600 font-semibold">₹{row.base}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">GST 18%</span><span className="text-slate-600 font-semibold">₹{row.gst}</span></div>
                <div className="flex justify-between items-center border-t border-slate-100 pt-2 mt-2">
                  <span className="text-slate-400 font-medium">Total</span>
                  <div className="text-right">
                    {'strike' in row && <span className="text-slate-400 line-through mr-1.5">₹{row.strike}</span>}
                    <span className="font-bold text-[#006569] text-base">₹{row.total}</span>
                  </div>
                </div>
                {'strike' in row && <p className="text-[10px] text-teal-600 font-medium text-right">{row.save}</p>}
              </div>
              {/* CHANGE: 2026-10-02 — full-width Add for thumb reach (SP-1). */}
              <div className="mt-3">
                <CartAddButton slug={row.slug} className="w-full" />
              </div>
            </div>
          ))}
          <p className="text-[11px] text-slate-500 text-center pt-2">Prices are inclusive of 18% GST.</p>
        </div>
      </section>

      {/* CHANGE: 2026-10-07 — NEW visible TSS FAQ section (P1 §2B). Answers the live search
          cluster ("tss expired means", "tss full form", "tss renewal means", "how to check
          tss expiry date"). Rendered on page AND as FAQPage JSON-LD above — same content. */}
      <section id="faqs" className="py-12 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">TSS Renewal FAQs</h2>
        <p className="text-sm md:text-base text-slate-500 mb-8">Everything about TSS expiry, renewal and how to check your coverage.</p>
        <div className="space-y-0 divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 px-4 sm:px-6">
          {TSS_FAQS.map((faq, idx) => {
            const open = openFaq === idx;
            return (
              <div key={idx}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : idx)}
                  aria-expanded={open}
                  aria-controls={`tss-faq-panel-${idx}`}
                  className="flex items-center justify-between w-full py-4 text-left transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
                >
                  <h3 className="text-sm md:text-base font-bold text-slate-900 pr-4">{faq.q}</h3>
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
                  <div id={`tss-faq-panel-${idx}`} className="pb-4 text-sm text-slate-600 leading-relaxed pr-8">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Renewal Form Section */}
      <section className="bg-[#006569] py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Renew Your TSS Now</h2>
            <p className="text-teal-100 text-sm max-w-md mx-auto">
              Enter your serial number and details below. Our team will process your renewal immediately.
            </p>
          </div>
          <TssRenewalForm variant="inline" source="tss-page" />
        </div>
      </section>

      {/* CHANGE: 2026-10-07 — Task 5 (SEO): internal cross-links to /news
          articles + sibling commercial pages, so the TSS page reinforces the
          news hub and the other product/service hubs. */}
      <div className="max-w-7xl mx-auto px-6">
        <SeoCrossLinks
          newsLinks={[
            { href: '/news/tally-tss-renewal-2026', label: 'TSS renewal 2026: pricing changes and how to prepare' },
            { href: '/news/tally-tss-expiry-meaning', label: "TSS expiry: what 'TSS Expired' means on your licence" },
          ]}
          exploreLinks={[
            { href: '/products/tallydrive', label: 'TallyDrive cloud backup' },
            { href: '/products/gold', label: 'TallyPrime Gold (advanced, multi-user)' },
          ]}
        />
      </div>

      {/* Contact CTA */}
      <section className="bg-[#045A57] py-10 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-teal-100 text-sm mb-6">Have questions? Need help finding your serial number?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => openModal('callback')}
              className="px-7 py-3.5 bg-white text-[#006569] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-teal-50 transition-all"
            >
              Request Callback
            </button>
            <button
              onClick={() => openModal('enquire')}
              className="px-7 py-3.5 bg-white/10 border border-white/20 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <UnifiedContactModal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        type={modalConfig.type}
        prefillService={modalConfig.service}
      />
      <Footer />
    </div>
  );
}
