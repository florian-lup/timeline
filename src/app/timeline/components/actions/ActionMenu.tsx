'use client';

import { ArticlesData } from '@/types/events/articles';
import { Languages, Search, MessageSquare, Share as ShareIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ReportDialog } from './ReportDialog';
import { ReactionsPopover } from './ReactionsPopover';
import { shareContent } from '@/utils/shareHelper';

interface ActionMenu {
  entry: ArticlesData;
}

/**
 * Component for event interaction buttons
 */
export function EventActions({ entry }: ActionMenu) {
  return (
    <div className="flex items-center gap-1 md:gap-2">
      <ReportDialog entry={entry} />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto">
            <Search className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Search</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto">
            <Languages className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Translate</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto">
            <MessageSquare className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Coming soon</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="p-1.5 md:p-2 h-auto w-auto"
            onClick={() =>
              shareContent({
                title: entry.title,
                text: entry.summary,
                url: `${window.location.origin}/article/${entry._id}`,
              })
            }
          >
            <ShareIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Share</TooltipContent>
      </Tooltip>

      <ReactionsPopover entryId={entry._id} />
    </div>
  );
} 