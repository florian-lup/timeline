'use client';

import { memo } from 'react';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import type { StoryData } from '@/types/story';
import { formatDate } from '@/utils/date-formatter';

import { FullStory } from './full-story';
import { SourcesSheet } from './sources';

interface StoryCardProps {
  entry: StoryData;
}

export const StoryCard = memo(function StoryCard({ entry }: StoryCardProps) {
  return (
    <div className="my-10">
      {/* Event card */}
      <Card className="border-border/50 gap-3 border p-4 shadow-sm md:p-6">
        <CardHeader className="p-0">
          {/* Event metadata: creation date with checkmark */}
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">
              {formatDate(entry.date)}
            </span>
            <SourcesSheet title={entry.title} sources={entry.sources ?? []} />
            <FullStory entry={entry} />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Event content */}
          <div>
            <h3 className="mb-4 text-lg leading-tight font-semibold md:text-xl lg:text-2xl">
              {entry.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
              {entry.summary}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
