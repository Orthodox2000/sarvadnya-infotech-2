"use client";

import { useMemo, useState } from "react";
import { Mail, Printer } from "lucide-react";
import { SimControl, SimKey, SimTips, TallyChrome, type TallyTab } from "./TallyChrome";

/**
 * CHANGE: 2026-11-03 — interactive TallyPrime walkthrough for the Housing Society module.
 *
 * WHY: the brochure's member register, bill break-up and interest example are static print.
 * The charge heads, the Rs. 6,226 total and the 21% / 13-day interest example are taken from
 * public/brochures/housing-society-module-brochure.pdf. Other members are sample rows so the
 * register behaves like a real one; none of them are real residents.
 */
type Screen = "register" | "bill" | "interest";
type Cycle = "Monthly" | "Quarterly";

type Member = {
  flat: string;
  name: string;
  area: number;
  maintenance: number;
  sinking: number;
  repair: number;
  education: number;
  outstanding: number;
};

const MEMBERS: Member[] = [
  {
    flat: "A-101",
    name: "R. Sharma",
    area: 1050,
    maintenance: 4296,
    sinking: 480,
    repair: 1440,
    education: 10,
    outstanding: 6226,
  },
  {
    flat: "B-204",
    name: "S. Iyer",
    area: 820,
    maintenance: 3350,
    sinking: 380,
    repair: 1120,
    education: 10,
    outstanding: 0,
  },
  {
    flat: "C-302",
    name: "M. Khan",
    area: 930,
    maintenance: 3800,
    sinking: 420,
    repair: 1290,
    education: 10,
    outstanding: 3100,
  },
  {
    flat: "D-405",
    name: "P. Deshmukh",
    area: 1180,
    maintenance: 4820,
    sinking: 520,
    repair: 1580,
    education: 10,
    outstanding: 0,
  },
];

const TABS: TallyTab[] = [
  { id: "register", step: "1", label: "Member register" },
  { id: "bill", step: "2", label: "Maintenance bill" },
  { id: "interest", step: "3", label: "Interest on late payment" },
];

const TITLES: Record<Screen, { title: string; crumb: string }> = {
  register: {
    title: "Member & Premise Register — Sample Society",
    crumb: "Gateway of Tally > Housing Society > Member Register",
  },
  bill: {
    title: "Maintenance Bill — April 2026",
    crumb: "Housing Society > Billing > Maintenance Bill",
  },
  interest: {
    title: "Interest on Delayed Payment — Register",
    crumb: "Housing Society > Reports > Interest on Late Payment",
  },
};

const inr = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function total(member: Member): number {
  return member.maintenance + member.sinking + member.repair + member.education;
}

