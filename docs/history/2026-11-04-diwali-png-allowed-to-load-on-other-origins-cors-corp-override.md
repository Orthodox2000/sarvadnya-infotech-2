# 2026-11-04 — `/diwali.png` allowed to load on other origins (CORS + CORP override)

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Area | Detail |
| :--- | :--- |
| **Brief** | The owner added `public/diwali.png` and needs it to load **outside** the site (embedded/pasted on another origin). Owner supplied the intended shape: a `headers()` rule for `/diwali.png` sending `Cross-Origin-Resource-Policy: cross-origin` + `Access-Control-Allow-Origin: *`. |
| **Why it did not work by itself** | The global `/(.*)` rule in `next.config.js` sends `Cross-Origin-Resource-Policy: same-origin`, so a cross-origin `<img>` is blocked regardless of the file being in `public/`. Next **merges** header rules rather than replacing them, so the only way to relax one asset is a second rule that sets the same key. |
| **Change** | `next.config.js` `headers()`: new `{ source: '/diwali.png' }` rule immediately **after** the `/(.*)` block, carrying `Cross-Origin-Resource-Policy: cross-origin` and `Access-Control-Allow-Origin: *`. Order is load-bearing — `resolve-routes.js` applies matches with `resHeaders[key] = value`, so the later rule must overwrite the global `same-origin` value; moving it above `/(.*)` would silently re-break the image. Scoped to this one asset on purpose; nothing else on the site loosens CORP. `node --check next.config.js` passes. |
| **Not covered (deliberate)** | The Next image-optimizer URL (`/_next/image?url=%2Fdiwali.png&w=…`) does **not** match this rule — `headers()` cannot match a query string without `has`. Cross-origin embeds must use the raw path `/diwali.png`. Also unchanged: the `Cache-Control: immutable` rule still matches the file (different key), and the image keeps its normal CSP/COOP position. |
| **Verification** | Standing single-pass directive honoured — no build, dev/start server, browser probe or `check:*` suite. Confirmed by reading Next 15.5's header-application source (`node_modules/next/dist/server/lib/router-utils/resolve-routes.js`, the `// handle headers` block) that a later matching rule overwrites an earlier key. **Verified LIVE after the Vercel deploy (2026-11-04):** `curl -sI https://sarvadnyainfotech.com/diwali.png` → `HTTP/2 200`, `access-control-allow-origin: *`, `cross-origin-resource-policy: cross-origin`, `content-type: image/png`, `content-length: 850052` (byte-exact with the owner's upload, so both relaxed headers win over the global `same-origin` rule). |
