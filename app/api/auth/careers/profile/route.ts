import { NextRequest, NextResponse } from 'next/server';
import { getCareersUsersCollection, getCurrentCareersUser } from '@/lib/careers-auth';
import { isIgnoredRequest } from '@/lib/visitors';
import { createRateLimiter } from '@/lib/rate-limit';

/**
 * CHANGE: 2026-10-17 — careers candidate profile details.
 * WHY: the post-login "Personal Details" section shows the candidate's own details behind a lock;
 * pressing Unlock + Save persists them here, and the job application form autofills from the
 * stored values. Previously the account had ONLY fullName/phone/email, so the application form's
 * qualification/skills/experience autofill had no source.
 *
 * SECURITY:
 *  - Auth is required (getCurrentCareersUser) — this is a private, session-scoped write.
 *  - Only an explicit ALLOW-LIST of fields can ever be written. `passwordHash`, `referralCode`,
 *    `referredBy`, `_id`, `createdAt` and the referral attribution are NOT editable here (the
 *    referral is fixed at signup by design).
 *  - `email` is the login identity, so changing it checks that no OTHER account already owns it.
 *  - Every field is length-capped and stripped of angle brackets / control chars.
 *  - Per-IP limiter (same shared limiter as the other careers routes).
 */
const profileLimiter = createRateLimiter(Number(process.env.CAREERS_PROFILE_RATE_LIMIT || 30), 60_000);

const GENDERS = new Set(['Male', 'Female', 'Other', 'Prefer not to say']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Trim, drop control chars + angle brackets, and cap the length. */
function clean(value: unknown, max: number): string {
  return String(value ?? '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F<>]/g, '')
    .trim()
    .slice(0, max);
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

    const currentUser = await getCurrentCareersUser();
    if (!currentUser || !currentUser._id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rl = profileLimiter.check(clientIp(req));
    if (rl.limited) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': `${rl.retryAfter}s` } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const users = await getCareersUsersCollection();

    const updates: Record<string, unknown> = {};

    // ---- Email (login identity) — validate + uniqueness-check against OTHER accounts ----
    if (body.email !== undefined) {
      const email = clean(body.email, 254).toLowerCase();
      if (!EMAIL_RE.test(email)) {
        return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
      }
      if (email !== (currentUser.email || '').toLowerCase()) {
        const owner = await users.findOne({ email }, { projection: { _id: 1 } });
        if (owner && String(owner._id) !== String(currentUser._id)) {
          return NextResponse.json({ error: 'That email is already registered.' }, { status: 409 });
        }
      }
      updates.email = email;
    }

    // ---- Plain text fields ----
    if (body.fullName !== undefined) updates.fullName = clean(body.fullName, 120);
    if (body.phone !== undefined) {
      // Keep the phone human-typed but strip everything that is not a digit or a leading +.
      updates.phone = String(body.phone ?? '')
        .replace(/[^0-9+]/g, '')
        .slice(0, 20);
    }
    if (body.qualification !== undefined) updates.qualification = clean(body.qualification, 120);
    if (body.skills !== undefined) updates.skills = clean(body.skills, 240);
    if (body.experience !== undefined) updates.experience = clean(body.experience, 60);
    if (body.experienceDetails !== undefined) updates.experienceDetails = clean(body.experienceDetails, 300);
    if (body.city !== undefined) updates.city = clean(body.city, 120);

    // ---- Gender — fixed vocabulary (blank clears it) ----
    if (body.gender !== undefined) {
      const gender = clean(body.gender, 40);
      if (gender && !GENDERS.has(gender)) {
        return NextResponse.json({ error: 'Please choose a valid gender option.' }, { status: 400 });
      }
      updates.gender = gender;
    }

    // ---- Age — integer 14-100 (blank clears it) ----
    if (body.age !== undefined) {
      const raw = String(body.age ?? '').trim();
      if (raw === '') {
        updates.age = null;
      } else {
        const age = Number(raw);
        if (!Number.isInteger(age) || age < 14 || age > 100) {
          return NextResponse.json({ error: 'Age must be a whole number between 14 and 100.' }, { status: 400 });
        }
        updates.age = age;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
    }

    updates.updatedAt = new Date();
    await users.updateOne({ _id: currentUser._id }, { $set: updates });

    // Return the fresh safe record so the client can refresh its state without a second fetch.
    const fresh = await users.findOne({ _id: currentUser._id });
    if (!fresh) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const { passwordHash: _omit, ...safeUser } = fresh as Record<string, unknown>;
    return NextResponse.json({ ok: true, user: safeUser });
  } catch (err) {
    console.error('Profile update error:', err);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
