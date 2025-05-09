import { TimelineEntry } from '../types/TimelineEntry';
import { EventListItem } from './EventListItem';

interface EventListProps {
  events: TimelineEntry[];
  isLoadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

/**
 * EventList component displays a chronological feed of timeline events
 * Renders events in reverse chronological order (newest first)
 * Supports loading more events on demand
 */
export function EventList({ events, isLoadingMore, hasMore, onLoadMore }: EventListProps) {
  return (
    <div className="space-y-4 md:space-y-5 lg:space-y-7">
      {/* Display events in chronological order (already sorted from the API) */}
      {events.map((entry) => (
        <EventListItem key={entry._id} entry={entry} />
      ))}
      
      {/* Load more button */}
      {hasMore && (
        <div className="pt-2 md:pt-3 lg:pt-4 pb-4 md:pb-6 lg:pb-8 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-md cursor-pointer"
          >
            {isLoadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
