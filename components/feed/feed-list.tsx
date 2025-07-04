import { Virtuoso } from 'react-virtuoso';

import type { ArticleData } from '@/types/article-data';

import { ListItem } from './list-item';

interface FeedListProps {
  events: ArticleData[];
  isLoadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

/**
 * Virtualized list component using React Virtuoso
 * Efficiently renders large lists by only rendering visible items
 */
export function FeedList({
  events,
  isLoadingMore,
  hasMore,
  onLoadMore,
}: FeedListProps) {
  // Virtuoso item renderer
  const itemContent = (index: number) => {
    const entry = events[index];
    if (!entry) {
      return null;
    }
    return (
      <div className="py-4">
        <ListItem entry={entry} />
      </div>
    );
  };

  // Footer component for loading state
  const Footer = () => {
    if (isLoadingMore) {
      return (
        <div className="flex justify-center pt-2 pb-4 md:pt-3 md:pb-6 lg:pt-4 lg:pb-8">
          <div className="text-muted-foreground text-sm">Loading more...</div>
        </div>
      );
    }

    if (!hasMore && events.length > 0) {
      return (
        <div className="flex justify-center pt-2 pb-4 md:pt-3 md:pb-6 lg:pt-4 lg:pb-8">
          <div className="text-muted-foreground text-sm">
            You&apos;ve reached the end
          </div>
        </div>
      );
    }

    return null;
  };

  const virtuosoProps = {
    data: events,
    ...(hasMore && { endReached: onLoadMore }),
    itemContent,
    components: { Footer },
    className: 'h-full no-scrollbar',
    overscan: 10,
    increaseViewportBy: { top: 600, bottom: 600 },
  };

  return <Virtuoso {...virtuosoProps} />;
}
