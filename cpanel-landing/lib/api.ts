// Backend lives on Vercel. These are the absolute URLs the static export
// talks to. Override at build time via NEXT_PUBLIC_* if the live backend
// moves to a custom domain.
export const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE || 'https://sarvadnya-infotech.vercel.app'
).replace(/\/+$/, '');

export const SITE_BASE = (
  process.env.NEXT_PUBLIC_SITE_BASE || 'https://sarvadnya-infotech.vercel.app'
).replace(/\/+$/, '');
