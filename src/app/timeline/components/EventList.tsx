import { TimelineEntry } from '@/types/timeline/TimelineEntry';
import { EventListItem } from './EventListItem';
import { Button } from '@/components/ui/button';

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
    <ol className="relative list-none ml-4 md:ml-6 ">
      {/* Display events in chronological order (already sorted from the API) */}
      {events.map((entry) => (
        <EventListItem key={entry._id} entry={entry} />
      ))}

      {/* Load more button */}
      {hasMore && (
        <li className="pt-2 md:pt-3 lg:pt-4 pb-4 md:pb-6 lg:pb-8 flex justify-center">
          <Button onClick={onLoadMore} disabled={isLoadingMore} variant="outline">
            {isLoadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </li>
      )}
    </ol>
  );
}
