import { NextResponse } from "next/server";
import { getAI } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { topic, tone = "funny", count = 10 } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Missing 'topic' string" }, { status: 400 });
    }

    const ai = getAI();

    // Keep prompt simple and reliable
    const sys = `You write short, punchy meme captions. Keep each caption on one line. No hashtags.`;
    const user = `Give me ${count} meme caption ideas about: \"${topic}\". Tone: ${tone}. \nReturn as a numbered list, one caption per line.`;

    const res = await ai.chat.completions.create({
      model: "gpt-4o-mini", // use any chat model available to you
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user }
      ],
      temperature: 0.9,
      max_tokens: 300,
    });

    const text = res.choices?.[0]?.message?.content ?? "";
    const lines = text
      .split("\n")
      .map(s => s.replace(/^\s*\d+[\).\s-]?\s*/, "").trim())
      .filter(Boolean)
      .slice(0, count);

    return NextResponse.json({ captions: lines });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "AI error" }, { status: 500 });
  }
}
