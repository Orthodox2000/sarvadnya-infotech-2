'use client';

// CHANGE: 2026-10-02 — checkout page body + Razorpay pay button (SP-1 cart build).
// WHY: mirrors the /demo gateway's money rules exactly — the browser sends {items} ONLY, the
// server reprices from the live prices collection and returns the authoritative amount + the
// validated TEST key. The client never chooses an amount; payment success is not trusted from
// the client (the success page re-verifies the HMAC server-side); a closed modal surfaces a
// "nothing was charged" notice instead of silently leaving the user staring at the cart.
//
// CHANGE: 2026-10-02 — order-summary lines gained a quantity stepper + Remove (owner request:
// "checkout screen must also have option to change quantity of products and also remove if
// needed"). Mirrors the drawer exactly: minus at qty 1 REMOVES the line (it is the delete),
// plus is clamped by the pure math at MAX_QTY, each button carries the same aria-labels. The
// Pay amount stays server-authoritative — the client only mutates the cart, /api/cart/order
// still reprices {items} from the DB and never trusts a client figure.

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart/store';
import { formatINR, formatPlainSlash } from '@/lib/cart/format';
import type { CartLine } from '@/lib/cart/math';

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

function SummaryLine({
  line,
  onPlus,
  onMinus,
  onRemove,
}: {
  line: CartLine;
  onPlus: () => void;
  onMinus: () => void;
  onRemove: () => void;
}) {
  return (
    <li className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold text-slate-800">{line.item.name}</p>
        <p className="text-[11px] text-slate-500">
          {formatINR(line.unitPaise)} each
          {line.item.discountPaise > 0 && (
            <span className="ml-1.5 font-semibold text-[#006569]">Save {formatINR(line.item.discountPaise)}</span>
          )}
        </p>
        {/* Qty stepper — identical semantics to the drawer: minus at qty 1 REMOVES the line. */}
        <div className="mt-1.5 inline-flex items-center rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={onMinus}
            aria-label={line.qty === 1 ? `Remove ${line.item.name} from cart` : `Decrease quantity of ${line.item.name}`}
            className="flex size-7 items-center justify-center rounded-l-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
          >
            −
          </button>
          <span className="w-8 text-center text-xs font-bold text-slate-900" aria-label={`${line.qty} in cart`}>
            {line.qty}
          </span>
          <button
            type="button"
            onClick={onPlus}
            aria-label={`Increase quantity of ${line.item.name}`}
            className="flex size-7 items-center justify-center rounded-r-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <p className="text-[13px] font-black tabular-nums text-slate-900">{formatINR(line.totalPaise)}</p>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${line.item.name} from cart`}
          className="rounded p-1 text-[11px] font-bold uppercase tracking-wide text-slate-400 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          Remove
        </button>
      </div>
    </li>
  );
}

