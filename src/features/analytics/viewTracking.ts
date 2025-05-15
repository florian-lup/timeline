/**
 * Tracks a page view in the analytics database
 * Includes session storage check to prevent duplicate counts
 * Returns a Promise that resolves after the database update
 */
export const trackPageView = async (): Promise<boolean> => {
  // Check if we're on the client side
  if (typeof window === 'undefined') {
    return false;
  }

  // Check if current page is the timeline
  const pathname = window.location.pathname;
  const isTimelinePage = pathname === '/timeline' || pathname === '/';

  // Only track views for the timeline page
  if (!isTimelinePage) {
    return false;
  }

  // Check if already counted this session
  const hasCountedKey = 'timeline_view_counted';
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
 * Gets current view count from the API
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