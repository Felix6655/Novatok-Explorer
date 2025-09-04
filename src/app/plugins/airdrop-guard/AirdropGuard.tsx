"use client";

import { useMemo, useState } from "react";

export default function AirdropGuard() {
  const [address, setAddress] = useState("");
  const [diceA, diceB] = useMemo(() => [Math.ceil(Math.random()*6), Math.ceil(Math.random()*6)], []);
  const [ans, setAns] = useState("");
  const [res, setRes] = useState<any>(null);
  const [err, setErr] = useState("");

  async function score() {
    setErr(""); setRes(null);
    try {
      const fp = {
        tz: new Date().getTimezoneOffset(),
        langs: navigator.languages,
        ua: navigator.userAgent,
      };
      const r = await fetch("/api/airdrop-guard/score", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ address, challengeAnswer: Number(ans), fp }),
      });
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setRes(data);
    } catch (e:any) {
      setErr(e?.message ?? "Failed to score");
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 p-4">
      <label className="block text-sm mb-1">Wallet address (Solana)</label>
      <input value={address} onChange={e=>setAddress(e.target.value)}
        placeholder="Paste address…" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm" />

      <div className="mt-3">
        <label className="block text-sm mb-1">
          Challenge: If <b>NOVA = 1</b>, what is <b>{diceA} + {diceB}</b>?
        </label>
        <input value={ans} onChange={e=>setAns(e.target.value)}
          placeholder="Enter a number…" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm" />
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={score} className="px-3 py-2 text-sm rounded-xl bg-white text-black">Get Bot Score</button>
        <button onClick={()=>{ setRes(null); setErr(""); setAns(""); setAddress(""); }} className="px-3 py-2 text-sm rounded-xl border border-zinc-800">Reset</button>
      </div>

      {err && <p className="text-xs text-amber-400 mt-3">{err}</p>}

      {res && (
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 p-3">
            <div className="text-xs text-zinc-400">Score</div>
            <div className="text-xl">{res.score}/100</div>
          </div>
          <div className="rounded-xl border border-zinc-800 p-3">
            <div className="text-xs text-zinc-400">Verdict</div>
            <div className="text-xl capitalize">{res.verdict}</div>
          </div>
          <div className="rounded-xl border border-zinc-800 p-3 md:col-span-1 md:col-start-auto md:row-span-1">
            <div className="text-xs text-zinc-400">Notes</div>
            <ul className="text-xs mt-1 list-disc pl-4">
              {(res.reasons || []).map((r:string, i:number)=> <li key={i}>{r}</li>)}
            </ul>
          </div>
        </div>
      )}

      <p className="text-xs text-zinc-500 mt-4">
        Lite heuristic only. For production, add wallet age/activity checks and server-side device reputation.
      </p>
    </div>
  );
}
