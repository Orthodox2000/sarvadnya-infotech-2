import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = '__admin_session';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

const sessions = new Map<string, { username: string; createdAt: number }>();

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function createSession(): string {
  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, { username: ADMIN_USERNAME, createdAt: Date.now() });
  return sessionId;
}

export function verifySession(sessionId: string): boolean {
  return sessions.has(sessionId);
}

export function destroySession(sessionId: string): void {
  sessions.delete(sessionId);
}

export async function setSessionCookie(sessionId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 86400,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (sessionId && verifySession(sessionId)) {
    return sessionId;
  }
  return null;
}
