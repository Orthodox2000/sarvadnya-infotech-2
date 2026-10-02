'use client';

// CHANGE: 2026-10-02 — subtotal / tax / total panel for the /demo cart scaffold (SP-1).
// WHY: shows the three totals the plan requires. Every figure comes from
// computeTotals() in lib/demo/cart.ts — this component does no arithmetic of its own, so
// the displayed total is by construction the same number the server route charges.
//
// React.memo: re-renders only when the totals object actually changes identity.

import { memo } from 'react';
import { formatINR } from '@/lib/demo/format.ts';
import type { CartTotals } from '@/lib/demo/cart.ts';

function Row({
  label,
  paise,
  emphasis,
}: {
  label: string;
  paise: number;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 py-1.5 ${
        emphasis ? 'border-t border-teal-200 pt-3' : ''
      }`}
    >
      <span className={emphasis ? 'text-base font-semibold text-teal-900' : 'text-sm text-teal-900/70'}>
        {label}
      </span>
      <span
        className={
          emphasis
            ? 'text-xl font-bold tabular-nums text-[#006569]'
            : 'text-sm tabular-nums text-teal-900/80'
        }
      >
        {formatINR(paise)}
      </span>
    </div>
  );
}

function TotalsPanel({ totals }: { totals: CartTotals }) {
  const mixedRate = new Set(totals.lines.map((l) => l.taxPct)).size > 1;

  return (
    <div className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
      <Row label="Subtotal" paise={totals.subtotalPaise} />
      {/* Products in the catalog all share one GST rate today. Label it generically as soon
          as that stops being true, rather than hard-coding "GST" into a mixed-rate cart. */}
      <Row label={mixedRate ? 'Tax' : 'GST'} paise={totals.taxPaise} />
      <Row label="Total" paise={totals.totalPaise} emphasis />
      <p className="mt-2 text-xs leading-relaxed text-teal-900/60">
        Test-mode amounts. No real payment is taken and no order is fulfilled.
      </p>
    </div>
  );
}

export default memo(TotalsPanel);