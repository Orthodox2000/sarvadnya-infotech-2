import type { Module } from '@/lib/modules';
import { getModules } from '@/lib/mongodb-utils';
import ModulesPageClient from './ModulesPageClient';

// CHANGE: 2026-11-24 — server-rendered modules listing, no client fetch waterfall.
// WHY: the old 'use client' page fetched /api/modules after hydration on every visit. Modules
// change rarely, so we read from the cached getModules() (unstable_cache, tag 'modules') during
// ISR and pass the data as props. This removes client CPU, an extra request, and origin work.
// 6-hour ISR matches the module cache TTL; admin/manual changes should call /api/revalidate.
export const revalidate = 21600;

export default async function ModulesPage() {
  let modules: Module[] = [];
  try {
    modules = (await getModules()) as Module[];
  } catch (error) {
    console.error('Modules page: failed to load modules', error);
  }

  return <ModulesPageClient modules={modules} />;
}
