import { Resend } from 'resend';
import { getSettings } from '@/lib/mongodb-utils';

export interface FormSubmissionPayload {
  name: string;
  email: string;
  contact: string;
  service?: string;
  description?: string;
  formType?: string;
  destination?: string;
}

export interface SendResult {
  ok: boolean;
  recipients: string[];
  messageId?: string;
  error?: string;
}

export interface EmailConfig {
  apiKey: string;
  from: string;
  recipients: string[];
}

export interface EmailDiagnostic {
  configured: boolean;
  apiKeyPresent: boolean;
  from: string;
  fromDomain: string;
  recipients: string[];
  recipientCount: number;
  usesDefaultSender: boolean;
  formRecipients: Record<string, string[]>;
  destinations: Record<string, string[]>;
}

export const FORM_TYPES = ['quote', 'enquire', 'support', 'callback', 'demo', 'general', 'tss-renewal'] as const;

export type FormType = (typeof FORM_TYPES)[number];

const DEFAULT_SENDER = 'webenquiry@en.sarvadnyainfotech.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const FORM_TYPE_LABELS: Record<string, string> = {
  quote: 'Quote Request',
  enquire: 'Product Enquiry',
  support: 'Priority Support',
  callback: 'Callback Request',
  demo: 'Enquiry Request',
  general: 'Contact Request',
  'tss-renewal': 'TSS Renewal',
};

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(String(value).trim());
}

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function maskEmail(email: string): string {
  const at = email.lastIndexOf('@');
  if (at <= 0) return '***@***';
  return `***${email.slice(at)}`;
}

export function getFormTypeLabel(formType?: string): string {
  return FORM_TYPE_LABELS[formType || 'general'] || 'Web Enquiry';
}

export function getSubject(formType?: string): string {
  return `New ${getFormTypeLabel(formType)} — Sarvadnya Infotech`;
}

