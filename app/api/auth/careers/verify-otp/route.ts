import { NextRequest, NextResponse } from 'next/server';
import { isIgnoredRequest } from '@/lib/visitors';
import { randomBytes, createHash } from 'crypto';

const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  try {
    if (isIgnoredRequest(req)) {
      return NextResponse.json({ error: 'Blocked' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const email = (body.email || '').toLowerCase().trim();
    const otp = (body.otp || '').trim();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP required' }, { status: 400 });
    }

    const { getPasswordResetsCollection } = await import('@/lib/careers-reset');
    const resets = await getPasswordResetsCollection();
    const record = await resets.findOne({ email, used: false, expiresAt: { $gt: new Date() } });

    if (!record) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      await resets.updateOne({ _id: record._id }, { $set: { used: true } });
      return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
    }

    const otpHash = createHash('sha256').update(otp).digest('hex');
    if (otpHash !== record.otpHash) {
      await resets.updateOne({ _id: record._id }, { $inc: { attempts: 1 }, $set: { updatedAt: new Date() } });
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenHash = createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await resets.updateOne({ _id: record._id }, { $set: { resetTokenHash, resetTokenExpiresAt, attempts: record.attempts } });

    return NextResponse.json({ ok: true, resetToken });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}