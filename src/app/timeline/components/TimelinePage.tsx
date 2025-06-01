'use client';

import { useState, memo, lazy, Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { EventList } from './TimelineList';
import { useArticles } from '@/hooks/events/useArticles';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { PageViewTracker } from '@/components/PageViewTracker';
import { SearchInput } from '@/app/timeline/components/search/SearchInput';

// Lazy load the search results dialog as it's only needed when search is triggered
const SearchResultsDialog = lazy(() => import('./search/SearchResults').then(module => ({ default: module.SearchResultsDialog })));

/**
 * Skeleton card for loading state
 */
const SkeletonCard = memo(function SkeletonCard() {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

/**
 * Multiple skeleton cards for timeline loading
 */
const SkeletonList = memo(function SkeletonList() {
  return (
    <div className="h-full w-full flex flex-col justify-center space-y-4 md:space-y-5 lg:space-y-7 py-8 md:py-12 lg:py-16">
      {[...Array(3)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
});

/**
 * Main timeline page with events feed and analytics
 */
export function Timeline() {
  const { entries, isLoading, isLoadingMore, error, loadMore, hasMore } = useArticles();

  // Search state management
  const [searchQuery, setSearchQuery] = useState('');
  const [isWeb, setIsWeb] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(true);
    }
  };

  // Handle search dialog close - clear the input
  const handleSearchDialogClose = (open: boolean) => {
    setIsSearchOpen(open);
    if (!open) {
      setSearchQuery(''); // Clear the search input when dialog closes
    }
  };

  /* PageViewTracker handles tracking */

  return (
    <div className="min-h-screen flex flex-col pb-8 md:pb-12 lg:pb-16">
      <Header />
      <PageViewTracker />

      {/* Main content container with responsive padding and max width */}
      <main className="flex-1 w-full">
        <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-3 md:px-4 lg:px-6">
          {/* Search Input Section */}
          <div className="mt-6 mb-8">
            <form onSubmit={handleSearchSubmit}>
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                isWeb={isWeb}
                onModeChange={setIsWeb}
              />
            </form>
          </div>

          {isLoading ? (
            <SkeletonList />
          ) : error ? (
            <Card className="p-4">
              <div className="text-amber-500">{error}</div>
            </Card>
          ) : null}

          {/* Render the event list with pagination support */}
          {!isLoading && entries.length > 0 && (
            <EventList
              events={entries}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
          )}

          {!isLoading && entries.length === 0 && (
            <Card className="p-6 mt-6">
              <div className="text-center">No timeline entries found.</div>
            </Card>
          )}
        </div>
      </main>

      {/* Search Results Dialog - Lazy loaded */}
      {isSearchOpen && (
        <Suspense fallback={<div />}>
          <SearchResultsDialog
            isOpen={isSearchOpen}
            onOpenChange={handleSearchDialogClose}
            searchQuery={searchQuery}
            isWeb={isWeb}
          />
        </Suspense>
      )}

      <Footer />
    </div>
  );
}
