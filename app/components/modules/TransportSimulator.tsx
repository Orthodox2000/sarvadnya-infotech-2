"use client";

import { useMemo, useState } from "react";
import { FileSpreadsheet, Printer, Zap } from "lucide-react";
import { SimControl, SimKey, SimTips, TallyChrome, type TallyTab } from "./TallyChrome";

/**
 * CHANGE: 2026-11-03 — interactive TallyPrime walkthrough for the Transport module page.
 *
 * WHY: the brochure's LR, freight bill and LR report are print only. LR011 (GoaTrader → ABC
 * Private Limited, Bhiwandi → Goa, 50 MT at Rs. 450/MT = Rs. 24,500, bill Frt/2223/7) is the
 * brochure's own example; the other LRs are sample rows so the register behaves like a real one.
 */
type Screen = "lr" | "bill" | "report";
type Status = "BILLED" | "UNBILLED";

type Lr = {
  no: string;
  date: string;
  party: string;
  from: string;
  to: string;
  vehicle: string;
  weight: number;
  rate: number;
  charges: number;
  status: Status;
  billNo: string;
};

const LRS: Lr[] = [
  {
    no: "LR011",
    date: "15-Apr-26",
    party: "ABC Private Limited",
    from: "Bhiwandi",
    to: "Goa",
    vehicle: "MH04 JK 9921 (hired)",
    weight: 50,
    rate: 450,
    charges: 0,
    status: "BILLED",
    billNo: "Frt/2223/7",
  },
  {
    no: "LR012",
    date: "15-Apr-26",
    party: "Shree Enterprises",
    from: "Pune",
    to: "Nashik",
    vehicle: "MH12 AB 4410 (own)",
    weight: 12,
    rate: 600,
    charges: 600,
    status: "UNBILLED",
    billNo: "—",
  },
  {
    no: "LR013",
    date: "16-Apr-26",
    party: "ABC Private Limited",
    from: "Bhiwandi",
    to: "Surat",
    vehicle: "MH04 JK 9921 (hired)",
    weight: 8,
    rate: 700,
    charges: 400,
    status: "UNBILLED",
    billNo: "—",
  },
  {
    no: "LR014",
    date: "14-Apr-26",
    party: "Coastal Traders",
    from: "Thane",
    to: "Kolhapur",
    vehicle: "MH01 CD 7788 (own)",
    weight: 20,
    rate: 520,
    charges: 0,
    status: "BILLED",
    billNo: "Frt/2223/6",
  },
];

const TABS: TallyTab[] = [
  { id: "lr", step: "1", label: "Lorry receipt" },
  { id: "bill", step: "2", label: "Freight bill" },
  { id: "report", step: "3", label: "LR report" },
];

const TITLES: Record<Screen, { title: string; crumb: string }> = {
  lr: {
    title: "Lorry Receipt — LR011",
    crumb: "Gateway of Tally > Transport > Lorry Receipt",
  },
  bill: {
    title: "Freight Bill — Frt/2223/7",
    crumb: "Transport > Billing > Freight Bill",
  },
  report: {
    title: "LR Report — Billing status and bill number",
    crumb: "Transport > Reports > LR Report",
  },
};

