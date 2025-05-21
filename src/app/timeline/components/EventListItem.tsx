'use client';

import { ArticlesData } from '@/types/events/articles';
import { Check } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { formatEventDate } from '@/utils/dateFormatters';
import { SourcesSheet } from './SourcesSheet';
import { EventActions } from './EventActions';

interface EventListItemProps {
  entry: ArticlesData;
}

/**
 * Single timeline entry with metadata, content and interactive elements
 */
export function EventListItem({ entry }: EventListItemProps) {
  return (
    // Each timeline entry is a list item. The parent <ol> owns the vertical rule (border-l).
    <li
      className="
        relative pl-8 my-16
        before:absolute before:left-0 before:top-1
        before:bottom-0 before:w-px
        before:bg-muted-foreground/20
        before:content-['']
      "
    >
      {/* Timeline bullet with checkmark */}
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="absolute -left-3 top-1 h-6 w-6 rounded-full bg-accent-blue flex items-center justify-center cursor-default">
            <Check className="h-3 w-3 text-white" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">Verified</TooltipContent>
      </Tooltip>

      {/* Event card */}
      <Card className="group bg-background shadow-none border-none gap-3 py-0">
        <CardHeader className="px-2">
          {/* Event metadata: creation date */}
          <div className="flex items-center gap-4">
            <span className="text-sm">{formatEventDate(entry.date)}</span>
            <SourcesSheet title={entry.title} sources={entry.sources} />
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
    </li>
  );
}
