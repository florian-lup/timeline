'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Newspaper } from 'lucide-react';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import type { StoryData } from '@/types/story';
import { formatDate } from '@/utils/date-formatter';

interface ReadMoreProps {
  entry: StoryData;
}

export const ReadMore = memo(function ReadMore({ entry }: ReadMoreProps) {
  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Newspaper className="size-3.5" />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent sideOffset={4}>Read More</TooltipContent>
      </Tooltip>

      <SheetContent
        side="left"
        className="flex w-full flex-col overflow-y-auto sm:max-w-md lg:max-w-lg"
      >
        <SheetHeader>
          <VisuallyHidden.Root>
            <SheetTitle>Read More</SheetTitle>
          </VisuallyHidden.Root>
          <SheetDescription>{formatDate(entry.date)}</SheetDescription>
        </SheetHeader>

        <div className="p-4">
          <div className="prose prose-sm text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-pre:bg-muted max-w-none">
            <ReactMarkdown>{entry.research}</ReactMarkdown>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});
