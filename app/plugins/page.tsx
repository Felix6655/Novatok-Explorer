import Link from "next/link";
import { plugins } from "@/lib/plugins";

function Card(p: any) {
  return (
    <Link href={`/plugins/${p.slug}`} className="rounded-2xl border border-zinc-800 hover:border-zinc-600 transition p-4 flex flex-col">
      <div className="text-3xl">{p.icon ?? "🧩"}</div>
      <div className="mt-2 font-medium">{p.name}</div>
      <div className="text-sm text-zinc-400">{p.description}</div>
      <div className="mt-3 inline-block text-xs bg-zinc-900 px-2 py-1 rounded">/plugins/{p.slug}</div>
    </Link>
  );
}
export default function PluginsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-3xl border border-zinc-800 p-8">
        <h1 className="text-3xl font-semibold">Plugins</h1>
        <p className="text-zinc-400 mt-1">Small tools inside your app.</p>
      </div>
      <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plugins.map(p => <Card key={p.slug} {...p} />)}
      </section>
    </main>
  );
}
