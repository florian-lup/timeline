'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { LinkIcon } from 'lucide-react';
import { memo } from 'react';

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
  TooltipProvider,
} from '@/components/ui/tooltip';

interface ChatSourcesProps {
  /**
   * An array of source URLs
   */
  sources: string[];
  /**
   * The timestamp of the message for the sheet title
   */
  timestamp: Date;
}

/**
 * Renders a small sources button for chat messages that opens a sheet
 * containing all the sources used to generate the response.
 */
export const ChatSources = memo(function ChatSources({
  sources,
  timestamp,
}: ChatSourcesProps) {
  if (sources.length === 0) return null;

  return (
    <TooltipProvider>
      <Sheet>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <LinkIcon className="mr-1 h-3 w-3" />
                {sources.length} source{sources.length > 1 ? 's' : ''}
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">View sources</TooltipContent>
        </Tooltip>

        <SheetContent side="right" className="overflow-y-auto">
          <SheetHeader>
            <VisuallyHidden.Root>
              <SheetTitle>
                Sources for {timestamp.toLocaleTimeString()}
              </SheetTitle>
            </VisuallyHidden.Root>
            <SheetDescription>
              Sources used to generate this response
            </SheetDescription>
          </SheetHeader>
          <div className="p-2">
            <ul className="space-y-2">
              {sources.map((source, index) => (
                <li key={index} className="hover:bg-muted rounded border p-3">
                  <a
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm hover:underline"
                  >
                    <div className="text-primary font-medium">
                      Source {index + 1}
                    </div>
                    <div className="text-muted-foreground mt-1 break-all">
                      {source}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
});