export default function SocietySimulator() {
  const [screen, setScreen] = useState<Screen>("register");
  const [selected, setSelected] = useState(0);
  const [cycle, setCycle] = useState<Cycle>("Monthly");
  const [rate, setRate] = useState(21);
  const [days, setDays] = useState(13);
  const [withReceipt, setWithReceipt] = useState(false);
  const [toast, setToast] = useState("Ready • 4 sample members from a 72-member society");

  const member = MEMBERS[selected];
  const monthly = total(member);

  const interest = useMemo(
    () => Math.round(((member.outstanding * rate) / 100 / 365) * days),
    [member.outstanding, rate, days],
  );

  function go(next: Screen) {
    setScreen(next);
    setToast(`Screen changed: ${TITLES[next].title}`);
  }

  function cycleBilling() {
    const next: Cycle = cycle === "Monthly" ? "Quarterly" : "Monthly";
    setCycle(next);
    setToast(`Billing cycle: ${next}`);
  }

  return (
    <TallyChrome
      company="Sample Housing Society (FY 2026-27)"
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
            <SimKey label="F3: Company" onClick={() => setToast("Active company: Sample Housing Society")} />
            <SimKey label="F8: Bill" strong onClick={() => go("bill")} />
            <SimKey label="F10: Member register" onClick={() => go("register")} />

            <p className="px-1 pb-0.5 pt-2 text-[9px] font-extrabold uppercase tracking-wider text-[#033B38]">
              Module controls
            </p>
            <SimControl label={`B: Cycle (${cycle})`} onClick={cycleBilling} />
            <SimControl label="I: Interest register" onClick={() => go("interest")} />
            <SimControl
              label="R: Receipt with bill"
              onClick={() => {
                setWithReceipt((value) => !value);
                setScreen("bill");
                setToast(`Bill print: ${!withReceipt ? "with" : "without"} receipt`);
              }}
            />
            <SimControl
              label="E: Email all bills"
              onClick={() => setToast("Bulk email queued for all members — one click")}
            />
          </div>

          <div className="rounded-sm border border-[#C5E3E3] bg-white p-2 text-[10px] leading-tight text-slate-600">
            <strong className="mb-0.5 block text-[#033B38]">Interactive tip:</strong>
            open <span className="font-bold underline">Interest on late payment</span> and move the
            rate or days slider.
          </div>
        </>
      }
    >
      {screen === "register" && (
        <div className="flex min-h-[460px] flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C5E3E3] bg-[#E5F4F4] px-3 py-2 font-sans">
              <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
                <span className="font-bold text-[#033B38]">
                  Cycle: <span className="font-mono">{cycle}</span>
                </span>
                <span className="text-[#C5E3E3]">|</span>
                <span className="text-slate-600">Members:</span>
                <span className="rounded-sm border border-[#045A57] bg-[#D4EAEA] px-2 py-0.5 font-extrabold text-[#033B38]">
                  72 (4 shown)
                </span>
                <span className="text-[#C5E3E3]">|</span>
                <span className="text-slate-600">Pending:</span>
                <span className="rounded-sm border border-[#045A57] bg-[#D4EAEA] px-2 py-0.5 font-extrabold text-[#033B38]">
                  {MEMBERS.filter((row) => row.outstanding > 0).length} members
                </span>
              </div>
              <button
                type="button"
                onClick={() => setToast("Bulk email queued for all members — one click")}
                className="inline-flex items-center gap-1 rounded-sm border border-[#045A57] bg-white px-2.5 py-1 text-[10px] font-bold text-[#033B38] hover:bg-[#E5F4F4]"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                Email all bills
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left">
                <caption className="sr-only">
                  Housing society member register with premise area, maintenance, sinking, repair,
                  education charges and outstanding amount
                </caption>
                <thead>
                  <tr className="border-b-2 border-[#C5E3E3] bg-[#E5F4F4] font-sans text-[10px] font-extrabold uppercase text-[#033B38]">
                    <th className="border-r border-[#D4EAEA] px-2 py-2">Flat</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2">Member</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2 text-right">Area (sq ft)</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2 text-right">Maintenance</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2 text-right">Sinking</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2 text-right">Repair</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2 text-right">Education</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-2 text-right">Monthly total</th>
                    <th className="px-2 py-2 text-right">Outstanding</th>
                  </tr>
                </thead>
                <tbody>
                  {MEMBERS.map((row, index) => (
                    <tr
                      key={row.flat}
                      tabIndex={0}
                      onClick={() => {
                        setSelected(index);
                        setToast(`Selected ${row.flat} — ${row.name}`);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelected(index);
                          setToast(`Selected ${row.flat} — ${row.name}`);
                        }
                      }}
                      className={`cursor-pointer border-b border-[#E5F4F4] transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#006569] ${
                        selected === index ? "bg-[#D4EAEA] font-semibold" : "bg-white hover:bg-[#E5F4F4]"
                      }`}
                    >
                      <td className="border-r border-[#E5F4F4] px-2 py-2 font-bold text-[#033B38]">{row.flat}</td>
                      <td className="border-r border-[#E5F4F4] px-2 py-2 font-sans font-semibold text-slate-700">
                        {row.name}
                      </td>
                      <td className="border-r border-[#E5F4F4] px-2 py-2 text-right">
                        {row.area.toLocaleString("en-IN")}
                      </td>
                      <td className="border-r border-[#E5F4F4] px-2 py-2 text-right">{inr.format(row.maintenance)}</td>
                      <td className="border-r border-[#E5F4F4] px-2 py-2 text-right">{inr.format(row.sinking)}</td>
                      <td className="border-r border-[#E5F4F4] px-2 py-2 text-right">{inr.format(row.repair)}</td>
                      <td className="border-r border-[#E5F4F4] px-2 py-2 text-right">{inr.format(row.education)}</td>
                      <td className="border-r border-[#E5F4F4] px-2 py-2 text-right font-bold text-[#033B38]">
                        {inr.format(total(row))}
                      </td>
                      <td className="px-2 py-2 text-right font-bold text-[#045A57]">
                        {row.outstanding > 0 ? inr.format(row.outstanding) : "—"}
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
                title: "Charges sit in the member record:",
                body: "maintenance, sinking, repair and education are set once and flow into every bill.",
              },
              {
                n: 2,
                title: "The register is the bill source:",
                body: "select a member to see the break-up and the pending amount for the interest report.",
              },
            ]}
          />
        </div>
      )}

      {screen === "bill" && (
        <div className="flex min-h-[460px] flex-col justify-between bg-[#E5F4F4] p-4">
          <div className="mx-auto w-full max-w-3xl space-y-4 border-2 border-[#033B38] bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-[#033B38] pb-3">
              <div>
                <span className="border border-[#033B38] bg-[#D4EAEA] px-2 py-0.5 font-sans text-[10px] font-extrabold uppercase text-[#033B38]">
                  Maintenance bill
                </span>
                <h4 className="mt-1 font-sans text-lg font-black text-[#033B38]">SAMPLE HOUSING SOCIETY</h4>
                <p className="font-sans text-[11px] text-slate-600">
                  Flat <strong className="font-mono text-[#033B38]">{member.flat}</strong> · {member.name}
                </p>
              </div>
              <div className="text-right font-sans text-[11px]">
                <div>
                  <strong>Bill month:</strong> April 2026
                </div>
                <div>
                  <strong>Cycle:</strong> {cycle}
                </div>
                <div>
                  <strong>Area:</strong> {member.area.toLocaleString("en-IN")} sq ft
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-left text-[11px]">
                <caption className="sr-only">Maintenance bill charge break-up for the selected flat</caption>
                <thead>
                  <tr className="bg-[#033B38] font-sans text-[10px] text-white">
                    <th className="border border-[#033B38] px-2 py-1.5">Charge head</th>
                    <th className="border border-[#033B38] px-2 py-1.5 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Maintenance charges", member.maintenance],
                    ["Sinking fund", member.sinking],
                    ["Repair fund", member.repair],
                    ["Education fund", member.education],
                  ].map(([label, amount]) => (
                    <tr key={label} className="border-b border-slate-300">
                      <td className="border border-slate-300 px-2 py-1.5 font-sans">{label}</td>
                      <td className="border border-slate-300 px-2 py-1.5 text-right font-bold">
                        {inr.format(Number(amount))}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-b border-slate-300">
                    <td className="border border-slate-300 px-2 py-1.5 font-sans font-bold text-[#033B38]">
                      Outstanding before this bill
                    </td>
                    <td className="border border-slate-300 px-2 py-1.5 text-right font-bold text-[#045A57]">
                      {member.outstanding > 0 ? inr.format(member.outstanding) : "—"}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-[#D4EAEA] font-extrabold text-[#033B38]">
                    <td className="border border-[#033B38] px-2 py-2 text-right font-sans text-[10px] uppercase">
                      Total payable this month
                    </td>
                    <td className="border border-[#033B38] px-2 py-2 text-right text-sm">₹ {inr.format(monthly)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 font-sans text-[11px]">
              <span className="font-medium text-slate-600">
                {withReceipt
                  ? "Bill prints with the receipt section, ready to hand over."
                  : "Bill prints with dues and interest details, without the receipt section."}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setWithReceipt((value) => !value);
                    setToast(`Bill print: ${!withReceipt ? "with" : "without"} receipt`);
                  }}
                  className="rounded-sm border border-[#033B38] bg-[#E5F4F4] px-3 py-1.5 font-bold text-[#033B38] hover:bg-[#D4EAEA]"
                >
                  {withReceipt ? "Hide receipt" : "Add receipt"}
                </button>
                <button
                  type="button"
                  onClick={() => setToast("Print preview ready — bill with dues and interest")}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-[#033B38] bg-[#006569] px-3 py-1.5 font-bold text-white hover:bg-[#045A57]"
                >
                  <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                  Print bill
                </button>
              </div>
            </div>
          </div>

          <SimTips
            tips={[
              {
                n: 1,
                title: "One bill per member:",
                body: "the four charge heads come from the member record, so every bill is consistent.",
              },
              {
                n: 2,
                title: "Print it your way:",
                body: "the same bill can print with or without the receipt section.",
              },
            ]}
          />
        </div>
      )}

      {screen === "interest" && (
        <div className="flex min-h-[460px] flex-col justify-between">
          <div className="space-y-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-3 font-sans">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#006569]">
                  Interest register
                </p>
                <p className="text-sm font-black text-[#033B38]">Interest on a late bill</p>
              </div>
              <span className="rounded-sm border border-[#045A57] bg-[#D4EAEA] px-2 py-0.5 text-[10px] font-bold text-[#033B38]">
                {member.flat} · {member.name}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-3 rounded border border-[#C5E3E3] bg-[#E5F4F4] p-3 font-sans text-[11px]">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-slate-600">Pending amount</span>
                  <span className="font-mono text-sm font-extrabold text-[#033B38]">
                    ₹ {inr.format(member.outstanding)}
                  </span>
                </div>

                <label className="block font-bold uppercase text-[#033B38]">
                  Rate: {rate}% a year
                  <input
                    type="range"
                    min={0}
                    max={24}
                    step={0.5}
                    value={rate}
                    onChange={(event) => {
                      setRate(Number(event.target.value));
                      setToast(`Interest rate: ${event.target.value}% a year`);
                    }}
                    className="mt-1 w-full accent-[#006569]"
                  />
                </label>

                <label className="block font-bold uppercase text-[#033B38]">
                  Days late
                  <input
                    type="number"
                    min={0}
                    max={365}
                    value={days}
                    onChange={(event) => {
                      const next = Math.max(0, Math.min(365, Number(event.target.value) || 0));
                      setDays(next);
                      setToast(`Days late: ${next}`);
                    }}
                    className="mt-1 w-24 rounded-sm border border-[#045A57] bg-white px-2 py-1 text-right font-mono text-[11px] text-[#033B38]"
                  />
                </label>

                <p className="rounded border border-[#C5E3E3] bg-white p-2 text-slate-600">
                  <strong className="text-[#033B38]">Formula:</strong> {inr.format(member.outstanding)} × {rate}% ÷
                  365 × {days} days
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded border-2 border-[#033B38] bg-[#033B38] p-4 text-center font-sans">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#C5E3E3]">Interest</p>
                <p className="mt-2 font-mono text-4xl font-black text-[#D4EAEA]">₹ {inr.format(interest)}</p>
                <p className="mt-2 text-[11px] font-semibold text-[#E5F4F4]">
                  Calculated on the pending amount, at the rate set for the member.
                </p>
                <button
                  type="button"
                  onClick={() => setToast("Interest voucher posted to the member ledger")}
                  className="mt-3 rounded-sm border border-[#D4EAEA] bg-[#045A57] px-3 py-1.5 text-[10px] font-extrabold uppercase text-white hover:bg-[#006569]"
                >
                  Post interest voucher
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-[11px]">
                <caption className="sr-only">Interest on late payment for members with pending amounts</caption>
                <thead>
                  <tr className="border-y-2 border-[#033B38] bg-[#E5F4F4] font-sans text-[10px] font-extrabold uppercase text-[#033B38]">
                    <th className="px-2 py-1.5">Flat</th>
                    <th className="px-2 py-1.5">Member</th>
                    <th className="px-2 py-1.5 text-right">Pending</th>
                    <th className="px-2 py-1.5 text-right">Rate</th>
                    <th className="px-2 py-1.5 text-right">Days</th>
                    <th className="px-2 py-1.5 text-right">Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {MEMBERS.filter((row) => row.outstanding > 0).map((row) => (
                    <tr key={row.flat} className="border-b border-slate-200">
                      <td className="px-2 py-1.5 font-bold text-[#033B38]">{row.flat}</td>
                      <td className="px-2 py-1.5 font-sans">{row.name}</td>
                      <td className="px-2 py-1.5 text-right">{inr.format(row.outstanding)}</td>
                      <td className="px-2 py-1.5 text-right">{rate}%</td>
                      <td className="px-2 py-1.5 text-right">{days}</td>
                      <td className="px-2 py-1.5 text-right font-bold text-[#045A57]">
                        {inr.format(Math.round(((row.outstanding * rate) / 100 / 365) * days))}
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
                title: "The maths is automatic:",
                body: "interest is worked out from the pending amount, the rate and the days late.",
              },
              {
                n: 2,
                title: "It posts to the ledger:",
                body: "the interest voucher goes to the member's account, alongside the maintenance bill.",
              },
            ]}
          />
        </div>
      )}
    </TallyChrome>
  );
}
