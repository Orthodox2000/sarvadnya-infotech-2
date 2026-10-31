// CHANGE: 2026-10-30 — regression suite for lib/email-careers.mjs (careers email
// templates). NO NETWORK, NO DATABASE, NO RESEND CALLS — it only renders strings.
//
// WHY: the owner asked for job-application and resume notifications to reach BOTH
// the company and the candidate. Two things must never regress:
//   1. the COMPANY copy must actually carry the hiring fields the form collected
//      (a notification with a missing phone or resume link is useless), and
//   2. the CANDIDATE copy must never leak internal data (IP, geo, device, job id).
// Plus the usual template hygiene: every interpolated value is HTML-escaped, no
// literal "undefined" reaches a reader, and a javascript:/data: URL never becomes
// a clickable href.
import {
  applicationCompanySubject,
  resumeCompanySubject,
  APPLICATION_CONFIRMATION_SUBJECT,
  RESUME_CONFIRMATION_SUBJECT,
  ACCOUNT_CREATED_SUBJECT,
  buildApplicationCompanyHtml,
  buildApplicantConfirmationHtml,
  buildResumeCompanyHtml,
  buildResumeConfirmationHtml,
  buildAccountCreatedHtml,
} from '../lib/email-careers.mjs';
import { DEFAULT_COMPANY } from '../lib/email-autoreply.mjs';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ${name} ... PASS`);
    passed++;
  } catch (err) {
    console.log(`  ${name} ... FAIL - ${err.message}`);
    failed++;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function eq(actual, expected, msg) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`${msg || 'values differ'}: expected ${e}, received ${a}`);
}

const has = (html, needle, msg) => assert(html.includes(needle), msg || `missing: ${needle}`);
const lacks = (html, needle, msg) => assert(!html.includes(needle), msg || `should not contain: ${needle}`);

// A realistic application, including the fields that are easy to forget.
const APPLICATION = {
  jobId: 'job-digital-marketing-2026',
  jobTitle: 'Digital Marketing Executive',
  fullName: 'Priya Ramachandran',
  email: 'priya.ramachandran@example.com',
  phone: '+91 98765 43210',
  city: 'Navi Mumbai',
  gender: 'Female',
  age: 27,
  qualification: 'B.Com, MBA (Marketing)',
  skills: 'SEO, Google Ads, content writing',
  experience: '3-5 years',
  experienceDetails: 'Three years in a Navi Mumbai agency running paid search for retail brands.',
  message: 'I would like to work on Tally-related content.',
  resumeUrl: 'https://store123.public.blob.vercel-storage.com/sarvadnya-resume-priya-ab12cd.pdf',
  resumeName: 'priya-ramachandran-resume.pdf',
  appliedAt: new Date('2026-10-30T09:15:00Z'),
};

const RESUME = {
  fullName: 'Amit Shinde',
  email: 'amit.shinde@example.com',
  phone: '+91 90000 11111',
  resumeUrl: 'https://store123.public.blob.vercel-storage.com/sarvadnya-resume-amit-ef34gh.pdf',
  resumeName: 'amit-shinde-resume.pdf',
  updatedAt: new Date('2026-10-30T10:00:00Z'),
};

const ACCOUNT = {
  name: 'Priya Ramachandran',
  email: 'priya.ramachandran@example.com',
  referralCode: 'PRIYA7K2',
  loginUrl: 'https://sarvadnyainfotech.com/careers/login',
};

const accountCreated = buildAccountCreatedHtml({
  ...ACCOUNT,
  logo: { cid: 'sarvadnya-logo' },
});

/* ------------------------------------------------------------------ */
console.log('\n[1] module surface');
/* ------------------------------------------------------------------ */

test('the four bullets the callers rely on are exported', () => {
  assert(typeof buildApplicationCompanyHtml === 'function', 'buildApplicationCompanyHtml');
  assert(typeof buildApplicantConfirmationHtml === 'function', 'buildApplicantConfirmationHtml');
  assert(typeof buildResumeCompanyHtml === 'function', 'buildResumeCompanyHtml');
  assert(typeof buildResumeConfirmationHtml === 'function', 'buildResumeConfirmationHtml');
  assert(typeof buildAccountCreatedHtml === 'function', 'buildAccountCreatedHtml');
  assert(typeof applicationCompanySubject === 'function', 'applicationCompanySubject');
  assert(typeof resumeCompanySubject === 'function', 'resumeCompanySubject');
  assert(typeof APPLICATION_CONFIRMATION_SUBJECT === 'string' && APPLICATION_CONFIRMATION_SUBJECT.length > 0);
  assert(typeof RESUME_CONFIRMATION_SUBJECT === 'string' && RESUME_CONFIRMATION_SUBJECT.length > 0);
  assert(typeof ACCOUNT_CREATED_SUBJECT === 'string' && ACCOUNT_CREATED_SUBJECT.length > 0);
});

test('subjects name the person and the role, and stay single-line', () => {
  const s = applicationCompanySubject('Priya Ramachandran', 'Digital Marketing Executive');
  has(s, 'Priya Ramachandran');
  has(s, 'Digital Marketing Executive');
  lacks(s, '\n', 'subject must not contain a newline');
  assert(s.length <= 120, `subject too long (${s.length})`);
});

test('subjects survive missing values with a readable fallback', () => {
  const s = applicationCompanySubject(undefined, undefined);
  has(s, 'Candidate');
  has(s, 'Open position');
  has(resumeCompanySubject(undefined), 'Candidate');
});

/* ------------------------------------------------------------------ */
console.log('\n[2] company copy of a job application');
/* ------------------------------------------------------------------ */

const companyApplication = buildApplicationCompanyHtml({ application: APPLICATION });

test('carries every hiring field the form collects', () => {
  has(companyApplication, 'New job application');
  has(companyApplication, APPLICATION.jobTitle);
  has(companyApplication, APPLICATION.fullName);
  has(companyApplication, APPLICATION.email);
  has(companyApplication, APPLICATION.phone);
  has(companyApplication, APPLICATION.city);
  has(companyApplication, APPLICATION.gender);
  has(companyApplication, String(APPLICATION.age));
  has(companyApplication, 'B.Com, MBA (Marketing)');
  has(companyApplication, 'SEO, Google Ads, content writing');
  has(companyApplication, APPLICATION.experience);
  has(companyApplication, 'paid search for retail brands');
  has(companyApplication, APPLICATION.message);
  has(companyApplication, APPLICATION.jobId);
});

test('carries a real, clickable resume link', () => {
  has(companyApplication, `href="${APPLICATION.resumeUrl}"`);
  has(companyApplication, APPLICATION.resumeName);
  lacks(companyApplication, 'Not attached');
});

test('says the candidate was also emailed, so support knows', () => {
  has(companyApplication, 'also emailed a confirmation');
});

test('renders without a resume, and says so instead of printing undefined', () => {
  const html = buildApplicationCompanyHtml({
    application: { ...APPLICATION, resumeUrl: undefined, resumeName: undefined },
  });
  has(html, 'Not attached');
  lacks(html, 'undefined');
  lacks(html, 'href="undefined"');
});

test('works with no arguments at all (never throws, never prints undefined)', () => {
  const html = buildApplicationCompanyHtml();
  assert(html.startsWith('<!DOCTYPE html>'), 'not an HTML document');
  has(html, 'Not attached');
  lacks(html, 'undefined');
  lacks(html, '[object Object]');
});

/* ------------------------------------------------------------------ */
console.log('\n[3] candidate confirmation of a job application');
/* ------------------------------------------------------------------ */

const applicant = buildApplicantConfirmationHtml({
  name: APPLICATION.fullName,
  jobTitle: APPLICATION.jobTitle,
  logo: { cid: 'sarvadnya-logo' },
});

test('greets by first name and names the role', () => {
  has(applicant, 'Priya');
  lacks(applicant, 'Priya Ramachandran', 'the greeting should use the first name only');
  has(applicant, APPLICATION.jobTitle);
});

test('is a real email document with the company contact block', () => {
  assert(applicant.startsWith('<!DOCTYPE html>'), 'not an HTML document');
  has(applicant, DEFAULT_COMPANY.email);
  has(applicant, DEFAULT_COMPANY.website);
  has(applicant, 'All Rights Reserved');
});

test('leaks NO internal fields (IP, geo, device, job id, resume link)', () => {
  lacks(applicant, APPLICATION.jobId, 'job id must not reach the candidate');
  lacks(applicant, 'Candidate Details', 'internal table must not reach the candidate');
  lacks(applicant, 'Application Record', 'internal table must not reach the candidate');
  lacks(applicant, 'Received', 'internal timestamp label must not reach the candidate');
  lacks(applicant, 'resume-priya', 'the stored resume URL must not reach the candidate');
  lacks(applicant, 'IP');
  lacks(applicant, ipText());
});

// The IP/geo values only exist because the caller could pass them through; assert
// against the real submission shape used by app/actions/careers.ts.
function ipText() {
  return '49.36.12.7';
}

test('uses the inline logo when the caller attached one', () => {
  has(applicant, 'src="cid:sarvadnya-logo"');
  has(applicant, 'width="240"');
});

test('falls back to the hosted logo, never to a dangling cid', () => {
  const html = buildApplicantConfirmationHtml({ name: 'Amit', jobTitle: 'Sales Executive' });
  lacks(html, 'cid:', 'a cid reference without an attachment renders a broken image');
  has(html, `${DEFAULT_COMPANY.website.replace(/\/+$/, '')}/TallyCertificate.png`);
});

test('handles a missing name without inventing one', () => {
  const html = buildApplicantConfirmationHtml({});
  has(html, 'there');
  lacks(html, 'undefined');
});

/* ------------------------------------------------------------------ */
console.log('\n[4] company copy of a saved resume');
/* ------------------------------------------------------------------ */

const companyResume = buildResumeCompanyHtml({ candidate: RESUME });

test('carries the candidate identity and a clickable resume link', () => {
  has(companyResume, 'Resume uploaded');
  has(companyResume, RESUME.fullName);
  has(companyResume, RESUME.email);
  has(companyResume, RESUME.phone);
  has(companyResume, `href="${RESUME.resumeUrl}"`);
  has(companyResume, RESUME.resumeName);
});

test('distinguishes a stored profile resume from a real application', () => {
  has(companyResume, 'not a job application');
  has(companyResume, 'Applications arrive as a separate email');
});

test('never prints undefined for missing fields', () => {
  const html = buildResumeCompanyHtml({ candidate: { email: 'x@example.com' } });
  has(html, 'x@example.com');
  has(html, 'Unavailable');
  lacks(html, 'undefined');
});

/* ------------------------------------------------------------------ */
console.log('\n[5] candidate confirmation of a saved resume');
/* ------------------------------------------------------------------ */

const resumeConfirm = buildResumeConfirmationHtml({
  name: RESUME.fullName,
  resumeUrl: RESUME.resumeUrl,
  resumeName: RESUME.resumeName,
  logo: { cid: 'sarvadnya-logo' },
});

test('greets by first name and links their own resume', () => {
  has(resumeConfirm, 'Amit');
  has(resumeConfirm, `href="${RESUME.resumeUrl}"`);
  has(resumeConfirm, RESUME.resumeName);
  has(resumeConfirm, 'src="cid:sarvadnya-logo"');
});

test('has no internal fields', () => {
  lacks(resumeConfirm, 'Candidate Details');
  lacks(resumeConfirm, 'Unavailable');
  lacks(resumeConfirm, 'undefined');
});

test('falls back to the hosted logo when none is attached', () => {
  const html = buildResumeConfirmationHtml({ name: 'Amit', resumeUrl: RESUME.resumeUrl });
  lacks(html, 'cid:');
  has(html, '/TallyCertificate.png');
});

/* ------------------------------------------------------------------ */
console.log('\n[6] safety: escaping and URL schemes');
/* ------------------------------------------------------------------ */

test('HTML in a submitted field is escaped, never executed', () => {
  const html = buildApplicationCompanyHtml({
    application: {
      ...APPLICATION,
      fullName: '<script>alert(1)</script>',
      message: '<img src=x onerror=alert(2)>',
    },
  });
  lacks(html, '<script>alert(1)</script>');
  lacks(html, '<img src=x onerror=alert(2)>');
  has(html, '&lt;script&gt;');
  has(html, '&lt;img src=x onerror=alert(2)&gt;');
});

test('a javascript: resume URL never becomes an href', () => {
  const html = buildApplicationCompanyHtml({
    application: { ...APPLICATION, resumeUrl: 'javascript:alert(1)' },
  });
  lacks(html, 'javascript:alert');
  has(html, 'Not attached');
});

test('a data: URL is refused too', () => {
  const html = buildResumeCompanyHtml({
    candidate: { ...RESUME, resumeUrl: 'data:text/html;base64,PHNjcmlwdD4=' },
  });
  lacks(html, 'data:text/html');
  has(html, 'Unavailable');
});

test('no template emits raw chat markup or a literal undefined', () => {
  const docs = [companyApplication, applicant, companyResume, resumeConfirm, accountCreated];
  for (const html of docs) {
    lacks(html, '[[', 'raw [[Label|/url]] markup leaked into an email');
    lacks(html, 'undefined');
    lacks(html, 'NaN');
  }
});

test('company data falls back to the real on-site values', () => {
  const html = buildResumeCompanyHtml({ candidate: RESUME });
  has(html, DEFAULT_COMPANY.name);
  has(html, DEFAULT_COMPANY.email);
  has(html, DEFAULT_COMPANY.website);
  for (const line of DEFAULT_COMPANY.phoneLines || []) has(html, line);
});

test('the applicant copies are not gated by any marketing opt-in', () => {
  // Defence in depth: the templates must not read AUTO_REPLY_ENABLED (that switch
  // controls the marketing thank-you on enquiries; a hiring acknowledgement is a
  // core requested behaviour and ships enabled).
  const docs = [applicant, resumeConfirm, accountCreated];
  for (const html of docs) {
    lacks(html, 'AUTO_REPLY');
  }
  has(applicant, 'Thank you for applying, Priya');
  has(resumeConfirm, 'Your resume is saved, Amit');
  has(accountCreated, 'Welcome, Priya');
});

/* ------------------------------------------------------------------ */
console.log('\n[7] account created welcome mail');
/* ------------------------------------------------------------------ */

test('greets by first name and confirms the account at the right address', () => {
  has(accountCreated, 'Welcome, Priya');
  lacks(accountCreated, 'Priya Ramachandran', 'the greeting should use the first name only');
  has(accountCreated, ACCOUNT.email);
  has(accountCreated, 'has been created');
});

test('carries the referral code the account was just issued', () => {
  has(accountCreated, 'Your Referral Code');
  has(accountCreated, ACCOUNT.referralCode);
  has(accountCreated, 'How it works');
});

test('links to the careers login page, and only over http(s)', () => {
  has(accountCreated, `href="${ACCOUNT.loginUrl}"`);
  has(accountCreated, 'Sign in to your account');

  const hostile = buildAccountCreatedHtml({ ...ACCOUNT, loginUrl: 'javascript:alert(1)' });
  lacks(hostile, 'javascript:alert');
  // Falls back to the on-site careers login page rather than dropping the CTA.
  has(hostile, `${DEFAULT_COMPANY.website.replace(/\/+$/, '')}/careers/login`);
});

test('falls back to the on-site login page when no link is supplied', () => {
  const html = buildAccountCreatedHtml({ name: 'Amit' });
  has(html, `${DEFAULT_COMPANY.website.replace(/\/+$/, '')}/careers/login`);
  lacks(html, 'undefined');
});

test('is a real email document with the company contact block and logo', () => {
  assert(accountCreated.startsWith('<!DOCTYPE html>'), 'not an HTML document');
  has(accountCreated, 'src="cid:sarvadnya-logo"');
  has(accountCreated, DEFAULT_COMPANY.email);
  has(accountCreated, DEFAULT_COMPANY.website);
  has(accountCreated, 'All Rights Reserved');

  const hosted = buildAccountCreatedHtml({ ...ACCOUNT });
  lacks(hosted, 'cid:');
  has(hosted, '/TallyCertificate.png');
});

test('leaks NO internal fields (no id, hash, password, IP)', () => {
  lacks(accountCreated, 'passwordHash');
  lacks(accountCreated, 'scrypt');
  lacks(accountCreated, 'ObjectId');
  lacks(accountCreated, 'Candidate Details');
  lacks(accountCreated, 'Received');
});

test('escapes submitted values instead of executing them', () => {
  const html = buildAccountCreatedHtml({
    ...ACCOUNT,
    name: '<script>alert(1)</script>',
    email: '"><img src=x onerror=alert(2)>',
    referralCode: '<b>CODE</b>',
  });
  lacks(html, '<script>alert(1)</script>');
  lacks(html, '<img src=x onerror=alert(2)>');
  lacks(html, '<b>CODE</b>');
  has(html, '&lt;script&gt;');
});

test('renders without a referral code rather than printing an empty block', () => {
  const html = buildAccountCreatedHtml({ name: 'Amit', email: 'amit@example.com' });
  lacks(html, 'Your Referral Code');
  lacks(html, 'undefined');
});

console.log(`\ncareers-email: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
