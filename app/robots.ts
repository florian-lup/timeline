import type { MetadataRoute } from 'next';

/**
 * Base URL for linking to sitemap - uses env var or defaults to localhost
 * Set NEXT_PUBLIC_SITE_URL in production environment
 */
const baseUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://localhost:3000';

/**
 * Generates robots.txt with crawler instructions
 * Blocks crawlers from private/sensitive areas
 * Links to sitemap for better indexing
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/private/', // Private content
        '/api/', // API endpoints
        '/_next/', // Next.js internal paths
        '/admin/', // Admin areas
        '/login', // Authentication
        '/auth/', // Authentication paths
        '/*.json', // JSON data files
        '/*?*', // URL parameters
        '/tests/', // Test directories
        '/scripts/', // Script directories
        '/documents/', // Document directories
        '/*.log', // Log files
        '/*.bak', // Backup files
        '/*.tmp', // Temporary files
        '/*.env', // Environment files
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
