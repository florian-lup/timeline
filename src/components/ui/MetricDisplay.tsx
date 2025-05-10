import * as React from "react"
import { cn } from "@/lib/utils"

export interface MetricDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  value: string | number
  label?: string
  variant?: "outline" | "default" | "secondary"
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
  icon,
  value,
  label,
  variant = "outline",
  size = "default",
  compact = false,
  ...props
}: MetricDisplayProps) {
  const variantStyles = {
    outline: "border bg-background hover:bg-accent/50 transition-colors",
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
  }
  
  const sizeStyles = {
    xs: "h-7 text-xs gap-1 px-2",
    sm: "h-8 text-xs gap-1.5 px-2.5",
    default: "h-9 text-sm gap-2 px-3",
    lg: "h-10 text-base gap-3 px-4",
  }

  const formattedValue = React.useMemo(() => {
    if (typeof value === "number") {
      return compact ? formatCompactNumber(value) : value.toLocaleString();
    }
    return value;
  }, [value, compact]);

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
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{formattedValue}</span>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  )
}

export { MetricDisplay } 