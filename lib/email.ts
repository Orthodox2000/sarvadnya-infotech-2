import { Resend } from 'resend';
// CHANGE: 2026-09-21 — Logo is embedded as an inline attachment (cid:) so it
// renders in every client even when external images are blocked.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getSettings } from '@/lib/mongodb-utils';
import { parseDevice } from '@/lib/visitors';
import type { GeoInfo } from '@/lib/visitors';
// CHANGE: 2026-09-21 — Branded client auto-reply template lives in a pure ESM
// module so it can be rendered by the preview script too (scripts/email-preview.mjs).
import {
  buildClientAutoreplyHtml,
  CLIENT_AUTOREPLY_SUBJECT,
  DEFAULT_COMPANY,
} from '@/lib/email-autoreply.mjs';
import type { AutoreplyCompany } from '@/lib/email-autoreply.mjs';

export interface FormSubmissionPayload {
  name: string;
  email: string;
  contact: string;
  service?: string;
  description?: string;
  formType?: string;
  destination?: string;
  ip?: string;
  userAgent?: string;
  geo?: GeoInfo | null;
  sessionId?: string;
}

export interface SendResult {
  ok: boolean;
  recipients: string[];
  messageId?: string;
  error?: string;
}

export interface AutoreplySendResult {
  ok: boolean;
  sentTo?: string;
  messageId?: string;
  error?: string;
  skipped?: boolean;
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
  const gpcOptOut = !submission.geo && !submission.ip;

  const location = submission.geo
    ? [submission.geo.city, submission.geo.region, submission.geo.country]
        .filter(Boolean)
        .join(', ') +
      (submission.geo.countryCode ? ` (${submission.geo.countryCode})` : '')
    : gpcOptOut
      ? 'Privacy opt-out (Global Privacy Control)'
      : '—';

  const connection = submission.geo
    ? [submission.geo.isp && `ISP: ${submission.geo.isp}`, submission.geo.asn && `ASN: ${submission.geo.asn}`]
        .filter(Boolean)
        .join(' · ')
    : '';

  // CHANGE: 2026-08-29 — Full IP shown in the internal email copy (ipMasked removed).
  const ipValue = submission.ip || '—';

  const device = submission.userAgent
    ? (() => {
        const d = parseDevice(submission.userAgent);
        const label = `${d.browser} on ${d.os}${d.type !== 'desktop' && d.type !== 'unknown' ? ` (${d.type})` : ''}`;
        return label;
      })()
    : '';

  const rows = [
    { label: 'Name', value: submission.name },
    { label: 'Email', value: submission.email },
    { label: 'Contact No.', value: submission.contact },
    { label: 'Service / Product', value: submission.service || '—' },
    { label: 'Form Type', value: getFormTypeLabel(submission.formType) },
    { label: 'Visitor Location', value: location },
    { label: 'IP Address', value: ipValue },
    ...(connection ? [{ label: 'Connection', value: connection }] : []),
    ...(device ? [{ label: 'Device', value: device }] : []),
    { label: 'Message', value: submission.description || '—' },
  ];

