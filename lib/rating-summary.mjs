// CHANGE: 2026-10-26 — the ONLY permitted source of a displayed rating.
//
// Owner: "remove rating as most of them are fake, we only have testimonials and user rating as
// real, also ensure those dashboard rating and auto moving and not manual."
//
// Every hand-typed star count on the site was removed (4.8/120, 4.7/85, 4.9/34, 4.9/200 ...
// nobody could say where any of them came from, which is exactly the problem). What remains is
// this module: an average computed from the reviews that actually exist, so the number moves by
// itself when a review is added, edited or deleted, and it can never claim more reviews than the
// review wall actually shows.
//
// Pure ESM with no dependencies, on purpose: the same module is imported by the client review
// wall (app/components/CustomerReviews.tsx) AND by a plain `node` test
// (scripts/rating-summary-test.mjs), so there is no second implementation to drift.

/** Lowest accepted star value. */
export const MIN_RATING = 1;
/** Highest accepted star value. */
export const MAX_RATING = 5;

/**
 * Coerce one review's `rating` into a usable star value.
 *
 * Accepts a number or a numeric string (an admin edit or a DB import can leave "5" instead of
 * 5) and returns null for anything that is not a finite 1-5 figure. `null` is the signal for
 * "this review carries no rating", which is a real state: an imported Google review may have no
 * star count, and inventing one would be fake social proof.
 *
 * @param {unknown} value
 * @returns {number | null}
 */
export function normalizeRating(value) {
  const n =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim() !== ''
        ? Number(value)
        : NaN;
  if (!Number.isFinite(n) || n < MIN_RATING || n > MAX_RATING) return null;
  // One decimal is the precision a star display can honestly convey.
  return Math.round(n * 10) / 10;
}

/**
 * Average + count from a list of reviews. Only reviews that carry a valid rating count.
 *
 * Returns null when nothing rateable exists — callers must render NOTHING in that case rather
 * than fall back to a default number.
 *
 * @param {Array<{ rating?: unknown }> | null | undefined} reviews
 * @returns {{ average: number, count: number } | null}
 */
export function summariseRatings(reviews) {
  const list = Array.isArray(reviews) ? reviews : [];
  let total = 0;
  let count = 0;
  for (const review of list) {
    const rating = normalizeRating(review && review.rating);
    if (rating === null) continue;
    total += rating;
    count += 1;
  }
  if (count === 0) return null;
  return { average: Math.round((total / count) * 10) / 10, count };
}

/**
 * One-decimal string for display, e.g. "4.8". Null in, null out, so a caller can
 * `{formatRating(summary) && <span>...}` without special-casing.
 *
 * @param {{ average: number, count: number } | null | undefined} summary
 * @returns {string | null}
 */
export function formatRating(summary) {
  if (!summary || !Number.isFinite(summary.average)) return null;
  return summary.average.toFixed(1);
}
