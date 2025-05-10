import React from 'react';
import { MdVisibility, MdEvent, MdRefresh } from 'react-icons/md';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MetricDisplay } from '@/features/timeline/components/ui/MetricDisplay';

interface TimelineHeaderProps {
  views?: number;
  entries?: number;
}

export function TimelineHeader({ 
  views = 0, 
  entries = 0, 
}: TimelineHeaderProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Card className="p-0">
      <CardContent className="p-2">
        <div className="flex flex-row flex-wrap items-center gap-2 md:gap-4 lg:gap-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="p-1"
                >
                  <MdRefresh className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reload Timeline</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="hidden md:block flex-1"></div>
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4 ml-auto">
            <MetricDisplay 
              metrics={[
                {
                  icon: <MdVisibility className="h-4 w-4" />,
                  value: views,
                  tooltip: (
                    <div className="flex items-center gap-2">
                      <span>Total Timeline Views</span>
                    </div>
                  )
                },
                {
                  icon: <MdEvent className="h-4 w-4" />,
                  value: entries,
                  tooltip: (
                    <div className="flex items-center gap-2">
                      <span>Total Timeline Entries</span>
                    </div>
                  )
                }
              ]}
              variant="secondary"
              size="default"
              compact={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}