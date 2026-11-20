# 2026-11-03 — WhatsApp / social share preview: the thumbnail's real source found, and switched to the video thumbnail

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Area | Detail |
| :--- | :--- |
| **Owner report** | *"first business is identify thumbnail fource for whatsapp and any si when i paste link, it shows image which i never seen, i want basic video thumbnail to be seen, currently nly sarvadnya infotech name is shown without logo version"*. |
| **Identification** | Two competing definitions existed. `app/layout.tsx` declared `/video-thumbnail.jpg` (with **wrong** declared dimensions, 1200x630 vs the file's real 1280x720) but only for routes with no `openGraph` of their own. `lib/seo.ts` declared `OG_IMAGE_PATH = '/opengraph-image'`, and because **Next replaces** a layout-level `openGraph` with a page-level one instead of merging it, that generated card won on **every** `seoMetadata()` page. Verified live before the change: `/`, `/news`, `/products` all emitted `og:image = https://sarvadnyainfotech.com/opengraph-image`, 1200x630. |
| **Why it looked unfamiliar** | `app/opengraph-image.tsx` renders on demand — a teal gradient, a rounded tile containing the **letter "S" (not the logo)** and the words "Sarvadnya Infotech LLP". No such image exists as a file in the repo, which is exactly why the owner had "never seen" it. |
| **Fix** | `OG_IMAGE_PATH` -> **`/video-thumbnail.jpg`**, `OG_IMAGE_WIDTH/HEIGHT` -> **1280x720** (measured with `file`: JPEG 1280x720, 50,022 B). `app/layout.tsx` corrected to the same measured size, `alt` reworded off the wrong "Logo" text, and `twitter.images` added (it had none). `app/opengraph-image.tsx` + `app/twitter-image.tsx` **deleted** so there is exactly one share image; nothing imported them and routes without their own `openGraph` inherit the root layout's copy. |
| **Guard updated** | `scripts/seo-audit.mjs` used to **require** `app/opengraph-image.tsx` and the literal `OG_IMAGE_PATH = '/opengraph-image'`. It now resolves whatever `OG_IMAGE_PATH` says, **fails if `public/<path>` does not exist** (a typo would otherwise ship an og:image 404 site-wide) and fails a declared ratio < 1.5. |
| **Pre-existing asset** | `public/video-thumbnail.jpg` is the homepage hero-video poster, made **opaque** on 2026-09-22 (flattened onto cream `#FBFAF6`) because Google rejects RGBA thumbnails as "transparent" — see `daily logs/2026-09-22.md`. It is the "basic video thumbnail" the owner asked for. |
| **Caching** | WhatsApp caches the preview per URL; the image URL changed, which forces a re-fetch on the next scrape. For an immediate test, share a throwaway query-string URL. `next.config.js` serves images `immutable` for a year, so a future art change must use a **new file name**, never an in-place overwrite. |
| **Verification** | Standing single-pass directive honoured: no typecheck, build, dev server, `check:*` suite or browser probe. Only `node --check scripts/seo-audit.mjs` plus a live `curl` of the pre-change tags. Pending outside the code: **redeploy**, then re-share. |
