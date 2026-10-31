// CHANGE: 2026-10-22 — type declarations for the pure-ESM Sara guard module
// (lib/sara-guard.mjs). Hand-written and minimal, same pattern as
// lib/email-autoreply.d.mts and lib/careers-referral.d.mts, so TS gets types
// without a build step.
// CHANGE: 2026-10-30 — added the shortcut/link rules (isShortcutLabel,
// formatShortcut, sanitizeShortcutButtons) plus the 2026-10-29 helpers that were
// missing from this file (hasCtaButton, stripCtaButtons, isOffTopicQuery,
// isDiscountQuery, buildDiscountReply) and the widened action union.

export const SALES_LONG_REPLY_CHARS: number;

export function containsProgrammingCode(text: unknown): boolean;
export function isCustomBuildRequest(text: unknown): boolean;
export function countQuestions(text: unknown): number;
export function hasDiscoveryQuestion(text: unknown): boolean;
export function hasCtaButton(text: unknown): boolean;
export function isTdlRequest(text: unknown): boolean;

export function isShortcutLabel(label: unknown): boolean;
export function formatShortcut(label: string): string;
export function sanitizeShortcutButtons(text?: string): {
  text: string;
  changed: boolean;
};

export function buildNoCodeReply(
  userQuery?: string,
  options?: { isLearn?: boolean }
): string;

export function buildDiscoveryBlock(
  userQuery?: string,
  options?: { isLearn?: boolean; includeButton?: boolean }
): string;

export function isOffTopicQuery(query?: string): boolean;
export function stripCtaButtons(text?: string): string;
export function isDiscountQuery(query?: string): boolean;
export function buildDiscountReply(query?: string): string;

export type ConsultantGuardAction =
  | 'none'
  | 'blocked-code'
  | 'added-discovery'
  | 'soft-length-nudge'
  | 'pricing-redirect'
  | 'stripped-offtopic-cta'
  | 'fixed-shortcut-markup';

export function applyConsultantGuard(
  reply: string,
  userQuery?: string,
  options?: { isLearn?: boolean }
): {
  reply: string;
  action: ConsultantGuardAction;
};
