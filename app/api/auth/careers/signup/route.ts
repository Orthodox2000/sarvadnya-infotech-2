import { NextRequest, NextResponse } from 'next/server';
import { getCareersUsersCollection, hashPassword, createCareersSession, setCareersSessionCookie } from '@/lib/careers-auth';
import { isIgnoredRequest } from '@/lib/visitors';
// CHANGE: 2026-10-16 — careers referral system.
// 1) `createRateLimiter`: signup is an unauthenticated write route and careers auth had NO
//    rate limiting at all (every other public write route has one since 2026-10-08).
// 2) referral helpers: validate the optional `referralCode` (uppercase 8-char unique ID,
//    must belong to an existing account) and generate every new user's OWN code.
import { createRateLimiter } from '@/lib/rate-limit';
import {
  normalizeReferralCode,
  isValidReferralCodeFormat,
  generateUniqueReferralCode,
} from '@/lib/careers-referral.mjs';

// CHANGE: 2026-10-16 — per-IP fixed window (20 signups/min is far above any human rate).
// CHANGE: 2026-10-17 — env-overridable like every other public-write limiter (see .env.example).
const signupLimiter = createRateLimiter(Number(process.env.CAREERS_SIGNUP_RATE_LIMIT || 20), 60_000);

// CHANGE: 2026-10-16 — ensure the referral indexes once per warm instance. The UNIQUE index
// on `referralCode` is PARTIAL (only docs that HAVE a code) so the pre-referral backfill
// documents never block it; `referredBy` is a plain lookup index for the referral count /
// admin tables. Failure is logged and swallowed: the code generator also checks collisions
// via findOne, so a missing index degrades safety slightly rather than breaking signup.
let referralIndexesReady: Promise<unknown> | null = null;
function ensureReferralIndexes(users: Awaited<ReturnType<typeof getCareersUsersCollection>>) {
  if (!referralIndexesReady) {
    referralIndexesReady = Promise.all([
      users.createIndex(
        { referralCode: 1 },
        {
          unique: true,
          partialFilterExpression: { referralCode: { $type: 'string' } },
          name: 'careers_users_referralcode_unique',
        }
      ),
      users.createIndex({ referredBy: 1 }, { name: 'careers_users_referredby' }),
    ]).catch((err) => {
      referralIndexesReady = null;
      console.error('careers referral index ensure failed:', err);
    });
  }
  return referralIndexesReady;
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    if (isIgnoredRequest(req)) {
      return NextResponse.json({ error: 'Request blocked' }, { status: 403 });
    }

    // CHANGE: 2026-10-16 — rate limit BEFORE parsing the body, like the cart order route.
    const rl = signupLimiter.check(clientIp(req));
    if (rl.limited) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': `${rl.retryAfter}s` } }
      );
    }

    const { email, password, fullName, phone, referralCode: rawReferral } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const users = await getCareersUsersCollection();
    await ensureReferralIndexes(users);

    // CHANGE: 2026-10-16 — validate the optional referral code. An EMPTY input means "no
    // referral" (the signup form hides the field by default); a non-empty input must be a
    // well-formed code that EXISTS on another account, else signup is blocked with a
    // distinct `code` the client uses for its 3-strike "continue without referral" hint.
    let referredBy: string | undefined;
    if (rawReferral != null && String(rawReferral).trim() !== '') {
      const code = normalizeReferralCode(String(rawReferral));
      if (!isValidReferralCodeFormat(code)) {
        return NextResponse.json(
          { error: 'This referral code is invalid.', code: 'INVALID_REFERRAL' },
          { status: 400 }
        );
      }
      const referrer = await users.findOne({ referralCode: code }, { projection: { _id: 1 } });
      if (!referrer) {
        return NextResponse.json(
          { error: 'This referral code is invalid.', code: 'INVALID_REFERRAL' },
          { status: 400 }
        );
      }
      referredBy = code;
    }

    const existing = await users.findOne({ email: email.toLowerCase() });

    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // CHANGE: 2026-10-16 — every account gets its OWN unique referral code (collision-checked
    // against the DB; the partial unique index backs this up if two warm instances race).
    const referralCode = await generateUniqueReferralCode(async (code) =>
      (await users.findOne({ referralCode: code }, { projection: { _id: 1 } })) !== null
    );

    const now = new Date();
    const passwordHash = hashPassword(password);
    const result = await users.insertOne({
      email: email.toLowerCase(),
      passwordHash,
      fullName: fullName || '',
      phone: phone || '',
      referralCode,
      ...(referredBy ? { referredBy, referredAt: now } : {}),
      createdAt: now,
      updatedAt: now,
    });

    const userAgent = req.headers.get('user-agent') || undefined;
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : undefined;

    const token = await createCareersSession(result.insertedId, userAgent, ip);
    await setCareersSessionCookie(token);

    const safeUser = {
      _id: result.insertedId.toString(),
      email: email.toLowerCase(),
      fullName: fullName || '',
      phone: phone || '',
      referralCode,
      referredBy: referredBy || undefined,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
