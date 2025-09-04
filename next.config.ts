import type { NextConfig } from 'next';
const nextConfig: NextConfig = { reactStrictMode: true };
import withPWA from 'next-pwa';

const nextConfig: NextConfig = { reactStrictMode: true };
export default withPWA({
	dest: 'public',
	register: true,
	skipWaiting: true,
})(nextConfig);
