'use client';

import { Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useState } from 'react';
import { useSessionReaction } from '@/hooks/reactions/useSessionReaction';

interface ReactionsPopoverProps {
  entryId: string;
}

export function ReactionsPopover({ entryId }: ReactionsPopoverProps) {
  // State for reactions popover
  const [reactionsOpen, setReactionsOpen] = useState(false);

  // Available emoji reactions (display purposes only, all aggregated)
  const emojis = ['👍', '❤️', '😂', '😠', '😮', '😢'];

  // Session-based reaction state & handler
  const { hasReacted, react } = useSessionReaction(entryId);

  // Handle click on an emoji reaction
  const handleReactionClick = () => {
    react();
    setReactionsOpen(false);
  };

  return (
    <Popover open={reactionsOpen} onOpenChange={setReactionsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild disabled={hasReacted}>
            <Button
              variant="ghost"
              size="icon"
              className="p-1.5 md:p-2 h-auto w-auto relative"
              disabled={hasReacted}
            >
              <Smile className="h-3.5 w-3.5 md:h-4 md:w-4" />

              {/* Optional overlay tick/label when reacted */}
              {hasReacted && (
                <span className="absolute -right-0.5 -top-0.5 text-xs">✓</span>
              )}
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
  );
} 