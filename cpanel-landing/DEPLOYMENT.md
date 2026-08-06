# Sarvadnya Infotech — cPanel Static Frontend + Vercel Backend

**Deployment & Operations Guide**

This document is the complete manual for deploying the cPanel-hosted static landing
page (`cpanel-landing/`) that talks to the existing Vercel-hosted backend.

---

## 1. Architecture Overview

```
Browser (visitor)
      │
      ▼
┌─────────────────────────┐            ┌──────────────────────────────┐
│ cPanel static frontend  │   fetch   │  Vercel (existing live app)  │
│  cpanel-landing/out/    │ ────────► │  /api/email/submit  → Mongo  │
│  uploaded to public_html│   JSON    │  /api/chat          → Groq/  │
└─────────────────────────┘  (CORS)   │                       Gemini │
      │                              └──────────────────────────────┘
      │ deep links (new tab) ─────────►  live pages (products, demo…)
```

| Layer | Host | What it runs | Requires |
| :--- | :--- | :--- | :--- |
| Backend | **Vercel** (already live) | All API routes, MongoDB, email, AI, uploads | Existing env vars; **new** `FRONTEND_ALLOWED_ORIGINS` |
| Frontend | **cPanel** (shared, Apache) | Pure static files only | Nothing but disk space |
| Database | MongoDB Atlas / hosted | Enquiry ledger, content | (unchanged) |

Why this split:

- **No Node / memory requirement on cPanel** — the landing page is pre-built HTML/CSS/JS.
- **All sensitive backend logic stays on Vercel** where the env vars already exist.
- The static frontend makes only two kinds of calls: the **enquiry form** and the
  **Ask Sara chat** — both via JSON `fetch` to the Vercel API.

---

## 2. File Inventory

### 2.1 New — Vercel backend change

| File | Purpose |
| :--- | :--- |
| `middleware.ts` (app root) | Adds CORS to `/api/*` for the allowlisted frontend origin; handles OPTIONS preflight. Read from env `FRONTEND_ALLOWED_ORIGINS`. Defaults: `https://sarvadnya-infotech.vercel.app` + any `localhost`/`127.0.0.1` origin (for local preview). |

> Only one file changed on the Vercel side. No route handlers were touched.

### 2.2 New — `cpanel-landing/` (the static frontend project)

| File | Purpose |
| :--- | :--- |
| `package.json` | next ^15.3, react 19.2.4, tailwind ^4, `build` / `preview` scripts |
| `next.config.js` | `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true` |
| `postcss.config.mjs` | Tailwind v4 PostCSS plugin |
| `tsconfig.json` | Minimal Next TypeScript config |
| `next-env.d.ts` | Next generated type shim |
| `.gitignore` | ignores `node_modules/`, `.next/`, `out/` |
| `app/layout.tsx` | Geist + Playfair fonts, metadata, lang |
| `app/globals.css` | `@import "tailwindcss"` + brand blue/sky/white palette |
| `app/page.tsx` | The full landing page (nav, hero, services, products, why-us, contact, footer) |
| `app/components/EnquiryForm.tsx` | Client form → `POST /api/email/submit` |
| `app/components/ChatWidget.tsx` | Floating Ask Sara → `POST /api/chat` |
| `lib/api.ts` | `API_BASE` / `SITE_BASE` (Vercel URLs, overridable) |
| `public/logo.png` | Brand logo (copied from root `public/`) |
| `public/logo.svg` | Brand logo vector |
| `public/.htaccess` | Apache rewrite so deep links resolve on hard refresh |

### 2.3 Modified — root project

| File | Change |
| :--- | :--- |
| `tsconfig.json` | Added `"cpanel-landing"` to `exclude` so the root typecheck ignores the standalone mini app |

---

## 3. Build the Static Export (on your laptop)

Do this **locally** — never build on cPanel.

```powershell
# 1. Go to the mini app
cd cpanel-landing

# 2. Install dependencies (first time only)
npm install

# 3. Build the static export
npm run build
```

Expected output (last lines):

```
✓ Exporting (2/2)
Route (app)                    Size   First Load JS
┌ ○ /                      9.13 kB         112 kB
└ ○ /_not-found               994 B         104 kB
○  (Static)  prerendered as static content
```

Expected folder — `cpanel-landing/out/`:

```
out/
├── .htaccess        (rewrite rules — copied automatically)
├── index.html       (the landing page)
├── 404.html
├── logo.png
├── logo.svg
└── _next/           (compiled CSS, JS, self-hosted fonts)
```

Sanity checks:

```powershell
Test-Path out\index.html          # → True
Test-Path out\_next               # → True
Test-Path out\.htaccess           # → True
```

> **Optional:** preview locally before uploading —
> `python -m http.server 4100` (run inside `out/`), then open `http://127.0.0.1:4100`.

