'use client';

import { ArticlesData } from '@/types/events/articles';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface ReportDrawerProps {
  entry: ArticlesData;
}

export function ReportDrawer({ entry }: ReportDrawerProps) {
  return (
    <Drawer>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto">
              <FileText className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">Read</TooltipContent>
      </Tooltip>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{entry.title}</DrawerTitle>
          <DrawerDescription>Full report</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
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
      </DrawerContent>
    </Drawer>
  );
}
