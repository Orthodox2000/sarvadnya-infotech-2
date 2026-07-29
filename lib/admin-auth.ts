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
