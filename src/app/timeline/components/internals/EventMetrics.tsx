import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Eye, History, Share as ShareIcon, Smile } from 'lucide-react';

interface TimelineMetricsProps extends React.HTMLAttributes<HTMLDivElement> {
  views: number;
  shares: number;
  reactions: number;
  entries: number;
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
 */
function TimelineMetrics({
  className,
  views,
  shares,
  reactions,
  entries,
  compact = false,
  ...props
}: TimelineMetricsProps) {
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
      icon: <History />,
      value: entries,
      tooltip: "Total Timeline Entries"
    },
    {
      icon: <Smile />,
      value: reactions,
      tooltip: "Total Timeline Reactions"
    }
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center font-medium whitespace-nowrap transition-all [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
        'bg-transparent',
        'h-9 text-sm gap-1 px-2',
        className,
      )}
      {...props}
    >
      {metricsData.map((metric, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="mx-1.5 text-muted-foreground/60">|</span>}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 cursor-pointer">
                <span className="text-foreground">{metric.icon}</span>
                <span className="font-semibold text-foreground">{formatValue(metric.value)}</span>
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

export { TimelineMetrics };
