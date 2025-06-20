import { useState, useEffect } from 'react';
import type { StoryData } from '@/types/story';
import { fetchStories } from '@/lib/api/story-feed';

/**
 * Hook for managing cursor-based infinite scroll
 * Optimized for React Virtuoso integration
 */
export function usePagination(limit: number = 20) {
  const [entries, setEntries] = useState<StoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPage, setnextPage] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  // Load initial data

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchStories(undefined, limit);

      setEntries(data.entries);
      setnextPage(data.nextPage);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error('Error loading initial stories:', err);
      setError('Failed to load stories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load more data (called by React Virtuoso when reaching end)

  const loadMoreData = async () => {
    if (!nextPage || isLoadingMore || !hasMore) {
      return;
    }

    try {
      setIsLoadingMore(true);
      setError(null);

      const data = await fetchStories(nextPage, limit);

      setEntries(prev => [...prev, ...data.entries]);
      setnextPage(data.nextPage);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error('Error loading more stories:', err);
      setError('Failed to load more entries. Please try again.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, [limit]); // Only depend on limit, React 19 handles function stability

  // Function to refresh data (reset to beginning)

  const refresh = () => {
    setEntries([]);
    setnextPage(undefined);
    setHasMore(true);
    loadInitialData();
  };

  return {
    entries,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore: loadMoreData,
    refresh,
  };
}
