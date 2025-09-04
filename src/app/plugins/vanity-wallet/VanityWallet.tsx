"use client";

import { useEffect, useRef, useState } from "react";
import nacl from "tweetnacl";
import bs58 from "bs58";

export default function VanityWallet() {
  const [prefix, setPrefix] = useState("NOVA");
  const [running, setRunning] = useState(false);
  const [found, setFound] = useState<{ pub: string; secret58: string } | null>(null);
  const countRef = useRef(0);

  useEffect(()=>() => { setRunning(false); }, []);

  async function start() {
    setFound(null); setRunning(true); countRef.current = 0;
    const wanted = prefix.trim();
    if (!wanted) return setRunning(false);

    // cap runtime (avoid locking UI)
    const deadline = Date.now() + 8000; // 8 seconds per run
    // simple loop in chunks
    while (running && Date.now() < deadline) {
      for (let i = 0; i < 100; i++) {
        const kp = nacl.sign.keyPair();
        const pub = bs58.encode(kp.publicKey);
        countRef.current++;
        if (pub.startsWith(wanted)) {
          const secret58 = bs58.encode(kp.secretKey);
          setFound({ pub, secret58 });
          setRunning(false);
          return;
        }
      }
      await new Promise(r => setTimeout(r, 0));
    }
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-zinc-800 p-4">
      <label className="block text-sm mb-1">Starts with</label>
      <input value={prefix} onChange={e=>setPrefix(e.target.value)}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm" />

      <div className="mt-3 flex gap-2">
        <button onClick={start} disabled={running} className="px-3 py-2 text-sm rounded-xl bg-white text-black">
          {running ? "Searching…" : "Search"}
        </button>
        <button onClick={()=>{ setRunning(false); setFound(null); }} className="px-3 py-2 text-sm rounded-xl border border-zinc-800">
          Stop
        </button>
      </div>

      <p className="text-xs text-zinc-500 mt-3">
        Demo only. Keypairs generated in-browser; do not use for real funds. Short prefixes (2–3 chars) are realistic; longer ones explode in time.
      </p>

      {found && (
        <div className="mt-4 space-y-2">
          <div className="rounded-xl border border-zinc-800 p-3">
            <div className="text-xs text-zinc-400 mb-1">Address</div>
            <div className="text-sm break-all">{found.pub}</div>
          </div>
          <div className="rounded-xl border border-zinc-800 p-3">
            <div className="text-xs text-zinc-400 mb-1">Secret (base58)</div>
            <div className="text-sm break-all">{found.secret58}</div>
          </div>
        </div>
      )}
    </div>
  );
}
