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
      <div className="mb-4 flex items-center">
        <MdCheck className="h-3.5 w-3.5 mr-2" />
        <time className="text-sm font-bold">
          {entry.creationDate} <span className="font-normal ml-1">{entry.creationTime}</span>
          <span className="font-normal ml-2"> {entry.location}</span>
        </time>
      </div>

      {/* Event content with visual timeline indicator (border-left) */}
      <div className="ml-1 px-5 border-l">
        <div>
          <h3 className="text-xl mb-3">{entry.title}</h3>
          <p className="mb-4 text-base/relaxed">{entry.content}</p>

          {/* Interactive action buttons for the event */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 cursor-pointer rounded-full">
                  <MdSearch className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                Search
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 cursor-pointer rounded-full">
                  <MdOutlineInsertPhoto className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                View
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 cursor-pointer rounded-full">
                  <MdOutlineHeadphones className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                Listen
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 cursor-pointer rounded-full">
                  <MdTranslate className="h-4 w-4" />
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
