'use client';

import { Link as LinkIcon } from 'lucide-react';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

import { Button } from '@/components/ui/button';
import { extractDomain } from '@/utils/url-formatter';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

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
 * all the sources for a given story.
 */
export function SourcesSheet({ title, sources }: SourcesSheetProps) {
  // If we have no sources, render nothing.
  if (!sources || sources.length === 0) return null;

  return (
    <Sheet>
      {/* Use the sheet trigger to open the panel */}
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="leading-none">
          {sources.length} Sources
        </Button>
      </SheetTrigger>

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
