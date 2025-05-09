'use client';

import { EventList } from './EventList';
import { Header } from '@/components/header';
import { useTimelineEntries } from '../hooks/useTimelineEntries';
import { TimelineHeader } from './TimelineHeader';
import { usePageViews } from '@/features/analytics/hooks/usePageViews';
import { Skeleton } from "@/components/ui/skeleton";

/**
 * ThreadTimeline component serves as the main layout for the timeline page
 * Provides the overall structure including header, navigation, and main content area
 * Renders the EventList component to display historical events in a feed-like format
 */
export function ThreadTimeline() {
  const { 
    entries, 
    isLoading, 
    isLoadingMore,
    error, 
    loadMore,
    hasMore,
    pagination
  } = useTimelineEntries();

  const {
    viewCount,
  } = usePageViews();

  // Skeleton loading component for timeline entries
  function SkeletonCard() {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    )
  }

  // Skeleton list to mimic loading timeline entries
  function SkeletonList() {
    return (
      <div className="space-y-4 md:space-y-5 lg:space-y-7">
        {[...Array(3)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col pb-8 md:pb-12 lg:pb-16">
      <Header />

      {/* Main content container with responsive padding and max width */}
      <main className="flex-1 w-full">
        <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto pt-4 md:pt-6 lg:pt-10 pb-4 md:pb-6 lg:pb-8 px-3 md:px-4 lg:px-6">
          {/* Metrics Panel */}
          {!isLoading && (
            <div className="mb-4 md:mb-5 lg:mb-6">
              <TimelineHeader 
                views={viewCount}
                entries={pagination?.total || 0}
              />
            </div>
          )}
          
          {isLoading ? (
            <SkeletonList />
          ) : error ? (
            <div className="text-amber-500 mb-4">{error}</div>
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
            <div className="text-center py-6 md:py-8 lg:py-10">No timeline entries found.</div>
          )}
        </div>
      </main>
    </div>
  );
}
