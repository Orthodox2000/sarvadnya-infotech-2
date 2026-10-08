import { NextRequest, NextResponse } from 'next/server';
import { getCareersUsersCollection, getCareersSessionsCollection, verifyPassword, hashPassword, getCurrentCareersUser } from '@/lib/careers-auth';
import { isIgnoredRequest } from '@/lib/visitors';

export async function POST(req: NextRequest) {
  try {
    if (isIgnoredRequest(req)) {
      return NextResponse.json({ error: 'Blocked' }, { status: 403 });
    }

    const currentUser = await getCurrentCareersUser();
    if (!currentUser || !currentUser._id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const currentPassword = (body.currentPassword || '').trim();
    const newPassword = (body.newPassword || '').trim();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current and new password required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
    }

    const users = await getCareersUsersCollection();
    const user = await users.findOne({ _id: currentUser._id });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!verifyPassword(currentPassword, user.passwordHash)) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    const passwordHash = hashPassword(newPassword);
    await users.updateOne({ _id: user._id }, { $set: { passwordHash, updatedAt: new Date() } });

    const sessions = await getCareersSessionsCollection();
    await sessions.deleteMany({ userId: user._id });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Change password error:', err);
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}