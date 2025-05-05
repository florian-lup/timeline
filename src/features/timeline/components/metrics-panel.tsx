import React from 'react';
import { FaEye, FaListAlt } from 'react-icons/fa';

interface MetricProps {
  value: string | number;
  icon: React.ReactNode;
}

const Metric = ({ value, icon }: MetricProps) => (
  <div className="flex items-center gap-1.5">
    <div className="text-muted-foreground">{icon}</div>
    <div className="text-sm font-medium">{value}</div>
  </div>
);

interface MetricsPanelProps {
  views?: number;
  entries?: number;
  title?: string;
  className?: string;
}

export function MetricsPanel({ 
  views = 0, 
  entries = 0, 
  title, 
  className = '' 
}: MetricsPanelProps) {
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className={`bg-card rounded-lg p-3 shadow-sm border border-border ${className}`}>
      <div className="flex items-center gap-4 flex-wrap">
        {title && <h3 className="text-base font-medium">{title}</h3>}
        <div className="text-sm text-muted-foreground">{formattedDate}</div>
        <div className="flex-1"></div>
        <Metric icon={<FaEye size={16} />} value={typeof views === 'number' ? views.toLocaleString() : views} />
        <Metric icon={<FaListAlt size={16} />} value={typeof entries === 'number' ? entries.toLocaleString() : entries} />
      </div>
    </div>
  );
} 