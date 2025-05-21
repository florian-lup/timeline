import React from 'react';
import { Eye, History, RefreshCcw, Share as ShareIcon, Smile } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MetricDisplay } from './MetricDisplay';
import { shareContent } from '@/utils/shareHelper';
import { useSharesCount } from '@/hooks/analytics/useSharesCount';
import { useReactionsCount } from '@/hooks/analytics/useReactionsCount';

interface TimelineHeaderProps {
  views: number;
  entries: number;
}

/**
 * Header with analytics metrics and action buttons
 */
export function TimelineHeader({ views, entries }: TimelineHeaderProps) {
  const { sharesCount } = useSharesCount();
  const { reactionsCount } = useReactionsCount();

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
                  <Button variant="ghost" size="xs" onClick={handleRefresh}>
                    <RefreshCcw />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reload Timeline</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="xs" onClick={handleShare}>
                    <ShareIcon />
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
                  icon: <Eye />,
                  value: views,
                  tooltip: (
                    <div className="flex items-center gap-2">
                      <span>Total Timeline Views</span>
                    </div>
                  ),
                },
                {
                  icon: <ShareIcon />,
                  value: sharesCount,
                  tooltip: (
                    <div className="flex items-center gap-2">
                      <span>Total Timeline Shares</span>
                    </div>
                  ),
                },
                {
                  icon: <History />,
                  value: entries,
                  tooltip: (
                    <div className="flex items-center gap-2">
                      <span>Total Timeline Entries</span>
                    </div>
                  ),
                },
                {
                  icon: <Smile />,
                  value: reactionsCount,
                  tooltip: (
                    <div className="flex items-center gap-2">
                      <span>Total Timeline Reactions</span>
                    </div>
                  ),
                },
              ]}
              compact={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
