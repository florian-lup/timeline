'use client';

import { Check, Copy } from 'lucide-react';
import { memo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ArticleData } from '@/types/article-data';

interface CopyButtonProps {
  entry: ArticleData;
  mode?: 'summary' | 'full';
}

/**
 * Button component for copying event information to clipboard
 */
export const CopyButton = memo(function CopyButton({
  entry,
  mode = 'summary',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy =
        mode === 'full'
          ? `${entry.headline}\n\n${entry.summary}\n\nStory:\n${entry.story}`
          : `${entry.headline}\n\n${entry.summary}`;
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
