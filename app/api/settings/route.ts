import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/mongodb-utils';

export async function GET() {
  try {
    const settingsMap = await getSettings();
    const settings = {
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
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