  const rowsHtml = rows
    .map(
      (row) => `
      <tr>
        <td style="padding:10px 14px;background:#E8F0F0;border:1px solid #D9E8E8;border-radius:8px;font-weight:700;color:#045A57;font-size:12px;white-space:nowrap;vertical-align:top;">${escapeHtml(row.label)}</td>
        <td style="padding:10px 14px;border:1px solid #D9E8E8;border-radius:8px;color:#2a2d34;font-size:13px;word-break:break-word;">${escapeHtml(row.value)}</td>
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
              <td style="background:#006569;padding:22px 24px;">
                <p style="margin:0;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;white-space:nowrap;">Sarvadnya Infotech LLP</p>
                <h1 style="margin:6px 0 0;color:#ffffff;font-size:20px;font-weight:800;">New ${escapeHtml(getFormTypeLabel(submission.formType))}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 16px;color:#5b6b64;font-size:13px;line-height:1.5;">A new web enquiry has been received. Details below:</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  ${rowsHtml}
                </table>
                <p style="margin:20px 0 0;color:#8a9a92;font-size:11px;line-height:1.5;">This is an automated notification. Reply to this email to respond to the enquirer directly (their address is set as the reply-to).${submission.sessionId ? ` Captured via passive visitor identification · Session ${submission.sessionId.slice(0, 8)}…` : ' Captured via passive visitor identification.'}</p>
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
  // CHANGE: 2026-10-07 — Global CC (one address, all emails) rides the same
  // payload as the recipients; null when disabled/invalid → no cc key at all.
  const globalCc = await getGlobalCc();
  const sendPayload: {
    from: string;
    to: string[];
    cc?: string[];
    subject: string;
    html: string;
    replyTo?: string;
    tags: { name: string; value: string }[];
  } = {
    from,
    to: recipients,
    ...(globalCc ? { cc: globalCc } : {}),
    subject: getSubject(submission.formType),
    html: buildFormEmailHtml(submission),
    tags: [
      { name: 'source', value: 'web-form' },
      { name: 'form_type', value: submission.formType || 'general' },
      { name: 'has_geo', value: submission.geo ? '1' : '0' },
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

// ---------- Client auto-reply (thank you for contacting) ----------
// CHANGE: 2026-09-21 — New branded auto-reply to the SUBMITTER's own email.
// replyTo points at info@sarvadnyainfotech.com. Gated behind AUTO_REPLY_ENABLED
// (default OFF) so deploying this code NEVER sends clients anything until the
// kill-switch is flipped in env/settings — the live site stays quiet.

function normalizeFlag(value: unknown): boolean {
  return ['1', 'true', 'yes', 'on'].includes(String(value || '').trim().toLowerCase());
}

export async function isAutoreplyEnabled(): Promise<boolean> {
  let settings: Record<string, any> = {};
  try {
    settings = await getSettings();
  } catch {
    settings = {};
  }
  const fromSettings = String(settings.AUTO_REPLY_ENABLED || '');
  if (fromSettings) return normalizeFlag(fromSettings);
  return normalizeFlag(process.env.AUTO_REPLY_ENABLED || '0');
}

// CHANGE: 2026-10-07 — One GLOBAL CC, applied to every send: the internal form
// copy AND the client auto-reply (owner: "One global CC, all emails"). The
// toggle + address are admin-editable (settings EMAIL_CC_ENABLED / EMAIL_CC,
// falling back to env vars so a fresh deploy is silent). Disabled by default
// and an invalid address yields NO cc — enabling can never break a send, and
// each send guards independently so a missing config never triggers email.
export async function getGlobalCc(): Promise<string[] | null> {
  let settings: Record<string, any> = {};
  try {
    settings = await getSettings();
  } catch {
    settings = {};
  }
  const fromSettings = String(settings.EMAIL_CC_ENABLED || '');
  const enabled = fromSettings ? normalizeFlag(fromSettings) : normalizeFlag(process.env.EMAIL_CC_ENABLED || '0');
  if (!enabled) return null;
  const address = String(settings.EMAIL_CC || process.env.EMAIL_CC || '').trim().toLowerCase();
  if (!isValidEmail(address)) return null;
  return [address];
}

// Site-contact block mirrors what the public Footer renders (Footer.tsx +
// /api/settings): landline is hardcoded on the site, mobile/email/address come
// from settings env with the same fallbacks. Address only shown when configured.
export async function getCompanyContact(): Promise<AutoreplyCompany> {
  let settings: Record<string, any> = {};
  try {
    settings = await getSettings();
  } catch {
    settings = {};
  }

  const email = String(settings.NEXT_PUBLIC_SUPPORT_EMAIL || process.env.NEXT_PUBLIC_SUPPORT_EMAIL || '') || DEFAULT_COMPANY.email;
  const phoneRaw = String(settings.NEXT_PUBLIC_SUPPORT_PHONE || process.env.NEXT_PUBLIC_SUPPORT_PHONE || '') || '9821309060';
  const formatPhone = (p: string): string => {
    const t = p.trim();
    if (t.startsWith('+')) return t;
    if (t.startsWith('91') && t.length === 12) return `+${t}`;
    if (t.length === 10) return `+91 ${t.slice(0, 5)} ${t.slice(5)}`;
    return t;
  };

  return {
    ...DEFAULT_COMPANY,
    email,
    phoneLines: [
      '+022-4974 2200 / +022-4964 7959',
      ...phoneRaw.split(',').map(formatPhone).filter(Boolean),
    ],
    address: String(settings.NEXT_PUBLIC_OFFICE_ADDRESS || process.env.NEXT_PUBLIC_OFFICE_ADDRESS || '') || DEFAULT_COMPANY.address,
  };
}

// CHANGE: 2026-09-21 — Loads the live site's header logo for inline embedding.
// Returns null (→ hosted-URL fallback in the template) if the file is missing.
function loadInlineLogo(): { buffer: Buffer; base64: string } | null {
  try {
    const buffer = readFileSync(join(process.cwd(), 'public', 'TallyCertificate.png'));
    return { buffer, base64: buffer.toString('base64') };
  } catch {
    return null;
  }
}

export async function sendClientAutoreply(
  submission: FormSubmissionPayload,
  options?: { from?: string; baseUrl?: string; company?: Partial<AutoreplyCompany> }
): Promise<AutoreplySendResult> {
  if (!(await isAutoreplyEnabled())) {
    return { ok: false, skipped: true, error: 'AUTO_REPLY_ENABLED is off' };
  }
  if (!isValidEmail(submission.email)) {
    return { ok: false, skipped: true, error: 'No valid submitter email to send the auto-reply to' };
  }

  const { apiKey, from: configuredFrom } = await getEmailConfig();
  if (!apiKey) {
    return { ok: false, error: 'RESEND_API_KEY is not configured' };
  }

  let settings: Record<string, any> = {};
  try {
    settings = await getSettings();
  } catch {
    settings = {};
  }
  const from = String(settings.AUTO_REPLY_FROM || process.env.AUTO_REPLY_FROM || '') || options?.from || configuredFrom;
  const replyTo = String(settings.AUTO_REPLY_REPLY_TO || process.env.AUTO_REPLY_REPLY_TO || '') || 'info@sarvadnyainfotech.com';
  const siteUrl = options?.baseUrl || String(process.env.SITE_URL || '').replace(/\/+$/, '') || 'https://sarvadnyainfotech.com';

  if (!isValidEmail(from)) {
    return { ok: false, error: `Invalid auto-reply sender address: ${from}` };
  }

  const company = options?.company ? { ...DEFAULT_COMPANY, ...options.company } : (await getCompanyContact());

  // CHANGE: 2026-09-21 — Logo is embedded inline (cid attachment) so it renders
  // in every mail client regardless of external-image settings; hosted URL is
  // only the fallback if the local file is ever missing.
  const logoFile = loadInlineLogo();
  const logo = logoFile
    ? { cid: 'sarvadnya-logo' }
    : { url: `${siteUrl}/TallyCertificate.png` };

  const resend = new Resend(apiKey);
  // CHANGE: 2026-10-07 — Global CC applies to the customer auto-reply too
  // (owner: "one global CC, all emails"); null when disabled → no cc key.
  const globalCc = await getGlobalCc();
  const { data, error } = await resend.emails.send({
    from,
    to: [submission.email],
    ...(globalCc ? { cc: globalCc } : {}),
    subject: CLIENT_AUTOREPLY_SUBJECT,
    html: buildClientAutoreplyHtml({
      name: submission.name,
      service: submission.service,
      company,
      logo,
    }),
    replyTo,
    attachments: logoFile
      ? [
          {
            filename: 'sarvadnya-logo.png',
            content: logoFile.buffer,
            contentType: 'image/png',
            contentId: 'sarvadnya-logo',
          },
        ]
      : undefined,
    tags: [
      { name: 'source', value: 'web-form-auto-reply' },
      { name: 'form_type', value: submission.formType || 'general' },
      { name: 'has_geo', value: submission.geo ? '1' : '0' },
    ],
  });

  if (error) {
    return { ok: false, sentTo: submission.email, error: error.message || 'Resend auto-reply send failed' };
  }
  return { ok: true, sentTo: submission.email, messageId: data?.id };
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
