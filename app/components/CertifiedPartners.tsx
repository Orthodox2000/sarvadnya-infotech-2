'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Partner } from "@/lib/partners";
import { fetchWithCache } from "@/lib/client-api";

// CHANGE: 2026-09-16 — redesigned the flat logo-card row into a network graph.
// CHANGE: 2026-09-17 rev-3/4/5 — X-format then "blend with background" polish then
// "presentation" V-funnel desktop layout.
//
// CHANGE: 2026-09-17 rev-6 — Back to ORIGINAL row structure & sizing per owner (see rev-6
// note above): all 5 logos in ONE straight line, original card styling/sizes, TallyPrime
// container one size step larger (acts as the center hub). Colored connectors kept.
//
// CHANGE: 2026-09-17 rev-7 — Under-loop wiring + raised hub per owner:
//   * TallyPrime now sits slightly UPPER than the four brand cards (HUB_Y 42 vs BRAND_Y 52)
//     — same proportions at every breakpoint (percentage anchored).
//   * Connectors no longer run straight between cards: each brand card's line starts at its
//     bottom (BRAND_Y + BOTTOM_OFFSET 42), dips to the stage bottom (LOOP_Y 100) and loops
//     back UP to TallyPrime's bottom (HUB_Y + BOTTOM_OFFSET) — a U-shape under the row.
//   * createLoopPath() replaces createCurvedPath(); everything is viewBox-percentage based
//     so the loop reads identically across all devices and stage widths.
//
// CHANGE: 2026-09-17 rev-8 — Semicircular bottom loop per owner:
//   connector now runs from the bottom-MIDDLE of each card's image, drops straight down to the
//   bottom rail, sweeps a rounded SEMICIRCLE at the bottom, and rises to the bottom-MIDDLE of
//   TallyPrime's card. Cubic bezier `M sx sy C sx LOOP_Y ex LOOP_Y ex ey` makes the bottom a
//   smooth rounded bend instead of the previous shallow quadratic dip.
//
// CHANGE: 2026-09-17 rev-9 — Deep elliptical under-loop + mobile 2-1-2 star:
//   * Desktop: loop is now DEEP and ELIPTICAL — the sweep control points sit AT/BELOW the
//     stage bottom (LOOP_DEPTH 118; SVG gets overflow-visible so the arc is never clipped),
//     spreadsheet horizontally (0.30 factor) so the bottom is a rounded ellipse, not a flat
//     rail: `M sx sy C sx+30%+118 ex-30%+118 ex ey`.
//   * Mobile (sm 640px / below): the 5-in-a-line does NOT fit, so partners render as a
//     clean 2-1-2 STACK — 2 brand cards top row, TallyPrime CENTRAL and VISIBLY LARGER
//     (w-20 h-16 vs w-12 h-10), 2 brand cards bottom row. Connectors run as curved star
//     links hub->each card (connectPath quadratic, bows outward). Cards keep a SQUARISH
//     slightly-rounded corner (`rounded-md`) on mobile vs the original `rounded-2xl` above md.
//
// CHANGE: 2026-09-17 rev-10 — scale-up + tighten pass per owner:
//   * mobile 2-1-2 icons enlarged (brand w-12→w-16 / sm:w-20, hub w-20→88px / sm:w-28;
//     star slots nudged to x 24/76 so the bigger cards still clear at 360px) and the
//     desktop elliptical sweep deepened (LOOP_DEPTH 118→128, apex ≈ 118.3).
//   * section bottom tightening: py-16/py-20 → py-10/py-14, mobile stage h-40 h-48 →
//     h-36 h-44 (deep desktop dips still fit inside the reduced padding).
//   * HomeHero QuickAccess cards: mobile icon w-9→w-11, controlled icon→title gap on
//     the lg:block layout via lg:mt-2.
//
// CHANGE: 2026-09-17 rev-12 (CURRENT) — mobile equal-size + scale-up per owner:
//   * ALL five mobile cards are now the SAME size — TallyPrime (hub) is no longer larger;
//     every card is w-24 h-[72px] (96×72) base / sm:w-32 sm:h-24 (128×96). Brands grow from
//     72×56, so the whole star reads bigger and uniform.
//   * Star slots nudged outward to x 18/82 so the wider (now equal) cards clear the hub at
//     360px (3.84px side gaps) and stage height raised h-36/h-44 → h-48/sm:h-64 to fit the
//     taller cards (2.4px top/bottom margin at 360px). Desktop layout untouched.
//
// CHANGE: 2026-09-17 rev-11 — bigger mobile icons + animation stability per owner:
//   * Mobile 2-1-2 cards enlarged (brand w-[72px] h-[56px] / sm:w-24 sm:h-16, hub
//     w-24 h-[72px] / sm:w-32 sm:h-24; slots nudged to x 22/78, bottom row to y 80) — logos
//     now fill ~60px+ of card width. Verified fit at 360px (3.4px side gap) + sm (54px).
//   * The mobile layout is now fully STATIC (no :hover lift, no mouse handlers, no dim/ring,
//     connectors no longer read hovered) — the entrance transition runs exactly once and
//     stops; nothing can retrigger up-down/scale jitter on touch.
//   * Desktop hover is hard-guarded behind `matchMedia('(hover:hover) and (pointer:fine)')`
//     (`canHover`), so stylus/touch devices can never drive the hovered state and cause
//     sticky-hover races. Only true fine-pointers get hover feedback.

