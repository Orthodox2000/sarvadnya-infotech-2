import { Resend } from 'resend';
// CHANGE: 2026-10-31 — Rewrote the OTP sender. It previously built the Resend
// client at module load from process.env.RESEND_API_KEY and bailed out unless
// AUTO_REPLY_ENABLED was set — but that switch is the *marketing* thank-you
// kill-switch and is unset in production, so every password-reset OTP silently
// never sent. The sender/API key now come from the same admin-managed config as
// every other email (getEmailConfig), and there is no marketing gate here.
//
// Deliberately NOT routed through sendTemplatedEmail(): that path applies the
// global CC, which would leak a one-time password to a third party.
import { getEmailConfig, getCompanyContact, isValidEmail, escapeHtml } from './email';

export async function sendOtpEmail({ to, otp, expiryMin = 10 }: { to: string; otp: string; expiryMin?: number }) {
  const { apiKey, from: configuredFrom } = await getEmailConfig();
  if (!apiKey) {
    console.warn('OTP email not sent: RESEND_API_KEY is not configured');
    return;
  }

  const from = String(configuredFrom || '').trim();
  if (!isValidEmail(from)) {
    console.warn(`OTP email not sent: invalid sender address "${from}"`);
    return;
  }

  const company = await getCompanyContact();
  const replyTo = isValidEmail(String(company.email || '')) ? company.email : 'info@sarvadnyainfotech.com';
  const minutes = Number(expiryMin) > 0 ? Number(expiryMin) : 10;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #FBFAF6; padding: 24px; border-bottom: 2px solid #E5F4F4;">
        <h2 style="color: #006569; margin: 0;">${escapeHtml(company.name)}</h2>
        <p style="color: #666; margin: 4px 0 0 0; font-size: 14px;">${escapeHtml(company.tagline)}</p>
      </div>
      <div style="padding: 32px 24px;">
        <h3 style="color: #333; margin: 0 0 16px 0;">Reset your Careers password</h3>
        <p style="color: #555; font-size: 14px; line-height: 1.6;">Use the OTP below to reset your password. This OTP expires in ${escapeHtml(minutes)} minutes.</p>
        <div style="background: #E5F4F4; border: 2px solid #006569; padding: 20px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #006569; margin: 24px 0;">${escapeHtml(otp)}</div>
        <p style="color: #666; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
      <div style="background: #FBFAF6; padding: 16px 24px; border-top: 1px solid #E5F4F4; text-align: center; color: #666; font-size: 12px;">
        &copy; ${new Date().getFullYear()} ${escapeHtml(company.name)}. All rights reserved.
      </div>
    </div>
  `;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo,
    subject: 'Reset your Sarvadnya Careers password',
    html,
    tags: [{ name: 'source', value: 'careers-password-reset' }],
  });

  if (error) {
    throw new Error(error.message || 'Resend OTP send failed');
  }
}
