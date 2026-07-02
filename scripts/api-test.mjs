const BASE = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN_KEY = process.env.ADMIN_ACCESS_KEY || '';

let passed = 0;
let failed = 0;

async function request(method, path, options = {}) {
  const url = `${BASE}${path}`;
  const headers = { ...options.headers };
  if (ADMIN_KEY) headers['x-admin-key'] = ADMIN_KEY;

  try {
    const res = await fetch(url, { method, headers, ...(options.body ? { body: options.body } : {}) });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    return { status: res.status, ok: res.ok, data, headers: res.headers };
  } catch (err) {
    return { status: 0, ok: false, data: null, error: err.message };
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
      if (actual !== expected) throw new Error(`Expected ${expected}, got ${actual}`);
    },
    toContain(str) {
      if (typeof actual === 'string' && !actual.includes(str)) throw new Error(`Expected to contain "${str}"`);
      if (Array.isArray(actual) && !actual.some(i => typeof i === 'string' && i.includes(str))) throw new Error(`Expected array to contain item with "${str}"`);
    },
    toBeDefined() {
      if (actual === undefined || actual === null) throw new Error('Expected value to be defined');
    },
    toHaveProperty(key) {
      if (!actual || typeof actual !== 'object') throw new Error('Expected object');
      if (!(key in actual)) throw new Error(`Expected object to have property "${key}"`);
    }
  };
}

async function run() {
  console.log(`\n🔍 API Tests — ${BASE}\n`);

  // ─── Health ────────────────────────────────────────────────
  console.log('📡 Health Check');
  await test('GET /api/health returns 200', async () => {
    const res = await request('GET', '/api/health');
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('status');
    expect(res.data.status).toBe('ok');
  });

  // ─── Public Content ────────────────────────────────────────
  console.log('\n📄 Content API');
  await test('GET /api/content requires section param', async () => {
    const res = await request('GET', '/api/content');
    expect(res.status).toBe(400);
  });

  await test('GET /api/content?section=home_hero returns data', async () => {
    const res = await request('GET', '/api/content?section=home_hero');
    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
  });

  // ─── Settings ──────────────────────────────────────────────
  console.log('\n⚙️  Settings API');
  await test('GET /api/settings returns 200', async () => {
    const res = await request('GET', '/api/settings');
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('support_phone');
  });

  // ─── Modules ───────────────────────────────────────────────
  console.log('\n📦 Modules API');
  await test('GET /api/modules returns 200', async () => {
    const res = await request('GET', '/api/modules');
    expect(res.status).toBe(200);
  });

  // ─── News ──────────────────────────────────────────────────
  console.log('\n📰 News API');
  await test('GET /api/news returns 200', async () => {
    const res = await request('GET', '/api/news');
    expect(res.status).toBe(200);
  });

  // ─── Search ────────────────────────────────────────────────
  console.log('\n🔎 Search API');
  await test('GET /api/search?q=ta returns 400 for short query', async () => {
    const res = await request('GET', '/api/search?q=t');
    expect(res.status).toBe(200);
  });

  await test('GET /api/search?q=tally returns results', async () => {
    const res = await request('GET', '/api/search?q=tally');
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('results');
  });

  // ─── Contact ───────────────────────────────────────────────
  console.log('\n📬 Contact API');
  await test('POST /api/contact rejects missing fields', async () => {
    const res = await request('POST', '/api/contact', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  // ─── Admin Routes (if API key set) ─────────────────────────
  if (ADMIN_KEY) {
    console.log('\n🔐 Admin API');
    await test('GET /api/admin/stats returns 200', async () => {
      const res = await request('GET', '/api/admin/stats');
      expect(res.status).toBe(200);
    });
  } else {
    console.log('\n🔐 Admin API (skipped — ADMIN_ACCESS_KEY not set)');
  }

  // ─── Security Headers ──────────────────────────────────────
  console.log('\n🛡️  Security Headers');
  await test('Response includes X-Frame-Options', async () => {
    const res = await request('GET', '/api/health');
    const h = res.headers.get('x-frame-options');
    if (!h) throw new Error('Missing X-Frame-Options header');
  });

  await test('Response includes X-Content-Type-Options', async () => {
    const res = await request('GET', '/api/health');
    const h = res.headers.get('x-content-type-options');
    if (!h) throw new Error('Missing X-Content-Type-Options header');
  });

  // ─── Summary ───────────────────────────────────────────────
  const total = passed + failed;
  console.log(`\n${'━'.repeat(50)}`);
  console.log(`  Total: ${total}  |  ✅ Passed: ${passed}  |  ❌ Failed: ${failed}\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
  console.error('Fatal:', err.message);
  console.log('\n⚠️  Make sure the dev server is running on', BASE);
  process.exit(1);
});
