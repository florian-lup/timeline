'use client';

import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Link as LinkIcon } from 'lucide-react';
import { extractDomain, formatUrl } from '@/utils/timeline/urlHelpers';

interface SourcesSheetProps {
  title: string;
  sources: string[] | undefined;
}

/**
 * Component for displaying sources and citations
 */
export function SourcesSheet({ title, sources }: SourcesSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Badge
          variant="outline"
          className="cursor-pointer hover:bg-accent/50"
        >
          {sources?.length || 0} Sources
        </Badge>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Sources & Citations</SheetTitle>
          <SheetDescription>References for &ldquo;{title}&rdquo;</SheetDescription>
        </SheetHeader>
        <div className="p-4">
          {sources && sources.length > 0 ? (
            <ul className="space-y-4">
              {sources.map((source, index) => {
                const domain = extractDomain(source);
                const cleanUrl = formatUrl(source);

                return (
                  <li key={index} className="text-sm">
                    <a
                      href={cleanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col text-foreground hover:bg-accent p-2 rounded-md transition-colors"
                    >
                      <div className="flex items-center mb-1">
                        <span className="bg-foreground/90 text-background h-6 w-6 rounded-full flex items-center justify-center mr-2">
                          <LinkIcon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs text-muted-foreground">{domain}</span>
                      </div>
                      <span className="text-sm break-words mt-1">{cleanUrl}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No sources available.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 