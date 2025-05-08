import React from 'react';
import { MdVisibility, MdHistory } from 'react-icons/md';
import { Tooltip } from '../../../ui/tooltip';

interface TimelineHeaderProps {
  views?: number;
  entries?: number;
  title?: string;
  className?: string;
}

export function TimelineHeader({ 
  views = 0, 
  entries = 0, 
  title, 
  className = '' 
}: TimelineHeaderProps) {
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-card rounded-lg p-3 shadow-sm border border-border ${className}`}>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="text-sm font-medium">Worldwide</div>
        {title && <h3 className="text-base font-medium">{title}</h3>}
        <div className="text-sm font-medium">{getCurrentDate()}</div>
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