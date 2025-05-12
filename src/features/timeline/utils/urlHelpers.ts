/**
 * URL utility functions for timeline features
 */

/**
 * Extracts domain from URL string
 */
export function extractDomain(url: string): string {
  try {
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Extract the domain using URL constructor
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    // Return original URL if parsing fails
    return url;
  }
}

/**
 * Formats a URL string to ensure it has a protocol
 */
export function formatUrl(url: string): string {
  return url.startsWith('http') ? url : `https://${url}`;
} 