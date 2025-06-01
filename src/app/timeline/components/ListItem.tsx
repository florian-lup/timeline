'use client';

import { memo } from 'react';
import { ArticlesData } from '@/types/events/articles';
import { Check, MessageSquareMore } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { formatEventDate } from '@/utils/dateFormatters';
import { SourcesSheet } from './event/SourcesSheet';
import { ReportSheet } from './event/ReportSheet';
import { ReactionsPopover } from './event/ReactionsPopover';
import { ShareButton } from './event/ShareButton';

interface EventListItemProps {
  entry: ArticlesData;
}

/**
 * Component for event interaction buttons
 */
const EventActions = memo(function EventActions({ entry }: { entry: ArticlesData }) {
  return (
    <div className="flex items-center gap-2">
      <ReportSheet entry={entry} />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto">
            <MessageSquareMore className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Coming soon</TooltipContent>
      </Tooltip>

      <ShareButton entry={entry} />

      <ReactionsPopover entryId={entry._id} />
    </div>
  );
});

/**
 * Single timeline entry with metadata, content and interactive elements
 */
export const EventListItem = memo(function EventListItem({ entry }: EventListItemProps) {
  return (
    // Each timeline entry is now a simple div container
    <div className="my-10">
      {/* Event card */}
      <Card className="group bg-background/50 shadow-sm border border-border/50 hover:border-border hover:shadow-md transition-all duration-200 gap-3 p-4 md:p-6">
        <CardHeader className="px-2">
          {/* Event metadata: creation date with checkmark */}
          <div className="flex items-center gap-4">
            <span className="text-sm">{formatEventDate(entry.date)}</span>
            <SourcesSheet title={entry.title} sources={entry.sources} />
            {/* Timeline bullet with checkmark */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="h-6 w-6 rounded-full bg-accent-blue hover:bg-accent-blue flex items-center justify-center cursor-default p-0">
                  <Check className="h-3 w-3 text-white" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top">Verified</TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>

        <CardContent className="px-2">
          {/* Event content */}
          <div>
            <h3 className="text-lg md:text-xl lg:text-2xl mb-2 md:mb-3">{entry.title}</h3>
            <p className="mb-2 md:mb-3 text-sm md:text-base/relaxed">{entry.summary}</p>
          </div>
        </CardContent>

        <CardFooter className="pt-0 px-0">
          {/* Interactive action buttons for the event */}
          <EventActions entry={entry} />
        </CardFooter>
      </Card>
    </div>
  );
});
