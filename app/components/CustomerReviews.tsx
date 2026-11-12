'use client';

import { useState, useEffect, useRef, memo, useMemo } from 'react';
import Image from 'next/image';
import type { Review } from '@/lib/reviews';
// CHANGE: 2026-10-26 — The review wall is now the ONLY place a rating is shown, and it is
// computed from the reviews that actually exist (lib/rating-summary.mjs). Everything that used
// to carry a hand-typed star count (product sidebars, product JSON-LD, /contact) was removed.
import { formatRating, normalizeRating, summariseRatings } from '@/lib/rating-summary.mjs';

// CHANGE: 2026-09-18 — Review type now imported from lib/reviews.ts (was a local
// re-declaration that could drift; _id is optional there, so keys stay safe).
//
// CHANGE: 2026-10-23 — Owner: "sort best 10 and add them", "mention if someone is a CA",
// "multi-direction carousel, smaller cards, all with different messages", "ensure proper fit
// for all widths". The old design (one 320×272 marquee row on desktop + a single huge
// feature card on phones) was replaced by two compact rows (card is now 280×200) carrying a
// `role` pill (e.g. CA) and stars only when a rating was supplied — imported Google reviews
// may carry no star count, and inventing one would be fake social proof.
//
// CHANGE: 2026-11-12 — Owner: "2 rows, moving from left to right slowly and consistent on all
// sizes, you can just repeat the same ones". So:
//   • the mobile-only snap-swipe carousel, its autoplay and its dot pills are gone — every
//     breakpoint now shows the SAME two marquee rows;
//   • both rows travel left -> right (previously only row 2 was reversed);
//   • each row repeats its own cards enough times that half of the doubled track is wider than
//     the widest possible window (the rows live inside `max-w-7xl`). That is what makes the
//     -50% loop seamless instead of leaving a gap on a wide screen;
//   • duration comes from the card count in the loop, so the px/second speed is the same on a
//     360px phone and a 1280px desktop.
// Cards have no fixed pixel width inside `ReviewCard`; the row wrappers own the width.

const CARD_GAP = 20; // px — must match `gap-5` on every track below
// Marquee geometry. Rows sit inside `max-w-7xl` (1280px), so half a track only has to beat
// 1280px for the loop to be seamless — 1600px leaves margin without bloating the DOM.
const LOOP_MIN_HALF_PX = 1600;
const CARD_WIDTH = 300; // widest card (`xl:w-[300px]`) — only used to size the loop
const CARD_SECONDS = 8; // slow: one card slides past roughly every 8s, at every breakpoint

/** Repeat a row until half of the doubled track is wider than the widest window. */
function buildLoop(row: Review[]): Review[] {
    if (row.length === 0) return [];
    const copies = Math.max(2, Math.ceil(LOOP_MIN_HALF_PX / (row.length * (CARD_WIDTH + CARD_GAP))));
    const loop: Review[] = [];
    for (let i = 0; i < copies; i += 1) loop.push(...row);
    return loop;
}

// CHANGE: 2026-10-26 — star graphics can now show a PARTIAL star, because the header average
// is computed from real reviews and lands on values like 4.5 or 4.3. Rounding that up to five
// full stars would overstate the reviews, which is the exact problem being fixed. Two stacked
// rows (grey behind, gold clipped to `rating / 5`) render the fraction without extra assets.
const STAR_PATH =
    'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';

function StarRow({ size, color }: { size: string; color: string }) {
    return (
        <div className={`flex gap-0.5 ${color}`}>
            {[...Array(5)].map((_, i) => (
                <svg key={i} className={size} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d={STAR_PATH} />
                </svg>
            ))}
        </div>
    );
}

