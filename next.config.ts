import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Do NOT set: output: 'export'
  reactStrictMode: true,
  // optional and fine on Vercel:
  // output: 'standalone',
};

export default nextConfig;
