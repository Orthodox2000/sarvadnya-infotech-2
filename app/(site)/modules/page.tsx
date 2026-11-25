import type { Module } from '@/lib/modules';
import { getModules } from '@/lib/mongodb-utils';
import ModulesPageClient from './ModulesPageClient';

// CHANGE: 2026-11-24 — server-rendered modules listing, no client fetch waterfall.
// WHY: the old 'use client' page fetched /api/modules after hydration on every visit. Modules
// change rarely, so we read from the cached getModules() (unstable_cache, tag 'modules') during
// ISR and pass the data as props. This removes client CPU, an extra request, and origin work.
// CHANGE: 2026-11-25 — 6h -> 24h ISR for the high-traffic hands-off window (no edits planned).
// Matches the module API cache TTL; admin/manual changes should call /api/revalidate.
export const revalidate = 86400;

export default async function ModulesPage() {
  let modules: Module[] = [];
  try {
    modules = (await getModules()) as Module[];
  } catch (error) {
    console.error('Modules page: failed to load modules', error);
  }

  return <ModulesPageClient modules={modules} />;
}
