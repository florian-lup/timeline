import { useState, useEffect, useCallback } from 'react';
import { ArticlesData } from '@/types/events/articles';
import { fetchEvents, PaginationMetadata } from '@/services/events/api';

/**
 * Hook for managing paginated timeline entries
 */
export function useArticles() {
  const [entries, setEntries] = useState<ArticlesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadTimelineEntries = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const data = await fetchEvents(pageNum);

      if (append) {
        setEntries((prev) => [...prev, ...data.entries]);
      } else {
        setEntries(data.entries);
      }

      setPagination(data.pagination);
      setHasMore(pageNum < data.pagination.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error loading timeline entries:', err);
      setError('Failed to load timeline entries. Please try again.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadTimelineEntries(1, false);
  }, [loadTimelineEntries]);

  // Function to load more entries
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadTimelineEntries(nextPage, true);
    }
  }, [isLoadingMore, hasMore, page, loadTimelineEntries]);

  return {
    entries,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    hasMore,
    pagination,
  };
}
