# 2026-11-12 (follow-up 5) — Module detail: a single gallery photo renders uncropped at its native ratio

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner reported the lone photo on a module page (housing-society) was "cropped weirdly". |
| **Cause** | A one-image gallery was forced into `mx-auto max-w-2xl` (672px) + `aspect-[4/3]` + `object-cover` inside a 1152px section: a 2816×1536 photo lost ~27% of its width on a desktop that had room for all of it. |
| **Change** | `lib/module-details.ts` — `ModuleGalleryItem` gains optional **`width` / `height`** (the file's native pixel size) populated for all 11 gallery items. `app/(site)/modules/[slug]/page.tsx` — a lone photo now takes the **whole content column**, the tile height follows `aspectRatio: "<width> / <height>"` (fallback `16 / 9`), and it uses **`object-contain`**, so even a mis-measured item letterboxes instead of cropping. Multi-image galleries keep the uniform 3-up grid, now `aspect-[3/2]` (every source photo there is natively 3:2, so `object-cover` is effectively a no-op crop). |
| **Related cards** | The "Related modules" thumbnail in the same file was a fixed `h-32`, which cropped the same 3:2 artwork differently at every card width (the defect `ModuleCard` fixed on 2026-11-03) — it is now `aspect-[3/2]`. |
| **Sizes** | Single-photo `sizes`: `(max-width: 1200px) calc(100vw - 2.5rem), 1152px`, so the browser stops fetching a 33vw-sized variant for a full-width image. |
| **Not done** | No visual pass at 360 / 1024 / 1280 px. |
