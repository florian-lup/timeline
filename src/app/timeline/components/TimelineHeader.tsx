import React from 'react';
import { Share as ShareIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TimelineMetrics } from './TimelineMetrics';
import { shareContent } from '@/utils/shareHelper';

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
  const handleShare = () => {
    shareContent();
  };

  return (
    <div className="flex items-center justify-between px-4 py-1 rounded-full bg-card border">
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="xs" onClick={handleShare}>
                <ShareIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share Timeline</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

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
