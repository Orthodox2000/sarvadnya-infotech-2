// CHANGE: 2026-11-20 — Relocated from lib/ to email-templates/; no template or API change.
// CHANGE: 2026-11-04 — One branded header/footer for EVERY transactional email.
// WHY: the customer auto-reply and the careers welcome mails rendered the real
// logo + wordmark, while the internal form copy and the careers company copies
// rendered a plain teal band with no logo and no footer. Same sender, several
// different-looking companies. The header and footer markup now live here once
// and every template renders them, so the brand can never drift template by
// template again.
//
// Pure ESM, zero dependencies (same house pattern as email-templates/email-autoreply.mjs).
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

/** The shared masthead: real logo + wordmark on a cream band.
 *  CHANGE: 2026-11-20 — tagline removed to match the expiry email / signature masthead.
 *  The logo links to the site root, resolved from `company.website` (never a
 *  hard-coded path), so every transactional email has the same live home trigger. */
export function renderBrandHeader({ company, logo, align = 'center' } = {}) {
  const comp = company || {};
  // CHANGE: 2026-11-21 — `align:'left'` lets the acknowledgement receipt use the
  // latest left-aligned template structure without touching the centred header
  // every other transactional email already ships.
  const textAlign = align === 'left' ? 'left' : 'center';
  const name = esc(comp.name || 'Sarvadnya Infotech LLP');
  const website = String(comp.website || 'https://sarvadnyainfotech.com').replace(/\/+$/, '');
  return `<tr>
              <td style="background:#FBFAF6;padding:28px 24px 24px;text-align:${textAlign};border-bottom:3px solid #006569;">
                <a href="${esc(website)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;border:0;text-decoration:none;">
                  <img
                    src="${brandLogoSrc(logo, comp)}"
                    alt="${name}"
                    width="${EMAIL_LOGO_WIDTH}"
                    height="${EMAIL_LOGO_HEIGHT}"
                    style="display:inline-block;max-width:100%;width:${EMAIL_LOGO_WIDTH}px;height:auto;border:0;outline:none;text-decoration:none;"
                  />
                </a>
                <p style="margin:14px 0 0;color:#033B38;font-size:17px;font-weight:800;letter-spacing:0.3px;white-space:nowrap;">${name}</p>
              </td>
            </tr>`;
}

/** The shared footer band. No person's name — only the company copyright.
 *  `footerHtml` must be safe HTML (every caller escapes its dynamic values).
 *  CHANGE: 2026-11-20 — the legal links below mirror the signature footer and
 *  use current routes under `company.website` (/privacy, /terms, /eula, /careers,
 *  /contact), so templates no longer depend on any old placement or retired route. */
export function renderBrandFooter({ company, footerHtml, align = 'center' } = {}) {
  const comp = company || {};
  // CHANGE: 2026-11-21 — same left-align switch as the masthead (see header).
  const textAlign = align === 'left' ? 'left' : 'center';
  const name = esc(comp.name || 'Sarvadnya Infotech LLP');
  const website = String(comp.website || 'https://sarvadnyainfotech.com').replace(/\/+$/, '');
  const note = String(footerHtml || '').trim();
  const noteRow = note
    ? `<p style="margin:0;color:#8a9a92;font-size:11px;line-height:1.6;">${note}</p>`
    : '';
  const link = (path, label) =>
    `<a href="${esc(website)}${path}" target="_blank" rel="noopener noreferrer" style="color:#8a9a92;text-decoration:none;">${label}</a>`;
  // CHANGE: 2026-11-20 — legal link set copied from the signature footer example
  // (email-signature.html). Every path is a current site route; no old placement,
  // retired route, or individual's name appears anywhere in the shared footer.
  const legal = [
    link('/privacy', 'Privacy Policy'),
    link('/terms', 'Terms &amp; Conditions'),
    link('/eula', 'EULA'),
    link('/careers', 'Careers'),
    link('/contact', 'Contact'),
  ].join('<span style="padding:0 5px;color:#C7D0DD;">&middot;</span>');
  return `<tr>
              <td style="padding:18px 24px;background:#F4F8F8;border-top:1px solid #D9E8E8;text-align:${textAlign};">
                ${noteRow}
                <p style="margin:${note ? '8px' : '0'} 0 0;color:#8a9a92;font-size:11px;line-height:1.6;">&copy; 2026 ${name}. All rights reserved.
                <span style="padding:0 5px;color:#C7D0DD;">&middot;</span>
                ${legal}</p>
              </td>
            </tr>`;
}
