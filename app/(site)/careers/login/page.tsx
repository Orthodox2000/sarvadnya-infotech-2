import { redirect } from 'next/navigation';

// CHANGE: 2026-10-05 — /careers/login no longer holds its own login page. Candidate sign-in now
// lives in the right-hand column of /careers, beside the openings, so this route is a server-side
// redirect. Kept as a route (not deleted) so existing bookmarks, the sitemap's inbound links and
// any shared candidate links still land somewhere useful instead of 404ing.
export default function CareersLoginRedirect() {
  redirect('/careers');
}