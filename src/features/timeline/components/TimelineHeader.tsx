import React from 'react';
import { MdVisibility, MdHistory } from 'react-icons/md';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MetricDisplay } from '@/features/timeline/components/ui/MetricDisplay';

interface TimelineHeaderProps {
  views?: number;
  entries?: number;
  title?: string;
}

export function TimelineHeader({ 
  views = 0, 
  entries = 0, 
  title, 
}: TimelineHeaderProps) {
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="p-0">
      <CardContent className="p-2">
        <div className="flex flex-row flex-wrap items-center gap-2 md:gap-4 lg:gap-6">
          <Badge variant="secondary" className="text-xs md:text-sm">Worldwide</Badge>
          {title && <h3 className="text-sm md:text-base lg:text-lg font-medium">{title}</h3>}
          <Badge variant="outline" className="text-xs md:text-sm">{getCurrentDate()}</Badge>
          <div className="hidden md:block flex-1"></div>
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4 ml-auto">
            <MetricDisplay 
              metrics={[
                {
                  icon: <MdVisibility className="h-4 w-4" />,
                  value: views,
                  tooltip: (
                    <div className="flex items-center gap-2">
                      <span>Total Timeline Views: {views.toLocaleString()}</span>
                    </div>
                  )
                },
                {
                  icon: <MdHistory className="h-4 w-4" />,
                  value: entries,
                  tooltip: (
                    <div className="flex items-center gap-2">
                      <span>Total Timeline Entries: {entries.toLocaleString()}</span>
                    </div>
                  )
                }
              ]}
              variant="outline"
              size="sm"
              compact={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}