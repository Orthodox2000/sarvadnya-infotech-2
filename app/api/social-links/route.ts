import { NextResponse } from 'next/server';
import { getSocialLinks, SOCIAL_LINK_FALLBACKS } from '@/lib/social-links';
import { PUBLIC_SOCIAL_LINKS_API_CACHE } from '@/lib/api-cache';

// CHANGE: 2026-11-26 — FIXED route, FIXED output shape. No params, no auth, no
// user data. The email templates open in a browser and copy this response into
// plain hrefs BEFORE pasting into Gmail/Outlook; mail clients never call the API
// themselves. Values come from server settings (lib/social-links.ts); a failure
// falls back to the fixed strings, so the response is never empty.
export async function GET() {
  let links;
  try {
    links = await getSocialLinks();
  } catch (error) {
    console.error('social-links: resolver failed, using fixed fallbacks', error);
    links = { ...SOCIAL_LINK_FALLBACKS };
  }

  return NextResponse.json(links, {
    headers: {
      'Cache-Control': PUBLIC_SOCIAL_LINKS_API_CACHE,
      // A locally-opened signature template has origin `null`; without these it
      // cannot read the response. next.config.js repeats them (header rules win).
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  });
}

// The browser GET is a simple request (no preflight), but answering OPTIONS keeps
// any tool that does preflight working too.
export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Max-Age': '86400',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  });
}
