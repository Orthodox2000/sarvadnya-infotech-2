import { getSettings } from './mongodb-utils';

export type SiteSettings = {
  support_phone: string;
  whatsapp_phone: string;
  support_email: string;
  office_address: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  facebook_handle: string;
  instagram_handle: string;
  linkedin_handle: string;
  map_iframe_url: string;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settingsMap = await getSettings();

    return {
      support_phone: settingsMap['NEXT_PUBLIC_SUPPORT_PHONE'] || process.env.NEXT_PUBLIC_SUPPORT_PHONE || '',
      whatsapp_phone: settingsMap['NEXT_PUBLIC_WHATSAPP_PHONE'] || settingsMap['NEXT_PUBLIC_SUPPORT_PHONE'] || process.env.NEXT_PUBLIC_WHATSAPP_PHONE || process.env.NEXT_PUBLIC_SUPPORT_PHONE || '',
      support_email: settingsMap['NEXT_PUBLIC_SUPPORT_EMAIL'] || process.env.NEXT_PUBLIC_SUPPORT_EMAIL || '',
      office_address: settingsMap['NEXT_PUBLIC_OFFICE_ADDRESS'] || process.env.NEXT_PUBLIC_OFFICE_ADDRESS || '',
      facebook_url: settingsMap['NEXT_PUBLIC_FACEBOOK_URL'] || process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
      instagram_url: settingsMap['NEXT_PUBLIC_INSTAGRAM_URL'] || process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
      linkedin_url: settingsMap['NEXT_PUBLIC_LINKEDIN_URL'] || process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
      facebook_handle: settingsMap['NEXT_PUBLIC_FACEBOOK_HANDLE'] || 'Sarvadnya Infotech',
      instagram_handle: settingsMap['NEXT_PUBLIC_INSTAGRAM_HANDLE'] || '@sarvadnya_infotech',
      linkedin_handle: settingsMap['NEXT_PUBLIC_LINKEDIN_HANDLE'] || 'Sarvadnya Infotech LLP',
      map_iframe_url: settingsMap['NEXT_PUBLIC_MAP_IFRAME_URL'] || process.env.NEXT_PUBLIC_MAP_IFRAME_URL || '',
    };
  } catch (err) {
    console.error('Error fetching site settings from MongoDB:', err);
    // Fallback to environment variables
    return {
      support_phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || '9821309060',
      whatsapp_phone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || process.env.NEXT_PUBLIC_SUPPORT_PHONE || '9821309060',
      support_email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'info@sarvadnyainfotech.com',
      office_address: process.env.NEXT_PUBLIC_OFFICE_ADDRESS || '',
      facebook_url: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
      instagram_url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
      linkedin_url: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
      facebook_handle: 'Sarvadnya Infotech',
      instagram_handle: '@sarvadnya_infotech',
      linkedin_handle: 'Sarvadnya Infotech LLP',
      map_iframe_url: process.env.NEXT_PUBLIC_MAP_IFRAME_URL || '',
    };
  }
}
