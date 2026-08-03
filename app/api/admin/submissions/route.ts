import { NextResponse } from 'next/server';
import { getSubmissionsPaginated, deleteSubmission, isValidObjectId } from '@/lib/mongodb-utils';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const FORM_TYPES = ['quote', 'enquire', 'support', 'callback', 'demo', 'general'];
const SORT_KEYS = ['createdAt', 'name', 'contact', 'formType', 'service'];

function clampInt(raw: string | null, fallback: number, min: number, max: number): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.floor(parsed), min), max);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = clampInt(searchParams.get('page'), 1, 1, Number.MAX_SAFE_INTEGER);
    const limit = clampInt(searchParams.get('limit'), DEFAULT_LIMIT, 1, MAX_LIMIT);

    const rawType = (searchParams.get('formType') || '').toLowerCase();
    const formType = FORM_TYPES.includes(rawType) ? rawType : undefined;

    const sortBy = SORT_KEYS.includes(searchParams.get('sortBy') || '') ? (searchParams.get('sortBy') as string) : 'createdAt';
    const sortDir = searchParams.get('sortDir') === 'asc' ? 'asc' : 'desc';

    const { data, total } = await getSubmissionsPaginated({
      page: Math.max(1, page),
      limit,
      formType,
      sortBy,
      sortDir,
    });

    const totalPages = Math.max(1, Math.ceil(total / limit));
    // Clamp to the last page so a request beyond the range (e.g. after the
    // final item on the last page was deleted) never returns an empty page.
    const safePage = Math.min(Math.max(1, page), totalPages);

    const finalData =
      safePage === page || totalPages <= 1
        ? data
        : (
            await getSubmissionsPaginated({
              page: safePage,
              limit,
              formType,
              sortBy,
              sortDir,
            })
          ).data;

    return NextResponse.json({
      submissions: finalData,
      pagination: { page: safePage, limit, total, totalPages },
    });
  } catch (error) {
    console.error('Admin Submissions GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 });
    }

    const result = await deleteSubmission(id);
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Admin Submissions DELETE Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
