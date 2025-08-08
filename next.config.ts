import type { NextConfig } from 'next';

/**
 * Next.js configuration with security-focused headers
 */
const nextConfig: NextConfig = {
  // Disable the X-Powered-By header for security
  poweredByHeader: false,
  images: {
    // Allow favicons served via Google S2 service
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';
    // Allow inline/eval and websockets in development for Next.js dev server
    const csp = isDev
      ? "default-src 'self'; img-src 'self' https: data:; media-src https:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; connect-src 'self' ws: wss: http://localhost:*; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "default-src 'self'; img-src 'self' https: data:; media-src https:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; connect-src 'self' https://vitals.vercel-analytics.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'";

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
          {
            key: 'Referrer-Policy',
            value: 'no-referrer',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
        ],
      },
    ]);
  },
};

export default nextConfig;
