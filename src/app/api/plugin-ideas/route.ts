import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { title, category, description, handle } = await req.json();

    if (!title || !category || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!["tools", "wallet", "dev", "social"].includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const idea = await prisma.pluginIdea.create({
      data: { title, category, description, handle: handle || null },
    });

    return NextResponse.json({ ok: true, idea }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to save idea" }, { status: 500 });
  }
}

export async function GET() {
  // optional: list last 50 for public/preview use
  const ideas = await prisma.pluginIdea.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ ideas });
}
