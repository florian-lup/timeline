'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Newspaper } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import type { StoryData } from '@/types/story';
import { formatDate } from '@/utils/date-formatter';

interface ReportDialogProps {
  entry: StoryData;
}

export function FullStory({ entry }: ReportDialogProps) {
  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="default" size="sm">
              <Newspaper />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">Read</TooltipContent>
      </Tooltip>

      <SheetContent side="bottom" className="bg-background top-0">
        <SheetHeader>
          <VisuallyHidden.Root>
            <SheetTitle>{entry.title}</SheetTitle>
          </VisuallyHidden.Root>
          <VisuallyHidden.Root>
            <SheetDescription>
              Article content for {entry.title}
            </SheetDescription>
          </VisuallyHidden.Root>
        </SheetHeader>

        <div className="scrollbar-hide mx-auto w-full max-w-xl space-y-6 overflow-y-auto p-2 md:max-w-2xl md:space-y-8 md:p-4 lg:max-w-3xl lg:p-6 xl:max-w-4xl">
          <Card className="border-none shadow-none">
            <CardContent className="space-y-4 md:space-y-6">
              <span className="text-muted-foreground text-sm">
                {formatDate(entry.date)}
              </span>

              <h1 className="text-2xl leading-snug font-bold md:text-3xl lg:text-4xl">
                {entry.title}
              </h1>

              <p className="text-base md:text-lg/relaxed">{entry.summary}</p>

              {entry.research !== undefined && (
                <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      a: ({ ...props }) => (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {entry.research}
                  </ReactMarkdown>
                </article>
              )}
              {entry.research === undefined && (
                <p className="text-muted-foreground text-sm">
                  No additional content available.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