function PayButton() {
  const { items, totals, hydrated } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busyRef = useRef(false);

  useEffect(() => () => { busyRef.current = false; }, []);

  const pay = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError(null);

    try {
      // Only {items} is sent — slugs + quantities. No amount, no tax, no total.
      const res = await fetch('/api/cart/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data: OrderResponse = await res.json().catch(() => ({} as OrderResponse));

      if (!res.ok || !data.ok || !data.razorpayOrderId || !data.amount || !data.keyId) {
        throw new Error(data.error || `Could not start the payment (HTTP ${res.status}).`);
      }

      await loadCheckoutScript();
      if (!window.Razorpay) throw new Error('Razorpay checkout failed to initialise.');

      const rz = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency ?? 'INR',
        name: 'Sarvadnya Infotech LLP',
        description: `Order ${data.orderId ?? ''} — test mode, no real payment`,
        order_id: data.razorpayOrderId,
        prefill: {},
        notes: { testMode: 'true' },
        theme: { color: '#006569' },
        handler: (response: Record<string, string>) => {
          // The client asserts NOTHING about success. The ids are forwarded to the success
          // page, which re-verifies the HMAC server-side before it renders a receipt.
          const qs = new URLSearchParams({
            razorpayOrderId: data.razorpayOrderId!,
            razorpayPaymentId: response.razorpay_payment_id ?? '',
            razorpaySignature: response.razorpay_signature ?? '',
          });
          router.push(`/checkout/success?${qs.toString()}`);
        },
        modal: {
          ondismiss: () => {
            busyRef.current = false;
            setBusy(false);
            setError('Checkout was cancelled — nothing was charged and your cart is untouched.');
          },
        },
      });

      const withEvents = rz as unknown as {
        on?: (event: string, cb: (payload: { error?: { description?: string } }) => void) => void;
      };
      withEvents.on?.('payment.failed', (payload) => {
        busyRef.current = false;
        setBusy(false);
        setError(payload.error?.description || 'The payment failed — nothing was charged.');
      });

      rz.open();
    } catch (err) {
      busyRef.current = false;
      setBusy(false);
      setError(err instanceof Error ? err.message : 'Could not start the payment.');
    }
  }, [items, router]);

  return (
    <div>
      <button
        type="button"
        onClick={pay}
        disabled={busy || !hydrated || totals.itemCount === 0}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#006569] px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#045A57] disabled:cursor-not-allowed disabled:bg-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2"
      >
        {busy ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
            Starting secure checkout…
          </>
        ) : (
          <>Pay {formatINR(totals.totalPaise)}</>
        )}
      </button>
      {error && (
        <p role="status" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutContents() {
  const { items, totals, hydrated, setQty, remove } = useCart();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
        <Link href="/" className="hover:text-[#006569]">Home</Link>
        <span aria-hidden="true">/</span>
        <span className="text-[#006569]">Checkout</span>
      </div>
      <h1 className="mt-2 text-2xl font-black text-slate-900">Checkout</h1>

      {/* Test-mode banner: explicit, above the fold, before any money figure. */}
      <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Test mode</p>
        <p className="mt-0.5 text-xs leading-relaxed text-amber-800/90">
          This checkout runs on Razorpay <strong>test keys</strong> — the mock bank on the next
          screen lets you succeed or fail the payment. No real money moves and no order is fulfilled.
        </p>
      </div>

      {!hydrated ? (
        <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-10 text-slate-400">
          <span className="size-4 animate-spin rounded-full border-2 border-[#006569]/20 border-t-[#006569]" aria-hidden="true" />
          <span className="text-xs font-semibold">Loading your cart…</span>
        </div>
      ) : totals.itemCount === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm font-bold text-slate-800">Your cart is empty</p>
          <p className="mt-1 text-xs text-slate-500">Nothing can be checked out yet.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex rounded-lg bg-[#006569] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#045A57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Items */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5" aria-label="Order summary">
            <h2 className="text-xs font-black uppercase tracking-wide text-slate-900">Order summary</h2>
            <ul className="mt-2 divide-y divide-slate-100">
              {totals.lines.map((line) => (
                <SummaryLine
                  key={line.slug}
                  line={line}
                  onPlus={() => setQty(line.slug, line.qty + 1)}
                  onMinus={() => (line.qty === 1 ? remove(line.slug) : setQty(line.slug, line.qty - 1))}
                  onRemove={() => remove(line.slug)}
                />
              ))}
            </ul>
          </section>

          {/* Totals */}
          <section aria-label="Payment" className="h-fit rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-40">
            <dl className="space-y-1.5 text-[13px]">
              <div className="flex items-center justify-between text-slate-600">
                <dt>Subtotal (base)</dt>
                <dd className="font-semibold tabular-nums text-slate-800">{formatPlainSlash(totals.subtotalPaise)}</dd>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <dt>GST</dt>
                <dd className="font-semibold tabular-nums text-slate-800">{formatPlainSlash(totals.gstPaise)}</dd>
              </div>
              {totals.discountPaise > 0 && (
                <div className="flex items-center justify-between text-[#006569]">
                  <dt>Discount</dt>
                  <dd className="font-bold tabular-nums">− {formatPlainSlash(totals.discountPaise)}</dd>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                <dt className="text-sm font-black uppercase tracking-wide text-slate-900">Total</dt>
                <dd className="text-xl font-black tabular-nums text-[#006569]">{formatINR(totals.totalPaise)}</dd>
              </div>
            </dl>
            <div className="mt-4">
              <PayButton />
            </div>
            <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {items.length} line{itemCountLabel(items)} · Proceed to Razorpay
            </p>
          </section>
        </div>
      )}
    </div>
  );
}

function itemCountLabel(items: { qty: number }[]): string {
  return items.length !== 1 ? 's' : '';
}