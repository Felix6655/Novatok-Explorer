export type PluginMeta = {
  slug: string;
  name: string;
  description: string;
  category: "tools" | "social" | "wallet" | "dev";
  icon?: string; // emoji or icon name
  featured?: boolean; // NEW
  comingSoon?: boolean; // NEW
};
