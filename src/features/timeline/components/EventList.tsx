import { TimelineEntry } from '../types/TimelineEntry';
import { EventListItem } from './EventListItem';

/**
 * EventList component displays a chronological feed of timeline events
 * Renders events in reverse chronological order (newest first)
 * Each event includes date, time, location, title, content and action buttons
 */
export function EventList({ events }: { events: TimelineEntry[] }) {
  return (
    <div className="space-y-7">
      {/* Display events in reverse chronological order (newest first) */}
      {events
        .slice()
        .reverse()
        .map((entry) => (
          <EventListItem key={entry._id} entry={entry} />
        ))}
    </div>
  );
}
