'use server';

import { supabase } from '@/lib/supabase';
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

    // 1. Upload Resume to Supabase Storage
    const fileExt = resumeFile.name.split('.').pop();
    const fileName = `${Date.now()}-${fullName.replace(/\s+/g, '-').toLowerCase()}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, resumeFile);

    if (uploadError) throw uploadError;

    // 2. Save Data to Supabase Database
    const { error: dbError } = await supabase
      .from('job_applications')
      .insert([
        {
          job_title: jobTitle,
          full_name: fullName,
          email,
          phone,
          experience,
          message,
          resume_url: filePath,
        },
      ]);

    if (dbError) {
      if (dbError.code === 'PGRST205') {
        throw new Error('Supabase: "job_applications" table not found. Please run the SQL bootstrap script.');
      }
      throw dbError;
    }

    revalidatePath('/admin/careers/responses');
    return { success: true };
  } catch (err) {
    console.error('Submission error:', err);
    return { error: 'Failed to submit application. Please try again.' };
  }
}
