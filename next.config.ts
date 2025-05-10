import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Optimize CSS loading
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components/ui']
  }
};

export default nextConfig;
