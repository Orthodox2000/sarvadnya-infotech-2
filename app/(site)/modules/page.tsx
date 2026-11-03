'use client';

import { useState, useEffect } from 'react';
import { Module } from '@/lib/modules';
import ModuleCard from "../../components/ModuleCard";
import Footer from "../../components/Footer";
import UnifiedContactModal, { FormType } from "../../components/UnifiedContactModal";

// CHANGE: 2026-11-03 — flat, non-animated listing.
// WHY: the owner asked for the same theme as the module detail pages. The pale gradient
// background, the two blurred glow divs, the gradient text and the image hover zoom are gone;
// the page is now dark hero → light grid → dark CTA, all from the teal scale.
export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactModalConfig, setContactModalConfig] = useState<{isOpen: boolean; type: FormType; service: string}>({
    isOpen: false,
    type: 'enquire',
    service: ''
  });

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('/api/modules');
        const data = await response.json();
        if (data && !data.error) {
          setModules(data);
        }
      } catch (err) {
        console.error('Error fetching modules:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  // CHANGE: 2026-09-07 — scroll to the module matching the #fragment deep-link once modules load.
  useEffect(() => {
    if (!modules.length) return;
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
  }, [modules]);

  const handleEnquire = (module: Module) => {
    setContactModalConfig({
      isOpen: true,
      type: 'enquire',
      service: `Module: ${module.title}`
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — same dark band as every module detail page */}
      <section className="border-b-2 border-[#033B38] bg-[#033B38] px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl text-center">
          <p className="inline-flex items-center gap-2 rounded-sm border border-[#C5E3E3]/40 bg-[#045A57] px-3 py-1 font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#E5F4F4]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4EAEA]" aria-hidden="true" />
            Specialized Solutions
          </p>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            Ready-to-run industry modules
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm font-medium leading-relaxed text-[#E5F4F4] sm:text-lg">
            Why start from scratch? We have already designed and tested the exact features your
            business needs. Plug in our pre-built modules and turn Tally into a complete system that
            handles your daily operations from day one.
          </p>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="border-b-2 border-[#033B38] bg-[#E5F4F4] px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-[#C5E3E3] bg-white p-4">
                  <div className="h-36 rounded-xl bg-[#D4EAEA]" />
                  <div className="mt-4 space-y-3">
                    <div className="h-5 w-3/4 rounded bg-[#D4EAEA]" />
                    <div className="h-4 w-full rounded bg-[#E5F4F4]" />
                    <div className="h-4 w-5/6 rounded bg-[#E5F4F4]" />
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="h-9 rounded-xl bg-[#E5F4F4]" />
                      <div className="h-9 rounded-xl bg-[#E5F4F4]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : modules.length === 0 ? (
            <p className="rounded-2xl border border-[#C5E3E3] bg-white p-8 text-center text-sm font-semibold text-slate-600">
              Module list is unavailable right now. Call 022 49647959 or WhatsApp +91 98709 42557 and
              we will send the brochures directly.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => (
                <ModuleCard
                  key={module._id || module.id}
                  module={module}
                  onEnquire={handleEnquire}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Banner — flat dark band, no glow */}
      <section className="border-b-2 border-[#033B38] bg-[#033B38] px-5 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-black text-white sm:text-4xl">Need a custom TDL solution?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#E5F4F4] sm:text-lg">
            Don&apos;t see a module that fits your specific needs? Our TDL experts can develop a bespoke
            solution tailored exactly to your business processes.
          </p>
          <button
            onClick={() => setContactModalConfig({ isOpen: true, type: 'callback', service: 'Bespoke TDL Customization' })}
            className="mx-auto mt-8 inline-flex items-center gap-3 rounded-xl border-2 border-[#D4EAEA] bg-[#D4EAEA] px-8 py-3.5 text-xs font-extrabold uppercase tracking-wider text-[#033B38] shadow-[0_2px_0_0_#045A57] transition-colors hover:bg-white"
          >
            Consult our team
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Modal */}
      <UnifiedContactModal
        isOpen={contactModalConfig.isOpen}
        onClose={() => setContactModalConfig(prev => ({ ...prev, isOpen: false }))}
        type={contactModalConfig.type}
        prefillService={contactModalConfig.service}
      />

      <Footer />
    </div>
  );
}
