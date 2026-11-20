# 2026-11-12 (follow-up 4) — module pages: "On the ground" photo rendered at full width, uncropped

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"on module page of housing society, image in section 'On the ground — Built around the society office' is cropped weirdly despite on desktop we have width to view entire image, investigate other places as well where we can ensure full width render in available space."* |
| **Root cause** | The gallery block in `app/(site)/modules/[slug]/page.tsx` had a single-image special case: `mx-auto max-w-2xl` + `aspect-[4/3]` + `object-cover`. Inside the `max-w-6xl` (1152px) section that (a) shrank the photo to **672px** — 42% of the available column unused — and (b) forced a **4:3** box on a **2816x1536 (1.83:1)** file, so `object-cover` cut ~27% of the width. Both defects at once is the "cropped weirdly". Affected **housing-societies**, **cf-agencies** (agent photo, 800x459) and **garment-retail** (2816x1536) — all three are single-photo galleries. |
| **Fix** | `ModuleGalleryItem` gained optional **`width`/`height`** (real pixel size of each file, filled in for all 12 gallery entries). A lone gallery image now takes the **whole content column** and the tile's `aspectRatio` is derived from the file itself, with `object-contain` so a wrong/absent dimension letterboxes instead of cropping. `sizes` for that case is `(max-width: 1200px) calc(100vw - 2.5rem), 1152px`. Multi-image galleries keep the 3-up grid but the tile ratio went **`4/3` → `3/2`**: every photo used there is natively 3:2 (1920x1280, 800x530, 800x533), so the crop is now effectively zero and it matches the ratio `ModuleCard` already adopted on 2026-11-03. |
| **Second place found (same defect class)** | The "Other modules" cards at the bottom of the same page still used a fixed **`h-32`** image box — exactly the defect `ModuleCard` fixed on 2026-11-03 but never back-ported. Now `aspect-[3/2]`, so the crop no longer changes with card width. |
| **Checked, deliberately unchanged** | Module **hero** (`fill object-cover opacity-35`) is a 35%-opacity background texture behind a content-sized band — cropping there is intentional. `/team` square portraits and the `/services/*` two-column `aspect-[4/3]` photos are column-scoped design crops, not wasted space. `/about` gallery already uses `w-full h-auto`. Footer `h-32` box is the map **iframe** (scales, nothing to crop). |
| **Not done** | No browser/Puppeteer screenshot (owner's single-turn mode: no builds/dev servers started on my own initiative). Math: at 1152px the housing photo renders 1152x628 instead of 672x504-with-crop; at the 360px floor it is 320x175, still uncropped. |
