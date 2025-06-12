import type { MetadataRoute } from 'next';

/**
 * Base URL for the sitemap - uses env var or defaults to localhost
 * Set NEXT_PUBLIC_SITE_URL in production environment
 */
const baseUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://localhost:3000';

/**
 * Generates XML sitemap for search engine indexing
 * Defines page importance (priority) and update frequency
 * Add new routes here as your site grows
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];
}
