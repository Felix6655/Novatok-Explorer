import { NextResponse } from "next/server"
import { z } from "zod"

const Schema = z.object({ email: z.string().email() })

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  return NextResponse.json({ ok: true })
}
