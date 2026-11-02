"use client";

import { useMemo, useState } from "react";
import { Plus, Zap, Printer, Download } from "lucide-react";

/**
 * CHANGE: 2026-11-02 — interactive TallyPrime walkthrough for the container module page.
 *
 * WHY: the printed brochure's three screens (load sheet, freight bill, annexure) cannot show
 * on a static page. This reproduces them as a keyboard-safe, click-through mock so a visitor
 * can see how a load sheet becomes a bill and an annexure. All sample rows and totals come
 * from the brochure; nothing is business data from the live site.
 */
type Screen = "loadsheet" | "voucher" | "annexure";
type StatusFilter = "ALL" | "BILLED" | "UNBILLED";
type SizeFilter = "ALL" | "1X20" | "2X20" | "1X40";

type Movement = {
  sr: number;
  date: string;
  vehicle: string;
  size: "1X20" | "2X20" | "1X40";
  container: string;
  from: string;
  to: string;
  type: string;
  rate: number;
  diesel: number;
  status: "BILLED" | "UNBILLED";
  bundledNote?: string;
};

const BROCHURE_MOVEMENTS: Movement[] = [
  {
    sr: 1,
    date: "12-Apr-25",
    vehicle: "MH06AQ8136",
    size: "1X20",
    container: "12345678911",
    from: "CLIENT SITE",
    to: "TERMINAL 1",
    type: "EXPORT LOADED",
    rate: 3100,
    diesel: 300,
    status: "BILLED",
  },
  {
    sr: 2,
    date: "13-Apr-25",
    vehicle: "MH06AQ8154",
    size: "1X20",
    container: "23456781289",
    from: "TERMINAL 1",
    to: "CLIENT SITE",
    type: "IMPORT LOADED",
    rate: 2950,
    diesel: 400,
    status: "BILLED",
  },
  {
    sr: 3,
    date: "14-Apr-25",
    vehicle: "MH46AF0133",
    size: "2X20",
    container: "34567213456",
    from: "CFS YARD",
    to: "EMPTY DEPOT",
    type: "Empty Container",
    rate: 3000,
    diesel: 400,
    status: "UNBILLED",
  },
  {
    sr: 4,
    date: "14-Apr-25",
    vehicle: "MH46AF0133",
    size: "2X20",
    container: "45362817890",
    from: "CFS YARD",
    to: "EMPTY DEPOT",
    type: "Empty Container",
    rate: 0,
    diesel: 0,
    status: "UNBILLED",
    bundledNote: "2x20 pair",
  },
];

const inr = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function money(value: number): string {
  return inr.format(value);
}

const SCREEN_META: Record<Screen, { title: string; crumb: string }> = {
  loadsheet: {
    title: "Daily Movement — Load Sheet Register",
    crumb: "Gateway of Tally > Container Handling > Daily Movement Load Sheet",
  },
  voucher: {
    title: "Accounting Voucher Alteration (Secondary) — Freight Bill",
    crumb: "Gateway of Tally > Auto-Invoicing > Freight Bill No. RTC/24-25/16",
  },
  annexure: {
    title: "Voucher Print Preview — Container Movement Annexure",
    crumb: "Freight Bill No. RTC/24-25/16 > F: Annexure Print Preview",
  },
};

const TABS: { id: Screen; step: string; label: string }[] = [
  { id: "loadsheet", step: "1", label: "Daily Movement (Load Sheet)" },
  { id: "voucher", step: "2", label: "Freight Bill Voucher" },
  { id: "annexure", step: "3", label: "Annexure Print Preview" },
];

const DRAFT_TEXT_FIELDS = [
  { key: "date", label: "Date", type: "text" },
  { key: "vehicle", label: "Vehicle no", type: "text" },
  { key: "container", label: "Container no", type: "text" },
  { key: "rate", label: "Rate (₹)", type: "number" },
  { key: "diesel", label: "Diesel (₹)", type: "number" },
] as const;

function Badge({ status }: { status: "BILLED" | "UNBILLED" }) {
  if (status === "BILLED") {
    return (
      <span className="inline-block rounded-sm border border-[#006569] bg-[#E5F4F4] px-1.5 py-0.5 font-sans text-[10px] font-bold text-[#033B38]">
        BILLED
      </span>
    );
  }
  return (
    <span className="inline-block rounded-sm border border-[#045A57] bg-[#D4EAEA] px-1.5 py-0.5 font-sans text-[10px] font-extrabold text-[#033B38]">
      UNBILLED
    </span>
  );
}

