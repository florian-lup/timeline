'use client';

import { Badge } from '@/components/ui/badge';
import { Link as LinkIcon } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface SourcesSheetProps {
  /**
   * Title of the event the sources belong to (used for the dialog header)
   */
  title: string;
  /**
   * An array of source URLs
   */
  sources?: string[];
}

/**
 * Renders a small badge that, when clicked, opens a dialog containing
 * all the sources for a given timeline event.
 */
export function SourcesSheet({ title, sources }: SourcesSheetProps) {
  // If we have no sources, render nothing.
  if (!sources || sources.length === 0) return null;

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* Use the sheet trigger to open the panel */}
          <SheetTrigger asChild>
            <Badge
              variant="outline"
              className="cursor-pointer text-xs md:text-sm font-medium px-2 py-1"
            >
              Sources ({sources.length})
            </Badge>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">View sources</TooltipContent>
      </Tooltip>

      <SheetContent side="right" className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-xl bg-card">
        <SheetHeader className="text-left">
          <SheetTitle className="mt-4">{title}</SheetTitle>
          <SheetDescription>Sources</SheetDescription>
        </SheetHeader>
        <div className="p-2 overflow-y-auto">
          <ul className="space-y-2">
            {sources.map((source, index) => (
              <li
                key={index}
                className="flex items-start gap-2 rounded p-2 hover:bg-muted transition-colors"
              >
                <LinkIcon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm break-all max-w-full hover:underline hover:text-primary underline-offset-2"
                >
                  {source}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
