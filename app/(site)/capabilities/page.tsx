'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RupeeIcon from '../../components/RupeeIcon';
import { capabilityCategories } from '@/lib/capabilities';
import Footer from '@/app/components/Footer';

export default function CapabilitiesPage() {
  const [activeCat, setActiveCat] = useState(capabilityCategories[0].id);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const currentCat = capabilityCategories.find(c => c.id === activeCat) || capabilityCategories[0];
  const totalFeatures = capabilityCategories.reduce((acc, c) => acc + c.features.length, 0);

  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      {/* Hero */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F4F4] text-[#006569] text-[10px] font-bold uppercase tracking-widest mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006569]"></span>
              What TallyPrime Can Do
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
              Every feature you need.{' '}
              <span className="text-[#006569]">Nothing you don&apos;t.</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-lg">
              From invoicing to payroll, TallyPrime handles it all. Explore {totalFeatures} capabilities 
              across {capabilityCategories.length} categories — built for Indian businesses.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-6 mt-8">
            {[
              { num: `${totalFeatures}+`, label: 'Features' },
              { num: `${capabilityCategories.length}`, label: 'Categories' },
              { num: '100%', label: 'GST Ready' },
            ].map((s, i) => (
              <div key={i} className="flex items-baseline gap-2">
                <span className="text-xl font-black text-[#006569]">{s.num}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <nav className="sticky top-[127px] z-[45] bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-2">
            {capabilityCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all
                  ${activeCat === cat.id 
                    ? 'bg-[#006569] text-white shadow-md shadow-[#006569]/20' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                <span className="hidden sm:inline">{cat.title}</span>
                <span className="sm:hidden">{cat.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Active Category Content */}
      <section className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        {/* Category Header */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">{currentCat.title}</h2>
            <p className="text-slate-500 text-sm md:text-base">{currentCat.description}</p>
          </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-3">
          {currentCat.features.map((feature, idx) => {
            const featureKey = `${activeCat}-${idx}`;
            const isExpanded = expandedFeature === featureKey;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition-all"
              >
                <button
                  onClick={() => setExpandedFeature(isExpanded ? null : featureKey)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0"
                    style={{ backgroundColor: currentCat.color }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{feature.title}</h4>
                    {!isExpanded && feature.description && (
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{feature.description}</p>
                    )}
                  </div>
                  <svg 
                    className={`w-4 h-4 text-slate-300 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isExpanded && (feature.description || feature.example) && (
                  <div className="px-5 pb-5 md:pl-[4.25rem] pl-5">
                    {feature.description && (
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">{feature.description}</p>
                    )}
                    {feature.example && (
                      <div className="bg-[#E5F4F4] rounded-xl px-4 py-3 border border-[#006569]/10">
                        <p className="text-[10px] font-bold text-[#006569] uppercase tracking-widest mb-1">Example</p>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {feature.example.split('[RUPEE_ICON]').map((part, i, arr) => (
                            <span key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <RupeeIcon className="inline-block align-middle w-3.5 h-3.5 mx-0.5" />
                              )}
                            </span>
                          ))}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Category Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
          {capabilityCategories.indexOf(currentCat) > 0 ? (
            <button
              onClick={() => setActiveCat(capabilityCategories[capabilityCategories.indexOf(currentCat) - 1].id)}
              className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#006569] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {capabilityCategories[capabilityCategories.indexOf(currentCat) - 1].title}
            </button>
          ) : <div />}

          {capabilityCategories.indexOf(currentCat) < capabilityCategories.length - 1 ? (
            <button
              onClick={() => setActiveCat(capabilityCategories[capabilityCategories.indexOf(currentCat) + 1].id)}
              className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#006569] transition-colors"
            >
              {capabilityCategories[capabilityCategories.indexOf(currentCat) + 1].title}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : <div />}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#006569] py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Ready to see it in action?</h2>
          <p className="text-teal-100 text-sm mb-8 max-w-md mx-auto">
            Our team will walk you through every feature that matters to your business.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="px-7 py-3.5 bg-white text-[#006569] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-teal-50 transition-all"
            >
              Get Now
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3.5 bg-white/10 border border-white/20 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
