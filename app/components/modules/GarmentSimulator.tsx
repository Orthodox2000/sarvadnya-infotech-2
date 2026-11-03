"use client";

import { useMemo, useState } from "react";
import { Package, Shirt, Sparkles } from "lucide-react";
import { SimControl, SimKey, SimTips, TallyChrome, type TallyTab } from "./TallyChrome";

/**
 * CHANGE: 2026-11-03 — interactive TallyPrime walkthrough for the Garment & Footwear page.
 *
 * WHY: the brochure's size-column invoice and closing-stock screens are print only. The four
 * items, MRPs, selling rates, 20 pcs / Rs. 18,480 / CGST 462 / SGST 462 / Rs. 19,404 total and
 * the closing-stock quantities all come from public/brochures/garment-footwear-module-brochure.pdf.
 * The size columns are editable so the totals can be seen recalculating.
 */
type Screen = "sale" | "items" | "stock";

type GarmentItem = {
  name: string;
  colour: string;
  mrp: number;
  rate: number;
  /** Quantities for sizes 28, 30, 32, 34, 36, 38, 40, 42 and 44. */
  sizes: number[];
  /** Closing stock per size, from the brochure's closing-stock screen. */
  stock: number[];
};

const SIZES = [28, 30, 32, 34, 36, 38, 40, 42, 44];
const SIZE_LABELS = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", ""];

const ITEMS: GarmentItem[] = [
  {
    name: "COTTON CASUAL SHIRT",
    colour: "NAVY",
    mrp: 1299,
    rate: 899,
    sizes: [0, 1, 1, 1, 1, 1, 0, 0, 1],
    stock: [0, 0, 12, 18, 9, 5, 0, 0, 0],
  },
  {
    name: "SLIM FIT JEANS",
    colour: "INDIGO",
    mrp: 1799,
    rate: 1299,
    sizes: [0, 0, 1, 1, 1, 0, 0, 0, 1],
    stock: [0, 6, 10, 8, 5, 0, 0, 0, 0],
  },
  {
    name: "LEATHER SANDAL",
    colour: "TAN",
    mrp: 999,
    rate: 749,
    sizes: [1, 1, 1, 1, 1, 0, 0, 0, 1],
    stock: [0, 0, 5, 7, 3, 0, 0, 0, 0],
  },
  {
    name: "PRINTED KURTA",
    colour: "MAROON",
    mrp: 1199,
    rate: 849,
    sizes: [0, 0, 1, 1, 1, 0, 0, 0, 1],
    stock: [0, 0, 4, 6, 3, 0, 0, 0, 0],
  },
];

const TABS: TallyTab[] = [
  { id: "sale", step: "1", label: "Sales invoice" },
  { id: "items", step: "2", label: "Auto item creation" },
  { id: "stock", step: "3", label: "Closing stock" },
];

const TITLES: Record<Screen, { title: string; crumb: string }> = {
  sale: {
    title: "Accounting Voucher Creation — Sales Invoice",
    crumb: "Gateway of Tally > Vouchers > F8 Sales",
  },
  items: {
    title: "Item Creation — As you type the bill",
    crumb: "Sales Invoice > Item > Create while entering",
  },
  stock: {
    title: "Closing Stock — By colour and size",
    crumb: "Gateway of Tally > Display More Reports > Stock Summary",
  },
};

const inr = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function qtyOf(item: GarmentItem): number {
  return item.sizes.reduce((sum, qty) => sum + qty, 0);
}