export default function ContainerSimulator() {
  const [screen, setScreen] = useState<Screen>("loadsheet");
  const [rows, setRows] = useState<Movement[]>(BROCHURE_MOVEMENTS);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>("ALL");
  const [selectedSr, setSelectedSr] = useState<number>(1);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState("Ready • 4 container movements loaded");

  // Add-movement form (defaults mirror the brochure sample).
  const [draft, setDraft] = useState({
    date: "15-Apr-25",
    vehicle: "MH04JK9921",
    size: "1X20" as Movement["size"],
    container: "56473829104",
    route: "CLIENT SITE|TERMINAL 1",
    type: "EXPORT LOADED",
    rate: "3100",
    diesel: "350",
  });

  const visibleRows = useMemo(
    () =>
      rows.filter((row) => {
        if (statusFilter !== "ALL" && row.status !== statusFilter) return false;
        if (sizeFilter !== "ALL" && row.size !== sizeFilter) return false;
        return true;
      }),
    [rows, statusFilter, sizeFilter],
  );

  const totals = useMemo(
    () =>
      visibleRows.reduce(
        (acc, row) => {
          acc.rate += row.rate;
          acc.diesel += row.diesel;
          return acc;
        },
        { rate: 0, diesel: 0 },
      ),
    [visibleRows],
  );

  const billedRows = useMemo(() => rows.filter((row) => row.status === "BILLED"), [rows]);

  const voucherGroups = useMemo(() => {
    const groups = new Map<string, { label: string; qty: number; rate: number; amount: number }>();

    billedRows.forEach((row) => {
      if (row.rate <= 0) return;
      const key = `${row.size}|${row.type}`;
      const existing = groups.get(key);
      if (existing) {
        existing.qty += 1;
        existing.amount += row.rate;
      } else {
        groups.set(key, {
          label: `${row.size}" ${row.type}`,
          qty: 1,
          rate: row.rate,
          amount: row.rate,
        });
      }
    });

    return Array.from(groups.values());
  }, [billedRows]);

  const voucherTotal = useMemo(
    () => voucherGroups.reduce((sum, group) => sum + group.amount, 0),
    [voucherGroups],
  );

  const voucherQty = useMemo(
    () => voucherGroups.reduce((sum, group) => sum + group.qty, 0),
    [voucherGroups],
  );

  const annexureTotal = useMemo(
    () => billedRows.reduce((sum, row) => sum + row.rate, 0),
    [billedRows],
  );

  function go(next: Screen) {
    setScreen(next);
    setToast(`Screen changed: ${SCREEN_META[next].title}`);
  }

  function cycleBilling() {
    const next: StatusFilter =
      statusFilter === "ALL" ? "UNBILLED" : statusFilter === "UNBILLED" ? "BILLED" : "ALL";
    setStatusFilter(next);
    setScreen("loadsheet");
    setToast(`Filter [B: Billed/Unbilled] switched to ${next}`);
  }

  function cycleSize() {
    const order: SizeFilter[] = ["ALL", "1X20", "2X20", "1X40"];
    const next = order[(order.indexOf(sizeFilter) + 1) % order.length];
    setSizeFilter(next);
    setScreen("loadsheet");
    setToast(`Filter [H: Filter Size] switched to ${next}`);
  }

  function selectRow(row: Movement) {
    setSelectedSr(row.sr);
    setToast(`Selected SR ${row.sr}: vehicle ${row.vehicle} | container ${row.container} (${row.type})`);
  }

  function addMovement() {
    const [from, to] = draft.route.split("|");
    const rate = Math.max(0, Number(draft.rate) || 0);
    const diesel = Math.max(0, Number(draft.diesel) || 0);

    setRows((current) => [
      ...current,
      {
        sr: current.length + 1,
        date: draft.date.trim() || "15-Apr-25",
        vehicle: (draft.vehicle.trim() || "MH04JK9921").toUpperCase(),
        size: draft.size,
        container: draft.container.trim() || "56473829104",
        from,
        to,
        type: draft.type,
        rate,
        diesel,
        status: "UNBILLED",
      },
    ]);
    setStatusFilter("ALL");
    setSizeFilter("ALL");
    setShowAdd(false);
    setSelectedSr(rows.length + 1);
    setToast(`Added container ${draft.container || "56473829104"} (${draft.size} ${draft.type}) to the load sheet`);
  }

  function autoCreateBill() {
    setRows((current) => current.map((row) => ({ ...row, status: "BILLED" })));
    setScreen("voucher");
    setStatusFilter("ALL");
    setSizeFilter("ALL");
    setToast("Auto-invoicing complete: freight bill RTC/24-25/16 created from the load sheets");
  }

  function exportAnnexure() {
    setScreen("annexure");
    setToast("Annexure ready — print it with the bill or export it for Excel / PDF");
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-[#033B38] bg-white shadow-[0_8px_0_0_#033B38]">
      {/* Screen switcher */}
      <div className="flex flex-col gap-3 border-b-2 border-[#033B38] bg-[#033B38] p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="rounded-sm bg-[#D4EAEA] px-2 py-1 font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#033B38]">
            Live TallyPrime screen
          </span>
          <span className="text-[11px] font-semibold text-[#E5F4F4] sm:text-xs">
            Click a screen or a Tally function key to walk through the module.
          </span>
        </div>

        <div className="flex flex-wrap gap-2" aria-label="TallyPrime screens">
          {TABS.map((tab) => {
            const active = screen === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={active}
                onClick={() => go(tab.id)}
                className={`flex items-center gap-2 rounded px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider transition-colors sm:text-[11px] ${
                  active
                    ? "border border-[#D4EAEA] bg-[#D4EAEA] text-[#033B38]"
                    : "border border-[#C5E3E3]/40 bg-[#045A57] text-[#E5F4F4] hover:bg-white hover:text-[#033B38]"
                }`}
              >
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                    active ? "bg-[#006569] text-white" : "bg-[#033B38] text-white"
                  }`}
                >
                  {tab.step}
                </span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TallyPrime window chrome */}
      <div className="select-none font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#045A57] bg-[#045A57] px-3 py-1.5 text-white">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-sm border border-[#C5E3E3]/50 bg-[#033B38] px-2.5 py-0.5">
              <span className="font-sans text-sm font-black tracking-tight text-[#D4EAEA]">Tally</span>
              <span className="font-sans text-[11px] font-bold text-white">Prime</span>
              <span className="ml-1 rounded-sm bg-[#D4EAEA] px-1 text-[9px] font-extrabold text-[#033B38]">
                GOLD
              </span>
            </div>
            <div className="hidden flex-wrap items-center gap-3 text-[10px] font-sans font-medium xl:flex">
              <span>K: Company</span>
              <span>Y: Data</span>
              <span>Z: Exchange</span>
              <button
                type="button"
                onClick={() => go(screen === "loadsheet" ? "voucher" : screen === "voucher" ? "annexure" : "loadsheet")}
                className="rounded-sm border border-[#033B38] bg-white px-2 py-0.5 font-bold text-[#033B38] hover:bg-[#E5F4F4]"
              >
                G: Go To
              </button>
              <span>O: Import</span>
              <button type="button" onClick={() => go("annexure")} className="hover:text-[#D4EAEA]">
                E: Export
              </button>
              <span>M: E-mail</span>
              <button type="button" onClick={() => go("annexure")} className="hover:text-[#D4EAEA]">
                P: Print
              </button>
            </div>
          </div>
          <div className="text-[10px] font-sans font-semibold text-[#D4EAEA]">
            Company: <span className="font-bold text-white">Sample Container Logistics (FY 2025-26)</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#006569] px-3 py-1 font-sans text-[11px] font-bold text-white">
          <span>{SCREEN_META[screen].title}</span>
          <span className="rounded-sm bg-[#D4EAEA] px-1.5 py-0.5 font-mono text-[10px] font-extrabold text-[#033B38]">
            Ctrl+M
          </span>
        </div>

        <div className="grid min-h-[460px] grid-cols-1 lg:grid-cols-12">
          <div className="flex flex-col justify-between border-b border-[#C5E3E3] bg-white lg:col-span-10 lg:border-b-0 lg:border-r">
            {screen === "loadsheet" && (
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C5E3E3] bg-[#E5F4F4] px-3 py-2 font-sans">
                    <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
                      <span className="font-bold text-[#033B38]">
                        Period: <span className="font-mono">12-Apr-25 to 14-Apr-25</span>
                      </span>
                      <span className="text-[#C5E3E3]">|</span>
                      <span className="text-slate-600">Status:</span>
                      <span className="rounded-sm border border-[#045A57] bg-[#D4EAEA] px-2 py-0.5 font-extrabold text-[#033B38]">
                        {statusFilter} ({visibleRows.length})
                      </span>
                      <label className="flex items-center gap-1.5 text-slate-600">
                        <span>Size:</span>
                        <select
                          value={sizeFilter}
                          onChange={(event) => setSizeFilter(event.target.value as SizeFilter)}
                          className="rounded-sm border border-[#045A57] bg-white px-1.5 py-0.5 text-[11px] font-bold text-[#033B38] focus:outline-none focus:ring-2 focus:ring-[#006569]/40"
                        >
                          <option value="ALL">All sizes</option>
                          <option value="1X20">1X20</option>
                          <option value="2X20">2X20</option>
                          <option value="1X40">1X40</option>
                        </select>
                      </label>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAdd((open) => !open)}
                        className="inline-flex items-center gap-1 rounded-sm border border-[#045A57] bg-white px-2.5 py-1 text-[10px] font-bold text-[#033B38] hover:bg-[#E5F4F4]"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        Add movement
                      </button>
                      <button
                        type="button"
                        onClick={autoCreateBill}
                        className="inline-flex items-center gap-1 rounded-sm border border-[#033B38] bg-[#006569] px-2.5 py-1 text-[10px] font-extrabold text-white hover:bg-[#045A57]"
                      >
                        <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                        Auto-create freight bill
                      </button>
                    </div>
                  </div>

                  {showAdd && (
                    <div className="border-b-2 border-[#033B38] bg-[#E5F4F4] px-3 py-3 font-sans">
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
                        {DRAFT_TEXT_FIELDS.map((field) => (
                          <label key={field.key} className="block text-[10px] font-bold uppercase text-[#033B38]">
                            {field.label}
                            <input
                              type={field.type}
                              value={draft[field.key]}
                              onChange={(event) => {
                                const value = event.target.value;
                                setDraft((current) => {
                                  const next = { ...current };
                                  next[field.key] = value;
                                  return next;
                                });
                              }}
                              className="mt-0.5 w-full rounded-sm border border-[#045A57] bg-white px-2 py-1 font-mono text-[11px] text-[#033B38] focus:outline-none focus:ring-2 focus:ring-[#006569]/40"
                            />
                          </label>
                        ))}

                        <label className="block text-[10px] font-bold uppercase text-[#033B38]">
                          Size
                          <select
                            value={draft.size}
                            onChange={(event) =>
                              setDraft((current) => ({
                                ...current,
                                size: event.target.value as Movement["size"],
                              }))
                            }
                            className="mt-0.5 w-full rounded-sm border border-[#045A57] bg-white px-2 py-1 font-mono text-[11px] text-[#033B38]"
                          >
                            <option value="1X20">1X20</option>
                            <option value="2X20">2X20</option>
                            <option value="1X40">1X40</option>
                          </select>
                        </label>

                        <label className="block text-[10px] font-bold uppercase text-[#033B38]">
                          Route
                          <select
                            value={draft.route}
                            onChange={(event) =>
                              setDraft((current) => ({ ...current, route: event.target.value }))
                            }
                            className="mt-0.5 w-full rounded-sm border border-[#045A57] bg-white px-2 py-1 text-[11px] font-semibold text-[#033B38]"
                          >
                            <option value="CLIENT SITE|TERMINAL 1">Client site → Terminal 1</option>
                            <option value="TERMINAL 1|CLIENT SITE">Terminal 1 → Client site</option>
                            <option value="CFS YARD|EMPTY DEPOT">CFS yard → Empty depot</option>
                          </select>
                        </label>

                        <label className="block text-[10px] font-bold uppercase text-[#033B38]">
                          Movement type
                          <select
                            value={draft.type}
                            onChange={(event) =>
                              setDraft((current) => ({ ...current, type: event.target.value }))
                            }
                            className="mt-0.5 w-full rounded-sm border border-[#045A57] bg-white px-2 py-1 text-[11px] font-semibold text-[#033B38]"
                          >
                            <option value="EXPORT LOADED">Export loaded</option>
                            <option value="IMPORT LOADED">Import loaded</option>
                            <option value="Empty Container">Empty container</option>
                          </select>
                        </label>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={addMovement}
                          className="rounded-sm border border-[#033B38] bg-[#006569] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#045A57]"
                        >
                          Save to load sheet
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAdd(false)}
                          className="rounded-sm border border-slate-400 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[880px] border-collapse text-left">
                      <caption className="sr-only">
                        Daily movement load sheet with vehicle, container, route, movement type, rate
                        and billing status
                      </caption>
                      <thead>
                        <tr className="border-b-2 border-[#C5E3E3] bg-[#E5F4F4] font-sans text-[10px] font-extrabold uppercase text-[#033B38]">
                          <th className="border-r border-[#D4EAEA] px-2 py-2 text-center">Sr</th>
                          <th className="border-r border-[#D4EAEA] px-2 py-2">Date</th>
                          <th className="border-r border-[#D4EAEA] px-2 py-2">Vehicle no</th>
                          <th className="border-r border-[#D4EAEA] px-2 py-2 text-center">Size</th>
                          <th className="border-r border-[#D4EAEA] px-2 py-2">Container no</th>
                          <th className="border-r border-[#D4EAEA] px-2 py-2">From</th>
                          <th className="border-r border-[#D4EAEA] px-2 py-2">To</th>
                          <th className="border-r border-[#D4EAEA] px-2 py-2">Type</th>
                          <th className="border-r border-[#D4EAEA] px-2 py-2 text-right">Rate</th>
                          <th className="border-r border-[#D4EAEA] px-2 py-2 text-right">Diesel</th>
                          <th className="px-2 py-2 text-center">Bill status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleRows.length === 0 && (
                          <tr>
                            <td colSpan={11} className="px-3 py-8 text-center font-sans text-sm text-slate-500">
                              No movements match this filter.
                            </td>
                          </tr>
                        )}
                        {visibleRows.map((row) => (
                          <tr
                            key={row.sr}
                            tabIndex={0}
                            onClick={() => selectRow(row)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                selectRow(row);
                              }
                            }}
                            className={`cursor-pointer border-b border-[#E5F4F4] transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#006569] ${
                              selectedSr === row.sr ? "bg-[#D4EAEA] font-semibold" : "bg-white hover:bg-[#E5F4F4]"
                            }`}
                          >
                            <td className="border-r border-[#E5F4F4] px-2 py-2 text-center font-bold text-slate-500">
                              {row.sr}
                            </td>
                            <td className="border-r border-[#E5F4F4] px-2 py-2">{row.date}</td>
                            <td className="border-r border-[#E5F4F4] px-2 py-2 font-bold text-[#033B38]">
                              {row.vehicle}
                            </td>
                            <td className="border-r border-[#E5F4F4] px-2 py-2 text-center font-bold">
                              {row.size}
                            </td>
                            <td className="border-r border-[#E5F4F4] px-2 py-2">{row.container}</td>
                            <td className="border-r border-[#E5F4F4] px-2 py-2 font-sans font-semibold text-slate-600">
                              {row.from}
                            </td>
                            <td className="border-r border-[#E5F4F4] px-2 py-2 font-sans font-semibold text-slate-600">
                              {row.to}
                            </td>
                            <td className="border-r border-[#E5F4F4] px-2 py-2 font-sans font-bold text-[#033B38]">
                              {row.type}
                            </td>
                            <td className="border-r border-[#E5F4F4] px-2 py-2 text-right font-bold">
                              {row.rate > 0 ? (
                                money(row.rate)
                              ) : (
                                <span className="font-sans text-[10px] text-slate-400">
                                  {row.bundledNote || "—"}
                                </span>
                              )}
                            </td>
                            <td className="border-r border-[#E5F4F4] px-2 py-2 text-right text-[#045A57]">
                              {row.diesel > 0 ? money(row.diesel) : "—"}
                            </td>
                            <td className="px-2 py-2 text-center">
                              <Badge status={row.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-[#033B38] bg-[#E5F4F4] font-extrabold text-[#033B38]">
                          <td colSpan={8} className="px-2 py-2 text-right font-sans text-[10px] uppercase">
                            Total filtered load sheets ({visibleRows.length} movements):
                          </td>
                          <td className="px-2 py-2 text-right">{money(totals.rate)}</td>
                          <td className="px-2 py-2 text-right text-[#045A57]">{money(totals.diesel)}</td>
                          <td className="bg-[#D4EAEA] px-2 py-2 text-center font-sans text-[10px]">
                            Margin: ₹ {money(Math.max(0, totals.rate - totals.diesel))}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 border-t border-[#C5E3E3] bg-[#E5F4F4] p-3 font-sans text-[11px] md:grid-cols-2">
                  <div className="flex items-start gap-2 rounded border border-[#C5E3E3] bg-white p-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#033B38] bg-[#D4EAEA] font-extrabold text-[#033B38]">
                      1
                    </span>
                    <p className="leading-snug text-slate-700">
                      <strong className="text-[#033B38]">Every movement in one list:</strong> vehicle,
                      container, size, route, movement type, rate and extra cost such as diesel.
                    </p>
                  </div>
                  <div className="flex items-start gap-2 rounded border border-[#C5E3E3] bg-white p-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#033B38] bg-[#D4EAEA] font-extrabold text-[#033B38]">
                      2
                    </span>
                    <p className="leading-snug text-slate-700">
                      <strong className="text-[#033B38]">Filter by period or Billed / Unbilled:</strong>{" "}
                      use the B key on the right to see which load sheets are still pending.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {screen === "voucher" && (
              <div className="flex flex-1 flex-col justify-between">
                <div className="space-y-4 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-300 pb-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-[#033B38] px-2.5 py-0.5 font-sans text-[11px] font-bold text-white">
                          Freight Bill
                        </span>
                        <span className="font-sans text-[11px] font-bold text-slate-500">No.</span>
                        <span className="border border-[#033B38] bg-[#E5F4F4] px-2 py-0.5 font-mono text-xs font-bold text-[#033B38]">
                          RTC/24-25/16
                        </span>
                      </div>
                      <p className="font-sans text-[11px] text-slate-600">
                        <span className="inline-block w-24 font-semibold">Party A/c:</span>
                        <span className="font-extrabold text-[#033B38] underline decoration-dotted">
                          Sample Customer Pvt Ltd
                        </span>
                      </p>
                      <p className="font-sans text-[11px] text-slate-600">
                        <span className="inline-block w-24 font-semibold">Sales ledger:</span>
                        <span className="font-bold">Freight Service</span>
                      </p>
                    </div>

                    <div className="text-right font-sans">
                      <div className="text-sm font-bold text-[#033B38]">15-Apr-25</div>
                      <div className="text-[11px] text-slate-500">Tuesday</div>
                      <div className="mt-2 inline-block border border-[#C5E3E3] bg-[#E5F4F4] px-2 py-0.5 font-mono text-[10px] text-[#006569]">
                        Auto-created from {billedRows.length} load sheets
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse text-left">
                      <caption className="sr-only">
                        Freight bill grouped by container size and movement type
                      </caption>
                      <thead>
                        <tr className="border-y-2 border-[#033B38] bg-[#E5F4F4] font-sans text-[11px] font-extrabold text-[#033B38]">
                          <th className="px-3 py-2">Name of item</th>
                          <th className="w-28 px-3 py-2 text-right">Quantity</th>
                          <th className="w-32 px-3 py-2 text-right">Rate per</th>
                          <th className="w-36 px-3 py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {voucherGroups.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-3 py-8 text-center font-sans text-sm text-slate-500">
                              No billed movements yet. Go back to the load sheet and create the bill.
                            </td>
                          </tr>
                        )}
                        {voucherGroups.map((group) => (
                          <tr key={group.label} className="border-b border-slate-200">
                            <td className="px-3 py-2.5 font-sans text-xs font-extrabold text-[#033B38]">
                              TOTAL {group.label} CONTAINERS
                            </td>
                            <td className="px-3 py-2.5 text-right font-bold">{group.qty} Nos</td>
                            <td className="px-3 py-2.5 text-right">{money(group.rate)} Nos</td>
                            <td className="px-3 py-2.5 text-right font-bold text-[#033B38]">
                              {money(group.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-y-2 border-[#033B38] bg-[#E5F4F4] font-extrabold text-[#033B38]">
                          <td className="px-3 py-2 font-sans text-[10px] uppercase">Total freight bill amount</td>
                          <td className="px-3 py-2 text-right">{voucherQty} Nos</td>
                          <td />
                          <td className="bg-[#D4EAEA] px-3 py-2 text-right">{money(voucherTotal)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="flex flex-col items-start justify-between gap-3 pt-1 font-sans text-[11px] sm:flex-row sm:items-center">
                    <p className="text-slate-600">
                      <span className="font-bold text-[#033B38]">Narration:</span> Freight bill raised for{" "}
                      {billedRows.length} container movements (12-Apr-25 to 14-Apr-25) as per annexure
                      attached.
                    </p>
                    <button
                      type="button"
                      onClick={() => go("annexure")}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border-2 border-[#033B38] bg-[#D4EAEA] px-3 py-1.5 font-extrabold text-[#033B38] hover:bg-[#E5F4F4]"
                    >
                      <Printer className="h-4 w-4" aria-hidden="true" />
                      Annexure print
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 border-t border-[#C5E3E3] bg-[#E5F4F4] p-3 font-sans text-[11px] md:grid-cols-2">
                  <div className="flex items-start gap-2 rounded border border-[#C5E3E3] bg-white p-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#033B38] bg-[#D4EAEA] font-extrabold text-[#033B38]">
                      3
                    </span>
                    <p className="leading-snug text-slate-700">
                      <strong className="text-[#033B38]">Grouped freight bill:</strong> load sheets roll
                      into one bill, grouped by container size and movement type, with the rate and
                      amount worked out automatically.
                    </p>
                  </div>
                  <div className="flex items-start gap-2 rounded border border-[#C5E3E3] bg-white p-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#033B38] bg-[#D4EAEA] font-extrabold text-[#033B38]">
                      4
                    </span>
                    <p className="leading-snug text-slate-700">
                      <strong className="text-[#033B38]">Annexure print / export:</strong> the bill screen
                      gives you the complete container movement details behind the invoice.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {screen === "annexure" && (
              <div className="flex flex-1 flex-col justify-between bg-[#E5F4F4] p-4">
                <div className="mx-auto w-full max-w-4xl space-y-4 border-2 border-[#033B38] bg-white p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-[#033B38] pb-3">
                    <div>
                      <span className="border border-[#033B38] bg-[#D4EAEA] px-2 py-0.5 font-sans text-[10px] font-extrabold uppercase text-[#033B38]">
                        Invoice annexure statement
                      </span>
                      <h4 className="mt-1 font-sans text-lg font-black text-[#033B38]">
                        SAMPLE CONTAINER LOGISTICS
                      </h4>
                      <p className="font-sans text-[11px] text-slate-600">
                        Container movement details attached to freight bill no:{" "}
                        <strong className="font-mono text-[#033B38]">RTC/24-25/16</strong>
                      </p>
                    </div>
                    <div className="text-right font-sans text-[11px]">
                      <div>
                        <strong>Customer:</strong> Sample Customer Pvt Ltd
                      </div>
                      <div>
                        <strong>Bill date:</strong> 15-Apr-25
                      </div>
                      <div>
                        <strong>Period:</strong> 12-Apr-25 to 14-Apr-25
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] border-collapse text-left text-[11px]">
                      <caption className="sr-only">Container movement annexure attached to the bill</caption>
                      <thead>
                        <tr className="bg-[#033B38] font-sans text-[10px] text-white">
                          <th className="border border-[#033B38] px-2 py-1.5">Sr</th>
                          <th className="border border-[#033B38] px-2 py-1.5">Date</th>
                          <th className="border border-[#033B38] px-2 py-1.5">Vehicle no</th>
                          <th className="border border-[#033B38] px-2 py-1.5">Size</th>
                          <th className="border border-[#033B38] px-2 py-1.5">Container no</th>
                          <th className="border border-[#033B38] px-2 py-1.5">Route (from → to)</th>
                          <th className="border border-[#033B38] px-2 py-1.5">Movement type</th>
                          <th className="border border-[#033B38] px-2 py-1.5 text-right">Billed (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {billedRows.length === 0 && (
                          <tr>
                            <td colSpan={8} className="border border-slate-300 px-2 py-8 text-center font-sans text-slate-500">
                              No billed movements yet.
                            </td>
                          </tr>
                        )}
                        {billedRows.map((row) => (
                          <tr key={row.sr} className="border-b border-slate-300">
                            <td className="border border-slate-300 px-2 py-1.5">{row.sr}</td>
                            <td className="border border-slate-300 px-2 py-1.5">{row.date}</td>
                            <td className="border border-slate-300 px-2 py-1.5 font-bold">{row.vehicle}</td>
                            <td className="border border-slate-300 px-2 py-1.5">{row.size}</td>
                            <td className="border border-slate-300 px-2 py-1.5">{row.container}</td>
                            <td className="border border-slate-300 px-2 py-1.5 font-sans">
                              {row.from} → {row.to}
                            </td>
                            <td className="border border-slate-300 px-2 py-1.5 font-sans">{row.type}</td>
                            <td className="border border-slate-300 px-2 py-1.5 text-right font-bold">
                              {row.rate > 0 ? money(row.rate) : "Included"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-[#D4EAEA] font-extrabold text-[#033B38]">
                          <td colSpan={7} className="border border-[#033B38] px-2 py-2 text-right font-sans text-[10px] uppercase">
                            Total annexure freight bill value:
                          </td>
                          <td className="border border-[#033B38] px-2 py-2 text-right text-sm">
                            ₹ {money(annexureTotal)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-sans text-[11px]">
                    <span className="font-medium text-slate-600">
                      Ready to print with the invoice, or export to Excel / PDF for customer
                      reconciliation.
                    </span>
                    <button
                      type="button"
                      onClick={() => go("loadsheet")}
                      className="rounded-sm border border-[#033B38] bg-[#006569] px-3 py-1.5 font-bold text-white hover:bg-[#045A57]"
                    >
                      ← Back to load sheet
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Function-key sidebar */}
          <div className="flex flex-col justify-between gap-2 bg-[#E5F4F4] p-2 font-sans text-[11px] lg:col-span-2">
            <div className="space-y-1">
              <p className="px-1 pb-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-500">
                TallyPrime keys
              </p>
              {[
                { label: "F2: Period", onClick: () => setToast("Period selected: 12-Apr-25 to 15-Apr-25") },
                { label: "F3: Company", onClick: () => setToast("Active company: Sample Container Logistics") },
              ].map((key) => (
                <button
                  key={key.label}
                  type="button"
                  onClick={key.onClick}
                  className="w-full rounded-sm border border-[#C5E3E3] border-b-2 border-b-[#B8DEDE] bg-white px-2 py-1.5 text-left text-[10px] hover:bg-[#D4EAEA]"
                >
                  {key.label}
                </button>
              ))}
              {["F4: Contra", "F5: Payment", "F6: Receipt", "F7: Journal", "F9: Purchase"].map((label) => (
                <span
                  key={label}
                  className="block w-full rounded-sm border border-[#D4EAEA] bg-white/60 px-2 py-1 text-[10px] text-slate-400"
                >
                  {label}
                </span>
              ))}
              <button
                type="button"
                onClick={() => go("voucher")}
                className="w-full rounded-sm border border-[#C5E3E3] border-b-2 border-b-[#B8DEDE] bg-white px-2 py-1.5 text-left text-[10px] font-semibold hover:bg-[#D4EAEA]"
              >
                F8: Sales / Bill
              </button>
              <button
                type="button"
                onClick={() => go("loadsheet")}
                className="w-full rounded-sm border border-[#C5E3E3] border-b-2 border-b-[#B8DEDE] bg-white px-2 py-1.5 text-left text-[10px] font-semibold hover:bg-[#D4EAEA]"
              >
                F10: Load Sheet
              </button>

              <p className="px-1 pb-0.5 pt-2 text-[9px] font-extrabold uppercase tracking-wider text-[#033B38]">
                Module controls
              </p>
              <button
                type="button"
                onClick={cycleBilling}
                className="w-full rounded-sm border border-[#045A57] border-b-2 border-b-[#033B38] bg-[#D4EAEA] px-2 py-2 text-left text-[10px] font-extrabold text-[#033B38] hover:bg-[#C5E3E3]"
              >
                B: Billed / Unbilled
              </button>
              <button
                type="button"
                onClick={cycleSize}
                className="w-full rounded-sm border border-[#045A57] border-b-2 border-b-[#033B38] bg-[#D4EAEA] px-2 py-2 text-left text-[10px] font-extrabold text-[#033B38] hover:bg-[#C5E3E3]"
              >
                H: Filter size
              </button>
              <button
                type="button"
                onClick={() => go("annexure")}
                className="w-full rounded-sm border border-[#045A57] border-b-2 border-b-[#033B38] bg-[#D4EAEA] px-2 py-2 text-left text-[10px] font-extrabold text-[#033B38] hover:bg-[#C5E3E3]"
              >
                F: Annexure print
              </button>
              <button
                type="button"
                onClick={exportAnnexure}
                className="inline-flex w-full items-center gap-1.5 rounded-sm border border-[#045A57] border-b-2 border-b-[#033B38] bg-[#D4EAEA] px-2 py-2 text-left text-[10px] font-extrabold text-[#033B38] hover:bg-[#C5E3E3]"
              >
                <Download className="h-3 w-3" aria-hidden="true" />
                H: Export print
              </button>
            </div>

            <div className="rounded-sm border border-[#C5E3E3] bg-white p-2 text-[10px] leading-tight text-slate-600">
              <strong className="mb-0.5 block text-[#033B38]">Interactive tip:</strong>
              click <span className="font-bold underline">B: Billed / Unbilled</span> or{" "}
              <span className="font-bold underline">F: Annexure print</span> above.
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#C5E3E3] bg-[#E5F4F4] px-3 py-1.5 text-[10px] text-[#033B38]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold">TALLY MAIN</span>
            <span aria-hidden="true">→</span>
            <span className="font-bold text-[#006569]">{SCREEN_META[screen].crumb}</span>
          </div>
          <p
            aria-live="polite"
            className="rounded-sm border border-[#045A57] bg-[#D4EAEA] px-2 py-0.5 font-sans font-bold text-[#033B38]"
          >
            {toast}
          </p>
        </div>
      </div>
    </div>
  );
}
