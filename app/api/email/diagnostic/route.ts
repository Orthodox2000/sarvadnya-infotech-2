import { NextResponse } from 'next/server';
import { getEmailDiagnostic } from '@/lib/email';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const diagnostic = await getEmailDiagnostic();
    return NextResponse.json(diagnostic, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Diagnostic failed', detail: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
