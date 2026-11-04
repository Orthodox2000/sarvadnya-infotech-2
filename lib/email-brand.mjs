// CHANGE: 2026-11-04 — One branded header/footer for EVERY transactional email.
// WHY: the customer auto-reply and the careers welcome mails rendered the real
// logo + wordmark, while the internal form copy and the careers company copies
// rendered a plain teal band with no logo and no footer. Same sender, several
// different-looking companies. The header and footer markup now live here once
// and every template renders them, so the brand can never drift template by
// template again.
//
// Pure ESM, zero dependencies (same house pattern as lib/email-autoreply.mjs).
// `logo` is a READY-TO-USE source resolved by the caller:
//   { cid: 'sarvadnya-logo' }            → inline attachment (live send)
//   { data: 'data:image/png;base64,…' }  → offline preview
//   null/undefined                       → hosted /TallyCertificate.png fallback
// `footerHtml` is trusted HTML assembled by the caller; every caller escapes the
// dynamic values it passes in.

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const EMAIL_LOGO_WIDTH = 240;
// 2991×634 asset (≈4.718:1) — the height attr only feeds the pre-load aspect
// ratio hint; CSS height:auto wins where styles apply.
export const EMAIL_LOGO_HEIGHT = 51;

export function brandLogoSrc(logo, company) {
  if (logo && logo.cid) return `cid:${esc(logo.cid)}`;
  if (logo && logo.data) return esc(logo.data);
  if (logo && logo.url) return esc(logo.url);
  const website = String((company && company.website) || 'https://sarvadnyainfotech.com').replace(/\/+$/, '');
  return esc(`${website}/TallyCertificate.png`);
}

/** The shared masthead: real logo + wordmark + tagline on a cream band. */
export function renderBrandHeader({ company, logo } = {}) {
  const comp = company || {};
  const name = esc(comp.name || 'Sarvadnya Infotech LLP');
  const tagline = esc(comp.tagline || 'Tally Certified Partner · Trusted Since 2008');
  return `<tr>
              <td style="background:#FBFAF6;padding:28px 24px 24px;text-align:center;border-bottom:3px solid #006569;">
                <img
                  src="${brandLogoSrc(logo, comp)}"
                  alt="${name}"
                  width="${EMAIL_LOGO_WIDTH}"
                  height="${EMAIL_LOGO_HEIGHT}"
                  style="display:inline-block;max-width:100%;width:${EMAIL_LOGO_WIDTH}px;height:auto;border:0;outline:none;text-decoration:none;"
                />
                <p style="margin:14px 0 0;color:#033B38;font-size:17px;font-weight:800;letter-spacing:0.3px;white-space:nowrap;">${name}</p>
                <p style="margin:4px 0 0;color:#006569;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">${tagline}</p>
              </td>
            </tr>`;
}

/** The shared footer band (note + copyright). `footerHtml` must be safe HTML. */
export function renderBrandFooter({ company, footerHtml } = {}) {
  const comp = company || {};
  const name = esc(comp.name || 'Sarvadnya Infotech LLP');
  const note = String(footerHtml || '').trim();
  const noteRow = note
    ? `<p style="margin:0;color:#8a9a92;font-size:11px;line-height:1.6;">${note}</p>`
    : '';
  return `<tr>
              <td style="padding:18px 24px;background:#F4F8F8;border-top:1px solid #D9E8E8;">
                ${noteRow}
                <p style="margin:${note ? '8px' : '0'} 0 0;color:#8a9a92;font-size:11px;line-height:1.6;">&copy; 2026 ${name}. All Rights Reserved.</p>
              </td>
            </tr>`;
}