---

## 4. Vercel — Deploy the Backend Change

The CORS middleware is **not live yet**. Until you deploy it, the static page's
form and chat will fail from the cPanel domain (browser blocks cross-origin reads).

### Step 4.1 — Push & deploy

Commit `middleware.ts` (+ the `cpanel-landing/` folder) and push to the repo that
is connected to Vercel, or deploy from the Vercel dashboard. Verify the deployment
succeeded and the new `middleware.ts` is in the build log.

### Step 4.2 — Set the CORS allowlist env var

In the Vercel dashboard → your project → **Settings → Environment Variables**, add:

| Name | Value |
| :--- | :--- |
| `FRONTEND_ALLOWED_ORIGINS` | your exact cPanel URL(s), comma-separated, **no trailing slash** — e.g. `https://www.sarvadnyainfotech.com,https://sarvadnyainfotech.com` |

Then **redeploy** (or trigger a new deployment) so the env var reaches the function.

Rules:

- Use the **exact origin** the page will be served from (scheme + host). `https://…` ≠ `http://…`.
- Multiple origins → comma-separated.
- `localhost` / `127.0.0.1` origins are **always** allowed (for local preview) — you don't need to list them.

### Step 4.3 — Verify CORS (optional)

After deploy, this should print the header from the allowed origin:

```powershell
curl -i -H "Origin: https://www.sarvadnyainfotech.com" -X OPTIONS https://sarvadnya-infotech.vercel.app/api/email/submit
```

Expected: `HTTP/1.1 204` and a line `access-control-allow-origin: https://www.sarvadnyainfotech.com`.

---

## 5. Upload to cPanel (Direct File Upload)

> You are uploading the **contents of `out/`** — NOT the `out/` folder, and NOT the
> `cpanel-landing/` project folder.

### Step 5.1 — Zip the output (Windows)

```powershell
# From inside cpanel-landing
Compress-Archive -Path .\out\* -DestinationPath ..\sarvadnya-landing.zip
```

Or manually: open `out/`, **Ctrl+A** (select everything inside), right-click →
**Send to → Compressed (zipped) folder**.

> Selecting the files *inside* `out/` (index.html, _next, .htaccess…) is critical.
> If you zip `out/` itself, the domain shows a blank directory listing.

### Step 5.2 — Check zip size

```powershell
(Get-Item ..\sarvadnya-landing.zip).Length   # expect ~1.1 MB
```

### Step 5.3 — Upload

1. cPanel → **File Manager** → open `public_html`.
2. Upload `sarvadnya-landing.zip` (File Manager → **Upload** button, or drag & drop).
3. Compare the size shown in cPanel vs. your laptop — a dropped upload shows a smaller size.
4. Select the zip → **Extract** (right-click → Extract).
5. Confirm `public_html/` now contains `index.html`, `_next/`, `.htaccess` at the **top level**.

If files ended up nested (e.g. `public_html/out/…` or `public_html/sarvadnya-landing/…`),
move them up so `index.html` sits directly in `public_html/`.

> **Weak / slow network:** if the upload keeps failing, split nothing — instead use the
> larger single zip with resume, or run the upload from a better connection. The zip
> is ~1 MB, so it should be quick on any connection.

---

## 6. Post-Upload Test Battery

Run these in order. Everything should pass; if one fails, jump to §7.

| # | Test | How | Pass = |
| :--- | :--- | :--- | :--- |
| 1 | Site loads | Visit your domain in an incognito window | Page renders with styles |
| 2 | Hard refresh / routing | Open `/`, click **Services** → **Learn more** (goes to Vercel), back, refresh deep anchor | No 404; `.htaccess` working |
| 3 | Assets | DevTools → **Network** tab, reload | Zero failed requests (no 404 on css/js/fonts) |
| 4 | Tailwind render | Visual check of hero, cards, footer | Brand colors/fonts match local preview |
| 5 | **Enquiry form → backend** | Fill the form in **#contact**, submit | Success message + your team receives the email |
| 6 | **Chat → backend** | Open the blue "S" bubble, send *"What is AMC?"* | Sara replies (proves CORS + AI key rotation) |
| 7 | Duplicate-send guard | Submit the form twice rapidly | Second submit shows success, but only **one** email arrives (dedupe via `requestId`) |
| 8 | Deep links | Click **Enquire Now**, **Book a Live Demo**, product/service cards | They open the live Vercel site in a new tab |
| 9 | Mobile | Open on a 360px-wide phone | Layout fits, no horizontal scroll, chat + form usable |

### Where to confirm the backend side

- **Email** — your configured recipient inbox for the `contact` destination (admin panel → Email Config). Check the email arrived with the exact test text.
- **MongoDB ledger** — admin panel → submissions / email-queue stats show the saved row as `sent`.

