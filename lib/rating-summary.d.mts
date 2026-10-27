// Hand-written types for lib/rating-summary.mjs (same pattern as lib/email-autoreply.d.mts,
// lib/careers-referral.d.mts, lib/prices-catalog.d.mts): the runtime module stays plain ESM so
// plain `node` can import it in tests, and TypeScript still gets full types without a build step.

export type RatingSummary = { average: number; count: number };

export declare const MIN_RATING: number;
export declare const MAX_RATING: number;

export declare function normalizeRating(value: unknown): number | null;

export declare function summariseRatings(
  reviews: Array<{ rating?: unknown }> | null | undefined
): RatingSummary | null;

export declare function formatRating(summary: RatingSummary | null | undefined): string | null;
