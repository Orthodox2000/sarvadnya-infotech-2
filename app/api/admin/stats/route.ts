import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb-utils';

export async function GET() {
  try {
    const stats: any = {
      submissions: 0,
      applications: 0,
      modules: 0,
      learning: 0,
      reviews: 0,
      news: 0,
      partners: 0,
      faq: 0
    };

    // Submissions count
    const submissionsCol = await getCollection('form_submissions');
    stats.submissions = await submissionsCol.countDocuments();

    // Applications count
    const applicationsCol = await getCollection('job_applications');
    stats.applications = await applicationsCol.countDocuments();

    // Modules count
    const modulesCol = await getCollection('modules');
    stats.modules = await modulesCol.countDocuments();

    // Learning count
    const learningCol = await getCollection('learning_content');
    stats.learning = await learningCol.countDocuments();

    // Reviews count
    const reviewsCol = await getCollection('reviews');
    stats.reviews = await reviewsCol.countDocuments();

    // News count
    const newsCol = await getCollection('news');
    stats.news = await newsCol.countDocuments();

    // Partners count
    const partnersCol = await getCollection('partners');
    stats.partners = await partnersCol.countDocuments();

    // FAQ count (from site_content)
    const siteContentCol = await getCollection('site_content');
    const faqDoc = await siteContentCol.findOne({ section: 'home_faq' });
    if (faqDoc && Array.isArray(faqDoc.content)) {
      stats.faq = faqDoc.content.length;
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
