'use client';

// CHANGE: 2026-10-26 — SEO layer 2: the free TSS expiry checker. WHAT: the visitor types the
// coverage end date that TallyPrime shows and this returns the days left (or days since
// expiry). WHY: it answers a real search query ("how many days left on my TSS") without
// inventing anything — the date is theirs, the arithmetic is trivial, and every fact shown
// alongside it is already published in our guides.
//
// PRIVACY / STORAGE: the date is held in component state only. Nothing is sent to a server,
// nothing is written to localStorage/sessionStorage, and there is no analytics event.
//
// HYDRATION: "today" is resolved in an effect, never during render. The server and the
// browser can disagree about the current date (timezone / midnight), so rendering a day count
// during SSR would hydrate a different number and React would throw a mismatch. Before the
// effect runs the panel simply shows the prompt.

import { useEffect, useMemo, useState } from 'react';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseDay(value: string): Date | null {
  const parts = value.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  const [year, month, day] = parts;
  if (year < 2000 || year > 2100) return null;
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

function formatDay(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function TssExpiryChecker() {
  const [value, setValue] = useState('');
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  }, []);

  const result = useMemo(() => {
    if (!today) return null;
    if (!value) return { kind: 'empty' as const };
    const end = parseDay(value);
    if (!end) return { kind: 'invalid' as const };
    const days = Math.round((end.getTime() - today.getTime()) / MS_PER_DAY);
    return { kind: 'ok' as const, days, end };
  }, [value, today]);

  return (
    <div className="rounded-3xl border border-[#E5F4F4] bg-[#FBFAF6] p-5 sm:p-7">
      <label htmlFor="tss-end-date" className="block text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#006569]">
        TSS coverage end date
      </label>
      <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
        Open TallyPrime and go to <span className="font-semibold text-slate-800">F1 (Help) &gt; Settings &gt; License &gt; Manage License</span>.
        The coverage end date is on that screen.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <input
            id="tss-end-date"
            type="date"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            min="2000-01-01"
            max="2100-12-31"
            className="w-full rounded-xl border border-[#C5E3E3] bg-white px-4 py-3 text-[15px] font-semibold text-slate-900 outline-none transition-colors focus:border-[#006569] focus:ring-2 focus:ring-[#006569]/15"
          />
        </div>
        {value ? (
          <button
            type="button"
            onClick={() => setValue('')}
            className="rounded-xl border border-[#C5E3E3] px-4 py-3 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#006569] transition-colors hover:bg-[#E5F4F4]"
          >
            Clear
          </button>
        ) : null}
      </div>

      <div aria-live="polite" className="mt-4">
        {result === null ? (
          <p className="text-[13px] font-semibold text-slate-500">Enter the date to see the result.</p>
        ) : result.kind === 'empty' ? (
          <p className="text-[13px] font-semibold text-slate-500">Pick the end date shown in TallyPrime to see the result.</p>
        ) : result.kind === 'invalid' ? (
          <p className="text-[13px] font-semibold text-[#B45309]">
            That date could not be read. Use the day / month / year shown in Manage License.
          </p>
        ) : result.days > 0 ? (
          <div className="rounded-2xl border border-[#006569]/20 bg-[#E5F4F4] p-4">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#006569]">Active</p>
            <p className="mt-1 text-[22px] font-bold tracking-tight text-slate-900">
              {result.days} {result.days === 1 ? 'day' : 'days'} left
            </p>
            <p className="mt-1 text-[13px] font-semibold text-slate-700">Covered until {formatDay(result.end)}.</p>
          </div>
        ) : result.days === 0 ? (
          <div className="rounded-2xl border border-[#B45309]/25 bg-[#FEF3C7] p-4">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#B45309]">Last day</p>
            <p className="mt-1 text-[22px] font-bold tracking-tight text-slate-900">Expires today</p>
            <p className="mt-1 text-[13px] font-semibold text-slate-700">Coverage ends on {formatDay(result.end)}.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#B45309]/25 bg-[#FEF3C7] p-4">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#B45309]">Expired</p>
            <p className="mt-1 text-[22px] font-bold tracking-tight text-slate-900">
              {Math.abs(result.days)} {Math.abs(result.days) === 1 ? 'day' : 'days'} ago
            </p>
            <p className="mt-1 text-[13px] font-semibold text-slate-700">Coverage ended on {formatDay(result.end)}.</p>
          </div>
        )}
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-slate-500">
        The date is used in your browser only. Nothing is uploaded, saved or tracked, and this page reads nothing
        from your Tally installation.
      </p>
    </div>
  );
}
