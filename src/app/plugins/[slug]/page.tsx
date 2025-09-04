import PluginsSidebar from "@/components/PluginsSidebar";
import { getPlugin } from "@/lib/plugins";
import QRPlugin from "@/plugins/qr/QRPlugin";
import SwapFeePlugin from "@/plugins/swap-fees/SwapFeePlugin";
import MemeCaptions from "@/plugins/meme-captions/MemeCaptions";
import MemeMaker from "@/plugins/meme-maker/MemeMaker";
import PriceWidget from "@/plugins/price-widget/PriceWidget";
import AirdropGuard from "@/plugins/airdrop-guard/AirdropGuard";
import VanityWallet from "@/plugins/vanity-wallet/VanityWallet";
import EmbedBuilder from "@/plugins/embed-builder/EmbedBuilder";

export default function PluginSlugPage({ params }: { params: { slug: string } }) {
  const meta = getPlugin(params.slug);

  let Body: JSX.Element = (
    <div className="text-sm text-zinc-400">Plugin not found. Go back to /plugins.</div>
  );
  if (meta) {
    switch (meta.slug) {
      case "qr": Body = <QRPlugin />; break;
      case "swap-fees": Body = <SwapFeePlugin />; break;
  case "meme-captions": Body = <MemeCaptions />; break;
  case "meme-maker": Body = <MemeMaker />; break;
  case "price-widget": Body = <PriceWidget />; break;
  case "airdrop-guard": Body = <AirdropGuard />; break;
  case "vanity-wallet": Body = <VanityWallet />; break;
  case "embed-builder": Body = <EmbedBuilder />; break;
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="md:flex md:gap-6">
        <PluginsSidebar />
        <section className="flex-1">
          {meta && (
            <>
              <h1 className="text-2xl font-semibold">{meta.icon} {meta.name}</h1>
              <p className="text-sm text-zinc-400 mt-1">{meta.description}</p>
              <div className="mt-6">{Body}</div>
            </>
          )}
          {!meta && <div>{Body}</div>}
        </section>
      </div>
    </main>
  );
}
