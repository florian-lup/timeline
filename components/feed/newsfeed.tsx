'use client';

import { Header } from '@/components/feed/header';
import { SkeletonList } from '@/components/feed/loading-skeleton';
import { StoryList } from '@/components/feed/story-list';
import { Card } from '@/components/ui/card';
import { usePagination } from '@/hooks/usePagination';

/**
 * Main Newsfeed page with virtualized infinite scroll
 */
export function NewsfeedPage() {
  const { entries, isLoading, isLoadingMore, error, hasMore, loadMore } =
    usePagination();

  // React 19 will automatically memoize this function
  const renderMainContent = () => {
    if (isLoading) {
      return <SkeletonList />;
    }

    if (entries.length > 0) {
      return (
        <StoryList
          events={entries}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          onLoadMore={() => {
            void loadMore();
          }}
        />
      );
    }

    return (
      <Card className="mt-6 p-6">
        <div className="text-center">No stories found.</div>
      </Card>
    );
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      {/* Sticky Header */}
      <Header />

      {/* Error display */}
      {error !== null && error !== '' && (
        <div className="mx-auto w-full max-w-xl px-3 md:max-w-2xl md:px-4 lg:max-w-3xl lg:px-6 xl:max-w-4xl">
          <Card className="my-4 p-4">
            <div className="text-amber-500">{error}</div>
          </Card>
        </div>
      )}

      {/* Main virtualized content container */}
      <main className="mx-auto w-full max-w-xl flex-1 px-3 pt-14 md:max-w-2xl md:px-4 lg:max-w-3xl lg:px-6 xl:max-w-4xl">
        {renderMainContent()}
      </main>
    </div>
  );
}
