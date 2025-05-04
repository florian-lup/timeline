'use client';

import { EventList } from './EventList';
import { TimelineHeader } from './TimelineHeader';
import { useTimelineEntries } from '../hooks/useTimelineEntries';

/**
 * ThreadTimeline component serves as the main layout for the timeline page
 * Provides the overall structure including header, navigation, and main content area
 * Renders the EventList component to display historical events in a feed-like format
 */
export function ThreadTimeline() {
  const { entries, isLoading, error } = useTimelineEntries();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-16">
      <TimelineHeader />

      {/* Main content container with responsive padding and max width */}
      <main className="flex-1 w-full">
        <div className="max-w-3xl mx-auto pt-10 pb-8 px-4 sm:px-6">
          {isLoading ? (
            <div className="text-center py-10">Loading timeline data...</div>
          ) : error ? (
            <div className="text-amber-500 mb-4">{error}</div>
          ) : null}
          
          {/* Render the event list with the timeline entries */}
          <EventList events={entries} />
        </div>
      </main>
    </div>
  );
}
