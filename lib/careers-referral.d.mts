// CHANGE: 2026-10-16 — type declarations for the pure-ESM referral-code module
// (lib/careers-referral.mjs). Hand-written and minimal, same pattern as
// lib/email-autoreply.d.mts, so TS gets types without a build step.

export const REFERRAL_ALPHABET: string;
export const REFERRAL_CODE_LENGTH: number;

export function normalizeReferralCode(input: unknown): string;
export function isValidReferralCodeFormat(code: unknown): boolean;
export function generateReferralCode(): string;
export function generateUniqueReferralCode(
  isTaken: (code: string) => boolean | Promise<boolean>,
  attempts?: number
): Promise<string>;
