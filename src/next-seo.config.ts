import { NextSeoProps } from "next-seo"

const config: NextSeoProps = {
  title: "NovaTok Explorer",
  description: "Wallet, swaps, and tools for NOVA.",
  openGraph: {
    type: "website",
    site_name: "NovaTok",
  },
  twitter: { cardType: "summary_large_image" },
}

export default config
