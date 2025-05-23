import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, History, Share as ShareIcon, Smile } from 'lucide-react';
import { useMetrics } from '@/hooks/analytics/useMetrics';

interface TimelineMetricsProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
}

/**
 * Formats numbers in compact form (1200 → 1.2k)
 */
function formatCompactNumber(value: number): string {
  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  });
  return formatter.format(value);
}

/**
 * Displays timeline metrics in a horizontal list with tooltips
 * Fetches real-time metrics data from the API
 */
function TimelineMetrics({
  className,
  compact = false,
  ...props
}: TimelineMetricsProps) {
  // Fetch real metrics data
  const { views, shares, reactions, entries, loading } = useMetrics();

  const formatValue = (value: number) => {
    return compact ? formatCompactNumber(value) : value.toLocaleString();
  };

  const metricsData = [
    {
      icon: <Eye />,
      value: views,
      tooltip: "Total Timeline Views"
    },
    {
      icon: <ShareIcon />,
      value: shares,
      tooltip: "Total Timeline Shares"
    },
    {
      icon: <Smile />,
      value: reactions,
      tooltip: "Total Timeline Reactions"
    },
    {
      icon: <History />,
      value: entries,
      tooltip: "Total Timeline Entries"
    }
  ];

  // Show skeleton while loading
  if (loading) {
    return <TimelineMetricsSkeleton className={className} />;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center font-medium whitespace-nowrap",
        "bg-card/50 backdrop-blur-sm border border-border/50 rounded-full",
        "px-4 py-3 gap-4",
        "hover:bg-card/80 hover:border-border/80",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {metricsData.map((metric, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <div className="w-px h-4 bg-border/40" />
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer group transition-all">
                <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                  {metric.icon}
                </span>
                <span className="font-semibold text-foreground text-sm">
                  {formatValue(metric.value)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <span>{metric.tooltip}</span>
            </TooltipContent>
          </Tooltip>
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Loading skeleton for timeline metrics
 */
function TimelineMetricsSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center font-medium whitespace-nowrap",
        "bg-card/50 backdrop-blur-sm border border-border/50 rounded-full",
        "px-4 py-3 gap-4",
        className,
      )}
    >
      {Array.from({ length: 4 }, (_, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <div className="w-px h-4 bg-border/40" />
          )}
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-4 w-8" />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export { TimelineMetrics };
