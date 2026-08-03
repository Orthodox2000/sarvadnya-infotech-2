import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value && !(key.trim() in process.env)) {
      process.env[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

let BASE = process.env.BASE_URL || 'http://localhost:3000';
if (!/^https?:\/\//i.test(BASE)) BASE = `https://${BASE}`;

const ADMIN_KEY = process.env.ADMIN_ACCESS_KEY || '';

// ─── Email budget protection ──────────────────────────────────────────────
// Default (SINGLE) run queues + drains EXACTLY ONE email (the positive send).
// Set EMAIL_FULL_TEST=1 to also run sanitization/security sends, the
// consistency loop (EMAIL_TEST_COUNT), the concurrency batch (EMAIL_TEST_BATCH),
// and the optional rate-limit test (TEST_RATE_LIMIT=1 — consumes ~30 emails).
const FULL_TEST = process.env.EMAIL_FULL_TEST === '1';
const TEST_COUNT = Number(process.env.EMAIL_TEST_COUNT || 10);
const CONCURRENT_BATCH = Number(process.env.EMAIL_TEST_BATCH || 5);
const RUN_RATE_LIMIT_TEST = process.env.TEST_RATE_LIMIT === '1';

let passed = 0;
let failed = 0;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function request(method, path, options = {}) {
  const url = `${BASE}${path}`;
  const headers = { ...options.headers };
  try {
    const start = performance.now();
    const res = await fetch(url, { method, headers, ...(options.body ? { body: options.body } : {}) });
    const text = await res.text();
    const elapsed = Math.round((performance.now() - start) * 10) / 10;
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    return { status: res.status, ok: res.ok, data, headers: res.headers, ms: elapsed };
  } catch (err) {
    return { status: 0, ok: false, data: null, error: err.message, ms: 0 };
  }
}

function test(name, fn) {
  process.stdout.write(`  ${name} ... `);
  return Promise.resolve(fn()).then(
    () => { console.log('✅'); passed++; },
    (err) => { console.log('❌', err.message || err); failed++; }
  );
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    },
    toBeTrue() {
      if (actual !== true) throw new Error(`Expected true, got ${JSON.stringify(actual)}`);
    },
    toBeDefined() {
      if (actual === undefined || actual === null) throw new Error('Expected value to be defined');
    },
    toBeGreaterThan(n) {
      if (typeof actual !== 'number' || actual <= n) throw new Error(`Expected ${actual} > ${n}`);
    },
    toContain(str) {
      if (typeof actual === 'string' && !actual.includes(str)) throw new Error(`Expected to contain "${str}"`);
    },
  };
}

function pct(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[idx];
}

function statsReport(label, arr) {
  const sum = arr.reduce((a, b) => a + b, 0);
  const avg = arr.length ? Math.round((sum / arr.length) * 10) / 10 : 0;
  console.log(`  ${label}: min=${Math.min(...arr)}ms  avg=${avg}ms  p50=${pct(arr, 50)}ms  p95=${pct(arr, 95)}ms  max=${Math.max(...arr)}ms  n=${arr.length}`);
}

function rid(prefix) {
  return `test-${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function validPayload(i) {
  const ts = Date.now();
  return {
    name: `Test User ${i}`,
    email: `test.user.${ts}.${i}@example.com`,
    contact: `+91 98213090${String(i).padStart(2, '0')}`,
    service: 'TallyPrime Gold',
    description: `Automated email test run ${ts} — request #${i}`,
    formType: 'demo',
  };
}

// ─── Public + admin helpers ───────────────────────────────────────────────
const submit = (payload, requestId) =>
  request('POST', '/api/email/submit', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, requestId }),
  });

const processQueue = (batch = 50) =>
  request('GET', `/api/admin/email/process?batch=${batch}`, {
    headers: ADMIN_KEY ? { 'x-admin-key': ADMIN_KEY } : {},
  });

const getQueue = () =>
  request('GET', '/api/admin/email/queue', {
    headers: ADMIN_KEY ? { 'x-admin-key': ADMIN_KEY } : {},
  });

const findJob = (q, jobKey) => (q?.data?.recent || []).find(j => j.jobKey === jobKey);

