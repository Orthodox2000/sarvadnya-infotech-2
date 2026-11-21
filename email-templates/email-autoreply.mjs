// CHANGE: 2026-11-20 — Relocated from lib/ to email-templates/; no template or API change.
// CHANGE: 2026-09-21 — Branded client auto-reply email template (single source of truth).
// Pure ESM, zero dependencies, importable from both Next.js (TS) and Node scripts
// (scripts/email-preview.mjs). The header mirrors the LIVE website navbar: light
// cream band + the real header logo (/TallyCertificate.png) + "Sarvadnya Infotech
// LLP" wordmark, teal details. CHANGE: 2026-11-20 — the tagline is no longer
// rendered: email-templates/email-brand.mjs is the single header/footer source and
// now matches the expiry email / signature masthead (wordmark only).
// CHANGE: 2026-09-21 — Logo rendering made bulletproof: the template accepts the logo
// as a READY-TO-USE src. Live sends pass `{ cid }` (inline attachment → renders even
// with external images blocked); the preview embeds `{ data }` (base64 data URI →
// renders fully offline). A hosted `{ url }` is the final fallback. No Tailwind /
// external assets — every style is inline so Gmail/Outlook render it.

// CHANGE: 2026-11-04 — Shared header/footer so every transactional email
// (auto-reply, internal form copy, careers) renders the same masthead and the
// same footer band. Previously this file owned its own copy of that markup,
// which is how the templates drifted apart.
import { renderBrandHeader, renderBrandFooter } from './email-brand.mjs';

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const CLIENT_AUTOREPLY_SUBJECT = 'Thank you for contacting Sarvadnya Infotech';

// Company block mirrors the ON-SITE contact details (pulled from the live
// /api/settings on 2026-09-21): landline is hardcoded on the site footer,
// mobile/email/address come from settings with these same real values as fallback.
// CHANGE: 2026-10-07 — Address is now canonical ("final and only address
// everywhere" per owner): 73, Vindhya Commercial Premises, Sector - 11,
// Plot No - 1, CBD Belapur, Mumbai, Maharashtra.
export const DEFAULT_COMPANY = {
  name: 'Sarvadnya Infotech LLP',
  tagline: 'Tally Certified Partner · Trusted Since 2008',
  email: 'info@sarvadnyainfotech.com',
  phoneLines: ['+022-4974 2200 / +022-4964 7959', '+91 98213 09060'],
  website: 'https://sarvadnyainfotech.com',
  address: '73, Vindhya Commercial Premises, Sector - 11, Plot No - 1, CBD Belapur, Mumbai, Maharashtra',
};

