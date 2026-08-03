import { cookies } from 'next/headers';

const TOKEN_COOKIE = '__admin_token';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';
const TOKEN_MAX_AGE = 86400;

function base64Encode(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64url');
}

function base64Decode(str: string): string {
  try { return Buffer.from(str, 'base64url').toString('utf-8'); } catch { return ''; }
}

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function createToken(): string {
  const masterKey = process.env.ADMIN_ACCESS_KEY;
  if (!masterKey) return '';
  return base64Encode(JSON.stringify({ s: masterKey, t: Date.now() }));
}

export function verifyToken(token: string): boolean {
  try {
    const masterKey = process.env.ADMIN_ACCESS_KEY;
    if (!masterKey) return false;
    const payload = JSON.parse(base64Decode(token));
    return payload.s === masterKey && Date.now() - payload.t < 86400000;
  } catch {
    return false;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: TOKEN_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
}

export async function verifySessionFromCookie(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  if (!token) return false;
  return verifyToken(token);
}

// Route-level authorization (defense-in-depth on top of the proxy). Accepts the
// x-admin-key header (cron/tests), the admin_key cookie, or the session token
// cookie. Used by the email queue endpoints so a bypassed/misconfigured proxy
// can never expose email sends.
export function isRequestAuthorized(request: Request): boolean {
  const masterKey = process.env.ADMIN_ACCESS_KEY;
  if (!masterKey) return false;

  const headerKey = request.headers.get('x-admin-key');
  if (headerKey && headerKey === masterKey) return true;

  const cookieHeader = request.headers.get('cookie') || '';
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    if (key === 'admin_key' && part.slice(idx + 1).trim() === masterKey) return true;
    if (key === TOKEN_COOKIE) {
      const token = decodeURIComponent(part.slice(idx + 1).trim());
      if (verifyToken(token)) return true;
    }
  }

  return false;
}
