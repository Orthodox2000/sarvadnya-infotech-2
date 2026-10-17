import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import { getDb } from './mongodb-utils';

export const CAREERS_SESSION_COOKIE = '__careers_session';
export const CAREERS_SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export interface CareersUser {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  fullName?: string;
  phone?: string;
  resumeUrl?: string;
  resumeName?: string;
  // CHANGE: 2026-10-16 — careers referral system. `referralCode` is this user's OWN unique
  // 8-char uppercase code (see lib/careers-referral.mjs); `referredBy`/`referredAt` record
  // WHO referred this account at signup (fixed at signup — never editable afterwards).
  referralCode?: string;
  referredBy?: string;
  referredAt?: Date;
  // CHANGE: 2026-10-17 — candidate profile details. Stored on the account so the post-login
  // "Personal Details" section can show/lock them and the job application form can autofill.
  // All optional; empty means the candidate has not filled that field yet. `age` is a number
  // (validated 14-100 server-side); everything else is a short string.
  gender?: string;
  age?: number;
  qualification?: string;
  skills?: string;
  experience?: string;
  experienceDetails?: string;
  city?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CareersSession {
  _id?: ObjectId;
  userId: ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  userAgent?: string;
  ip?: string;
}

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

export function hashPassword(password: string): string {
  // Store as bcrypt (modern). Cost 10 is reasonable.
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function hashPasswordLegacy(password: string): string {
  return crypto.pbkdf2Sync(password, 'careers-salt', 100000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  if (!hash) return false;
  // Detect bcrypt/argon2 style hashes ($...)
  if (typeof hash === 'string' && hash.startsWith('$')) {
    try {
      return bcrypt.compareSync(password, hash);
    } catch (e) {
      return false;
    }
  }
  // Legacy pbkdf2 hex
  try {
    const legacy = hashPasswordLegacy(password);
    return crypto.timingSafeEqual(Buffer.from(legacy, 'hex'), Buffer.from(hash, 'hex'));
  } catch (e) {
    return false;
  }
}

export function generateToken(): string {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

export async function getCareersUsersCollection() {
  const db = await getDb();
  return db.collection<CareersUser>('careers_users');
}

export async function getCareersSessionsCollection() {
  const db = await getDb();
  return db.collection<CareersSession>('careers_sessions');
}

export async function createCareersSession(userId: ObjectId, userAgent?: string, ip?: string): Promise<string> {
  const sessions = await getCareersSessionsCollection();
  const token = generateToken();
  const expiresAt = new Date(Date.now() + CAREERS_SESSION_MAX_AGE * 1000);
  
  await sessions.insertOne({
    userId,
    token,
    expiresAt,
    createdAt: new Date(),
    userAgent,
    ip,
  });
  
  return token;
}

export async function getCurrentCareersUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(CAREERS_SESSION_COOKIE)?.value;
    if (!token) return null;
    
    const sessions = await getCareersSessionsCollection();
    const session = await sessions.findOne({ token, expiresAt: { $gt: new Date() } });
    if (!session) return null;
    
    const users = await getCareersUsersCollection();
    const user = await users.findOne({ _id: session.userId });
    if (!user) return null;
    
    const { passwordHash, ...safeUser } = user;
    return safeUser as Omit<CareersUser, 'passwordHash'>;
  } catch {
    return null;
  }
}

export async function setCareersSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(CAREERS_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: CAREERS_SESSION_MAX_AGE,
  });
}

export async function clearCareersSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CAREERS_SESSION_COOKIE)?.value;
  
  if (token) {
    const sessions = await getCareersSessionsCollection();
    await sessions.deleteOne({ token });
  }
  
  cookieStore.delete(CAREERS_SESSION_COOKIE);
}
