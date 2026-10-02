'use client';

// CHANGE: 2026-10-02 — server-verified result panel for the success page (SP-1).
// WHY: the client asserts NOTHING about whether a payment succeeded. It hands the ids from
// the redirect to /api/demo/verify, and this component renders whatever the SERVER says.
//
// This matters because the redirect URL is attacker-controlled: anyone can hand-craft
// /demo/checkout/success?razorpayPaymentId=fake&razorpaySignature=fake and reach this page.
// Without the server check, that URL would render a green "Payment verified" badge.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatINR } from '@/lib/demo/format.ts';
import Receipt, { type ReceiptData } from './Receipt.tsx';

type Status = 'idle' | 'checking' | 'ok' | 'failed';

function first(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? '') : (v ?? '');
}

export default function VerifyResult({
  kind,
  searchParams,
}: {
  kind: 'success';
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [amount, setAmount] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      let qs: Record<string, string | string[] | undefined>;
      try {
        qs = await searchParams;
      } catch {
        qs = {};
      }
      if (cancelled) return;

      const body = {
        orderId: first(qs.orderId),
        razorpayOrderId: first(qs.razorpayOrderId),
        razorpayPaymentId: first(qs.razorpayPaymentId),
        razorpaySignature: first(qs.razorpaySignature),
      };

      // Nothing to verify — a bare visit to this URL. Say so rather than showing a badge.
      if (!body.razorpayOrderId || !body.razorpayPaymentId || !body.razorpaySignature) {
        setStatus('failed');
        setMessage('No payment details were supplied, so nothing could be verified.');
        return;
      }

      setStatus('checking');
      try {
        const res = await fetch('/api/demo/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          verified?: boolean;
          amount?: number;
          orderId?: string | null;
          razorpayOrderId?: string;
          razorpayPaymentId?: string;
          error?: string;
        };
        if (cancelled) return;
        if (res.ok && data.ok && data.verified) {
          setStatus('ok');
          setAmount(typeof data.amount === 'number' ? data.amount : null);
          // Build the receipt from the SERVER's fields only. The ids come back from the
          // verify response, not from this page's URL, so a hand-crafted redirect cannot
          // make a receipt print someone else's transaction number.
          setReceipt({
            amountPaise: typeof data.amount === 'number' ? data.amount : null,
            orderId: typeof data.orderId === 'string' ? data.orderId : null,
            razorpayOrderId: data.razorpayOrderId ?? '',
            razorpayPaymentId: data.razorpayPaymentId ?? '',
            verifiedAt: new Date(),
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
  }, [searchParams]);

  return (
    // print: strip the card chrome. A receipt should print as a document, not as a rounded
    // white box floating on a cream page — and print engines drop shadows anyway.
    <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
      {status === 'checking' || status === 'idle' ? (
        <>
          <h1 className="text-xl font-bold text-teal-900">Verifying test payment…</h1>
          <p className="mt-2 text-sm text-teal-900/70">
            The signature is checked on the server. Nothing is trusted from this page&apos;s URL.
          </p>
        </>
      ) : status === 'ok' ? (
        <>
          {/* print:hidden — the receipt below already carries the amount, so repeating it
              here would print the same figure twice. What you preview is what prints. */}
          <div className="print:hidden">
            <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-800">
              Signature verified
            </span>
            <h1 className="mt-3 text-xl font-bold text-teal-900">Test payment succeeded</h1>
            <p className="mt-2 text-sm leading-relaxed text-teal-900/70">
              Razorpay returned a signature that the server verified against the order.
              {amount !== null && (
                <>
                  {' '}
                  Amount: <strong className="tabular-nums">{formatINR(amount)}</strong>.
                </>
              )}
            </p>
          </div>

          {receipt && (
            <div className="mt-6">
              <Receipt data={receipt} />

              {/* window.print() is the "download". Every phone OS turns that into a real PDF
                  via its print sheet's Save-as-PDF option, with selectable text — see the
                  header of Receipt.tsx for why this beats shipping a PDF library. */}
              <button
                type="button"
                onClick={() => window.print()}
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 sm:w-auto print:hidden"
              >
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8V3h8v5M6 14H4.5A1.5 1.5 0 0 1 3 12.5v-3A1.5 1.5 0 0 1 4.5 8h11A1.5 1.5 0 0 1 17 9.5v3a1.5 1.5 0 0 1-1.5 1.5H14" />
                  <path d="M6 12h8v5H6z" />
                </svg>
                Save receipt as PDF
              </button>
              <p className="mt-2 text-xs leading-relaxed text-teal-900/60 sm:hidden">
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
          <h1 className="mt-3 text-xl font-bold text-teal-900">Test payment not verified</h1>
          <p className="mt-2 text-sm leading-relaxed text-teal-900/70">{message}</p>
        </>
      )}

      <div className="mt-6 flex flex-wrap gap-3 print:hidden">
        <Link
          href="/demo"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          Back to the test cart
        </Link>
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-teal-300 px-5 text-sm font-semibold text-teal-800 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          Book a real demo
        </Link>
      </div>
    </div>
  );
}