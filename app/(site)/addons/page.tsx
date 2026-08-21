'use client';

// CHANGE: 2026-08-21 — NEW: /addons route — searchable full-width card list of Tally TDL add-ons.
// Each card has a "Submit Requirement" CTA that opens UnifiedContactModal prefilled with the add-on name,
// routed to the dedicated 'addons' email destination. Data lives statically in lib/addons.ts.
import { useState, useMemo, useCallback, memo } from 'react';
import { addons, type Addon } from '@/lib/addons';
import Footer from "../../components/Footer";
import UnifiedContactModal, { FormType } from "../../components/UnifiedContactModal";

const AddonCard = memo(function AddonCard({ addon, onSubmit }: { addon: Addon; onSubmit: (addon: Addon) => void }) {
  return (
    <div id={addon.id} className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 rounded-xl border border-slate-200 bg-white/90 backdrop-blur-sm px-4 py-3.5 md:px-5 md:py-4 shadow-sm hover:shadow-md hover:border-teal-300 transition-all scroll-mt-28">
      <div className="flex-1 min-w-0">
        <h3 className="text-[13.5px] md:text-[15px] font-bold text-slate-900 leading-snug group-hover:text-[#006569] transition-colors">
          {addon.title}
        </h3>
        {addon.description && (
          <p className="text-[11.5px] md:text-[12.5px] text-slate-500 leading-relaxed mt-1 line-clamp-2">
            {addon.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onSubmit(addon)}
        className="shrink-0 self-start sm:self-center inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-full bg-[#006569] text-white text-[11px] md:text-xs font-bold whitespace-nowrap hover:bg-[#045A57] active:scale-[0.97] transition-all shadow-sm"
        aria-label={`Submit requirement for ${addon.title}`}
      >
        Submit Requirement
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
});

export default function AddonsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactModalConfig, setContactModalConfig] = useState<{ isOpen: boolean; type: FormType; service: string }>({
    isOpen: false,
    type: 'enquire',
    service: ''
  });

  const filteredAddons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return addons;
    return addons.filter(a =>
      a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSubmitRequirement = useCallback((addon: Addon) => {
    setContactModalConfig({
      isOpen: true,
      type: 'enquire',
      service: `Add-on: ${addon.title}`
    });
  }, []);

  const closeModal = useCallback(() => {
    setContactModalConfig(prev => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(90deg,rgba(249,251,245,1)_0%,rgba(244,242,234,1)_53%,rgba(238,236,223,1)_100%)]">
      {/* Hero Section */}
      <section className="relative pt-12 pb-6 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-white/40 blur-[130px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-teal-200/30 blur-[110px] -ml-24 -mb-24" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
            <span className="flex h-1 w-1 rounded-full bg-slate-400"></span>
            Ready TDL Solutions
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-5 leading-tight tracking-tight">
            TallyPrime<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006569] via-[#006569] to-[#006569] drop-shadow-[0_2px_15px_rgba(0,101,105,0.2)]">Add-ons</span>
          </h1>
          <p className="text-slate-600/80 text-sm md:text-lg max-w-4xl mx-auto leading-relaxed font-semibold">
            Ready-made TDL add-ons that extend TallyPrime with extra controls, prints, reports and automation.
            Found what you need? Submit your requirement and our team will set it up for you.
          </p>
        </div>
      </section>

      {/* Search + Full-width Card List */}
      <section className="pb-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="sticky top-7 z-20 -mx-1 px-1 pt-2 pb-3 bg-[linear-gradient(90deg,rgba(249,251,245,0.95)_0%,rgba(244,242,234,0.95)_53%,rgba(238,236,223,0.95)_100%)] backdrop-blur-sm rounded-b-xl">
          <div className="relative max-w-2xl mx-auto">
            <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search add-ons… e.g. invoice, discount, ledger, print"
              aria-label="Search add-ons"
              className="w-full h-11 pl-11 pr-4 rounded-full border border-slate-300 bg-white text-[13px] md:text-sm font-medium text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-[#006569] focus:ring-2 focus:ring-[#006569]/20 transition-all"
            />
          </div>
          <p className="text-center text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-wider" aria-live="polite">
            {filteredAddons.length === addons.length
              ? `${addons.length} add-ons`
              : `${filteredAddons.length} of ${addons.length} add-ons`}
          </p>
        </div>

        {filteredAddons.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 font-bold text-base">No add-ons match &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-slate-400 text-sm mt-2">Try a different keyword — or tell us what you need and we&apos;ll build it.</p>
            <button
              onClick={() => setContactModalConfig({ isOpen: true, type: 'callback', service: 'Custom Add-on Requirement' })}
              className="mt-6 px-6 py-3 rounded-full bg-[#006569] text-white text-sm font-bold hover:bg-[#045A57] transition-all shadow-md"
            >
              Request a Custom Add-on
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 mt-2">
            {filteredAddons.map((addon) => (
              <AddonCard key={addon.id} addon={addon} onSubmit={handleSubmitRequirement} />
            ))}
          </div>
        )}
      </section>

      <UnifiedContactModal
        isOpen={contactModalConfig.isOpen}
        onClose={closeModal}
        type={contactModalConfig.type}
        prefillService={contactModalConfig.service}
        destination="addons"
      />

      <Footer />
    </div>
  );
}
