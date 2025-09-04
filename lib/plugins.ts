export type PluginMeta = {
  slug: string;
  name: string;
  description: string;
  category: "tools" | "wallet" | "dev" | "social";
  icon?: string;
  featured?: boolean;
  comingSoon?: boolean;
};

export const plugins: PluginMeta[] = [
  {
    slug: "qr",
    name: "Crypto QR Code Generator",
    description: "Paste any wallet address and get a downloadable QR code.",
    category: "tools",
    icon: "🧩",
    featured: true,
  },
  {
    slug: "swap-fees",
    name: "Token Swap Fee Calculator",
    description: "Estimate Solana network + DEX fees for a swap using live Jupiter quotes.",
    category: "tools",
    icon: "💱",
    featured: true,
  },
  {
    slug: "meme-maker",
    name: "Meme Maker",
    description: "Upload an image, add top/bottom text, and download your meme.",
    category: "tools",
    icon: "🖼️",
    featured: true,
  },
  {
    slug: "meme-captions",
    name: "Meme Caption Generator",
    description: "Type a topic or describe an image and get 10 caption ideas.",
    category: "tools",
    icon: "🎭",
  },
  {
    slug: "price-widget",
    name: "Price Widget Embed",
    description: "Generate a copy-paste iframe for DexScreener price charts.",
    category: "tools",
    icon: "📈",
  },
  {
    slug: "airdrop-guard",
    name: "Airdrop Guard Lite",
    description: "Pre-check: simple bot score before airdrop claim.",
    category: "wallet",
    icon: "🛡️",
  },
  {
    slug: "vanity-wallet",
    name: "Vanity Address (Demo)",
    description: "Generate random Solana addresses and look for a prefix (demo only).",
    category: "dev",
    icon: "🎯",
  },
  {
    slug: "embed-builder",
    name: "Embed Builder Pro",
    description: "Build embeds for DexScreener, TradingView, and Jupiter swap.",
    category: "tools",
    icon: "🧩",
  },
  // Add more here as you build them…

  {
    slug: "analytics-dashboard",
    name: "Explorer Analytics Dashboard",
    description: "Track holders, volume, and site clicks in one view.",
    category: "tools",
    icon: "📊",
    comingSoon: true,
  },
  {
    slug: "wallet-verify",
    name: "Wallet Verify (Phantom + QS)",
    description: "Simple signature challenge to verify wallet ownership.",
    category: "wallet",
    icon: "✅",
    comingSoon: true,
  },
];

export function getPlugin(slug: string) {
  return plugins.find(p => p.slug === slug) || null;
}
