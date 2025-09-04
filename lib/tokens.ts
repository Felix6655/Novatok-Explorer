export type Token = { symbol: string; mint: string; decimals: number };

export const TOKENS: Token[] = [
  // Common Solana mains
  { symbol: "SOL",  mint: "So11111111111111111111111111111111111111112", decimals: 9 },
  { symbol: "USDC", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6 },
  { symbol: "USDT", mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", decimals: 6 },
];

export const bySymbol = (sym: string) => TOKENS.find(t => t.symbol === sym);
