// CHANGE: 2026-10-05 — barrel updated for the /careers redesign:
//   * `CareersAuthGate` -> `CareersAuthProvider`. The old gate RETURNED the login card instead of
//     its children when signed out, which hid the openings list from every logged-out visitor.
//     It is now a provider that always renders children and only supplies auth state.
//   * `OpeningCard` -> `OpeningRow`. The card-per-role layout was too tall for the left column of
//     the new two-column page; `OpeningRow` is a slim row with an inline details expander.
//   * `IdCard` is no longer a bare block: its outer `mb-6` moved to the call sites, so the same
//     component works both in the /careers auth column and on /careers/profile.
export { AuthForms } from './AuthForms';
export { IdCard } from './IdCard';
export { ResumeManager } from './ResumeManager';
export { OpeningRow } from './OpeningRow';
export { CareersAuthProvider } from './CareersAuthProvider';
export type { CareersAuthState } from './CareersAuthProvider';