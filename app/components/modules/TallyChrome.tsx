"use client";

import type { ReactNode } from "react";

/**
 * CHANGE: 2026-11-03 — one TallyPrime window chrome for every module simulator.
 *
 * WHY: the six module pages must look like the same product. Only the screens inside the
 * window should differ. This shell owns the tab strip, the TallyPrime title bar, the
 * function-key sidebar and the status line, so no two modules can drift apart.
 */
export type TallyTab = { id: string; step: string; label: string };

export function TallyChrome({
  company,
  tabs,
  active,
  onTab,
  title,
  crumb,
  toast,
  sidebar,
  children,
  titleBarExtra,
  hint = "Click a screen or a Tally function key to walk through the module.",
}: {
  company: string;
  tabs: TallyTab[];
  active: string;
  onTab: (id: string) => void;
  title: string;
  crumb: string;
  toast: string;
  sidebar: ReactNode;
  children: ReactNode;
  /** Optional extra keys for the title bar (the container module keeps G / E / P). */
  titleBarExtra?: ReactNode;
  hint?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-[#033B38] bg-white shadow-[0_8px_0_0_#033B38]">
      {/* Screen switcher */}
      <div className="flex flex-col gap-3 border-b-2 border-[#033B38] bg-[#033B38] p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="rounded-sm bg-[#D4EAEA] px-2 py-1 font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#033B38]">
            Live TallyPrime screen
          </span>
          <span className="text-[11px] font-semibold text-[#E5F4F4] sm:text-xs">{hint}</span>
        </div>

        <div className="flex flex-wrap gap-2" aria-label="TallyPrime screens">
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => onTab(tab.id)}
                className={`flex items-center gap-2 rounded px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider transition-colors sm:text-[11px] ${
                  isActive
                    ? "border border-[#D4EAEA] bg-[#D4EAEA] text-[#033B38]"
                    : "border border-[#C5E3E3]/40 bg-[#045A57] text-[#E5F4F4] hover:bg-white hover:text-[#033B38]"
                }`}
              >
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                    isActive ? "bg-[#006569] text-white" : "bg-[#033B38] text-white"
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
              <span>O: Import</span>
              <span>M: E-mail</span>
              {titleBarExtra}
            </div>
          </div>
          <div className="text-[10px] font-sans font-semibold text-[#D4EAEA]">
            Company: <span className="font-bold text-white">{company}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#006569] px-3 py-1 font-sans text-[11px] font-bold text-white">
          <span>{title}</span>
          <span className="rounded-sm bg-[#D4EAEA] px-1.5 py-0.5 font-mono text-[10px] font-extrabold text-[#033B38]">
            Ctrl+M
          </span>
        </div>

        <div className="grid min-h-[460px] grid-cols-1 lg:grid-cols-12">
          <div className="border-b border-[#C5E3E3] bg-white lg:col-span-10 lg:border-b-0 lg:border-r">
            {children}
          </div>

          <aside className="flex flex-col justify-between gap-2 bg-[#E5F4F4] p-2 font-sans text-[11px] lg:col-span-2">
            {sidebar}
          </aside>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#C5E3E3] bg-[#E5F4F4] px-3 py-1.5 text-[10px] text-[#033B38]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold">TALLY MAIN</span>
            <span aria-hidden="true">→</span>
            <span className="font-bold text-[#006569]">{crumb}</span>
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

/** Two-line explanatory footer used under each screen, matching the container simulator. */
export function SimTips({ tips }: { tips: { n: number; title: string; body: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-2 border-t border-[#C5E3E3] bg-[#E5F4F4] p-3 font-sans text-[11px] md:grid-cols-2">
      {tips.map((tip) => (
        <div key={tip.n} className="flex items-start gap-2 rounded border border-[#C5E3E3] bg-white p-2.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#033B38] bg-[#D4EAEA] font-extrabold text-[#033B38]">
            {tip.n}
          </span>
          <p className="leading-snug text-slate-700">
            <strong className="text-[#033B38]">{tip.title}</strong> {tip.body}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Sidebar function-key button. `muted` renders the disabled-looking keys. */
export function SimKey({
  label,
  onClick,
  strong,
  muted,
}: {
  label: string;
  onClick?: () => void;
  strong?: boolean;
  muted?: boolean;
}) {
  if (muted) {
    return (
      <span className="block w-full rounded-sm border border-[#D4EAEA] bg-white/60 px-2 py-1 text-[10px] text-slate-400">
        {label}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-sm border border-[#C5E3E3] border-b-2 border-b-[#B8DEDE] bg-white px-2 py-1.5 text-left text-[10px] hover:bg-[#D4EAEA] ${
        strong ? "font-extrabold" : "font-semibold"
      }`}
    >
      {label}
    </button>
  );
}

/** Highlighted module-control button in the sidebar. */
export function SimControl({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full items-center gap-1.5 rounded-sm border border-[#045A57] border-b-2 border-b-[#033B38] bg-[#D4EAEA] px-2 py-2 text-left text-[10px] font-extrabold text-[#033B38] hover:bg-[#C5E3E3]"
    >
      {icon}
      {label}
    </button>
  );
}

/** Small inline pill used inside screens for totals and statuses. */
export function SimPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm border border-[#045A57] bg-[#D4EAEA] px-2 py-0.5 font-sans text-[10px] font-extrabold text-[#033B38]">
      {children}
    </span>
  );
}
