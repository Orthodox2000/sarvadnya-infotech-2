import { NextResponse } from 'next/server';
import { getCurrentCareersUser, getCareersUsersCollection } from '@/lib/careers-auth';

// CHANGE: 2026-10-16 — careers referral system: powers the "N referred" line on the
// member's referral card. Auth-gated (own stats only) and read-only — it never exposes
// WHO was referred, just the count, so no candidate PII leaks to a member.
export async function GET() {
  const user = await getCurrentCareersUser();
  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const referralCode = user.referralCode || null;
  if (!referralCode) {
    // Pre-backfill account that has never logged in through the lazy path — no code yet.
    return NextResponse.json({ ok: true, referralCode: null, referredCount: 0 });
  }

  try {
    const users = await getCareersUsersCollection();
    const referredCount = await users.countDocuments({ referredBy: referralCode });
    return NextResponse.json({ ok: true, referralCode, referredCount });
  } catch (err) {
    console.error('Referral stats error:', err);
    return NextResponse.json({ ok: true, referralCode, referredCount: 0 });
  }
}
