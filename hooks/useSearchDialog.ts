import { useState } from 'react';
import { performSearch } from '@/lib/api/search-api';
import type { SearchResponse } from '@/lib/services/search-service';

interface UseSearchDialogProps {
  onSubmit?: ((text: string, searchType: string) => void) | undefined;
  searchDelay?: number;
  closeOnSubmit?: boolean;
}

/**
 * Hook for managing search dialog state and interactions
 * Handles dialog visibility, search state, loading, and submission logic
 */
export function useSearchDialog({
  onSubmit,
  searchDelay = 1500,
  closeOnSubmit = false,
}: UseSearchDialogProps = {}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResponse | null>(null);

  // Handle search submission
  const handleSubmit = async (text: string, searchType: string) => {
    setQuery(text);
    setLoading(true);
    setHasSearched(true);

    try {
      // Call the search API using the helper
      const data = await performSearch({
        query: text,
        searchType: searchType as 'web' | 'history',
      });
      setResult(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }

    // Call external submit handler
    onSubmit?.(text, searchType);

    // Optionally close dialog after submission
    if (closeOnSubmit) {
      setOpen(false);
    }
  };

  // Reset search state (useful for clearing results)
  const reset = () => {
    setQuery('');
    setHasSearched(false);
    setLoading(false);
    setResult(null);
  };

  // Open dialog with optional reset
  const openDialog = (shouldReset = false) => {
    setOpen(true);
    if (shouldReset) {
      reset();
    }
  };

  // Close dialog with optional reset
  const closeDialog = (shouldReset = false) => {
    setOpen(false);
    if (shouldReset) {
      reset();
    }
  };

  return {
    // Dialog state
    open,
    setOpen,
    openDialog,
    closeDialog,

    // Search state
    query,
    hasSearched,
    loading,
    result,

    // Actions
    handleSubmit,
    reset,
  } as const;
}
