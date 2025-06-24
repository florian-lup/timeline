'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Search } from 'lucide-react';
import * as React from 'react';
import { memo } from 'react';

import { SearchResults } from '@/components/search/search-results';
import { SearchTextarea } from '@/components/search/search-textarea';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useSearchWidget } from '@/hooks/useSearchWidget';

interface SearchWidgetProps {
  onSubmit?: (text: string, searchType: string) => void;
  onSearchTypeChange?: (type: string) => void;
  searchType?: string;
  disabled?: boolean;
}

export const SearchWidget = memo(function SearchWidget({
  onSubmit,
  onSearchTypeChange,
  searchType = 'web',
  disabled = false,
}: SearchWidgetProps) {
  const {
    open,
    setOpen,
    query,
    hasSearched,
    loading,
    result,
    handleSubmit,
    reset,
  } = useSearchWidget({
    onSubmit,
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" aria-label="Search" disabled={disabled}>
          <Search />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:max-w-md lg:max-w-lg"
        onOpenAutoFocus={e => {
          e.preventDefault();
        }}
      >
        <SheetHeader>
          <VisuallyHidden.Root>
            <SheetTitle>Search news</SheetTitle>
            <SheetDescription>
              Search for stories by asking a question or searching for a topic.
            </SheetDescription>
          </VisuallyHidden.Root>
        </SheetHeader>

        <div className="flex-1 overflow-auto">
          {hasSearched && (
            <SearchResults query={query} loading={loading} result={result} />
          )}
          {!hasSearched && (
            <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
              Enter a search query to get started
            </div>
          )}
        </div>

        <SheetFooter>
          <SearchTextarea
            onSubmit={(text: string, searchType: string) => {
              void handleSubmit(text, searchType);
            }}
            {...(onSearchTypeChange && { onSearchTypeChange })}
            searchType={searchType}
            disabled={disabled || loading}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
});
