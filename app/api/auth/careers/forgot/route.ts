import { NextRequest, NextResponse } from 'next/server';
import { getCareersUsersCollection } from '@/lib/careers-auth';
import { isIgnoredRequest } from '@/lib/visitors';
import { sendOtpEmail } from '@/lib/email-otp';
import { randomInt } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    if (isIgnoredRequest(req)) {
      return NextResponse.json({ ok: true });
    }

    const body = await req.json().catch(() => ({}));
    const email = (body.email || '').toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ ok: true });
    }

    const users = await getCareersUsersCollection();
    const user = await users.findOne({ email });

    // Enumeration-safe response
    if (!user) {
      return NextResponse.json({ ok: true });
    }

    const { getPasswordResetsCollection } = await import('@/lib/careers-reset');
    const resets = await getPasswordResetsCollection();
    await resets.deleteMany({ email, used: false, expiresAt: { $lt: new Date() } });
    await resets.deleteMany({ userId: user._id, used: false, expiresAt: { $lt: new Date() } });

    const otp = String(randomInt(100000, 999999));
    const otpHash = require('crypto').createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const attempts = 0;
    const userAgent = req.headers.get('user-agent') || undefined;
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : undefined;

    await resets.insertOne({
      userId: user._id,
      email: user.email.toLowerCase(),
      otpHash,
      expiresAt,
      attempts,
      used: false,
      createdAt: new Date(),
      ip,
      userAgent,
    });

    try {
      await sendOtpEmail({ to: user.email, otp, expiryMin: 10 });
    } catch (e) {
      console.warn('Failed to send OTP email:', e);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ ok: true });
  }
}