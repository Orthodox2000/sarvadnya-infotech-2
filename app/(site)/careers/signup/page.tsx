import { redirect } from 'next/navigation';

// CHANGE: 2026-10-05 — /careers/signup no longer holds its own sign-up page. Account creation is
// one click away inside the auth column of /careers ("Create account"), so this route redirects.
export default function CareersSignupRedirect() {
  redirect('/careers');
}