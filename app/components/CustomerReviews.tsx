'use client';

import { useState, useEffect, useRef, memo, useMemo } from 'react';
import Image from 'next/image';
import type { Review } from '@/lib/reviews';

// CHANGE: 2026-09-18 — Review type now imported from lib/reviews.ts (was a local
// re-declaration that could drift; _id is optional there, so keys stay safe).
//
// CHANGE: 2026-10-23 — Owner: "sort best 10 and add them", "mention if someone is a CA",
// "multi-direction carousel, smaller cards, all with different messages", "ensure proper fit
// for all widths". The old design (one 320×272 marquee row on desktop + a single huge
// feature card on phones) is replaced:
//   • md+  = TWO compact rows scrolling in OPPOSITE directions (row 1 left, row 2 right).
//   • <md  = a snap-swipe row of the SAME compact cards (264px) + teal pill dots + gentle
//            autoplay that pauses on any interaction (the old one-card-per-viewport card was
//            too large to read comfortably and forced a full-width scroll per review).
//   • the card itself is now 280×200 (was 320×272) and renders a `role` pill (e.g. CA) and
//     stars only when a rating was supplied — imported Google reviews may carry no star count,
//     and inventing one would be fake social proof.
// Cards have no fixed pixel width inside `ReviewCard`; the row wrappers own the width so the
// mobile swipe row and the desktop marquee stay visually identical.

const CARD_GAP = 20; // px — must match `gap-5` on every track/carousel below

function StarRating({ rating, size = 'w-4 h-4' }: { rating: number; size?: string }) {
    return (
        <div className="flex shrink-0 gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    className={`${size} ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'}`}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

const ReviewCard = memo(function ReviewCard({ review }: { review: Review }) {
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
                    {typeof review.rating === 'number' && <StarRating rating={review.rating} size="w-3 h-3" />}
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
    const [activeIdx, setActiveIdx] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    // Mobile swipe autoplay bookkeeping (same rules as before: pause on interaction, resume
    // after 6s, disabled entirely for prefers-reduced-motion).
    const scrollIdx = useRef(0);
    const userPaused = useRef(false);
    const resumeTimer = useRef<number | null>(null);

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

    // Split the list into two balanced rows for the opposite-direction desktop marquee.
    const rows = useMemo(() => {
        if (reviews.length <= 2) return [reviews, [] as Review[]];
        const half = Math.ceil(reviews.length / 2);
        return [reviews.slice(0, half), reviews.slice(half)];
    }, [reviews]);

    const step = () => {
        const el = carouselRef.current;
        const first = el?.firstElementChild as HTMLElement | null;
        return (first?.clientWidth ?? 264) + CARD_GAP;
    };

    const pauseAutoplay = () => {
        userPaused.current = true;
        if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
        resumeTimer.current = window.setTimeout(() => {
            userPaused.current = false;
        }, 6000);
    };

    const handleCarouselScroll = () => {
        const el = carouselRef.current;
        if (!el) return;
        const idx = Math.round(el.scrollLeft / step());
        if (idx !== scrollIdx.current && idx >= 0 && idx < reviews.length) {
            scrollIdx.current = idx;
            setActiveIdx(idx);
        }
    };

    const goTo = (i: number) => {
        const el = carouselRef.current;
        if (!el) return;
        scrollIdx.current = i;
        setActiveIdx(i);
        el.scrollTo({ left: i * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    useEffect(() => {
        const el = carouselRef.current;
        if (!el || !isVisible || reviews.length <= 1 || reduceMotion) return;
        const id = window.setInterval(() => {
            if (userPaused.current) return;
            goTo(scrollIdx.current + 1 >= reviews.length ? 0 : scrollIdx.current + 1);
        }, 6000);
        return () => window.clearInterval(id);
    }, [isVisible, reviews.length, reduceMotion]);

    useEffect(() => {
        return () => {
            if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
        };
    }, []);

    if (loading || reviews.length === 0) return null;

    return (
        <section
            ref={sectionRef}
            className={`w-full overflow-hidden bg-[linear-gradient(90deg,_rgba(249,251,245,1)_0%,_rgba(244,242,234,1)_53%,_rgba(238,236,223,1)_100%)] px-6 py-16 transition-all duration-1000 md:py-20 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="mx-auto max-w-7xl">
                <div className={`flex flex-col items-start transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="relative h-16 w-64 opacity-80">
                        <Image src="/google-reviews.png" alt="Google Reviews" fill className="object-contain object-left" sizes="300px" />
                    </div>
                </div>

                {/* md+ : two compact rows scrolling in opposite directions. A row only animates
                    when it holds enough cards to overflow the viewport (otherwise it would jump). */}
                <div className="hidden md:block">
                    {rows.map((row, rowIdx) =>
                        row.length === 0 ? null : (
                            <div
                                key={rowIdx}
                                className={`relative overflow-hidden ${rowIdx === 0 ? 'mt-2' : 'mt-5'}`}
                                style={MASK}
                            >
                                <div
                                    className="review-track flex w-max gap-5"
                                    style={{
                                        willChange: 'transform',
                                        animation:
                                            isVisible && !reduceMotion && row.length >= 3
                                                ? `marquee ${Math.max(26, row.length * 8)}s linear infinite${rowIdx === 1 ? ' reverse' : ''}`
                                                : 'none',
                                    }}
                                >
                                    {[...row, ...row].map((review, i) => (
                                        <div key={`${review._id ?? review.name}-${i}`} className="w-[280px] shrink-0 xl:w-[300px]">
                                            <ReviewCard review={review} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* sm & below: swipeable row of the same compact cards + dots */}
                <div
                    ref={carouselRef}
                    onScroll={handleCarouselScroll}
                    onPointerDown={pauseAutoplay}
                    onTouchStart={pauseAutoplay}
                    onWheel={pauseAutoplay}
                    onKeyDown={pauseAutoplay}
                    role="region"
                    aria-label="Customer reviews, swipe to browse"
                    tabIndex={0}
                    className="no-scrollbar mt-2 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-1 focus:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#006569]/40 md:hidden"
                >
                    {reviews.map((review) => (
                        <div key={review._id ?? review.name} className="w-[264px] shrink-0 snap-start">
                            <ReviewCard review={review} />
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 md:hidden" role="group" aria-label="Review navigation">
                    {reviews.map((review, i) => (
                        <button
                            key={review._id ?? review.name}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`Go to review ${i + 1}`}
                            aria-current={i === activeIdx}
                            className={`h-2 rounded-full transition-all duration-300 ${i === activeIdx ? 'w-6 bg-[#006569]' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                        />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                /* Inline animation shorthand wins over stylesheets, so pause needs !important. */
                .review-track:hover { animation-play-state: paused !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
            `}</style>
        </section>
    );
};

export default CustomerReviews;
