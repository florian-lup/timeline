import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
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
    <div className="flex items-center justify-between px-4 py-1 rounded-full bg-card border">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto">
            <Search className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Search</TooltipContent>
      </Tooltip>

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
