"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { SimControl, SimKey, SimTips, TallyChrome, type TallyTab } from "./TallyChrome";

/**
 * CHANGE: 2026-11-03 — interactive TallyPrime walkthrough for the SalesMan / Agent module.
 *
 * WHY: the brochure's sales voucher, commission preview and settlement screens are print only.
 * Every figure below (120 nos, Rs. 480 base rate, Rs. 20 rate difference, 2.5%, Rs. 1,440
 * commission, Rs. 2,400 RD, Rs. 57,600 base value, the three brokers) comes from
 * public/brochures/salesman-agent-module-brochure.pdf.
 */
type Screen = "voucher" | "preview" | "settle";
type Basis = "percentage" | "quantity";
type Broker = "R. Mehta & Co." | "Joshi Agencies" | "Nair Traders";

const TABS: TallyTab[] = [
  { id: "voucher", step: "1", label: "Sales voucher" },
  { id: "preview", step: "2", label: "Commission preview" },
  { id: "settle", step: "3", label: "Settlement" },
];

const TITLES: Record<Screen, { title: string; crumb: string }> = {
  voucher: {
    title: "Sales Voucher — New · TallyPrime",
    crumb: "Gateway of Tally > Vouchers > F8 Sales",
  },
  preview: {
    title: "Commission Preview — Module active",
    crumb: "Sales Voucher > Broker / Agent > Commission Preview",
  },
  settle: {
    title: "Broker Settlement — Paid and unpaid",
    crumb: "Agent Module > Reports > Settlement",
  },
};

const BROKERS: { name: Broker; sales: number; commission: number; rd: number; paid: boolean }[] = [
  { name: "R. Mehta & Co.", sales: 880000, commission: 22000, rd: 2400, paid: false },
  { name: "Joshi Agencies", sales: 640000, commission: 16000, rd: 1150, paid: true },
  { name: "Nair Traders", sales: 420000, commission: 10500, rd: 3050, paid: false },
];

