import { NextResponse } from 'next/server';
import { getSettings, updateSetting } from '@/lib/mongodb-utils';

export async function GET() {
  try {
    const settingsMap = await getSettings();
    const settings = Object.entries(settingsMap).map(([key, value]) => ({ key, value: value as string }));
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { settings } = await request.json();
    if (!Array.isArray(settings)) {
      return NextResponse.json({ error: 'Settings must be an array' }, { status: 400 });
    }

    for (const setting of settings) {
      await updateSetting(setting.key, setting.value);
    }

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
