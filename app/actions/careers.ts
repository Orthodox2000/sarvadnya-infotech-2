'use server';

import { uploadToMega } from '@/lib/mega';
import { saveApplication } from '@/lib/mongodb-utils';
import { revalidatePath } from 'next/cache';

export async function submitApplication(formData: FormData) {
  try {
    const jobId = formData.get('jobId') as string;
    const jobTitle = formData.get('jobTitle') as string;
    const fullName = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const experience = formData.get('experience') as string;
    const message = formData.get('message') as string;
    const resumeFile = formData.get('resume') as File;

    if (!resumeFile || resumeFile.size === 0) {
      return { error: 'Resume is required.' };
    }

    // 1. Upload Resume to Mega.nz
    let resumeUrl = '';
    try {
      resumeUrl = await uploadToMega(resumeFile);
    } catch (uploadError) {
      console.error('Mega.nz upload error:', uploadError);
      throw new Error('Failed to upload resume to storage.');
    }

    // 2. Save Data to MongoDB
    await saveApplication({
      job_id: jobId,
      job_title: jobTitle,
      full_name: fullName,
      email,
      phone,
      experience,
      message,
      resume_url: resumeUrl,
    });

    revalidatePath('/admin/careers/responses');
    return { success: true };
  } catch (err) {
    console.error('Submission error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to submit application. Please try again.' };
  }
}
