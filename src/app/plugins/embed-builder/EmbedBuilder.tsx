"use client";

import { useMemo, useState } from "react";

export default function EmbedBuilder() {
  const [network, setNetwork] = useState("solana");
  const [pairOrToken, setPairOrToken] = useState("");
  const [symbol, setSymbol] = useState("SOLUSDT"); // TradingView symbol
  const [jMintIn, setJMintIn] = useState("So11111111111111111111111111111111111111112");
  const [jMintOut, setJMintOut] = useState("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
  const [height, setHeight] = useState(420);
  const [theme, setTheme] = useState<"dark"|"light">("dark");

  const dexsUrl = useMemo(() => {
    if (!pairOrToken.trim()) return "";
    return `https://dexscreener.com/${network}/${pairOrToken.trim()}?embed=1&theme=${theme}`;
  }, [network, pairOrToken, theme]);

  const dexsIframe = useMemo(() => dexsUrl ? `<iframe src="${dexsUrl}" style="width:100%;height:${height}px;border:0;" loading="lazy"></iframe>` : "", [dexsUrl, height]);

  const tvScript = useMemo(() => {
    return `<div class="tradingview-widget-container">
  <div id="tv_chart"></div>
  <script src="https://s3.tradingview.com/tv.js"></script>
  <script>
  new TradingView.widget({
    "width": "100%",
    "height": ${height},
    "symbol": "${symbol}",
    "interval": "60",
    "timezone": "Etc/UTC",
    "theme": "${theme}",
    "style": "1",
    "locale": "en",
    "hide_legend": false,
    "save_image": false,
    "container_id": "tv_chart"
  });
  </script>
</div>`;
  }, [symbol, height, theme]);

  const jupUrl = useMemo(() => {
    const base = "https://jup.ag/swap";
    const params = new URLSearchParams({ inputMint: jMintIn, outputMint: jMintOut, fixed: "true" });
    return `${base}/${params.toString()}`;
  }, [jMintIn, jMintOut]);

  const jupBtn = useMemo(() => `<a href="${jupUrl}" target="_blank" rel="noopener" style="display:inline-block;padding:10px 14px;border-radius:10px;background:black;color:white;text-decoration:none">Swap on Jupiter</a>`, [jupUrl]);

  return (
    <div className="rounded-2xl border border-zinc-800 p-4">
      <div className="grid md:grid-cols-2 gap-6">
        <section>
          <h3 className="font-medium">DexScreener</h3>
          <div className="grid gap-3 md:grid-cols-2 mt-2">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Network</label>
              <select value={network} onChange={e=>setNetwork(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm">
                <option value="solana">Solana</option>
                <option value="ethereum">Ethereum</option>
                <option value="bsc">BSC</option>
                <option value="polygon">Polygon</option>
                <option value="base">Base</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Pair/Token</label>
              <input value={pairOrToken} onChange={e=>setPairOrToken(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 mt-2">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Height</label>
              <input type="number" min={300} max={1200} value={height} onChange={e=>setHeight(parseInt(e.target.value||"420",10))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Theme</label>
              <select value={theme} onChange={e=>setTheme(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm">
                <option value="dark">Dark</option><option value="light">Light</option>
              </select>
            </div>
          </div>
          {dexsUrl && (
            <>
              <div className="mt-3 text-xs text-zinc-400">Embed Code</div>
              <pre className="text-xs bg-zinc-950 border border-zinc-800 rounded-xl p-3 overflow-auto">{dexsIframe}</pre>
              <div className="mt-3 rounded-xl overflow-hidden border border-zinc-800">
                <iframe src={dexsUrl} style={{width:"100%",height:`${height}px`,border:0}} />
              </div>
            </>
          )}
        </section>

        <section>
          <h3 className="font-medium">TradingView</h3>
          <div className="grid gap-3 md:grid-cols-2 mt-2">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Symbol</label>
              <input value={symbol} onChange={e=>setSymbol(e.target.value)}
                placeholder="e.g. CRYPTO:SOLUSD or SOLUSDT" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Theme</label>
              <select value={theme} onChange={e=>setTheme(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm">
                <option value="dark">Dark</option><option value="light">Light</option>
              </select>
            </div>
          </div>
          <div className="mt-3 text-xs text-zinc-400">Embed Snippet</div>
          <pre className="text-xs bg-zinc-950 border border-zinc-800 rounded-xl p-3 overflow-auto">{tvScript}</pre>

          <h3 className="font-medium mt-6">Jupiter Swap Button</h3>
          <div className="grid gap-3 md:grid-cols-2 mt-2">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Input Mint</label>
              <input value={jMintIn} onChange={e=>setJMintIn(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Output Mint</label>
              <input value={jMintOut} onChange={e=>setJMintOut(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="mt-3 text-xs text-zinc-400">Button HTML</div>
          <pre className="text-xs bg-zinc-950 border border-zinc-800 rounded-xl p-3 overflow-auto">{jupBtn}</pre>
          <div className="mt-2" dangerouslySetInnerHTML={{ __html: jupBtn }} />
        </section>
      </div>
    </div>
  );
}
