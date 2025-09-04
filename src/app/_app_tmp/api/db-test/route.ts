import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // create a user so we can see writes work
  const user = await prisma.user.create({
    data: { email: `test+${Date.now()}@example.com` },
  });
  const count = await prisma.user.count();
  return NextResponse.json({ createdId: user.id, totalUsers: count });
}
