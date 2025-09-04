"use client";

import { useMemo, useState } from "react";
import { TOKENS, bySymbol } from "@/lib/tokens";

type QuoteResponse = {
  data?: Array<{
    inAmount: string;
    outAmount: string;
    otherAmountThreshold: string;
    priceImpactPct: number;
    routePlan: Array<{
      swapInfo: {
        source: string;
        feeAmount: number;
        feeMint: string;
      };
      percent: number;
    }>;
  }>;
  error?: string;
};

function formatNumber(x: number, max = 6) {
  return Number.isFinite(x) ? x.toLocaleString(undefined, { maximumFractionDigits: max }) : "-";
}

export default function SwapFeePlugin() {
  const [fromSym, setFromSym] = useState("SOL");
  const [toSym, setToSym] = useState("USDC");
  const [amountStr, setAmountStr] = useState("0.1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    networkFeeSOL: number;
    dexFee: number;
    dexFeeSymbol: string;
    priceImpactPct: number;
    outAmount: number;
  } | null>(null);
  const [err, setErr] = useState("");

  const from = bySymbol(fromSym)!;
  const to   = bySymbol(toSym)!;

  const amountInBaseUnits = useMemo(() => {
    const v = Number(amountStr);
    if (!Number.isFinite(v) || v <= 0) return null;
    return Math.round(v * Math.pow(10, from.decimals));
  }, [amountStr, from.decimals]);

  async function fetchQuote() {
    if (!amountInBaseUnits) {
      setErr("Enter a valid amount.");
      return;
    }
    setErr("");
    setLoading(true);
    setResult(null);

    try {
      const url = new URL("/api/jupiter/quote", window.location.origin);
      url.searchParams.set("inputMint", from.mint);
      url.searchParams.set("outputMint", to.mint);
      url.searchParams.set("amount", String(amountInBaseUnits));
      url.searchParams.set("slippageBps", "50");

      const r = await fetch(url);
      const data: QuoteResponse = await r.json();

      if (data.error) throw new Error(data.error);
      const best = data.data?.[0];
      if (!best) throw new Error("No route found");

      // Network fee on Solana is tiny; estimate ~ 0.000005 SOL per tx (5,000 lamports).
      const networkFeeSOL = 0.000005;

      // Sum DEX fees reported by route plan. They can be in various fee mints.
      // We'll surface the largest fee leg as the representative (simple view).
      let topFee = { feeAmount: 0, feeMint: to.mint };
      for (const leg of best.routePlan) {
        if (leg.swapInfo.feeAmount > topFee.feeAmount) {
          topFee = { feeAmount: leg.swapInfo.feeAmount, feeMint: leg.swapInfo.feeMint };
        }
      }

      const dexFeeIsOutput = topFee.feeMint === to.mint;
      const dexFee = dexFeeIsOutput
        ? topFee.feeAmount / Math.pow(10, to.decimals)
        : 0; // keep simple; advanced: convert fee token via another quote

      const outAmount = Number(best.outAmount) / Math.pow(10, to.decimals);

      setResult({
        networkFeeSOL,
        dexFee,
        dexFeeSymbol: dexFeeIsOutput ? to.symbol : "varies",
        priceImpactPct: best.priceImpactPct * 100,
        outAmount,
      });
    } catch (e: any) {
      // Offline fallback: approximate 0.3% DEX fee + tiny network fee.
      const v = Number(amountStr);
      if (Number.isFinite(v)) {
        setResult({
          networkFeeSOL: 0.000005,
          dexFee: v * 0.003,
          dexFeeSymbol: to.symbol,
          priceImpactPct: 0.2,
          outAmount: v * 0.997,
        });
        setErr("Live quote failed; showing approximate estimate.");
      } else {
        setErr(e?.message ?? "Failed to get quote");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 p-4">
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="block text-xs text-zinc-400 mb-1">From</label>
          <select
            value={fromSym}
            onChange={(e) => setFromSym(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm"
          >
            {TOKENS.map(t => <option key={t.symbol}>{t.symbol}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1">To</label>
          <select
            value={toSym}
            onChange={(e) => setToSym(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm"
          >
            {TOKENS.map(t => <option key={t.symbol}>{t.symbol}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1">Amount ({from.symbol})</label>
          <input
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm"
            placeholder="0.10"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={fetchQuote}
          disabled={loading || !amountInBaseUnits}
          className="px-3 py-2 text-sm rounded-xl bg-white text-black disabled:opacity-40"
        >
          {loading ? "Calculating…" : "Estimate Fees"}
        </button>
        <button
          onClick={() => { setResult(null); setErr(""); }}
          className="px-3 py-2 text-sm rounded-xl border border-zinc-800"
        >
          Reset
        </button>
      </div>

      {err && <p className="text-xs text-amber-400 mt-3">{err}</p>}

      {result && (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 p-3">
            <div className="text-sm text-zinc-400">Estimated Network Fee</div>
            <div className="text-lg">{formatNumber(result.networkFeeSOL, 9)} SOL</div>
          </div>
          <div className="rounded-xl border border-zinc-800 p-3">
            <div className="text-sm text-zinc-400">Estimated DEX Fee</div>
            <div className="text-lg">
              {formatNumber(result.dexFee)} {result.dexFeeSymbol}
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 p-3">
            <div className="text-sm text-zinc-400">Price Impact</div>
            <div className="text-lg">{formatNumber(result.priceImpactPct, 2)}%</div>
          </div>
          <div className="rounded-xl border border-zinc-800 p-3">
            <div className="text-sm text-zinc-400">Expected Output</div>
            <div className="text-lg">{formatNumber(result.outAmount)} {to.symbol}</div>
          </div>
        </div>
      )}

      <p className="text-xs text-zinc-500 mt-6">
        Uses Jupiter quotes when available. If offline/unavailable, shows a simple estimate (0.3% DEX fee + tiny Solana network fee).
      </p>
    </div>
  );
}
