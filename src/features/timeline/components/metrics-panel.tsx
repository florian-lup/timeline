import React from 'react';
import { MdVisibility, MdHistory, MdLocationOn, MdCalendarToday } from 'react-icons/md';
import { Tooltip } from '../../../ui/tooltip';

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
        <Tooltip content="Worldwide" position="top" align="start">
          <div className="flex items-center gap-1.5">
            <div className="text-muted-foreground"><MdLocationOn size={18} /></div>
          </div>
        </Tooltip>
        {title && <h3 className="text-base font-medium">{title}</h3>}
        <Tooltip content={formattedDate} position="top" align="start">
          <div className="flex items-center gap-1.5">
            <div className="text-muted-foreground"><MdCalendarToday size={18} /></div>
          </div>
        </Tooltip>
        <div className="flex-1"></div>
        <Tooltip content="Total Timeline Views" position="top" align="end">
          <div className="flex items-center gap-1.5">
            <div className="text-muted-foreground"><MdVisibility size={18} /></div>
            <div className="text-sm font-medium">{typeof views === 'number' ? views.toLocaleString() : views}</div>
          </div>
        </Tooltip>
        <Tooltip content="Total Timeline Entries" position="top" align="end">
          <div className="flex items-center gap-1.5">
            <div className="text-muted-foreground"><MdHistory size={18} /></div>
            <div className="text-sm font-medium">{typeof entries === 'number' ? entries.toLocaleString() : entries}</div>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}