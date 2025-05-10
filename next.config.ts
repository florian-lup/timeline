import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  optimizeFonts: true,
  reactStrictMode: true,
  
  // Optimize CSS loading
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components/ui']
  }
};

export default nextConfig;
