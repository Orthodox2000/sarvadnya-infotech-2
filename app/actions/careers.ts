'use server';

import { headers } from 'next/headers';
import { uploadToMega } from '@/lib/mega';
import { saveApplication } from '@/lib/mongodb-utils';
import { revalidatePath } from 'next/cache';
import {
  getRequestMetaFromHeaders,
  lookupGeo,
  isIgnoredIp,
  visitorLog,
  maskIp,
} from '@/lib/visitors';
import type { GeoInfo } from '@/lib/visitors';
import { storeResume } from '@/lib/careers-storage';
// CHANGE: 2026-10-30 — Careers email (owner: "send to both applicant and company").
// A submitted application used to notify nobody. The company copy carries the
// hiring fields + an application link; the candidate gets a branded confirmation.
// Both ride the existing exactly-once send path (jobKey claim in email_queue), so
// a double-submit can never email twice.
import { createHash } from 'node:crypto';
import { getCompanyContact, hasInlineLogo } from '@/lib/email';
import { sendEmailDirect } from '@/lib/email-queue';
import {
  applicationCompanySubject,
  APPLICATION_CONFIRMATION_SUBJECT,
  buildApplicationCompanyHtml,
  buildApplicantConfirmationHtml,
} from '@/lib/email-careers.mjs';

const MEGA_ENABLED = process.env.MEGA_ENABLED === 'true' || process.env.MEGA_ENABLED === '1';

// Stable, short dedupe key. NOTE: the resume URL changes on every re-upload, so it
// must NOT be part of the key — re-applying for the same role with the same details
// is the duplicate we want to collapse.
function applicationJobKey(fields: { email: string; jobId: string; phone: string; fullName: string }): string {
  const digest = createHash('sha256')
    .update([fields.email, fields.jobId, fields.phone, fields.fullName].join('|'))
    .digest('hex');
  return `career-app:${digest.slice(0, 32)}`;
}

