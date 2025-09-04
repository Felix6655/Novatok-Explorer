import { NextResponse } from "next/server";

/**
 * Proxies Jupiter v6 quote endpoint:
 *   GET /api/jupiter/quote?inputMint=&outputMint=&amount=&slippageBps=
 * amount is in base units (e.g., SOL 1 = 1_000_000_000)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const inputMint = searchParams.get("inputMint");
  const outputMint = searchParams.get("outputMint");
  const amount = searchParams.get("amount");
  const slippageBps = searchParams.get("slippageBps") ?? "50"; // 0.5%

  if (!inputMint || !outputMint || !amount) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const url = new URL("https://quote-api.jup.ag/v6/quote");
  url.searchParams.set("inputMint", inputMint);
  url.searchParams.set("outputMint", outputMint);
  url.searchParams.set("amount", amount);
  url.searchParams.set("slippageBps", slippageBps);
  url.searchParams.set("onlyDirectRoutes", "true");

  try {
    const r = await fetch(url, { next: { revalidate: 10 } });
    if (!r.ok) {
      const text = await r.text();
      return NextResponse.json({ error: `Jupiter error: ${text}` }, { status: 502 });
    }
    const data = await r.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Proxy error" }, { status: 500 });
  }
}
