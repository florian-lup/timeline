'use client';

import { ArticlesData } from '@/types/events/articles';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface ReportDialogProps {
  entry: ArticlesData;
}

export function ReportDialog({ entry }: ReportDialogProps) {
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto">
              <FileText className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">Read</TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{entry.title}</DialogTitle>
          <DialogDescription>Full report</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 overflow-y-auto max-h-[60vh]">
          {entry.research ? (
            <MarkdownRenderer
              content={entry.research}
              className="prose prose-sm md:prose-base dark:prose-invert max-w-none"
            />
          ) : (
            <p className="text-muted-foreground text-sm">
              No additional content available.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
