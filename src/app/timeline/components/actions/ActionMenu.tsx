'use client';

import { ArticlesData } from '@/types/events/articles';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ReportSheet } from './ReportSheet';
import { ReactionsPopover } from './ReactionsPopover';
import { ShareButton } from './ShareButton';

interface ActionMenu {
  entry: ArticlesData;
}

/**
 * Component for event interaction buttons
 */
export function EventActions({ entry }: ActionMenu) {
  return (
    <div className="flex items-center gap-2">
      <ReportSheet entry={entry} />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto">
            <MessageSquare className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Coming soon</TooltipContent>
      </Tooltip>

      <ShareButton entry={entry} />

      <ReactionsPopover entryId={entry._id} />
    </div>
  );
} 