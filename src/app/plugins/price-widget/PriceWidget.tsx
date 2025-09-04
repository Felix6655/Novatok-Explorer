"use client";

import { useMemo, useState } from "react";

const NETWORKS = [
  { id: "solana", label: "Solana" },
  { id: "ethereum", label: "Ethereum" },
  { id: "bsc", label: "BSC" },
  { id: "polygon", label: "Polygon" },
  { id: "base", label: "Base" },
];

function TextRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-3">
      <div className="text-xs text-zinc-400 mb-1">{label}</div>
      <div className="rounded-lg border border-zinc-800 px-3 py-2 text-xs bg-zinc-950 break-all">
        {value}
      </div>
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1000);
        }}
        className="mt-2 text-xs underline"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

export default function PriceWidget() {
  const [network, setNetwork] = useState("solana");
  const [address, setAddress] = useState(""); // pair address is best; token ok if DexScreener resolves
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [height, setHeight] = useState(400);

  const embedUrl = useMemo(() => {
    // DexScreener embed pattern:
    // https://dexscreener.com/{chain}/{pairOrToken}?embed=1&theme=dark
    if (!address.trim()) return "";
    const base = `https://dexscreener.com/${network}/${address.trim()}`;
    const params = `embed=1&theme=${theme}`;
    return `${base}?${params}`;
  }, [network, address, theme]);

  const iframeCode = useMemo(() => {
    if (!embedUrl) return "";
    return `<iframe\n  src=\"${embedUrl}\"\n  style=\"width:100%;height:${height}px;border:0;\"\n  loading=\"lazy\"\n  allow=\"clipboard-write; fullscreen\"\n></iframe>`;
  }, [embedUrl, height]);

  return (
    <div className="rounded-2xl border border-zinc-800 p-4">
      <div className="grid md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Network</label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm"
          >
            {NETWORKS.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-zinc-400 mb-1">Token or Pair Address</label>
          <input
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Paste token or pair address…"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Theme</label>
          <select
            value={theme}
            onChange={e => setTheme(e.target.value as "dark" | "light")}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Height (px)</label>
          <input
            type="number"
            min={200}
            max={1000}
            value={height}
            onChange={e => setHeight(Number(e.target.value))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm"
          />
        </div>
      </div>
      {embedUrl && (
        <div className="mt-6">
          <label className="block text-xs text-zinc-400 mb-1">Live Preview</label>
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <iframe
              src={embedUrl}
              style={{ width: "100%", height: `${height}px`, border: 0 }}
              loading="lazy"
              allow="clipboard-write; fullscreen"
            />
          </div>
        </div>
      )}
      {iframeCode && (
        <TextRow label="Embed Code" value={iframeCode} />
      )}
      <p className="text-xs text-zinc-500 mt-6">
        Paste a token or pair address from DexScreener. Copy the embed code to use in your site, dashboard, or Notion page.
      </p>
    </div>
  );
}
