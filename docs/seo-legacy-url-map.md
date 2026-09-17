# Legacy WordPress URL Map (audit 2026-09-17)

> Source: `old cpanl backups/sarvadny_wp458.sql.gz` (3.1 MB) — the old Softaculous/WordPress
> MySQL dump. Tables carry the `wpmh_` prefix (Bluehost/Newfold install). Permalink structure was
> `/%year%/%monthnum%/%day%/%postname%/`; home was `https://sarvadnyainfotech.com`.
> Generator script: `scripts/audit-legacy-wp.mjs` (output `scripts/legacy-wp-audit.json`).

## Why these URLs exist

The pre-2026 site was WordPress (installed via Softaculous on cPanel) themed with Divi + WooCommerce.
Google retains every URL it ever crawled from it. The Next.js/Vercel site only serves routes in the
repo, so un-mapped old slugs returned 404. This map is the authoritative decision table.

## Row summary (536 published rows parsed)

| Post type | Count | Fate |
| :--- | :--- | :--- |
| `post` | 2 | 410 (hello-world, sample-blog — default WP junk) |
| `page` | 41 | 30 → 301 (below), 5 already 301/410, 6 Dated/Divi non-public pages → covered |
| `et_pb_layout` / `et_template` / `et_footer_layout` / `et_theme_builder` / `et_body_layout` / `custom_css` / `wp_global_styles` / `nav_menu_item` | 58 | **Non-routable builder internals** — never public URLs; no handling needed |
| `category` terms | 1 | 410 (`/category/uncategorized/`) |
| `post` dated URLs `/YYYY/MM/DD/slug/` | — | 410 via year-archive rule (`middleware.ts` `DATED_POST_RE`) |
| WooCommerce `/shop/*`, `/product/` | — | 410 (already present; not in this dump — older WP iteration) |

## 301 redirects (next.config.js) — old URL → live URL

Admin/legal pages:

| Old URL | Live target |
| :--- | :--- |
| `/home-tally-partner/` | `/` |
| `/about-us/` | `/about` |
| `/contact-us/` | `/contact` |
| `/privacy-policy/` | `/privacy` |
| `/terms-and-conditions/` | `/terms` |
| `/refund-and-cancellation-policy/` | `/terms` |
| `/blog/` | `/news` |

Services / products / cloud:

| Old URL | Live target |
| :--- | :--- |
| `/tally-prime-services/` | `/services` |
| `/erp-consulting-services/` | `/capabilities` |
| `/tally-cloud-services/` | `/cloud` |
| `/tally-product-3/` | `/products` |
| `/tally-server-9-2/` | `/products/server` |
| `/tally-software-service-tss-2/` | `/services/tss` |
| `/tally-ass-annual-software-services-2/` | `/services/tss` |
| `/corporate-training-2/` | `/services/corporate-training` |
| `/offline-seminars-2/` | `/services/corporate-training` |
| `/online-webinars-2/` | `/services/corporate-training` |
| `/customization-services-2/` | `/services/tdl` |
| `/understanding-client-erp-requirements/` | `/services` |
| `/offering-right-solution-onlinehelping-in-implementation-of-offered-erp/` | `/services` |
| `/ensure-quality-training-and-service-thereafter-increase-client-satisfaction/` | `/services` |

Modules / add-ons:

| Old URL | Live target |
| :--- | :--- |
| `/customized-modules/` | `/modules` |
| `/agent-broker-commission-rd-module/` | `/modules` |
| `/clearing-and-forwarding-agencies-cfa/` | `/modules` |
| `/footwear-distribution-retail-sales-manufacturing-industries/` | `/modules` |
| `/garment-wholesale-2/` | `/modules` |
| `/share-investment-business/` | `/modules` |
| `/attach-and-manage-documents-2/` | `/addons` |
| `/digitally-signed-tally-invoice-2/` | `/addons` |
| `/lock-gst-returns-in-tally/` | `/addons` |

## 410 Gone (middleware.ts) — dead artifacts, no live equivalent

- `/hello-world/`, `/sample-blog/` — WordPress sample defaults
- `/category/uncategorized/` + every `/category/…` URL (archive prefix)
- Every dated post URL `/YYYY/MM/DD/slug/` (any year — `DATED_POST_RE` in middleware)

## Pre-existing handled URLs (unchanged)

- 301: `/tally-erp-9-single-multi-user-license`, `/tally-prime`, `/tally-prime-product`,
  `/tally-product-2`, `/upgrade-of-tally-erp-9-products`, `/housing-societies-2`,
  `/erp-consulting-services-3`, `/customized-ready-modules-for-specific-business-lines`,
  `/tally-software-implementation-service`, `/small-add-ons-in-tally-erp-9`, `/cloud/nosky`
- 410: `/shop/bumper+stickers`, `/shop/gallery-boards`, `/shop/framed-prints`,
  `/shop/all-mouse-pads`, `/shop/cool+stickers`, `/product/`, `/feed/`, `/automobile-industries/`,
  `/author/admin/feed/`, `/wp-includes/*`, `/wp-content/*`, `/wp-admin/*`, `/wp-json/*`, `/2021/*`,
  `?et_core_page_resource=*`

## Excluded (non-routable WP internals — do NOT map)

All `et_*` / `custom_css` / `nav_menu_item` rows (Divi builder layouts, theme-builder templates,
menu items). They never produced user-facing URLs. No server action required.