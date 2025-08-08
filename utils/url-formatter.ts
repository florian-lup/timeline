/**
 * Extracts the main domain from a URL for cleaner display
 * @param url The full URL to extract domain from
 * @returns The domain without protocol, www, or path
 * @example
 * extractDomain('https://www.example.com/path/to/article') => 'example.com'
 * extractDomain('http://subdomain.site.org/news/story') => 'subdomain.site.org'
 * extractDomain('https://example.com') => 'example.com'
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname;

    // Remove 'www.' prefix if present
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }

    return hostname;
  } catch (error) {
    // If URL parsing fails, return the original string
    console.warn('Failed to parse URL:', url, error);
    return url;
  }
}

/**
 * Formats a URL for display by showing only the domain
 * while preserving the full URL for linking
 * @param url The full URL
 * @returns Object with displayText and fullUrl
 */
export function formatUrlForDisplay(url: string) {
  return {
    displayText: extractDomain(url),
    fullUrl: url,
  };
}