---

## 7. Troubleshooting

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| Form shows error / chat silent, works on Vercel | CORS not deployed or wrong origin | Deploy `middleware.ts`, set `FRONTEND_ALLOWED_ORIGINS` to the **exact** origin (scheme+host), redeploy. Check §4.3. |
| Domain shows folder listing / blank | Zipped `out/` itself, or files nested | Re-zip **contents** of `out/` so `index.html` is directly in `public_html/`. |
| 404 on deep link / refresh | Missing `.htaccess` | Confirm `public_html/.htaccess` exists with the rewrite rules (§5.1). |
| Styles missing (plain text) | Cached build | Incognito / hard refresh (`Ctrl+Shift+R`). If persistent, rebuild + re-upload. |
| Logo not showing | Wrong path | Static page uses `/logo.png` from `public/`. Keep it at `public_html/logo.png`. |
| Old content showing | Browser cache | Hard refresh; cPanel may also cache via Cloudflare — purge if present. |
| Need to update content | Content baked at build | Edit `cpanel-landing/app/page.tsx`, rebuild, re-upload (see §8). |
| Backend moved to a custom domain | URL hard-coded | Set `NEXT_PUBLIC_API_BASE` / `NEXT_PUBLIC_SITE_BASE` during build (§8). |

---

## 8. Updating the Landing Page Later

```powershell
cd cpanel-landing

# 1. (Optional) point the backend at a custom domain instead of *.vercel.app
$env:NEXT_PUBLIC_API_BASE = "https://your-domain.com"
$env:NEXT_PUBLIC_SITE_BASE = "https://your-domain.com"

# 2. Edit content in app/page.tsx (services, products, contact details)

# 3. Rebuild
npm run build

# 4. Re-zip the contents of out/
Compress-Archive -Path .\out\* -DestinationPath ..\sarvadnya-landing.zip -Force

# 5. Re-upload & extract in public_html (overwrite)
```

> Static pages are snapshots — rebuild + re-upload every time you change text,
> phone numbers, pricing, etc.

---

## 9. Rollback

- **cPanel:** `public_html` is plain files — restore the previous zip contents (or delete the new files and re-upload the old zip).
- **Vercel:** remove the `FRONTEND_ALLOWED_ORIGINS` env var and/or revert `middleware.ts` and redeploy. The backend itself is unchanged and never depends on the static frontend.

---

## 10. Reference — Exact API Contracts Used

### Enquiry form → `POST {API_BASE}/api/email/submit`

Request body (JSON):

```json
{
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "contact": "+91 98213 09060",
  "service": "Tally on Cloud",
  "description": "Optional message",
  "formType": "landing",
  "destination": "contact",
  "requestId": "<crypto.randomUUID() — one per form open>"
}
```

Response `200`:

```json
{ "ok": true, "saved": true, "sent": true, "deduped": false, "jobId": "…" }
```

- The unique `requestId` gives **exactly-once** email delivery — a retried POST with
  the same key returns `deduped: true` and never fires a second email.
- `destination: "contact"` routes the enquiry to the recipient configured for the
  **Contact Page** in the admin email config. To route elsewhere, change the value
  (keys: `products`, `silver`, `gold`, `server`, `tallydrive`, `tallycapital`,
  `services`, `tss`, `amc`, `whatsapp`, `corporate-training`, `mobile-app-biz`,
  `cloud`, `aws`, `windows`, `backup-for-tally`, `tallycloudaccess`, `modules`,
  `home`, `demo`, `hrms`, `do-more`, `contact`, `find-solution`, `report-problem`).

### Chat → `POST {API_BASE}/api/chat`

Request body (JSON):

```json
{
  "messages": [
    { "role": "user", "content": "What is AMC?" },
    { "role": "assistant", "content": "…" }
  ],
  "mode": "sales"
}
```

Response `200`:

```json
{ "message": "Our AMC gives you a 15-minute response SLA, …" }
```

- `mode` `"sales"` (default) or `"learn"`.
- Replies may contain `[[Label|/url]]` navigation tokens; the static page renders
  them as links to the live Vercel site.
- If the API is down, the widget shows a fallback with phone / email / WhatsApp.

---

## 11. Current Build Facts (verified 2026-08-05)

| Fact | Value |
| :--- | :--- |
| Export size | ~1.13 MB |
| File count | 34 |
| Build command | `npm run build` in `cpanel-landing/` |
| Backend smoke test | `/api/chat` returned Sara's AMC answer ✓ |
| Backend smoke test | `/api/email/submit` → `ok=true saved=true sent=true` ✓ |
| Root typecheck | passes ✓ |
| Local preview | `python -m http.server` → 200, hero/form/chat/CSS present ✓ |

---

_Last updated: 2026-08-05_
