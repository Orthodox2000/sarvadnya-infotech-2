// CHANGE: 2026-10-30 — Careers email templates (single source of truth).
// WHY: a submitted resume and a submitted job application previously notified
// nobody. The owner asked for a copy to the company AND a confirmation to the
// candidate. Resume/application notifications are not "contact enquiries", so
// they cannot reuse the form-copy / auto-reply templates: the company copy must
// carry hiring fields (position, phone, resume link) and the candidate copy must
// NOT carry internal fields (no IP, no geo, no device data).
//
// Same house pattern as lib/email-autoreply.mjs: pure ESM, ZERO dependencies, a
// hand-written .d.mts next door, every style inline (Gmail/Outlook-safe), and the
// logo passed in as a READY-TO-USE src so the template never touches the
// filesystem or the network:
//   { cid: 'sarvadnya-logo' }  → <img src="cid:…">  (inline attachment, live send)
//   { data: 'data:image/png;base64,…' }              (fully offline preview)
//   { url: 'https://…/TallyCertificate.png' }        (hosted fallback)
//
// Not gated by AUTO_REPLY_ENABLED: that switch exists to stop the *marketing*
// thank-you on general enquiries, while an application acknowledgement is a core
// promised behaviour (owner: "send to both applicant and company").

import { DEFAULT_COMPANY } from './email-autoreply.mjs';

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Only http/https ever reaches an href. A resume URL comes from the DB or from a
// Blob reference validated upstream, but a template must never be the place where
// a `javascript:` or `data:` URL becomes clickable.
function safeUrl(value) {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}

function firstNameOf(name) {
  return String(name || '').trim().split(/\s+/)[0] || 'there';
}

