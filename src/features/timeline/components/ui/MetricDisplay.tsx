import * as React from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

export interface MetricItem {
  icon?: React.ReactNode
  value: string | number
  label?: string
  tooltip?: React.ReactNode
}

export interface MetricDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  metrics: MetricItem[]
  variant?: "outline" | "default" | "secondary" | "primary"
  size?: "xs" | "sm" | "default" | "lg"
  compact?: boolean
}

// Format numbers to compact form (e.g., 1200 -> 1.2k, 1500000 -> 1.5M)
function formatCompactNumber(value: number): string {
  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  });
  return formatter.format(value);
}

function MetricDisplay({
  className,
  metrics,
  variant = "outline",
  size = "default",
  compact = false,
  ...props
}: MetricDisplayProps) {
  const variantStyles = {
    outline: "border bg-background hover:bg-accent/50 transition-colors",
    default: "bg-transparent text-muted-foreground shadow-none",
    secondary: "bg-secondary text-secondary-foreground",
    primary: "bg-primary text-primary-foreground",
  }

  const sizeStyles = {
    xs: "h-7 text-xs gap-1 px-2",
    sm: "h-8 text-xs gap-1.5 px-2.5",
    default: "h-9 text-sm gap-2 px-3",
    lg: "h-10 text-base gap-3 px-4",
  }

  const formatValue = (value: string | number) => {
    if (typeof value === "number") {
      return compact ? formatCompactNumber(value) : value.toLocaleString();
    }
    return value;
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md shadow-sm font-medium whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {metrics.map((metric, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="mx-1.5 text-muted-foreground/60">|</span>
          )}
          {metric.tooltip ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-pointer">
                  {metric.icon && <span className="flex-shrink-0">{metric.icon}</span>}
                  <span>{formatValue(metric.value)}</span>
                  {metric.label && <span className="text-xs text-muted-foreground">{metric.label}</span>}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                {metric.tooltip}
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-1">
              {metric.icon && <span className="flex-shrink-0">{metric.icon}</span>}
              <span>{formatValue(metric.value)}</span>
              {metric.label && <span className="text-xs text-muted-foreground">{metric.label}</span>}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export { MetricDisplay } 