const HUB_ID = 'TallyPrime';

const BRAND_STROKES: Record<string, { stroke: string; ringClass: string }> = {
  'Biz Analyst': { stroke: '#38bdf8', ringClass: 'ring-sky-400/40' },
  'OTU':         { stroke: '#f59e0b', ringClass: 'ring-amber-400/50' },
  'AWS':         { stroke: '#f97316', ringClass: 'ring-orange-400/40' },
  'NoSky':       { stroke: '#0f172a', ringClass: 'ring-slate-900/30' },
};

const strokeFor = (name: string) =>
  BRAND_STROKES[name] ?? { stroke: BRAND_STROKES['NoSky'].stroke, ringClass: BRAND_STROKES['NoSky'].ringClass };

// --- Position --------------------------------------------------------------
// ALL partners (incl. TallyPrime) evenly spread on ONE horizontal line.
// TallyPrime (the hub) sits slightly UPPER than the four brand cards, so the
// connector lines can loop under the row — from each card's bottom down and
// around to TallyPrime's bottom (under-wiring / U-loop).
const BRAND_Y = 52;       // brand cards centerline (lower)
const HUB_Y = 42;         // TallyPrime centerline (slightly higher than the rest)
const BOTTOM_OFFSET = 42;  // % of stage height — where the loop anchors under each card
const LOOP_DEPTH = 128;    // deep control-point for a prominent elliptical sweep (below stage
                           // bottom — the SVG uses overflow-visible so the loop stays round)
const LOOP_TUCK = 0.30;    // horizontal spread of the elliptical under-loop control points

// Mobile 2-1-2 star slots (sm and below): TallyPrime central, brands on the corners.
// rev-12 — slots splayed outward (x 18/82) so five EQUAL-size cards (96×72 / sm 128×96)
// fit around the hub with ~3.8px side gaps at 360px.
const MOBILE_HUB = { x: 50, y: 50 };
const MOBILE_SLOTS: Array<{ x: number; y: number }> = [
  { x: 18, y: 20 },   // top-left — AWS
  { x: 82, y: 20 },   // top-right — Biz Analyst
  { x: 18, y: 80 },   // bottom-left — OTU
  { x: 82, y: 80 },   // bottom-right — NoSky
];

function linePos(index: number, count: number, y: number): { x: number; y: number } {
  const t = count <= 1 ? 0 : index / (count - 1);
  return { x: 10 + t * 80, y };
}

// Desktop elliptical under-loop: a card's bottom-middle drops into a DEEP rounded sweep
// (control points at LOOP_DEPTH, horizontally tucked toward the destination so the bottom
// reads as an ellipse) and rises back up to TallyPrime's bottom-middle.
const createLoopPath = (sx: number, sy: number, ex: number, ey: number) =>
  `M ${sx} ${sy} C ${sx + (ex - sx) * LOOP_TUCK} ${LOOP_DEPTH} ${ex - (ex - sx) * LOOP_TUCK} ${LOOP_DEPTH} ${ex} ${ey}`;

// Mobile star link: hub center -> brand card center with a soft outward bow (quadratic).
const connectPath = (cx: number, cy: number, ex: number, ey: number) => {
  const dx = ex - cx;
  const dy = ey - cy;
  return `M ${cx} ${cy} Q ${cx + dx / 2 - dy * 0.16} ${cy + dy / 2 + dx * 0.16} ${ex} ${ey}`;
};

