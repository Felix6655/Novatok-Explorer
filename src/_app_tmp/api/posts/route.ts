import { NextResponse } from 'next/server';
// if you want DB later: import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  // const posts = await prisma.post.findMany(); // when your schema is ready
  return NextResponse.json([{ id: 1, title: 'Hello from API' }]);
}
