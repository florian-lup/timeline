import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

/**
 * Header with search functionality
 */
export function TimelineHeader() {
  return (
    <div className="flex items-center justify-center px-4 py-1 rounded-full bg-card border">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto">
            <Search className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Search Timeline</TooltipContent>
      </Tooltip>
    </div>
  );
}
