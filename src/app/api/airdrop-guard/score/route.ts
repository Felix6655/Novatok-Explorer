import { NextResponse } from "next/server";

// very light Solana base58 check (not full validation)
function looksLikeSolana(mint: string) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(mint);
}

export async function POST(req: Request) {
  try {
    const { address, challengeAnswer, fp } = await req.json();

    // base score
    let score = 50;
    const reasons: string[] = [];

    if (!address || typeof address !== "string" || !looksLikeSolana(address)) {
      score -= 30; reasons.push("Address format weak/invalid");
    } else {
      score += 5; reasons.push("Address format OK");
    }

    // simple 2-step challenge: expects a number 3..21
    if (typeof challengeAnswer === "number" && challengeAnswer >= 3 && challengeAnswer <= 21) {
      score += 15; reasons.push("Challenge solved");
    } else {
      score -= 20; reasons.push("Challenge failed");
    }

    // basic fingerprint heuristics (timezone offset, languages length, UA length)
    const tzOk = typeof fp?.tz === "number" && Math.abs(fp.tz) <= 14 * 60;
    const langOk = Array.isArray(fp?.langs) && fp.langs.length > 0 && fp.langs.length <= 6;
    const uaOk = typeof fp?.ua === "string" && fp.ua.length >= 20;

    if (tzOk) score += 5; else reasons.push("Timezone weird");
    if (langOk) score += 5; else reasons.push("Language list odd");
    if (uaOk) score += 5; else reasons.push("User-agent too short");

    // clamp
    score = Math.max(0, Math.min(100, score));

    // simple verdicts
    const verdict = score >= 80 ? "pass" : score >= 60 ? "review" : "fail";

    return NextResponse.json({ score, verdict, reasons });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "scoring error" }, { status: 500 });
  }
}
