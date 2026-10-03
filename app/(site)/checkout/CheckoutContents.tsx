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

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart/store';
import { formatINR, formatPlainSlash } from '@/lib/cart/format';
import type { CartLine } from '@/lib/cart/math';
// CHANGE: 2026-10-03 — SP-3 buyer capture: shared pure validators gate Pay and feed
// Razorpay prefill; TSS serials are captured one-per-TSS-line (owner 2026-10-03).
import { validateCustomer, validateTssSerials, isTssSlug, type Customer } from '@/lib/order-status';

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

interface OrderResponse {
  ok: boolean;
  orderId?: string;
  razorpayOrderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  customer?: Customer;
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
  showSerialInput,
  serial,
  onSerialChange,
  serialError,
}: {
  line: CartLine;
  onPlus: () => void;
  onMinus: () => void;
  onRemove: () => void;
  showSerialInput?: boolean;
  serial?: string;
  onSerialChange?: (value: string) => void;
  serialError?: string;
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
        {/* CHANGE: 2026-10-03 — TSS serial capture (owner): one serial per TSS line,
            shown only for tss-* items. The value lives in CheckoutContents state —
            never in cart storage — and the Pay gate depends on every serial being valid. */}
        {showSerialInput && onSerialChange && (
          <div className="mt-2.5">
            <label
              htmlFor={`serial-${line.slug}`}
              className="block text-[11px] font-bold uppercase tracking-wide text-slate-600"
            >
              TSS Serial Number <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id={`serial-${line.slug}`}
              type="text"
              value={serial ?? ''}
              onChange={(e) => onSerialChange(e.target.value)}
              placeholder="e.g. your Tally serial"
              autoComplete="off"
              spellCheck={false}
              aria-invalid={serialError ? true : undefined}
              aria-describedby={serialError ? `serial-${line.slug}-error` : undefined}
              className="mt-1 w-full max-w-[240px] rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] aria-[invalid=true]:border-red-300"
            />
            {serialError && (
              <p id={`serial-${line.slug}-error`} role="alert" className="mt-1 text-[11px] font-medium text-red-600">
                {serialError}
              </p>
            )}
          </div>
        )}
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

/** CHANGE: 2026-10-03 — SP-3 buyer-card field: labelled input + live per-field error. */
function Field({
  id,
  label,
  value,
  onChange,
  required,
  error,
  type = 'text',
  autoComplete,
  inputMode,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric';
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-wide text-slate-600">
        {label} {required && <span aria-hidden="true" className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] ${
          error ? 'border-red-300' : 'border-slate-300'
        }`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-[11px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function PayButton({
  customer,
  tssSerials,
  detailsValid,
}: {
  customer: Customer;
  tssSerials: Record<string, string>;
  detailsValid: boolean;
}) {
  const { items, totals, hydrated } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busyRef = useRef(false);

  useEffect(() => () => { busyRef.current = false; }, []);

  const pay = useCallback(async () => {
    if (busyRef.current || !detailsValid) return;
    busyRef.current = true;
    setBusy(true);
    setError(null);

    try {
      // Only {items} is sent as the money input — slugs + quantities. Customer + TSS
      // serials are contact/fulfilment data (SP-3), never a verification input.
      const res = await fetch('/api/cart/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customer, tssSerials }),
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
        // CHANGE: 2026-10-03 — SP-3: prefill the modal from the validated buyer
        // (the server echo is authoritative; fall back to local state).
        prefill: {
          name: data.customer?.name ?? customer.name,
          email: data.customer?.email ?? customer.email,
          contact: data.customer?.phone ?? customer.phone,
        },
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
  }, [items, customer, tssSerials, detailsValid, router]);

  return (
    <div>
      <button
        type="button"
        onClick={pay}
        disabled={busy || !hydrated || totals.itemCount === 0 || !detailsValid}
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
      {/* CHANGE: 2026-10-03 — SP-3: guide the buyer to complete the gated fields. */}
      {!detailsValid && (
        <p role="status" className="mt-3 rounded-lg border border-teal-100 bg-teal-50/70 px-3 py-2 text-xs font-medium text-[#006569]">
          Add your details above to continue.
        </p>
      )}
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

  // CHANGE: 2026-10-03 — SP-3 buyer capture. All of this is LOCAL checkout state —
  // deliberately NOT cart storage (the cart is transportable across pages; the buyer
  // details are a per-checkout concern). Errors surface per-field after touch.
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', company: '' });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serialBySlug, setSerialBySlug] = useState<Record<string, string>>({});
  const [touchedSerials, setTouchedSerials] = useState<Record<string, boolean>>({});

  const customerValidation = useMemo(() => validateCustomer(customer), [customer]);
  // TSS slugs derive from the CURRENT cart totals — serials are only required for
  // lines actually present (owner 2026-10-03: one serial per TSS line).
  const tssSlugs = totals.lines.filter((l) => isTssSlug(l.slug)).map((l) => l.slug);
  const serialsValidation = useMemo(() => validateTssSerials(serialBySlug, tssSlugs), [serialBySlug, tssSlugs]);
  const detailsValid = customerValidation.ok && serialsValidation.ok;

  const setField = useCallback((key: 'name' | 'email' | 'phone' | 'company', value: string) => {
    setCustomer((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  // Discriminated-union access needs `=== false` under tsconfig strict:false (repro'd
  // during Task 2) — `!ok` does not narrow. Errors render only once a field is touched.
  const fieldError = useCallback(
    (key: 'name' | 'email' | 'phone' | 'company'): string | undefined => {
      if (!touched[key]) return undefined;
      if (customerValidation.ok === false) return customerValidation.errors[key];
      return undefined;
    },
    [touched, customerValidation],
  );

  const serialErrorFor = useCallback(
    (slug: string): string | undefined => {
      if (!touchedSerials[slug]) return undefined;
      if (serialsValidation.ok === false) return serialsValidation.errors[slug];
      return undefined;
    },
    [touchedSerials, serialsValidation],
  );

  const onSerialChange = useCallback((slug: string, value: string) => {
    setSerialBySlug((prev) => ({ ...prev, [slug]: value }));
    setTouchedSerials((prev) => ({ ...prev, [slug]: true }));
  }, []);

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
          <div className="space-y-6">
            {/* CHANGE: 2026-10-03 — SP-3 buyer details card. First block of the left
                column; on mobile it stacks naturally above the order summary. */}
            <section aria-label="Your details" className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-xs font-black uppercase tracking-wide text-slate-900">Your details</h2>
              <div className="mt-3 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    id="cust-name"
                    label="Name"
                    value={customer.name}
                    onChange={(v) => setField('name', v)}
                    required
                    error={fieldError('name')}
                    autoComplete="name"
                  />
                  <Field
                    id="cust-phone"
                    label="Phone"
                    type="tel"
                    value={customer.phone}
                    onChange={(v) => setField('phone', v)}
                    required
                    error={fieldError('phone')}
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="10-digit mobile"
                  />
                </div>
                <Field
                  id="cust-email"
                  label="Email"
                  type="email"
                  value={customer.email}
                  onChange={(v) => setField('email', v)}
                  required
                  error={fieldError('email')}
                  autoComplete="email"
                  inputMode="email"
                />
                <Field
                  id="cust-company"
                  label="Company"
                  value={customer.company}
                  onChange={(v) => setField('company', v)}
                  error={fieldError('company')}
                  autoComplete="organization"
                />
              </div>
            </section>

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
                    showSerialInput={isTssSlug(line.slug)}
                    serial={serialBySlug[line.slug]}
                    onSerialChange={(value) => onSerialChange(line.slug, value)}
                    serialError={serialErrorFor(line.slug)}
                  />
                ))}
              </ul>
            </section>
          </div>

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
              <PayButton
                customer={{
                  name: customer.name,
                  email: customer.email,
                  phone: customer.phone,
                  company: customer.company || undefined,
                }}
                tssSerials={serialBySlug}
                detailsValid={detailsValid}
              />
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