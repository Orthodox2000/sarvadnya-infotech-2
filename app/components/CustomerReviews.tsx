'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Image from 'next/image';

interface Review {
    _id: string;
    name: string;
    rating: number;
    date: string;
    text: string;
}

function StarRating({ rating, size = "w-4 h-4" }: { rating: number, size?: string }) {
    return (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    className={`${size} ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700 fill-slate-700'}`}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

// CHANGE: 2026-09-17 — variant-aware card. 'marquee' = fixed 320px compact card (desktop),
// 'feature' = full-width large card (sm & below) with bigger type + serif quote + quote glyph.
// CHANGE: 2026-09-17 (rev-3) — marquee cards get FIXED identical dimensions (320×272px):
// `h-68` (not min-h) + overflow-hidden + line-clamp so long quotes can never grow a card;
// footer pinned via justify-between + flex-1 body, so all desktop cards are exactly equal.
const ReviewCard = memo(function ReviewCard({ review, variant = 'marquee' }: { review: Review; variant?: 'marquee' | 'feature' }) {
    const feature = variant === 'feature';
    return (
        <div className={`shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full ${feature ? 'w-full p-6 sm:p-8' : 'w-[320px] p-5 justify-between h-68 overflow-hidden'}`}>
            <div className={feature ? '' : 'flex-1'}>
                <div className={`flex justify-between items-start ${feature ? 'mb-4 sm:mb-5' : 'mb-4'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold ${feature ? 'w-11 h-11 sm:w-12 sm:h-12 text-base sm:text-lg' : 'w-8 h-8 text-xs'}`}>
                            {review.name.charAt(0)}
                        </div>
                        <div>
                            <p className={`text-slate-900 font-bold leading-tight ${feature ? 'text-base sm:text-lg' : 'text-[0.8rem]'}`}>{review.name}</p>
                            <p className={`text-slate-400 ${feature ? 'text-xs sm:text-sm' : 'text-[0.65rem]'}`}>{review.date}</p>
                        </div>
                    </div>
                    <StarRating rating={review.rating} size={feature ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-3 h-3'} />
                </div>
                {feature ? (
                    <div className="relative mt-1">
                        <span aria-hidden className="pointer-events-none select-none absolute -top-1 left-0 font-playfair text-[5rem] sm:text-[6rem] leading-none text-[#006569]/10">
                            &ldquo;
                        </span>
                        <p className="relative font-playfair text-[1.05rem] sm:text-xl leading-relaxed text-slate-600 pt-9 sm:pt-10">
                            {review.text}
                        </p>
                    </div>
                ) : (
                    <p className="text-slate-600 leading-relaxed text-sm italic line-clamp-5">
                        &ldquo;{review.text}&rdquo;
                    </p>
                )}
            </div>
            <div className={`mt-6 pt-4 border-t border-slate-50 flex items-center gap-1.5 ${feature ? 'sm:mt-8' : ''}`}>
                <svg className={`text-[#006569] ${feature ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-3.5 h-3.5'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className={`font-black text-slate-300 uppercase tracking-widest ${feature ? 'text-[0.7rem] sm:text-xs' : 'text-[0.6rem]'}`}>Verified Review</span>
            </div>
        </div>
    );
});

const CustomerReviews = ({ initialData }: { initialData?: Review[] }) => {
    const [reviews, setReviews] = useState<Review[]>(initialData || []);
    const [loading, setLoading] = useState(!initialData);
    const [isVisible, setIsVisible] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    // CHANGE: 2026-09-17 — sm-carousel autoplay: track scroll position, pause on user touch,
    // resume after 6s, skip entirely when the visitor prefers reduced motion.
    const scrollIdx = useRef(0);
    const userPaused = useRef(false);
    const resumeTimer = useRef<number | null>(null);
    const reducedMotion = useRef(false);

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
        reducedMotion.current =
            typeof window.matchMedia === 'function'
                ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
                : false;
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

    // CHANGE: 2026-09-17 (rev-3) — glitch-free infinite mobile loop. Scrolling into the duplicated
    // copy is DEBOUNCED: the reset fires only after momentum/smooth scroll settles (120ms of no
    // scroll events), then the position swaps to the identical real card via `% reviews.length`
    // modulo mapping. Wrap to the 1st therefore looks like the very next card — no rapid jump,
    // and multi-card momentum swipes still land on the right real card.
    const loopTimer = useRef<number | null>(null);
    const loopReset = () => {
        const el = carouselRef.current;
        if (!el || el.clientWidth === 0) return;
        const raw = Math.round(el.scrollLeft / el.clientWidth);
        if (raw < reviews.length) return;
        const logical = raw % reviews.length;
        el.scrollTo({ left: logical * el.clientWidth, behavior: 'auto' });
        scrollIdx.current = logical;
        setActiveIdx(logical);
    };
    const handleCarouselScroll = () => {
        const el = carouselRef.current;
        if (!el || el.clientWidth === 0) return;
        const raw = Math.round(el.scrollLeft / el.clientWidth);
        if (raw >= reviews.length) {
            if (loopTimer.current) window.clearTimeout(loopTimer.current);
            loopTimer.current = window.setTimeout(loopReset, 120);
            return;
        }
        if (loopTimer.current) {
            window.clearTimeout(loopTimer.current);
            loopTimer.current = null;
        }
        if (raw !== scrollIdx.current) {
            scrollIdx.current = raw;
            setActiveIdx(raw);
        }
    };

    const pauseAutoplay = () => {
        userPaused.current = true;
        if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
        resumeTimer.current = window.setTimeout(() => {
            userPaused.current = false;
        }, 6000);
    };

    // CHANGE: 2026-09-17 — autoplay only when the section is on-screen, on sm-only carousel.
    // CHANGE: 2026-09-17 (rev-3) — advance FORWARD one card (0..reviews.length) so wrapping past
    // the last review slides into the duplicated first card; the debounced handler then swaps it
    // to the real first card, keeping the loop seamless (last → first reads as the very next).
    useEffect(() => {
        const el = carouselRef.current;
        if (!el || !isVisible || reviews.length <= 1 || reducedMotion.current) return;
        const run = () => {
            if (userPaused.current) return;
            const next = Math.min(scrollIdx.current + 1, reviews.length);
            el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
        };
        const id = window.setInterval(run, 5000);
        return () => window.clearInterval(id);
    }, [isVisible, reviews.length]);

    useEffect(() => {
        return () => {
            if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
            if (loopTimer.current) window.clearTimeout(loopTimer.current);
        };
    }, []);

    if (loading || reviews.length === 0) return null;

    const speed = Math.max(25, reviews.length * 6);

    const goTo = (i: number) => {
        const el = carouselRef.current;
        if (!el) return;
        scrollIdx.current = i;
        el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
    };

    return (
        <section ref={sectionRef} className={`w-full py-16 md:py-20 px-6 overflow-hidden bg-[linear-gradient(90deg,_rgba(249,251,245,1)_0%,_rgba(244,242,234,1)_53%,_rgba(238,236,223,1)_100%)] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-7xl mx-auto">
                <div className={`flex flex-col items-start transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="relative w-64 h-16 opacity-80">
                        <Image src="/google-reviews.png" alt="Google Reviews" fill className="object-contain object-left" sizes="300px" />
                    </div>
                </div>

                {/* Desktop (md+): unchanged infinite marquee */}
                <div className="mt-2 relative overflow-hidden hidden md:block" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)' }}>
                    <div
                        className="flex gap-6"
                        style={{
                            willChange: 'transform',
                            animation: isVisible ? `marquee ${speed}s linear infinite` : 'none',
                        }}
                    >
                        {[...reviews, ...reviews].map((review, i) => (
                            <ReviewCard key={`${review._id}-${i}`} review={review} />
                        ))}
                    </div>
                </div>

                {/* Mobile (sm & below): one large card per viewport, swipe + dots */}
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
                    className="md:hidden mt-2 flex overflow-x-auto snap-x snap-mandatory no-scrollbar focus:outline-none focus:ring-2 focus:ring-[#006569]/40 focus:rounded-2xl"
                >
                    {[...reviews, ...reviews].map((review, i) => (
                        <div key={`${review._id}-${i}`} className="w-full shrink-0 snap-start">
                            <ReviewCard review={review} variant="feature" />
                        </div>
                    ))}
                </div>

                <div className="md:hidden mt-6 flex items-center justify-center gap-2" role="group" aria-label="Review navigation">
                    {reviews.map((review, i) => (
                        <button
                            key={review._id}
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
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
            `}</style>
        </section>
    );
};

export default CustomerReviews;