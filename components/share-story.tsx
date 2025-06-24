'use client';

import { Share } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ArticleData } from '@/types/article-data';

interface ShareButtonProps {
  entry: ArticleData;
}

export function ShareButton({ entry }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);

    // Generate the shareable link using the story ID
    const shareUrl = `${window.location.origin}/story/${entry._id}`;

    const shareData = {
      title: entry.title,
      url: shareUrl,
    };

    try {
      if ('share' in navigator && navigator.canShare(shareData)) {
        // Use native share API if available
        await navigator.share(shareData);
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        // User didn't cancel the share, there was an actual error
        console.error('Error sharing:', error);

        // Fallback: try to copy to clipboard
        try {
          await navigator.clipboard.writeText(shareUrl);
        } catch (clipboardError) {
          console.error('Failed to copy to clipboard:', clipboardError);
        }
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              void handleShare();
            }}
            disabled={isSharing}
          >
            <Share />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Share</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
