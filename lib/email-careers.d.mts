// CHANGE: 2026-10-30 — Type declarations for lib/email-careers.mjs (careers
// email templates). Hand-written and minimal, same pattern as
// lib/email-autoreply.d.mts, so TS can import the shared templates without a
// build step and plain Node scripts can import the .mjs directly.

import type { AutoreplyCompany } from './email-autoreply.d.mts';

export interface CareerCompany extends AutoreplyCompany {}

/** Same logo resolution contract as the client auto-reply template. */
export interface CareerLogo {
  cid?: string;
  data?: string;
  url?: string;
}

export interface JobApplicationEmailData {
  jobId?: string;
  jobTitle?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  gender?: string;
  age?: number | string;
  qualification?: string;
  skills?: string;
  experience?: string;
  experienceDetails?: string;
  message?: string;
  resumeUrl?: string;
  resumeName?: string;
  appliedAt?: Date | string;
}

export interface ResumeEmailData {
  fullName?: string;
  email?: string;
  phone?: string;
  resumeUrl?: string;
  resumeName?: string;
  updatedAt?: Date | string;
}

export interface AccountCreatedEmailData {
  name?: string;
  email?: string;
  referralCode?: string;
  loginUrl?: string;
}

export function applicationCompanySubject(fullName?: string, jobTitle?: string): string;
export function resumeCompanySubject(fullName?: string): string;

export const APPLICATION_CONFIRMATION_SUBJECT: string;
export const RESUME_CONFIRMATION_SUBJECT: string;
export const ACCOUNT_CREATED_SUBJECT: string;

export function buildApplicationCompanyHtml(options?: {
  application?: JobApplicationEmailData;
  company?: Partial<CareerCompany>;
}): string;

export function buildApplicantConfirmationHtml(options?: {
  name?: string;
  jobTitle?: string;
  company?: Partial<CareerCompany>;
  logo?: CareerLogo;
}): string;

export function buildResumeCompanyHtml(options?: {
  candidate?: ResumeEmailData;
  company?: Partial<CareerCompany>;
}): string;

export function buildResumeConfirmationHtml(options?: {
  name?: string;
  resumeUrl?: string;
  resumeName?: string;
  company?: Partial<CareerCompany>;
  logo?: CareerLogo;
}): string;

export function buildAccountCreatedHtml(options?: {
  name?: string;
  email?: string;
  referralCode?: string;
  loginUrl?: string;
  company?: Partial<CareerCompany>;
  logo?: CareerLogo;
}): string;
