import React from 'react';
import { MdVisibility, MdHistoryEdu, MdRefresh, MdShare } from 'react-icons/md';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MetricDisplay } from '@/features/timeline/components/ui/MetricDisplay';
import { shareContent } from '@/utils/shareHelper';
import { useSharesCount } from '@/features/analytics/hooks/useSharesCount';

interface TimelineHeaderProps {
  views: number;
  entries: number;
}

export function TimelineHeader({
  views,
  entries,
}: TimelineHeaderProps) {
  const { sharesCount } = useSharesCount();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleShare = () => {
    shareContent();
  };

  return (
    <Card className="p-0 rounded-full">
      <CardContent className="px-2">
        <div className="flex flex-row flex-wrap items-center gap-2 md:gap-4 lg:gap-6">
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={handleRefresh}
                  >
                    <MdRefresh />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reload Timeline</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={handleShare}
                  >
                    <MdShare />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Timeline</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="hidden md:block flex-1"></div>
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4 ml-auto">
            <MetricDisplay
              metrics={[
                {
                  icon: <MdVisibility />,
                  value: views,
                  tooltip: (
                    <div className="flex items-center gap-2">
                      <span>Total Timeline Views</span>
                    </div>
                  )
                },
                {
                  icon: <MdShare />,
                  value: sharesCount,
                  tooltip: (
                    <div className="flex items-center gap-2">
                      <span>Total Timeline Shares</span>
                    </div>
                  )
                },
                {
                  icon: <MdHistoryEdu />,
                  value: entries,
                  tooltip: (
                    <div className="flex items-center gap-2">
                      <span>Total Timeline Entries</span>
                    </div>
                  )
                }
              ]}
              compact={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}