'use client';

import { Check, Copy } from 'lucide-react';
import { memo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { StoryData } from '@/types/story';

interface CopyButtonProps {
  entry: StoryData;
}

/**
 * Button component for copying event information to clipboard
 */
export const CopyButton = memo(function CopyButton({ entry }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy = `${entry.title}\n\n${entry.summary}`;
      await navigator.clipboard.writeText(textToCopy);

      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            void handleCopy();
          }}
        >
          {copied ? <Check className="text-accent-success" /> : <Copy />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{copied ? 'Copied!' : 'Copy'}</TooltipContent>
    </Tooltip>
  );
});
