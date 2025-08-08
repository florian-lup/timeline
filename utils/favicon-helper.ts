/**
 * Utility functions for handling website favicons
 */

/**
 * Normalizes a URL to ensure it has a proper protocol and format
 * @param url The URL to normalize
 * @returns The normalized URL with HTTPS protocol
 */
function normalizeUrl(url: string): string {
  // If the URL doesn't have a protocol, add https://
  if (!url.match(/^https?:\/\//i)) {
    url = `https://${url}`;
  }

  // Replace http:// with https:// for better compatibility
  if (url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }

  return url;
}

/**
 * Extracts the domain from a URL for favicon retrieval
 * @param url The full URL
 * @returns The domain without protocol and www
 */
function extractDomainForFavicon(url: string): string {
  try {
    // Normalize the URL first
    const normalizedUrl = normalizeUrl(url);
    const urlObj = new URL(normalizedUrl);
    let hostname = urlObj.hostname;

    // Remove 'www.' prefix if present
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }

    return hostname;
  } catch (error) {
    console.warn('Failed to parse URL for favicon:', url, error);
    return '';
  }
}

/**
 * Google S2/gstatic only supports a handful of favicon sizes.
 * Map any requested size to the nearest supported size (ceil) to avoid 404s.
 */
function canonicalizeFaviconSize(requestedSize: number): number {
  const supported = [16, 32, 48, 64, 128, 256] as const;
  for (const s of supported) {
    if (requestedSize <= s) return s;
  }
  return supported[supported.length - 1] ?? 256;
}

/**
 * Gets the favicon URL for a given website URL
 * @param url The website URL
 * @param size The favicon size (default: 16)
 * @returns The favicon URL or empty string if domain extraction fails
 */
export function getFaviconUrl(url: string, size: number = 16): string {
  const domain = extractDomainForFavicon(url);
  if (!domain) return '';

  // Try different favicon service approaches
  // Option 1: Use just the domain (most compatible with Google's service)
  const googleSize = canonicalizeFaviconSize(size);
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${googleSize}`;

  // Alternative services (can be used as fallbacks):
  // Option 2: DuckDuckGo favicon service
  // return `https://icons.duckduckgo.com/ip3/${domain}.ico`;

  // Option 3: Favicon.ico directly from the domain
  // return `https://${domain}/favicon.ico`;
}

/**
 * Gets favicon data for display including URL and domain
 * @param url The website URL
 * @param size The favicon size (default: 16)
 * @returns Object with faviconUrl and domain
 */
export function getFaviconData(url: string, size: number = 16) {
  const domain = extractDomainForFavicon(url);

  return {
    faviconUrl: domain ? getFaviconUrl(url, size) : '',
    domain,
    hasValidDomain: !!domain,
  };
}

/**
 * Provides a prioritized list of possible favicon URLs for a given site.
 * Order:
 *  1) Google S2 (supports size via sz param)
 *  2) DuckDuckGo ip3 service (.ico)
 *  3) Direct /favicon.ico on the domain
 */
export function getFaviconCandidates(url: string, size: number = 16): string[] {
  const domain = extractDomainForFavicon(url);
  if (!domain) return [];

  const googleSize = canonicalizeFaviconSize(size);
  const duckDuckGo = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
  const google = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${googleSize}`;
  const direct = `https://${domain}/favicon.ico`;

  // Prefer DuckDuckGo first to avoid Google gstatic 404s for odd sizes/blocked sites
  return [duckDuckGo, google, direct];
}
