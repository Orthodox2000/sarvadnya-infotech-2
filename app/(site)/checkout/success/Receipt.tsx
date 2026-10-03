'use client';

// CHANGE: 2026-10-02 — printable, ITEMISED transaction receipt for the real cart (SP-1 cart build).
// WHY: the buyer needs a record of exactly what was bought (TallyPrime licence + TSS renewal +
// TallyDrive storage, each with its GST and discount) and the transaction number, on a phone.
// window.print() + the OS "Save as PDF" sheet — same decision and rationale as the /demo
// receipt: real selectable text, zero dependencies, works on every phone.
//
// PRINT SCOPE: the `cart-receipt-page` class on the success page's <main> is what the scoped
// @media print block in globals.css uses to strip the site chrome.
//
// RECEIPT FIELDS COME ONLY FROM THE VERIFY RESPONSE — never from this page's URL. `items` is
// null on a localhost run, where the order document is deliberately not persisted (AGENTS.md
// shared-production-DB rule); the receipt then prints item lines as "list not available" and
// is still honest about the amount (fetched from Razorpay by the verify route).

import { formatINR, formatPlainSlash } from '@/lib/cart/format';

export interface ReceiptItem {
  slug: string;
  name: string;
  qty: number;
  unitPaise: number;
  totalPaise: number;
}

export interface ReceiptData {
  /** Server-derived amount in paise, or null on a localhost run. */
  amountPaise: number | null;
  /** Our own order reference, or null on a localhost run. */
  orderId: string | null;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  /** Captured once when verification passed, so re-renders cannot shift the printed time. */
  verifiedAt: Date;
  /** Itemised lines from the stored order; null on a localhost run. */
  items: ReceiptItem[] | null;
  totals: { subtotalPaise?: number; gstPaise?: number; discountPaise?: number; totalPaise?: number } | null;
  /** CHANGE: 2026-10-03 — SP-3 buyer record. Null on pre-feature orders (renders nothing). */
  customer?: { name?: string; email?: string; phone?: string; company?: string } | null;
  /** TSS serial numbers by slug (owner 2026-10-03 — one serial per TSS line). */
  tssSerials?: Record<string, string> | null;
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-dashed border-[#D4EAEA] py-2 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-[#006569]/60 sm:w-44">{label}</dt>
      <dd className={`min-w-0 break-all text-sm text-slate-900 ${mono ? 'font-mono text-[13px]' : 'font-semibold tabular-nums'}`}>{value}</dd>
    </div>
  );
}

function formatStamp(d: Date): string {
  return d.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });
}

export default function Receipt({ data }: { data: ReceiptData }) {
  return (
    <section aria-label="Transaction receipt" className="rounded-2xl border border-[#D4EAEA] bg-white p-5 shadow-sm sm:p-6">
      <header className="border-b border-[#D4EAEA] pb-4">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element — static brand mark, not a page asset */}
          <img src="/TallyCertificate.png" alt="" className="h-9 w-9 rounded-full object-contain" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">Payment receipt</h2>
            <p className="text-xs leading-relaxed text-slate-600">
              Sarvadnya Infotech LLP · info@sarvadnyainfotech.com
              <br />
              Shop No. 73, Plot No. 1, Vindhya Commercial Premises, Sector 11, CBD Belapur
            </p>
          </div>
        </div>
      </header>

      <dl className="mt-3">
        <Field label="Transaction no." value={data.razorpayPaymentId} mono />
        <Field label="Order no." value={data.razorpayOrderId} mono />
        <Field label="Reference" value={data.orderId ?? 'Not recorded (local test run)'} mono />
        <Field label="Amount paid" value={data.amountPaise === null ? 'Not recorded' : formatINR(data.amountPaise)} />
        <Field label="Currency" value="INR" />
        <Field label="Status" value="Payment verified" />
        <Field label="Verified on" value={formatStamp(data.verifiedAt)} />
      </dl>

      {/* CHANGE: 2026-10-03 — SP-3 "Bought by": the buyer record rides the order doc
          from checkout; for a pre-feature/localhost run customer is null and this block
          prints nothing (no extra ink, no crash). */}
      {data.customer && (data.customer.name || data.customer.email) && (
        <div className="mt-3 rounded-xl border border-slate-200 px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Bought by</p>
          {data.customer.name && <p className="mt-1 text-sm font-semibold text-slate-900">{data.customer.name}</p>}
          {data.customer.email && <p className="text-xs text-slate-600">{data.customer.email}</p>}
        </div>
      )}

      {/* ITEMISED breakdown — the whole point of this receipt. */}
      <div className="mt-4 rounded-xl border border-slate-200">
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 border-b border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-500 sm:px-4">
          <span>Item</span>
          <span className="text-right">Qty</span>
          <span className="text-right">Amount</span>
        </div>
        {data.items && data.items.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {data.items.map((it) => (
              <li key={it.slug} className="grid grid-cols-[1fr_auto_auto] items-baseline gap-x-3 px-3 py-2.5 sm:px-4">
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-semibold text-slate-800">{it.name}</span>
                  <span className="block text-[11px] text-slate-500">{formatINR(it.unitPaise)} each</span>
                  {/* CHANGE: 2026-10-03 — SP-3: the buyer's TSS serial rides the item line
                      (one serial per TSS line, owner 2026-10-03). Absent on non-TSS items. */}
                  {data.tssSerials?.[it.slug] && (
                    <span className="mt-0.5 block text-[11px] font-semibold text-[#006569]">
                      TSS Serial: {data.tssSerials[it.slug]}
                    </span>
                  )}
                </span>
                <span className="text-right text-[13px] font-semibold tabular-nums text-slate-600">{it.qty}</span>
                <span className="text-right text-[13px] font-black tabular-nums text-slate-900">{formatINR(it.totalPaise)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-3 text-xs text-slate-500">
            Item list not available on this run (order document not persisted on localhost).
          </p>
        )}
      </div>

      {data.totals && (
        <dl className="mt-3 ml-auto w-full max-w-xs space-y-1 text-[13px]">
          <div className="flex items-center justify-between text-slate-600">
            <dt>Subtotal (base)</dt>
            <dd className="font-semibold tabular-nums">{formatPlainSlash(data.totals.subtotalPaise ?? 0)}</dd>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <dt>GST</dt>
            <dd className="font-semibold tabular-nums">{formatPlainSlash(data.totals.gstPaise ?? 0)}</dd>
          </div>
          {(data.totals.discountPaise ?? 0) > 0 && (
            <div className="flex items-center justify-between text-[#006569]">
              <dt>Discount</dt>
              <dd className="font-bold tabular-nums">− {formatPlainSlash(data.totals.discountPaise ?? 0)}</dd>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-slate-200 pt-1.5">
            <dt className="font-black uppercase tracking-wide text-slate-900">Total paid</dt>
            <dd className="text-base font-black tabular-nums text-[#006569]">
              {data.amountPaise !== null ? formatINR(data.amountPaise) : formatINR(data.totals.totalPaise ?? 0)}
            </dd>
          </div>
        </dl>
      )}

      {/* BORDERED box, not a filled badge — print engines strip background colours by default,
          and this warning must survive a colour-less printout (the same lesson that produced
          the bordered TEST MODE box on the test-scaffold receipt). */}
      <p className="mt-4 rounded-lg border-2 border-amber-500 px-3 py-2 text-xs font-bold uppercase leading-relaxed tracking-wide text-amber-900">
        Test mode receipt — no real money was charged and no order will be fulfilled.
      </p>
    </section>
  );
}