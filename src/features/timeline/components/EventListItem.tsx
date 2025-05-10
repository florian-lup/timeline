'use client';

import { TimelineEntry } from '../types/TimelineEntry';
import { MdCheck, MdTranslate, MdOutlineInsertPhoto, MdOutlineHeadphones, MdSearch } from 'react-icons/md';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
    <Card className="group relative">
      <CardHeader className="pb-0">
        {/* Event metadata: creation date, time and location */}
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 bg-primary text-primary-foreground">
            <AvatarFallback>
              <MdCheck className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          <time className="text-xs md:text-sm font-bold">
            {entry.creationDate} <span className="font-normal ml-0.5 md:ml-1">{entry.creationTime}</span>
          </time>
          <Badge variant="outline" className="text-xs">{entry.location}</Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-2 md:pt-3 lg:pt-4">
        {/* Event content with visual timeline indicator */}
        <div className="ml-0.5 md:ml-1 px-3 md:px-4 lg:px-5 border-l">
          <div>
            <h3 className="text-lg md:text-xl lg:text-2xl mb-2 md:mb-3">{entry.title}</h3>
            <p className="mb-3 md:mb-4 text-sm md:text-base/relaxed">{entry.content}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pl-8 md:pl-9 lg:pl-10 pt-0">
        {/* Interactive action buttons for the event */}
        <div className="flex items-center gap-1 md:gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto rounded-full">
                <MdSearch className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Search
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto rounded-full">
                <MdOutlineInsertPhoto className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              View
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto rounded-full">
                <MdOutlineHeadphones className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Listen
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto rounded-full">
                <MdTranslate className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Translate
            </TooltipContent>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );
}
