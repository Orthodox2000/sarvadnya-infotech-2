import type { Metadata } from 'next';
import CancelResult from './CancelResult';

// CHANGE: 2026-10-02 — payment-cancelled / failed page (SP-1).
// WHY: dismissal and failure are ordinary outcomes of a test payment, not errors. Saying so
// plainly keeps the failure path exercisable instead of looking like a bug.
// noindex from the layout; repeated here for the nested route (spec §3.7).

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Payment cancelled (Test) — Sarvadnya Infotech LLP',
};

export default function DemoCancelPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <main className="min-h-screen bg-[#FBFAF6]">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <CancelResult searchParams={searchParams} />
      </div>
    </main>
  );
}