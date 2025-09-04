import Link from "next/link";

async function getIdeas() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/plugin-ideas`, {
    // In dev, you can use relative fetch on the client, but for RSC we pass absolute if needed.
    // As a quick hack for dev: leave empty and Next will handle it.
    cache: "no-store",
  }).catch(() => null);
  if (!res || !res.ok) return { ideas: [] as any[] };
  return res.json();
}

export default async function IdeasAdminPage() {
  const { ideas } = await getIdeas();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Plugin Ideas</h1>
      <p className="text-sm text-zinc-400 mt-1">Lightweight review list.</p>

      <div className="mt-6 grid gap-3">
        {ideas.length === 0 && (
          <p className="text-sm text-zinc-400">No ideas yet.</p>
        )}
        {ideas.map((i: any) => (
          <div key={i.id} className="rounded-2xl border border-zinc-800 p-4">
            <div className="text-xs text-zinc-500">{new Date(i.createdAt).toLocaleString()}</div>
            <div className="font-medium mt-1">{i.title}</div>
            <div className="text-xs mt-1">
              <span className="inline-block rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 mr-1">{i.category}</span>
              <span className="inline-block rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5">{i.status}</span>
            </div>
            <p className="text-sm mt-2 whitespace-pre-wrap">{i.description}</p>
            {i.handle && <p className="text-xs text-zinc-400 mt-2">Contact: {i.handle}</p>}

            <div className="mt-3 flex gap-2">
              {["new", "reviewed", "accepted", "rejected"].map(s => (
                <form
                  key={s}
                  action={`/api/plugin-ideas/${i.id}`}
                  method="post"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await fetch(`/api/plugin-ideas/${i.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status: s }),
                    });
                    // naive refresh
                    window.location.reload();
                  }}
                >
                  <button className="text-xs px-2 py-1 rounded border border-zinc-800 hover:border-zinc-600">
                    {s}
                  </button>
                </form>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link href="/plugins" className="text-sm underline">← Back to plugins</Link>
      </div>
    </main>
  );
}
