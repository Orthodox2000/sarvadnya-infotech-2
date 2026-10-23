// CHANGE: 2026-10-22 — type declarations for the pure-ESM Sara guard module
// (lib/sara-guard.mjs). Hand-written and minimal, same pattern as
// lib/email-autoreply.d.mts and lib/careers-referral.d.mts, so TS gets types
// without a build step.

export const SALES_LONG_REPLY_CHARS: number;

export function containsProgrammingCode(text: unknown): boolean;
export function isCustomBuildRequest(text: unknown): boolean;
export function countQuestions(text: unknown): number;
export function hasDiscoveryQuestion(text: unknown): boolean;
export function isTdlRequest(text: unknown): boolean;

export function buildNoCodeReply(
  userQuery?: string,
  options?: { isLearn?: boolean }
): string;

export function buildDiscoveryBlock(
  userQuery?: string,
  options?: { isLearn?: boolean }
): string;

export function applyConsultantGuard(
  reply: string,
  userQuery?: string,
  options?: { isLearn?: boolean }
): {
  reply: string;
  action: 'none' | 'blocked-code' | 'added-discovery' | 'soft-length-nudge';
};
