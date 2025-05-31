'use client';

import { ArticlesData } from '@/types/events/articles';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import ReactMarkdown from 'react-markdown';

interface ReportDialogProps {
  entry: ArticlesData;
}

export function ReportSheet({ entry }: ReportDialogProps) {
  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto">
              <FileText className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">Read</TooltipContent>
      </Tooltip>

      <SheetContent
        side="bottom"
        className="bg-card top-0 focus-visible:outline-none focus-visible:ring-0 ring-0 border-0"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="mt-6">{entry.title}</SheetTitle>
          <SheetDescription>Full report</SheetDescription>
        </SheetHeader>
        <div className="p-4 space-y-4 overflow-y-auto scrollbar-hide">
          {entry.research ? (
            <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  a: ({ ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
                }}
              >
                {entry.research}
              </ReactMarkdown>
            </article>
          ) : (
            <p className="text-muted-foreground text-sm">No additional content available.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
