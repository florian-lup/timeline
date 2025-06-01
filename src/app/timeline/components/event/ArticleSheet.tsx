'use client';

import { ArticlesData } from '@/types/events/articles';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { formatEventDate } from '@/utils/dateFormatters';
import ReactMarkdown from 'react-markdown';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

interface ReportDialogProps {
  entry: ArticlesData;
}

export function ArticleSheet({ entry }: ReportDialogProps) {
  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-1.5 md:p-2 h-auto w-auto"
            >
              <FileText className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">Read</TooltipContent>
      </Tooltip>

      <SheetContent
        side="bottom"
        className="bg-background top-0 focus-visible:outline-none focus-visible:ring-0 ring-0 border-0"
      >
        <SheetHeader>
          <VisuallyHidden.Root>
            <SheetTitle>{entry.title}</SheetTitle>
          </VisuallyHidden.Root>
          <VisuallyHidden.Root>
            <SheetDescription>Article content for {entry.title}</SheetDescription>
          </VisuallyHidden.Root>
        </SheetHeader>

        <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto p-2 md:p-4 lg:p-6 space-y-6 md:space-y-8 overflow-y-auto scrollbar-hide">
          <Card className="shadow-none border-none">
            <CardContent className="space-y-4 md:space-y-6">
              <span className="text-sm text-muted-foreground">{formatEventDate(entry.date)}</span>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
                {entry.title}
              </h1>

              <p className="text-base md:text-lg/relaxed">{entry.summary}</p>

              {entry.research ? (
                <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      a: ({ ...props }) => (
                        <a target="_blank" rel="noopener noreferrer" {...props} />
                      ),
                    }}
                  >
                    {entry.research}
                  </ReactMarkdown>
                </article>
              ) : (
                <p className="text-muted-foreground text-sm">No additional content available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
