import PluginsSidebar from "@/components/PluginsSidebar";
import { getPlugin } from "@/lib/plugins";

function HelloPlugin() {
  return (
    <div className="rounded-2xl border border-zinc-800 p-4">
      <p className="text-sm">This is a starter plugin. Duplicate me to build more.</p>
    </div>
  );
}

export default function PluginSlugPage({ params }: { params: { slug: string } }) {
  const meta = getPlugin(params.slug);
  let Body: JSX.Element = <div className="text-sm text-zinc-400">Plugin not found.</div>;

  if (meta?.slug === "hello") Body = <HelloPlugin />;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="md:flex md:gap-6">
        <PluginsSidebar />
        <section className="flex-1">
          {meta && (
            <>
              <h1 className="text-2xl font-semibold">{meta.icon} {meta.name}</h1>
              <p className="text-sm text-zinc-400 mt-1">{meta.description}</p>
            </>
          )}
          <div className="mt-6">{Body}</div>
        </section>
      </div>
    </main>
  );
}
