import { NextResponse } from 'next/server';
import { updateSetting } from '@/lib/mongodb-utils';

export async function POST(request: Request) {
  try {
    const { paletteId, bgIndex } = await request.json();
    
    if (!paletteId) {
      return NextResponse.json({ error: 'Palette ID required' }, { status: 400 });
    }

    // Store as a JSON string in settings
    await updateSetting('SITE_THEME_PALETTE', JSON.stringify({ paletteId, bgIndex }));

    return NextResponse.json({ success: true, message: 'Theme updated successfully' });
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}
