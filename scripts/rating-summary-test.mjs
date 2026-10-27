// CHANGE: 2026-10-26 — regression suite for lib/rating-summary.mjs, the ONLY permitted source
// of a rating displayed on the site.
//
// WHY: every star count used to be typed by hand (4.8/120, 4.7/85, 4.9/34 ...) with no review
// records behind it. Owner: "remove rating as most of them are fake, we only have testimonials
// and user rating as real, also ensure those dashboard rating and auto moving and not manual."
// The replacement must be (a) computed from the actual review list, (b) impossible to fake by a
// stray string, and (c) render NOTHING when there is nothing rateable - never a default number.
//
// Zero deps; imports the same ESM module the client review wall imports, so there is no second
// implementation to drift.
import {
  MIN_RATING,
  MAX_RATING,
  normalizeRating,
  summariseRatings,
  formatRating,
} from '../lib/rating-summary.mjs';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ${name} ... PASS`);
    passed++;
  } catch (err) {
    console.log(`  ${name} ... FAIL - ${err.message}`);
    failed++;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function eq(actual, expected, msg) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`${msg || 'mismatch'} - expected ${e}, got ${a}`);
}

// ── normalizeRating ───────────────────────────────────────────────────────────────────────

test('bounds are 1 and 5', () => {
  eq(MIN_RATING, 1);
  eq(MAX_RATING, 5);
});

test('numbers inside 1-5 pass through', () => {
  eq(normalizeRating(1), 1);
  eq(normalizeRating(4), 4);
  eq(normalizeRating(5), 5);
});

test('numeric strings are coerced (an admin edit can save "5")', () => {
  eq(normalizeRating('5'), 5);
  eq(normalizeRating(' 4 '), 4);
  eq(normalizeRating('3.0'), 3);
});

test('one-decimal precision, half-up', () => {
  eq(normalizeRating(4.44), 4.4);
  eq(normalizeRating(4.45), 4.5);
  eq(normalizeRating(4.46), 4.5);
});

test('out-of-range values are rejected, not clamped', () => {
  // Clamping would let a bad import quietly become a 5-star review.
  eq(normalizeRating(0), null);
  eq(normalizeRating(-1), null);
  eq(normalizeRating(6), null);
  eq(normalizeRating(100), null);
});

test('non-rating values are rejected', () => {
  eq(normalizeRating(undefined), null);
  eq(normalizeRating(null), null);
  eq(normalizeRating(''), null);
  eq(normalizeRating('   '), null);
  eq(normalizeRating('five'), null);
  eq(normalizeRating(NaN), null);
  eq(normalizeRating(Infinity), null);
  eq(normalizeRating(true), null);
  eq(normalizeRating({}), null);
  eq(normalizeRating([]), null);
});

// ── summariseRatings ─────────────────────────────────────────────────────────────────────

test('average + count over rated reviews only', () => {
  // The google_reviews.png wall mixes rated and unrated reviews; an unrated one must not count
  // as a zero and drag the average down.
  const reviews = [{ rating: 5 }, { rating: 4 }, { rating: undefined }, { text: 'no rating' }];
  eq(summariseRatings(reviews), { average: 4.5, count: 2 });
});

test('all-five list gives exactly 5.0', () => {
  eq(summariseRatings([{ rating: 5 }, { rating: 5 }, { rating: 5 }, { rating: 5 }]), {
    average: 5,
    count: 4,
  });
});

test('rounds to one decimal', () => {
  // 5 + 4 + 4 = 13 / 3 = 4.333... -> 4.3
  eq(summariseRatings([{ rating: 5 }, { rating: 4 }, { rating: 4 }]), { average: 4.3, count: 3 });
});

test('moves when a review is added (never a fixed number)', () => {
  const before = summariseRatings([{ rating: 5 }, { rating: 5 }]);
  const after = summariseRatings([{ rating: 5 }, { rating: 5 }, { rating: 1 }]);
  eq(before, { average: 5, count: 2 });
  eq(after, { average: 3.7, count: 3 });
  assert(before.average !== after.average, 'adding a review must change the average');
});

test('moves when a review is edited (admin edit, not code)', () => {
  eq(summariseRatings([{ rating: 5 }]), { average: 5, count: 1 });
  eq(summariseRatings([{ rating: 3 }]), { average: 3, count: 1 });
});

test('moves when a review is deleted', () => {
  eq(summariseRatings([{ rating: 5 }, { rating: 1 }]), { average: 3, count: 2 });
  eq(summariseRatings([{ rating: 5 }]), { average: 5, count: 1 });
});

test('empty / missing / non-array input returns null (render nothing)', () => {
  eq(summariseRatings([]), null);
  eq(summariseRatings(null), null);
  eq(summariseRatings(undefined), null);
  eq(summariseRatings('nope'), null);
  eq(summariseRatings({}), null);
});

test('a list with no rateable review returns null, not 0', () => {
  eq(summariseRatings([{ text: 'a' }, { rating: null }, { rating: 'x' }]), null);
});

test('null / malformed array entries are skipped safely', () => {
  eq(summariseRatings([null, undefined, { rating: 4 }]), { average: 4, count: 1 });
});

// ── formatRating ─────────────────────────────────────────────────────────────────────────

test('formats to one decimal string', () => {
  eq(formatRating({ average: 5, count: 4 }), '5.0');
  eq(formatRating({ average: 4.5, count: 2 }), '4.5');
  eq(formatRating({ average: 4.33, count: 3 }), '4.3');
});

test('null in, null out (callers can render conditionally)', () => {
  eq(formatRating(null), null);
  eq(formatRating(undefined), null);
  eq(formatRating({ average: NaN, count: 0 }), null);
});

test('end-to-end: reviews -> displayed string', () => {
  const reviews = [{ rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 4 }, { rating: 5 }];
  eq(formatRating(summariseRatings(reviews)), '4.6');
});

console.log(`\nrating-summary: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