function fmtDate(value) {
  const date = value instanceof Date ? value : new Date(String(value || ''));
  if (Number.isNaN(date.getTime())) return '';
  // Fixed, locale-independent format so the same value reads the same everywhere.
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// One shared body shell so the four templates cannot drift apart visually.
// `logo` is null for the internal company copies (a hiring notification with a
// masthead reads like marketing; the wordmark alone is enough).
function renderShell({ docTitle, logo, comp, bodyHtml, footerHtml }) {
  const logoImg = logo?.cid
    ? `cid:${esc(logo.cid)}`
    : logo?.data
      ? esc(logo.data)
      : logo?.url
        ? esc(logo.url)
        : `${String(comp.website || DEFAULT_COMPANY.website).replace(/\/+$/, '')}/TallyCertificate.png`;

  const logoBlock = logo
    ? `<img
                  src="${logoImg}"
                  alt="${esc(comp.name)}"
                  width="240"
                  height="51"
                  style="display:inline-block;max-width:100%;width:240px;height:auto;border:0;outline:none;text-decoration:none;"
                />`
    : '';

  const phoneRows = (comp.phoneLines || [])
    .map((p) => esc(p))
    .map((p) => `<p style="margin:0;color:#2a2d34;font-size:13px;line-height:1.6;font-weight:600;">${p}</p>`)
    .join('');

  const addressRow = comp.address
    ? `<tr>
                          <td style="padding:8px 0;vertical-align:top;white-space:nowrap;color:#5b6b64;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;width:90px;">Address</td>
                          <td style="padding:8px 0 8px 16px;color:#2a2d34;font-size:13px;line-height:1.6;">${esc(comp.address)}</td>
                        </tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${esc(docTitle)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f1f3f2;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f3f2;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(31,77,58,0.08);">
            <tr>
              <td style="background:#FBFAF6;padding:28px 24px 24px;text-align:center;border-bottom:3px solid #006569;">
                ${logoBlock}
                <p style="margin:${logo ? '14px' : '0'} 0 0;color:#033B38;font-size:17px;font-weight:800;letter-spacing:0.3px;">${esc(comp.name)}</p>
                <p style="margin:4px 0 0;color:#006569;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">${esc(comp.tagline)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px;">
                ${bodyHtml}

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #D9E8E8;border-radius:10px;overflow:hidden;margin-top:24px;">
                  <tr>
                    <td style="padding:12px 16px;background:#E8F0F0;">
                      <p style="margin:0;color:#045A57;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">Our Contact Details</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:14px 16px 6px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="padding:8px 0;vertical-align:top;white-space:nowrap;color:#5b6b64;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;width:90px;">Email</td>
                          <td style="padding:8px 0 8px 16px;color:#006569;font-size:13px;line-height:1.6;font-weight:700;word-break:break-word;">${esc(comp.email)}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;vertical-align:top;white-space:nowrap;color:#5b6b64;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;width:90px;">Phone</td>
                          <td style="padding:8px 0 8px 16px;">${phoneRows}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;vertical-align:top;white-space:nowrap;color:#5b6b64;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;width:90px;">Website</td>
                          <td style="padding:8px 0 8px 16px;color:#006569;font-size:13px;line-height:1.6;font-weight:700;word-break:break-word;">${esc(comp.website)}</td>
                        </tr>
                        ${addressRow}
                      </table>
                    </td>
                  </tr>
                </table>

                <p style="margin:24px 0 0;color:#2a2d34;font-size:14px;line-height:1.7;">Warm regards,</p>
                <p style="margin:2px 0 0;color:#006569;font-size:14px;font-weight:800;">The ${esc(comp.name)} Team</p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 24px;background:#F4F8F8;border-top:1px solid #D9E8E8;">
                <p style="margin:0;color:#8a9a92;font-size:11px;line-height:1.6;">${footerHtml}</p>
                <p style="margin:8px 0 0;color:#8a9a92;font-size:11px;line-height:1.6;">&copy; 2026 ${esc(comp.name)}. All Rights Reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// Internal key/value table used by the company copies.
function detailTable(title, rows) {
  const body = rows
    .filter((r) => r && r.value !== undefined && r.value !== null && String(r.value).trim() !== '')
    .map(
      (r) => `<tr>
                          <td style="padding:7px 0;vertical-align:top;white-space:nowrap;color:#5b6b64;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;width:150px;">${esc(r.label)}</td>
                          <td style="padding:7px 0 7px 16px;color:#2a2d34;font-size:13px;line-height:1.6;word-break:break-word;">${r.html || esc(r.value)}</td>
                        </tr>`
    )
    .join('');

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #D9E8E8;border-radius:10px;overflow:hidden;margin:0 0 16px;">
                  <tr>
                    <td style="padding:12px 16px;background:#E8F0F0;">
                      <p style="margin:0;color:#045A57;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">${esc(title)}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${body}</table>
                    </td>
                  </tr>
                </table>`;
}

function resumeLink(resumeUrl, resumeName) {
  const url = safeUrl(resumeUrl);
  if (!url) return { html: '', value: '' };
  const label = esc(resumeName || 'Download resume');
  return {
    html: `<a href="${esc(url)}" style="color:#006569;font-weight:700;text-decoration:underline;word-break:break-all;">${label}</a>`,
    value: url,
  };
}

function coerceCompany(company) {
  return { ...DEFAULT_COMPANY, ...(company || {}) };
}

/* ------------------------------------------------------------------ */
/* Job application                                                     */
/* ------------------------------------------------------------------ */

/** Internal subject for a new job application (company copy). */
export function applicationCompanySubject(fullName, jobTitle) {
  const who = String(fullName || 'Candidate').trim() || 'Candidate';
  const role = String(jobTitle || 'Open position').trim() || 'Open position';
  return `New job application: ${who} - ${role}`;
}

export const APPLICATION_CONFIRMATION_SUBJECT = 'Thank you for applying - Sarvadnya Infotech';

/**
 * Company copy of a job application. Carries every hiring field the form
 * collected plus a clickable resume link. `application.appliedAt` is optional.
 */
export function buildApplicationCompanyHtml({ application, company } = {}) {
  const app = application || {};
  const comp = coerceCompany(company);
  const resume = resumeLink(app.resumeUrl, app.resumeName || 'Download resume (PDF)');

  const details = detailTable('Candidate Details', [
    { label: 'Position', value: app.jobTitle },
    { label: 'Name', value: app.fullName },
    { label: 'Email', value: app.email },
    { label: 'Phone', value: app.phone },
    { label: 'City', value: app.city },
    { label: 'Gender', value: app.gender },
    { label: 'Age', value: app.age },
    { label: 'Qualification', value: app.qualification },
    { label: 'Experience', value: app.experience },
    { label: 'Skills', value: app.skills },
    { label: 'Experience details', value: app.experienceDetails },
    { label: 'Message', value: app.message },
  ]);

  const meta = detailTable('Application Record', [
    resume.html ? { label: 'Resume', html: resume.html, value: 'link' } : { label: 'Resume', value: 'Not attached' },
    { label: 'Job ID', value: app.jobId },
    { label: 'Received', value: fmtDate(app.appliedAt || new Date()) },
  ]);

  const bodyHtml = `
                <h2 style="margin:0 0 14px;color:#045A57;font-size:20px;font-weight:800;">New job application</h2>
                <p style="margin:0 0 18px;color:#5b6b64;font-size:14px;line-height:1.7;"><strong>${esc(app.fullName || 'A candidate')}</strong> applied for <strong>${esc(app.jobTitle || 'an open position')}</strong> through the careers page.</p>
                ${details}
                ${meta}
                <p style="margin:0;color:#5b6b64;font-size:13px;line-height:1.7;">Reply to this email to reach the candidate directly.</p>`;

  return renderShell({
    docTitle: 'New job application',
    logo: null,
    comp,
    bodyHtml,
    footerHtml: `Sent automatically when a candidate applies on our careers page. The candidate was also emailed a confirmation.`,
  });
}

/** Candidate confirmation for a submitted application. No internal fields. */
export function buildApplicantConfirmationHtml({ name, jobTitle, company, logo } = {}) {
  const comp = coerceCompany(company);
  const firstName = esc(firstNameOf(name));
  const role = jobTitle ? ` for <strong>${esc(jobTitle)}</strong>` : '';

  const bodyHtml = `
                <h2 style="margin:0 0 14px;color:#045A57;font-size:20px;font-weight:800;">Thank you for applying, ${firstName}!</h2>
                <p style="margin:0 0 12px;color:#5b6b64;font-size:14px;line-height:1.7;">We have received your application${role}. Our team will review your profile and contact you if it is a match for the role.</p>
                <p style="margin:0 0 12px;color:#5b6b64;font-size:14px;line-height:1.7;">You can update your resume or your details any time from your account on our careers page.</p>
                <p style="margin:0;color:#5b6b64;font-size:14px;line-height:1.7;">If you would like to add anything to your application, just reply to this email.</p>`;

  return renderShell({
    docTitle: 'Thank you for applying',
    logo: logo || { url: `${String(comp.website).replace(/\/+$/, '')}/TallyCertificate.png` },
    comp,
    bodyHtml,
    footerHtml: `This is an automated confirmation sent when you applied through our careers page. To reply to a team member directly, just hit reply or reach us at ${esc(comp.email)}.`,
  });
}

/* ------------------------------------------------------------------ */
/* Resume upload                                                       */
/* ------------------------------------------------------------------ */

/** Internal subject for a resume saved to a careers account. */
export function resumeCompanySubject(fullName) {
  const who = String(fullName || 'Candidate').trim() || 'Candidate';
  return `Resume uploaded: ${who}`;
}

export const RESUME_CONFIRMATION_SUBJECT = 'Your resume is saved - Sarvadnya Infotech';

/** Company copy when a candidate uploads/replaces a resume in their account. */
export function buildResumeCompanyHtml({ candidate, company } = {}) {
  const c = candidate || {};
  const comp = coerceCompany(company);
  const resume = resumeLink(c.resumeUrl, c.resumeName || 'Download resume (PDF)');

  const details = detailTable('Candidate', [
    { label: 'Name', value: c.fullName },
    { label: 'Email', value: c.email },
    { label: 'Phone', value: c.phone },
  ]);

  const meta = detailTable('Resume', [
    resume.html ? { label: 'File', html: resume.html, value: 'link' } : { label: 'File', value: 'Unavailable' },
    { label: 'Updated', value: fmtDate(c.updatedAt || new Date()) },
  ]);

  const bodyHtml = `
                <h2 style="margin:0 0 14px;color:#045A57;font-size:20px;font-weight:800;">Resume uploaded</h2>
                <p style="margin:0 0 18px;color:#5b6b64;font-size:14px;line-height:1.7;"><strong>${esc(c.fullName || c.email || 'A candidate')}</strong> saved a resume to their careers account.</p>
                ${details}
                ${meta}
                <p style="margin:0;color:#5b6b64;font-size:13px;line-height:1.7;">This is a stored profile resume, not a job application. Applications arrive as a separate email.</p>`;

  return renderShell({
    docTitle: 'Resume uploaded',
    logo: null,
    comp,
    bodyHtml,
    footerHtml: `Sent automatically when a candidate saves a resume on our careers page.`,
  });
}

/** Candidate confirmation for a saved resume. No internal fields. */
export function buildResumeConfirmationHtml({ name, resumeUrl, resumeName, company, logo } = {}) {
  const comp = coerceCompany(company);
  const firstName = esc(firstNameOf(name));
  const link = resumeLink(resumeUrl, resumeName || 'View your resume');
  const linkLine = link.html
    ? `<p style="margin:0 0 12px;color:#5b6b64;font-size:14px;line-height:1.7;">Saved file: ${link.html}</p>`
    : '';

  const bodyHtml = `
                <h2 style="margin:0 0 14px;color:#045A57;font-size:20px;font-weight:800;">Your resume is saved, ${firstName}</h2>
                <p style="margin:0 0 12px;color:#5b6b64;font-size:14px;line-height:1.7;">We have saved your resume to your careers account. You can replace it at any time from the careers page — your latest upload is the one we see.</p>
                ${linkLine}
                <p style="margin:0;color:#5b6b64;font-size:14px;line-height:1.7;">Applying for a role? Open the careers page and use Apply Now so your application reaches our team with your profile.</p>`;

  return renderShell({
    docTitle: 'Your resume is saved',
    logo: logo || { url: `${String(comp.website).replace(/\/+$/, '')}/TallyCertificate.png` },
    comp,
    bodyHtml,
    footerHtml: `This is an automated confirmation sent when you saved a resume on our careers page. To reply to a team member directly, just hit reply or reach us at ${esc(comp.email)}.`,
  });
}

/* ------------------------------------------------------------------ */
/* Careers account created                                             */
/* ------------------------------------------------------------------ */

// CHANGE: 2026-10-31 — Welcome mail for a newly created careers account.
// WHY: signup previously created the account silently; the owner asked that a
// candidate who registers gets a copy at their own address (and that the mail
// carry the referral code they were just issued, since the account page is the
// only other place it appears).
export const ACCOUNT_CREATED_SUBJECT = 'Your Sarvadnya Careers account is ready';

/**
 * Welcome mail for a new careers account. No internal fields (no id, no IP, no
 * password material). `referralCode` and `loginUrl` are optional; the login link
 * falls back to the careers login page on the company website.
 */
export function buildAccountCreatedHtml({ name, email, referralCode, loginUrl, company, logo } = {}) {
  const comp = coerceCompany(company);
  const firstName = esc(firstNameOf(name));
  const address = String(email || '').trim();
  const code = String(referralCode || '').trim();

  const fallbackLogin = `${String(comp.website || DEFAULT_COMPANY.website).replace(/\/+$/, '')}/careers/login`;
  const href = safeUrl(loginUrl) || safeUrl(fallbackLogin);

  const loginButton = href
    ? `<p style="margin:0 0 18px;"><a href="${esc(href)}" style="display:inline-block;background:#006569;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:8px;">Sign in to your account</a></p>`
    : '';

  const addressLine = address
    ? `<p style="margin:0 0 12px;color:#5b6b64;font-size:14px;line-height:1.7;">This account is registered to <strong>${esc(address)}</strong>.</p>`
    : '';

  const referralBlock = code
    ? detailTable('Your Referral Code', [
        { label: 'Code', value: code },
        { label: 'How it works', value: 'Share this code when you refer someone. They can enter it when they sign up.' },
      ])
    : '';

  const bodyHtml = `
                <h2 style="margin:0 0 14px;color:#045A57;font-size:20px;font-weight:800;">Welcome, ${firstName}!</h2>
                <p style="margin:0 0 12px;color:#5b6b64;font-size:14px;line-height:1.7;">Your careers account on the ${esc(comp.name)} website has been created. You can now save your resume, keep your details up to date and apply for open roles.</p>
                ${addressLine}
                ${referralBlock}
                ${loginButton}
                <p style="margin:0;color:#5b6b64;font-size:14px;line-height:1.7;">If you did not create this account, please reply to this email and we will remove it.</p>`;

  return renderShell({
    docTitle: 'Your careers account is ready',
    logo: logo || { url: `${String(comp.website).replace(/\/+$/, '')}/TallyCertificate.png` },
    comp,
    bodyHtml,
    footerHtml: `This is an automated message sent when a careers account is created. To reach a team member directly, just hit reply or write to ${esc(comp.email)}.`,
  });
}
