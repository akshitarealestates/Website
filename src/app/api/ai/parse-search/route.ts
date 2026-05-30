import { NextResponse } from 'next/server';
import { parseSearchLLM } from '@/lib/ai/search-llm';
import { listLocalities } from '@/lib/data/repo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ParseSearchRequest {
  query?: string;
}

export async function POST(req: Request) {
  let body: ParseSearchRequest;
  try {
    body = (await req.json()) as ParseSearchRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const query = (body.query ?? '').trim();
  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  const localities = listLocalities().map((l) => ({ name: l.name, slug: l.slug }));
  const filters = await parseSearchLLM(query, localities);

  return NextResponse.json({ filters });
}
