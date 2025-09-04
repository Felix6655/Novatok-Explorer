"use client";

import { useState } from "react";

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false), 1000); }}
      className="text-xs px-2 py-1 rounded border border-zinc-700 hover:border-zinc-500"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function MemeCaptions() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("funny");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);
  const [err, setErr] = useState("");

  async function generate() {
    if (!topic.trim()) { setErr("Type a topic or short image description."); return; }
    setErr("");
    setLoading(true);
    setCaptions([]);

    try {
      const r = await fetch("/api/captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, count }),
      });
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setCaptions(data.captions ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to generate captions.");
    } finally {
      setLoading(false);
    }
  }

  async function copyAll() {
    await navigator.clipboard.writeText(captions.map((c,i)=>`${i+1}. ${c}`).join("\n"));
  }

  return (
    <div className="rounded-2xl border border-zinc-800 p-4">
      <label className="block text-sm mb-1">Topic or image description</label>
      <textarea
        value={topic}
        onChange={(e)=>setTopic(e.target.value)}
        placeholder={`e.g. "When your crypto dips but you’re still DCA-ing"`}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm h-24"
      />

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Tone</label>
          <select
            value={tone}
            onChange={(e)=>setTone(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm"
          >
            <option value="funny">Funny</option>
            <option value="sarcastic">Sarcastic</option>
            <option value="wholesome">Wholesome</option>
            <option value="edgy">Edgy</option>
            <option value="motivational">Motivational</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-zinc-400 mb-1">How many</label>
          <input
            type="number"
            min={3}
            max={20}
            value={count}
            onChange={(e)=>setCount(Number(e.target.value))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={generate}
            disabled={loading}
            className="w-full px-3 py-2 text-sm rounded-xl bg-white text-black disabled:opacity-40"
          >
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>
      </div>

      {err && <p className="text-xs text-amber-400 mt-3">{err}</p>}

      {captions.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Captions</h3>
            <button onClick={copyAll} className="text-xs underline">Copy all</button>
          </div>
          <ul className="space-y-2">
            {captions.map((c, i) => (
              <li key={i} className="flex items-start justify-between gap-3 rounded-xl border border-zinc-800 p-3">
                <span className="text-sm">{i+1}. {c}</span>
                <CopyBtn text={c} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-zinc-500 mt-6">
        Tip: Pair this with your image editor or a canvas overlay to turn great lines into memes fast.
      </p>
    </div>
  );
}