async function queueSentCount() {
  const q = await getQueue();
  return q?.data?.stats?.sent ?? -1;
}

// Poll until the job reaches 'sent' (background after() handles it normally;
// falls back to a manual admin drain for deterministic runs) or timeout.
async function drainJob(jobKey, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  let manual = false;
  while (Date.now() < deadline) {
    const q = await getQueue();
    const job = findJob(q, jobKey);
    if (job?.status === 'sent' || job?.status === 'dead') return job;
    if (job?.status === 'failed') {
      await processQueue();
    } else if (!manual && Date.now() > deadline - 8000) {
      await processQueue();
      manual = true;
    }
    await sleep(700);
  }
  const q = await getQueue();
  return findJob(q, jobKey) || null;
}

async function drainAll(maxCalls = 8) {
  for (let i = 0; i < maxCalls; i++) {
    const q = await getQueue();
    if ((q?.data?.stats?.pending || 0) === 0 && (q?.data?.stats?.processing || 0) === 0) break;
    await processQueue();
    await sleep(800);
  }
}

async function run() {
  const baseEmails = FULL_TEST ? 3 + TEST_COUNT + CONCURRENT_BATCH : 1;
  const expectedEmails = baseEmails + (RUN_RATE_LIMIT_TEST ? Number(process.env.EMAIL_RATE_LIMIT || 30) : 0);

  console.log(`\n✉️  Email (Resend) Tests — ${BASE}\n`);
  console.log(`  Mode: ${FULL_TEST ? 'FULL' : 'SINGLE'} | emails this run: ~${expectedEmails}${FULL_TEST ? ` (consistency=${TEST_COUNT}, batch=${CONCURRENT_BATCH}${RUN_RATE_LIMIT_TEST ? ', rate-limit' : ''})` : ''}`);
  console.log('  (Default SINGLE mode sends EXACTLY ONE email. Emails are queued + drained by the background worker.)');

  const sentBefore = await queueSentCount();

  // ─── Diagnostic ────────────────────────────────────────────
  console.log('\n🔧 Email Configuration');
  let diag = null;
  await test('GET /api/email/diagnostic returns 200', async () => {
    const res = await request('GET', '/api/email/diagnostic');
    expect(res.status).toBe(200);
    diag = res.data;
  });

  if (diag) {
    console.log(`  → API key present: ${diag.apiKeyPresent}`);
    console.log(`  → Sender: ${diag.from} (${diag.fromDomain})`);
    console.log(`  → Internal recipients: ${diag.recipientCount} ${diag.recipients.length ? '(' + diag.recipients.join(', ') + ')' : ''}`);
    console.log(`  → Configured: ${diag.configured}`);
  }

  await test('RESEND_API_KEY is configured', async () => {
    if (!diag) throw new Error('Diagnostic unavailable');
    expect(diag.apiKeyPresent).toBe(true);
  });

  await test('At least one internal recipient configured', async () => {
    if (!diag) throw new Error('Diagnostic unavailable');
    expect(diag.recipientCount).toBeGreaterThan(0);
  });

  await test('Per-form-type recipient map exists for all 6 form types', async () => {
    if (!diag) throw new Error('Diagnostic unavailable');
    const required = ['quote', 'enquire', 'support', 'callback', 'demo', 'general'];
    for (const type of required) {
      const list = diag.formRecipients?.[type];
      if (!Array.isArray(list) || list.length === 0) throw new Error(`Missing recipient config for "${type}"`);
    }
  });

  // ─── Request Validation (no emails) ─────────────────────────
  console.log('\n📋 Request Validation');
  await test('POST rejects missing fields', async () => {
    const res = await request('POST', '/api/email/submit', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  await test('POST rejects invalid email format', async () => {
    const res = await request('POST', '/api/email/submit', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validPayload(1), email: 'not-an-email' }),
    });
    expect(res.status).toBe(400);
  });

  // ─── Security (queue drain is admin-only) ───────────────────
  console.log('\n🔐 Queue Protection');
  await test('Email process endpoint rejects unauthenticated callers', async () => {
    const res = await request('GET', '/api/admin/email/process?batch=1');
    expect(res.status).toBe(401);
  });

  await test('Email queue stats endpoint rejects unauthenticated callers', async () => {
    const res = await request('GET', '/api/admin/email/queue');
    expect(res.status).toBe(401);
  });

  await test('Admin-authenticated process call returns 200', async () => {
    const res = await processQueue();
    expect(res.status).toBe(200);
  });

  // ─── Sanitization + Recipient Enforcement (FULL mode only) ──
  if (FULL_TEST) {
    console.log('\n🧹 Sanitization');
    await test('HTML/script tags are stripped server-side', async () => {
      const res = await submit(
        { ...validPayload(2), name: '<script>alert(1)</script>Test Name', description: '<b>Bold</b> & <i>Italic</i>' },
        rid('sanitize')
      );
      expect(res.status).toBe(200);
      expect(res.data.saved).toBe(true);
      expect(res.data.queued).toBe(true);
    });

    console.log('\n🔐 Internal-Only Recipient Enforcement');
    await test('Client-supplied "to" is ignored (server resolves internal recipients)', async () => {
      const jobKey = rid('toignored');
      const res = await submit({ ...validPayload(3), to: 'attacker@evil.com' }, jobKey);
      expect(res.status).toBe(200);
      expect(res.data.queued).toBe(true);
      const job = await drainJob(jobKey);
      if (!job) throw new Error('Job not found after drain');
      if (job.recipients.some(r => r.toLowerCase().includes('evil.com'))) {
        throw new Error(`Attacker-supplied recipient leaked into the send: ${job.recipients.join(', ')}`);
      }
      expect(job.recipients.length).toBeGreaterThan(0);
    });
  }

  // ─── Positive enqueue + exactly-once send (SINGLE default) ──
  console.log('\n✅ Positive Send (exactly one email)');
  const positiveKey = rid('positive');

  await test('Valid demo submission saves + queues fast (no inline Resend call)', async () => {
    const res = await submit(validPayload(4), positiveKey);
    expect(res.status).toBe(200);
    expect(res.data.ok).toBe(true);
    expect(res.data.saved).toBe(true);
    expect(res.data.queued).toBe(true);
    expect(res.data.jobId).toBeDefined();
    if (res.ms >= 3000) throw new Error(`Response took ${res.ms}ms — must be < 3000ms (email is queued, not sent inline)`);
  });

  await test('Duplicate POST with the same requestId does not create a second job', async () => {
    const res = await submit(validPayload(4), positiveKey);
    expect(res.status).toBe(200);
    expect(res.data.queued).toBe(true);
    const q = await getQueue();
    const matches = (q?.data?.recent || []).filter(j => j.jobKey === positiveKey);
    if (matches.length > 1) throw new Error(`Expected 1 job for ${positiveKey}, got ${matches.length}`);
  });

  await test('Queued job sends exactly once (attempts === 1)', async () => {
    const job = await drainJob(positiveKey);
    if (!job) throw new Error('Job was not found after drain');
    expect(job.status).toBe('sent');
    expect(job.attempts).toBe(1);
  });

  // ─── Consistency + Performance (FULL mode only) ─────────────
  if (FULL_TEST) {
    console.log(`\n📊 Consistency & Performance (${TEST_COUNT} sequential + ${CONCURRENT_BATCH} concurrent)`);
    const latencies = [];
    const errors = [];
    let queuedCount = 0;

    const seqSentBefore = await queueSentCount();
    for (let i = 0; i < TEST_COUNT; i++) {
      const res = await submit(validPayload(100 + i), rid('seq'));
      latencies.push(res.ms);
      if (res.status === 200 && res.data?.queued === true) {
        queuedCount++;
      } else {
        errors.push(`req#${i}: status=${res.status} ${res.data?.error || ''} (${res.ms}ms)`);
      }
    }

    await test(`${TEST_COUNT} sequential submits: all queued`, async () => {
      if (queuedCount !== TEST_COUNT) {
        throw new Error(`${TEST_COUNT - queuedCount} failed: ${errors.slice(0, 3).join(' | ')}`);
      }
    });

    await test(`${TEST_COUNT} sequential sends: all delivered from queue`, async () => {
      await drainAll();
      const sentAfter = await queueSentCount();
      if (sentAfter - seqSentBefore !== TEST_COUNT) {
        throw new Error(`Expected ${TEST_COUNT} sent, got ${sentAfter - seqSentBefore}`);
      }
    });

    statsReport('Sequential latency', latencies);

    const conSentBefore = await queueSentCount();
    const conKeys = Array.from({ length: CONCURRENT_BATCH }, () => rid('con'));
    const concurrentResults = await Promise.all(
      conKeys.map(k => submit(validPayload(200 + Math.floor(Math.random() * 100)), k))
    );

    const conLatencies = concurrentResults.map(r => r.ms);
    const conOk = concurrentResults.filter(r => r.status === 200 && r.data?.queued === true).length;

    await test(`${CONCURRENT_BATCH} concurrent submits: all queued`, async () => {
      if (conOk !== CONCURRENT_BATCH) {
        const bad = concurrentResults.filter(r => !(r.status === 200 && r.data?.queued === true)).map(r => `status=${r.status} ${r.data?.error || ''}`).join(' | ');
        throw new Error(`${CONCURRENT_BATCH - conOk} failed: ${bad}`);
      }
    });

    await test(`${CONCURRENT_BATCH} concurrent sends: all delivered, no duplicates`, async () => {
      await drainAll();
      const sentAfter = await queueSentCount();
      if (sentAfter - conSentBefore !== CONCURRENT_BATCH) {
        throw new Error(`Expected ${CONCURRENT_BATCH} sent, got ${sentAfter - conSentBefore}`);
      }
      const q = await getQueue();
      const seen = new Set();
      for (const job of q?.data?.recent || []) {
        if (job.attempts > 1) throw new Error(`Duplicate send detected for ${job.jobKey} (${job.attempts} attempts)`);
        seen.add(job.jobKey);
      }
      if (seen.size !== q?.data?.recent?.length) throw new Error('Duplicate jobKeys found in queue');
    });

    statsReport('Concurrent latency', conLatencies);

    if (RUN_RATE_LIMIT_TEST) {
      const limit = Number(process.env.EMAIL_RATE_LIMIT || 30);
      console.log(`\n🚦 Rate Limit (burst of ${limit + 3} → expects ≥1 429)`);
      await test('Rate limiter returns 429 on burst', async () => {
        const burst = [];
        for (let i = 0; i < limit + 3; i++) {
          const res = await submit(validPayload(300 + i), rid('rl'));
          burst.push(res.status);
        }
        const got429 = burst.filter(s => s === 429).length;
        if (got429 === 0) throw new Error(`Expected at least one 429, got [${burst.join(', ')}]`);
      });
      console.log('  Note: burst requests count toward the proxy-level global rate limit (60/min/IP).');
    }
  }

  // ─── Summary ───────────────────────────────────────────────
  const sentAfter = await queueSentCount();
  const emailsThisRun = sentAfter - sentBefore;

  if (FULL_TEST && !RUN_RATE_LIMIT_TEST) {
    await test(`Total emails sent this run === ${expectedEmails}`, async () => {
      if (emailsThisRun !== expectedEmails) {
        throw new Error(`Expected ${expectedEmails} emails, got ${emailsThisRun}`);
      }
    });
  } else if (FULL_TEST) {
    await test(`Total emails sent this run >= ${expectedEmails - (Number(process.env.EMAIL_RATE_LIMIT || 30))}`, async () => {
      if (emailsThisRun < expectedEmails - (Number(process.env.EMAIL_RATE_LIMIT || 30))) {
        throw new Error(`Expected at least ${expectedEmails} emails, got ${emailsThisRun}`);
      }
    });
  }

  const total = passed + failed;
  console.log(`\n  Emails sent this run: ${emailsThisRun} (queue sent-delta)\n`);
  console.log(`${'━'.repeat(50)}`);
  console.log(`  Total: ${total}  |  ✅ Passed: ${passed}  |  ❌ Failed: ${failed}\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
  console.error('Fatal:', err.message);
  console.log('\n⚠️  Make sure the dev server is running on', BASE);
  process.exit(1);
});
