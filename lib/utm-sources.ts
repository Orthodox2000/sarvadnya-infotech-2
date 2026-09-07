// CHANGE: 2026-09-07 — UTM source identification dictionary (source-only model).
// The site tracks / displays ONLY utm_source. This module maps a raw source code to a
// human label + category so emails and stored records show "Google Ads (Paid)" instead
// of raw codes like "google_ads". Unknown codes fall back to a humanized label + "Other".

export type UtmSourceCategory =
  | 'Paid'
  | 'Organic'
  | 'Social'
  | 'Email'
  | 'Local'
  | 'Referral'
  | 'Direct'
  | 'Offline'
  | 'Other';

export interface UtmSourceDef {
  /** Canonical value used in links (?utm_source=<source>) and stored in utmParams. */
  source: string;
  /** Human label shown in the internal email and records. */
  label: string;
  category: UtmSourceCategory;
  /** Accepted alternative spellings of the same source. */
  aliases?: string[];
}

export interface UtmSourceInfo {
  /** Canonical source code (raw value for unknown sources). */
  source: string;
  label: string;
  category: UtmSourceCategory;
}

export const UTM_SOURCES: UtmSourceDef[] = [
  { source: 'google_ads', label: 'Google Ads', category: 'Paid', aliases: ['adwords', 'googleads', 'google-ads', 'google-adwords', 'google adwords', 'ppc', 'google_ppc'] },
  { source: 'google', label: 'Google Search (Organic)', category: 'Organic', aliases: ['google-organic', 'google_organic', 'organic', 'gsearch'] },
  { source: 'facebook_ads', label: 'Facebook / Meta Ads', category: 'Paid', aliases: ['fb_ads', 'meta_ads', 'facebookads', 'meta ads', 'facebook ads'] },
  { source: 'facebook', label: 'Facebook Page', category: 'Social', aliases: ['fb', 'facebook page', 'fb_page'] },
  { source: 'instagram', label: 'Instagram', category: 'Social', aliases: ['ig', 'insta'] },
  { source: 'linkedin_ads', label: 'LinkedIn Ads', category: 'Paid', aliases: ['linkedinads', 'linkedin ads'] },
  { source: 'linkedin', label: 'LinkedIn', category: 'Social', aliases: ['in'] },
  { source: 'youtube', label: 'YouTube', category: 'Social', aliases: ['yt'] },
  { source: 'whatsapp', label: 'WhatsApp', category: 'Social', aliases: ['wa', 'whats app'] },
  { source: 'telegram', label: 'Telegram', category: 'Social', aliases: ['tg'] },
  { source: 'x', label: 'X / Twitter', category: 'Social', aliases: ['twitter'] },
  { source: 'email', label: 'Email Newsletter', category: 'Email', aliases: ['newsletter', 'news letter', 'mailchimp', 'mail'] },
  { source: 'justdial', label: 'JustDial', category: 'Local', aliases: ['jd', 'just dial', 'justdial listing'] },
  { source: 'indiamart', label: 'IndiaMART', category: 'Local', aliases: ['im', 'indiamart lead'] },
  { source: 'google_maps', label: 'Google Maps', category: 'Local', aliases: ['maps', 'gmb', 'google maps listing', 'google my business'] },
  { source: 'referral', label: 'Referral', category: 'Referral', aliases: ['reference', 'ref', 'referred'] },
  { source: 'partner', label: 'Partner', category: 'Referral', aliases: ['channel', 'reseller'] },
  { source: 'direct', label: 'Direct', category: 'Direct', aliases: ['website', 'site', 'none'] },
  { source: 'offline', label: 'Offline / Campaign', category: 'Offline', aliases: ['event', 'expo', 'trade_show', 'qr', 'qr_code', 'tv', 'banner', 'flyer', 'visiting card', 'card'] },
];

function normalizeKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Identify a raw utm_source value. Returns the canonical source, a human label
 * and a category. Unknown / empty values get a safe fallback (never throws).
 */
export function identifyUtmSource(raw?: string | null): UtmSourceInfo {
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (!value) return { source: '', label: '—', category: 'Other' };

  const key = normalizeKey(value);
  for (const def of UTM_SOURCES) {
    if (key === def.source || def.aliases?.some((a) => normalizeKey(a) === key)) {
      return { source: def.source, label: def.label, category: def.category };
    }
  }

  // Fallback: humanize the raw code for display (e.g. "fb_ads_jan26" → "Fb Ads Jan26").
  const human = value
    .split(/[_\-.]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .slice(0, 60);
  return { source: value, label: human || value, category: 'Other' };
}