// Renders the full HTML acknowledgement. `logo` is resolved by the caller so the
// template never depends on filesystem/network specifics:
//   { cid: 'sarvadnya-logo' }  → <img src="cid:sarvadnya-logo">   (live send)
//   { data: 'data:image/png;base64,…' } → <img src="data:…">       (offline preview)
//   { url: 'https://…/TallyCertificate.png' }                      (final fallback)
// Inputs are already sanitized upstream (the API routes strip < and >), and we
// escape defensively anyway.
//
// CHANGE: 2026-11-21 — This is now an ACKNOWLEDGEMENT RECEIPT, not just a thank-you:
// the owner asked that the lead see exactly what they submitted (name, email,
// contact, message, date and product). The structure is the latest left-aligned
// classic table pattern from email-templates/email-signature.html — white shell,
// real spacer rows + side gutters (never padding on a 100%-width cell, which used
// to draw a horizontal scrollbar in Outlook), 600px left-aligned card, inline CSS
// only. The shared masthead/footer come from email-brand.mjs with align:'left'.
export function buildClientAutoreplyHtml({
  name, email, contact, product, service, message, submittedAt, company, logo,
} = {}) {
  const comp = { ...DEFAULT_COMPANY, ...(company || {}) };
  const firstName = esc(String(name || '').trim().split(/\s+/)[0] || 'there');
  // `service` is the old field name (still used by the preview script); prefer
  // the explicit `product` but keep older callers working.
  const productName = String(product ?? service ?? '').trim();
  const productLine = productName ? ` for <strong>${esc(productName)}</strong>` : '';

  // CHANGE: 2026-11-04 — logo/header markup moved to email-templates/email-brand.mjs.
  // CHANGE: 2026-10-15 — logo asset replaced (owner's tallycertificat4.png saved over
  // public/TallyCertificate.png): now 2991×634 (≈4.718:1, content fills the canvas —
  // the old 3093×794 canvas had ~95px transparent top/bottom padding).

  // One label/value row of the "what you submitted" block. Labels sit left, the
  // value follows on the same line and wraps naturally (no nowrap → no overflow).
  const detailRow = (label, value) => `<tr>
        <td style="padding:7px 0;vertical-align:top;white-space:nowrap;color:#5b6b64;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;width:92px;">${esc(label)}</td>
        <td style="padding:7px 0 7px 12px;vertical-align:top;color:#2a2d34;font-size:13px;line-height:1.6;word-break:break-word;">${esc(value)}</td>
      </tr>`;

  const detailRows = [
    ['Name', name],
    ['Email', email],
    ['Contact', contact],
    ['Product', productName],
    ['Date', submittedAt],
  ]
    .filter(([, value]) => String(value ?? '').trim())
    .map(([label, value]) => detailRow(label, value))
    .join('');

  const messageRow = String(message ?? '').trim()
    ? `<tr>
        <td colspan="2" style="padding:14px 16px 16px;border-top:1px solid #D9E8E8;">
          <p style="margin:0 0 6px;color:#5b6b64;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
          <p style="margin:0;color:#2a2d34;font-size:13px;line-height:1.7;white-space:pre-line;">${esc(message)}</p>
        </td>
      </tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Thank you for contacting Sarvadnya Infotech</title>
  </head>
  <body style="margin:0;padding:0;background:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;background:#FFFFFF;">
      <tr><td height="24" style="height:24px;line-height:24px;font-size:0;">&nbsp;</td></tr>
      <tr>
        <td width="12" style="width:12px;font-size:0;">&nbsp;</td>
        <td align="left" valign="top">
          <table role="presentation" width="600" align="left" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;border-collapse:collapse;border:1px solid #dddddd;">
            ${renderBrandHeader({ company: comp, logo, align: 'left' })}
            <tr>
              <td style="padding:28px 24px 8px;">
                <h2 style="margin:0 0 14px;color:#045A57;font-size:20px;font-weight:800;">Thank you for contacting us, ${firstName}!</h2>
                <p style="margin:0 0 12px;color:#5b6b64;font-size:14px;line-height:1.7;">We have received your enquiry${productLine} and our Tally-certified team will get back to you shortly with the details you need.</p>
                <p style="margin:0 0 20px;color:#5b6b64;font-size:14px;line-height:1.7;">For your reference, here is a copy of what you submitted:</p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;border:1px solid #D9E8E8;">
                  ${detailRows ? `<tr>
                    <td style="padding:12px 16px;background:#E8F0F0;">
                      <p style="margin:0;color:#045A57;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">Your Enquiry</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px 10px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">${detailRows}</table>
                    </td>
                  </tr>` : ''}
                  ${messageRow}
                </table>

                <p style="margin:24px 0 0;color:#2a2d34;font-size:14px;line-height:1.7;">Warm regards,</p>
                <p style="margin:2px 0 0;color:#006569;font-size:14px;font-weight:800;">Sarvadnya Web Team</p>
              </td>
            </tr>
            ${renderBrandFooter({
              company: comp,
              align: 'left',
              footerHtml: `This acknowledgement was sent by the Sarvadnya Web Team after you contacted us through our website. To reply to a team member directly, just hit reply or reach us at ${esc(comp.email)}.`,
            })}
          </table>
        </td>
        <td width="12" style="width:12px;font-size:0;">&nbsp;</td>
      </tr>
      <tr><td height="24" style="height:24px;line-height:24px;font-size:0;">&nbsp;</td></tr>
    </table>
  </body>
</html>`;
}