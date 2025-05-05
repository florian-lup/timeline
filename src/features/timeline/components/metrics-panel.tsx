import React from 'react';
import { MdVisibility, MdHistory } from 'react-icons/md';
import { Tooltip } from '../../../ui/tooltip';

interface MetricProps {
  value: string | number;
  icon: React.ReactNode;
  tooltip: string;
}

const Metric = ({ value, icon, tooltip }: MetricProps) => (
  <Tooltip content={tooltip} position="top">
    <div className="flex items-center gap-1.5">
      <div className="text-muted-foreground">{icon}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  </Tooltip>
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
        <Metric 
          icon={<MdVisibility size={18} />} 
          value={typeof views === 'number' ? views.toLocaleString() : views} 
          tooltip="Total Timeline Views"
        />
        <Metric 
          icon={<MdHistory size={18} />} 
          value={typeof entries === 'number' ? entries.toLocaleString() : entries} 
          tooltip="Total Timeline Entries"
        />
      </div>
    </div>
  );
}