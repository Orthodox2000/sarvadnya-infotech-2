"use client";

import { useState } from "react";
import { CalendarDays, MessageSquare, Phone, Tag } from "lucide-react";
import UnifiedContactModal, { FormType } from "../UnifiedContactModal";

/**
 * CHANGE: 2026-11-02 — conversion block for /modules/[slug].
 *
 * WHY: the page is a landing page, not a modal. It reuses UnifiedContactModal so every lead
 * still travels through the existing form pipeline (destination="modules") instead of a new
 * endpoint, and is passed explicitly because the path is /modules/<id> rather than /modules.
 */
export default function ModuleCta({
  title,
  pricing,
  brochureUrl,
}: {
  title: string;
  pricing?: { label: string; price: string }[];
  brochureUrl: string;
}) {
  const [modal, setModal] = useState<{ open: boolean; type: FormType }>({
    open: false,
    type: "demo",
  });
  const [showPrice, setShowPrice] = useState(false);

  const service = `Module: ${title}`;
  const whatsapp = `https://wa.me/919870942557?text=${encodeURIComponent(
    `Hi Sarvadnya Infotech, I would like a demo of the ${title} in TallyPrime.`,
  )}`;

  return (
    <section id="demo" className="border-b-2 border-[#033B38] bg-[#E5F4F4] px-5 py-14 scroll-mt-32 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        {pricing && pricing.length > 0 && (
          <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl border-2 border-[#033B38] bg-white p-5 shadow-[0_4px_0_0_#033B38] sm:flex-row sm:items-center sm:p-6">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#006569]">
                Module pricing · TDL licence
              </p>
              <h2 className="mt-1 text-xl font-black text-[#033B38] sm:text-2xl">
                {title.replace(/ in TallyPrime$/, "")}
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-600">
                Installation, setup and operator training are handled by our team.
              </p>
            </div>

            <div className="w-full sm:w-auto">
              {!showPrice ? (
                <button
                  type="button"
                  onClick={() => setShowPrice(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#033B38] bg-[#006569] px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-[0_2px_0_0_#033B38] transition-colors hover:bg-[#045A57] sm:w-auto"
                >
                  <Tag className="h-4 w-4" aria-hidden="true" />
                  View module price
                </button>
              ) : (
                <ul className="space-y-2">
                  {pricing.map((row) => (
                    <li
                      key={row.label}
                      className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-[#C5E3E3] bg-[#E5F4F4] px-4 py-2.5"
                    >
                      <span className="text-xs font-bold text-slate-700">{row.label}</span>
                      <span className="font-mono text-base font-black text-[#006569]">{row.price}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border-2 border-[#033B38] bg-[#033B38] p-6 text-white shadow-[0_6px_0_0_#045A57] sm:p-8 lg:col-span-5">
            <p className="inline-block rounded-sm border border-[#C5E3E3]/40 bg-[#045A57] px-2.5 py-1 font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#E5F4F4]">
              Sarvadnya Infotech LLP
            </p>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">Ready to speed up your billing?</h2>
            <ul className="mt-3 space-y-1.5 text-sm font-medium text-[#E5F4F4]">
              <li>• Get a free demo at your convenience</li>
              <li>• Chat with our team on WhatsApp</li>
              <li>• See the module in action today</li>
            </ul>

            <div className="mt-6 space-y-2.5">
              <a
                href="tel:+919870942557"
                className="flex items-center gap-3 rounded-lg border border-[#C5E3E3]/30 bg-[#045A57] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#006569]"
              >
                <Phone className="h-4 w-4 text-[#D4EAEA]" aria-hidden="true" />
                +91 98709 42557
              </a>
              <a
                href="tel:+919821309060"
                className="flex items-center gap-3 rounded-lg border border-[#C5E3E3]/30 bg-[#045A57] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#006569]"
              >
                <Phone className="h-4 w-4 text-[#D4EAEA]" aria-hidden="true" />
                +91 98213 09060
              </a>
              <a
                href="mailto:info@sarvadnyainfotech.com"
                className="flex items-center gap-3 rounded-lg border border-[#C5E3E3]/30 bg-[#045A57] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#006569]"
              >
                <MessageSquare className="h-4 w-4 text-[#D4EAEA]" aria-hidden="true" />
                info@sarvadnyainfotech.com
              </a>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#033B38] bg-white p-6 shadow-[0_6px_0_0_#033B38] sm:p-8 lg:col-span-7">
            <h2 className="text-2xl font-black text-[#033B38]">Book a live TallyPrime demo</h2>
            <p className="mt-1 text-sm font-medium text-slate-600">
              Tell us how this process runs in your business today. We will walk you through the same
              module on your own workflow.
            </p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => setModal({ open: true, type: "demo" })}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#033B38] bg-[#006569] px-5 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-[0_2px_0_0_#033B38] transition-colors hover:bg-[#045A57]"
              >
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
                Schedule my free demo
              </button>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setModal({ open: true, type: "quote" })}
                  className="rounded-xl border-2 border-[#033B38] bg-white px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-[#033B38] transition-colors hover:bg-[#D4EAEA]"
                >
                  Request a quote
                </button>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#033B38] bg-[#D4EAEA] px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-[#033B38] transition-colors hover:bg-[#C5E3E3]"
                >
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  WhatsApp us
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs font-semibold text-slate-600">
                <a href={brochureUrl} download className="font-bold text-[#006569] underline hover:text-[#033B38]">
                  Download the brochure (PDF)
                </a>
                <span aria-hidden="true">·</span>
                <a href="tel:+919870942557" className="font-bold text-[#006569] underline hover:text-[#033B38]">
                  Call the module team
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UnifiedContactModal
        isOpen={modal.open}
        onClose={() => setModal((current) => ({ ...current, open: false }))}
        type={modal.type}
        prefillService={service}
        destination="modules"
      />
    </section>
  );
}
