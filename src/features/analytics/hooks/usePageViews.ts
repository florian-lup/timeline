import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function usePageViews() {
  const [viewCount, setViewCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  
  // Check if current page is the timeline
  const isTimelinePage = pathname === '/timeline' || pathname === '/';

  // Function to get the current view count
  const getViewCount = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/views');
      
      if (!response.ok) {
        throw new Error(`Error fetching view count: ${response.statusText}`);
      }
      
      const data = await response.json();
      setViewCount(data.count);
      return data.count;
    } catch (err) {
      console.error('Failed to fetch view count:', err);
      setError(err instanceof Error ? err.message : 'Unknown error fetching view count');
      return 0;
    } finally {
      setLoading(false);
    }
  };

  // Function to increment the view count
  const incrementViewCount = async () => {
    // Only increment if we're on the timeline page
    if (!isTimelinePage) {
      await getViewCount(); // Just get the count without incrementing
      return viewCount;
    }
    
    // Check if we've already counted this session
    if (typeof window !== 'undefined') {
      const hasCountedKey = 'timeline_view_counted';
      const hasCounted = sessionStorage.getItem(hasCountedKey);
      
      if (hasCounted) {
        await getViewCount(); // Just get the current count
        return viewCount;
      }
      
      // Mark as counted for this session
      sessionStorage.setItem(hasCountedKey, 'true');
    }
    
    try {
      const response = await fetch('/api/analytics/views', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error incrementing view count: ${response.statusText}`);
      }
      
      const data = await response.json();
      setViewCount(data.count);
      return data.count;
    } catch (err) {
      console.error('Failed to increment view count:', err);
      setError(err instanceof Error ? err.message : 'Unknown error incrementing view count');
      return viewCount;
    }
  };

  // Load view count on initial mount
  useEffect(() => {
    // Increment view count when the component mounts
    incrementViewCount();
    
    // Optionally set up an interval to refresh the count periodically
    // const intervalId = setInterval(getViewCount, 60000); // Refresh every minute
    
    // return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    viewCount,
    loading,
    error,
    getViewCount,
    incrementViewCount
  };
} 