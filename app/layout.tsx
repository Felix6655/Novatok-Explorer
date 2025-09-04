import "./../styles/globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "NovaTok App Template",
  description: "Next.js + Tailwind + Plugins + Doctor",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <nav className="border-b border-zinc-800 px-6 py-3 flex items-center gap-4">
          <a href="/" className="font-semibold">NovaTok</a>
          <a href="/plugins" className="hover:opacity-80">Plugins</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
