/**
 * Utilities to validate and normalize external URLs for safe usage
 */

/**
 * Returns a normalized http(s) URL string if safe, otherwise null.
 * - Adds https:// when the scheme is missing
 * - Only allows http and https protocols
 */
export function toSafeHttpUrl(input: string): string | null {
  try {
    let value = String(input).trim();

    // If there is no explicit scheme, default to https://
    if (!/^([a-zA-Z][a-zA-Z0-9+.-]*):/.test(value)) {
      value = `https://${value}`;
    }

    const url = new URL(value);
    const protocol = url.protocol.toLowerCase();

    if (protocol === 'http:' || protocol === 'https:') {
      return url.href;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Quick predicate to check if a URL is safe http(s)
 */
export function isSafeHttpUrl(input: string): boolean {
  return toSafeHttpUrl(input) !== null;
}
