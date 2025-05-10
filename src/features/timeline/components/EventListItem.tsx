'use client';

import { TimelineEntry } from '../types/TimelineEntry';
import { MdCheck, MdTranslate, MdOutlineInsertPhoto, MdOutlineHeadphones, MdSearch } from 'react-icons/md';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EventListItemProps {
  entry: TimelineEntry;
}

/**
 * EventListItem component renders a single timeline entry
 * Displays event metadata, content, and interactive buttons
 * Uses the creation timestamp from MongoDB ObjectId
 */
export function EventListItem({ entry }: EventListItemProps) {
  return (
    <Card className="group relative shadow-none border-none bg-transparent">
      <div className="flex">
        {/* Timeline visual element */}
        <div className="relative flex flex-col items-center mr-2">
          <div className="absolute w-0.5 bg-muted-foreground/20 top-13 bottom-0 z-0"></div>
          <div className="z-10 h-6 w-6 rounded-full bg-accent-blue flex items-center justify-center">
            <MdCheck className="h-3 w-3 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <CardHeader className="pb-0 px-2">
            {/* Event metadata: creation date, time and location */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs md:text-sm">
                {entry.creationDate} {entry.creationTime}
              </Badge>
              <Badge variant="outline" className="text-sm">{entry.location}</Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-2 md:pt-3 lg:pt-4 px-2">
            {/* Event content */}
            <div>
              <h3 className="text-lg md:text-xl lg:text-2xl mb-2 md:mb-3">{entry.headline}</h3>
              <p className="mb-3 md:mb-4 text-sm md:text-base/relaxed">{entry.content}</p>
            </div>
          </CardContent>

          <CardFooter className="pt-0 px-2">
            {/* Interactive action buttons for the event */}
            <div className="flex items-center gap-1 md:gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto rounded-md">
                    <MdSearch className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Search
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto rounded-md">
                    <MdTranslate className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Translate
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto rounded-md">
                    <MdOutlineInsertPhoto className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  View
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto rounded-md">
                    <MdOutlineHeadphones className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Listen
                </TooltipContent>
              </Tooltip>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