export default function GarmentSimulator() {
  const [screen, setScreen] = useState<Screen>("sale");
  const [items, setItems] = useState<GarmentItem[]>(ITEMS);
  const [toast, setToast] = useState("Ready • Sales invoice 1 with 4 colour-and-size items");

  const totals = useMemo(() => {
    const quantity = items.reduce((sum, item) => sum + qtyOf(item), 0);
    const amount = items.reduce((sum, item) => sum + qtyOf(item) * item.rate, 0);
    const cgst = Math.round(amount * 0.025 * 100) / 100;
    const sgst = cgst;
    return { quantity, amount, cgst, sgst, total: amount + cgst + sgst };
  }, [items]);

  const createdItems = useMemo(
    () =>
      items.flatMap((item) =>
        item.sizes
          .map((qty, index) => ({ item, qty, index }))
          .filter((entry) => entry.qty > 0)
          .map((entry) => ({
            key: `${item.name}-${item.colour}-${SIZES[entry.index]}`,
            label: `${item.name} · ${item.colour} · ${SIZES[entry.index]}`,
            qty: entry.qty,
          })),
      ),
    [items],
  );

  function go(next: Screen) {
    setScreen(next);
    setToast(`Screen changed: ${TITLES[next].title}`);
  }

  function setSize(itemIndex: number, sizeIndex: number, value: number) {
    const qty = Math.max(0, Math.min(99, Math.trunc(value) || 0));
    setItems((current) =>
      current.map((item, index) => {
        if (index !== itemIndex) return item;
        const sizes = [...item.sizes];
        sizes[sizeIndex] = qty;
        return { ...item, sizes };
      }),
    );
    const item = items[itemIndex];
    setToast(
      `${item.name} · ${item.colour} · size ${SIZES[sizeIndex]} → ${qty} pc${qty === 1 ? "" : "s"}`,
    );
  }

  function setRate(itemIndex: number, value: number) {
    const rate = Math.max(0, Number(value) || 0);
    setItems((current) =>
      current.map((item, index) => (index === itemIndex ? { ...item, rate } : item)),
    );
    setToast(`Selling rate updated — amount recalculated row by row`);
  }

  function addVariation() {
    setScreen("items");
    setToast("New colour-and-size item created automatically — no item master setup");
  }

  return (
    <TallyChrome
      company="Sample Garment Store (FY 2026-27)"
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
            <SimKey label="F3: Company" onClick={() => setToast("Active company: Sample Garment Store")} />
            <SimKey label="F8: Sales" strong onClick={() => go("sale")} />
            <SimKey label="F10: Stock summary" onClick={() => go("stock")} />

            <p className="px-1 pb-0.5 pt-2 text-[9px] font-extrabold uppercase tracking-wider text-[#033B38]">
              Module controls
            </p>
            <SimControl label="I: Create item while billing" onClick={addVariation} />
            <SimControl label="S: Closing stock by size" onClick={() => go("stock")} />
            <SimControl
              label="C: Colour / size matrix"
              onClick={() => {
                setScreen("sale");
                setToast("Size columns 28 to 44 stay on the invoice — more items per page");
              }}
            />
            <SimControl
              label="P: Print invoice"
              onClick={() => setToast("Print preview ready — invoice with colour and size columns")}
            />
          </div>

          <div className="rounded-sm border border-[#C5E3E3] bg-white p-2 text-[10px] leading-tight text-slate-600">
            <strong className="mb-0.5 block text-[#033B38]">Interactive tip:</strong>
            change a quantity in any size column and watch the row amount, GST and total follow.
          </div>
        </>
      }
    >
      {screen === "sale" && (
        <div className="flex min-h-[460px] flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#033B38] px-2.5 py-0.5 font-sans text-[11px] font-bold text-white">Sales</span>
                <span className="font-sans text-[11px] font-bold text-slate-500">No.</span>
                <span className="border border-[#033B38] bg-[#E5F4F4] px-2 py-0.5 font-mono text-xs font-bold text-[#033B38]">
                  1
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 font-sans text-[11px]">
                <span className="font-bold text-[#033B38]">23-Oct-26</span>
                <span className="rounded-sm border border-[#C5E3E3] bg-[#E5F4F4] px-2 py-0.5 font-mono text-[10px] text-[#006569]">
                  Friday
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-1 px-4 py-2 font-sans text-[11px]">
              <p className="flex items-center gap-2">
                <span className="w-24 shrink-0 font-semibold text-slate-600">Party A/c name</span>
                <span className="font-extrabold text-[#033B38] underline decoration-dotted">Customer - 1</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-24 shrink-0 font-semibold text-slate-600">Sales ledger</span>
                <span className="font-bold">GST SALES</span>
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <caption className="sr-only">
                  Sales invoice with colour and size columns, quantity, rate, amount, CGST, SGST and
                  total
                </caption>
                <thead>
                  <tr className="border-y-2 border-[#033B38] bg-[#E5F4F4] font-sans text-[10px] font-extrabold uppercase text-[#033B38]">
                    <th className="border-r border-[#D4EAEA] px-2 py-1.5">Name of item</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-1.5">Colour</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-1.5 text-right">MRP</th>
                    {SIZES.map((size, index) => (
                      <th key={size} className="border-r border-[#D4EAEA] px-1 py-1.5 text-center">
                        <span className="block font-mono text-[11px]">{size}</span>
                        <span className="block text-[9px] font-bold text-[#006569]">{SIZE_LABELS[index]}</span>
                      </th>
                    ))}
                    <th className="border-r border-[#D4EAEA] px-2 py-1.5 text-right">Qty</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-1.5 text-right">Rate</th>
                    <th className="px-2 py-1.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, itemIndex) => (
                    <tr key={item.name} className="border-b border-[#E5F4F4]">
                      <td className="border-r border-[#E5F4F4] px-2 py-1.5 font-sans text-[11px] font-extrabold text-[#033B38]">
                        {item.name}
                      </td>
                      <td className="border-r border-[#E5F4F4] px-2 py-1.5 font-sans text-[11px] font-bold text-slate-600">
                        {item.colour}
                      </td>
                      <td className="border-r border-[#E5F4F4] px-2 py-1.5 text-right text-[11px]">
                        {inr.format(item.mrp)}
                      </td>
                      {item.sizes.map((qty, sizeIndex) => (
                        <td key={SIZES[sizeIndex]} className="border-r border-[#E5F4F4] p-0.5 text-center">
                          <input
                            type="number"
                            min={0}
                            max={99}
                            value={qty}
                            aria-label={`${item.name} ${item.colour} size ${SIZES[sizeIndex]} quantity`}
                            onChange={(event) => setSize(itemIndex, sizeIndex, Number(event.target.value))}
                            className={`w-9 rounded-sm border bg-white px-1 py-0.5 text-center font-mono text-[11px] text-[#033B38] focus:outline-none focus:ring-2 focus:ring-[#006569]/40 ${
                              qty > 0 ? "border-[#045A57] font-bold" : "border-[#E5F4F4] text-slate-400"
                            }`}
                          />
                        </td>
                      ))}
                      <td className="border-r border-[#E5F4F4] px-2 py-1.5 text-right font-bold text-[#033B38]">
                        {qtyOf(item)} Pcs
                      </td>
                      <td className="border-r border-[#E5F4F4] px-2 py-1.5 text-right">
                        <input
                          type="number"
                          min={0}
                          value={item.rate}
                          aria-label={`${item.name} selling rate`}
                          onChange={(event) => setRate(itemIndex, Number(event.target.value))}
                          className="w-16 rounded-sm border border-[#045A57] bg-white px-1 py-0.5 text-right font-mono text-[11px] text-[#033B38] focus:outline-none focus:ring-2 focus:ring-[#006569]/40"
                        />
                      </td>
                      <td className="px-2 py-1.5 text-right font-bold">
                        {inr.format(qtyOf(item) * item.rate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#033B38] bg-[#E5F4F4] font-extrabold text-[#033B38]">
                    <td colSpan={3} className="px-2 py-2 text-right font-sans text-[10px] uppercase">
                      Totals
                    </td>
                    <td colSpan={SIZES.length} className="px-2 py-2 text-center font-sans text-[10px] text-slate-600">
                      quantity and amount calculated row by row
                    </td>
                    <td className="px-2 py-2 text-right">{totals.quantity} Pcs</td>
                    <td />
                    <td className="px-2 py-2 text-right">{inr.format(totals.amount)}</td>
                  </tr>
                  <tr className="border-t border-[#C5E3E3]">
                    <td colSpan={SIZES.length + 5} className="px-2 py-1.5 text-right font-sans text-[11px] font-semibold text-slate-700">
                      CGST @ 2.5%
                    </td>
                    <td className="px-2 py-1.5 text-right font-bold">{inr.format(totals.cgst)}</td>
                  </tr>
                  <tr className="border-t border-[#C5E3E3]">
                    <td colSpan={SIZES.length + 5} className="px-2 py-1.5 text-right font-sans text-[11px] font-semibold text-slate-700">
                      SGST @ 2.5%
                    </td>
                    <td className="px-2 py-1.5 text-right font-bold">{inr.format(totals.sgst)}</td>
                  </tr>
                  <tr className="border-y-2 border-[#033B38] bg-[#D4EAEA]">
                    <td colSpan={SIZES.length + 5} className="px-2 py-2 text-right font-sans text-xs font-black uppercase text-[#033B38]">
                      Total
                    </td>
                    <td className="px-2 py-2 text-right text-sm font-black text-[#033B38]">
                      {inr.format(totals.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 font-sans text-[11px]">
              <p className="text-slate-600">
                <strong className="text-[#033B38]">Note:</strong> every size column is part of the same
                item — 28 to 44 stay on one invoice line.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={addVariation}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-[#045A57] bg-white px-3 py-1.5 font-bold text-[#033B38] hover:bg-[#E5F4F4]"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  New colour / size
                </button>
                <button
                  type="button"
                  onClick={() => setToast("Print preview ready — invoice with colour and size columns")}
                  className="rounded-sm border border-[#033B38] bg-[#006569] px-3 py-1.5 font-extrabold text-white hover:bg-[#045A57]"
                >
                  Print invoice
                </button>
              </div>
            </div>
          </div>

          <SimTips
            tips={[
              {
                n: 1,
                title: "Sizes add up on their own:",
                body: "fill the size columns and the quantity and amount are worked out for you.",
              },
              {
                n: 2,
                title: "More items per page:",
                body: "the invoice prints its own colour and size columns, so a full family bill fits.",
              },
            ]}
          />
        </div>
      )}

      {screen === "items" && (
        <div className="flex min-h-[460px] flex-col justify-between">
          <div className="space-y-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-3 font-sans">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#006569]">No item master</p>
                <p className="text-sm font-black text-[#033B38]">Items create themselves as you bill</p>
              </div>
              <span className="rounded-sm border border-[#045A57] bg-[#D4EAEA] px-2 py-0.5 text-[10px] font-bold text-[#033B38]">
                {createdItems.length} variations on this bill
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  n: 1,
                  title: "A new style arrives",
                  body: "One design in 5 colours and 6 sizes is 30 items if you create them by hand.",
                },
                {
                  n: 2,
                  title: "Type the purchase or sale",
                  body: "The colour-and-size item is created while you enter the voucher.",
                },
                {
                  n: 3,
                  title: "Start billing",
                  body: "No setup screen first — the item already exists the moment it is billed.",
                },
              ].map((step) => (
                <div key={step.n} className="rounded border border-[#C5E3E3] bg-[#E5F4F4] p-3 font-sans text-[11px]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#033B38] bg-[#D4EAEA] font-extrabold text-[#033B38]">
                    {step.n}
                  </span>
                  <p className="mt-2 font-bold text-[#033B38]">{step.title}</p>
                  <p className="mt-1 leading-snug text-slate-600">{step.body}</p>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto rounded border border-[#C5E3E3]">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <caption className="sr-only">Items created automatically by the current sales invoice</caption>
                <thead>
                  <tr className="border-b-2 border-[#C5E3E3] bg-[#E5F4F4] font-sans text-[10px] font-extrabold uppercase text-[#033B38]">
                    <th className="px-3 py-2">Item created</th>
                    <th className="px-3 py-2 text-center">Size</th>
                    <th className="px-3 py-2 text-right">Qty</th>
                    <th className="px-3 py-2 text-center">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {createdItems.map((entry) => {
                    const [name, colour, size] = entry.label.split(" · ");
                    return (
                      <tr key={entry.key} className="border-b border-[#E5F4F4] font-sans text-[11px]">
                        <td className="px-3 py-1.5 font-bold text-[#033B38]">
                          {name} <span className="font-semibold text-slate-500">· {colour}</span>
                        </td>
                        <td className="px-3 py-1.5 text-center font-mono">{size}</td>
                        <td className="px-3 py-1.5 text-right font-bold">{entry.qty}</td>
                        <td className="px-3 py-1.5 text-center text-[10px] font-bold text-[#006569]">
                          Created at billing
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={() => {
                setScreen("sale");
                setToast("Back on the invoice — change a size column to create another variation");
              }}
              className="rounded-sm border border-[#033B38] bg-[#006569] px-3 py-1.5 font-sans text-[11px] font-extrabold text-white hover:bg-[#045A57]"
            >
              ← Back to the invoice
            </button>
          </div>

          <SimTips
            tips={[
              {
                n: 1,
                title: "No item master setup:",
                body: "the colour-and-size combination is created the first time it is billed.",
              },
              {
                n: 2,
                title: "One item, many variations:",
                body: "size 28 to 44 all belong to the same style, so the report stays readable.",
              },
            ]}
          />
        </div>
      )}

      {screen === "stock" && (
        <div className="flex min-h-[460px] flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C5E3E3] bg-[#E5F4F4] px-3 py-2 font-sans text-[11px]">
              <span className="font-bold text-[#033B38]">
                Period: <span className="font-mono">01-Apr-26 to 23-Oct-26</span>
              </span>
              <span className="rounded-sm border border-[#045A57] bg-[#D4EAEA] px-2 py-0.5 font-extrabold text-[#033B38]">
                Closing balance
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] border-collapse text-left">
                <caption className="sr-only">
                  Closing stock by colour and size with quantity, rate and value
                </caption>
                <thead>
                  <tr className="border-b-2 border-[#C5E3E3] bg-[#E5F4F4] font-sans text-[10px] font-extrabold uppercase text-[#033B38]">
                    <th className="border-r border-[#D4EAEA] px-2 py-1.5">Particulars</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-1.5">Colour</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-1.5 text-right">MRP</th>
                    {SIZES.map((size) => (
                      <th key={size} className="border-r border-[#D4EAEA] px-1 py-1.5 text-center font-mono text-[11px]">
                        {size}
                      </th>
                    ))}
                    <th className="border-r border-[#D4EAEA] px-2 py-1.5 text-right">Qty</th>
                    <th className="border-r border-[#D4EAEA] px-2 py-1.5 text-right">Rate</th>
                    <th className="px-2 py-1.5 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const qty = item.stock.reduce((sum, value) => sum + value, 0);
                    return (
                      <tr key={item.name} className="border-b border-[#E5F4F4]">
                        <td className="border-r border-[#E5F4F4] px-2 py-1.5 font-sans text-[11px] font-extrabold text-[#033B38]">
                          {item.name}
                        </td>
                        <td className="border-r border-[#E5F4F4] px-2 py-1.5 font-sans text-[11px] font-bold text-slate-600">
                          {item.colour}
                        </td>
                        <td className="border-r border-[#E5F4F4] px-2 py-1.5 text-right text-[11px]">
                          {inr.format(item.mrp)}
                        </td>
                        {item.stock.map((value, index) => (
                          <td
                            key={SIZES[index]}
                            className={`border-r border-[#E5F4F4] px-1 py-1.5 text-center font-mono text-[11px] ${
                              value > 0 ? "font-bold text-[#033B38]" : "text-slate-300"
                            }`}
                          >
                            {value > 0 ? value : "—"}
                          </td>
                        ))}
                        <td className="border-r border-[#E5F4F4] px-2 py-1.5 text-right font-bold text-[#033B38]">
                          {qty} Pcs
                        </td>
                        <td className="border-r border-[#E5F4F4] px-2 py-1.5 text-right text-[11px]">
                          {inr.format(item.rate)}
                        </td>
                        <td className="px-2 py-1.5 text-right font-bold">{inr.format(qty * item.rate)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#033B38] bg-[#E5F4F4] font-extrabold text-[#033B38]">
                    <td colSpan={SIZES.length + 3} className="px-2 py-2 text-right font-sans text-[10px] uppercase">
                      Grand total
                    </td>
                    <td className="px-2 py-2 text-right">
                      {items.reduce((sum, item) => sum + item.stock.reduce((s, v) => s + v, 0), 0)} Pcs
                    </td>
                    <td />
                    <td className="bg-[#D4EAEA] px-2 py-2 text-right">
                      {inr.format(items.reduce((sum, item) => sum + item.stock.reduce((s, v) => s + v, 0) * item.rate, 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 font-sans text-[11px]">
              <p className="flex items-center gap-1.5 text-slate-600">
                <Package className="h-3.5 w-3.5 text-[#006569]" aria-hidden="true" />
                Stock drops for exactly the colour and size that was sold.
              </p>
              <button
                type="button"
                onClick={() => {
                  setScreen("sale");
                  setToast("Back on the invoice — sell a size and reopen closing stock to see it drop");
                }}
                className="rounded-sm border border-[#033B38] bg-[#006569] px-3 py-1.5 font-extrabold text-white hover:bg-[#045A57]"
              >
                ← Back to the invoice
              </button>
            </div>
          </div>

          <SimTips
            tips={[
              {
                n: 1,
                title: "Stock by exact variation:",
                body: "quantity and value sit under the colour and size that was actually sold.",
              },
              {
                n: 2,
                title: "Ready at month-end:",
                body: "the closing stock report shows what is left without a separate stock sheet.",
              },
            ]}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-[#C5E3E3] bg-[#E5F4F4] px-3 py-1.5 font-sans text-[10px] text-[#033B38]">
        <Shirt className="h-3.5 w-3.5 text-[#006569]" aria-hidden="true" />
        Every size column belongs to one item — quantity, amount and stock are calculated for that
        exact colour and size.
      </div>
    </TallyChrome>
  );
}
