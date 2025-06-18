'use client';

import { Smile } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useSessionTracking } from '@/hooks/useSessionTracking';

interface ReactionsPopoverProps {
  entryId: string;
}

export function ReactionsPopover({ entryId }: ReactionsPopoverProps) {
  // State for reactions popover
  const [reactionsOpen, setReactionsOpen] = useState(false);

  // Track if component has mounted to prevent hydration mismatch
  const [hasMounted, setHasMounted] = useState(false);

  // Available emoji reactions (display purposes only, all aggregated)
  const emojis = ['👍', '❤️', '😂', '😠', '😮', '😢'];

  // Session-based reaction state & handler
  const { hasTracked: hasReacted, track: react } = useSessionTracking(entryId, {
    storageKey: 'reactedEvents',
    type: 'list',
  });

  // Only show reacted state after hydration to prevent mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Handle click on an emoji reaction
  const handleReactionClick = () => {
    react();
    setReactionsOpen(false);
  };

  // Use mounted state to determine if we should show reacted state
  const showReactedState = hasMounted && hasReacted;

  return (
    <Popover open={reactionsOpen} onOpenChange={setReactionsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild disabled={showReactedState}>
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              disabled={showReactedState}
            >
              <Smile />

              {/* Optional overlay tick/label when reacted - only show after mount */}
              {showReactedState && (
                <span className="absolute -top-0.5 -right-0.5">✓</span>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">Reactions</TooltipContent>
      </Tooltip>

      <PopoverContent className="w-fit max-w-[95vw] p-2" align="end" side="top">
        <div className="grid grid-cols-6 gap-2">
          {emojis.map(emoji => (
            <button
              key={emoji}
              onClick={handleReactionClick}
              className="text-xl transition-transform hover:scale-110"
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
