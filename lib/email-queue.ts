import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb-utils';
import {
  getEmailConfig,
  resolveRecipients,
  sendInternalFormCopy,
  maskEmail,
} from '@/lib/email';
import type { FormSubmissionPayload } from '@/lib/email';

export type EmailJobStatus = 'pending' | 'processing' | 'sent' | 'failed' | 'dead';

export interface EmailJob {
  _id?: ObjectId;
  jobKey: string;
  formType: string;
  destination?: string;
  submission: FormSubmissionPayload;
  recipients: string[];
  from: string;
  status: EmailJobStatus;
  attempts: number;
  maxAttempts: number;
  claimedAt?: Date;
  nextRetryAt?: Date;
  sentAt?: Date;
  lastError?: string | null;
  messageId?: string;
  createdAt: Date;
  updatedAt: Date;
  expireAt?: Date;
}

export interface EnqueueResult {
  enqueued: boolean;
  created: boolean;
  jobKey: string;
  reason?: string;
}

export interface ProcessResult {
  batch: number;
  reset: number;
  processed: number;
  sent: number;
  failed: number;
  dead: number;
  skipped: number;
}

export interface QueueStats {
  pending: number;
  processing: number;
  sent: number;
  failed: number;
  dead: number;
  total: number;
  oldestPendingAt: string | null;
}

const DEFAULT_MAX_ATTEMPTS = Number(process.env.EMAIL_MAX_ATTEMPTS || 5);
const RETRY_BASE_MS = 30_000;
const RETRY_CAP_MS = 4 * 60 * 60 * 1000;
const TTL_MS = 30 * 24 * 60 * 60 * 1000;
const STALE_MS = 5 * 60 * 1000;

let indexPromise: Promise<void> | null = null;

async function getEmailQueueCol() {
  const db = await getDb();
  return db.collection<EmailJob>('email_queue');
}

function ensureIndexes(): Promise<void> {
  if (!indexPromise) {
    indexPromise = (async () => {
      const col = await getEmailQueueCol();
      await col.createIndex({ jobKey: 1 }, { unique: true });
      await col.createIndex({ status: 1, createdAt: 1 });
      await col.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
    })().catch((err) => {
      indexPromise = null;
      throw err;
    });
  }
  return indexPromise;
}

function retryDelay(attempt: number): number {
  return Math.min(RETRY_BASE_MS * Math.pow(2, attempt - 1), RETRY_CAP_MS);
}

function terminalExpiry(): Date {
  return new Date(Date.now() + TTL_MS);
}

// Queue is the ONLY way internal emails are triggered. A job is deduplicated by
// jobKey (unique index), so duplicate submissions can never fire a second email.
// Emails are never sent inline from a public route — only processEmailQueue()
// (invoked via after()/cron/admin) talks to Resend.
export async function enqueueEmailJob(input: {
  jobKey: string;
  formType?: string;
  destination?: string;
  submission: FormSubmissionPayload;
}): Promise<EnqueueResult> {
  await ensureIndexes();

  const { jobKey, formType, destination, submission } = input;
  const type = String(formType || 'general').trim().toLowerCase() || 'general';

  // Page-level destinations win. A destination that is unconfigured (or
  // configured empty) deliberately produces NO email — sending is opt-in so a
  // page only emails once the admin assigns recipients for it.
  const recipients = await resolveRecipients({ destination, formType: type });
  const { from } = await getEmailConfig();

  if (recipients.length === 0 || !from) {
    // No internal recipient / sender configured — skip enqueue entirely so no
    // job (and therefore no email) can ever be created. Protects the email budget.
    return { enqueued: false, created: false, jobKey, reason: 'no-recipient-configured' };
  }

  const col = await getEmailQueueCol();
  const now = new Date();

  const setFields: Record<string, unknown> = {
    submission,
    recipients,
    from,
    formType: type,
    updatedAt: now,
  };
  const cleanDestination = String(destination || '').trim().toLowerCase().slice(0, 40);
  if (cleanDestination) setFields.destination = cleanDestination;

  const result = await col.updateOne(
    { jobKey },
    {
      $setOnInsert: {
        status: 'pending',
        attempts: 0,
        maxAttempts: DEFAULT_MAX_ATTEMPTS,
        createdAt: now,
      },
      // Re-submits with the same key refresh the payload/recipients but never
      // reset the send status (a job already sent stays sent → exactly 1 email).
      $set: setFields,
    },
    { upsert: true }
  );

  return { enqueued: true, created: result.upsertedCount > 0, jobKey };
}

