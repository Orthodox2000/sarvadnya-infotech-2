'use client';

// CHANGE: 2026-10-02 — server-verified result panel for the real cart's success page (SP-1 cart build).
// WHY: the client asserts NOTHING about whether a payment succeeded. It hands the ids from the
// redirect to /api/cart/verify, and this component renders whatever the SERVER says. Anyone can
// hand-craft /checkout/success?razorpayPaymentId=fake&razorpaySignature=fake and reach this page;
// without the server check that URL would render a green "Payment verified" badge.
//
// On success the paid cart is CLEARED here (agreed behaviour — a paid cart must not linger).
// The itemised receipt is built ONLY from the verify response fields.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatINR, formatPlainSlash } from '@/lib/cart/format';
import { useCart } from '@/lib/cart/store';
import Receipt, { type ReceiptData } from './Receipt';

type Status = 'idle' | 'checking' | 'ok' | 'failed';

function first(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? '') : (v ?? '');
}

export default function VerifyResult({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { clear } = useCart();
  const [status, setStatus] = useState<Status>('idle');
  const [amount, setAmount] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  useEffect(() => {
    let cancelled = false;
    let cleared = false;

    (async () => {
      let qs: Record<string, string | string[] | undefined>;
      try {
        qs = await searchParams;
      } catch {
        qs = {};
      }
      if (cancelled) return;

      const body = {
        razorpayOrderId: first(qs.razorpayOrderId),
        razorpayPaymentId: first(qs.razorpayPaymentId),
        razorpaySignature: first(qs.razorpaySignature),
      };

      if (!body.razorpayOrderId || !body.razorpayPaymentId || !body.razorpaySignature) {
        setStatus('failed');
        setMessage('No payment details were supplied, so nothing could be verified.');
        return;
      }

      setStatus('checking');
      try {
        const res = await fetch('/api/cart/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          verified?: boolean;
          amount?: number | null;
          orderId?: string | null;
          razorpayOrderId?: string;
          razorpayPaymentId?: string;
          items?: { slug: string; name: string; qty: number; unitPaise: number; totalPaise: number }[] | null;
          totals?: { subtotalPaise?: number; gstPaise?: number; discountPaise?: number; totalPaise?: number } | null;
          error?: string;
        };
        if (cancelled) return;
        if (res.ok && data.ok && data.verified) {
          // Clear the PAID cart exactly once — the cart in localStorage is what the buyer
          // just paid for; leaving it would re-offer already-purchased licences.
          if (!cleared) {
            cleared = true;
            clear();
          }
          setStatus('ok');
          const amountPaise = typeof data.amount === 'number' ? data.amount : null;
          setAmount(amountPaise);
          setReceipt({
            amountPaise,
            orderId: typeof data.orderId === 'string' ? data.orderId : null,
            razorpayOrderId: data.razorpayOrderId ?? '',
            razorpayPaymentId: data.razorpayPaymentId ?? '',
            verifiedAt: new Date(),
            items: Array.isArray(data.items) && data.items.length > 0 ? data.items : null,
            totals: data.totals ?? null,
          });
        } else {
          setStatus('failed');
          setMessage(data.error || 'The payment signature did not verify.');
        }
      } catch {
        if (!cancelled) {
          setStatus('failed');
          setMessage('Could not reach the verification endpoint.');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // clear() is stable in the store; searchParams is the async prop from the server page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
      {status === 'checking' || status === 'idle' ? (
        <>
          <h1 className="text-xl font-bold text-slate-900">Verifying payment…</h1>
          <p className="mt-2 text-sm text-slate-600">
            The signature is checked on the server. Nothing is trusted from this page&apos;s URL.
          </p>
        </>
      ) : status === 'ok' ? (
        <>
          <div className="print:hidden">
            <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-800">
              Signature verified
            </span>
            <h1 className="mt-3 text-xl font-bold text-slate-900">Payment succeeded (test mode)</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Razorpay returned a signature the server verified against the order.
              {amount !== null && (
                <>
                  {' '}
                  Amount: <strong className="tabular-nums">{formatINR(amount)}</strong>.
                </>
              )}
            </p>
          </div>

          {receipt && (
            <div className="mt-6 print:mt-0">
              <Receipt data={receipt} />

              <button
                type="button"
                onClick={() => window.print()}
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#006569] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#045A57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2 sm:w-auto print:hidden"
              >
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8V3h8v5M6 14H4.5A1.5 1.5 0 0 1 3 12.5v-3A1.5 1.5 0 0 1 4.5 8h11A1.5 1.5 0 0 1 17 9.5v3a1.5 1.5 0 0 1-1.5 1.5H14" />
                  <path d="M6 12h8v5H6z" />
                </svg>
                Save receipt as PDF
              </button>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:hidden">
                Opens your phone&apos;s print sheet — choose &ldquo;Save as PDF&rdquo; there.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-800">
            Not verified
          </span>
          <h1 className="mt-3 text-xl font-bold text-slate-900">Payment not verified</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{message}</p>
        </>
      )}

      <div className="mt-6 flex flex-wrap gap-3 print:hidden">
        <Link
          href="/products"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#006569] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#045A57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2"
        >
          Continue shopping
        </Link>
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#006569]/40 px-5 text-sm font-semibold text-[#006569] transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2"
        >
          Talk to a consultant
        </Link>
      </div>
    </div>
  );
}