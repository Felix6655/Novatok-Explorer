import Link from "next/link";
import { plugins } from "@/lib/plugins";

export default function Nav() {
  return (
    <nav className="flex gap-6 items-center py-4 px-6 border-b border-zinc-800">
      <Link href="/" className="hover:opacity-80">Home</Link>
      <Link href="/plugins" className="relative inline-flex items-center gap-2 hover:opacity-90">
        <span>Plugins</span>
        <span className="text-[10px] rounded-full bg-zinc-800 border border-zinc-700 px-2 py-0.5">
          {plugins.length}
        </span>
      </Link>
      <a href="/plugins/submit" className="hover:opacity-80">Submit plugin idea</a>
      {/* Mobile menu icon button */}
      <Link
        href="/plugins"
        className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-xl border border-zinc-800"
        aria-label="Plugins"
        title="Plugins"
      >
        🧩
      </Link>
      {/* Dev-only link */}
      {process.env.NODE_ENV === "development" && (
        <a href="/admin/ideas" className="hover:opacity-80">Admin</a>
      )}
      {/* Add more links as needed */}
    </nav>
  );
}
