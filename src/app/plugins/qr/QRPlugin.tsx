"use client";

import { useMemo, useState } from "react";
import QRCode from "qrcode";

export default function QRPlugin() {
  const [addr, setAddr] = useState("");
  const [png, setPng] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function makeQR(value: string) {
    try {
      setError("");
      const dataUrl = await QRCode.toDataURL(value, {
        errorCorrectionLevel: "M",
        margin: 2,
        width: 512,
        color: { dark: "#ffffff", light: "#00000000" },
      });
      setPng(dataUrl);
    } catch (e) {
      setError("Could not generate QR. Check the address.");
    }
  }

  const disabled = useMemo(() => addr.trim().length < 10, [addr]);

  return (
    <div className="rounded-2xl border border-zinc-800 p-4">
      <label className="block text-sm mb-2">Wallet address (Solana, ETH, etc.)</label>
      <input
        value={addr}
        onChange={(e) => setAddr(e.target.value)}
        placeholder="Paste wallet address…"
        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-zinc-600"
      />

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => makeQR(addr)}
          disabled={disabled}
          className="px-3 py-2 text-sm rounded-xl bg-white text-black disabled:opacity-40"
        >
          Generate QR
        </button>
        <button
          onClick={() => { setAddr(""); setPng(null); }}
          className="px-3 py-2 text-sm rounded-xl border border-zinc-800"
        >
          Reset
        </button>
      </div>

      {error && <p className="text-red-400 text-xs mt-3">{error}</p>}

      {png && (
        <div className="mt-6 flex flex-col items-start gap-3">
          <img src={png} alt="Wallet QR" className="w-48 h-48 bg-white rounded-xl p-2" />
          <a href={png} download="novatok-wallet-qr.png" className="text-sm underline">
            Download PNG
          </a>
        </div>
      )}

      <p className="text-xs text-zinc-500 mt-6">
        Tip: You can print this QR or share it on socials so people can send tokens easily.
      </p>
    </div>
  );
}
