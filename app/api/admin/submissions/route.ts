import { NextResponse } from 'next/server';
import { getSubmissionsPaginated, exportAllSubmissions, deleteSubmission, isValidObjectId } from '@/lib/mongodb-utils';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const FORM_TYPES = ['quote', 'enquire', 'support', 'callback', 'demo', 'general'];
// CHANGE: 2026-08-18 — Added 'ip' as a sortable column for enhanced data view.
const SORT_KEYS = ['createdAt', 'name', 'contact', 'formType', 'service', 'ip'];

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

    // CHANGE: 2026-08-18 — Added search param for text filtering and export mode.
    const search = (searchParams.get('search') || '').slice(0, 200);
    const exportMode = searchParams.get('export') === '1';

    // Export mode: return ALL matching records (no pagination) for Excel download.
    if (exportMode) {
      const allData = await exportAllSubmissions({ formType, search, sortBy, sortDir });
      return NextResponse.json({ submissions: allData, total: allData.length });
    }

    const { data, total } = await getSubmissionsPaginated({
      page: Math.max(1, page),
      limit,
      formType,
      sortBy,
      sortDir,
      search,
    });

    const totalPages = Math.max(1, Math.ceil(total / limit));
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
              search,
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
