# 2026-11-16 (seventh session) — Greeting popup overlay CTA removed; DMS link target confirmed in source

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Report** | Owner: *"ther is some error , on popup modal at start , remove overlay button as we dont need it, only show image and on clicking image it shows apge not found https://sarvadnyainfotech.com/modules/document-management"* then *"fix it"* and requested doc/push. |
| **Popup fix** | `app/components/GreetingPopup.tsx`: removed the overlay CTA pill/button rendered on top of the greeting image, leaving the image as the only in-card click target. `GREETING_CTA_HREF` (`/modules/document-management`, `lib/greeting-popup.ts`) and close-on-click behavior remain; dismiss via ✕, backdrop click, and `Esc` unchanged. Removed unused `GREETING_CTA_LABEL` import from the component. |
| **404 investigation (code-level)** | `/modules/document-management` is a valid curated route in this repo: `app/(site)/modules/[slug]/page.tsx` is `force-dynamic` and loads curated details; `lib/module-details.ts` defines/maps `CURATED_DETAILS["document-management"]`; `app/sitemap.ts` lists `/modules/document-management`. No conflicting static route found. If the live URL still 404s, the deployed site likely does not yet include this route/curated-detail state and needs deployment of the current source. |
| **Verified** | Standing single-pass directive (§3): no build, dev/start server, typecheck, or `check:*` suite run. Source inspection only. |
