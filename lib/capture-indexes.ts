// CHANGE: 2026-10-09 — the first-party capture collections (chat_logs, drafts) must have
// their indexes — notably the 30-day TTL on `expiresAt` — created automatically. The
// one-time scripts/drafts-chat-indexes.mjs creates the same set, but relying on someone
// remembering to run it means captured chats/drafts never expire. This memoised helper
// mirrors ensureVisitorIndexes() in lib/visitors.ts: the index build happens once per
// server process, on the first real (non-ignored) write.
import { getDb } from '@/lib/db';

let captureIndexPromise: Promise<void> | null = null;

export function ensureCaptureIndexes(): Promise<void> {
  if (!captureIndexPromise) {
    captureIndexPromise = (async () => {
      const db = await getDb();
      await db.collection('drafts').createIndex({ draftId: 1, sessionId: 1 }, { unique: true });
      await db.collection('drafts').createIndex({ sessionId: 1, lastActiveAt: -1 });
      await db.collection('drafts').createIndex({ path: 1, createdAt: -1 });
      await db.collection('drafts').createIndex({ entryPoint: 1, createdAt: -1 });
      await db.collection('drafts').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
      await db.collection('chat_logs').createIndex({ chatId: 1 }, { unique: true });
      await db.collection('chat_logs').createIndex({ sessionId: 1, lastActiveAt: -1 });
      await db.collection('chat_logs').createIndex({ path: 1, startedAt: -1 });
      await db.collection('chat_logs').createIndex({ entryPoint: 1, startedAt: -1 });
      await db.collection('chat_logs').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    })().catch((err) => {
      captureIndexPromise = null;
      throw err;
    });
  }
  return captureIndexPromise;
}
