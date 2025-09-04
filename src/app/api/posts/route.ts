import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json([
    { id: 1, title: 'API is working' },
    { id: 2, title: 'from /api/posts' },
  ]);
}
