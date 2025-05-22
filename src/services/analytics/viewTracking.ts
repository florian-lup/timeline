/**
 * Tracks timeline page view with session storage check
 */
export const trackPageView = async (): Promise<boolean> => {
  // Check if we're on the client side
  if (typeof window === 'undefined') {
    return false;
  }

  const pathname = window.location.pathname;

  // Only track views for timeline and article pages (e.g., /article/[id])
  const isTrackablePage = pathname === '/timeline' || pathname === '/' || pathname.startsWith('/article/');

  if (!isTrackablePage) {
    return false;
  }

  // Create unique key per page type to avoid multiple counts per session
  const hasCountedKey = `view_counted_${pathname}`;
  const hasCounted = sessionStorage.getItem(hasCountedKey);

  if (hasCounted) {
    return false;
  }

  // Mark as counted for this session
  sessionStorage.setItem(hasCountedKey, 'true');

  // Track the view
  try {
    const response = await fetch('/api/analytics/views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Wait for the response before returning
    if (response.ok) {
      await response.json(); // Ensure the response is fully processed
    }

    return response.ok;
  } catch (error) {
    console.error('Error tracking view:', error);
    return false;
  }
};

/**
 * Retrieves current view count
 */
export const getViewCount = async (): Promise<number> => {
  try {
    const response = await fetch('/api/analytics/views');

    if (!response.ok) {
      throw new Error(`Error fetching view count: ${response.statusText}`);
    }

    const data = await response.json();
    return data.count || 0;
  } catch (err) {
    console.error('Failed to fetch view count:', err);
    return 0;
  }
};