const inr = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function lrTotal(row: Lr): number {
  return row.weight * row.rate + row.charges;
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-block rounded-sm border px-1.5 py-0.5 font-sans text-[10px] font-bold ${
        status === "BILLED"
          ? "border-[#006569] bg-[#E5F4F4] text-[#033B38]"
          : "border-[#045A57] bg-[#D4EAEA] text-[#033B38]"
      }`}
    >
      {status}
    </span>
  );
}

export default function TransportSimulator() {
  const [screen, setScreen] = useState<Screen>("lr");
  const [rows, setRows] = useState<Lr[]>(LRS);
  const [selected, setSelected] = useState(0);
  const [filter, setFilter] = useState<"ALL" | "BILLED" | "UNBILLED">("ALL");
  const [toast, setToast] = useState("Ready • 4 lorry receipts loaded");

  const lr = rows[selected];
  const total = lrTotal(lr);

  const visibleRows = useMemo(
    () => rows.filter((row) => filter === "ALL" || row.status === filter),
    [rows, filter],
  );

  const unbilled = useMemo(() => rows.filter((row) => row.status === "UNBILLED"), [rows]);
  const billedCount = useMemo(() => rows.filter((row) => row.status === "BILLED").length, [rows]);

  function go(next: Screen) {
    setScreen(next);
    setToast(`Screen changed: ${TITLES[next].title}`);
  }

  function patch(field: "weight" | "rate" | "charges", value: number) {
    setRows((current) =>
      current.map((row, index) => {
        if (index !== selected) return row;
        if (field === "weight") return { ...row, weight: value };
        if (field === "rate") return { ...row, rate: value };
        return { ...row, charges: value };
      }),
    );
    setToast(`${field === "weight" ? "Weight" : field === "rate" ? "Rate" : "Other charges"} updated — bill total recalculated`);
  }

  function cycleFilter() {
    const order = ["ALL", "UNBILLED", "BILLED"] as const;
    const next = order[(order.indexOf(filter) + 1) % order.length];
    setFilter(next);
    setScreen("report");
    setToast(`LR report filter: ${next}`);
  }

  function autoCreateBill() {
    if (unbilled.length === 0) {
      setToast("Nothing to bill — every LR already carries a bill number");
      setScreen("report");
      return;
    }
    setRows((current) =>
      current.map((row) => (row.status === "UNBILLED" ? { ...row, status: "BILLED", billNo: "Frt/2223/8" } : row)),
    );
    setFilter("ALL");
    setScreen("bill");
    setToast(`Invoice Frt/2223/8 created from ${unbilled.length} unbilled LR${unbilled.length === 1 ? "" : "s"}`);
  }

  return (
    <TallyChrome
      company="Sample Transport Co. (FY 2026-27)"
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
            <SimKey label="F2: Period" onClick={() => setToast("Period: 01-Apr-26 to 31-Mar-27")} />
            <SimKey label="F3: Company" onClick={() => setToast("Active company: Sample Transport Co.")} />
            <SimKey label="F8: Freight bill" strong onClick={() => go("bill")} />
            <SimKey label="F10: LR register" onClick={() => go("report")} />

            <p className="px-1 pb-0.5 pt-2 text-[9px] font-extrabold uppercase tracking-wider text-[#033B38]">
              Module controls
            </p>
            <SimControl label={`B: Billing status (${filter})`} onClick={cycleFilter} />
            <SimControl label="I: Invoice unbilled LRs" onClick={autoCreateBill} />
            <SimControl label="P: Print with LR details" onClick={() => { setScreen("bill"); setToast("Print preview ready — invoice with LR details"); }} />
            <SimControl label="E: Export annexure" onClick={() => { setScreen("bill"); setToast("Annexure exported for customer reconciliation"); }} />
          </div>

          <div className="rounded-sm border border-[#C5E3E3] bg-white p-2 text-[10px] leading-tight text-slate-600">
            <strong className="mb-0.5 block text-[#033B38]">Interactive tip:</strong>
            open <span className="font-bold underline">I: Invoice unbilled LRs</span> and watch every
            pending LR pick up a bill number.
          </div>
        </>
      }
    >
      {screen === "lr" && (
        <div className="flex min-h-[460px] flex-col justify-between">
          <div className="space-y-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#033B38] px-2.5 py-0.5 font-sans text-[11px] font-bold text-white">
                  Lorry Receipt
                </span>
                <span className="font-sans text-[11px] font-bold text-slate-500">No.</span>
                <span className="border border-[#033B38] bg-[#E5F4F4] px-2 py-0.5 font-mono text-xs font-bold text-[#033B38]">
                  {lr.no}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <label className="font-sans font-semibold text-slate-600">
                  LR
                  <select
                    value={selected}
                    onChange={(event) => {
                      const index = Number(event.target.value);
                      setSelected(index);
                      setToast(`Selected ${rows[index].no} — ${rows[index].party}`);
                    }}
                    className="ml-1.5 rounded-sm border border-[#045A57] bg-white px-2 py-0.5 font-bold text-[#033B38]"
                  >
                    {rows.map((row, index) => (
                      <option key={row.no} value={index}>
                        {row.no} · {row.party}
                      </option>
                    ))}
                  </select>
                </label>
                <StatusBadge status={lr.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-2 font-sans text-[11px] sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <span className="w-24 shrink-0 font-semibold text-slate-600">Consignor</span>
                <span className="font-extrabold text-[#033B38] underline decoration-dotted">GoaTrader</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-24 shrink-0 font-semibold text-slate-600">Consignee</span>
                <span className="font-extrabold text-[#033B38] underline decoration-dotted">{lr.party}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-24 shrink-0 font-semibold text-slate-600">From</span>
                <span className="font-bold">{lr.from}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-24 shrink-0 font-semibold text-slate-600">To</span>
                <span className="font-bold">{lr.to}</span>
              </p>
              <p className="flex items-center gap-2 sm:col-span-2">
                <span className="w-24 shrink-0 font-semibold text-slate-600">Vehicle</span>
                <span className="font-bold">{lr.vehicle}</span>
                <span className="font-sans text-[10px] text-slate-500">own or hired is stored on the LR</span>
              </p>

              <label className="flex items-center gap-2">
                <span className="w-24 shrink-0 font-semibold text-slate-600">Weight (MT)</span>
                <input
                  type="number"
                  min={0}
                  value={lr.weight}
                  onChange={(event) => patch("weight", Math.max(0, Number(event.target.value) || 0))}
                  className="w-24 rounded-sm border border-[#045A57] bg-white px-2 py-1 font-mono text-[11px] text-[#033B38]"
                />
              </label>
              <label className="flex items-center gap-2">
                <span className="w-24 shrink-0 font-semibold text-slate-600">Rate / MT</span>
                <input
                  type="number"
                  min={0}
                  value={lr.rate}
                  onChange={(event) => patch("rate", Math.max(0, Number(event.target.value) || 0))}
                  className="w-24 rounded-sm border border-[#045A57] bg-white px-2 py-1 font-mono text-[11px] text-[#033B38]"
                />
              </label>
              <label className="flex items-center gap-2">
                <span className="w-24 shrink-0 font-semibold text-slate-600">Other charges</span>
                <input
                  type="number"
                  min={0}
                  value={lr.charges}
                  onChange={(event) => patch("charges", Math.max(0, Number(event.target.value) || 0))}
                  className="w-24 rounded-sm border border-[#045A57] bg-white px-2 py-1 font-mono text-[11px] text-[#033B38]"
                />
              </label>
              <p className="flex items-center gap-2">
                <span className="w-24 shrink-0 font-semibold text-slate-600">Bill total</span>
                <span className="font-mono text-sm font-black text-[#033B38]">₹ {inr.format(total)}</span>
              </p>
            </div>

            <div className="rounded border border-[#C5E3E3] bg-[#E5F4F4] p-3 font-sans text-[11px] text-slate-700">
              <p className="font-bold text-[#033B38]">The LR is the billing source</p>
              <p className="mt-1">
                Party, route, vehicle, weight, rate and charges are entered once. The invoice is
                created from this LR — never retyped.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => { setScreen("bill"); setToast(`${lr.no} opened in the freight bill`); }}
                className="inline-flex items-center gap-1.5 rounded-sm border border-[#033B38] bg-[#006569] px-3 py-1.5 font-sans text-[11px] font-extrabold text-white hover:bg-[#045A57]"
              >
                <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                Open freight bill
              </button>
              <button
                type="button"
                onClick={autoCreateBill}
                className="inline-flex items-center gap-1.5 rounded-sm border border-[#045A57] bg-white px-3 py-1.5 font-sans text-[11px] font-bold text-[#033B38] hover:bg-[#E5F4F4]"
              >
                <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                Invoice all unbilled LRs
              </button>
            </div>
          </div>

          <SimTips
            tips={[
              {
                n: 1,
                title: "One LR, every detail:",
                body: "consignor, consignee, route, own or hired vehicle, weight, rate and charges.",
              },
              {
                n: 2,
                title: "Nothing is retyped:",
                body: "the freight bill reads the LR, so the invoice always matches the trip.",
              },
            ]}
          />
        </div>
      )}

      {screen === "bill" && (
        <div className="flex min-h-[460px] flex-col justify-between">
          <div className="space-y-4 p-4">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-300 pb-3">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#033B38] px-2.5 py-0.5 font-sans text-[11px] font-bold text-white">
                    Freight Bill
                  </span>
                  <span className="font-sans text-[11px] font-bold text-slate-500">No.</span>
                  <span className="border border-[#033B38] bg-[#E5F4F4] px-2 py-0.5 font-mono text-xs font-bold text-[#033B38]">
                    {lr.billNo === "—" ? "Frt/2223/7" : lr.billNo}
                  </span>
                </div>
                <p className="font-sans text-[11px] text-slate-600">
                  <span className="inline-block w-24 font-semibold">Party A/c:</span>
                  <span className="font-extrabold text-[#033B38] underline decoration-dotted">{lr.party}</span>
                </p>
                <p className="font-sans text-[11px] text-slate-600">
                  <span className="inline-block w-24 font-semibold">Route:</span>
                  <span className="font-bold">
                    {lr.from} → {lr.to}
                  </span>
                </p>
              </div>

              <div className="text-right font-sans text-[11px]">
                <div className="text-sm font-bold text-[#033B38]">16-Apr-26</div>
                <div className="mt-1 inline-block border border-[#C5E3E3] bg-[#E5F4F4] px-2 py-0.5 font-mono text-[10px] text-[#006569]">
                  LR details printed on the bill
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <caption className="sr-only">
                  Freight bill lines with lorry receipt, weight, rate and amount
                </caption>
                <thead>
                  <tr className="border-y-2 border-[#033B38] bg-[#E5F4F4] font-sans text-[11px] font-extrabold text-[#033B38]">
                    <th className="px-3 py-2">Particulars</th>
                    <th className="w-24 px-3 py-2 text-center">LR no</th>
                    <th className="w-24 px-3 py-2 text-right">Weight</th>
                    <th className="w-28 px-3 py-2 text-right">Rate</th>
                    <th className="w-36 px-3 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2.5 font-sans text-xs font-extrabold text-[#033B38]">Freight</td>
                    <td className="px-3 py-2.5 text-center font-bold">{lr.no}</td>
                    <td className="px-3 py-2.5 text-right">{lr.weight} MT</td>
                    <td className="px-3 py-2.5 text-right">₹ {inr.format(lr.rate)}/MT</td>
                    <td className="px-3 py-2.5 text-right font-bold">₹ {inr.format(lr.weight * lr.rate)}</td>
                  </tr>
                  {lr.charges > 0 && (
                    <tr className="border-b border-slate-200">
                      <td className="px-3 py-2.5 font-sans text-xs font-extrabold text-[#033B38]">
                        Other charges
                      </td>
                      <td className="px-3 py-2.5 text-center text-slate-500">—</td>
                      <td className="px-3 py-2.5 text-right">—</td>
                      <td className="px-3 py-2.5 text-right">—</td>
                      <td className="px-3 py-2.5 text-right font-bold">₹ {inr.format(lr.charges)}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-y-2 border-[#033B38] bg-[#E5F4F4] font-extrabold text-[#033B38]">
                    <td colSpan={4} className="px-3 py-2 text-right font-sans text-[10px] uppercase">
                      Total freight bill amount
                    </td>
                    <td className="bg-[#D4EAEA] px-3 py-2 text-right text-sm">₹ {inr.format(total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex flex-col items-start justify-between gap-3 pt-1 font-sans text-[11px] sm:flex-row sm:items-center">
              <p className="text-slate-600">
                <span className="font-bold text-[#033B38]">Narration:</span> Freight charges as per LR{" "}
                {lr.no} — {lr.from} to {lr.to}. Bill {billedCount} LRs in one invoice when the party is
                the same.
              </p>
              <button
                type="button"
                onClick={() => setToast("Print preview ready — invoice with LR details and annexure")}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border-2 border-[#033B38] bg-[#D4EAEA] px-3 py-1.5 font-extrabold text-[#033B38] hover:bg-[#E5F4F4]"
              >
                <Printer className="h-4 w-4" aria-hidden="true" />
                Print with LR details
              </button>
            </div>
          </div>

          <SimTips
            tips={[
              {
                n: 1,
                title: "One invoice, many LRs:",
                body: "a batch of unbilled LRs for the same party rolls into a single freight bill.",
              },
              {
                n: 2,
                title: "The annexure travels with it:",
                body: "print or export the LR details behind the invoice for customer reconciliation.",
              },
            ]}
          />
        </div>
      )}

      {screen === "report" && (
        <div className="flex min-h-[460px] flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C5E3E3] bg-[#E5F4F4] px-3 py-2 font-sans">
              <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
                <span className="font-bold text-[#033B38]">
                  Period: <span className="font-mono">01-Apr-26 to 31-Mar-27</span>
                </span>
                <span className="text-[#C5E3E3]">|</span>
                <span className="text-slate-600">Status:</span>
                <span className="rounded-sm border border-[#045A57] bg-[#D4EAEA] px-2 py-0.5 font-extrabold text-[#033B38]">
                  {filter} ({visibleRows.length})
                </span>
                <span className="text-slate-600">
                  Unbilled: <strong className="text-[#033B38]">{unbilled.length}</strong>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFilter(filter === "ALL" ? "UNBILLED" : filter === "UNBILLED" ? "BILLED" : "ALL");
                    setToast("LR report filter changed");
                  }}
                  className="inline-flex items-center gap-1 rounded-sm border border-[#045A57] bg-white px-2.5 py-1 text-[10px] font-bold text-[#033B38] hover:bg-[#E5F4F4]"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden="true" />
                  Filter billed / unbilled
                </button>
                <button
                  type="button"
                  onClick={autoCreateBill}
                  className="inline-flex items-center gap-1 rounded-sm border border-[#033B38] bg-[#006569] px-2.5 py-1 text-[10px] font-extrabold text-white hover:bg-[#045A57]"
                >
                  <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                  Invoice unbilled LRs
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left">
                <caption className="sr-only">
                  LR report with party, route, weight, bill value, billing status and bill number
                </caption>
                <thead>
                  <tr className="border-b-2 border-[#C5E3E3] bg-[#E5F4F4] font-sans text-[10px] font-extrabold uppercase text-[#033B38]">
                    <th className="border-r border-[#D4EAEA] px-2 py-2">LR no</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2">Date</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2">Party</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2">Route</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2 text-right">Weight</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2 text-right">Bill value</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2 text-center">Status</th>
                    <th className="px-2 py-2">Bill no</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-3 py-8 text-center font-sans text-sm text-slate-500">
                        No LRs match this filter.
                      </td>
                    </tr>
                  )}
                  {visibleRows.map((row) => {
                    const index = rows.findIndex((item) => item.no === row.no);
                    return (
                      <tr
                        key={row.no}
                        tabIndex={0}
                        onClick={() => {
                          setSelected(index);
                          setToast(`Selected ${row.no} — ${row.party}`);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelected(index);
                            setToast(`Selected ${row.no} — ${row.party}`);
                          }
                        }}
                        className={`cursor-pointer border-b border-[#E5F4F4] transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#006569] ${
                          selected === index ? "bg-[#D4EAEA] font-semibold" : "bg-white hover:bg-[#E5F4F4]"
                        }`}
                      >
                        <td className="border-r border-[#E5F4F4] px-2 py-2 font-bold text-[#033B38]">{row.no}</td>
                        <td className="border-r border-[#E5F4F4] px-2 py-2">{row.date}</td>
                        <td className="border-r border-[#E5F4F4] px-2 py-2 font-sans font-semibold text-slate-700">
                          {row.party}
                        </td>
                        <td className="border-r border-[#E5F4F4] px-2 py-2 font-sans text-slate-600">
                          {row.from} → {row.to}
                        </td>
                        <td className="border-r border-[#E5F4F4] px-2 py-2 text-right">{row.weight} MT</td>
                        <td className="border-r border-[#E5F4F4] px-2 py-2 text-right font-bold">
                          ₹ {inr.format(lrTotal(row))}
                        </td>
                        <td className="border-r border-[#E5F4F4] px-2 py-2 text-center">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-2 py-2 font-mono text-[11px] font-bold text-[#033B38]">
                          {row.billNo}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#033B38] bg-[#E5F4F4] font-extrabold text-[#033B38]">
                    <td colSpan={4} className="px-2 py-2 text-right font-sans text-[10px] uppercase">
                      Total ({visibleRows.length} LRs)
                    </td>
                    <td className="px-2 py-2 text-right">
                      {visibleRows.reduce((sum, row) => sum + row.weight, 0)} MT
                    </td>
                    <td className="px-2 py-2 text-right">
                      ₹ {inr.format(visibleRows.reduce((sum, row) => sum + lrTotal(row), 0))}
                    </td>
                    <td colSpan={2} className="bg-[#D4EAEA] px-2 py-2 text-center font-sans text-[10px]">
                      {unbilled.length} unbilled · {billedCount} billed
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <SimTips
            tips={[
              {
                n: 1,
                title: "Every LR on one page:",
                body: "billing status and bill number sit next to the trip, so nothing is hunted for.",
              },
              {
                n: 2,
                title: "Filter to what is pending:",
                body: "switch to UNBILLED and the report shows exactly what still needs an invoice.",
              },
            ]}
          />
        </div>
      )}
    </TallyChrome>
  );
}
