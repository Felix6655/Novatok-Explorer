"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/plugins", label: "All Plugins" },
  { href: "/plugins/qr", label: "Crypto QR" },
  { href: "/plugins/swap-fees", label: "Swap Fee Calc" },
  { href: "/plugins/meme-captions", label: "Meme Captions" },
  { href: "/plugins/meme-maker", label: "Meme Maker" },
];

export default function PluginsSidebar() {
  const path = usePathname();
  return (
    <aside className="w-full md:w-60 shrink-0">
      <nav className="rounded-2xl border border-zinc-800 p-3 sticky top-4">
        <div className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Plugins</div>
        <ul className="space-y-1">
          {links.map(l => {
            const active = path === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`block rounded-lg px-3 py-2 text-sm ${
                    active ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-900"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
