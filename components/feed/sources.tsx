'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { LinkIcon } from 'lucide-react';

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
import { extractDomain } from '@/utils/url-formatter';

interface SourcesSheetProps {
  /**
   * Title of the event the sources belong to (used for the dialog header)
   */
  title: string;
  /**
   * An array of source URLs
   */
  sources: string[];
}

/**
 * Renders a small badge that, when clicked, opens a dialog containing
 * all the sources for a given story.
 */
export function SourcesSheet({ title, sources }: SourcesSheetProps) {
  // If we have no sources, render nothing.
  if (!sources.length) return null;

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <LinkIcon className="size-3.5" />
              {sources.length}
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent sideOffset={4}>Sources</TooltipContent>
      </Tooltip>

      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader>
          <VisuallyHidden.Root>
            <SheetTitle>{title}</SheetTitle>
          </VisuallyHidden.Root>

          <SheetDescription>Sources</SheetDescription>
        </SheetHeader>
        <div className="p-2">
          <ul>
            {sources.map((source, index) => (
              <li
                key={index}
                className="hover:bg-muted flex items-center gap-2 rounded p-2"
              >
                <LinkIcon className="text-muted-foreground size-3" />
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm break-all hover:underline"
                >
                  {extractDomain(source)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
