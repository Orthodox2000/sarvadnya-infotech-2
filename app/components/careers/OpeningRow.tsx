'use client';

import { useEffect, useRef, useState } from 'react';
import { Job } from '@/lib/jobs';

interface OpeningRowProps {
  job: Job;
  onApply: (job: Job) => void;
  /** Stagger index for the entrance animation. */
  index?: number;
  /** Set from the parent AFTER mount — never during render, or the matchMedia read diverges. */
  canHover?: boolean;
  // CHANGE: 2026-10-05 — applying is a logged-in action, so the CTA relabels itself:
  // "Login to apply" while signed out, "Apply Now" once there is a session. `onApply` is still
  // the only callback; the PARENT decides whether that means "open the modal" or "focus login",
  // so the row never needs to know how sign-in works.
  isAuthenticated?: boolean;
}

/** Jobs posted within the last 7 days get the "New" flag. */
function isNewPosting(postedAt: string) {
  const postDate = new Date(postedAt);
  if (Number.isNaN(postDate.getTime())) return false;
  const diffDays = Math.ceil(Math.abs(Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
}

function formatPostedAt(postedAt: string) {
  const date = new Date(postedAt);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * CHANGE: 2026-10-05 — replaces `OpeningCard`. WHY: a full card per role was too tall for the
 * left column of the new two-column /careers layout, so each opening is now ONE slim row whose
 * full description lives behind an inline `View details` expander.
 * Animation posture matches the site (see AGENTS.md): entrance is `mounted`-gated so SSR and the
 * first client render agree, hover lift is gated behind a real `pointer:fine` check so touch
 * devices never get sticky-hover state, and the global `prefers-reduced-motion` block in
 * app/globals.css neutralises everything for motion-sensitive visitors.
 */
export function OpeningRow({ job, onApply, index = 0, canHover = false, isAuthenticated = false }: OpeningRowProps) {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // CHANGE: 2026-10-05 — the expander animates with the `grid-template-rows: 0fr -> 1fr` trick,
  // which needs an explicit scrollHeight to animate `height` on older engines that lack it.
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showNew = isNewPosting(job.postedAt);
  const detailsId = `job-details-${(job as any)._id || job.id}`;
  const ctaLabel = isAuthenticated ? 'Apply Now' : 'Login to apply';

  // Hover affordances only exist on devices that actually hover.
  const hoverRow = canHover
    ? 'hover:border-[#006569]/30 hover:shadow-md hover:-translate-y-0.5'
    : '';
  const hoverTitle = canHover ? 'group-hover:text-[#006569]' : '';
  const hoverChip = canHover ? 'group-hover:bg-[#E5F4F4] group-hover:border-[#006569]/20' : '';

  return (
    <article
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(14px)',
        transition:
          'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: mounted ? `${index * 60}ms` : '0ms',
      }}
      className={`group relative overflow-hidden rounded-2xl border border-[#E5F4F4] bg-white shadow-sm transition-all duration-300 ${hoverRow}`}
    >
      <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:gap-4 lg:p-5">
        {/* CHANGE: 2026-10-05 — the actions go side-by-side only from `lg`, NOT `sm`. The page is now
          two columns from `md` (768px), which leaves this column ~370px wide there; a horizontal
          title-plus-buttons row would squeeze the job title down to ~70px. Below `md` the page is
          a single full-width column, where stacking is still the safer default. */}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            {showNew && (
              <span className="rounded-full bg-[#006569] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-sm shadow-[#006569]/20">
                New
              </span>
            )}
            <span
              className={`rounded-full border border-[#E5F4F4] bg-[#F5F4ED] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#006569] transition-colors duration-300 ${hoverChip}`}
            >
              {job.department}
            </span>
          </div>

          <h3
            className={`text-sm font-black leading-snug text-slate-900 transition-colors duration-300 sm:text-base ${hoverTitle}`}
          >
            {job.title}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-slate-400 sm:text-[11px]">
            <span className="inline-flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {job.type}
            </span>
            <span>Posted {formatPostedAt(job.postedAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onApply(job)}
            // CHANGE: 2026-10-05 — `min-h-10` (40px). The row's own CTAs measured ~30px tall, under a
            // comfortable tap target at 360px. Held the row at 112px on desktop after the change.
            className="flex min-h-10 items-center rounded-full bg-[#006569] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-[#006569]/15 transition-all duration-300 hover:bg-[#005559] hover:shadow-xl hover:shadow-[#006569]/25 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]/40 focus-visible:ring-offset-2 sm:text-[11px]"
          >
            {ctaLabel}
          </button>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={detailsId}
            className="inline-flex min-h-10 items-center gap-1 rounded-full border border-[#E5F4F4] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all duration-300 hover:border-[#006569]/40 hover:text-[#006569] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]/30 focus-visible:ring-offset-2 sm:text-[11px]"
          >
            {/* Short label on the narrowest phones so the two buttons stay on one line. */}
            <span className="hidden sm:inline">View details</span>
            <span className="sm:hidden">Details</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{
                transform: expanded ? 'rotate(180deg)' : 'none',
                transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expander: 0fr -> 1fr is the only way to animate to `height: auto` without JS measuring.
          The `hidden` fallback keeps the content unreachable if a browser can't do grid-rows. */}
      <div
        id={detailsId}
        className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div ref={panelRef} className="border-t border-[#E5F4F4] bg-[#F5F4ED]/40 px-4 py-4 sm:px-5">
            {job.fullDescription && (
              <p className="text-xs leading-relaxed text-slate-600 sm:text-[13px]">{job.fullDescription}</p>
            )}

            {job.aboutRole && (
              <div className="mt-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#006569]">
                  About the role
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                  {job.aboutRole}
                </p>
              </div>
            )}

            {job.requirements.length > 0 && (
              <div className="mt-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#006569]">
                  What you&apos;ll need
                </h4>
                <ul className="mt-1.5 space-y-1">
                  {job.requirements.map((req) => (
                    <li key={req} className="flex gap-2 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#006569]/40" aria-hidden="true" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits.length > 0 && (
              <div className="mt-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#006569]">
                  What we offer
                </h4>
                <ul className="mt-1.5 space-y-1">
                  {job.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex gap-2 text-xs leading-relaxed text-slate-600 sm:text-[13px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 shrink-0 text-[#006569]"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={() => onApply(job)}
              className="mt-4 w-full rounded-full bg-[#006569] px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-[#006569]/15 transition-all duration-300 hover:bg-[#005559] hover:shadow-lg active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]/40 focus-visible:ring-offset-2 sm:w-auto sm:text-[11px]"
            >
              {isAuthenticated ? 'Apply for this role' : 'Login to apply for this role'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}