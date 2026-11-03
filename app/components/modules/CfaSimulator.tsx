"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FileSpreadsheet, Printer } from "lucide-react";
import { SimControl, SimKey, SimTips, TallyChrome, type TallyTab } from "./TallyChrome";

/**
 * CHANGE: 2026-11-03 — interactive TallyPrime walkthrough for the CFA module page.
 *
 * WHY: the brochure's job card, CFA invoice and profitability screens cannot show on a static
 * page. Every amount, job number and label below is taken from
 * public/brochures/cfa-module-brochure.pdf; the exchange rate is a sample value the visitor can
 * change, because the brochure states multi-currency billing but does not publish a rate.
 */
type Screen = "job" | "bill" | "profit";
type Currency = "INR" | "USD" | "EUR";

type Job = {
  no: string;
  party: string;
  bl: string;
  shipment: string;
  status: "Open" | "Closed";
  freight: number;
  transport: number;
  port: number;
  profit: number;
};

const JOBS: Job[] = [
  {
    no: "CFA/26-27/1180",
    party: "Mehta Overseas",
    bl: "ONEY 1180042",
    shipment: "Mundra → Jebel Ali",
    status: "Closed",
    freight: 132000,
    transport: 18600,
    port: 15400,
    profit: 120000,
  },
  {
    no: "CFA/26-27/1184",
    party: "Sharma Exports",
    bl: "MAEU 2245781",
    shipment: "Nhava Sheva → Rotterdam",
    status: "Open",
    freight: 148500,
    transport: 22400,
    port: 18750,
    profit: 70000,
  },
  {
    no: "CFA/26-27/1191",
    party: "Nair Commodities",
    bl: "CMDU 9911274",
    shipment: "Chennai → Hamburg",
    status: "Open",
    freight: 166000,
    transport: 24900,
    port: 20100,
    profit: 150000,
  },
  {
    no: "CFA/26-27/1197",
    party: "Joshi Industrial",
    bl: "HLCU 4471038",
    shipment: "Kolkata → Singapore",
    status: "Closed",
    freight: 41000,
    transport: 19800,
    port: 12600,
    profit: -20000,
  },
];

const TABS: TallyTab[] = [
  { id: "job", step: "1", label: "Job card" },
  { id: "bill", step: "2", label: "CFA invoice" },
  { id: "profit", step: "3", label: "Job profitability" },
];

const TITLES: Record<Screen, { title: string; crumb: string }> = {
  job: {
    title: "CFA Job Register — Open and closed jobs",
    crumb: "Gateway of Tally > CFA Module > Job Register",
  },
  bill: {
    title: "Tax Invoice — CFA / 2026-27 / 01184",
    crumb: "CFA Module > Billing > Tax Invoice",
  },
  profit: {
    title: "Job-wise Profitability — Open and closed jobs",
    crumb: "CFA Module > Reports > Job-wise Profitability",
  },
};

const RATES: Record<Exclude<Currency, "INR">, number> = { USD: 83, EUR: 90 };

const inr = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function money(value: number, currency: Currency, rate: number): string {
  if (currency === "INR") return `₹ ${inr.format(value)}`;
  const converted = value / rate;
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);
  return `${currency} ${formatted}`;
}