export function buildFormEmailHtml(submission: FormSubmissionPayload): string {
  const rows = [
    { label: 'Name', value: submission.name },
    { label: 'Email', value: submission.email },
    { label: 'Contact No.', value: submission.contact },
    { label: 'Service / Product', value: submission.service || '—' },
    { label: 'Form Type', value: getFormTypeLabel(submission.formType) },
    { label: 'Message', value: submission.description || '—' },
  ];

  const rowsHtml = rows
    .map(
      (row) => `
      <tr>
        <td style="padding:10px 14px;background:#f6f8f7;border:1px solid #e5ebe8;border-radius:8px;font-weight:700;color:#1e4d3a;font-size:12px;white-space:nowrap;vertical-align:top;">${escapeHtml(row.label)}</td>
        <td style="padding:10px 14px;border:1px solid #e5ebe8;border-radius:8px;color:#2a2d34;font-size:13px;word-break:break-word;">${escapeHtml(row.value)}</td>
      </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f1f3f2;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f3f2;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(31,77,58,0.08);">
            <tr>
              <td style="background:#316852;padding:22px 24px;">
                <p style="margin:0;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Sarvadnya Infotech LLP</p>
                <h1 style="margin:6px 0 0;color:#ffffff;font-size:20px;font-weight:800;">New ${escapeHtml(getFormTypeLabel(submission.formType))}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 16px;color:#5b6b64;font-size:13px;line-height:1.5;">A new web enquiry has been received. Details below:</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  ${rowsHtml}
                </table>
                <p style="margin:20px 0 0;color:#8a9a92;font-size:11px;line-height:1.5;">This is an automated notification. Reply to this email to respond to the enquirer directly (their address is set as the reply-to).</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// Recipients resolve from the admin-managed settings (DB), falling back to env.
// The client NEVER controls who receives these internal emails.
function parseEmailList(raw: string): string[] {
  return String(raw || '')
    .split(',')
    .map((r) => r.trim().toLowerCase())
    .filter((r) => isValidEmail(r));
}

export async function getEmailConfig(): Promise<EmailConfig> {
  let settings: Record<string, any> = {};
  try {
    settings = await getSettings();
  } catch {
    settings = {};
  }

  const apiKey = String(settings.RESEND_API_KEY || process.env.RESEND_API_KEY || '');
  const from = String(settings.RESEND_SENDER_EMAIL || process.env.RESEND_SENDER_EMAIL || DEFAULT_SENDER);
  const recipients = parseEmailList(String(settings.EMAIL_RECIPIENTS || process.env.RESEND_INTERNAL_TO || ''));

  return { apiKey, from, recipients };
}

// Per-form-type recipient map. Stored in DB as setting `EMAIL_FORM_RECIPIENTS`
// (JSON: { "demo": "a@x.com", "quote": "b@x.com", ... }). Any type without a
// valid entry falls back to the global internal list. Admin-editable.
export async function getFormRecipients(): Promise<Record<string, string[]>> {
  let settings: Record<string, any> = {};
  try {
    settings = await getSettings();
  } catch {
    settings = {};
  }

  const globalList = parseEmailList(String(settings.EMAIL_RECIPIENTS || process.env.RESEND_INTERNAL_TO || ''));

  let configured: Record<string, string> = {};
  const raw = String(settings.EMAIL_FORM_RECIPIENTS || process.env.EMAIL_FORM_RECIPIENTS || '');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) configured = parsed;
    } catch {
      configured = {};
    }
  }

  const map: Record<string, string[]> = {};
  for (const type of FORM_TYPES) {
    const list = parseEmailList(configured[type]);
    map[type] = list.length > 0 ? list : globalList;
  }
  return map;
}

export async function resolveFormRecipients(formType?: string): Promise<string[]> {
  const map = await getFormRecipients();
  const type = (FORM_TYPES as readonly string[]).includes(String(formType || '')) ? (formType as string) : 'general';
  return map[type] || [];
}

// Per-page destination recipients. Stored in DB as setting
// `EMAIL_DESTINATION_RECIPIENTS` (JSON: { "<page-key>": "a@x.com", ... }).
// Empty/missing = NO email for that page (opt-in; quota-friendly).
export async function getDestinationRecipients(): Promise<Record<string, string[]>> {
  let settings: Record<string, any> = {};
  try {
    settings = await getSettings();
  } catch {
    settings = {};
  }

  let configured: Record<string, string> = {};
  const raw = String(settings.EMAIL_DESTINATION_RECIPIENTS || process.env.EMAIL_DESTINATION_RECIPIENTS || '');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) configured = parsed;
    } catch {
      configured = {};
    }
  }

  const map: Record<string, string[]> = {};
  for (const key of Object.keys(configured)) {
    map[key] = parseEmailList(configured[key]);
  }
  return map;
}

// Recipient resolution for a submission. A page-level destination wins:
//   - destination configured with recipients → those recipients
//   - destination configured empty, or not configured at all → NO email (opt-in)
//   - no destination → per-form-type recipients → global fallback
export async function resolveRecipients(input: {
  destination?: string;
  formType?: string;
}): Promise<string[]> {
  const destination = String(input.destination || '').trim().toLowerCase();
  if (destination) {
    const map = await getDestinationRecipients();
    if (Object.prototype.hasOwnProperty.call(map, destination)) {
      return map[destination] || [];
    }
    return [];
  }
  return resolveFormRecipients(input.formType);
}

export function isInternalRecipient(email: string, recipients: string[]): boolean {
  return recipients.includes(String(email).trim().toLowerCase());
}

export async function sendInternalFormCopy(
  submission: FormSubmissionPayload,
  options?: { recipients?: string[]; from?: string }
): Promise<SendResult> {
  const { apiKey, from: configuredFrom } = await getEmailConfig();

  if (!apiKey) {
    return { ok: false, recipients: [], error: 'RESEND_API_KEY is not configured' };
  }

  const recipients = options?.recipients?.length
    ? options.recipients
    : await resolveFormRecipients(submission.formType);
  const from = options?.from || configuredFrom;

  if (recipients.length === 0) {
    return { ok: false, recipients: [], error: 'No internal recipient configured (set EMAIL_FORM_RECIPIENTS / RESEND_INTERNAL_TO)' };
  }
  if (!isValidEmail(from)) {
    return { ok: false, recipients, error: `Invalid sender address: ${from}` };
  }

  const resend = new Resend(apiKey);
  const sendPayload: {
    from: string;
    to: string[];
    subject: string;
    html: string;
    replyTo?: string;
    tags: { name: string; value: string }[];
  } = {
    from,
    to: recipients,
    subject: getSubject(submission.formType),
    html: buildFormEmailHtml(submission),
    tags: [
      { name: 'source', value: 'web-form' },
      { name: 'form_type', value: submission.formType || 'general' },
    ],
  };
  // Reply-to points at the enquirer when they gave a real email; enquiry forms
  // that only collect a phone number skip it so Resend never rejects the send.
  if (isValidEmail(submission.email)) sendPayload.replyTo = submission.email;

  const { data, error } = await resend.emails.send(sendPayload);

  if (error) {
    return { ok: false, recipients, error: error.message || 'Resend send failed' };
  }

  return { ok: true, recipients, messageId: data?.id };
}

export async function getEmailDiagnostic(): Promise<EmailDiagnostic> {
  const { apiKey, from, recipients } = await getEmailConfig();
  const formMap = await getFormRecipients();
  const destinationMap = await getDestinationRecipients();
  const fromDomain = from.includes('@') ? from.split('@')[1] : '';

  const maskedFormRecipients: Record<string, string[]> = {};
  for (const type of FORM_TYPES) {
    maskedFormRecipients[type] = (formMap[type] || []).map(maskEmail);
  }

  const maskedDestinations: Record<string, string[]> = {};
  for (const key of Object.keys(destinationMap)) {
    maskedDestinations[key] = (destinationMap[key] || []).map(maskEmail);
  }

  return {
    configured: Boolean(apiKey) && recipients.length > 0,
    apiKeyPresent: Boolean(apiKey),
    from: maskEmail(from),
    fromDomain,
    recipients: recipients.map(maskEmail),
    recipientCount: recipients.length,
    usesDefaultSender: from === DEFAULT_SENDER,
    formRecipients: maskedFormRecipients,
    destinations: maskedDestinations,
  };
}
