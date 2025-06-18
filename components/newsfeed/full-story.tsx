'use client';

import { Newspaper } from 'lucide-react';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
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
import type { StoryData } from '@/types/story';
import { formatDate } from '@/utils/date-formatter';

interface FullStoryProps {
  entry: StoryData;
}

export function FullStory({ entry }: FullStoryProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default" size="sm" className="leading-none">
          <Newspaper />
          Read More
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full max-w-2xl overflow-y-auto md:max-w-3xl">
        <SheetHeader>
          <VisuallyHidden.Root>
            <SheetTitle>Read More</SheetTitle>
          </VisuallyHidden.Root>
          <SheetDescription>{formatDate(entry.date)}</SheetDescription>
        </SheetHeader>

        <div className="p-4">
          {entry.research && (
            <div className="prose prose-sm text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted max-w-none">
              <ReactMarkdown>{entry.research}</ReactMarkdown>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