function StatusBadge({ status }: { status: Job["status"] }) {
  return (
    <span
      className={`inline-block rounded-sm border px-1.5 py-0.5 font-sans text-[10px] font-bold ${
        status === "Open"
          ? "border-[#006569] bg-[#E5F4F4] text-[#033B38]"
          : "border-[#045A57] bg-[#D4EAEA] text-[#033B38]"
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
}

export default function CfaSimulator() {
  const [screen, setScreen] = useState<Screen>("job");
  const [selected, setSelected] = useState(1);
  const [currency, setCurrency] = useState<Currency>("INR");
  const [rate, setRate] = useState(83);
  const [reimbursables, setReimbursables] = useState(true);
  const [toast, setToast] = useState("Ready • 4 CFA jobs loaded");

  const job = JOBS[selected];

  const bill = useMemo(() => {
    const taxable = job.freight + (reimbursables ? job.transport + job.port : 0);
    const gst = Math.round(taxable * 0.18);
    return { taxable, gst, total: taxable + gst };
  }, [job, reimbursables]);

  const profitMax = Math.max(...JOBS.map((row) => Math.abs(row.profit)));

  function go(next: Screen) {
    setScreen(next);
    setToast(`Screen changed: ${TITLES[next].title}`);
  }

  function selectJob(index: number) {
    setSelected(index);
    setToast(`Selected ${JOBS[index].no} — ${JOBS[index].party}`);
  }

  function cycleCurrency() {
    const order: Currency[] = ["INR", "USD", "EUR"];
    const next = order[(order.indexOf(currency) + 1) % order.length];
    setCurrency(next);
    setScreen("bill");
    setToast(next === "INR" ? "Invoice currency: INR" : `Invoice currency: ${next} at sample rate ₹${rate}`);
  }

  const activeRate = currency === "INR" ? 1 : rate;

  return (
    <TallyChrome
      company="Sample C&F Agency (FY 2026-27)"
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
            <SimKey label="F3: Company" onClick={() => setToast("Active company: Sample C&F Agency")} />
            <SimKey label="F8: Sales / Bill" strong onClick={() => go("bill")} />
            <SimKey label="F10: Job register" onClick={() => go("job")} />

            <p className="px-1 pb-0.5 pt-2 text-[9px] font-extrabold uppercase tracking-wider text-[#033B38]">
              Module controls
            </p>
            <SimControl label={`C: Currency (${currency})`} onClick={cycleCurrency} />
            <SimControl
              label={`R: Reimbursables ${reimbursables ? "ON" : "OFF"}`}
              onClick={() => {
                setReimbursables((value) => !value);
                setScreen("bill");
                setToast(`Reimbursables ${reimbursables ? "hidden from" : "added to"} the invoice`);
              }}
            />
            <SimControl label="P: Job profitability" onClick={() => go("profit")} />
            <SimControl
              label="I: Import jobs from Excel"
              onClick={() => {
                setScreen("job");
                setToast("Import jobs from Excel — no retyping required");
              }}
            />
          </div>

          <div className="rounded-sm border border-[#C5E3E3] bg-white p-2 text-[10px] leading-tight text-slate-600">
            <strong className="mb-0.5 block text-[#033B38]">Interactive tip:</strong>
            click <span className="font-bold underline">C: Currency</span> or{" "}
            <span className="font-bold underline">R: Reimbursables</span> and watch the invoice.
          </div>
        </>
      }
    >
      {screen === "job" && (
        <div className="flex min-h-[460px] flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C5E3E3] bg-[#E5F4F4] px-3 py-2 font-sans">
              <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
                <span className="font-bold text-[#033B38]">
                  Period: <span className="font-mono">01-Apr-26 to 31-Mar-27</span>
                </span>
                <span className="text-[#C5E3E3]">|</span>
                <span className="text-slate-600">Jobs:</span>
                <span className="rounded-sm border border-[#045A57] bg-[#D4EAEA] px-2 py-0.5 font-extrabold text-[#033B38]">
                  {JOBS.length} ({JOBS.filter((row) => row.status === "Open").length} open)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setToast("Job import ready — map the Excel columns once")}
                className="inline-flex items-center gap-1 rounded-sm border border-[#045A57] bg-white px-2.5 py-1 text-[10px] font-bold text-[#033B38] hover:bg-[#E5F4F4]"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden="true" />
                Import jobs from Excel
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left">
                <caption className="sr-only">
                  Clearing and forwarding job register with party, bill of lading, shipment and status
                </caption>
                <thead>
                  <tr className="border-b-2 border-[#C5E3E3] bg-[#E5F4F4] font-sans text-[10px] font-extrabold uppercase text-[#033B38]">
                    <th className="border-r border-[#D4EAEA] px-2 py-2">Job no</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2">Party</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2">BL / AWB no</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2">Shipment</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2 text-right">Job charges</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2 text-right">Reimbursable</th>
                    <th className="px-2 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {JOBS.map((row, index) => (
                    <tr
                      key={row.no}
                      tabIndex={0}
                      onClick={() => selectJob(index)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          selectJob(index);
                        }
                      }}
                      className={`cursor-pointer border-b border-[#E5F4F4] transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#006569] ${
                        selected === index ? "bg-[#D4EAEA] font-semibold" : "bg-white hover:bg-[#E5F4F4]"
                      }`}
                    >
                      <td className="border-r border-[#E5F4F4] px-2 py-2 font-bold text-[#033B38]">{row.no}</td>
                      <td className="border-r border-[#E5F4F4] px-2 py-2 font-sans font-semibold text-slate-700">
                        {row.party}
                      </td>
                      <td className="border-r border-[#E5F4F4] px-2 py-2">{row.bl}</td>
                      <td className="border-r border-[#E5F4F4] px-2 py-2 font-sans text-slate-600">
                        {row.shipment}
                      </td>
                      <td className="border-r border-[#E5F4F4] px-2 py-2 text-right font-bold">
                        {money(row.freight, "INR", 1)}
                      </td>
                      <td className="border-r border-[#E5F4F4] px-2 py-2 text-right text-[#045A57]">
                        {money(row.transport + row.port, "INR", 1)}
                      </td>
                      <td className="px-2 py-2 text-center">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <SimTips
            tips={[
              {
                n: 1,
                title: "Every job in one register:",
                body: "party, BL / AWB, shipment and status — the job carries its own expenses from here.",
              },
              {
                n: 2,
                title: "Nothing is retyped:",
                body: "existing jobs can be imported from Excel, and a job stays open until final billing.",
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
                    Tax Invoice
                  </span>
                  <span className="font-sans text-[11px] font-bold text-slate-500">No.</span>
                  <span className="border border-[#033B38] bg-[#E5F4F4] px-2 py-0.5 font-mono text-xs font-bold text-[#033B38]">
                    CFA / 2026-27 / 01184
                  </span>
                </div>
                <p className="font-sans text-[11px] text-slate-600">
                  <span className="inline-block w-28 font-semibold">Party A/c:</span>
                  <span className="font-extrabold text-[#033B38] underline decoration-dotted">{job.party}</span>
                </p>
                <p className="font-sans text-[11px] text-slate-600">
                  <span className="inline-block w-28 font-semibold">Job:</span>
                  <span className="font-bold">{job.no}</span>
                  <span className="ml-3 text-slate-500">{job.shipment}</span>
                </p>
              </div>

              <div className="space-y-2 font-sans text-right">
                <div className="text-sm font-bold text-[#033B38]">15-Apr-26</div>
                <div className="inline-block border border-[#C5E3E3] bg-[#E5F4F4] px-2 py-0.5 font-mono text-[10px] text-[#006569]">
                  IRN generated · QR ready
                </div>
                <label className="block text-[10px] font-bold uppercase text-[#033B38]">
                  Currency
                  <select
                    value={currency}
                    onChange={(event) => {
                      setCurrency(event.target.value as Currency);
                      setToast(`Invoice currency: ${event.target.value}`);
                    }}
                    className="ml-2 rounded-sm border border-[#045A57] bg-white px-1.5 py-0.5 text-[11px] font-bold text-[#033B38]"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </label>
                {currency !== "INR" && (
                  <label className="block text-[10px] font-bold uppercase text-[#033B38]">
                    Sample rate ₹ / {currency}
                    <input
                      type="number"
                      min={1}
                      value={rate}
                      onChange={(event) => setRate(Math.max(1, Number(event.target.value) || 1))}
                      className="ml-2 w-20 rounded-sm border border-[#045A57] bg-white px-1.5 py-0.5 text-right font-mono text-[11px] text-[#033B38]"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <caption className="sr-only">
                  CFA invoice lines: job charges, auto-filled reimbursables, GST and total
                </caption>
                <thead>
                  <tr className="border-y-2 border-[#033B38] bg-[#E5F4F4] font-sans text-[11px] font-extrabold text-[#033B38]">
                    <th className="px-3 py-2">Particulars</th>
                    <th className="w-24 px-3 py-2 text-center">Source</th>
                    <th className="w-40 px-3 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2.5 font-sans text-xs font-extrabold text-[#033B38]">
                      Job charges — Freight &amp; handling
                    </td>
                    <td className="px-3 py-2.5 text-center font-sans text-[10px] text-slate-500">Job</td>
                    <td className="px-3 py-2.5 text-right font-bold">
                      {money(job.freight, currency, activeRate)}
                    </td>
                  </tr>
                  {reimbursables && (
                    <>
                      <tr className="border-b border-slate-200">
                        <td className="px-3 py-2.5 font-sans text-xs font-extrabold text-[#033B38]">
                          Reimbursable — Transport
                        </td>
                        <td className="px-3 py-2.5 text-center font-sans text-[10px] text-[#006569]">
                          Auto-filled
                        </td>
                        <td className="px-3 py-2.5 text-right font-bold">
                          {money(job.transport, currency, activeRate)}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="px-3 py-2.5 font-sans text-xs font-extrabold text-[#033B38]">
                          Reimbursable — Port &amp; labour
                        </td>
                        <td className="px-3 py-2.5 text-center font-sans text-[10px] text-[#006569]">
                          Auto-filled
                        </td>
                        <td className="px-3 py-2.5 text-right font-bold">
                          {money(job.port, currency, activeRate)}
                        </td>
                      </tr>
                    </>
                  )}
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2.5 font-sans text-xs font-bold text-slate-700">GST @ 18%</td>
                    <td className="px-3 py-2.5 text-center font-sans text-[10px] text-slate-500">Tally</td>
                    <td className="px-3 py-2.5 text-right font-bold">
                      {money(bill.gst, currency, activeRate)}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-y-2 border-[#033B38] bg-[#E5F4F4] font-extrabold text-[#033B38]">
                    <td className="px-3 py-2 font-sans text-[10px] uppercase">Total invoice value</td>
                    <td className="px-3 py-2 text-center font-sans text-[10px]">
                      {currency === "INR" ? "INR" : `${currency} @ ${rate}`}
                    </td>
                    <td className="bg-[#D4EAEA] px-3 py-2 text-right text-sm">
                      {money(bill.total, currency, activeRate)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex flex-col items-start justify-between gap-3 pt-1 font-sans text-[11px] sm:flex-row sm:items-center">
              <p className="text-slate-600">
                <span className="font-bold text-[#033B38]">Narration:</span> CFA invoice for job {job.no}.
                Reimbursables are pulled from the job, not typed again.
              </p>
              <button
                type="button"
                onClick={() => setToast("Print preview ready — CFA invoice with QR and IRN")}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border-2 border-[#033B38] bg-[#D4EAEA] px-3 py-1.5 font-extrabold text-[#033B38] hover:bg-[#E5F4F4]"
              >
                <Printer className="h-4 w-4" aria-hidden="true" />
                Print invoice
              </button>
            </div>
          </div>

          <SimTips
            tips={[
              {
                n: 1,
                title: "Reimbursables auto-fill:",
                body: "transport and port charges come from the job record, so nothing is left out of the bill.",
              },
              {
                n: 2,
                title: "Currency is a choice:",
                body: "switch INR / USD / EUR and apply the exchange rate on the same invoice.",
              },
            ]}
          />
        </div>
      )}

      {screen === "profit" && (
        <div className="flex min-h-[460px] flex-col justify-between">
          <div className="space-y-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-3 font-sans">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#006569]">
                  Job profitability
                </p>
                <p className="text-sm font-black text-[#033B38]">Know which jobs pay — and which don&apos;t</p>
              </div>
              <span className="rounded-sm border border-[#045A57] bg-[#D4EAEA] px-2 py-0.5 text-[10px] font-bold text-[#033B38]">
                Open and closed jobs
              </span>
            </div>

            <div className="space-y-3">
              {JOBS.map((row, index) => {
                const positive = row.profit >= 0;
                const width = Math.max(6, Math.round((Math.abs(row.profit) / profitMax) * 100));
                return (
                  <button
                    key={row.no}
                    type="button"
                    onClick={() => selectJob(index)}
                    className="flex w-full items-center gap-3 rounded border border-[#C5E3E3] bg-white px-3 py-2 text-left font-sans hover:bg-[#E5F4F4] focus:outline-none focus:ring-2 focus:ring-[#006569]"
                  >
                    <span className="w-28 shrink-0 text-[11px] font-bold text-[#033B38]">{row.no}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block h-4 rounded-sm bg-[#E5F4F4]">
                        <span
                          className={`block h-4 rounded-sm ${positive ? "bg-[#006569]" : "bg-[#045A57]"}`}
                          style={{ width: `${width}%` }}
                        />
                      </span>
                    </span>
                    <span
                      className={`w-24 shrink-0 text-right text-[11px] font-extrabold ${
                        positive ? "text-[#006569]" : "text-[#033B38] underline"
                      }`}
                    >
                      {positive ? "+" : "−"}
                      {(Math.abs(row.profit) / 100000).toFixed(1)}L
                    </span>
                    <StatusBadge status={row.status} />
                  </button>
                );
              })}
            </div>

            <div className="rounded border border-[#C5E3E3] bg-[#E5F4F4] p-3 font-sans text-[11px] text-slate-700">
              <p className="font-bold text-[#033B38]">
                Selected job: {job.no} · {job.party}
              </p>
              <p className="mt-1">
                Job charges {money(job.freight, "INR", 1)} − expenses and reimbursables ={" "}
                <strong className={job.profit >= 0 ? "text-[#006569]" : "text-[#045A57]"}>
                  {job.profit >= 0 ? "profit" : "loss"} of ₹ {inr.format(Math.abs(job.profit))}
                </strong>
              </p>
            </div>
          </div>

          <SimTips
            tips={[
              {
                n: 1,
                title: "The margin is on the job:",
                body: "open and closed job reports turn every shipment into a number your team can act on.",
              },
              {
                n: 2,
                title: "Close when billed:",
                body: "close a single job or many at once after final billing; the report keeps the status.",
              },
            ]}
          />
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-[#C5E3E3] bg-[#E5F4F4] px-3 py-1.5 font-sans text-[10px] text-[#033B38]">
        <CheckCircle2 className="h-3.5 w-3.5 text-[#006569]" aria-hidden="true" />
        E-invoice QR and IRN are generated by TallyPrime — ready to share.
      </div>
    </TallyChrome>
  );
}
