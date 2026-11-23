// CHANGE: 2026-09-21 — Preview renderer for the client auto-reply email.
// Generates public/email/preview-client-autoreply.html (open in any browser)
// and a PNG screenshot via puppeteer (already installed). The logo is embedded
// as a base64 data URI so the preview renders fully OFFLINE — no network, no
// external image fetch. IMPORTANT: this script only renders the template, it
// NEVER touches Resend, so no email can leave the server.
// Usage: npm run preview:email
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
// CHANGE: 2026-11-20 — Template moved to `email-templates/`; import path updated.
import { buildClientAutoreplyHtml, DEFAULT_COMPANY, CLIENT_AUTOREPLY_SUBJECT } from '../email-templates/email-autoreply.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = join(root, 'public', 'email');
mkdirSync(outDir, { recursive: true });

// CHANGE: 2026-11-23 — the acknowledgement now shows the SQUARE company mark,
// not the Tally certificate banner; keep the offline preview in sync with live.
const logoData = readFileSync(join(root, 'public', 'logo.png')).toString('base64');

// CHANGE: 2026-11-21 — sample now mirrors the real acknowledgement receipt so
// the offline preview shows every field a lead actually sees.
const sample = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  contact: '+91 98213 09060',
  product: 'TallyPrime Silver',
  message: 'I would like to know about TallyPrime Silver licensing and implementation support.',
  submittedAt: '21 Nov 2026, 10:30 AM IST',
  company: { ...DEFAULT_COMPANY },
  logo: { data: `data:image/png;base64,${logoData}` },
};

const html = buildClientAutoreplyHtml(sample);
const htmlPath = join(outDir, 'preview-client-autoreply.html');
writeFileSync(htmlPath, html, 'utf8');
console.log(`Wrote HTML preview -> ${htmlPath}`);
console.log(`Subject: ${CLIENT_AUTOREPLY_SUBJECT}`);
console.log('Reply-To: info@sarvadnyainfotech.com (set at send time)');

let pngPath = null;
try {
  const puppeteer = (await import('puppeteer')).default;
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 640, height: 800, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15000 });
    try {
      await page.waitForSelector('img', { timeout: 5000 });
    } catch {}
    await new Promise((r) => setTimeout(r, 1200));
    pngPath = join(outDir, 'preview-client-autoreply.png');
    await page.screenshot({ path: pngPath, fullPage: true });
    console.log(`Wrote PNG screenshot -> ${pngPath}`);
  } finally {
    await browser.close();
  }
} catch (err) {
  console.warn(`PNG screenshot skipped (puppeteer unavailable): ${err.message}`);
}

console.log('Done. Open the HTML file in a browser to preview. NO emails were sent.');