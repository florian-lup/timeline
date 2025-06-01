import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // Optimize CSS loading
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components/ui', 'lucide-react', '@radix-ui/react-*'],
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Add your external image domains here
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Compression
  compress: true,

  // Powered by header
  poweredByHeader: false,

  // Trailing slash
  trailingSlash: false,
};

export default nextConfig;