// Atomically claims + sends due jobs. Safe to call concurrently from multiple
// processes — the status filter on the claim prevents double-sends.
export async function processEmailQueue(
  options: { batch?: number; maxAttempts?: number } = {}
): Promise<ProcessResult> {
  await ensureIndexes();

  const batch = Math.min(Math.max(Math.floor(options.batch ?? 10), 1), 50);
  const maxAttempts = Math.min(Math.max(Math.floor(options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS), 1), 10);
  const col = await getEmailQueueCol();
  const now = new Date();

  // Recover jobs stuck in 'processing' (crash mid-send) after the stale window.
  const stale = new Date(now.getTime() - STALE_MS);
  const reset = (
    await col.updateMany(
      { status: 'processing', claimedAt: { $lte: stale } },
      { $set: { status: 'pending', claimedAt: null, updatedAt: now } }
    )
  ).modifiedCount;

  const candidates = await col
    .find({
      status: { $in: ['pending', 'failed'] },
      $or: [
        { status: 'pending' },
        { status: 'failed', nextRetryAt: { $lte: now } },
      ],
    })
    .sort({ createdAt: 1 })
    .limit(batch)
    .toArray();

  let processed = 0;
  let sent = 0;
  let failed = 0;
  let dead = 0;
  let skipped = 0;

  for (const candidate of candidates) {
    const claimed = await col.findOneAndUpdate(
      { _id: candidate._id, status: { $in: ['pending', 'failed'] } },
      { $set: { status: 'processing', claimedAt: now, updatedAt: now } },
      { returnDocument: 'after' }
    );

    if (!claimed) {
      skipped++;
      continue;
    }

    const job = claimed;
    processed++;

    const res = await sendInternalFormCopy(job.submission, {
      recipients: job.recipients,
      from: job.from,
    });

    if (res.ok) {
      sent++;
      await col.updateOne(
        { _id: job._id },
        {
          $set: {
            status: 'sent',
            sentAt: new Date(),
            messageId: res.messageId || undefined,
            lastError: null,
            attempts: job.attempts + 1,
            expireAt: terminalExpiry(),
            updatedAt: new Date(),
          },
        }
      );
    } else {
      const nextAttempts = job.attempts + 1;
      if (nextAttempts >= job.maxAttempts) {
        dead++;
        await col.updateOne(
          { _id: job._id },
          {
            $set: {
              status: 'dead',
              attempts: nextAttempts,
              lastError: res.error || 'send failed',
              expireAt: terminalExpiry(),
              updatedAt: new Date(),
            },
          }
        );
      } else {
        failed++;
        await col.updateOne(
          { _id: job._id },
          {
            $set: {
              status: 'failed',
              attempts: nextAttempts,
              lastError: res.error || 'send failed',
              nextRetryAt: new Date(Date.now() + retryDelay(nextAttempts)),
              updatedAt: new Date(),
            },
          }
        );
      }
    }
  }

  return { batch, reset, processed, sent, failed, dead, skipped };
}

export async function getEmailQueueStats(): Promise<QueueStats> {
  await ensureIndexes();
  const col = await getEmailQueueCol();

  const [pending, processing, sent, failed, dead, oldest] = await Promise.all([
    col.countDocuments({ status: 'pending' }),
    col.countDocuments({ status: 'processing' }),
    col.countDocuments({ status: 'sent' }),
    col.countDocuments({ status: 'failed' }),
    col.countDocuments({ status: 'dead' }),
    col.find({ status: 'pending' }).sort({ createdAt: 1 }).limit(1).toArray(),
  ]);

  return {
    pending,
    processing,
    sent,
    failed,
    dead,
    total: pending + processing + sent + failed + dead,
    oldestPendingAt: oldest[0]?.createdAt?.toISOString?.() ?? null,
  };
}

export async function getRecentEmailJobs(limit = 12) {
  await ensureIndexes();
  const col = await getEmailQueueCol();
  const jobs = await col.find({}).sort({ createdAt: -1 }).limit(limit).toArray();

  return jobs.map((j) => ({
    jobKey: j.jobKey,
    formType: j.formType,
    status: j.status,
    attempts: j.attempts,
    maxAttempts: j.maxAttempts,
    recipients: (j.recipients || []).map(maskEmail),
    createdAt: j.createdAt?.toISOString?.() ?? null,
    sentAt: j.sentAt?.toISOString?.() ?? null,
    nextRetryAt: j.nextRetryAt?.toISOString?.() ?? null,
    lastError: j.lastError || null,
    messageId: j.messageId || null,
  }));
}
