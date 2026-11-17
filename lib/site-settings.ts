// CHANGE: 2026-11-16 — single normaliser for the settings document.
// WHY: getSettings() (lib/mongodb-utils.ts) returns the RAW settings map, whose keys are the
// uppercase document keys (NEXT_PUBLIC_FACEBOOK_URL, NEXT_PUBLIC_WHATSAPP_PHONE, ...), while
// components read snake_case fields (facebook_url, whatsapp_phone). app/(site)/page.tsx and
// app/(site)/layout.tsx passed that raw map as `initialSettings`, so every lookup was
// undefined AND the client /api/settings fallback was skipped because the prop was truthy.
// Result on the live site: the homepage footer social icons stayed href="#" forever
// (Facebook/Instagram/LinkedIn never opened), and the floating WhatsApp button fell back to
// the support number instead of the configured WhatsApp number.
// This helper accepts either shape (raw map or already-normalised) so callers cannot get it
// wrong again.

export type SiteSettingsShape = {
  support_phone: string;
  whatsapp_phone: string;
  support_email: string;
  office_address: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
  facebook_handle: string;
  instagram_handle: string;
  linkedin_handle: string;
  youtube_handle: string;
  map_iframe_url: string;
};

// snake_case field -> raw settings document key
const RAW_KEYS: Record<keyof SiteSettingsShape, string> = {
  support_phone: 'NEXT_PUBLIC_SUPPORT_PHONE',
  whatsapp_phone: 'NEXT_PUBLIC_WHATSAPP_PHONE',
  support_email: 'NEXT_PUBLIC_SUPPORT_EMAIL',
  office_address: 'NEXT_PUBLIC_OFFICE_ADDRESS',
  facebook_url: 'NEXT_PUBLIC_FACEBOOK_URL',
  instagram_url: 'NEXT_PUBLIC_INSTAGRAM_URL',
  linkedin_url: 'NEXT_PUBLIC_LINKEDIN_URL',
  youtube_url: 'NEXT_PUBLIC_YOUTUBE_URL',
  facebook_handle: 'NEXT_PUBLIC_FACEBOOK_HANDLE',
  instagram_handle: 'NEXT_PUBLIC_INSTAGRAM_HANDLE',
  linkedin_handle: 'NEXT_PUBLIC_LINKEDIN_HANDLE',
  youtube_handle: 'NEXT_PUBLIC_YOUTUBE_HANDLE',
  map_iframe_url: 'NEXT_PUBLIC_MAP_IFRAME_URL',
};

const asString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : typeof value === 'number' ? String(value) : '';

export function normaliseSettings(input?: Record<string, unknown> | null): SiteSettingsShape | null {
  if (!input || typeof input !== 'object') return null;

  const out = {} as SiteSettingsShape;
  let found = false;
  for (const field of Object.keys(RAW_KEYS) as (keyof SiteSettingsShape)[]) {
    out[field] = asString(input[field]) || asString(input[RAW_KEYS[field]]);
    if (out[field]) found = true;
  }

  // Nothing recognised (empty settings collection / DB failure): return null so components keep
  // their client-side /api/settings fetch instead of freezing on empty values.
  if (!found) return null;

  // Same fallback the /api/settings route uses: an unset WhatsApp number is the support number.
  if (!out.whatsapp_phone) out.whatsapp_phone = out.support_phone;

  return out;
}
