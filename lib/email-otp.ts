import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail({ to, otp, expiryMin = 10 }: { to: string; otp: string; expiryMin?: number }) {
  if (!process.env.RESEND_API_KEY || process.env.AUTO_REPLY_ENABLED === '0' || !process.env.AUTO_REPLY_ENABLED) {
    return;
  }

  const from = process.env.AUTO_REPLY_FROM || process.env.RESEND_SENDER_EMAIL || 'noreply@sarvadnyainfotech.com';
  const replyTo = process.env.AUTO_REPLY_REPLY_TO || 'info@sarvadnyainfotech.com';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #FBFAF6; padding: 24px; border-bottom: 2px solid #E5F4F4;">
        <h2 style="color: #006569; margin: 0;">Sarvadnya Infotech LLP</h2>
        <p style="color: #666; margin: 4px 0 0 0; font-size: 14px;">Tally Certified Partner · Trusted Since 2008</p>
      </div>
      <div style="padding: 32px 24px;">
        <h3 style="color: #333; margin: 0 0 16px 0;">Reset your Careers password</h3>
        <p style="color: #555; font-size: 14px; line-height: 1.6;">Use the OTP below to reset your password. This OTP expires in ${expiryMin} minutes.</p>
        <div style="background: #E5F4F4; border: 2px solid #006569; padding: 20px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #006569; margin: 24px 0;">${otp}</div>
        <p style="color: #666; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
      <div style="background: #FBFAF6; padding: 16px 24px; border-top: 1px solid #E5F4F4; text-align: center; color: #666; font-size: 12px;">
        © ${new Date().getFullYear()} Sarvadnya Infotech LLP. All rights reserved.
      </div>
    </div>
  `;

  await resend.emails.send({
    from,
    to,
    replyTo,
    subject: 'Reset your Sarvadnya Careers password',
    html,
  });
}