export async function submitApplication(formData: FormData) {
  try {
    const jobId = formData.get('jobId') as string;
    const jobTitle = formData.get('jobTitle') as string;
    const fullName = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const experience = formData.get('experience') as string;
    const message = formData.get('message') as string;
    // CHANGE: 2026-10-17 — candidate profile fields (autofilled from the account in QuickApplyModal;
    // previously qualification/skills/experienceDetails were sent by the form but silently DROPPED
    // here, and gender/age/city did not exist).
    const gender = (formData.get('gender') as string) || '';
    const city = (formData.get('city') as string) || '';
    const qualification = (formData.get('qualification') as string) || '';
    const skills = (formData.get('skills') as string) || '';
    const experienceDetails = (formData.get('experienceDetails') as string) || '';
    const ageRaw = ((formData.get('age') as string) || '').trim();
    const age = ageRaw && Number.isInteger(Number(ageRaw)) ? Number(ageRaw) : undefined;
    const resumeUrlField = formData.get('resumeUrl') as string;
    const resumeName = (formData.get('resumeName') as string) || 'resume.pdf';

    if (!resumeUrlField) {
      return { error: 'Resume is required.' };
    }

    // 1. Upload Resume
    let resumeUrl = '';
    try {
      const resumeRes = await fetch(resumeUrlField);
      if (!resumeRes.ok) throw new Error('Failed to download uploaded resume.');
      const resumeBuffer = Buffer.from(await resumeRes.arrayBuffer());
      if (MEGA_ENABLED) {
        try {
          resumeUrl = await uploadToMega(resumeBuffer, resumeName);
        } catch (uploadError) {
          console.warn('Mega.nz upload error, falling back to Blob:', uploadError);
          resumeUrl = await storeResume(resumeBuffer, resumeName);
        }
      } else {
        resumeUrl = await storeResume(resumeBuffer, resumeName);
      }
    } catch (uploadError) {
      console.error('Resume upload error:', uploadError);
      throw new Error('Failed to upload resume to storage.');
    }

    // 2. Passive enrichment: IP, UA, geo (cache-first). GPC opt-out → none.
    let meta = { ip: 'anonymous', userAgent: '', language: '', secGpc: false, secFetchSite: '', referrer: '' };
    try {
      meta = getRequestMetaFromHeaders(await headers());
    } catch {
      // headers() unavailable outside a request scope — degrade gracefully.
    }

    // CHANGE: 2026-09-30 — Ignore-list gate. Writes to the PRODUCTION
    // `job_applications` collection. Dev tests otherwise created genuine job
    // applications in prod. Returns success so the modal still behaves while
    // developing, but nothing is persisted.
    if (isIgnoredIp(meta.ip)) {
      visitorLog('warn', 'ignored ip — application not saved', { ip: maskIp(meta.ip) });
      revalidatePath('/admin/careers/responses');
      return { success: true, ignored: true };
    }

    let geo: GeoInfo | null = null;
    if (!meta.secGpc && meta.ip !== 'anonymous') {
      const lookup = await lookupGeo(meta.ip);
      geo = lookup.geo;
    }

    // 3. Save Data to MongoDB
    await saveApplication({
      job_id: jobId,
      job_title: jobTitle,
      full_name: fullName,
      email,
      phone,
      // CHANGE: 2026-10-17 — application now carries the candidate's profile details too.
      gender: gender || undefined,
      age,
      city: city || undefined,
      qualification: qualification || undefined,
      skills: skills || undefined,
      experience,
      experienceDetails: experienceDetails || undefined,
      message,
      resume_url: resumeUrl,
      ip: meta.secGpc ? undefined : meta.ip,
      userAgent: meta.userAgent || undefined,
      geo,
    });

    // CHANGE: 2026-10-30 — Notify the company + confirm to the candidate.
    // Never blocks the response: the application is already saved, so an email
    // failure is logged and swallowed (the candidate must not see an error for a
    // notification problem). Sending is opt-in per destination: until
    // EMAIL_DESTINATION_RECIPIENTS.careers is seeded this returns
    // 'no-recipient-configured' and sends nothing — including no candidate copy.
    try {
      const company = await getCompanyContact();
      const inlineLogo = hasInlineLogo();
      const appliedAt = new Date();

      const companyHtml = buildApplicationCompanyHtml({
        application: {
          jobId,
          jobTitle,
          fullName,
          email,
          phone,
          city: city || undefined,
          gender: gender || undefined,
          age,
          qualification: qualification || undefined,
          skills: skills || undefined,
          experience,
          experienceDetails: experienceDetails || undefined,
          message,
          resumeUrl,
          resumeName,
          appliedAt,
        },
        company,
      });

      const applicantHtml = buildApplicantConfirmationHtml({
        name: fullName,
        jobTitle,
        company,
        // A cid: reference is only correct when the attachment is really there.
        logo: inlineLogo ? { cid: 'sarvadnya-logo' } : undefined,
      });

      const mailResult = await sendEmailDirect({
        jobKey: applicationJobKey({ email, jobId, phone, fullName }),
        formType: 'careers',
        destination: 'careers',
        submission: {
          name: fullName,
          email,
          contact: phone,
          service: jobTitle,
          description: message,
          formType: 'careers',
          destination: 'careers',
          ip: meta.secGpc ? undefined : meta.ip,
          userAgent: meta.userAgent || undefined,
          geo,
        },
        custom: {
          company: {
            subject: applicationCompanySubject(fullName, jobTitle),
            html: companyHtml,
            // Reply goes straight to the candidate.
            replyTo: email,
          },
          applicant: {
            to: email,
            subject: APPLICATION_CONFIRMATION_SUBJECT,
            html: applicantHtml,
            replyTo: company.email,
            inlineLogo,
          },
        },
      });
      if (mailResult.error) {
        visitorLog('warn', 'careers application email not sent', {
          ip: maskIp(meta.ip),
          error: mailResult.error,
        });
      }
    } catch (mailError) {
      console.error('Careers application email error (application was saved):', mailError);
    }

    revalidatePath('/admin/careers/responses');
    return { success: true };
  } catch (err) {
    console.error('Submission error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to submit application. Please try again.' };
  }
}
