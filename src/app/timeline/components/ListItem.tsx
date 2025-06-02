'use client';

import { memo } from 'react';
import { ArticlesData } from '@/types/events/articles';
import { Check } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { formatEventDate } from '@/utils/dateFormatters';
import { SourcesSheet } from './SourcesSheet';
import { ArticleSheet } from './ArticleSheet';
import { ReactionsPopover } from '@/components/actions/reactions';
import { ShareButton } from '@/components/actions/share';
import { CopyButton } from '@/components/actions/copy';
import { CommentsButton } from '@/components/actions/comments';

interface EventListItemProps {
  entry: ArticlesData;
}

/**
 * Component for event interaction buttons
 */
const EventActions = memo(function EventActions({ entry }: { entry: ArticlesData }) {
  return (
    <div className="flex items-center gap-2">
      <ArticleSheet entry={entry} />

      <ReactionsPopover entryId={entry._id} />

      <ShareButton entry={entry} />

      <CopyButton entry={entry} contentType="summary" />

      <CommentsButton entry={entry} />
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
      <Card className="group shadow-sm border border-border/50 hover:border-border hover:shadow-md transition-all duration-200 gap-3 p-4 md:p-6">
        <CardHeader className="px-2">
          {/* Event metadata: creation date with checkmark */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{formatEventDate(entry.date)}</span>
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
            <h3 className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 font-semibold leading-tight">{entry.title}</h3>
            <p className="mb-2 md:mb-3 text-sm md:text-base leading-relaxed text-muted-foreground">{entry.summary}</p>
          </div>
        </CardContent>

        <CardFooter className="pt-0 px-0 flex justify-end">
          {/* Interactive action buttons for the event */}
          <EventActions entry={entry} />
        </CardFooter>
      </Card>
    </div>
  );
});
