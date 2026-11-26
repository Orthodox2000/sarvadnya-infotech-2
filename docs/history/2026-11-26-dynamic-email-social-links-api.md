# 2026-11-26 — Dynamic social links for the email signature and the other templates

**Owner:** *"we need to update signature template and rest template as well, for social media links
I wish to make dynamic — it will be a static fixed route with fixed output, we can change server
data but I don't want to hard-code social media links; let social media link be an API call and we
will send response, but it must work on all email provider clients, else make a fixed reply string,
but ensure it will work."*

## The constraint that shaped the design

Mail clients (Gmail, Outlook, Apple Mail) do **not** execute JavaScript and do not call APIs.
A `fetch()` inside an email can never work. The only thing that works everywhere is a literal
`href` baked into the HTML. The API call therefore happens **in the browser when the template
file is opened, before the table is selected and pasted**. The copied mail carries plain
absolute URLs, so it behaves exactly like today's static signature in every client.

## Changes

| Area | What shipped |
| :--- | :--- |
| `app/api/social-links/route.ts` | New fixed, unauthenticated `GET` route with a fixed JSON shape: `{ whatsapp, linkedin, instagram, facebook, youtube }`. Reads server settings; on any resolver failure returns the fixed fallback. `OPTIONS` answered for preflight. `Cache-Control` 5 min edge cache; `Access-Control-Allow-Origin: *` and `Cross-Origin-Resource-Policy: cross-origin`. |
| `lib/social-links.ts` | One source of truth: `SocialLinks`, `safeUrl()` (absolute http(s) only — no `javascript:`/`data:` from a bad DB value), `whatsappUrl()` (full URL or 10/12-digit phone), `SOCIAL_LINK_FALLBACKS` (derived from the committed `STATIC_SITE_SETTINGS` snapshot), `normalizeSocialLinks()` and `getSocialLinks()` (DB read with try/catch). |
| `lib/api-cache.ts`, `next.config.js` | New `PUBLIC_SOCIAL_LINKS_API_CACHE` (5 min / 24 h SWR), kept in sync in both files. A final `/api/social-links` header block overrides the blanket `/(.*)` CORP `same-origin` and `/api/:path*` `no-store` — required because a locally-opened template has origin `null`. Placed last so all three keys win. |
| `email-templates/email-signature.html`, `license-expiry-email.html`, `license-expiry-email-copy-paste.html`, `diwali-email.html` | Four social anchors per file gain `data-social="whatsapp\|linkedin\|instagram\|youtube"`. A small script **outside** the pasted table fetches the route on open and sets each `href` from the response. URL is validated with `new URL()` + protocol whitelist; a 3 s `AbortController` bounds a hanging request; every failure path leaves the original baked-in href in place — that is the owner's "fixed reply string". Facebook stays an unlinked `<img>` per the standing 2026-11-20 ruling. |
| `email-templates/README.md` | New "Dynamic social links" section documenting the route, the browser-time resolution, why JS can't live in the mail, the fallback contract and the Facebook exception. |

## Admin use

Change `NEXT_PUBLIC_WHATSAPP_PHONE` / `NEXT_PUBLIC_LINKEDIN_URL` /
`NEXT_PUBLIC_INSTAGRAM_URL` / `NEXT_PUBLIC_FACEBOOK_URL` /
`NEXT_PUBLIC_YOUTUBE_URL` in the live `settings` collection (the same keys
`/api/settings` reads). Open any updated template in a browser, wait a moment for
the icons to resolve, then Ctrl+A / copy / paste into the mail client. The pasted
HTML is self-contained — the client never needs the API.

## Verification / scope

Per the standing single-pass directive (AGENTS §3): no build, dev server,
typecheck, lint or check-suite run in this session. No commit or push. The nested
`sarvadnya-advanced/` fork was not touched.
