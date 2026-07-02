import { cookies } from 'next/headers';

const COOKIE_NAME = '__admin_token';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

function getSecret(): string {
  return process.env.ADMIN_ACCESS_KEY || process.env.NEXTAUTH_SECRET || 'fallback-dev-key-change-in-production';
}

function base64Encode(str: string): string {
  return Buffer.from(str).toString('base64url');
}

function base64Decode(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf-8');
}

export function generateToken(): string {
  const secret = getSecret();
  const payload = JSON.stringify({ t: Date.now(), s: secret });
  return base64Encode(payload);
}

export function verifyToken(token: string): boolean {
  try {
    const secret = getSecret();
    const payload = JSON.parse(base64Decode(token));
    if (payload.s !== secret) return false;
    if (Date.now() - payload.t > TOKEN_EXPIRY) return false;
    return true;
  } catch {
    return false;
  }
}

export function getAdminKey(): string | null {
  return process.env.ADMIN_ACCESS_KEY || null;
}

export async function setAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, generateToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: TOKEN_EXPIRY / 1000,
  });
}
