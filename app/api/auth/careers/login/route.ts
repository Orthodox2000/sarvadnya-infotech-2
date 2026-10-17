import { NextRequest, NextResponse } from 'next/server';
import { getCareersUsersCollection, verifyPassword, createCareersSession, setCareersSessionCookie, hashPassword } from '@/lib/careers-auth';
import { isIgnoredRequest } from '@/lib/visitors';
// CHANGE: 2026-10-16 — lazy referral-code backfill for accounts created before the referral
// system (the migration script covers them in bulk; this keeps ANY straggler working the
// moment they log in, so the profile card can never show an empty code).
import { generateUniqueReferralCode } from '@/lib/careers-referral.mjs';

export async function POST(req: NextRequest) {
  try {
    if (isIgnoredRequest(req)) {
      return NextResponse.json({ error: 'Request blocked' }, { status: 403 });
    }
    
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    const users = await getCareersUsersCollection();
    const user = await users.findOne({ email: email.toLowerCase() });
    
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const updates: any = { lastLoginAt: new Date(), updatedAt: new Date() };
    if (typeof user.passwordHash === 'string' && !user.passwordHash.startsWith('$')) {
      updates.passwordHash = hashPassword(password);
    }
    // CHANGE: 2026-10-16 — give pre-referral accounts their own code on first login.
    let referralCode = user.referralCode;
    if (!referralCode) {
      referralCode = await generateUniqueReferralCode(async (code) =>
        (await users.findOne({ referralCode: code }, { projection: { _id: 1 } })) !== null
      );
      updates.referralCode = referralCode;
    }
    await users.updateOne(
      { _id: user._id },
      { $set: updates }
    );

    const userAgent = req.headers.get('user-agent') || undefined;
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : undefined;

    const token = await createCareersSession(user._id, userAgent, ip);
    await setCareersSessionCookie(token);

    const { passwordHash: _, ...safeUser } = user;
    const serialized = {
      _id: safeUser._id.toString(),
      email: safeUser.email,
      fullName: safeUser.fullName || '',
      phone: safeUser.phone || '',
      // CHANGE: 2026-10-17 — candidate profile details (see lib/careers-auth.ts). Included here
      // so the post-login Personal Details section renders immediately after a fresh login.
      gender: safeUser.gender,
      age: safeUser.age,
      qualification: safeUser.qualification,
      skills: safeUser.skills,
      experience: safeUser.experience,
      experienceDetails: safeUser.experienceDetails,
      city: safeUser.city,
      resumeUrl: safeUser.resumeUrl,
      resumeName: safeUser.resumeName,
      referralCode: referralCode || undefined,
      referredBy: safeUser.referredBy,
      lastLoginAt: safeUser.lastLoginAt,
      createdAt: safeUser.createdAt,
      updatedAt: safeUser.updatedAt,
    };
    
    return NextResponse.json({ user: serialized });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
