import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export interface MetricItem {
  icon?: React.ReactNode;
  value: string | number;
  label?: string;
  tooltip?: React.ReactNode;
}

export interface MetricDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  metrics: MetricItem[];
  size?: 'xs' | 'sm' | 'default' | 'lg';
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
 * Displays metrics in a horizontal list with optional tooltips
 */
function MetricDisplay({
  className,
  metrics,
  size = 'default',
  compact = false,
  ...props
}: MetricDisplayProps) {
  const sizeStyles = {
    xs: 'h-7 text-xs gap-1 px-2',
    sm: 'h-8 text-xs gap-1.5 px-3',
    default: 'h-9 text-sm gap-1 px-4',
    lg: 'h-10 text-base gap-2 px-6',
  };

  const formatValue = (value: string | number) => {
    if (typeof value === 'number') {
      return compact ? formatCompactNumber(value) : value.toLocaleString();
    }
    return value;
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-medium whitespace-nowrap transition-all [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
        'bg-transparent',
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {metrics.map((metric, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="mx-1.5 text-muted-foreground/60">|</span>}
          {metric.tooltip ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-pointer">
                  {metric.icon && <span className="text-foreground">{metric.icon}</span>}
                  <span className="font-semibold text-foreground">{formatValue(metric.value)}</span>
                  {metric.label && (
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                {metric.tooltip}
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-1">
              {metric.icon && <span className="text-foreground">{metric.icon}</span>}
              <span className="font-semibold text-foreground">{formatValue(metric.value)}</span>
              {metric.label && (
                <span className="text-xs text-muted-foreground">{metric.label}</span>
              )}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export { MetricDisplay };