function StarRating({ rating, size = 'w-4 h-4' }: { rating: number; size?: string }) {
    const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
    return (
        <div className="relative shrink-0" role="img" aria-label={`${rating} out of 5 stars`}>
            <StarRow size={size} color="text-slate-200 fill-slate-200" />
            <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pct}%` }}>
                <StarRow size={size} color="text-yellow-400 fill-yellow-400" />
            </div>
        </div>
    );
}

const ReviewCard = memo(function ReviewCard({ review }: { review: Review }) {
    // One rule for "does this review carry a usable star value" — the same normaliser the
    // header average uses, so a card can never show stars the average ignores (or vice versa).
    const rating = normalizeRating(review.rating);
    return (
        <article className="flex h-[200px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div>
                <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E5F4F4] text-xs font-bold text-[#045A57]">
                            {review.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <p className="truncate text-[0.8rem] font-bold leading-tight text-slate-900">{review.name}</p>
                                {/* CHANGE: 2026-10-23 — role pill (owner: "mention if someone is a CA"). */}
                                {review.role && (
                                    <span className="shrink-0 rounded-full border border-teal-100 bg-teal-50 px-1.5 py-0.5 text-[0.55rem] font-black uppercase tracking-wider text-[#045A57]">
                                        {review.role}
                                    </span>
                                )}
                            </div>
                            <p className="truncate text-[0.65rem] text-slate-400">{review.date}</p>
                        </div>
                    </div>
                    {/* Stars only when a rating exists — never invent one for an imported review. */}
                    {rating !== null && <StarRating rating={rating} size="w-3 h-3" />}
                </div>
                <p className="line-clamp-4 text-[0.8rem] italic leading-relaxed text-slate-600">
                    &ldquo;{review.text}&rdquo;
                </p>
            </div>
            <div className="mt-2 flex items-center gap-1.5 border-t border-slate-50 pt-2.5">
                <svg className="h-3.5 w-3.5 text-[#006569]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[0.55rem] font-black uppercase tracking-widest text-slate-300">Verified Review</span>
            </div>
        </article>
    );
});

const MASK = {
    maskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
};

const CustomerReviews = ({ initialData }: { initialData?: Review[] }) => {
    const [reviews, setReviews] = useState<Review[]>(initialData || []);
    const [loading, setLoading] = useState(!initialData);
    const [isVisible, setIsVisible] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (initialData) return;
        const fetchReviews = async () => {
            try {
                const response = await fetch('/api/reviews');
                const data = await response.json();
                if (data && !data.error) {
                    setReviews(data);
                }
            } catch (err) {
                console.error('Error fetching reviews:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [initialData]);

    useEffect(() => {
        setReduceMotion(
            typeof window.matchMedia === 'function'
                ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
                : false
        );
    }, []);

    useEffect(() => {
        if (loading || reviews.length === 0) return;
        const currentRef = sectionRef.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.05 }
        );
        if (currentRef) observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [loading, reviews.length]);

    // Split the list into two balanced rows. Each row is then repeated by `buildLoop` so the
    // marquee can wrap without a gap, whatever the screen width.
    const rows = useMemo(() => {
        if (reviews.length <= 1) return [reviews, [] as Review[]];
        const half = Math.ceil(reviews.length / 2);
        return [reviews.slice(0, half), reviews.slice(half)];
    }, [reviews]);

    const loops = useMemo(() => rows.map(buildLoop), [rows]);

    // CHANGE: 2026-10-26 — Auto-computed, never typed by hand: the header average is derived
    // from the live review list, so adding/editing/removing a review moves it automatically and
    // it can never claim more reviews than the wall actually shows. `null` -> render nothing.
    const ratingSummary = useMemo(() => summariseRatings(reviews), [reviews]);
    const ratingText = formatRating(ratingSummary);

    if (loading || reviews.length === 0) return null;

    return (
        <section
            ref={sectionRef}
            className={`w-full overflow-hidden bg-[linear-gradient(90deg,_rgba(249,251,245,1)_0%,_rgba(244,242,234,1)_53%,_rgba(238,236,223,1)_100%)] px-6 py-16 transition-all duration-1000 md:py-20 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="mx-auto max-w-7xl">
                <div className={`flex flex-wrap items-end justify-between gap-4 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="relative h-16 w-64 opacity-80">
                        <Image src="/google-reviews.png" alt="Google Reviews" fill className="object-contain object-left" sizes="300px" />
                    </div>
                    {/* CHANGE: 2026-10-26 — the site's only displayed rating, and it is calculated
                        from real reviews (replaces every hand-typed star count). Renders nothing
                        when no review carries a rating, rather than falling back to a number. */}
                    {ratingSummary && ratingText && (
                        <div
                            className="flex items-center gap-2.5 pb-1"
                            aria-label={`${ratingText} out of 5 stars from ${ratingSummary.count} ${ratingSummary.count === 1 ? 'review' : 'reviews'}`}
                        >
                            <span className="text-2xl font-black leading-none text-[#006569]">{ratingText}</span>
                            <div>
                                <StarRating rating={ratingSummary.average} size="w-3.5 h-3.5" />
                                <p className="mt-1 text-[0.65rem] font-semibold text-slate-500">
                                    from {ratingSummary.count} {ratingSummary.count === 1 ? 'review' : 'reviews'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Two rows, every breakpoint, both travelling left -> right at the same slow
                    speed. Each row renders its loop twice (`loop` + `loop`) and slides by exactly
                    -50%, so the wrap is seamless; the second copy is aria-hidden so the repeated
                    cards are not announced again by a screen reader. */}
                <div className="mt-2 space-y-5">
                    {loops.map((loop, rowIdx) =>
                        loop.length === 0 ? null : (
                            <div
                                key={rowIdx}
                                className="relative overflow-hidden"
                                style={MASK}
                            >
                                <div
                                    className="review-track flex w-max gap-5"
                                    style={{
                                        willChange: 'transform',
                                        animation: isVisible && !reduceMotion
                                            ? `review-marquee-ltr ${loop.length * CARD_SECONDS}s linear infinite`
                                            : 'none',
                                    }}
                                >
                                    {[...loop, ...loop].map((review, i) => (
                                        <div
                                            key={`${rowIdx}-${review._id ?? review.name}-${i}`}
                                            className="w-[264px] shrink-0 sm:w-[280px] xl:w-[300px]"
                                            aria-hidden={i >= loop.length ? true : undefined}
                                        >
                                            <ReviewCard review={review} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            <style>{`
                /* The track holds the loop twice, so one period is half of it PLUS half a gap
                   (a flex track of 2N cards only has 2N-1 gaps). Without the extra half-gap the
                   row would jump 10px at every wrap. */
                @keyframes review-marquee-ltr {
                    0% { transform: translateX(calc(-50% - ${CARD_GAP / 2}px)); }
                    100% { transform: translateX(0); }
                }
                /* Inline animation shorthand wins over stylesheets, so pause needs !important. */
                .review-track:hover { animation-play-state: paused !important; }
            `}</style>
        </section>
    );
};

export default CustomerReviews;