const inr = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function AgentSimulator() {
  const [screen, setScreen] = useState<Screen>("voucher");
  const [basis, setBasis] = useState<Basis>("percentage");
  const [qty, setQty] = useState(120);
  const [baseRate, setBaseRate] = useState(480);
  const [rdPerUnit, setRdPerUnit] = useState(20);
  const [percent, setPercent] = useState(2.5);
  const [perUnit, setPerUnit] = useState(5);
  const [brokers, setBrokers] = useState(BROKERS);
  const [toast, setToast] = useState("Ready • Sales voucher with broker R. Mehta & Co.");

  const baseValue = qty * baseRate;
  const rd = qty * rdPerUnit;
  const commission = useMemo(
    () => (basis === "percentage" ? (baseValue * percent) / 100 : qty * perUnit),
    [basis, baseValue, percent, qty, perUnit],
  );
  const saveable = useMemo(() => Math.max(0, baseValue - rd), [baseValue, rd]);

  function go(next: Screen) {
    setScreen(next);
    setToast(`Screen changed: ${TITLES[next].title}`);
  }

  function cycleBasis() {
    const next: Basis = basis === "percentage" ? "quantity" : "percentage";
    setBasis(next);
    setScreen("preview");
    setToast(`Commission basis: ${next === "percentage" ? "Percentage of sales value" : "Fixed amount per unit"}`);
  }

  function togglePaid(name: Broker) {
    setBrokers((rows) =>
      rows.map((row) => (row.name === name ? { ...row, paid: !row.paid } : row)),
    );
    const row = brokers.find((item) => item.name === name);
    setToast(`${name}: ${row?.paid ? "marked unpaid" : "marked paid"} — audit trail updated`);
  }

  return (
    <TallyChrome
      company="Sample Distribution Co. (FY 2026-27)"
      tabs={TABS}
      active={screen}
      onTab={(id) => go(id as Screen)}
      title={TITLES[screen].title}
      crumb={TITLES[screen].crumb}
      toast={toast}
      sidebar={
        <>
          <div className="space-y-1">
            <p className="px-1 pb-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-500">
              TallyPrime keys
            </p>
            <SimKey label="F2: Period" onClick={() => setToast("Period: April 2026")} />
            <SimKey label="F3: Company" onClick={() => setToast("Active company: Sample Distribution Co.")} />
            <SimKey label="F8: Sales voucher" strong onClick={() => go("voucher")} />
            <SimKey label="F10: Ledger" onClick={() => setToast("Ledger: R. Mehta & Co. (broker)")} />

            <p className="px-1 pb-0.5 pt-2 text-[9px] font-extrabold uppercase tracking-wider text-[#033B38]">
              Module controls
            </p>
            <SimControl label={`B: Basis (${basis === "percentage" ? "Percent" : "Quantity"})`} onClick={cycleBasis} />
            <SimControl label="C: Commission preview" onClick={() => go("preview")} />
            <SimControl label="R: RD report" onClick={() => setToast("Rate Difference report: Mehta ₹2,400 · Joshi ₹1,150 · Nair ₹3,050")} />
            <SimControl label="S: Settlement" onClick={() => go("settle")} />
          </div>

          <div className="rounded-sm border border-[#C5E3E3] bg-white p-2 text-[10px] leading-tight text-slate-600">
            <strong className="mb-0.5 block text-[#033B38]">Interactive tip:</strong>
            change the basis, the rate or the quantity — commission always stays on the base rate.
          </div>
        </>
      }
    >
      {screen === "voucher" && (
        <div className="flex min-h-[460px] flex-col justify-between">
          <div className="space-y-4 p-4">
            <div className="border-b border-slate-300 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#033B38] px-2.5 py-0.5 font-sans text-[11px] font-bold text-white">Sales</span>
                <span className="font-sans text-[11px] font-bold text-slate-500">No.</span>
                <span className="border border-[#033B38] bg-[#E5F4F4] px-2 py-0.5 font-mono text-xs font-bold text-[#033B38]">
                  1
                </span>
                <span className="ml-auto font-sans text-[11px] font-bold text-[#033B38]">15-Apr-26</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 font-sans text-[11px] sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <span className="w-28 shrink-0 font-semibold text-slate-600">Party A/c name</span>
                <span className="font-extrabold text-[#033B38] underline decoration-dotted">Sharma Traders, Pune</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-28 shrink-0 font-semibold text-slate-600">Broker / Agent</span>
                <span className="font-extrabold text-[#033B38]">
                  {brokers[0].name} <span className="font-normal text-slate-500">· 2.5% basis</span>
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-28 shrink-0 font-semibold text-slate-600">Item</span>
                <span className="font-bold">MS Pipe 25mm</span>
              </p>
              <label className="flex items-center gap-2">
                <span className="w-28 shrink-0 font-semibold text-slate-600">Quantity</span>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(event) => {
                    setQty(Math.max(1, Number(event.target.value) || 1));
                    setToast("Quantity changed — commission recalculated");
                  }}
                  className="w-24 rounded-sm border border-[#045A57] bg-white px-2 py-1 font-mono text-[11px] text-[#033B38]"
                />
                <span className="text-slate-500">nos</span>
              </label>
              <label className="flex items-center gap-2">
                <span className="w-28 shrink-0 font-semibold text-slate-600">Rate (base)</span>
                <input
                  type="number"
                  min={0}
                  value={baseRate}
                  onChange={(event) => {
                    setBaseRate(Math.max(0, Number(event.target.value) || 0));
                    setToast("Base rate changed — RD and commission recalculated");
                  }}
                  className="w-24 rounded-sm border border-[#045A57] bg-white px-2 py-1 font-mono text-[11px] text-[#033B38]"
                />
                <span className="text-slate-500">/ nos</span>
              </label>
              <label className="flex items-center gap-2">
                <span className="w-28 shrink-0 font-semibold text-slate-600">Rate Difference</span>
                <input
                  type="number"
                  min={0}
                  value={rdPerUnit}
                  onChange={(event) => {
                    setRdPerUnit(Math.max(0, Number(event.target.value) || 0));
                    setToast("Rate Difference changed — tracked separately");
                  }}
                  className="w-24 rounded-sm border border-[#045A57] bg-white px-2 py-1 font-mono text-[11px] text-[#033B38]"
                />
                <span className="text-slate-500">/ nos · tracked separately</span>
              </label>
            </div>

            <div className="rounded border border-[#C5E3E3] bg-[#E5F4F4] p-3 font-sans text-[11px]">
              <p className="font-bold text-[#033B38]">In the voucher</p>
              <ul className="mt-1 space-y-1 text-slate-700">
                <li>• GST and taxes are excluded from the commission base.</li>
                <li>• The rate difference is captured without touching the base rate.</li>
                <li>• Commission and RD post to their ledgers automatically when the voucher is saved.</li>
              </ul>
            </div>
          </div>

          <SimTips
            tips={[
              {
                n: 1,
                title: "Nothing changes in your routine:",
                body: "the broker is picked on the normal sales voucher — no separate commission entry.",
              },
              {
                n: 2,
                title: "RD never enters the base:",
                body: "the rate difference is tracked separately, so commission is calculated on your rate only.",
              },
            ]}
          />
        </div>
      )}

      {screen === "preview" && (
        <div className="flex min-h-[460px] flex-col justify-between">
          <div className="space-y-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-3 font-sans">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#006569]">Module active</p>
                <p className="text-sm font-black text-[#033B38]">Commission preview</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setBasis("percentage");
                    setToast("Commission basis: Percentage of sales value");
                  }}
                  aria-pressed={basis === "percentage"}
                  className={`rounded-sm border px-2.5 py-1 text-[10px] font-extrabold ${
                    basis === "percentage"
                      ? "border-[#033B38] bg-[#033B38] text-white"
                      : "border-[#C5E3E3] bg-white text-[#033B38]"
                  }`}
                >
                  Percentage basis
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBasis("quantity");
                    setToast("Commission basis: Fixed amount per unit");
                  }}
                  aria-pressed={basis === "quantity"}
                  className={`rounded-sm border px-2.5 py-1 text-[10px] font-extrabold ${
                    basis === "quantity"
                      ? "border-[#033B38] bg-[#033B38] text-white"
                      : "border-[#C5E3E3] bg-white text-[#033B38]"
                  }`}
                >
                  Quantity basis
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded border border-[#C5E3E3] bg-[#E5F4F4] p-3 font-sans text-[11px]">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#033B38]">
                  {basis === "percentage" ? "Percentage basis" : "Quantity basis"}
                </p>
                <p className="mt-1 text-slate-600">
                  {basis === "percentage"
                    ? "A percentage of the sales value — always applied to the base rate, never to RD or taxes."
                    : "A fixed amount per unit sold — ideal for distribution and volume-driven channels."}
                </p>

                <div className="mt-3 space-y-2">
                  {basis === "percentage" ? (
                    <label className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-700">Commission %</span>
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={percent}
                        onChange={(event) => {
                          setPercent(Math.max(0, Number(event.target.value) || 0));
                          setToast("Commission percentage changed");
                        }}
                        className="w-20 rounded-sm border border-[#045A57] bg-white px-2 py-1 text-right font-mono text-[11px] text-[#033B38]"
                      />
                    </label>
                  ) : (
                    <label className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-700">Commission / unit</span>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={perUnit}
                        onChange={(event) => {
                          setPerUnit(Math.max(0, Number(event.target.value) || 0));
                          setToast("Commission per unit changed");
                        }}
                        className="w-20 rounded-sm border border-[#045A57] bg-white px-2 py-1 text-right font-mono text-[11px] text-[#033B38]"
                      />
                    </label>
                  )}
                  <p className="rounded border border-[#C5E3E3] bg-white p-2 font-mono text-[10px] text-slate-600">
                    {basis === "percentage"
                      ? `${percent}% × ₹${inr.format(baseValue)} = ₹${inr.format(commission)}`
                      : `₹${perUnit} / unit × ${qty} units = ₹${inr.format(commission)}`}
                  </p>
                </div>
              </div>

              <div className="rounded border-2 border-[#033B38] bg-[#033B38] p-4 font-sans text-white">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#C5E3E3]">Commission preview</p>
                <dl className="mt-2 space-y-1.5 text-[11px]">
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#E5F4F4]">Base value</dt>
                    <dd className="font-mono font-bold">₹ {inr.format(baseValue)}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#E5F4F4]">
                      Commission @ {basis === "percentage" ? `${percent}%` : `₹${perUnit}/unit`}
                    </dt>
                    <dd className="font-mono font-bold">₹ {inr.format(commission)}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#E5F4F4]">Rate Difference</dt>
                    <dd className="font-mono font-bold">₹ {inr.format(rd)}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#E5F4F4]">Taxes &amp; GST</dt>
                    <dd className="font-bold text-[#D4EAEA]">Excluded</dd>
                  </div>
                  <div className="mt-2 flex justify-between gap-2 border-t border-[#045A57] pt-2 text-sm">
                    <dt className="font-bold text-[#D4EAEA]">Payable to agent</dt>
                    <dd className="font-mono font-black text-white">₹ {inr.format(commission)}</dd>
                  </div>
                </dl>
                <p className="mt-2 text-[10px] leading-tight text-[#C5E3E3]">
                  Commission is calculated strictly on the base rate — RD and taxes are always excluded.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setScreen("settle");
                    setToast("Commission and RD posted to the settlement ledger");
                  }}
                  className="mt-3 w-full rounded-sm border border-[#D4EAEA] bg-[#045A57] px-3 py-1.5 text-[10px] font-extrabold uppercase text-white hover:bg-[#006569]"
                >
                  Post &amp; settle
                </button>
              </div>
            </div>

            <p className="rounded border border-[#C5E3E3] bg-[#E5F4F4] p-2 font-sans text-[10px] text-slate-600">
              Base value after RD: <strong className="text-[#033B38]">₹ {inr.format(saveable)}</strong> — the RD is
              shown on the invoice but is not used to calculate commission.
            </p>
          </div>

          <SimTips
            tips={[
              {
                n: 1,
                title: "One basis, two shapes:",
                body: "quantity basis pays a fixed amount per unit; percentage basis pays on the sales value.",
              },
              {
                n: 2,
                title: "Precision guaranteed:",
                body: "RD and taxes are excluded, so every payout matches the agreed rate.",
              },
            ]}
          />
        </div>
      )}

      {screen === "settle" && (
        <div className="flex min-h-[460px] flex-col justify-between">
          <div className="space-y-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-3 font-sans">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#006569]">Settlement</p>
                <p className="text-sm font-black text-[#033B38]">Complete visibility over your agent network</p>
              </div>
              <span className="rounded-sm border border-[#045A57] bg-[#D4EAEA] px-2 py-0.5 text-[10px] font-bold text-[#033B38]">
                {brokers.filter((row) => !row.paid).length} unpaid
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <caption className="sr-only">
                  Broker-wise sales, commission, rate difference and paid status
                </caption>
                <thead>
                  <tr className="border-y-2 border-[#033B38] bg-[#E5F4F4] font-sans text-[10px] font-extrabold uppercase text-[#033B38]">
                    <th className="px-2 py-2">Broker / Agent</th>
                    <th className="px-2 py-2 text-right">Broker-wise sales</th>
                    <th className="px-2 py-2 text-right">Commission</th>
                    <th className="px-2 py-2 text-right">Rate difference</th>
                    <th className="px-2 py-2 text-center">Status</th>
                    <th className="px-2 py-2 text-right">Settlement</th>
                  </tr>
                </thead>
                <tbody>
                  {brokers.map((row) => (
                    <tr key={row.name} className="border-b border-slate-200">
                      <td className="px-2 py-2 font-sans text-[11px] font-extrabold text-[#033B38]">{row.name}</td>
                      <td className="px-2 py-2 text-right font-mono">₹ {inr.format(row.sales)}</td>
                      <td className="px-2 py-2 text-right font-mono font-bold">₹ {inr.format(row.commission)}</td>
                      <td className="px-2 py-2 text-right font-mono text-[#045A57]">₹ {inr.format(row.rd)}</td>
                      <td className="px-2 py-2 text-center">
                        <span
                          className={`inline-block rounded-sm border px-1.5 py-0.5 font-sans text-[10px] font-bold ${
                            row.paid
                              ? "border-[#006569] bg-[#E5F4F4] text-[#033B38]"
                              : "border-[#045A57] bg-[#D4EAEA] text-[#033B38]"
                          }`}
                        >
                          {row.paid ? "PAID" : "UNPAID"}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => togglePaid(row.name)}
                          className="rounded-sm border border-[#033B38] bg-white px-2 py-1 font-sans text-[10px] font-bold text-[#033B38] hover:bg-[#D4EAEA]"
                        >
                          {row.paid ? "Mark unpaid" : "Mark paid"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-y-2 border-[#033B38] bg-[#E5F4F4] font-extrabold text-[#033B38]">
                    <td className="px-2 py-2 font-sans text-[10px] uppercase">Total</td>
                    <td className="px-2 py-2 text-right font-mono">
                      ₹ {inr.format(brokers.reduce((sum, row) => sum + row.sales, 0))}
                    </td>
                    <td className="px-2 py-2 text-right font-mono">
                      ₹ {inr.format(brokers.reduce((sum, row) => sum + row.commission, 0))}
                    </td>
                    <td className="px-2 py-2 text-right font-mono">
                      ₹ {inr.format(brokers.reduce((sum, row) => sum + row.rd, 0))}
                    </td>
                    <td className="px-2 py-2 text-center font-sans text-[10px]" colSpan={2}>
                      {brokers.filter((row) => row.paid).length} of {brokers.length} settled
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <p className="flex items-start gap-2 rounded border border-[#C5E3E3] bg-[#E5F4F4] p-2 font-sans text-[10px] text-slate-600">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#006569]" aria-hidden="true" />
              Marking a payout as paid keeps a traceable audit trail, so paid and unpaid commission and RD
              never get mixed up.
            </p>
          </div>

          <SimTips
            tips={[
              {
                n: 1,
                title: "Paid vs unpaid is explicit:",
                body: "a single click records the settlement against the broker and the invoice.",
              },
              {
                n: 2,
                title: "Reports agree with the ledger:",
                body: "broker-wise sales, commission and the RD report all read from the same vouchers.",
              },
            ]}
          />
        </div>
      )}
    </TallyChrome>
  );
}
