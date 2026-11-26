import { getSettings } from '@/lib/mongodb-utils';
import { STATIC_SITE_SETTINGS } from '@/lib/static-site-content';

// CHANGE: 2026-11-26 — ONE source of truth for the social URLs used by email
// templates. The values live in the admin-managed `settings` collection (the same
// NEXT_PUBLIC_* keys /api/settings reads), NOT in the templates. Every value that
// leaves this module is a validated absolute http(s) URL, so a bad DB value can
// never inject a javascript: or data: href into a copied/pasted signature.

export interface SocialLinks {
  whatsapp: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  youtube: string;
}

/** Accept only absolute http(s) URLs; everything else is treated as "not configured". */
function safeUrl(value: unknown): string {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
    return url.href;
  } catch {
    return '';
  }
}

/** WhatsApp accepts either a full URL or a phone number (10 or 12 digits). */
function whatsappUrl(value: unknown): string {
  const asUrl = safeUrl(value);
  if (asUrl) return asUrl;
  const digits = String(value ?? '').replace(/\D/g, '');
  if (!digits) return '';
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
}

/**
 * The "fixed reply string" fallback. Mirrors the committed public snapshot
 * (lib/static-site-content.ts, taken from the live cluster on 2026-11-25) so the
 * signature still works when the API or the DB is unreachable, or the template is
 * opened offline from a local file.
 */
export const SOCIAL_LINK_FALLBACKS: Readonly<SocialLinks> = Object.freeze({
  whatsapp: whatsappUrl(STATIC_SITE_SETTINGS.whatsapp_phone) || 'https://wa.me/919870942557',
  linkedin: safeUrl(STATIC_SITE_SETTINGS.linkedin_url),
  instagram: safeUrl(STATIC_SITE_SETTINGS.instagram_url),
  // The email templates deliberately keep the Facebook icon UNLINKED (owner ruling,
  // 2026-11-20). The value is still served so it is available if that changes.
  facebook: safeUrl(STATIC_SITE_SETTINGS.facebook_url),
  youtube: safeUrl(STATIC_SITE_SETTINGS.youtube_url),
});

/** Pure normaliser — also used by the route so DB values and fallbacks cannot drift. */
export function normalizeSocialLinks(settings: Record<string, unknown> = {}): SocialLinks {
  const firstSet = (...keys: string[]): unknown => {
    for (const key of keys) {
      const value = settings[key];
      if (value !== undefined && value !== null && String(value).trim()) return value;
    }
    return '';
  };

  return {
    whatsapp:
      whatsappUrl(firstSet('NEXT_PUBLIC_WHATSAPP_URL', 'NEXT_PUBLIC_WHATSAPP_PHONE')) ||
      SOCIAL_LINK_FALLBACKS.whatsapp,
    linkedin: safeUrl(firstSet('NEXT_PUBLIC_LINKEDIN_URL')) || SOCIAL_LINK_FALLBACKS.linkedin,
    instagram: safeUrl(firstSet('NEXT_PUBLIC_INSTAGRAM_URL')) || SOCIAL_LINK_FALLBACKS.instagram,
    facebook: safeUrl(firstSet('NEXT_PUBLIC_FACEBOOK_URL')) || SOCIAL_LINK_FALLBACKS.facebook,
    youtube: safeUrl(firstSet('NEXT_PUBLIC_YOUTUBE_URL')) || SOCIAL_LINK_FALLBACKS.youtube,
  };
}

/** DB-backed resolver. Any settings failure degrades to the fixed strings above. */
export async function getSocialLinks(): Promise<SocialLinks> {
  try {
    return normalizeSocialLinks(await getSettings());
  } catch (error) {
    console.error('social-links: settings read failed, using fixed fallbacks', error);
    return { ...SOCIAL_LINK_FALLBACKS };
  }
}
