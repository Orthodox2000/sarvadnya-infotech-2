# 2026-11-24 — Tally Insights: 6h ISR for static curriculum

## Why

Tally Insights content is static curriculum data from `lib/learn-tally-curriculum.ts` and rarely changes. Pages were statically generated (`dynamicParams = false`) but had no explicit long ISR revalidate window declared in route files; adding an explicit 6h ISR keeps CPU low and makes cache intent clear.

## Changes

- `app/(site)/tally-insights/page.tsx` — added `export const revalidate = 21600`.
- `app/(site)/tally-insights/[section]/page.tsx` — added `export const revalidate = 21600`; kept `dynamicParams = false` and `generateStaticParams()`.
- `app/(site)/tally-insights/[section]/[lesson]/page.tsx` — added `export const revalidate = 21600`; kept `dynamicParams = false` and `generateStaticParams()`.
- `app/api/revalidate/route.ts` — added `INSIGHTS_PATHS = ['/tally-insights', '/sitemap.xml']`; when request tags include `insights` and no explicit paths are supplied, default to insights paths. Existing module defaults unchanged.

## Notes

- Tally Insights has no DB reads; content comes from code/static curriculum and static assets. Normal content updates ship via deploy.
- For manual path refresh without deploy, call `POST /api/revalidate` with `REVALIDATE_SECRET` and paths/tags as needed, e.g. `{"tags":["insights"],"paths":["/tally-insights","/tally-insights/<section>","/tally-insights/<section>/<lesson>","/sitemap.xml"]}`.
- Validation requested by user to be skipped (repo deployed on Mumbai servers); `tsc --noEmit` was run as a cheap safety check and passed.