'use client';

// CHANGE: 2026-10-02 — Razorpay test-mode pay button for the /demo cart scaffold (SP-1).
// WHY: the ONLY place in the codebase that opens Razorpay Checkout. Keeping it in one
// component means the test-mode guarantee has a single choke point.
//
// THE MONEY RULES, restated because they are the whole point of this scaffold:
//   1. This client NEVER sends an amount. It posts {items} only. The server reprices from
//      lib/demo/catalog.ts and returns the authoritative amount. A client that could choose
//      its own amount would make the test harness teach the wrong pattern.
//   2. Payment success is NOT trusted from the client. The success handler only fires a
//      redirect; the /demo/checkout/success page re-checks with the server via /api/demo/verify.
//   3. The publishable key comes from the server response, not from NEXT_PUBLIC_ env, so the
//      key actually used is the one the server validated as rzp_test_*.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/demo/cart-store.tsx';
import { formatINR } from '@/lib/demo/format.ts';

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

interface OrderResponse {
  ok: boolean;
  orderId?: string;
  razorpayOrderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  error?: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadCheckoutScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('checkout.js failed to load')));
      return;
    }
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('checkout.js failed to load'));
    document.body.appendChild(s);
  });
}

export default function RazorpayButton() {
  const { items, totals, hydrated } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busyRef = useRef(false);

  // Abort in-flight work if the component unmounts mid-payment (user navigates away).
  useEffect(() => () => { busyRef.current = false; }, []);

  const pay = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError(null);

    try {
      // NOTE: only `items` is sent. No amount, no total, no tax — see rule 1 above.
      const res = await fetch('/api/demo/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data: OrderResponse = await res.json().catch(() => ({} as OrderResponse));

      if (!res.ok || !data.ok || !data.razorpayOrderId || !data.amount || !data.keyId) {
        throw new Error(data.error || `Could not start the test payment (HTTP ${res.status}).`);
      }

      await loadCheckoutScript();
      if (!window.Razorpay) throw new Error('Razorpay checkout failed to initialise.');

      const rz = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency ?? 'INR',
        name: 'Sarvadnya Infotech LLP',
        description: 'Test order — no real payment',
        order_id: data.razorpayOrderId,
        // There is no customer form in scope for this scaffold, so there is nothing to
        // prefill. Razorpay's test mode accepts any input on the mock bank page.
        prefill: {},
        notes: { testMode: 'true' },
        theme: { color: '#006569' },
        // Razorpay's own mock bank page offers Success / Failure buttons in test mode,
        // which is exactly what makes this scaffold testable without real money.
        handler: (response: Record<string, string>) => {
          // Rule 2: the client asserts nothing. It forwards the three ids to the server
          // (via the success page) and lets the server verify the HMAC signature. The
          // redirect carries no trust; /demo/checkout/success re-verifies before it renders.
          const qs = new URLSearchParams({
            orderId: data.orderId ?? '',
            razorpayOrderId: data.razorpayOrderId,
            razorpayPaymentId: response.razorpay_payment_id ?? '',
            razorpaySignature: response.razorpay_signature ?? '',
          });
          router.push(`/demo/checkout/success?${qs.toString()}`);
        },
        modal: {
          ondismiss: () => {
            busyRef.current = false;
            setBusy(false);
            router.push('/demo/checkout/cancel');
          },
        },
      });

      // Step 6.6: a failed payment must be SURFACED, not swallowed. Without this listener
      // the modal closes on failure and the user is left staring at an unchanged cart with
      // no idea anything happened. `on` is not in the minimal `open()` type above, so the
      // instance is typed as an open surface here.
      const withEvents = rz as unknown as {
        on?: (event: string, cb: (payload: { error?: { description?: string } }) => void) => void;
      };
      withEvents.on?.('payment.failed', (payload) => {
        busyRef.current = false;
        setBusy(false);
        setError(
          payload?.error?.description
            ? `Test payment failed: ${payload.error.description}`
            : 'Test payment failed. Nothing was charged — try again or cancel.',
        );
      });

      rz.open();
      // The modal's own handler clears this; if the user never interacts we still release.
      busyRef.current = false;
      setBusy(false);
    } catch (err) {
      busyRef.current = false;
      setBusy(false);
      setError(err instanceof Error ? err.message : 'Something went wrong starting the payment.');
    }
  }, [items, router]);

  const disabled = !hydrated || totals.itemCount === 0 || busy;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={pay}
        disabled={disabled}
        aria-busy={busy}
        className="min-h-12 w-full rounded-lg bg-[#006569] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy
          ? 'Starting test payment…'
          : totals.itemCount === 0
            ? 'Cart is empty'
            : `Pay ${formatINR(totals.totalPaise)} (test)`}
      </button>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs leading-relaxed text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}