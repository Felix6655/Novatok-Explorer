import Link from "next/link";
import { plugins } from "@/lib/plugins";
import { use } from "react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
    </section>
  );
}

function Card({ slug, icon, name, description, comingSoon }: any) {
  const base = (
    <div
      className={`rounded-2xl border p-4 flex flex-col ${
        comingSoon
          ? "border-zinc-800 opacity-60 cursor-not-allowed"
          : "border-zinc-800 hover:border-zinc-600 transition"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="text-3xl">{icon ?? "🧩"}</div>
        {comingSoon && (
          <span className="text-[10px] rounded-full bg-zinc-900 border border-zinc-800 px-2 py-0.5">
            Coming soon
          </span>
        )}
      </div>
      <div className="mt-2 font-medium">{name}</div>
      <div className="text-sm text-zinc-400">{description}</div>
      <div className="mt-3 inline-block text-xs bg-zinc-900 px-2 py-1 rounded">
        /plugins/{slug}
      </div>
    </div>
  );

  return comingSoon ? <div aria-disabled>{base}</div> : <Link href={`/plugins/${slug}`}>{base}</Link>;
}

export default function PluginsPage() {
  // simple search via URL (?q=)
  const searchParams = use((async () => new URLSearchParams())()); // no-op on server; keeps TS happy
  const q = (typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("q") || "").toLowerCase();

  const featured = plugins.filter(p => p.featured);
  const filtered = q
    ? plugins.filter(p =>
        (p.name + " " + p.description + " " + p.slug + " " + p.category).toLowerCase().includes(q)
      )
    : plugins;

  const byCat = (cat: (typeof plugins)[number]["category"]) =>
    filtered.filter(p => p.category === cat);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Hero */}
      <div className="rounded-3xl border border-zinc-800 bg-[radial-gradient(80%_120%_at_10%_10%,rgba(79,111,255,.15),transparent)] p-8">
        <h1 className="text-3xl font-semibold">Plugins</h1>
        <p className="text-zinc-400 mt-1">
          A growing suite of small, useful tools inside NovaTok Explorer.
        </p>
        <form action="/plugins" className="mt-6 flex gap-2">
          <input
            name="q"
            defaultValue={typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("q") || ""}
            placeholder="Search plugins…"
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-zinc-600"
          />
          <button className="px-3 py-2 text-sm rounded-xl border border-zinc-700 hover:border-zinc-500">
            Search
          </button>
        </form>
        <div className="mt-4 flex gap-2">
          <a
            href="/plugins/submit"
            className="px-3 py-2 text-sm rounded-xl border border-zinc-700 hover:border-zinc-500"
          >
            Submit a plugin idea
          </a>
          <a
            href="/plugins?q="
            className="px-3 py-2 text-sm rounded-xl border border-zinc-700 hover:border-zinc-500"
          >
            Browse all
          </a>
        </div>
      </div>

      {/* Featured */}
      {featured.length > 0 && !q && (
        <Section title="Featured">
          {featured.map(p => <Card key={p.slug} {...p} />)}
        </Section>
      )}

      {/* All by category */}
      <Section title={q ? `Results for “${q}”` : "Tools"}>
        {byCat("tools").map(p => <Card key={p.slug} {...p} />)}
      </Section>

      <Section title="Wallet">
        {byCat("wallet").map(p => <Card key={p.slug} {...p} />)}
      </Section>

      <Section title="Dev">
        {byCat("dev").map(p => <Card key={p.slug} {...p} />)}
      </Section>
    </main>
  );
}
