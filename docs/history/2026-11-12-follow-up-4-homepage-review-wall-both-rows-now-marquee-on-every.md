# 2026-11-12 (follow-up 4) — Homepage review wall: both rows now marquee on every screen size

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"2 rows, i want them moving from left to right slowly and consistent on all sizes, you can just repeat same ones"*. |
| **Change** | `app/components/CustomerReviews.tsx`: the `<md`-only snap-swipe carousel, its 6s autoplay, its dot pills, `activeIdx`/`carouselRef`/`scrollIdx`/`userPaused`/`resumeTimer` and the whole `step`/`goTo`/`pauseAutoplay` block are **deleted**. Every breakpoint now renders the same **two marquee rows**. |
| **Direction** | Both rows travel **left → right** (new `@keyframes review-marquee-ltr`, `-50% → 0`). Previously row 1 went left and row 2 was `animation-direction: reverse`. |
| **"Repeat the same ones"** | New `buildLoop(row)` repeats each row until **half** of the doubled track exceeds `LOOP_MIN_HALF_PX = 1600` (the rows live inside `max-w-7xl` = 1280px, so that margin guarantees no gap on the widest layout). Rows are then rendered `[...loop, ...loop]` and slid by one period, so the wrap is seamless. 5 reviews → 3 + 2 cards → tracks of 6 + 6 cards per half, i.e. 24 card nodes total. |
| **Seamless maths** | A flex track of 2N cards only has 2N−1 gaps, so a plain `translateX(-50%)` overshoots one period by half a gap and jumps 10px each cycle. The keyframe is `calc(-50% - ${CARD_GAP / 2}px)`; `CARD_GAP` is still 20 and must stay in sync with `gap-5`. |
| **Speed** | `CARD_SECONDS = 8` → duration = `loop.length × 8s` (≈48s per cycle), which keeps the **px/second identical** at 360px and 1280px instead of the old `row.length × 8s`. Hover still pauses (`animation-play-state: paused !important`); `prefers-reduced-motion` still disables the animation entirely; `IntersectionObserver` still gates it off-screen. |
| **Card widths** | `w-[264px] sm:w-[280px] xl:w-[300px]` — 264px is the old mobile width, so a card still clears a 320px viewport with the section's `px-6`. |
| **A11y** | The duplicated half of each track is `aria-hidden`, so the repeated cards are not announced twice. |
| **Not done** | No browser pass (owner working mode: no iterative build/verify). Speed is the arithmetic above; flip the keyframe to `0 → -50%` if the owner wants the rows travelling the other way. |
