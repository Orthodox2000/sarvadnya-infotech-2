'use client';

// CHANGE: 2026-10-02 — printable transaction receipt for the /demo checkout (SP-1 follow-up).
// WHY: the owner asked for a downloadable PDF of the transaction, including the transaction
// number, on a phone.
//
// WHY window.print() AND NOT A PDF LIBRARY: every mobile browser already has an OS print
// sheet with "Save as PDF" (iOS: share -> Save to Files; Android: Save as PDF). That is a
// real PDF file, it needs no dependency, it adds no bundle weight to a site that is tuned
// for low-end phones, and — decisively — the output is REAL TEXT: selectable, searchable and
// screen-reader friendly. A canvas- or library-drawn PDF renders glyphs as outlines, so the
// transaction number could not be copied out of it.
//
// WHY "Save as PDF" AND NOT A .pdf DOWNLOAD: iOS Safari does not honour `a[download]` for
// blob URLs; it opens a preview tab and the user must share -> Save to Files anyway. So the
// download attribute buys nothing on the platform that matters most and costs a dependency on
// the desktop one.
//
// PRINT SCOPE: the scoped @media print block in app/globals.css keeps only this subtree and
// hides the rest of the document — the NewsFeed/Navbar/Productbar stack, the SupportButton,
// the cookie card and the Vercel analytics tags. Those were all being printed before it
// existed; pdftotext on the generated PDF is what caught it. This card deliberately carries
// its OWN "test mode" box rather than relying on the demo banner above the page, because a
// warning that lives inside the receipt cannot be separated from the amount it qualifies,
// and cannot be lost if the banner is ever refactored away.

import { formatINR } from '@/lib/demo/format.ts';

export interface ReceiptData {
  /** Server-verified amount in paise, or null when it could not be established. */
  amountPaise: number | null;
  /** Our own reference, e.g. `demo_ab12…`. Null on a localhost run (no DB row). */
  orderId: string | null;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  /** Captured once when verification passed, so re-renders cannot shift the printed time. */
  verifiedAt: Date;
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-dashed border-teal-100 py-2 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-teal-900/55 sm:w-44">
        {label}
      </dt>
      {/* break-all: Razorpay ids are long unbroken tokens. Without this they widen the page
          at 360px and get CLIPPED in print, which would lose the transaction number —
          the single field the owner asked for. */}
      <dd
        className={`min-w-0 break-all text-sm text-teal-950 ${mono ? 'font-mono text-[13px]' : 'font-semibold tabular-nums'}`}
      >
        {value}
      </dd>
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
    <section
      aria-label="Transaction receipt"
      className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <header className="border-b border-teal-100 pb-4">
        <h2 className="text-lg font-bold text-teal-900">Payment receipt</h2>
        <p className="mt-1 text-xs leading-relaxed text-teal-900/65">
          Sarvadnya Infotech LLP &middot; info@sarvadnyainfotech.com
          <br />
          Shop No. 73, Plot No. 1, Vindhya Commercial Premises, Sector 11, CBD Belapur
        </p>
      </header>

      <dl className="mt-3">
        {/* The owner's "transaction number". Razorpay's payment id is the closest thing to
            one; the order id beside it is what a support request would quote. */}
        <Field label="Transaction no." value={data.razorpayPaymentId} mono />
        <Field label="Order no." value={data.razorpayOrderId} mono />
        {/* Null on a localhost run, where the order row is deliberately not written. */}
        <Field label="Reference" value={data.orderId ?? 'Not recorded (local test run)'} mono />
        <Field
          label="Amount paid"
          value={data.amountPaise === null ? 'Not recorded' : formatINR(data.amountPaise)}
        />
        <Field label="Currency" value="INR" />
        <Field label="Status" value="Payment verified" />
        <Field label="Verified on" value={formatStamp(data.verifiedAt)} />
      </dl>

      {/* A BORDERED box, not a filled badge. Print engines routinely drop background colours
          ("background graphics" off by default), which would leave white-on-teal text — i.e.
          this critical warning would print as an invisible blank. Dark text on a plain
          background survives colour stripping. */}
      <p className="mt-4 rounded-lg border-2 border-amber-500 px-3 py-2 text-xs font-bold uppercase leading-relaxed tracking-wide text-amber-900">
        Test mode receipt &mdash; no real money was charged and no order will be fulfilled.
      </p>
    </section>
  );
}
