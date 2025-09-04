"use client"
import { DefaultSeo } from "next-seo"
import SEO from "@/next-seo.config"
import Providers from "@/app/providers"
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DefaultSeo {...SEO} />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
