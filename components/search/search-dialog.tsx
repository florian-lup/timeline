'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Search } from 'lucide-react';
import * as React from 'react';
import { memo } from 'react';

import { SearchResults } from '@/components/search/search-results';
import { SearchTextarea } from '@/components/search/search-textarea';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useSearchDialog } from '@/hooks/useSearchDialog';

interface SearchDialogProps {
  onSubmit?: (text: string, searchType: string) => void;
  onSearchTypeChange?: (type: string) => void;
  searchType?: string;
  disabled?: boolean;
}

export const SearchDialog = memo(function SearchDialog({
  onSubmit,
  onSearchTypeChange,
  searchType = 'web',
  disabled = false,
}: SearchDialogProps) {
  const {
    open,
    setOpen,
    query,
    hasSearched,
    loading,
    result,
    handleSubmit,
    reset,
  } = useSearchDialog({
    onSubmit,
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" aria-label="Search" disabled={disabled}>
          <Search />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border flex max-h-[70vh] flex-col overflow-hidden border-2 focus:outline-none focus-visible:ring-0">
        <DialogHeader>
          <VisuallyHidden.Root>
            <DialogTitle>Search news</DialogTitle>
            <DialogDescription>
              Search for stories by asking a question or searching for a topic.
            </DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>
        {hasSearched && (
          <div className="no-scrollbar mt-4 flex-1 overflow-auto">
            <SearchResults query={query} loading={loading} result={result} />
          </div>
        )}
        <div className={hasSearched ? 'mt-4' : 'mt-4 flex-1'}>
          <SearchTextarea
            onSubmit={(text: string, searchType: string) => {
              void handleSubmit(text, searchType);
            }}
            {...(onSearchTypeChange && { onSearchTypeChange })}
            searchType={searchType}
            disabled={disabled || loading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
});
