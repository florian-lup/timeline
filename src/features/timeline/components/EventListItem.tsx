'use client';

import { TimelineEntry } from '../types/TimelineEntry';
import { MdCheck, MdTranslate, MdOutlineInsertPhoto, MdOutlineHeadphones, MdSearch } from 'react-icons/md';
import { Tooltip } from '../../../ui/tooltip';

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
        <MdCheck className="h-3.5 w-3.5 text-foreground mr-2" />
        <time className="text-sm font-bold text-foreground/70">
          {entry.creationDate} <span className="font-normal ml-1">{entry.creationTime}</span>
          <span className="font-normal ml-2 text-foreground/60"> {entry.location}</span>
        </time>
      </div>

      {/* Event content with visual timeline indicator (border-left) */}
      <div className="ml-1 px-5 border-l border-foreground ">
        <div>
          <h3 className="text-xl mb-3">{entry.title}</h3>
          <p className="text-foreground/70 mb-4 text-base/relaxed">{entry.content}</p>

          {/* Interactive action buttons for the event */}
          <div className="flex items-center gap-2">
            {/* Hide tooltips on mobile as they'll have actions on click */}
            <Tooltip content="Search" position="top" className="hidden lg:block">
              <button className="p-2 cursor-pointer hover:bg-[var(--background-secondary)] rounded-full">
                <MdSearch className="h-4 w-4 text-foreground/70" />
              </button>
            </Tooltip>
            <Tooltip content="View" position="top" className="hidden lg:block">
              <button className="p-2 cursor-pointer hover:bg-[var(--background-secondary)] rounded-full">
                <MdOutlineInsertPhoto className="h-4 w-4 text-foreground/70" />
              </button>
            </Tooltip>
            <Tooltip content="Listen" position="top" className="hidden lg:block">
              <button className="p-2 cursor-pointer hover:bg-[var(--background-secondary)] rounded-full">
                <MdOutlineHeadphones className="h-4 w-4 text-foreground/70" />
              </button>
            </Tooltip>
            <Tooltip content="Translate" position="top" className="hidden lg:block">
              <button className="p-2 cursor-pointer hover:bg-[var(--background-secondary)] rounded-full">
                <MdTranslate className="h-4 w-4 text-foreground/70" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
