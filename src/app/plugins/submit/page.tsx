"use client";

import { useState } from "react";

const CATEGORIES = ["tools", "wallet", "dev", "social"] as const;

export default function SubmitPluginIdeaPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("tools");
  const [desc, setDesc] = useState("");
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  async function submit() {
    setLoading(true);
    setOk(false);
    setErr("");
    try {
      const r = await fetch("/api/plugin-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          description: desc.trim(),
          handle: handle.trim(),
        }),
      });
      const data = await r.json();
      if (!r.ok || data.error) throw new Error(data.error || "Failed to submit");
      setOk(true);
      setTitle(""); setDesc(""); setHandle("");
    } catch (e: any) {
      setErr(e?.message ?? "Failed to submit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Submit a plugin idea</h1>
      <p className="text-sm text-zinc-400 mt-1">
        Got a tool we should build into NovaTok Explorer? Send it here.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Title</label>
          <input
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm"
            placeholder="e.g. Raydium LP Tracker"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1">Category</label>
          <select
            value={category}
            onChange={(e)=>setCategory(e.target.value as any)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1">Short description</label>
          <textarea
            value={desc}
            onChange={(e)=>setDesc(e.target.value)}
            rows={6}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm"
            placeholder="What does it do? Why is it useful?"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1">Your handle (optional)</label>
          <input
            value={handle}
            onChange={(e)=>setHandle(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm"
            placeholder="@you on X / Discord#0000 / email"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={submit}
            disabled={loading || !title.trim() || !desc.trim()}
            className="px-3 py-2 text-sm rounded-xl bg-white text-black disabled:opacity-40"
          >
            {loading ? "Sending…" : "Send idea"}
          </button>
          <a href="/plugins" className="px-3 py-2 text-sm rounded-xl border border-zinc-800">
            Back to plugins
          </a>
        </div>

        {ok && <p className="text-xs text-green-400">Thanks! Your idea was saved.</p>}
        {err && <p className="text-xs text-amber-400">{err}</p>}
      </div>
    </main>
  );
}
