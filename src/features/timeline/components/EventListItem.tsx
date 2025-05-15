'use client';

import { TimelineEntry } from '../types/TimelineEntry';
import { MdCheck, MdTranslate, MdSearch, MdOutlineLink, MdOutlineArticle, MdInsertEmoticon } from 'react-icons/md';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/features/timeline/components/ui/sheet';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/features/timeline/components/ui/drawer';
import { extractDomain, formatUrl } from '../utils/urlHelpers';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { trackReaction } from '@/features/analytics/reactionTracking';
import { useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface EventListItemProps {
  entry: TimelineEntry;
}

/**
 * EventListItem component renders a single timeline entry
 * Displays event metadata, content, and interactive buttons
 * Uses the creation timestamp from MongoDB ObjectId
 */
export function EventListItem({ entry }: EventListItemProps) {

  // State for reactions popover
  const [reactionsOpen, setReactionsOpen] = useState(false);

  // Available emoji reactions (display purposes only, all aggregated)
  const emojis = ['👍', '❤️', '😂', '😠', '😮', '😢'];

  // Handle click on an emoji reaction
  const handleReactionClick = async () => {
    await trackReaction();
    setReactionsOpen(false);
  };

  return (
    // Each timeline entry is a list item. The parent <ol> owns the vertical rule (border-l).
    <li className="relative pl-6">
      {/* Event card */}
      <Card className="group bg-background shadow-none border-none gap-3">
        <CardHeader className="pb-0 px-2">
          {/* Event metadata: creation date */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="h-6 w-6 rounded-full bg-accent-blue flex items-center justify-center cursor-default">
                  <MdCheck className="h-3 w-3 text-white" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">Verified</TooltipContent>
            </Tooltip>
            <Badge variant="outline" className="text-sm border-transparent">
              {new Date(entry.date).toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Badge>
            <Sheet>
              <SheetTrigger asChild>
                <Badge variant="outline" className="text-sm cursor-pointer hover:bg-accent/50">
                  {entry.sources?.length || 0} Sources
                </Badge>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Sources & Citations</SheetTitle>
                  <SheetDescription>
                    References for &ldquo;{entry.title}&rdquo;
                  </SheetDescription>
                </SheetHeader>
                <div className="p-4">
                  {entry.sources && entry.sources.length > 0 ? (
                    <ul className="space-y-4">
                      {entry.sources.map((source, index) => {
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
                                  <MdOutlineLink className="h-3.5 w-3.5" />
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
          </div>
        </CardHeader>

        <CardContent className="px-2">
          {/* Event content */}
          <div>
            <h3 className="text-lg md:text-xl lg:text-2xl mb-2 md:mb-3">{entry.title}</h3>
            <p className="mb-3 md:mb-4 text-sm md:text-base/relaxed">{entry.summary}</p>
          </div>
        </CardContent>

        <CardFooter className="pt-0 px-2">
          {/* Interactive action buttons for the event */}
          <div className="flex items-center gap-1 md:gap-2">
            <Drawer>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DrawerTrigger asChild>
                    <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto">
                      <MdOutlineArticle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </Button>
                  </DrawerTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">Read</TooltipContent>
              </Tooltip>

              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>{entry.title}</DrawerTitle>
                  <DrawerDescription>Full content</DrawerDescription>
                </DrawerHeader>
                <div data-vaul-no-drag className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
                  {entry.content ? (
                    <MarkdownRenderer
                      content={entry.content}
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto">
                  <MdSearch className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Search</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto">
                  <MdTranslate className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Translate</TooltipContent>
            </Tooltip>
            <Popover open={reactionsOpen} onOpenChange={setReactionsOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto relative">
                      <MdInsertEmoticon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">React</TooltipContent>
              </Tooltip>

              <PopoverContent className="p-2 max-w-[95vw] w-fit" align="start">
                <div className="grid grid-cols-6 gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={handleReactionClick}
                      className="text-xl hover:scale-110 transition-transform cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardFooter>
      </Card>
    </li>
  );
}
