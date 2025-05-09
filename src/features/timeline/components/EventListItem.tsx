'use client';

import { TimelineEntry } from '../types/TimelineEntry';
import { MdCheck, MdTranslate, MdOutlineInsertPhoto, MdOutlineHeadphones, MdSearch } from 'react-icons/md';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

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
    <div className="group relative">
      {/* Event metadata: creation date, time and location */}
      <div className="mb-2 md:mb-3 lg:mb-4 flex items-center">
        <MdCheck className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1.5 md:mr-2" />
        <time className="text-xs md:text-sm font-bold">
          {entry.creationDate} <span className="font-normal ml-0.5 md:ml-1">{entry.creationTime}</span>
          <span className="font-normal ml-1 md:ml-2"> {entry.location}</span>
        </time>
      </div>

      {/* Event content with visual timeline indicator (border-left) */}
      <div className="ml-0.5 md:ml-1 px-3 md:px-4 lg:px-5 border-l">
        <div>
          <h3 className="text-lg md:text-xl lg:text-2xl mb-2 md:mb-3">{entry.title}</h3>
          <p className="mb-3 md:mb-4 text-sm md:text-base/relaxed">{entry.content}</p>

          {/* Interactive action buttons for the event */}
          <div className="flex items-center gap-1 md:gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1.5 md:p-2 cursor-pointer rounded-full">
                  <MdSearch className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                Search
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1.5 md:p-2 cursor-pointer rounded-full">
                  <MdOutlineInsertPhoto className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                View
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1.5 md:p-2 cursor-pointer rounded-full">
                  <MdOutlineHeadphones className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                Listen
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1.5 md:p-2 cursor-pointer rounded-full">
                  <MdTranslate className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                Translate
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
