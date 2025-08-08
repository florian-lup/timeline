'use client';

import { memo } from 'react';

import { CopyButton } from '@/components/copy-to-clipbaord';
import { ReactionsPopover } from '@/components/emoji-reactions';
import { ShareButton } from '@/components/share-story';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ArticleData } from '@/types/article-data';
import { formatDate } from '@/utils/date-formatter';

import { ReadMore } from './read-more';
import { SourcesSheet } from './sources';

interface ListItemProps {
  entry: ArticleData;
}

export const ListItem = memo(function ListItem({ entry }: ListItemProps) {
  return (
    <div>
      {/* Event card */}
      <Card className="border-border/50 gap-3 border p-4 shadow-sm md:p-6">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm">
                {formatDate(entry.date)}
              </span>
              {entry.tag && (
                <div className="flex flex-wrap items-center gap-1">
                  {Array.isArray(entry.tag) ? (
                    entry.tag.map((tagLabel, index) => (
                      <Badge key={`${tagLabel}-${index}`} variant="secondary">
                        {tagLabel}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="destructive">
                      {entry.tag}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <SourcesSheet title={entry.headline} sources={entry.sources} />
              <ReadMore entry={entry} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div>
            <h3 className="mb-4 text-lg leading-tight font-semibold md:text-xl lg:text-2xl">
              {entry.headline}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
              {entry.summary}
            </p>
          </div>
        </CardContent>
        <CardFooter className="items-center justify-end p-0">
          <ReactionsPopover entryId={entry._id} />
          <ShareButton entry={entry} />
          <CopyButton entry={entry} />
        </CardFooter>
      </Card>
    </div>
  );
});
