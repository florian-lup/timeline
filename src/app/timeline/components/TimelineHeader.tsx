import React from 'react';
import { TimelineMetrics } from './internals/EventMetrics';

interface TimelineHeaderProps {
  views: number;
  shares: number;
  reactions: number;
  entries: number;
}

/**
 * Header with analytics metrics and action buttons
 */
export function TimelineHeader({ views, shares, reactions, entries }: TimelineHeaderProps) {
  return (
    <div className="flex items-center justify-end px-4 py-1 rounded-full bg-card border">
      <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
        <TimelineMetrics
          views={views}
          shares={shares}
          entries={entries}
          reactions={reactions}
          compact={true}
        />
      </div>
    </div>
  );
}
