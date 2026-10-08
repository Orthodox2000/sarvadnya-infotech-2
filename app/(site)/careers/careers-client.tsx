'use client';

import { useEffect, useState } from 'react';
import { Job } from '@/lib/jobs';
import { OpeningRow } from '@/app/components/careers/OpeningRow';
import { AuthForms } from '@/app/components/careers/AuthForms';
import { IdCard } from '@/app/components/careers/IdCard';
import { CareersAuthProvider } from '@/app/components/careers/CareersAuthProvider';
import JobApplicationModal from '@/app/components/JobApplicationModal';
import QuickApplyModal from '@/app/components/careers/QuickApplyModal';

/**
 * CHANGE: 2026-10-05 — full layout redesign.
 *
 * WHY: /careers showed a big hero band, then a "Current Openings" section that was rendered by a
 * render-prop of <CareersAuthGate>, which returned the login card INSTEAD of its children when
 * signed out — so a logged-out visitor never saw a single opening. Login and the openings are now
 * two halves of ONE section: openings left, auth card right, both always present.
 *
 * The hero band is gone (owner request). A single compact heading remains because an h1 with the
 * page's subject helps SEO and tells a visitor where they are.
 *
 * Motion posture (see AGENTS.md): every entrance is `mounted`-gated in an effect so SSR and the
 * first client render agree; the sticky auth column is `lg:sticky` so it stays reachable while the
 * openings scroll; `canHover` gates hover lift to real pointers so touch devices never get
 * sticky-hover state; app/globals.css holds the global prefers-reduced-motion override.
 */
