import React from 'react';
import { MdVisibility, MdHistory } from 'react-icons/md';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface TimelineHeaderProps {
  views?: number;
  entries?: number;
  title?: string;
  className?: string;
}

export function TimelineHeader({ 
  views = 0, 
  entries = 0, 
  title, 
  className = '' 
}: TimelineHeaderProps) {
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`rounded-lg p-2 md:p-3 lg:p-4 shadow-sm border ${className}`}>
      <div className="flex flex-row flex-wrap items-center gap-2 md:gap-4 lg:gap-6">
        <div className="text-xs md:text-sm font-medium">Worldwide</div>
        {title && <h3 className="text-sm md:text-base lg:text-lg font-medium">{title}</h3>}
        <div className="text-xs md:text-sm font-medium">{getCurrentDate()}</div>
        <div className="hidden md:block flex-1"></div>
        <div className="flex items-center gap-2 md:gap-3 lg:gap-4 ml-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <div><MdVisibility size={16} className="md:w-[18px] md:h-[18px]" /></div>
                <div className="text-xs md:text-sm font-medium">{typeof views === 'number' ? views.toLocaleString() : views}</div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" align="end">
              Total Timeline Views
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <div><MdHistory size={16} className="md:w-[18px] md:h-[18px]" /></div>
                <div className="text-xs md:text-sm font-medium">{typeof entries === 'number' ? entries.toLocaleString() : entries}</div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" align="end">
              Total Timeline Entries
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}