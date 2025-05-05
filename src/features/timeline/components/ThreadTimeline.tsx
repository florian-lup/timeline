'use client';

import { EventList } from './EventList';
import { Header } from '@/components/header';
import { useTimelineEntries } from '../hooks/useTimelineEntries';
import { MetricsPanel } from '@/features/timeline/components/metrics-panel';

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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-16">
      <Header />

      {/* Main content container with responsive padding and max width */}
      <main className="flex-1 w-full">
        <div className="max-w-3xl mx-auto pt-10 pb-8 px-4 sm:px-6">
          {/* Metrics Panel */}
          {!isLoading && (
            <div className="mb-6">
              <MetricsPanel 
                title="Global Timeline" 
                views={1243}
                entries={pagination?.total || 0}
              />
            </div>
          )}
          
          {isLoading ? (
            <div className="text-center py-10">Loading timeline data...</div>
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
            <div className="text-center py-10">No timeline entries found.</div>
          )}
        </div>
      </main>
    </div>
  );
}