export function CareersClient() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [canHover, setCanHover] = useState(false);
  // CHANGE: 2026-10-05 — bumped whenever a "Login to apply" CTA is pressed. Passed to <AuthForms>,
  // which focuses its email field whenever this changes. A counter (rather than a boolean flag) is
  // what makes repeated clicks work: setting a boolean that is already true fires no effect.
  const [loginFocusSignal, setLoginFocusSignal] = useState(0);

  useEffect(() => {
    setMounted(true);
    // Read the hover capability AFTER mount — a matchMedia read during render would diverge
    // between the server pass and hydration.
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setCanHover(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/careers/visible')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setJobs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch jobs:', err);
        if (!cancelled) {
          setLoadError(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <CareersAuthProvider>
      {({ user, isAuthReady, setUser, signOut }) => {
        const isAuthenticated = !!user;

        // CHANGE: 2026-10-05 — applying is now a signed-in action (owner request). While signed out
        // the row CTA reads "Login to apply" and this instead nudges the auth column: bump the focus
        // signal, which <AuthForms> turns into a real focus() on its email field. No `isAuthReady`
        // gate is needed — the signal survives the form not existing yet, because AuthForms honours
        // a non-zero value on mount.
        const handleApply = (job: Job) => {
          if (!isAuthenticated) {
            setLoginFocusSignal((n) => n + 1);
            return;
          }
          setSelectedJob(job);
          setIsModalOpen(true);
        };

        return (
        <section className="bg-white px-4 py-10 sm:px-6 md:py-14">
          <div className="mx-auto max-w-6xl">
            {/* CHANGE: 2026-10-05 (round 3) — the "Careers Portal" kicker sits ABOVE the grid again.
                Round 3 first moved it inside grid area 1 (heading), which pushed the h1 down by the
                kicker's height + margin and left the auth card 47px ABOVE the title — measured, not
                eyeballed. Keeping it full-width above the grid is what makes area 1's top edge equal
                the h1's top edge, so area 2 can align with the title structurally. */}
            <div
              style={{ opacity: mounted ? 1 : 0, transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)' }}
              className="mb-5 md:mb-6"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5F4F4] bg-[#F5F4ED]/60 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[#006569]">
                <span className="h-1 w-1 rounded-full bg-[#006569]" aria-hidden="true" />
                Careers Portal
              </span>
            </div>

            {/* CHANGE: 2026-10-05 (round 3) — THREE grid areas instead of two, split 60/40 at `md` up.

                CHANGE: 2026-10-05 (round 4) — the sidebar became a RATIO (`3fr / 2fr`), replacing the
                fixed 260px column of round 3. Owner: "i dont want such a long sign in spanning entire
                width, signing using just 40% space on right and remaining 60% space with open positing
                on same for md and above".

                Why the ratio beats a fixed width here, measured across 360-1920px:
                  * A fixed 260px column is only "40%" by coincidence, and only at ONE viewport. At 768px
                    it measured 275px = 40%, but by 1280px it was still 260px while the container grew to
                    1152px — so the sign-in had fallen to 23% and the openings had ballooned to 77%. The
                    owner was being asked to accept a sidebar that was silently shrinking as a share of
                    the page. A ratio holds 60/40 at EVERY `md`+ width by definition.
                  * A fixed sidebar also breaks monotonicity on its own: round 3's 320 -> 360px `xl` step
                    had made the MAIN column SHRINK from 780px to 760px between a 1180px and a 1280px
                    window. `fr` units cannot do that — both tracks scale with the container together, so
                    the openings column grows 413 -> 566 -> 672px and never narrows.
                  * It also gives the sign-in usable room on a desktop, which a 260px column never could:
                    275px at 768px -> 378px at 1024px -> 448px at 1280px. The password field's 44px reveal
                    button and the "Create account" expander were both cramped at 260px.

                `minmax(0, …)` on BOTH tracks, not bare `3fr 2fr`: grid items default to `min-width: auto`,
                so a long unbroken string inside the openings list could push its track past its share and
                overflow the page (the exact class of bug that made the desktop navbar row paint under the
                search bar). `minmax(0, …)` lets a track shrink below its content's min-content width.

                Resulting measurements: ratio 1.50 at every side-by-side width (was 1.65 -> 3.31 and
                drifting); openings 336px @640, 566px @1024, 672px @1280+ (was 428 / 684 / 860 — note
                the desktop openings column is now NARROWER by design, because 60% of a capped container
                is 672px, and the space went to the sign-in where the owner wanted it).

                CHANGE: 2026-10-05 (round 5) — the split starts at `sm` (640px), not `md` (768px).
                Owner reported seeing sign-in ABOVE the openings "at whichever size", then confirmed
                viewing on a desktop. The CSS was correct — the rule is emitted properly inside
                `@media (min-width: 48rem)` — so the viewport was under 768px: a non-maximised window,
                browser zoom, or a docked DevTools panel all shrink the CSS viewport on a large monitor
                without the owner thinking of it as "a small screen". Rather than leave the split gated
                behind a width they were evidently not hitting, the boundary dropped to the widest
                breakpoint where a 40% sign-in column still holds a usable login form:
                  640px -> sign-in 224px, email input 182px, password text room 140px  (tight, usable)
                  768px -> sign-in 275px, email input 233px                              (comfortable)
                Below 640px it stays single-column and full-bleed. At 360px a 40% track is 118px, which
                leaves a 78px email input — the form becomes unusable, so phones keep the stacked
                layout. This is the floor, and it is a usability limit rather than a preference.

                AREA ORDER is DOM order, deliberately. Stacked (below `sm`) the page reads
                title -> sign-in -> openings, which is what the owner asked for ("login page is below
                position and it makes less sense"). CSS `order` would have produced that same visual
                result while DECOUPLING it from the tab/reading order — a WCAG 1.3.2 / 2.4.3 mismatch on
                the stacked layout, exactly where the sign-in is the primary control. Explicit grid
                placement buys the re-layout for free: DOM order is title -> sign-in -> openings
                at every breakpoint.

                NOTE: no `sm:items-start`. Area 2 must STRETCH to its grid area (rows 1-2) so its inner
                sticky wrapper has a tall containing block to travel inside; shrinking it made the card
                scroll away with the page (measured: top 168 -> -119 after a 344px scroll, i.e. not
                pinned at all). Rows 1 and 3 stretching is harmless — their content is top-aligned block
                flow either way. */}
            <div className="grid gap-6 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] sm:gap-x-8 sm:gap-y-6">
              {/* AREA 1 — heading (h1 + intro). Desktop: col 1, row 1. */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="sm:col-start-1 sm:row-start-1"
              >
                <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  Current openings &amp; candidate sign-in
                </h1>
                <p className="mt-2 max-w-2xl text-xs font-semibold leading-relaxed text-slate-500 sm:text-sm">
                  Browse our open roles and apply in a couple of clicks. Create a free candidate account to
                  save your resume for every application.
                </p>
              </div>
              {/* AREA 2 — sign-in / profile. Desktop: col 2, rows 1-2, so its top edge IS the h1's top edge.
                  CHANGE: 2026-10-05 — `id` added so this column is a real landmark: it is the
                  anchor target for `/careers#careers-auth-column` and the scope a test can
                  query without guessing at class names.
                  CHANGE: 2026-10-05 (round 3) — this is the SECOND item in the DOM, so on the stacked
                  layout sign-in sits directly under the title, ahead of the openings. `md:sticky` moved
                  to the inner wrapper (see the grid comment above for the measurement that forced it). */}
              <div
                id="careers-auth-column"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '140ms',
                }}
                className="sm:col-start-2 sm:row-start-1 sm:row-span-2"
              >
                <div className="sm:sticky sm:top-28">
                  {!isAuthReady ? (
                    // CHANGE: 2026-10-06 — Task 3. Skeleton now mirrors the REAL AuthForms card
                    // (title + subtitle, two labelled inputs, teal CTA, "create account" footer)
                    // so the right column does NOT jump ~170px when the form appears. Measured
                    // before: 208px skeleton vs 375-393px form (see careers-loading-test.mjs).
                    // Bars are brand-tinted (#E5F4F4/#DDE9E9 deep-teal for the primary lines,
                    // #F0EDE3 warm like the real input bg #F5F4ED, #B8DEDE for the CTA) — the old
                    // bg-slate-100 bars were the "light blue boxes". Pulse + reduced-motion are
                    // handled globally in globals.css; nothing else changes.
                    <div
                      className="rounded-2xl border border-[#E5F4F4] bg-white p-5 shadow-sm"
                      aria-busy="true"
                    >
                      <div className="mb-5">
                        <div className="h-6 w-28 animate-pulse rounded bg-[#DDE9E9]" />
                        <div className="mt-2 flex flex-col gap-1.5">
                          <div className="h-3 w-full animate-pulse rounded bg-[#E5F4F4]" />
                          <div className="h-3 w-3/5 animate-pulse rounded bg-[#E5F4F4]" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        {[0, 1].map((f) => (
                          <div key={f} className="space-y-1.5">
                            <div className="h-2.5 w-10 animate-pulse rounded bg-[#E5F4F4]" />
                            <div className="h-11 w-full animate-pulse rounded-xl bg-[#F0EDE3]" />
                          </div>
                        ))}
                        <div className="h-11 w-full animate-pulse rounded-xl bg-[#B8DEDE]" />
                      </div>
                      <div className="mt-4 border-t border-[#E5F4F4] pt-4">
                        <div className="h-3 w-2/3 animate-pulse rounded bg-[#E5F4F4]" />
                        <div className="mt-1.5 h-3 w-1/2 animate-pulse rounded bg-[#E5F4F4]" />
                      </div>
                      <span className="sr-only">Checking your session</span>
                    </div>
                  ) : user ? (
                    <div>
                      <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-slate-900">
                        Your account
                      </h2>
                      <IdCard user={user} onLogout={signOut} />
                    </div>
                  ) : (
                    <AuthForms onSuccess={setUser} focusSignal={loginFocusSignal} />
                  )}
                </div>
              </div>
              {/* AREA 3 — the openings themselves. Desktop: col 1, row 2 (under the heading).
                  Always rendered, whatever the auth state — an anonymous visitor must be able to read
                  what is on offer before being asked to sign in. */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '80ms',
                }}
                className="sm:col-start-1 sm:row-start-2"
              >
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 sm:text-base">
                    Open positions
                  </h2>
                  {!loading && jobs.length > 0 && (
                    <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {jobs.length} {jobs.length === 1 ? 'role' : 'roles'}
                    </span>
                  )}
                </div>

                {loading && (
                  <div className="space-y-2.5" aria-busy="true" aria-label="Loading openings">
                    {[0, 1, 2].map((i) => (
                      // CHANGE: 2026-10-06 — Task 3. Each placeholder now mirrors the real
                      // OpeningRow's anatomy (dept chips + title + meta on the left, CTA +
                      // details buttons on the right, flex-col on mobile → lg:flex-row) so the
                      // list does NOT jolt when the real rows arrive. Measured: old flat 92px
                      // boxes vs real rows 171/156/112px at 360/768/1440; the mirror holds
                      // 156/156/108 within the test's ±20px. Brand tints only — no slate-100.
                      <div
                        key={i}
                        className="animate-pulse rounded-2xl border border-[#E5F4F4] bg-white p-4 shadow-sm"
                        style={{ animationDelay: `${i * 120}ms` }}
                        aria-hidden="true"
                      >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex items-center gap-1.5">
                              <div className="h-[18px] w-16 rounded-full bg-[#DDE9E9]" />
                              <div className="h-[18px] w-10 rounded-full bg-[#E5F4F4]" />
                            </div>
                            <div className="h-5 w-3/4 rounded bg-[#DDE9E9]" />
                            <div className="mt-2.5 flex flex-wrap items-center gap-3">
                              <div className="h-3 w-16 rounded bg-[#E5F4F4]" />
                              <div className="h-3 w-14 rounded bg-[#E5F4F4]" />
                              <div className="h-3 w-20 rounded bg-[#E5F4F4]" />
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <div className="h-11 w-28 rounded-full bg-[#B8DEDE] lg:h-10" />
                            <div className="h-11 w-24 rounded-full bg-[#E5F4F4] lg:h-10" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!loading && loadError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50/60 px-4 py-6 text-center">
                    <p className="text-xs font-bold text-red-600">
                      We couldn&apos;t load the openings just now. Please refresh the page to try again.
                    </p>
                  </div>
                )}

                {!loading && !loadError && jobs.length === 0 && (
                  <div className="rounded-2xl border-2 border-dashed border-[#E5F4F4] bg-white/60 px-4 py-12 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#006569]/50">
                      No active openings at the moment.
                    </p>
                    <p className="mt-2 text-xs font-semibold text-slate-500">
                      Create a candidate account on the right and we&apos;ll reach out when the next role opens.
                    </p>
                  </div>
                )}

                {!loading && !loadError && jobs.length > 0 && (
                  <div className="space-y-2.5">
                    {jobs.map((job, index) => (
                      <OpeningRow
                        key={(job as any)._id || job.id}
                        job={job}
                        onApply={handleApply}
                        index={index}
                        canHover={canHover}
                        isAuthenticated={isAuthenticated}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {isAuthenticated ? (
            <QuickApplyModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              job={selectedJob}
              user={user}
            />
          ) : (
            <JobApplicationModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              job={selectedJob}
              user={user}
            />
          )}
        </section>
        );
      }}
    </CareersAuthProvider>
  );
}