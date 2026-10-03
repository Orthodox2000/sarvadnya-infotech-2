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
const MEGA_ENABLED = process.env.MEGA_ENABLED === 'true' || process.env.MEGA_ENABLED === '1';

export async function submitApplication(formData: FormData) {
  try {
    const jobId = formData.get('jobId') as string;
    const jobTitle = formData.get('jobTitle') as string;
    const fullName = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const experience = formData.get('experience') as string;
    const message = formData.get('message') as string;
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
      experience,
      message,
      resume_url: resumeUrl,
      ip: meta.secGpc ? undefined : meta.ip,
      userAgent: meta.userAgent || undefined,
      geo,
    });

    revalidatePath('/admin/careers/responses');
    return { success: true };
  } catch (err) {
    console.error('Submission error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to submit application. Please try again.' };
  }
}
