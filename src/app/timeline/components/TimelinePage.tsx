'use client';

import { EventList } from './TimelineList';
import { Header } from '@/components/layout/header';
import { useArticles } from '@/hooks/events/useArticles';
import { TimelineHeader } from './TimelineHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { PageViewTracker } from '@/components/PageViewTracker';

/**
 * Main timeline page with events feed and analytics
 */
export function Timeline() {
  const { entries, isLoading, isLoadingMore, error, loadMore, hasMore } = useArticles();

  /* PageViewTracker handles tracking */

  /**
   * Skeleton card for loading state
   */
  function SkeletonCard() {
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
  }

  /**
   * Multiple skeleton cards for timeline loading
   */
  function SkeletonList() {
    return (
      <div className="h-full w-full flex flex-col justify-center space-y-4 md:space-y-5 lg:space-y-7 py-8 md:py-12 lg:py-16">
        {[...Array(3)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-8 md:pb-12 lg:pb-16">
      <Header />
      <PageViewTracker />

      {/* Main content container with responsive padding and max width */}
      <main className="flex-1 w-full">
        <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto pt-4 md:pt-6 lg:pt-10 pb-4 md:pb-6 lg:pb-8 px-3 md:px-4 lg:px-6">
          {/* Search Header */}
          <div className="mb-4 md:mb-5 lg:mb-6">
            <TimelineHeader />
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
            <Card className="p-6">
              <div className="text-center">No timeline entries found.</div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
