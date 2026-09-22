import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb-utils';
import type { Filter } from 'mongodb';
import {
  getEmailConfig,
  resolveRecipients,
  sendInternalFormCopy,
  sendClientAutoreply,
  maskEmail,
} from '@/lib/email';
import type { FormSubmissionPayload } from '@/lib/email';

export type EmailJobStatus = 'pending' | 'processing' | 'sent' | 'failed' | 'dead';

// CHANGE: 2026-09-21 — Client auto-reply ledger. Each submission owns TWO sends
// under the same jobKey: the internal company copy (job.status) plus the branded
// thank-you to the submitter (job.autoReply). A duplicate POST can never re-fire
// either because both are recorded on the single unique jobKey claim.
export interface AutoReplyLedger {
  status: 'skipped' | 'sent' | 'failed';
  error?: string | null;
  sentAt?: Date;
  nextRetryAt?: Date;
  attempts?: number;
}

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
  autoReply?: AutoReplyLedger;
  createdAt: Date;
  updatedAt: Date;
  expireAt?: Date;
}

export interface DirectSendResult {
  claimed: boolean;
  sent: boolean;
  deduped: boolean;
  jobKey: string;
  messageId?: string;
  clientEmailSent?: boolean;
  error?: string;
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

// Direct (inline) send with exactly-once dedupe. The email_queue collection
// doubles as a send ledger: the unique jobKey upsert claims a send slot — the
// first caller owns it and sends via Resend immediately; any retry/duplicate
// POST re-using the same key (requestId) is skipped, so exactly one email is
// ever sent per submission. Failed sends stay in the ledger as 'failed' with a
// nextRetryAt, where the admin panel ("Retry Failed Sends") or an external
// scheduler (GitHub Actions / Upstash QStash) can pick them up again.
export async function sendEmailDirect(input: {
  jobKey: string;
  formType?: string;
  destination?: string;
  submission: FormSubmissionPayload;
}): Promise<DirectSendResult> {
  await ensureIndexes();

  const { jobKey, formType, destination, submission } = input;
  const type = String(formType || 'general').trim().toLowerCase() || 'general';

  // Page-level destinations win. A destination that is unconfigured (or
  // configured empty) deliberately produces NO email — sending is opt-in so a
  // page only emails once the admin assigns recipients for it.
  const recipients = await resolveRecipients({ destination, formType: type });
  const { from } = await getEmailConfig();

  if (recipients.length === 0 || !from) {
    // No internal recipient / sender configured — skip entirely so no send (and
    // therefore no email) can ever happen. Protects the email budget.
    return { claimed: false, sent: false, deduped: false, jobKey, error: 'no-recipient-configured' };
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

  if (result.upsertedCount === 0) {
    // A job already exists for this key (sent, in flight, or failed) → exactly
    // once. A failed job is NOT re-fired here — retries go through the admin /
    // external scheduler path so a hostile repeat POST can never spam.
    return { claimed: false, sent: false, deduped: true, jobKey };
  }

  // Fresh claim → send the internal copy NOW (directly, inline in the request),
  // then the branded client auto-reply. Both are recorded against this jobKey;
  // the auto-reply is kill-switch gated (AUTO_REPLY_ENABLED) and skipped when
  // the submitter gave no valid email — so a pending rollout sends nothing new.
  const res = await sendInternalFormCopy(submission, { recipients, from });
  const autoReplyRes = await sendClientAutoreply(submission);

  const autoReplyLedger: AutoReplyLedger = autoReplyRes.skipped
    ? { status: 'skipped' }
    : autoReplyRes.ok
      ? { status: 'sent', sentAt: new Date(), attempts: 1 }
      : {
          status: 'failed',
          error: autoReplyRes.error || 'auto-reply failed',
          nextRetryAt: new Date(Date.now() + retryDelay(1)),
          attempts: 1,
        };

  if (res.ok) {
    await col.updateOne(
      { jobKey },
      {
        $set: {
          status: 'sent',
          sentAt: new Date(),
          messageId: res.messageId || undefined,
          lastError: null,
          attempts: 1,
          autoReply: autoReplyLedger,
          expireAt: terminalExpiry(),
          updatedAt: new Date(),
        },
      }
    );
    return {
      claimed: true,
      sent: true,
      deduped: false,
      jobKey,
      messageId: res.messageId,
      clientEmailSent: autoReplyRes.ok,
    };
  }

  await col.updateOne(
    { jobKey },
    {
      $set: {
        status: 'failed',
        attempts: 1,
        lastError: res.error || 'send failed',
        nextRetryAt: new Date(Date.now() + retryDelay(1)),
        autoReply: autoReplyLedger,
        updatedAt: new Date(),
      },
    }
  );
  return { claimed: true, sent: false, deduped: false, jobKey, error: res.error };
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

  // CHANGE: 2026-09-21 — Also picks up jobs whose internal copy already went
  // out ('sent') but whose client auto-reply failed, so the admin/external
  // drain can retry just the missing thank-you without re-firing the internal
  // email (exactly-once per recipient is preserved).
  const candidates = await col
    .find({
      $or: [
        {
          status: { $in: ['pending', 'failed'] },
          $or: [{ status: 'pending' }, { status: 'failed', nextRetryAt: { $lte: now } }],
        },
        { status: 'sent', 'autoReply.status': 'failed', 'autoReply.nextRetryAt': { $lte: now } },
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
    // Soft retry = the internal copy already sent; only the client auto-reply
    // needs another attempt (claim filter keeps the retry race-safe).
    const softRetry = candidate.status === 'sent';
    const claimFilter: Filter<EmailJob> = softRetry
      ? {
          _id: candidate._id,
          status: 'sent' as const,
          'autoReply.status': 'failed' as const,
          'autoReply.nextRetryAt': { $lte: now },
        }
      : { _id: candidate._id, status: { $in: ['pending', 'failed'] as EmailJobStatus[] } };

    const claimed = await col.findOneAndUpdate(
      claimFilter,
      { $set: { status: 'processing', claimedAt: now, updatedAt: now } },
      { returnDocument: 'after' }
    );

    if (!claimed) {
      skipped++;
      continue;
    }

    const job = claimed;
    processed++;

    const autoReplyAttempt = (job.autoReply?.attempts || 0) + 1;
    const autoReplyRes = await sendClientAutoreply(job.submission);
    const autoReplyLedger: AutoReplyLedger = autoReplyRes.skipped
      ? { status: 'skipped' }
      : autoReplyRes.ok
        ? { status: 'sent', sentAt: new Date(), attempts: autoReplyAttempt }
        : {
            status: 'failed',
            error: autoReplyRes.error || 'auto-reply failed',
            nextRetryAt: new Date(Date.now() + retryDelay(autoReplyAttempt)),
            attempts: autoReplyAttempt,
          };

    if (softRetry) {
      // Re-sends the auto-reply only — never the internal copy.
      await col.updateOne(
        { _id: job._id },
        { $set: { status: 'sent', autoReply: autoReplyLedger, updatedAt: new Date() } }
      );
      if (autoReplyLedger.status === 'sent') sent++;
      else failed++;
      continue;
    }

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
            autoReply: autoReplyLedger,
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
              autoReply: autoReplyLedger,
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
              autoReply: autoReplyLedger,
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
