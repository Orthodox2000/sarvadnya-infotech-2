import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

let exitCode = 0;
const results = [];

function pass(msg) { results.push(`  ✅ ${msg}`); }
function warn(msg) { results.push(`  ⚠️  ${msg}`); }
function fail(msg) { results.push(`  ❌ ${msg}`); exitCode = 1; }

function check(label, condition, severity = 'fail') {
  if (condition) {
    pass(label);
  } else {
    severity === 'fail' ? fail(label) : warn(label);
  }
}

// ─── 1. Environment Variables ─────────────────────────────────
results.push('\n📋 Environment & Secrets');
const envPath = resolve(root, '.env');
const envExamplePath = resolve(root, '.env.example');
check('.env file exists', existsSync(envPath));
check('.env.example file exists', existsSync(envExamplePath));

if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  const hasMongoURI = envContent.includes('MONGODB_URI');
  const hasGroqKey = envContent.includes('GROQ_API_KEY');
  check('MONGODB_URI is set', hasMongoURI);
  check('GROQ_API_KEY is set', hasGroqKey);
  if (envContent.includes('ADMIN_ACCESS_KEY')) {
    pass('ADMIN_ACCESS_KEY is configured');
  } else {
    warn('ADMIN_ACCESS_KEY not set in .env — admin auth is disabled');
  }
}

// Check .gitignore has .env*
const gitignore = existsSync(resolve(root, '.gitignore'))
  ? readFileSync(resolve(root, '.gitignore'), 'utf-8') : '';
check('.gitignore contains .env* pattern', /\.env\*/.test(gitignore));

// ─── 2. Package Dependencies ──────────────────────────────────
results.push('\n📦 Dependency Security');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
const hasTypeScript = 'typescript' in deps;
check('TypeScript is installed', hasTypeScript);
warn('Consider adding: npm audit --audit-level=high (run separately)');

// ─── 3. Security Headers Check ────────────────────────────────
results.push('\n🔒 Security Headers');
const configPath = resolve(root, 'next.config.js');
if (existsSync(configPath)) {
  const config = readFileSync(configPath, 'utf-8');
  check('Content-Security-Policy header configured', /Content-Security-Policy/.test(config));
  check('Strict-Transport-Security header configured', /Strict-Transport-Security/.test(config));
  check('X-Frame-Options header configured', /X-Frame-Options/.test(config));
  check('X-Content-Type-Options header configured', /X-Content-Type-Options/.test(config));
  check('Referrer-Policy header configured', /Referrer-Policy/.test(config));
  check('Permissions-Policy header configured', /Permissions-Policy/.test(config));
  check('Cross-Origin-Opener-Policy header configured', /Cross-Origin-Opener-Policy/.test(config));
  check('Cross-Origin-Resource-Policy header configured', /Cross-Origin-Resource-Policy/.test(config));
}

// ─── 4. Middleware Check ───────────────────────────────────────
results.push('\n🛡️  Middleware & Auth');
// CHANGE: 2026-10-06 (SP-4) — these checks used to read proxy.ts and PASSED while that
// file was dormant (Next 15.5 reads middleware.ts only, AGENTS §10). That false "green"
// is how two unauthenticated admin routes shipped. Assert what actually runs instead.
const mwPath = resolve(root, 'middleware.ts');
if (existsSync(mwPath)) {
  const mwLive = readFileSync(mwPath, 'utf-8');
  check(
    'middleware.ts blocks /admin + /api/admin (segment-exact)',
    /pathname === '\/admin'/.test(mwLive) &&
      /pathname\.startsWith\('\/admin\/'\)/.test(mwLive) &&
      /pathname === '\/api\/admin'/.test(mwLive) &&
      /pathname\.startsWith\('\/api\/admin\/'\)/.test(mwLive)
  );
  check(
    'admin block answers 404 (surface looks absent, not protected)',
    /isAdminPath\(pathname\)[\s\S]{0,300}404/.test(mwLive)
  );
} else {
  check('middleware.ts exists (the live guard on Next 15)', false);
}
const proxyPath = resolve(root, 'proxy.ts');
if (existsSync(proxyPath)) {
  warn('proxy.ts exists but is DORMANT on Next 15.5 — middleware.ts is the live guard; never count proxy.ts as protection');
  const proxy = readFileSync(proxyPath, 'utf-8');
  warn(/rateLimitMap/.test(proxy)
    ? 'Rate limiting lives only in dormant proxy.ts — public write routes carry their own per-IP limits; do not assume a global limiter'
    : 'No rate limiting found in proxy.ts either');
  warn(/content-type/i.test(proxy)
    ? 'Content-Type validation lives only in dormant proxy.ts — write routes must validate payloads themselves'
    : 'No Content-Type validation found in proxy.ts either');
}

// ─── 5. Security Utilities Check ─────────────────────────────
results.push('\n📚 Security Utilities');
// CHANGE: 2026-10-08 — this section used to assert lib/api-security.ts and lib/rate-limit.ts
// exist, but both were deleted as dead code in 2e98e1e (2026-07-29), so the audit has been
// red ever since on a stale expectation (the helpers now live inline in lib/email.ts and the
// routes). Assert the security surface that actually exists instead: the shared write-route
// limiter, and every public write route actually calling it (the 2026-10-08 gap where
// tss-renewal / problem-reports / upload/chunk had no limiter at all).
check('lib/rate-limit.ts exists (shared write-route limiter)', existsSync(resolve(root, 'lib', 'rate-limit.ts')));
const writeRoutes = [
  'app/api/email/submit/route.ts',
  'app/api/contact/route.ts',
  'app/api/tss-renewal/route.ts',
  'app/api/problem-reports/route.ts',
  'app/api/upload/chunk/route.ts',
  'app/api/cart/order/route.ts',
  'app/api/cart/verify/route.ts',
];
const unguarded = writeRoutes.filter((p) => {
  const file = resolve(root, p);
  return !existsSync(file) || !/ateLimit/.test(readFileSync(file, 'utf-8'));
});
check(
  `public write routes are rate-limited${unguarded.length ? ` (missing: ${unguarded.join(', ')})` : ''}`,
  unguarded.length === 0
);

// ─── 6. MongoDB Config Check ──────────────────────────────────
results.push('\n🗄️  Database Configuration');
const mongoLib = resolve(root, 'lib', 'mongodb.ts');
if (existsSync(mongoLib)) {
  const mongo = readFileSync(mongoLib, 'utf-8');
  check('MongoDB uses environment variable for URI', /process\.env\.MONGODB_URI/.test(mongo));
  check('MongoDB connection has timeout settings', /timeout/i.test(mongo));
}

// ─── Summary ──────────────────────────────────────────────────
results.push(`\n${'━'.repeat(50)}`);
results.push(`Audit complete — ${exitCode === 0 ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED'}\n`);

console.log(results.join('\n'));
process.exit(exitCode);
