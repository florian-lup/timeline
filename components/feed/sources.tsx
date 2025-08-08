'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { LinkIcon } from 'lucide-react';
import { memo } from 'react';

import { FaviconDisplay } from '@/components/favicon-display';
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
import { toSafeHttpUrl } from '@/utils/safe-url';
import { formatUrlForDisplay } from '@/utils/url-formatter';

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
export const SourcesSheet = memo(function SourcesSheet({
  title,
  sources,
}: SourcesSheetProps) {
  if (!sources.length) return null;

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="secondary" size="sm">
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
            {sources.map((source, index) => {
              const { displayText, fullUrl } = formatUrlForDisplay(source);
              const safeUrl = toSafeHttpUrl(fullUrl);
              return (
                <li
                  key={index}
                  className="hover:bg-muted flex items-center gap-2 rounded p-2"
                >
                  <FaviconDisplay url={source} size={14} />
                  {safeUrl ? (
                    <a
                      href={safeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm break-all hover:underline"
                    >
                      {displayText}
                    </a>
                  ) : (
                    <span className="text-sm break-all">{displayText}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
});
