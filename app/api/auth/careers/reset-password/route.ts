import { NextRequest, NextResponse } from 'next/server';
import { getCareersUsersCollection, hashPassword } from '@/lib/careers-auth';
import { isIgnoredRequest } from '@/lib/visitors';
import { createHash } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    if (isIgnoredRequest(req)) {
      return NextResponse.json({ error: 'Blocked' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const resetToken = (body.resetToken || '').trim();
    const password = (body.password || '').trim();

    if (!resetToken || !password) {
      return NextResponse.json({ error: 'Reset token and password required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const resetTokenHash = createHash('sha256').update(resetToken).digest('hex');
    const { getPasswordResetsCollection } = await import('@/lib/careers-reset');
    const resets = await getPasswordResetsCollection();
    const record = await resets.findOne({ resetTokenHash, used: false, resetTokenExpiresAt: { $gt: new Date() } });

    if (!record) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    const users = await getCareersUsersCollection();
    const user = await users.findOne({ _id: record.userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const passwordHash = hashPassword(password);
    await users.updateOne({ _id: user._id }, { $set: { passwordHash, updatedAt: new Date() } });

    const { getCareersSessionsCollection } = await import('@/lib/careers-auth');
    const sessions = await getCareersSessionsCollection();
    await sessions.deleteMany({ userId: user._id });

    await resets.updateOne({ _id: record._id }, { $set: { used: true } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}