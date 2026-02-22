import { NextRequest, NextResponse } from 'next/server';
// @ts-expect-error pdf-parse has no types
import pdfParse from 'pdf-parse';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file || file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'PDF file required' }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);
    const text = typeof data?.text === 'string' ? data.text.trim() : '';
    return NextResponse.json({ text });
  } catch (err: unknown) {
    console.error('PDF extract error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to extract PDF text' },
      { status: 500 }
    );
  }
}
