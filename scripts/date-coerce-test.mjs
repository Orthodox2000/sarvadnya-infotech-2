// CHANGE: 2026-10-09 — regression suite for lib/date-coerce.ts, the defensive Date
// coercion that stops the JSON-dump string-date crash. The production 500 was:
//
//   TypeError: c.expireAt.getTime is not a function   (/api/identify)
//
// caused by ip_cache docs storing `expireAt` as an ISO *string*. `toDateMs` must
// return a number (or NaN) for ANY input and never throw. Zero deps; runs on Node
// 24 native TS type-stripping, same as scripts/order-status-test.mjs.
import { toDateMs } from '../lib/date-coerce.ts';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ${name} ... PASS`);
    passed++;
  } catch (err) {
    console.log(`  ${name} ... FAIL — ${err.message}`);
    failed++;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

const ISO = '2026-10-09T08:24:48.486Z';
const ISO_MS = new Date(ISO).getTime();

test('Date instance -> its getTime()', () => {
  const d = new Date(ISO);
  assert(toDateMs(d) === ISO_MS, 'Date should map to getTime');
});

test('ISO string -> numeric ms', () => {
  assert(toDateMs(ISO) === ISO_MS, 'ISO string should parse');
});

test('number -> passthrough', () => {
  assert(toDateMs(ISO_MS) === ISO_MS, 'number should pass through');
});

test('date-only string -> numeric ms', () => {
  assert(Number.isFinite(toDateMs('2026-10-09')), 'date-only should parse');
});

test('null / undefined / object -> NaN', () => {
  assert(Number.isNaN(toDateMs(null)), 'null -> NaN');
  assert(Number.isNaN(toDateMs(undefined)), 'undefined -> NaN');
  assert(Number.isNaN(toDateMs({})), 'object -> NaN');
  assert(Number.isNaN(toDateMs([])), 'array -> NaN');
});

test('garbage / empty / whitespace string -> NaN', () => {
  assert(Number.isNaN(toDateMs('not-a-date')), 'garbage -> NaN');
  assert(Number.isNaN(toDateMs('')), 'empty -> NaN');
  assert(Number.isNaN(toDateMs('   ')), 'whitespace -> NaN');
});

test('NaN / Infinity number -> NaN', () => {
  assert(Number.isNaN(toDateMs(NaN)), 'NaN -> NaN');
  assert(Number.isNaN(toDateMs(Infinity)), 'Infinity -> NaN');
});

test('REGRESSION: string expireAt does not throw (the prod crash)', () => {
  // Exactly the shape that crashed: a cached ip_cache doc with a string expireAt.
  const hit = { ip: '1.2.3.4', expireAt: ISO };
  let result;
  try {
    result = toDateMs(hit.expireAt) > Date.now(); // future date -> "still cached"
  } catch (err) {
    throw new Error(`must not throw: ${err.message}`);
  }
  assert(typeof result === 'boolean', 'comparison should be a boolean');
});

test('REGRESSION: unparseable expireAt is treated as expired (NaN > now === false)', () => {
  const hit = { expireAt: 'corrupt' };
  assert(!(toDateMs(hit.expireAt) > Date.now()), 'unparseable should not read as cached');
});

console.log(`\ndate-coerce: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
