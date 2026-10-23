'use client';

// CHANGE: 2026-10-23 — NEW: the "not sure what you need?" panel on /shop.
//
// WHY: 107 items is a catalogue, not advice. The owner asked for Sara and the team to help a
// visitor find the RIGHT item, so this panel collects three facts (business type, area, the
// actual pain) and turns them into one short request. Two exits:
//   Ask Sara       -> opens the chat with the composed question already typed
//   Send to team   -> opens the enquiry form with the same text prefilled
//
// Nothing is guessed for the visitor: every chip is a real answer they picked, and the
// composed sentence is visible (and editable in the chat) before it is sent anywhere.

import { useMemo, useState } from 'react';

type Option = { id: string; label: string };

const BUSINESS_TYPES: Option[] = [
  { id: 'trader', label: 'Trader / wholesaler' },
  { id: 'distributor', label: 'Distributor / stockist' },
  { id: 'manufacturer', label: 'Manufacturer' },
  { id: 'retailer', label: 'Retailer' },
  { id: 'service', label: 'Service business' },
  { id: 'other', label: 'Something else' },
];

const AREAS: { id: string; label: string; pains: string[] }[] = [
  {
    id: 'billing',
    label: 'Billing & invoices',
    pains: [
      'Billing takes too long',
      'Wrong rates going out',
      'Invoice format needs work',
      'Duplicate bills happening',
    ],
  },
  {
    id: 'credit',
    label: 'Credit & outstanding',
    pains: [
      'Payments come late',
      'No control on credit parties',
      'Chasing statements manually',
      'Receipts not matching bills',
    ],
  },
  {
    id: 'purchase',
    label: 'Purchase & stock',
    pains: [
      'Same bill entered twice',
      'Stock never matches',
      'Batch or BOM tracking',
      'Purchase needs approval',
    ],
  },
  {
    id: 'reports',
    label: 'Reports & accounts',
    pains: [
      'Reports need more detail',
      'GST reconciliation is painful',
      'Cost centre reporting',
      'Year end clean-up',
    ],
  },
  {
    id: 'excel',
    label: 'Excel & data entry',
    pains: [
      'Masters to be created in bulk',
      'Vouchers sitting in Excel',
      'Bank statement entry',
      'Old data to be migrated',
    ],
  },
  {
    id: 'automation',
    label: 'Automation',
    pains: [
      'Send invoices automatically',
      'WhatsApp instead of email',
      'Auto backup',
      'Approval before posting',
    ],
  },
];

export default function NeedsWizard({
  onAsk,
  onSendToTeam,
}: {
  onAsk: (question: string) => void;
  onSendToTeam: (message: string) => void;
}) {
  const [business, setBusiness] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [pain, setPain] = useState<string>('');

  const activeArea = AREAS.find((a) => a.id === area);

  const question = useMemo(() => {
    const biz = BUSINESS_TYPES.find((b) => b.id === business)?.label;
    const parts: string[] = [];
    if (biz) parts.push(`We are a ${biz.toLowerCase()} business`);
    if (pain) parts.push(`our main problem is: ${pain.toLowerCase()}`);
    else if (activeArea) parts.push(`we need help with ${activeArea.label.toLowerCase()}`);
    const head = parts.length ? `${parts.join(' and ')}. ` : '';
    return `${head}Which Tally add-on or module would suit us, and what would you need to know about our setup before you answer?`;
  }, [business, pain, activeArea]);

  const ready = Boolean(business || area || pain);

  return (
    <section
      aria-labelledby="shop-wizard-title"
      className="mt-8 overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-br from-[#F4FAF8] via-white to-[#FBF7EE] p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10.5px] font-black uppercase tracking-[0.18em] text-[#006569]">
            Not sure what you need?
          </p>
          <h2 id="shop-wizard-title" className="mt-1 text-[17px] font-bold leading-snug text-slate-900 sm:text-[19px]">
            Tell us three things and we will point at the right one
          </h2>
        </div>
        <span className="rounded-full border border-[#006569]/20 bg-white/70 px-2.5 py-1 text-[10.5px] font-bold text-[#006569]">
          About 20 seconds
        </span>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">1. Your business</p>
          <div className="flex flex-wrap gap-1.5">
            {BUSINESS_TYPES.map((b) => {
              const on = business === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBusiness(on ? '' : b.id)}
                  aria-pressed={on}
                  className={`min-h-9 rounded-full border px-3 py-1.5 text-[11.5px] font-bold transition-colors ${
                    on
                      ? 'border-[#006569] bg-[#006569] text-white'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-[#006569] hover:text-[#006569]'
                  }`}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">2. Where it hurts</p>
          <div className="flex flex-wrap gap-1.5">
            {AREAS.map((a) => {
              const on = area === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    setArea(on ? '' : a.id);
                    setPain('');
                  }}
                  aria-pressed={on}
                  className={`min-h-9 rounded-full border px-3 py-1.5 text-[11.5px] font-bold transition-colors ${
                    on
                      ? 'border-[#045A57] bg-[#045A57] text-white'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-[#006569] hover:text-[#006569]'
                  }`}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeArea && (
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
              3. The exact problem
            </p>
            <div className="flex flex-wrap gap-1.5">
              {activeArea.pains.map((p) => {
                const on = pain === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPain(on ? '' : p)}
                    aria-pressed={on}
                    className={`min-h-9 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition-colors ${
                      on
                        ? 'border-[#006569] bg-teal-50 text-[#045A57]'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-[#006569] hover:text-[#006569]'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white/80 px-3.5 py-3">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">This is what we will ask</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-slate-700">{question}</p>
      </div>

      <div className="mt-3.5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => onAsk(question)}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#006569] px-4 text-[12.5px] font-bold text-white shadow-sm transition-all hover:bg-[#045A57] active:scale-[0.99]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l2 6h6l-5 3.8 2 6.2-5-3.7-5 3.7 2-6.2L4 8h6l2-6z" />
          </svg>
          Ask Sara
        </button>
        <button
          type="button"
          onClick={() => onSendToTeam(question)}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-[#006569]/30 bg-white px-4 text-[12.5px] font-bold text-[#006569] transition-colors hover:bg-teal-50"
        >
          Send to our team
        </button>
      </div>

      <p className="mt-2 text-center text-[10.5px] leading-relaxed text-slate-400 sm:text-left">
        {ready
          ? 'You can edit the wording once it opens. Nothing is sent until you press send.'
          : 'Pick at least one option, or just search the catalogue on the left.'}
      </p>
    </section>
  );
}
