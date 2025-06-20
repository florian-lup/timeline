import { useState, useCallback } from 'react';

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

  // Handle search submission
  const handleSubmit = useCallback(
    (text: string, searchType: string) => {
      setQuery(text);
      setLoading(true);
      setHasSearched(true);

      // Simulate search delay
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, searchDelay);

      // Call external submit handler
      onSubmit?.(text, searchType);

      // Optionally close dialog after submission
      if (closeOnSubmit) {
        setOpen(false);
      }

      // Return cleanup function
      return () => clearTimeout(timeoutId);
    },
    [onSubmit, searchDelay, closeOnSubmit],
  );

  // Reset search state (useful for clearing results)
  const reset = useCallback(() => {
    setQuery('');
    setHasSearched(false);
    setLoading(false);
  }, []);

  // Open dialog with optional reset
  const openDialog = useCallback(
    (shouldReset = false) => {
      setOpen(true);
      if (shouldReset) {
        reset();
      }
    },
    [reset],
  );

  // Close dialog with optional reset
  const closeDialog = useCallback(
    (shouldReset = false) => {
      setOpen(false);
      if (shouldReset) {
        reset();
      }
    },
    [reset],
  );

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

    // Actions
    handleSubmit,
    reset,
  } as const;
}
