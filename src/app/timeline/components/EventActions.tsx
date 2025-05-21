'use client';

import { ArticlesData } from '@/types/events/articles';
import { Languages, Search, FileText, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { trackReaction } from '@/services/analytics/reactionTracking';
import { useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface EventActionsProps {
  entry: ArticlesData;
}

/**
 * Component for event interaction buttons
 */
export function EventActions({ entry }: EventActionsProps) {
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
    <div className="flex items-center gap-1 md:gap-2">
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
            <DrawerDescription>Full research</DrawerDescription>
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
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto">
            <Search className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Search</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="p-1.5 md:p-2 h-auto w-auto">
            <Languages className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Translate</TooltipContent>
      </Tooltip>
      <Popover open={reactionsOpen} onOpenChange={setReactionsOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="p-1.5 md:p-2 h-auto w-auto relative"
              >
                <Smile className="h-3.5 w-3.5 md:h-4 md:w-4" />
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
  );
} 