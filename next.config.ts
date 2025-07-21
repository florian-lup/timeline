import type { NextConfig } from 'next';

/**
 * Next.js configuration with security-focused headers
 */
const nextConfig: NextConfig = {
  // Disable the X-Powered-By header for security
  poweredByHeader: false,

  async headers() {
    return Promise.resolve([
      {
        source: '/(.*)',
        headers: [
          {
            // Permissions policy: Restrict access to sensitive features
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ]);
  },
};

export default nextConfig;
