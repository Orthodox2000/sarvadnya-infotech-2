// CHANGE: 2026-09-21 — Branded client auto-reply email template (single source of truth).
// Pure ESM, zero dependencies, importable from both Next.js (TS) and Node scripts
// (scripts/email-preview.mjs). The header mirrors the LIVE website navbar: light
// cream band + the real header logo (/TallyCertificate.png) + "Sarvadnya Infotech
// LLP" wordmark + "Tally Certified Partner · Trusted Since 2008" tagline, teal details.
// CHANGE: 2026-09-21 — Logo rendering made bulletproof: the template accepts the logo
// as a READY-TO-USE src. Live sends pass `{ cid }` (inline attachment → renders even
// with external images blocked); the preview embeds `{ data }` (base64 data URI →
// renders fully offline). A hosted `{ url }` is the final fallback. No Tailwind /
// external assets — every style is inline so Gmail/Outlook render it.

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
export const DEFAULT_COMPANY = {
  name: 'Sarvadnya Infotech LLP',
  tagline: 'Tally Certified Partner · Trusted Since 2008',
  email: 'info@sarvadnyainfotech.com',
  phoneLines: ['+022-4974 2200 / +022-4964 7959', '+91 98213 09060'],
  website: 'https://sarvadnyainfotech.com',
  address: 'Shop No. 73, Plot No. 1, Vindhya Commercial Premises, Sector 11, CBD Belapur',
};

// Renders the full HTML email body. `logo` is resolved by the caller so the
// template never depends on filesystem/network specifics:
//   { cid: 'sarvadnya-logo' }  → <img src="cid:sarvadnya-logo">   (live send)
//   { data: 'data:image/png;base64,…' } → <img src="data:…">       (offline preview)
//   { url: 'https://…/TallyCertificate.png' }                      (final fallback)
// Inputs are already sanitized upstream (the API routes strip < and >), and we
// escape defensively anyway.
export function buildClientAutoreplyHtml({ name, service, company, logo } = {}) {
  const comp = { ...DEFAULT_COMPANY, ...(company || {}) };
  const firstName = esc(String(name || '').trim().split(/\s+/)[0] || 'there');
  const serviceLine = service ? ` for <strong>${esc(service)}</strong>` : '';

  // TallyCertificate.png is 3093×794 (≈3.895:1) — width 240 → height ~62.
  const logoImg = logo?.cid
    ? `cid:${esc(logo.cid)}`
    : logo?.data
      ? esc(logo.data)
      : `${(comp.website).replace(/\/+$/, '')}/TallyCertificate.png`;

  const phoneRows = (comp.phoneLines || [])
    .map((p) => esc(p))
    .map((p) => `<p style="margin:0;color:#2a2d34;font-size:13px;line-height:1.6;font-weight:600;">${p}</p>`)
    .join('');

  const addressRow = comp.address
    ? `<tr>
        <td style="padding:8px 0;vertical-align:top;white-space:nowrap;color:#5b6b64;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Address</td>
        <td style="padding:8px 0 8px 16px;color:#2a2d34;font-size:13px;line-height:1.6;">${esc(comp.address)}</td>
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
  <body style="margin:0;padding:0;background:#f1f3f2;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f3f2;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(31,77,58,0.08);">
            <tr>
              <td style="background:#FBFAF6;padding:28px 24px 24px;text-align:center;border-bottom:3px solid #006569;">
                <img
                  src="${logoImg}"
                  alt="${esc(comp.name)}"
                  width="240"
                  height="62"
                  style="display:inline-block;max-width:100%;width:240px;height:auto;border:0;outline:none;text-decoration:none;"
                />
                <p style="margin:14px 0 0;color:#033B38;font-size:17px;font-weight:800;letter-spacing:0.3px;">${esc(comp.name)}</p>
                <p style="margin:4px 0 0;color:#006569;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">${esc(comp.tagline)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px;">
                <h2 style="margin:0 0 14px;color:#045A57;font-size:20px;font-weight:800;">Thank you for contacting us, ${firstName}!</h2>
                <p style="margin:0 0 12px;color:#5b6b64;font-size:14px;line-height:1.7;">We have received your enquiry${serviceLine} and our Tally-certified team will get back to you shortly with the details you need.</p>
                <p style="margin:0 0 20px;color:#5b6b64;font-size:14px;line-height:1.7;">While you wait, feel free to explore our products and services or book a free demo.</p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #D9E8E8;border-radius:10px;overflow:hidden;">
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
                <p style="margin:0;color:#8a9a92;font-size:11px;line-height:1.6;">This is an automated confirmation sent when you contacted us through our website. To reply to a team member directly, just hit reply or reach us at ${esc(comp.email)}.</p>
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