'use client';

import { memo, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ArticlesData } from '@/types/events/articles';

interface CopyButtonProps {
  entry: ArticlesData;
  contentType?: 'summary' | 'research';
}

/**
 * Button component for copying event information to clipboard
 */
export const CopyButton = memo(function CopyButton({ entry, contentType = 'summary' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Determine what content to copy based on contentType
      let textToCopy: string;

      if (contentType === 'research' && entry.research) {
        // For article pages: copy title + research content
        textToCopy = `${entry.title}\n\n${entry.research}`;
      } else {
        // For timeline or fallback: copy title + summary
        textToCopy = `${entry.title}\n\n${entry.summary}`;
      }

      await navigator.clipboard.writeText(textToCopy);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="p-1.5 md:p-2 h-auto w-auto"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600" />
          ) : (
            <Copy className="h-3.5 w-3.5 md:h-4 md:w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        {copied ? 'Copied!' : contentType === 'research' ? 'Copy article' : 'Copy event'}
      </TooltipContent>
    </Tooltip>
  );
});