const CertifiedPartners = ({ initialData }: { initialData?: Partner[] }) => {
    const [partners, setPartners] = useState<Partner[]>(initialData || []);
    const [loading, setLoading] = useState(!initialData);
    const [isVisible, setIsVisible] = useState(false);
    const [hovered, setHovered] = useState<string | null>(null);
    // Only fine-pointers may drive the hovered state. Touch/stylus devices otherwise get a
    // sticky-hover state race (cards jumping up/down + scale until one is tapped), so the
    // handlers below are inert unless the primary pointer can actually hover.
    const canHover = useRef(false);

    useEffect(() => {
        const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
        canHover.current = mq.matches;
        const onChange = (e: MediaQueryListEvent) => { canHover.current = e.matches; };
        mq.addEventListener?.('change', onChange);
        return () => mq.removeEventListener?.('change', onChange);
    }, []);

    const enterHover = (name: string) => { if (canHover.current) setHovered(name); };
    const leaveHover = () => setHovered(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
            { threshold: 0.1 }
        );
        const section = document.getElementById('partners-section');
        if (section) observer.observe(section);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (initialData) return;
        const fetchPartners = async () => {
            try {
                const data = await fetchWithCache('/api/partners?type=brand');
                if (Array.isArray(data)) setPartners(data);
            } catch (err) { console.error('Failed to fetch partners:', err); }
            finally { setLoading(false); }
        };
        fetchPartners();
    }, [initialData]);

    if (loading) return (
        <div className="w-full py-10 md:py-14 flex items-center justify-center">
            <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-32 h-20 bg-white rounded-md md:rounded-2xl animate-pulse border border-[#E9F1FA]" />
                ))}
            </div>
        </div>
    );

    if (partners.length === 0) return null;

    const hubIndex = partners.findIndex(p => p.name === HUB_ID);
    const nodePos = (i: number, y: number) => linePos(i, partners.length, y);

    return (
        <section
            id="partners-section"
            className="w-full py-10 md:py-14 bg-[linear-gradient(90deg,_rgba(249,251,245,1)_0%,_rgba(244,242,234,1)_53%,_rgba(238,236,223,1)_100%)]  overflow-hidden"
        >
            <div className={`max-w-7xl mx-auto px-6 mb-12 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#006569] mb-3">Our Global Network</p>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900">Certified Industry Partners</h2>
            </div>

            <div className="mx-auto max-w-7xl px-6">
                {/* ---------------- MOBILE 2-1-2 STAR (sm 640px and below) ————————-
                    TallyPrime central, 2 brands top row, 2 brands bottom row.
                    rev-12 — ALL FIVE cards are the same size (96×72 / sm 128×96), enlarged
                    30%+ vs the old 72×56 brands; cards are SQUARISH (rounded-md) chips. */}
                <div className="relative md:hidden w-full h-48 sm:h-64">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none"
                         className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        {/* Mobile is touch-first — connectors are STATIC: no hovered-state
                            dependency, so there is zero re-render/animation churn. */}
                        {hubIndex >= 0 && partners.map((partner, index) => {
                            if (index === hubIndex) return null;
                            const card = MOBILE_SLOTS[index < hubIndex ? index : index - 1];
                            const { stroke } = strokeFor(partner.name);
                            const d = connectPath(MOBILE_HUB.x, MOBILE_HUB.y, card.x, card.y);
                            return (
                                <g key={`mc-${partner.name}`}>
                                    <path d={d} fill="none" stroke={stroke}
                                          strokeWidth="0.12" opacity="0.22" />
                                    <path d={d} fill="none" stroke={stroke}
                                          strokeWidth="0.25" strokeLinecap="round"
                                          strokeDasharray="1 3" className="connect-flow"
                                          opacity="1" style={{ animationDuration: '2.2s' }} />
                                </g>
                            );
                        })}
                    </svg>

                    {partners.map((partner, index) => {
                        const isHub = index === hubIndex;
                        const node = isHub ? MOBILE_HUB : MOBILE_SLOTS[index < hubIndex ? index : index - 1];
                        return (
                            <div key={`m-${partner._id || partner.name}`}
                                 className="absolute z-10 origin-center will-change-transform"
                                 style={{ top: `${node.y}%`, left: `${node.x}%`,
                                          transform: 'translate(-50%, -50%)',
                                          transitionDelay: `${index * 60}ms` }}>
                                {/* Static on touch: entrance animation runs ONCE (driven only by
                                    isVisible) — no mouse handlers, no :hover up/down, no dimming.
                                    This removes the sticky-hover / state race entirely. */}
                                <div className={`transition-all duration-700
                                        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}>
                                    <div className="w-24 h-[72px] sm:w-32 sm:h-24 bg-white rounded-md border border-[#E9F1FA] shadow-sm flex flex-col items-center justify-center p-1.5 sm:p-2">
                                        <div className="relative w-full flex-1 min-h-0">
                                            <Image src={partner.imageUrl} alt={partner.name} fill
                                                   className="object-contain"
                                                   sizes="(max-width: 639px) 96px, 128px"
                                                   priority={index < 5} />
                                        </div>
                                        <span className="mt-0.5 text-[8px] sm:text-[10px] font-bold text-slate-600 text-center leading-tight truncate max-w-full">
                                            {partner.name}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#006569]/0 via-[#006569]/5 to-[#006569]/0 opacity-0 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ---------------- DESKTOP SINGLE-ROW + ELLIPTICAL UNDER-LOOP (md+) ————————-
                    All 5 partners on one line, TallyPrime slightly raised & one size larger;
                    deep elliptical overflow-visible loops under the row. */}
                <div className="relative hidden md:block w-full h-24 lg:h-32 xl:h-36">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none"
                         className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                        {hubIndex >= 0 && partners.map((partner, index) => {
                            if (index === hubIndex) return null;
                            const hub = nodePos(hubIndex, HUB_Y);
                            const node = nodePos(index, BRAND_Y);
                            const isH = hovered === partner.name;
                            const anyH = hovered !== null;
                            const { stroke } = strokeFor(partner.name);
                            const d = createLoopPath(node.x, BRAND_Y + BOTTOM_OFFSET, hub.x, HUB_Y + BOTTOM_OFFSET);
                            return (
                                <g key={`c-${partner.name}`} style={{ transition: 'opacity 0.4s ease' }}>
                                    <path d={d}
                                          fill="none" stroke={stroke}
                                          strokeWidth={isH ? "0.35" : "0.12"}
                                          className="transition-all duration-300"
                                          opacity={anyH && !isH ? 0.12 : isH ? 0.35 : 0.22} />
                                    <path d={d}
                                          fill="none" stroke={stroke}
                                          strokeWidth={isH ? "0.45" : "0.25"}
                                          strokeLinecap="round" strokeDasharray="1 3"
                                          className="connect-flow"
                                          opacity={anyH && !isH ? 0.5 : 1}
                                          style={{ animationDuration: isH ? '0.9s' : '2.2s' }} />
                                </g>
                            );
                        })}
                    </svg>

                    {partners.map((partner, index) => {
                        const isHub = index === hubIndex;
                        const node = nodePos(index, isHub ? HUB_Y : BRAND_Y);
                        const isH = hovered === partner.name;
                        const anyH = hovered !== null;
                        const { ringClass } = strokeFor(partner.name);
                        const sizeClass = isHub
                            ? 'w-32 h-24 lg:w-48 lg:h-32 xl:w-56 xl:h-36'
                            : 'w-28 h-20 lg:w-40 lg:h-28 xl:w-48 xl:h-32';
                        return (
                            <div key={partner._id || partner.name}
                                 className="absolute z-10 origin-center will-change-transform"
                                 style={{ top: `${node.y}%`, left: `${node.x}%`,
                                          transform: 'translate(-50%, -50%)',
                                          transitionDelay: `${index * 80}ms` }}>
                                <div className={`group relative cursor-pointer transition-all duration-700 hover:-translate-y-2
                                        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 translate-y-6 scale-95'}
                                        ${anyH && !isH ? 'opacity-50 scale-95' : ''}`}
                                     onMouseEnter={() => enterHover(partner.name)}
                                     onMouseLeave={leaveHover}>
                                    <div className={`${sizeClass} bg-white rounded-2xl border border-[#E9F1FA] shadow-sm flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 transition-all duration-700 hover:shadow-xl hover:border-[#006569]/20
                                        ${isH ? `border-transparent ring-2 ring-offset-2 ${ringClass}` : ''}`}>
                                        <div className="relative w-full flex-1 min-h-0 transition-all duration-500 group-hover:scale-110">
                                            <Image src={partner.imageUrl} alt={partner.name} fill
                                                   className="object-contain"
                                                   sizes="(max-width: 1023px) 104px, 176px"
                                                   priority={index < 5} />
                                        </div>
                                        <span className={`mt-1 sm:mt-2 text-[7px] sm:text-[9px] md:text-[10px] lg:text-[11px] xl:text-xs font-bold text-slate-600 group-hover:text-[#006569] transition-colors text-center leading-tight truncate max-w-full ${isH ? 'text-[#006569]' : ''}`}>
                                            {partner.name}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#006569]/0 via-[#006569]/5 to-[#006569]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CertifiedPartners;